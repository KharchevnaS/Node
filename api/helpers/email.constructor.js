const sgMail = require('@sendgrid/mail');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env')});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'ceyechky@i.ua',
  from: 'ceyechky@gmail.com',
  subject: 'HW 06. Email verification',
  text: 'HW 06: emailing with Node.js',
  html: '<a>please verify your email</a>',
};

async function main() {
  const result = await sgMail.send(msg);
  console.log(result);
}
main();
