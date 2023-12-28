export default interface IGoal extends Document {
  id: string;
  user: any;
  name: string;
  status: string;
  keyPoint1: string;
  keyPoint2: string;
  keyPoint3: string;
  dueOnDate: string | Date;
  completedAt: string | Date;
  reminderFrequency: string | null;
  notificationsReminder: boolean;
}
