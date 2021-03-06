const express = require('express');
const Model = require('../models/model');
const Qualifier = new Model('qualifiers');

const router = express.Router();

router.get('/', (req, res) => {
  return res.render('enlist');
});

router.post('/', (req, res) => {
  // const { choir_id, surname } = req.body;
  // const qualifier = { choir_id, surname };
  const choir_id = req.body.choir_id.toUpperCase();
  const surname = req.body.surname.toUpperCase();
  console.log('surname', req.body.surname.toUpperCase(), surname)
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

module.exports = router;