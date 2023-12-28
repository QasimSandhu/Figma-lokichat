import CronJob from 'cron';

class templateNameSchedule {
  constructor(execution_frequency) {
    new CronJob.CronJob(execution_frequency, this.executeFunction).start();
  }

  executeFunction() {
    console.log('Executing templateName function...');
    // Add your logic here
  }
}

export default templateNameSchedule;
