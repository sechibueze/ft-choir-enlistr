const express = require('express');
const Model = require('../models/model');
const Qualifier = new Model('qualifiers');
const router = express.Router();


router.get('/', (req, res) => {
  return res.render('login');
});

router.post('/', (req, res) => {
  const { choir_id } = req.body;

  const fields = `choir_id, surname`;
  const clause = `WHERE choir_id = '${choir_id}'`;
  Qualifier.select(fields, clause)
    .then(({ rows }) => {

      if (rows.length === 0) {
        return res.render('login', {
          message: 'Sorry, You have not been enlisted :('
        });
      }

      req.session.member = rows[0];

      return res.redirect('/register');

    })
    .catch(e => {
      return res.render('login', {
        message: 'Auth: Failed to login'
      });
    })

});

module.exports = router;