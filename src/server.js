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
const enlistController = require('./controllers/enlistController');
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
  next();
});


// Routing


app.use('/login', loginController);
app.use('/register', registerController);
app.use('/auth/enlist', enlistController);
app.use('/', (req, res, next) => {
  return res.render('index');
});

app.use((req, res, next) => {
  return res.render('error', { message: 'You are not permited' });
});

app.listen(port, () => {
  console.log('App running on : ', port);
});