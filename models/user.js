const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    mail_address: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    imgUrl: { type: String, default: 'https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg' },
    bio: { type: String, default: '' },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
});

userSchema.virtual('name').get(function () {
    return this.first_name + ' ' + this.last_name;
})

module.exports = mongoose.model('User', userSchema);