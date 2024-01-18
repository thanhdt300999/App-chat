const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {Schema} = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
        default: null
    },
    cancelCount: {
      type: 'Number',
      default: 3,
    },
      isAdmin: {
        type: String,
      required: true,
          default: '0'
      }
  },
  { timestaps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
