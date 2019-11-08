const express = require('express');
const Model = require('../models/model');
const Member = new Model('members');
const router = express.Router();

router.get('/', (req, res) => {
  const data = [];
  return res.render('confirm', { data });
});
router.post('/', (req, res) => {
  const { otp, choir_id } = req.body;
  // AND otp = '${otp}'
  const clause = `WHERE choir_id = '${choir_id}'`;
  Member.select('*', clause)
    .then(({ rows }) => {
      const data = rows;
      if (data.length === 0) {
        return res.render('confirm', { message: 'Record Not found' });
      } else {
        const message = "Record Found";

        return res.render('confirm', { data, message });
      }


    })
    .catch(e => console.log('Cannot get memebers', e));

});

module.exports = router;