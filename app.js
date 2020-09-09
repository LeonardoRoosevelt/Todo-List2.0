const express = require("express")
const app = express()
const port = 3000
const mongoose = require("mongoose")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
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
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  //拿到全部的Todo資料 => controller  .find, .lean = model  .render = view
  Todo.find()
    .lean()
    .then(todos => res.render("index", { todos: todos }))
    .catch(error => console.error(error))
  // res.render("index")
})

app.get("/todos/new", (req, res) => {
  return res.render("new")
})

app.post("/todos", (req, res) => {
  const name = req.body.name
  // const todo = new Todo({ name: name })
  // return todo
  //   .save()
  //   .then(() => res.redirect("/"))
  //   .catch(error => console.error(error))
  return Todo.create({ name })
    .then(() => res.redirect("/"))
    .catch(error => console.error(error))
})

app.get("/todos/:id", (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render("detail", { todo }))
    .catch(error => console.error(error))
})

app.get("/todos/:id/edit", (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render("edit", { todo }))
    .catch(error => console.error(error))
})

app.post("/todos/:id/edit", (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === "on"
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.error(error))
})

app.post("/todos/:id/delete", (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(todo => res.redirect("/"))
    .catch(error => console.error(error))
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
