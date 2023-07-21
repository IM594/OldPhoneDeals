# OldPhoneDeals

This project is a eCommerce-Web-Application developed using react and express framework. The database is MongoDB. We use Apifox to manage our API.
Our final version of Assignment is in main branch.

- Website Preview:
<img width="1448" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/271d5e0d-cafc-4909-a0f1-8f4480581332">
<img width="1448" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/94061564-43d5-4a08-914a-d2fc96a5ab3e">
<img width="1448" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/dcadd894-2cb4-4ec4-b372-ddea2512248b">
<img width="1447" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/9257b47d-12ae-4285-859a-76bd4922d3ca">
<img width="1448" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/1b7c9f43-c3b3-4467-aab6-46e82dfbd6e8">
<img width="1448" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/85a4d8f1-b9e7-46ca-ac21-26048562235d">
<img width="1448" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/4fe4df1f-6e66-4405-8fd1-2efe2f1c0115">
<img width="1448" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/3665494f-af71-42be-a3c4-17795f5bdbcd">
<img width="1448" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/ee9b0aaa-5e4a-4f08-af14-2120948bbd47">
<img width="1448" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/576c88b2-3576-4536-b7b8-c7188742f60a">
<img width="1448" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/2304369d-9b2f-4995-b3af-68139a538e52">
<img width="1448" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/471b3ce8-19c4-4531-943c-402450b5bbd5">
<img width="1448" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/3954ef3f-3f1a-4727-bbf8-b3690fc0e515">




- On the front end:
  - We build with react and mui and use axios for front and back end communication. After a successful user login, the login information (including token) is stored in localstorage and cleared accordingly after logging out.

- On the back end:
  - We use the `Express` framework and a `mongodb` database.
  - We add `cors` on the back end to ensure front and back end communication
  - We use `.env` to store sensitive information (although for debugging purposes we also upload this file to avoid testing failures by the teacher team)
  - We do data processing on the back end, such as correlating queries to the database and splicing firstname and lastname, calculating average product ratings, querying the order data table based on login information and correlating queries to other data tables to return easier-to-use data, and so on.
  - We use `jwt` to authenticate users and restrict illegal actions.
  - We use `bcrypt` to encrypt the password entered by the user, with a `salt` value of 10. Before saving to the database, we check the password again, including checking that the password format is legal. Once everything is in order, an `encryption` operation is performed and then stored in the database.
  - We use `nodemailer` to send emails to users, taking care of firewall settings when running locally. We send emails depending on the scenario, including verifying that the email is the person, verifying a password reset request, sending a registration success email, and sending an email that the password has been changed.
  - We also restrict users from changing personal information on the back end, for example only logged in users can change their personal information (decoded from the token returned by the front end and then judged)
  - We also have restrictions on adding comments on the back-end, so that only users who have purchased can comment on products and only once.
  - ……


- Some tips:
  - In "Phone adding" page, please enter `Apple` or `LG` or `Samsung` or other existing phone brand in `Brand`, or it will throw error because of phone image not found.(Because we generate phone image based on brand.)
  - If you are unable to receive emails, there are several possibilities: 1. the incoming emails are being treated as spam; 2. the outlook mailbox configured in the `.env` file is locked for various reasons; 3. your network is set up with a firewall that blocks specific ports.
  
## Getting Started

### Prototyping

- We use `MockingBot (墨刀)` (a prototyping software similar to Figma) for the initial prototyping.

  - MockingBot Link: https://modao.cc/proto/UrBb2azlrtek4exL3nCl49/sharing?view_mode=read_only

- We use `Apifox` for the api management and testing.

  - Apifox Link (API document): https://apifox.com/apidoc/shared-1a014434-d87b-428d-991c-08fb05b22477


### Prerequisites

`Node.js` and `Mongodb`.



### Installing

Run `npm install` in the root directory

```
npm install
```

Run `yarn install` in the frontend directory

```
cd frontend
yarn install
```


### Database configuration

The database needs to be set up in .env in the root directory.

You need to change the value of `MONGO_URI` in `.env` for connecting to the mongodb database. The following is our current `MONGO_URI`.

`MONGO_URI = mongodb+srv://group7:group7@comp5347-group7.taavens.mongodb.net/oldphonedeals?retryWrites=true&w=majority`



if you want to connect to your own database, please refer to Mongodb Atlas website and follow its steps:
<img width="900" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/e2c97ca0-c083-4363-a807-42559ebd1286">
<img width="900" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/f2d5a8a6-786b-4844-aae5-097bda91c2f7">
<img width="900" alt="image" src="https://media.github.sydney.edu.au/user/15828/files/92921f98-263e-479f-9016-8e7664926895">



## Running the tests

### Start frontend and backend synchronously

```
npm run dev
```

### Start frontend indepently

```
npm run client
```

or

```
cd frontend
yarn start
```

### Start backend independtly

```
npm run server
```

or

```
npm run start
```


## Deployment

No deployment yet.




## Built With

* [React](https://react.dev/) - The frontend framework
* [Express](https://expressjs.com/) - The backend framework
* [MongoDB](https://www.mongodb.com/) - Database
* [Apifox](https://apifox.com/) - API management


