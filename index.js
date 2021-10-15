const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");

connectToMongo();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); //middleware to pass req.body

//Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/todo", require("./routes/todos"));

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
