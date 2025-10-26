const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add username"]
    },
    email: {
        type: String,
        required: [true, "Please add email adress"],
        unique: [true, "Email adress is already taken"]
    },
    password: {
        type: String,
        required: [true, "Please create a password"]
    },
    refreshToken: {
        type: String
    },
    totalCookies: {
        type: Number,
        default: 0
    },
    factories: [
        {
            factory: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Factory'
            },
            amount: {
                type: Number,
                default: 0
            }
        }
    ]
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('User', userSchema);