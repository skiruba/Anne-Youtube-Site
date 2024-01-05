//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const eventsRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');


//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb+srv://networkbasedappdev:network51423@project3.klws3rv.mongodb.net/project3?retryWrites=true&w=majority';
app.set('view engine', 'ejs');

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    //start the server
    app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
});
})
.catch(err => console.log(err.message));

//mount middlware
app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb+srv://networkbasedappdev:network51423@project3.klws3rv.mongodb.net/project3?retryWrites=true&w=majority'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    if(req.session) {
        res.locals.user = req.session.user;
        res.locals.firstName = req.session.firstName;
    }
    next();
});

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//set up routes
app.use('/events', eventsRoutes);

app.use('/', mainRoutes);

app.use('/user', userRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ('Internet Server Error');
    }

    res.status(err.status);
    res.render('error', {error: err});
    });