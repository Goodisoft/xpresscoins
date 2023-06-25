


const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');


const transport = nodemailer.createTransport({
  host: process.env.HOST_NAME,
  port: process.env.EMAIL_PORT,
  // service: 'gmail',
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_KEY,
  }
});

const sendBulkEmail = (receivers, subject, content) => {
    const template_dir = path.join(__dirname, '/email');
  ejs.renderFile(template_dir+'/bulk_email_template.ejs', { subject, content }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      var mailOptions = { 
        from: process.env.EMAIL_USER,
        to: receivers,
        subject: subject,
        html: data
      };

      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        // console.log('Message sent: %s', info);
      });
    }
  });
};





module.exports = {
    sendBulkEmail
};