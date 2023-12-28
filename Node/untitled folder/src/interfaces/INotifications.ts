export default interface INotifications extends Document {
  id: string;
  title:string;
  user: any;
  name: string;
  message: string;
  from: any;
  referenceId?: string;
  pageId: string;
  pagePath: string;
  receivers: any;
  readBy: any;
  profileUrl?: any;
  item:any;
}
