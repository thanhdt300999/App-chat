const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    pic: {
        type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-15.jpg'
    }
}, {
    timestamps: true
})
UserSchema.methods.matchPassword = async function (enteredPassword) {
    console.log(enteredPassword)
    console.log(this.password)
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;