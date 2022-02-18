// require all the necessary packages...
const { Schema, model } = require("mongoose");

// Create the model
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", UserSchema);

// Export the model
module.exports = User;
