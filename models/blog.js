const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, required: true, enum: ['Tech', 'Food', 'Lifestyle', 'Gaming', 'Fitness', 'Cars', 'Other'] },
    time_read: { type: Number, required: true},
    desc: { type: String, required: true },
    imgUrl: { type: String, required: false },
    content: { type: String, required: true },
    published: { type: Boolean, default: false },
    time_stamp: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Blog', blogSchema);