export default interface ISubscription extends Document {
    id: string;
    user: any;
    type: any;
    tier: string;
    billingCycle: string,
    price: number;
    promoCode: string;
    billingEmail: string;
    cardDetails: any;
    isActive: boolean;
    purchaseDate: string | Date
}