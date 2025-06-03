const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://paytm:Hello%40123@paytm.uzafkht.mongodb.net/PayTM");

const schema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    balance: {
        type: Number,
        default: 1000,
        required: true,
    }
});

const User = mongoose.model('User', schema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {
    User,
    Account,
};
