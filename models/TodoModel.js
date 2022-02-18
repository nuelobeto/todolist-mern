// require all the necessary packages...
const { Schema, model } = require("mongoose");

// Create the model
const TodoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const ToDo = model("Todo", TodoSchema);

// Export the model
module.exports = ToDo;
