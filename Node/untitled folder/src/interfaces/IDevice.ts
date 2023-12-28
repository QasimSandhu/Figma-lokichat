export default interface ILoggedInDevice extends Document {
  id: string;
  user: any;
  ipAddress: string;
  browserName?: string;
  os?: string;
  browserVersion?: string;
  date: string | Date;
  mobileId: string;
  mobileName: string;
}
