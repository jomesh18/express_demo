const express = require('express');
const logger = require('./middleware/logger');
const authenticator = require('./middleware/authenticator');
const config = require('config');
const morgan = require('morgan');
const appStartup = require('debug')('app:startup');
const dbStart = require('debug')('app:db');
const courses = require('./routes/courses');
const home = require('./routes/home');

const app = express();

// console.log(`NODE_ENV is ${process.env.NODE_ENV}`);
// console.log(`env is ${app.get('env')}`);

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.use(logger);
app.use(authenticator);
app.use('/api/courses', courses);
app.use('/', home);

//configuration
console.log('Name is '+config.get('name'));
console.log('Mail server is '+config.get('mail.host'));
console.log('Mail password is '+config.get('mail.password'));

if (process.env.NODE_ENV === 'development'){
    app.use(morgan('tiny'));
    appStartup('Morgan enabled...');
}

dbStart('Using db');

port = process.env.PORT || 3000;
// console.log(`Port is ${port}`, process.env.PORT);
app.listen(port, console.log(`Listening on port ${port}`));
