const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const port = 3000;

if (!fs.existsSync("logs.json")) {
  fs.writeFileSync("logs.json", "[]");
}

app.use(express.json());

app.use("/main", require("./routes/mainRoutes"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.status(404).send("페이지가 없어.") // 라우터 버그낫을때
})

app.listen(port, () => {
  console.log(`http://localhost:${port}/`)
});
