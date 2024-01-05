const { DateTime } = require('luxon');
const model = require('../models/event');

exports.index = (req, res, next) => {
    model.find()
    .then(events => res.render('./events/events', {events}))
    .catch(err => next(err));
};

exports.new = (req, res) => {
    res.render('./events/newEvent');
};

exports.create = (req, res, next) => {
    let event = new model(req.body);
    event.hostname = req.session.user;
    let filename = req.file.filename;

    let startDate = new Date(req.body.startDateTime);
    let endDate = new Date(req.body.endDateTime);

    event.image = "/images/" + filename;
    event.startDateTime = startDate;
    event.endDateTime = endDate;

    event.save()
    .then(events => res.redirect('/events'))
    .catch(err => {
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
    
};

exports.show = (req, res, next) => {
    let id = req.params.id;

    model.findById(id).populate('hostname', 'firstName lastName')
    .then(event => {
        if(event) {
            let startDate = DateTime.fromJSDate(event.startDateTime, {}).toLocaleString(DateTime.DATETIME_MED);
            let endDate = DateTime.fromJSDate(event.endDateTime, {}).toLocaleString(DateTime.DATETIME_MED);
            return res.render('./events/showEvent', {event, startDate, endDate});
        } else {
            let err = new Error('Cannot find event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;

    model.findById(id)
    .then(event => {
        if(event) {
            let startDate = DateTime.fromJSDate(event.startDateTime, {}).toISO({suppressMilliseconds: true, suppressSeconds: true, includeOffset: false});
            let endDate = DateTime.fromJSDate(event.endDateTime, {}).toISO({suppressMilliseconds: true, suppressSeconds: true, includeOffset: false});
            return res.render('./events/edit', {event, startDate, endDate});
        } else {
            let err = new Error('Cannot find event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;

    if(req.file) {
        let filename = req.file.filename;
        event.image = "/images/" + filename;
    }

    model.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
    .then(event => {
        if(event) {
            res.redirect('/events/'+id);
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        if(err.name === 'ValidationError')
        err.status = 400;
        next(err);
    });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(event => {
        if(event) {
            res.redirect('/events');
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
};

