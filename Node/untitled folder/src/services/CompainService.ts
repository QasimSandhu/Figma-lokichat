import User from "../models/User";
import Compains from "../models/Compain";
import Subscription from "../models/Subscription";
import mongoose from "mongoose";
import StripeAccounts from "../classes/StripeAccounts";
import Transaction from "../models/Transactions";

class CompainService {

  async store(req) {


    try {
      const { userId } = req;
      const { name, description, id } = req.body;
      if (id) {

        const updatedCompaign = await Compains.findByIdAndUpdate(
          id,
          { title: name, description: description, creator: userId },
          { new: true }
        );

        return (updatedCompaign);
      } else {
        const generateRandomReferralCode = () => {
          const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Define the characters to use
          const codeLength = 9; // Length of the referral code

          let referralCode = "";
          for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            referralCode += characters.charAt(randomIndex);
          }

          return referralCode;
        };

        // If 'id' is not provided, create a new compaign record
        const newCompaign = new Compains({ title: name, description, creator: userId, referralCode: generateRandomReferralCode() });
        const savedCompaign = await newCompaign.save();
        return (savedCompaign);
      }
    } catch (error) {
      console.log(error, "error");

      throw new Error(
        'Error creating/updating comapaign record'
      );
    }
  };

  async index(req) {
    try {
      const { query } = req;
      let { creator, page, limit, search, filter } = query;

      page = page ?? 1;
      limit = limit ?? 10;

      let queryObj = [{ creator: creator, isDeleted: false }];
      //@ts-ignore
      if (search) queryObj.push({ title: { $regex: search, $options: 'i' } });
      if (filter) {
        const currentDate = new Date();
        if (filter === 'All-time') {
          // No need to add any additional filters for "all time."
        } else if (filter === 'This-month') {
          const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

          queryObj.push({
            //@ts-ignore
            createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
          });
        } else if (filter === 'This-year') {
          const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
          const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);

          queryObj.push({
            //@ts-ignore
            createdAt: { $gte: firstDayOfYear, $lte: lastDayOfYear },
          });
        }
      }
      const getTotalCompaginData = async (id: any) => {
        try {
          const refUsers = await User.find({ campaignId: new mongoose.Types.ObjectId(id) });
          let totalRevenue = 0;
          let totalCommission = 0;
          const rec = await Promise.all(refUsers?.map(async (user: any) => {
            if (user.firstSubscription) {
              const curUserSub = await Subscription.find({ "plans._id": user.firstSubscription });
              const plan = curUserSub[0]?.plans?.find((it: any) => it._id.toString() == user.firstSubscription.toString())
              totalRevenue += plan?.price ?? 0;
              totalCommission += plan?.price ? Math.floor(Number(plan?.price) / 5) : 0
            }
          }))
          return { totalCommission, totalRevenue }
        } catch (error) {
          console.log(error);
          throw new Error(error?.message ?? error ?? 'Error whil calculation of compagin.')
        }
      }

      const records = await Compains.find({
        $and: queryObj,
      })
        .sort({ _id: -1 })
        .skip(limit * (page - 1))
        .limit(limit);

      const recordsWithSpecificCounts = await Promise.all(records.map(async (record) => {
        const campaignId = record._id; // Assuming that _id is the campaignId, adjust this if needed
        const specificRecordCount = await User.countDocuments({ campaignId: campaignId });
        const dtotal = await getTotalCompaginData(campaignId)
        // Create a new object with the specific record count
        return { ...record.toObject(), specificRecordCount, amount: dtotal.totalRevenue, commission: dtotal.totalCommission };
      }));

      const totalRecords = await Compains.countDocuments({
        $and: queryObj,
      });

      return { records: recordsWithSpecificCounts, totalRecords };
    } catch (error) {
      console.error(error);
      return ({ error: 'Error fetching campaigns' });
    }
  }

  async count(req) {
    try {
      const { query } = req;
      let { creator, filter } = query;

      const currentDate = new Date();
      const queryObj = { creator: creator, isDeleted: false };

      if (filter) {
        if (filter === 'This week') {
          const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
          const lastDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 6, 23, 59, 59);
          const firstDayOfPreviousWeek = new Date(firstDayOfWeek);
          firstDayOfPreviousWeek.setDate(firstDayOfPreviousWeek.getDate() - 7);
          const lastDayOfPreviousWeek = new Date(lastDayOfWeek);
          lastDayOfPreviousWeek.setDate(lastDayOfPreviousWeek.getDate() - 7);

          const currentWeekQuery = {
            createdAt: { $gte: firstDayOfWeek, $lte: lastDayOfWeek },
            creator: creator,
            isDeleted: false
          };

          const previousWeekQuery = {
            createdAt: { $gte: firstDayOfPreviousWeek, $lte: lastDayOfPreviousWeek },
            creator: creator,
            isDeleted: false
          };
          //@ts-ignore
          queryObj.createdAt = currentWeekQuery;

          // Calculate data for the previous week separately
          const totalCampaignsCountPrevious = await Compains.countDocuments(previousWeekQuery);
          const userCampaignsPreviousWeek = await Compains.find({ isDeleted: false, ...previousWeekQuery }, '_id')
          const campaignIdsPreviousWeek = userCampaignsPreviousWeek.map((campaign) => campaign._id);
          const usersWithSameCampaignsPrevious = await User.countDocuments({
            campaignId: { $in: campaignIdsPreviousWeek },
          });

          const totalCampaignsCountCurrent = await Compains.countDocuments(currentWeekQuery);
          const userCampaignsCurrent = await Compains.find({ isDeleted: false, ...currentWeekQuery }, '_id');
          const campaignIdsCurrentWeek = userCampaignsCurrent.map((campaign) => campaign._id);
          const usersWithSameCampaignsCurrent = await User.countDocuments({
            campaignId: { $in: campaignIdsCurrentWeek },
          });

          return {
            totalCampaignsCountCurrent,
            totalCampaignsCountPrevious,
            usersWithSameCampaignsCurrent,
            usersWithSameCampaignsPrevious,
          };
        } else if (filter === 'This month') {
          const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

          const firstDayOfPreviousMonth = new Date(firstDayOfMonth);
          firstDayOfPreviousMonth.setMonth(firstDayOfPreviousMonth.getMonth() - 1);
          const lastDayOfPreviousMonth = new Date(lastDayOfMonth);
          lastDayOfPreviousMonth.setMonth(lastDayOfPreviousMonth.getMonth() - 1);

          const currentMonthQuery = {
            createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
            creator: creator,
            isDeleted: false
          };

          const previousMonthQuery = {
            createdAt: { $gte: firstDayOfPreviousMonth, $lte: lastDayOfPreviousMonth },
            creator: creator,
            isDeleted: false
          };
          //@ts-ignore
          queryObj.createdAt = currentMonthQuery;

          const totalCampaignsCountCurrent = await Compains.countDocuments(currentMonthQuery);
          const userCampaignsCurrent = await Compains.find({ isDeleted: false, ...currentMonthQuery }, '_id');

          const campaignIdsCurrentMonth = userCampaignsCurrent.map((campaign) => campaign._id);
          const usersWithSameCampaignsCurrent = await User.countDocuments({
            campaignId: { $in: campaignIdsCurrentMonth },
          });

          const totalCampaignsCountPrevious = await Compains.countDocuments(previousMonthQuery);
          const userCampaignsPreviousMonth = await Compains.find({ isDeleted: false, ...previousMonthQuery }, '_id');
          const campaignIdsPreviousMonth = userCampaignsPreviousMonth.map((campaign) => campaign._id);
          const usersWithSameCampaignsPrevious = await User.countDocuments({
            campaignId: { $in: campaignIdsPreviousMonth },
          });

          return {
            totalCampaignsCountCurrent,
            totalCampaignsCountPrevious,
            usersWithSameCampaignsCurrent,
            usersWithSameCampaignsPrevious,
          };
        } else if (filter === 'This year') {
          const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
          const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);

          const firstDayOfPreviousYear = new Date(firstDayOfYear);
          firstDayOfPreviousYear.setFullYear(firstDayOfPreviousYear.getFullYear() - 1);
          const lastDayOfPreviousYear = new Date(lastDayOfYear);
          lastDayOfPreviousYear.setFullYear(lastDayOfPreviousYear.getFullYear() - 1);

          const currentYearQuery = {
            createdAt: { $gte: firstDayOfYear, $lte: lastDayOfYear },
            creator: creator, // Add the creator filter here
            isDeleted: false
          };


          const previousYearQuery = {
            createdAt: { $gte: firstDayOfPreviousYear, $lte: lastDayOfPreviousYear },
            creator: creator,
            isDeleted: false
          };
          //@ts-ignore
          queryObj.createdAt = currentYearQuery;

          const totalCampaignsCountCurrent = await Compains.countDocuments(currentYearQuery);

          const userCampaignsCurrentYear = await Compains.find({ isDeleted: false, ...currentYearQuery }, '_id');

          const campaignIdsCurrentYear = userCampaignsCurrentYear.map((campaign) => campaign._id);

          const usersWithSameCampaignsCurrent = await User.countDocuments({
            campaignId: { $in: campaignIdsCurrentYear },
          });

          const totalCampaignsCountPrevious = await Compains.countDocuments(previousYearQuery);
          const userCampaignsPrevious = await Compains.find(previousYearQuery, '_id');
          const campaignIdsPreviousYear = userCampaignsPrevious.map((campaign) => campaign._id);
          const usersWithSameCampaignsPrevious = await User.countDocuments({
            campaignId: { $in: campaignIdsPreviousYear },
          });

          return {
            totalCampaignsCountCurrent,
            totalCampaignsCountPrevious,
            usersWithSameCampaignsCurrent,
            usersWithSameCampaignsPrevious,
          };
        } else {
          return { error: 'Invalid filter specified' };
        }
      }

      const totalCampaignsCount = await Compains.countDocuments(queryObj);
      const userCampaigns = await Compains.find(queryObj, '_id');
      const campaignIds = userCampaigns.map((campaign) => campaign._id);
      const usersWithSameCampaigns = await User.countDocuments({
        campaignId: { $in: campaignIds },
      });
      return {
        totalCampaignsCount,
        usersWithSameCampaigns,
      };
    } catch (error) {
      console.error(error);
      return { error: 'Internal server error' };
    }
  }



  async destroy(req) {
    const { Id } = req.params;

    if (!Id) throw new Error("Campaign ID is required");
    const campiagn = await Compains.findById(Id);

    if (!campiagn) throw new Error("No Campaign found with this ID.");

    // Instead of deleting the campaign, update the isDeleted flag to true
    campiagn.isDeleted = true;

    // Save the updated campaign document
    const updateCampiagn = await campiagn.save();

    return updateCampiagn;
  }

  async indexById(req) {
    try {
      const { campaignId, page, limit, search } = req.query;

      const currentPage = page ? parseInt(page) : 1;
      const recordsPerPage = limit ? parseInt(limit) : 10;
      const campaign = await Compains.findById(campaignId)
      // Find users with the specified campaignId in their records
      const users = await User.find({ campaignId: campaignId }).select('userName email');

      if (users.length === 0) {
        // return res.status(404).json({ error: 'No users found with the specified campaign ID' });
      }

      const userIDs = users.map(user => user._id);

      const userSearchCriteria = {
        _id: { $in: userIDs }
      };


      if (search && search.trim() !== '') {

        userSearchCriteria['$or'] = [
          { userName: { $regex: new RegExp(search, 'i') } },
          { email: { $regex: new RegExp(search, 'i') } }
        ];
      }

      const totalRecords = await User.countDocuments(userSearchCriteria);

      const records = await User.find(userSearchCriteria).select('userName email subscription firstSubscription profileUrl')
        .sort({ _id: -1 })
        .skip(recordsPerPage * (currentPage - 1))
        .limit(recordsPerPage);

      const records1 = await Promise.all(records.map(async (i: any) => {
        if (i.firstSubscription) {
          const sub = await Subscription.find({ "plans._id": i.firstSubscription });
          const plan = sub[0].plans?.find((it: any) => it._id.toString() == i.firstSubscription.toString())
          return {
            ...i._doc,
            amount: plan?.price,
            commission: Math.floor(Number(plan?.price) / 5)
          }
        } else {
          return {
            ...i._doc,
            amount: 0,
            commission: 0
          }
        }
      }))

      return ({ records: records1, totalRecords, campaign });
    } catch (error) {
      console.log(error);
      throw Error('Error fetching campaigns');
    }
  }
  async referralList(req) {
    try {
      const { creator, page, limit, search, filter } = req.query;

      const currentPage = page ? parseInt(page) : 1;
      const recordsPerPage = limit ? parseInt(limit) : 10;

      // Find campaigns created by the specified user
      const campaigns = await Compains.find({ creator: creator });

      if (campaigns.length === 0) {
        return { error: 'No campaigns found with the specified user ID' };
      }

      const campaignIDs = campaigns.map(campaign => campaign._id);

      // Find users associated with the found campaign IDs
      const userSearchCriteria: any = {
        campaignId: { $in: campaignIDs }
      };

      if (search && search.trim() !== '') {
        userSearchCriteria['$or'] = [
          { userName: { $regex: new RegExp(search, 'i') } },
          { email: { $regex: new RegExp(search, 'i') } }
        ];
      }

      if (filter) {
        const currentDate = new Date();

        if (filter === 'All-time') {
        } else if (filter === 'This-month') {
          const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

          userSearchCriteria.createdAt = {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth
          };
        } else if (filter === 'This-year') {

          const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
          const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);
          userSearchCriteria.createdAt = {
            $gte: firstDayOfYear,
            $lte: lastDayOfYear
          };
        }
      }

      const totalRecords = await User.countDocuments(userSearchCriteria);


      const records = await User.find(userSearchCriteria)
        .select('userName email subscription firstSubscription profileUrl campaignId')
        .populate({
          path: 'campaignId',
          select: 'title',
          model: 'Compain'
        })
        .sort({ _id: -1 })
        .skip(recordsPerPage * (currentPage - 1))
        .limit(recordsPerPage);
      const records1 = await Promise.all(records.map(async (i: any) => {
        if (i?.firstSubscription) {
          const sub = await Subscription.find({ "plans._id": i.firstSubscription });
          const plan = sub[0].plans?.find((it: any) => it._id.toString() == i.firstSubscription.toString())
          return {
            ...i._doc,
            amount: plan?.price,
            commission: Math.floor(Number(plan?.price) / 5)
          }
        } else {
          return {
            ...i._doc,
            amount: 0,
            commission: 0
          }
        }
      }))
      return { records: records1, totalRecords };
    } catch (error) {
      console.log(error);
      throw new Error('Error fetching campaigns');
    }
  }
  async referralChart(req) {
    const { creator, filter } = req.query;
    try {
      const dateRange = [];
      const currentDate = new Date();

      if (filter === "Last 7 days") {
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(currentDate.getDate() - i);
          dateRange.push(date.toISOString().split("T")[0]);
        }
      } else if (filter === "This month") {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        for (let i = 0; i <= lastDayOfMonth.getDate(); i++) {
          const date = new Date(firstDayOfMonth);
          date.setDate(firstDayOfMonth.getDate() + i);
          dateRange.push(date.toISOString().split("T")[0]);
        }
      } else if (filter === "This year") {
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        for (let i = 0; i <= currentDate.getMonth(); i++) {
          const date = new Date(firstDayOfYear);
          date.setMonth(firstDayOfYear.getMonth() + i);
          dateRange.push(date.toISOString().split("T")[0]);
        }
      }

      else {
        // Handle unsupported filter values
        return { error: 'Unsupported filter value' };
      }

      const chartData = {};

      // Find campaigns with the specified creator
      const campaigns = await Compains.find({ creator: creator });

      // Implement a function to retrieve the campaign title by campaignId
      const getCampaignTitle = async (campaignId) => {
        const campaign = await Compains.findById(campaignId);
        return campaign ? campaign.title : 'Unknown Campaign';
      };

      // Loop through the date range and find user counts for each campaign
      for (const date of dateRange) {
        const graphUsers = await User.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(date),
                $lt: new Date(date + "T23:59:59.999Z"),
              },
              campaignId: { $in: campaigns.map(campaign => campaign._id) }
            },
          },
          {
            $group: {
              _id: '$campaignId',
              count: { $sum: 1 },
            },
          },
        ]);

        // Process graphUsers to build the chart data for the specific date
        const dataForDate = await Promise.all(graphUsers.map(async (item) => {
          const campaignTitle = await getCampaignTitle(item._id);
          return {
            campaignTitle,
            userCount: item.count,
          };
        }));

        chartData[date] = dataForDate;
      }

      return { chartData };
    } catch (error) {
      console.error(error);
      return { error: 'Error finding campaigns and counting users' };
    }
  }


  async referralGraph(req) {
    const { creator, filter } = req.query;

    try {
      const dateRange = [];
      const currentDate = new Date();

      if (filter === "Last 7 days") {
        for (let i = 7; i >= 0; i--) { // Include today's date
          const d = new Date();
          d.setDate(currentDate.getDate() - i);
          dateRange.push(d);
        }
      } else if (filter === "Last 14 days") {
        for (let i = 14; i >= 0; i--) { // Include today's date
          const d = new Date();
          d.setDate(currentDate.getDate() - i);
          dateRange.push(d);
        }
      } else if (filter === "Last 28 days") {
        for (let i = 28; i >= 0; i--) { // Include today's date
          const d = new Date();
          d.setDate(currentDate.getDate() - i);
          dateRange.push(d);
        }
      } else {
        return { error: 'Unsupported filter value' };
      }

      // Find campaigns with the specified creator
      const campaigns = await Compains.find({ creator: creator });

      const userCounts = [];

      let totalReferrals = 0; // Initialize totalReferrals
      let todayReferrals = 0; // Initialize today's referral count

      console.log(dateRange," ===> dateRange");
      

      for (const date of dateRange) {

        const nextDay = new Date(date);
        // nextDay.setDate(nextDay.getDate() + 1); // Calculate the next day
        // nextDay.setHours(0, 0, 0, 0); // Set the time to the beginning of the next day

        const count = await User.countDocuments({
          createdAt: {
            // $gte: date,
            // $lt: nextDay,
            $gte: nextDay.setHours(0,0,0,0),
            $lt: nextDay.setHours(23,59,59,0),
          },
          campaignId: { $in: campaigns.map(campaign => campaign._id) },
        });

        userCounts.push({
          date: date.toISOString().split("T")[0],
          User: count,
        });

        totalReferrals += count;

        if (date.toDateString() === currentDate.toDateString()) {
          todayReferrals = count;
        }
      }

      return { data: userCounts, totalReferrals, todayReferrals };
    } catch (error) {
      console.error(error);
      return { error: 'Error finding campaigns and counting users' };
    }
  }





  async newReferralList(req) {
    try {
      const { creator } = req.query;

      // Calculate the start and end of today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of the day
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999); // End of the day

      // Find campaigns created by the specified user
      const campaigns = await Compains.find({ creator: creator });

      if (campaigns.length === 0) {
        return { error: 'No campaigns found with the specified user ID' };
      }

      const campaignIDs = campaigns.map(campaign => campaign._id);

      // Find users associated with the found campaign IDs
      const userSearchCriteria = {
        campaignId: { $in: campaignIDs },
        createdAt: {
          $gte: today,
          $lte: endOfDay
        }
      };

      const records = await User.find(userSearchCriteria)
        .select('userName email subscription profileUrl campaignId')
        .populate({
          path: 'campaignId',
          select: 'title',
          model: 'Compain'
        })
        .sort({ _id: -1 })
        .limit(5);

      return { records };
    } catch (error) {
      console.log(error);
      throw new Error('Error fetching campaigns');
    }
  }


  async getTotalData(req) {
    try {
      const { userId } = req;
      const totalCampaigns = (await Compains.find({ creator: new mongoose.Types.ObjectId(userId) })).map((i: any) => (new mongoose.Types.ObjectId(i?._id)))
      const totalRefferals = await User.find({ campaignId: { $in: totalCampaigns } }).count()

      const getTotalCompaginData = async (allCampaigns: Array<mongoose.Types.ObjectId>) => {
        try {
          const refUsers = await User.find({ campaignId: { $in: allCampaigns } });
          let totalRevenue = 0;
          let totalCommission = 0;
          const rec = await Promise.all(refUsers?.map(async (user: any) => {
            if (user.firstSubscription) {
              const curUserSub = await Subscription.find({ "plans._id": user.firstSubscription });
              const plan = curUserSub[0]?.plans?.find((it: any) => it._id.toString() == user.firstSubscription.toString())
              totalRevenue += plan?.price ?? 0;
              totalCommission += plan?.price ? Math.floor(Number(plan?.price) / 5) : 0
            }
          }))
          return { totalCommission, totalRevenue }
        } catch (error) {
          console.log(error);
          throw new Error(error?.message ?? error ?? 'Error whil calculation of compagin.')
        }
      }
      const { totalCommission, totalRevenue } = await getTotalCompaginData(totalCampaigns);

      const totalCampaignsCount = (await Compains.find({ creator: new mongoose.Types.ObjectId(userId), isDeleted: { $ne: true } }))
      return ({ totalCompaigns: totalCampaignsCount?.length ?? 0, totalRefferals, totalCommission, totalRevenue });
    } catch (error) {
      console.log(error);
      throw Error(error?.message ?? error ?? 'Error while fetching data');
    }
  }

  async getDashboardOverview(req) {
    const { userId } = req;
    const { creator, filter } = req.query;
    try {
      const dateRange = [];
      const currentDate = new Date();
      let minDate: any;

      if (filter === "This week") {
        for (let i = currentDate.getDay(); i >= 0; i--) {
          const date = new Date();
          date.setDate(currentDate.getDate() - i);
          dateRange.push(date.toISOString().split("T")[0]);
        }
        minDate = new Date().setDate(currentDate.getDate() - currentDate.getDay())
      } else if (filter === "This month") {
        const firstDayOfMonth = new Date(new Date().setFullYear(currentDate.getFullYear(), currentDate.getMonth(), 1));
        for (let i = 0; i <= currentDate.getDate(); i++) { // Include today's date
          const date = new Date(firstDayOfMonth);
          date.setDate(firstDayOfMonth.getDate() + i);
          dateRange.push(date.toISOString().split("T")[0]);
        }
        minDate = new Date(new Date().setFullYear(new Date().getFullYear(), new Date().getMonth(), 1)).setHours(0, 0, 0)


      } else if (filter === "This year") {
        const firstDayOfYear = new Date(new Date().setFullYear(currentDate.getFullYear(), 0, 1));
        for (let i = 0; i <= currentDate.getMonth(); i++) {
          const date = new Date(firstDayOfYear);
          date.setMonth(firstDayOfYear.getMonth() + i);
          console.log(date," ===> each date");
          
          dateRange.push(date.toISOString().split("T")[0]);
        }
        minDate = new Date().setFullYear(new Date().getFullYear(), 1, 1)
        console.log(dateRange, " yearl date range");
        
      }

      else {
        // Handle unsupported filter values
        return { error: 'Unsupported filter value' };
      }

      var chartData = [];

      // Find campaigns with the specified creator
      const campaigns = await Compains.find({ creator: new mongoose.Types.ObjectId(userId) });

      // Implement a function to retrieve the campaign title by campaignId
      const getCampaignTitle = async (campaignId) => {
        const campaign = await Compains.findById(campaignId);
        return campaign ? campaign.title : 'Unknown Campaign';
      };

      // Loop through the date range and find user counts for each campaign
      for (const date of dateRange) {
        const yearStartDate = new Date(new Date(date).setDate(1)).setHours(0,0,0,0)
        const yearEndDate = new Date(new Date(date).setDate(31)).setHours(23,59,59)
        const graphUsers = await User.aggregate([
          {
            $match: {
              createdAt: {
                $gte: filter === "This year" ? new Date(yearStartDate) : new Date(date),
                $lt: filter === "This year" ? new Date(yearEndDate) : new Date(date + "T23:59:59.999Z"),
              },
              campaignId: { $in: campaigns.map(campaign => campaign._id) }
            },
          },
          // {
          //   $group: {
          //     _id: '$campaignId',
          //     count: { $sum: 1 },
          //   },
          // },
        ]);

        console.log(new Date(yearStartDate).toString(), new Date(yearEndDate).toString(), " ===> graph users");
        

        let dateCommission = 0;

        // Process graphUsers to build the chart data for the specific date
        const dataForDate = await Promise.all(graphUsers.map(async (i) => {
          const sub = await Subscription.find({ "plans._id": i.firstSubscription });
          if (!sub || !sub[0]?.plans) {
            dateCommission += 0;
          } else {
            const planPrice = sub[0].plans?.find((it: any) => it._id.toString() == i.firstSubscription.toString())?.price
            dateCommission += Math.floor(Number(planPrice) / 5)
          }
        }));

        const key = filter == 'This week' ? new Date(date).toDateString().substring(0, 3) : filter == 'This month' ? date : filter == 'This year' ? new Date(date).toDateString().substring(4, 7) : 'unknown'

        // chartData[key] = dateCommission;
        chartData.push({
          name: key,
          earning: dateCommission
        })
      }

      var totalCommission: number = 0;

      const refferals = await User.find({ campaignId: { $in: campaigns.map(campaign => campaign._id) }, createdAt: { $gte: new Date(minDate), $lte: new Date() } })
      for (let i = 0; i < refferals.length; i++) {
        const sub = await Subscription.find({ "plans._id": refferals[i].firstSubscription });
        if (!sub || !sub[0]?.plans) {
          totalCommission += 0;
        } else {
          const planPrice = sub[0].plans?.find((it: any) => it._id.toString() == refferals[i].firstSubscription.toString())?.price
          totalCommission += Math.floor(Number(planPrice) / 5)
        }
      }

      const campaignsCount = await Compains.find({ creator: new mongoose.Types.ObjectId(userId), isDeleted: { $ne: true }, createdAt: { $gte: new Date(minDate), $lte: new Date() } });

      return { commisionGraphData: chartData, refferals: refferals?.length, commision: totalCommission, campaigns: campaignsCount.length };
    } catch (error) {
      console.error(error);
      return { error: 'Error finding campaigns and counting users' };
    }
  }



  async getDashboardOverview1(req) {
    const { userId } = req;
    const { creator, filter } = req.query;
    try {
      const dateRange = [];
      const currentDate = new Date();

      if (filter === "Last 7 days") {
        for (let i = currentDate.getDay(); i >= 0; i--) {
          const date = new Date();
          date.setDate(currentDate.getDate() - i);
          dateRange.push(date.toISOString().split("T")[0]);
        }
      } else if (filter === "This month") {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        for (let i = 0; i <= currentDate.getDate(); i++) { // Include today's date
          const date = new Date(firstDayOfMonth);
          date.setDate(firstDayOfMonth.getDate() + i);
          dateRange.push(date.toISOString().split("T")[0]);
        }
      } else if (filter === "This year") {
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        for (let i = 0; i <= currentDate.getMonth(); i++) {
          const date = new Date(firstDayOfYear);
          date.setMonth(firstDayOfYear.getMonth() + i);
          dateRange.push(date.toISOString().split("T")[0]);
        }
      }

      else {
        // Handle unsupported filter values
        return { error: 'Unsupported filter value' };
      }

      const chartData = {};

      // Find campaigns with the specified creator
      const campaigns = await Compains.find({ creator: creator });

      // Implement a function to retrieve the campaign title by campaignId
      const getCampaignTitle = async (campaignId) => {
        const campaign = await Compains.findById(campaignId);
        return campaign ? campaign.title : 'Unknown Campaign';
      };

      // Loop through the date range and find user counts for each campaign
      for (const date of dateRange) {
        const graphUsers = await User.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(date),
                $lt: new Date(date + "T23:59:59.999Z"),
              },
              campaignId: { $in: campaigns.map(campaign => campaign._id) }
            },
          },
          {
            $group: {
              _id: '$campaignId',
              count: { $sum: 1 },
            },
          },
        ]);

        // Process graphUsers to build the chart data for the specific date
        const dataForDate = await Promise.all(graphUsers.map(async (item) => {
          const campaignTitle = await getCampaignTitle(item._id);
          return {
            campaignTitle,
            userCount: item.count,
          };
        }));

        chartData[date] = dataForDate;
      }

      return { chartData };
    } catch (error) {
      console.error(error);
      return { error: 'Error finding campaigns and counting users' };
    }
  }

  async getCampaignState(req) {
    try {
      const { userId } = req;
      const campaigns = await Compains.find({ creator: new mongoose.Types.ObjectId(userId), isDeleted: { $ne: true } });
      const data = Promise.all(campaigns.map(async (it: any) => {
        const users = await User.find({ campaignId: new mongoose.Types.ObjectId(it?._id) })
        return {
          name: it?.title,
          views: users.length
        }
      }))
      return data;
    } catch (error) {
      console.log(error);
      throw new Error('Error fetching campaigns');
    }
  }

  async getIncomeDate(req) {
    try {
      const { userId } = req;
      const reqUser = await User.findById(userId)
      const connectAccountId = reqUser.stripeConnectAccountId;
      const balance = await StripeAccounts.getBalance(connectAccountId);

      const deleiveredTransactions = await Transaction.find({
        deliveryStatus: 'Completed',
        referralSuperUser: new mongoose.Types.ObjectId(userId)
      })
      const recectDeleiveryStatus = await Transaction.find({
        deliveryStatus: 'Completed',
        referralSuperUser: new mongoose.Types.ObjectId(userId)
      }).sort({ _id: -1 }).limit(1)


      const getSingleSubscriptionPrice = async (id: string | Array<string>): Promise<number> => {
        if (!id) return 0;
        const sub = await Subscription.find({ "plans._id": id });
        const planPrice = sub[0].plans?.find((it: any) => it._id.toString() == id.toString())?.price
        return Math.floor(Number(planPrice) / 5)
      }
      const getPriceOfSupscription = async (subId: string | Array<string>): Promise<number> => {

        let totalPrice = 0;
        if (Array.isArray(subId) && subId.length > 0) {
          for (let i = 0; i < subId.length; i++) {
            const singlePrice = await getSingleSubscriptionPrice(subId[i]);
            totalPrice += singlePrice;
          }
        } else if (subId.length > 0) {
          totalPrice = await getSingleSubscriptionPrice(subId)
        } else {
          return 0;
        }
        return totalPrice;
      }

      const onlySubIdArr = deleiveredTransactions.map((i: any) => i.plan)
      const totalWithDrawl = onlySubIdArr?.length > 0 ? await getPriceOfSupscription(onlySubIdArr) : 0;
      const recentWithDrawl = recectDeleiveryStatus[0]?.plan ? await getPriceOfSupscription(recectDeleiveryStatus[0].plan.toString()) : 0;
      return {
        availableBalance: balance.available[0].amount,
        totalWithDrawn: totalWithDrawl,
        recentWithdrawn: recentWithDrawl
      }

    } catch (error) {
      console.log(error);
      throw new Error('Error fetching campaigns');
    }
  }

}


export default new CompainService();