const mongoose = require("mongoose")
// mongoose 定義資料的方式
const Schema = mongoose.Schema

const todoSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  isDone: {
    type: Boolean,
    default: false // 預設完成狀態為 false
  }
})
module.exports = mongoose.model("Todo", todoSchema)
