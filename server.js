const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Todo-list app server");
});

app.post("/name", (req, res) => {
  const { name } = req.body;
  if (name) {
    res.json({ name: name });
  } else {
    res.status(400).json({ error: "no name provided" });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
