var mongoose = require('mongoose');

var WorkoutSchema = new mongoose.Schema({
    creator : String,
    created_at : {type: Date, default: Date.now},
    routine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Routine',
        required: true
    },
    worked_exercises: [{type: mongoose.Schema.Types.ObjectId, ref: 'WorkedExercise'}]
});

mongoose.model('Workout', WorkoutSchema);