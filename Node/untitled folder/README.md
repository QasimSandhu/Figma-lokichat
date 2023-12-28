# mern-boilerplate
Nodejs MVC framework for the fast development process.

## Usage
Clone the project and install dependencies by running
```
npm install
```
### setting up enviroment variables
For this you have to create a .env file from example.env and put your own credentials into it.
Following are the required attributes
```
PORT = 'YOUR_SERVER_PORT'
DATABASE_URL   = 'DATABASE_SERVER_URL'
JWT_SECRET_KEY = 'JWT_SECRET_KEY'
```
### Running the project
To run the project after adding the necessary configurations you have to run the following command
```
npm run start
```
### The basics
#### Models
The models are the way to interact with your database schemas.
To create model run the following command
```
npm run make:model User
```
In this way you would have a minimal configuration of the user model under models/ directory.
Now you can customise your model schema as per your needs.
#### Controllers
To create a controller file you just need to provide a singular controller name as
```
npm run make:controller User
```
It will create the following controller for you
controllers/UserController.ts
The output controller would have basic operations for index, show, store, update & destroy
#### Services
The business logic should be written under the service class under /services directory.The purpose
of the controller should only be to control the request response flow.
#### resources
resource class can be a good way to reformate the request responses.
You can create a resource class by running the following command.
```
npm run make:resource UserUpdated 
```
it will create a resource class as /resources/UserUpdatedResource.ts
#### Module
Here is the megic part, you can create a complete module including controller, model,service, requests and resource classes just by running the simple command as
```
npm run make:crud Product
```
After running this command you would get a complete working module.
#### Resourcefull routes
```
import MyController from '../controllers/MyController';
import { ResourceRouter } from '../lib/http/ResourceRouter';

 const myRouter = new ResourceRouter(router, {
   path: '/my',
   controller: MyController,
 });
 myRouter.registerRoutes();
```
#### Queue jobs
For queue handeling there we are using redis server, So you have to update the redis configurations under config/redis.config.ts file
You can create queue jobs by running the following command
```
npm run make:job SendEventJob
```
Now you can import the job into your class and dispatch the events as:
```
import SendEventJob from '../jobs/SendEventJob';

SendEventJob.init();
SendEventJob.add({message:'hi:'});
SendEventJob.process();
```

#### scheduling jobs
the cron jobs can be created by simply running the command as
```
npm run make:schedule FetchData
```
there you will have a FetchDataSchedule class under schedules directory. 
Then after that you would have to register the scheduled commands inside the schedules/kernal.ts file as
```
import FetchDataSchedule from "./FetchDataSchedule";

//the below schedule will be executed evry 10 minutes
const fetchDataSchedule = new FetchDataSchedule('0 */10 * * * *');
```

### HTTP client
Http client is to make the http request with get, post, put, patch & delete
```
const client = new HttpClient('https://api.example.com');

const data = await client.get<{ name: string }>('/users/123');
console.log(data.name); // logs the name of the user with ID 123

const response = await client.post<{ success: boolean }>('/users', { name: 'John Doe' });
console.log(response.success); 
```

