import { isPast } from "../lib/datetime/DateTime";
import { GOAL_STATUS } from "../lib/constants/goal";
import Goal from "../models/Goal";
import mongoose from "mongoose";
import { isEmpty } from "lodash";

class GoalsService {

  async index(req) {
    const { userId, params } = req;
    const { status, page, perPage } = params;

    let completedGoals = await Goal.find({ user: userId, status: GOAL_STATUS.COMPLETED });
    let inProgressGoals = await Goal.find({user: userId, status: GOAL_STATUS.INPROGRESS});

    completedGoals = completedGoals.sort((a: any, b: any) => b.completedAt - a.completedAt);
    inProgressGoals = inProgressGoals.sort((a: any, b: any)=> a.dueOnDate - b.dueOnDate);
    return { inProgressGoals, completedGoals };
  }

  async indexByPagination(req) {
    const { userId, query } = req;
    const { status, page, perPage } = query;

    const statusFilter: any = {};
    const sortObject: any = {};

    if(status === GOAL_STATUS.COMPLETED) {
      statusFilter.status = GOAL_STATUS.COMPLETED;
      sortObject.completedAt = -1;
    } else if (status === GOAL_STATUS.INPROGRESS) {
      statusFilter.status = GOAL_STATUS.INPROGRESS;
      sortObject.dueOnDate = 1;
    } else throw new Error('Invalid status filter');

    const goals = await Goal.find({user: userId, ...statusFilter}).sort(sortObject).skip((page - 1) * perPage).limit(perPage);
    const totalGoals = await Goal.countDocuments({user: userId, ...statusFilter});

    return {
      goals,
      perPage,
      totalGoals,
      currentPage: page
    }
  }

  async store(req) {
    const { body, userId } = req;
    const { name, dueOnDate, notificationsReminder, reminderFrequency, keyPoint1, keyPoint2, keyPoint3 } = body;

    if (notificationsReminder && (!reminderFrequency || !keyPoint1 || isEmpty(keyPoint1)))
      throw new Error("required params are missing");

    if (isPast(dueOnDate)) throw new Error("Due on date must be in the future");

    const goal = new Goal({
      user: userId,
      name,
      status: GOAL_STATUS.INPROGRESS,
      keyPoint1,
      keyPoint2,
      keyPoint3,
      dueOnDate,
      reminderFrequency,
      notificationsReminder,
    });
    await goal.save();
    return goal;
  }

  async show(req) {
    const { body } = req;
    const { goalId } = body;

    const goal = await Goal.findById(goalId);
    if (!goal) throw new Error("No Goal found with this goal ID");

    return goal;
  }

  async destroy(req) {
    const { params } = req;
    const { goalId } = params;

    const goal = await Goal.findByIdAndDelete(goalId);
    if (!goal) throw new Error("No Goal found with this goal ID");

    return goal;
  }

  async stats(req) {
    const { userId } = req;

    const statsPipeline = [
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
            _id: "$user",
            totalInProgressGoals: {
              $sum: {
                $cond: {
                  if: { $eq: ["$status", "inprogress"] },
                  then: 1,
                  else: 0,
                },
              },
            },
            totalCompletedGoals: {
              $sum: {
                $cond: {
                  if: { $eq: ["$status", "completed"] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
      },
    ];
    let pipelienResult = await Goal.aggregate(statsPipeline);
    
    return {
      _id: pipelienResult[0]._id,
      totalInProgressGoals: pipelienResult[0].totalInProgressGoals,
      totalCompletedGoals: pipelienResult[0].totalCompletedGoals
    };
  }

  async update(req) {
    const { body } = req;
    const { goalId, name, dueOnDate, notificationsReminder, status, keyPoint1, keyPoint2, keyPoint3 } = body;
    let { reminderFrequency } = body;
    //if (dueOnDate && isPast(dueOnDate))
    //  throw new Error("Due on date must be in the future");

    if (status && status !== GOAL_STATUS.INPROGRESS && status !== GOAL_STATUS.COMPLETED)
      throw new Error("Invalid status");

    const goal = await Goal.findOne({ _id: goalId });

    if (!goal) throw new Error("No Goal found with this Id");

    if (notificationsReminder && !goal.reminderFrequency && !reminderFrequency)
      throw new Error("reminder frequency is required");

    if (notificationsReminder == false) reminderFrequency = null;

    if(status && status === GOAL_STATUS.COMPLETED)
      goal.completedAt = new Date();

    goal.name = name || goal.name;
    goal.status = status || goal.status;
    goal.keyPoint1 = keyPoint1 || goal.keyPoint1;
    goal.keyPoint2 = keyPoint2;
    goal.keyPoint3 = keyPoint3;
    goal.dueOnDate = dueOnDate || goal.dueOnDate;
    goal.notificationsReminder =
      notificationsReminder == false || notificationsReminder == true
        ? notificationsReminder
        : goal.notificationsReminder;
    goal.reminderFrequency =
      notificationsReminder == false || notificationsReminder == true
        ? reminderFrequency
        : goal.reminderFrequency;

    await goal.save();

    return goal;
  }
}

export default new GoalsService();
