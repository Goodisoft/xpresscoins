

 require('dotenv').config();

 const path = require('path');
 
 const express = require('express');
 const cookieParser = require('cookie-parser');
 const bodyParser = require('body-parser');
 
 
 const pageRoute = require('./src/routes/pagesRoute');
 const adminRoute = require('./src/routes/adminRoute');
 const authRoute = require('./src/routes/authRoute');
 const userRoute = require('./src/routes/userRoute');
 const {dbConnection} = require('./config/dbConnection');
 
 const app = express();
 
 const port = process.env.APP_PORT || 4400;
 
 
 
 // Use express json
 app.use(express.json());
 app.use(cookieParser());
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());
 
 
 // Register all the routea
 app.use(pageRoute);
 app.use('/account', adminRoute);
 app.use('/auth', authRoute);
 app.use('/user', userRoute); 
 
 
 // Set app view directory
 app.set('view engine', 'ejs');
 // Set static directory
 app.use(express.static(path.join(__dirname, '/public')));
 
 // DB connection
 dbConnection()
 .then(res => console.log('Connected'))
 .catch(error => console.log(error))
 
 
 app.listen(port, () =>{
     console.log('App is running on port', port);
 }) 
 
//  const crypto = require('crypto');
 
//  const str1 = crypto.randomBytes(180).toString('hex')
//  console.log(str1)

// //  Generate 4 unique code for user
//  let id = () => {
//     let code =  (Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
//     console.log(code.toLocaleUpperCase());
//   }  

// console.log(id());
// let d = Math.abs(new Date('2022-10-24T10:56:19.458Z').getTime() - new Date('2022-10-22T10:56:19.458Z').getTime())/1000
// console.log(d)

