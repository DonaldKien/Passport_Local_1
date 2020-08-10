let mongoose = require("mongoose");
let passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new mongoose.Schema({
	username: String,
	password: String
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("UserCollection", userSchema);