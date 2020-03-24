const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username: String,
    password: String
});
const userModel = mongoose.model('userList', userSchema);
const loginAuth = async (ctx, next) => {
    // if()
    // userModel.find()
    const body = ctx.request.body;
    const un = await userModel.findOne({ 'username': body.query.username });
    console.log(un, 'un');
    
}