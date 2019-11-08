const express = require('express');
const Model = require('../models/model');
const Qualifier = new Model('qualifiers');
const Member = new Model('members');
const router = express.Router();

router.get('/enlist', (req, res) => {
  return res.render('enlist');
});
router.post('/enlist', (req, res) => {
  const { choir_id, surname } = req.body;
  const qualifier = { choir_id, surname };

  const text = `INSERT INTO qualifiers (choir_id, surname) VALUES ($1, $2) RETURNING choir_id, surname`;
  const values = [
    choir_id, surname
  ];
  Qualifier.insertQuery(text, values)
    .then(({ rows }) => {

      const data = {
        message: `Success: Enlisted ${rows[0].surname} with ${rows[0].choir_id} `
      };
      return res.render('enlist', data);
    }).catch(e => {
      return res.render('enlist', { message: `${req.body.choir_id} - ${req.body.surname} could not be enlisted` })
    });


});


router.get('/members', (req, res) => {
  Member.select('*', 'WHERE registered = true')
    .then(({ rows }) => {
      const data = rows;
      const message = "List of Registered members";
      // console.log('data : ', rows)
      return res.render('members', { data, message });
    })
    .catch(e => console.log('Cannot get memebers'));

});

// Reset
router.get('/reset', (req, res) => {
  return res.render('reset');
});

router.post('/reset', (req, res) => {
  console.log(req.body)
  if (req.body.table === 'qualifiers') {

    Qualifier.delete().then(result => {
      return res.render('reset', { message: `Success: Qualifiers table deleted` });
    }).catch(e => {
      return res.render('reset', { message: `Oops! Request Unprocessed` });
    });
  } else if (req.body.table === 'members') {
    Member.delete().then(result => {
      return res.render('reset', { message: `Success: Membership table deleted` });
    }).catch(e => {
      return res.render('reset', { message: `Oops! Request Unprocessed` });
    });
  } else {
    return res.render('reset', { message: `Be careful` });
  }

});



module.exports = router;