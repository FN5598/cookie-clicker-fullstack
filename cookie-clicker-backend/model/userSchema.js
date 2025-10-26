const mongoose = require('mongoose');

const defaultFactories = [
    {
        _id: '68f7fb6481e2e8fee2e76185',
        name: 'Cursor',
        amount: 0,
        currentPrice: 15,
        startingPrice: 15,
        productionRate: 0.1
    },
    {
        _id: '68f7fd06396b3e920f9c4d95',
        name: 'Grandma',
        amount: 0,
        currentPrice: 100,
        startingPrice: 100,
        productionRate: 1
    },
    {
        _id: '68f7fd2c396b3e920f9c4d98',
        name: 'Farm',
        amount: 0,
        currentPrice: 1100,
        startingPrice: 1100,
        productionRate: 8
    }
];

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
            _id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                default: 0
            },
            currentPrice: {
                type: Number,
                required: true
            },
            startingPrice: {
                type: Number,
                required: true
            },
            productionRate: {
                type: Number,
                required: true
            }
        }
    ]
},
    {
        timestamps: true,
    });

userSchema.pre('save', function(next) {
    if (this.isNew && this.factories.length === 0) {
        this.factories = defaultFactories;
    }
    next();
});

module.exports = mongoose.model('User', userSchema);