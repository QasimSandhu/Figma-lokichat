export default interface IDebate extends Document {
    id: string;
    user: any;
    title: string;
    messages: any;
    invitedUsers: any;
    leavedDebateUsers: any;
    removedDebateUsers: any;
  }