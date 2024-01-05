const { DateTime } = require('luxon');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    category: {type: String, required: [true, 'category is required'], enum: ['Projects', 'Study', 'Games', 'Movies', 'Sports', 'Other']},
    title: {type: String, required: [true, 'title is required']},
    hostname: {type: Schema.Types.ObjectId, ref:'User'},
    details: {type: String, required: [true, 'details is required'], minLength: [10, 'the content should have at least 10 characters']},
    location: {type: String, required: [true, 'location is required']},
    startDateTime: {type: Date, required: [true, 'Start date is required']},
    endDateTime: {type: Date, required: [true, 'End date is required']},
    image: {type: String, required: [true, 'image is required']},
},
{timestamps: true}
);

module.exports = mongoose.model('Event', eventSchema);