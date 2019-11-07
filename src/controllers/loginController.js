const express = require('express');
const Model = require('../models/model');
const Qualifier = new Model('qualifiers');
const router = express.Router();
// const memberList = [
//   {
//     id: 'ft-ch-001',
//     surname: 'Chibueze'
//   },
//   {
//     id: 'ft-ch-002',
//     surname: 'Olayiwola'
//   },
//   {
//     id: 'ft-ch-003',
//     surname: 'Oluwasegun'
//   },
//   {
//     id: 'ft-ch-004',
//     surname: 'Gbenga'
//   },
//   {
//     id: 'ft-ch-005',
//     surname: 'Olaniyi'
//   },
//   {
//     id: 'ft-ch-006',
//     surname: 'Waziri'
//   }
// ];

router.get('/', (req, res) => {
  return res.render('login');
});

router.post('/', (req, res) => {
  const { id } = req.body;

  // const foundMember = memberList.find(memberId => memberId.id === id);
  const fields = `choir_id, surname`;
  const clause = `WHERE choir_id = '${req.body.id}'`;
  Qualifier.select(fields, clause)
    .then(({ rows }) => {
      // console.log('found Member', rows);
      if (rows.length === 0) {
        return res.render('login', {
          message: 'You are not qualified to reegister'
        });
      }

      req.session.member = rows[0];

      return res.redirect('/register');

    })
    .catch(e => {
      return res.render('login', {
        message: 'Failed to login'
      });
    })

});

module.exports = router;