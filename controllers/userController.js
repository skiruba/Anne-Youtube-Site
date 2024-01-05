const model = require('../models/user');
const Event = require('../models/event')

exports.signUp = (req, res) => {
    return res.render('./user/signUp');
};

exports.create = (req, res, next) => {
    let user = new model(req.body);
    user.save()
        .then(user => res.redirect('/user/login'))
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('/user/signUp');
            }

            if (err.code === 11000) {
                req.flash('error', 'Email has been used');
                return res.redirect('/user/signUp');
            }

            next(err);
        });
};

exports.loginPage = (req, res) => {
    return res.render('./user/login');
};

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log('Wrong email address');
                req.flash('error', 'Wrong email address');
                res.redirect('/user/login');
            } else {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id;
                            req.session.firstName = user.firstName;
                            req.flash('success', 'You have successfully logged in');
                            res.redirect('/user/profile');
                        } else {
                            req.flash('error', 'Wrong password');
                            res.redirect('/user/login');
                        }
                    });
            }
        })
        .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([model.findById(id), Event.find({ hostname: id })])
        .then(results => {
            const [user, events] = results;
            res.render('./user/profile', { user, events })
        })
        .catch(err => next(err));
};


exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err)
            return next(err);
        else
            res.redirect('/');
    });
};



