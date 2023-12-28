export default interface IRefreshToken extends Document {
    id: string;
    user: any;
    token: string;
    expiresAt: Date | null
}