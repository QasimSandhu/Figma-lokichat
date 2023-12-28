import { size, throttle } from "lodash";
import Notifications from "../models/Notifications";
import User from "../models/User";
import StripeAccounts from "../classes/StripeAccounts";
import Stripe from "stripe";
import Transaction from "../models/Transactions";
import mongoose from "mongoose";
class StripeService {

  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    //@ts-ignore
    apiVersion: '2023-10-16'
  });

  async getStripeSetupUrl(req) {
    const { userId } = req;
    const reqUser = await User.findById(userId);
    const link = await StripeAccounts.createAccountLink(reqUser.stripeConnectAccountId, 'https://stripe.com/docs', 'https://stripe.com/docs')
    return link;
  }

  async getStripeLoginLink(req) {
    const { userId } = req;
    const reqUser = await User.findById(userId);
    const linkObject = await StripeAccounts.createLoginLink(reqUser.stripeConnectAccountId)
    return linkObject;
  }

  async getConnectAccountDetails(req) {
    const { userId } = req;
    const reqUser = await User.findById(userId);
    const details = await StripeAccounts.getConnectAccountDetails(reqUser.stripeConnectAccountId)
    return details;
  }

  async findCharge(pmId: string, start: string = ''):Promise<Stripe.BalanceTransaction> {
    try {
      let payment_method_details = await this.stripe.paymentMethods.retrieve(pmId)
      let sobj = start == '' ? {} : { starting_after: start }

      let charges = await this.stripe.charges.list({
        created: {
          gte: payment_method_details.created - 36000
        },
        limit: 1000000,
        ...sobj
      });
      // const charges = await this.stripe.charges.search({
      //   query: `metadata[\'payment_method\']:\'${payment_method_id}\'`,
      // });
      console.log(charges, payment_method_details, pmId, charges.data.length, 'charges and pm id');

      let refCharge = charges.data.find(i => i.payment_method == pmId);

      let refBalanceTransaction:Stripe.Balance | any = {}

      if (!refCharge) {
        refBalanceTransaction = await this.findCharge(pmId, charges.data[90].id)
        return refBalanceTransaction;
      } else {
        // console.log(refCharge, "refcharge");
        refBalanceTransaction = await this.stripe.balanceTransactions.retrieve(refCharge.balance_transaction as string)
        console.log(refBalanceTransaction,' balanceTransaction');
        return refBalanceTransaction;
      }
    } catch (error) {
      console.log(error);
      throw new Error('charge not found')
    }
  }

  async getStatics(payment_method_id: string) {
    const payment_method_details = await this.stripe.paymentMethods.retrieve(payment_method_id)

    const charges = await this.stripe.charges.list({
      created: {
        gte: payment_method_details.created - 36000
      },
      limit: 1000000,
      ...{}
    });
    // const charges = await this.stripe.charges.search({
    //   query: `metadata[\'payment_method\']:\'${payment_method_id}\'`,
    // });
    console.log(charges, payment_method_details, payment_method_id, charges.data.length, 'charges and pm id');

    // const refCharge = charges.data.find(i => i.payment_method == payment_method_id);
    // if (!refCharge) throw new Error('Charge not found!')
    // console.log(refCharge,"refcharge");
    // let refCharge = await this.findCharge(payment_method_id)
    // console.log(refCharge?.balance_transaction, "refchargeOutside");


    // const refBalanceTransaction = await this.stripe.balanceTransactions.retrieve(refCharge.balance_transaction as string)
    const refBalanceTransaction = await this.findCharge(payment_method_id)
    console.log(refBalanceTransaction, 'OUtSide Balance Transaction ');
    
    console.log(refBalanceTransaction, new Date(Number(refBalanceTransaction.available_on) * 1000), " ===> balence transaction");
    if (new Date() > new Date(Number(refBalanceTransaction.available_on) * 1000) && refBalanceTransaction.status == 'available') {
      //good to go , means charge is ok, transaction available date passed and transaction is now available detected through status of transaction
      return true;
    } else {
      throw new Error(`Transaction is in Pending State, Not Available yet.Try after ${new Date(refBalanceTransaction.available_on * 1000)}`);
    }
  }

  async sendMoneyToConnectedAccount(req) {
    try {
      const { userId, body } = req;
      const { amount, againstUser } = body;
      const referredUser = await User.findById(againstUser).populate('currentTransactionId')
      const referredPayment = referredUser.currentTransactionId;
      if (referredPayment.deliveryStatus == 'Completed') {
        throw new Error('Commission already deleivered.')
      }
      const reqUser = await User.findById(userId);
      // await StripeAccounts.getBalance(reqUser.stripeConnectAccountId)
      const currentTransactionId = referredPayment._id;
      const pmId = referredPayment.paymentId;
      const isAmountReadyToPayout = await new StripeService().getStatics(pmId);
      if (isAmountReadyToPayout != true) { throw new Error('Payment not available yet.') }
      const transfer = await StripeAccounts.transferToConnectAccount(reqUser.stripeConnectAccountId, amount);
      console.log(transfer, ' Transfer');
      const updateTransaction = await Transaction.findByIdAndUpdate(currentTransactionId, {
        $set: {
          refferalConnectAccountTransferid: transfer.id,
          deliveryStatus: 'Completed',
          deleiveredAt: new Date()
        }
      })
      return updateTransaction;
      console.log('everything Ok');
      return {}
    } catch (error) {
      console.log(error);
      throw new Error(error?.message ?? error)
    }
  }

  async getUserPendingTransactions(req) {
    try {
      const { userId } = req;
      const transactions = await Transaction.find({
        referralSuperUser: new mongoose.Types.ObjectId(userId),
        deliveryStatus: 'Pending',
      }).populate('user').populate('campaignId').populate('subscription')
      return transactions;
    } catch (error) {
      console.log(error);
      throw new Error(error?.message ?? error)
    }
  }

  async getUserTransactionsHistory(req) {
    try {
      const { userId } = req;
      const transactions = await Transaction.find({
        referralSuperUser: new mongoose.Types.ObjectId(userId),
        deliveryStatus: 'Completed',
      }).populate('user').populate('campaignId').populate('subscription')
      return transactions;
    } catch (error) {
      console.log(error);
      throw new Error(error?.message ?? error)
    }
  }

  async index(req) {
    const { userId } = req;
    const notifications = await Notifications.find({ receivers: { $in: userId } });
    return notifications;
  }

  async store(req) {
    const { body, userId } = req;
    const { message, from, receivers, readBy } = body;

    const goal = new Notifications({
      user: userId,
      message,
      from,
      receivers,
      readBy: readBy || [],
    });

    await goal.save();

    return goal;
  }

  async update(req) {
    const { body, userId } = req;
    const { notificationsList } = body;

    if (notificationsList === false) {
      return await User.findByIdAndUpdate(userId, { notificationsList: false }, { new: true });
    } else if (notificationsList === true) {
      return await User.findByIdAndUpdate(userId, { notificationsList: true }, { new: true });
    } else if (Array.isArray(notificationsList) && size(notificationsList) > 0) {
      return await User.findByIdAndUpdate(userId, { notificationsList: notificationsList }, { new: true });
    } else throw new Error('invalid user notifications list');
  }

  async destroy(req) {
    const { params } = req;
    const { notificationId } = params;

    return "";
  }
}

export default new StripeService();
