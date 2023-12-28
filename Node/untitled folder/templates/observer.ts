import mongoose from 'mongoose';
import templateName from '../models/templateName';

class templateNameObserver {
  observe() {
    templateName.schema.post('actionName', (doc: mongoose.Document<any, any>) => {
      console.log(`New templateNameObserver observerAction`);
      // do something else with the new user doc here
    });
  }
}

export default templateNameObserver;
