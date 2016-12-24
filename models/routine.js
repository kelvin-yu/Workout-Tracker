var mongoose = require('mongoose');

var RoutineSchema = new mongoose.Schema({
    creator: String,
    title: {
        type: String,
        required: true
    },
    created_at : {type: Date, default: Date.now},
    exercises: [{type: mongoose.Schema.Types.ObjectId, ref: 'Exercise'}]
});

mongoose.model('Routine', RoutineSchema);