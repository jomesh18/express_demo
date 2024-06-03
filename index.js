const express = require('express');
const logger = require('./logger');
const authenticator = require('./authenticator');
const Joi = require('joi');
const morgan = require('morgan');

const app = express();

console.log(`NODE_ENV is ${process.env.NODE_ENV}`);
console.log(`env is ${app.get('env')}`);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.use(logger);
app.use(authenticator);

if (process.env.NODE_ENV === 'development'){
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');
}

const courses = [
    {id: 1, name: "course1"},
    {id: 2, name: "course2"},
    {id: 3, name: "course3"},
];

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not found');
    res.send(course);
});

const validate_course = (course) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);
}
app.post('/api/courses', (req, res) => {

    let { error } = validate_course(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const course = { 
        id: courses.length+1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not found');

    let { error } = validate_course(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    course["name"] = req.body.name;
    return res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not found');

    let i = courses.indexOf(course);
    courses.splice(i, 1);
    return res.send(course);
});

port = process.env.PORT || 3000;
console.log(`Port is ${port}`, process.env.PORT);
app.listen(port, console.log(`Listening on port ${port}`));
