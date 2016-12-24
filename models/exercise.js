var mongoose = require('mongoose');

var ExerciseSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    muscles_worked : [String],
    force : [String],
    equipment : [String]
});

mongoose.model('Exercise', ExerciseSchema);