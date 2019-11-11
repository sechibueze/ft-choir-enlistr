const express = require('express');
const xls2json = require("xls-to-json-lc");
const xlsx2json = require("xlsx-to-json-lc");
const format = require('pg-format');
const multer = require('multer');
const upload = multer({
  dest: 'src/controllers/uploads/'
});

const Model = require('../models/model');
const checkAdmin = require('../middlewares/checkAdmin');
const Qualifier = new Model('qualifiers');
const Member = new Model('members');
const router = express.Router();



router.get('/', checkAdmin, (req, res) => {
  Qualifier.select('choir_id, surname').then(({ rows }) => {

    const admin = req.adminRecord;
    if (rows.length === 0) {
      return res.render('admin', { message: `Success: No Qualifiers yet`, admin });
    } else {
      const data = rows;
      return res.render('admin', { message: `Success: Qualifiers `, data, admin });
    }

  }).catch(e => {
    return res.render('admin', { message: `Oops! Request Unprocessed` });
  });

});


router.get('/login', (req, res) => {
  return res.render('auth');
});
router.post('/login', (req, res) => {
  const admin = req.body;
  if (process.env.ADMIN_USERNAME === admin.username && process.env.ADMIN_PWD === admin.password) {
    req.session.auth = admin;
    return res.redirect('/auth');
  } else {
    return res.render('auth', { message: `Auth Failed` })
  }

});


router.get('/enlist', checkAdmin, (req, res) => {
  return res.render('enlist');
});
router.post('/enlist', checkAdmin, (req, res) => {

  const choir_id = req.body.choir_id.toUpperCase();
  const surname = req.body.surname.toUpperCase();

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

router.get('/uploads', checkAdmin, (req, res) => {
  const admin = req.adminRecord;

  return res.render('uploads', { admin });
});
router.post('/uploads', checkAdmin, upload.single('list'), (req, res) => {
  const admin = req.body;

  if (process.env.ADMIN_USERNAME === admin.username && process.env.ADMIN_PWD === admin.password) {

    let exceltojson = {};
    if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
      exceltojson = xlsx2json;
    } else {
      exceltojson = xls2json;
    }
    try {
      exceltojson({
        input: req.file.path,
        output: null,
        lowerCaseHeaders: true
      }, function (err, result) {
        if (err) {

          return res.render('error', { message: 'Error: Could Not Retrieve File Data' });
        }
        let pgSQL = format('INSERT INTO qualifiers (surname, choir_id) VALUES %L RETURNING *', result.map(record => Object.values(record)))

        Qualifier.insertBulk(pgSQL)
          .then(({ rows }) => {

            return res.redirect('/auth');

          }).catch(e => {
            return res.render('uploads', { message: 'Ensure No chorister is enlisted twice' })
          })

      });
    } catch (e) {
      return res.render('error', { message: 'Error: Corrupted file' });
    }

  } else {
    return res.redirect('/auth/login');
  }

});



router.get('/members', checkAdmin, (req, res) => {
  Member.select('*', 'WHERE registered = true')
    .then(({ rows }) => {
      const data = rows;
      const message = "List of Registered members";

      return res.render('members', { data, message });
    })
    .catch(e => res.render('members', { data, message: 'Cannot get memeber' }));

});


// Reset
router.get('/reset', checkAdmin, (req, res) => {
  return res.render('reset');
});

router.post('/reset', checkAdmin, (req, res) => {
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

router.get('/logout', (req, res) => {
  req.session.auth = null;
  return res.redirect('/auth/login');
});

module.exports = router;