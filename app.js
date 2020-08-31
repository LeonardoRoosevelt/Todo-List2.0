const express = require("express")
const app = express()
const port = 3000
const mongoose = require("mongoose")
const exphbs = require("express-handlebars")
// Todo資料
const Todo = require("./models/todo")

mongoose.connect("mongodb://localhost/todo-list", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on("error", () => {
  console.log("mongodb error!")
})

db.once("open", () => {
  console.log("mongodb success!")
})

app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" }))

app.set("view engine", "hbs")

app.get("/", (req, res) => {
  //拿到全部的Todo資料
  Todo.find()
    .lean()
    .then(todos => res.render("index", { todos: todos }))
    .catch(error => console.error(error))
  // res.render("index")
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
