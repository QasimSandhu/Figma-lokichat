import axios, { AxiosError, AxiosResponse } from "axios";
import { SubmitBatchResponse } from "src/interfaces/IBatchResponse";

const { BlobServiceClient } = require("@azure/storage-blob");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import Stripe from "stripe";

class StripeAccount {
    private connectionString: string;
    private containerName: string;
    private targetContainer: string;
    private route: string;
    private postBatchUrl: string;
    private key: string;
    private token: string;
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        // @ts-ignore
        apiVersion: '2023-10-16',
    });


    constructor() {
        this.connectionString = "DefaultEndpointsProtocol=https;AccountName=first1122;AccountKey=d4EB3gn9Uvl891S7WPoVqhumDyA4s8C25SUU6V2j6Etm8+M6eTfc7UVzRkX545wrqdJSBH0Ibgpj+AStB2U4ng==;EndpointSuffix=core.windows.net";
        this.containerName = process.env.AZURE_CONTAINER_NAME || "mycontainer";
        this.postBatchUrl = "https://kamran.cognitiveservices.azure.com/translator/text/batch/v1.1"
        this.route = "/batches"
        this.key = process.env.AZURE_TRANSLATION_REQUEST_KEY || "b4c76100cd944086a32a94d2a0cc15f4";
        this.targetContainer = "https://first1122.blob.core.windows.net/mycontainer"
        this.token = 'sp=racwdli&st=2023-10-10T16:24:04Z&se=2025-10-11T00:24:04Z&spr=https&sv=2022-11-02&sr=c&sig=sygRuMTuD0JsSyR9EfgMY1qb5Zoj%2FnkUFnurObSxmyk%3D';
    }

    async createConnectAccount(): Promise<Stripe.Response<Stripe.Account>> {
        try {
            const account = await this.stripe.accounts.create({
                type: 'express',
            });
            return account;
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async getConnectAccountDetails(id: string): Promise<Stripe.Response<Stripe.Account>> {
        try {
            const account = await this.stripe.accounts.retrieve(id);
            return account;
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async deleteConnectAccount(id: string): Promise<Stripe.Response<Stripe.DeletedAccount>> {
        try {
            const delDetails = await this.stripe.accounts.del(id);
            return delDetails
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async rejectConnectAccount(id: string, reason: string): Promise<Stripe.Response<Stripe.Account>> {
        try {
            const rejDetails = await this.stripe.accounts.reject(id, { reason });
            return rejDetails;
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async listConnectAccounts(limit?: number): Promise<Stripe.ApiListPromise<Stripe.Account>> {
        try {
            const accounts = await this.stripe.accounts.list({ limit: typeof (limit) == "number" ? limit : 10 });
            return accounts;
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async createAccountLink(id: string, refresh_url:string,return_url:string): Promise<Stripe.Response<Stripe.AccountLink>> {
        try {
            const accountLinkObject = await this.stripe.accountLinks.create({
                account: id,
                refresh_url,
                return_url,
                type: 'account_onboarding'
            })
            return accountLinkObject;
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async createLoginLink(id: string): Promise<Stripe.Response<Stripe.LoginLink>> {
        try {
            const accountLinkObject = await this.stripe.accounts.createLoginLink(id)
            return accountLinkObject;
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async transferToConnectAccount(toAccountId: string,amount:number): Promise<Stripe.Response<Stripe.Transfer>> {
        try {
            const transfer = await this.stripe.transfers.create({
                destination:toAccountId,
                amount,
                currency:'usd'
            })
            return transfer;
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async retrieveTransfer(transferId:string): Promise<Stripe.Response<Stripe.Transfer>> {
        try {
            const transfer = await this.stripe.transfers.retrieve(transferId)
            return transfer;
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async listTransfers(limit:number = 10,accountId:string): Promise<Stripe.ApiListPromise<Stripe.Transfer>> {
        try {
            let query = {limit};
            if(typeof accountId == 'string') query[`destination`] = accountId;
            const transfers = await this.stripe.transfers.list(query)
            return transfers;
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async transferReversal(transferId:string,amount:number):Promise<Stripe.Response<Stripe.TransferReversal>>{
        try {
            const reversalTransfer = await this.stripe.transfers.createReversal(transferId,{
                amount
            })
            return reversalTransfer;
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async retrieveATransferReversal(transferId:string,transferReversalId:string):Promise<Stripe.Response<Stripe.TransferReversal>>{
        try {
            const reversalTransfer = await this.stripe.transfers.retrieveReversal(transferId,transferReversalId)
            return reversalTransfer;
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async listTransfersReversals(limit:number = 10,transferId:string): Promise<Stripe.ApiListPromise<Stripe.TransferReversal>> {
        try {
            const transfers = await this.stripe.transfers.listReversals(transferId,{limit})
            return transfers;
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async getBalance(connectedAccountId:string):Promise<Stripe.Response<Stripe.Balance>> {
        try {
            return await this.stripe.balance.retrieve({stripeAccount: connectedAccountId})
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

}

export default new StripeAccount()
