const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    blog_id: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    commentText: { type: String, required: true },
    time_stamp: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Comment', commentSchema);