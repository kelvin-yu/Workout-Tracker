var mongoose = require('mongoose');

var WorkedExerciseSchema = new mongoose.Schema({
    exercise : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    sets : Number,
    reps : Number,
    weights : [Number]
});

mongoose.model('WorkedExercise', WorkedExerciseSchema);