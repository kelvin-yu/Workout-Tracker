var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    name: String,
    routines: [{type: mongoose.Schema.Types.ObjectId, ref: 'Routine'}],
    workouts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Workout'}],
    exercises: [{type: mongoose.Schema.Types.ObjectId, ref: 'Exercise'}]
});

//Before saving a user hash/rehash password
UserSchema.pre('save', function(callback){
    var user = this;
    //If the password hasn't been changed skip hashing step
    if(!user.isModified('password')) return callback();
    //Hash password
    bcrypt.genSalt(5, function(err, salt){
        if(err) return callback(err);
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

//Check if given password matches hash
UserSchema.methods.verifyPassword = function(password, callback){
    bcrypt.compare(password, this.password, function(err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch);
    });
};

mongoose.model('User', UserSchema);


