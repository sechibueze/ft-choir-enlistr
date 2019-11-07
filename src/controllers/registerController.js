const express = require('express');
const otpg = require('otp-generator');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const Model = require('../models/model');
const Member = new Model('members');
const router = express.Router();
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_SECRET_KEY,
});



router.get('/', (req, res) => {
  if (req.session.member) {
    console.log('Redirected : ', req.session.member);
    const data = req.session.member;
    return res.render('register', { data });
  }

  return res.render('error', { message: 'You are gatecrashing' });
});


router.post('/', (req, res) => {
  // Remove the register value from submit button
  delete req.body['register'];

  // Organize the data
  const newData = req.body,
    sessionData = req.session.member;
  const member = { ...newData, ...sessionData };

  console.log('member :', member);
  // Generate OTP - One Time Password
  const otp = otpg.generate(6, { uppercase: false, specialChars: false });
  // Retrieve all member variables
  const { choir_id, firstname, surname, middlename, phone, team, part, gender, availability, accomodation } = member;

  // Build SQL Query
  const text = `INSERT INTO members (
    choir_id, firstname, surname, middlename, 
    phone, team, part, gender, availability, 
    accomodation, registered, otp) 
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
    RETURNING surname, phone, otp, choir_id`;

  const values = [
    choir_id, firstname, surname, middlename,
    phone, team, part, gender, availability,
    accomodation, true, otp
  ];
  Member.insertQuery(text, values)
    .then(({ rows }) => {


      // Take out leading zero phoneNumber = '89154678568
      const phoneNumberFilter = phone.replace(/^0+/, '');
      const code = 'NG';
      const phoneNumberFormat = phoneUtil.parse(phoneNumberFilter, code);
      const phoneNumber = phoneUtil.format(phoneNumberFormat, PNF.E164);

      const to = `${phoneNumber}`;
      const from = process.env.NEXMO_PHONE_NUMBER;
      const text = `
      IHD-${surname}-${choir_id}, 
      Your OTP is: ${otp};
      Please, come with this for verification`;
      const data = { from, to, text };
      console.log('data: ', data);
      nexmo.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
          console.log(err);
        } else {
          if (responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.", responseData.messages);
            req.session.member = null;
            return res.render('success', { message: text });
          } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
          }
        }
      });

    })
    .catch(e => {
      console.log('Error in inserting: ', e);
    });

});

module.exports = router;