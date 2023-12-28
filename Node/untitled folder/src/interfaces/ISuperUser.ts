export default interface ISuperUser extends Document {
    id: string;
    user: any;
    description: string;
    website?: string;
    socialInfo: any[];
    approvedBy: any;
    status: string;
    statusUpdatedDate: Date | string;
    stripeConnectAccountId?:String;
}