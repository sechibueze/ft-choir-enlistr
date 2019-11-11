const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;


// Controllers
const loginController = require('./controllers/loginController');
const registerController = require('./controllers/registerController');
const confirmController = require('./controllers/confirmController');
// const resetController = require('./controllers/resetController');
const authController = require('./controllers/authController');

// Set up bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keepitsecret', saveUninitialized: false, resave: false }));

// Static assests
app.use(express.static(path.join(__dirname, '/public/')));
// views & view engine
app.set('views', path.join(__dirname, '/views/'));
app.set('view engine', 'ejs');
app.use((req, res, next) => {
  res.locals.data = {};
  res.locals.message = '';
  res.locals.admin = {};
  next();
});


// Routing


// app.use('/login', loginController);
app.use('/register', registerController);
app.use('/confirm', confirmController);
app.use('/', loginController);
// app.use('/reset', resetController);
app.use('/auth', authController);

app.use('/docs', (req, res, next) => {
  return res.render('docs');
});
app.use((req, res, next) => {
  return res.render('error', { message: 'Oops! It looks like you missed your way' });
});

app.listen(port, () => {
  console.log('App running on : ', port);
});