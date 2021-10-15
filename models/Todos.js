const mongoose = require("mongoose");
const { Schema } = mongoose;

const TodosSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "Todo",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("todos", TodosSchema);
