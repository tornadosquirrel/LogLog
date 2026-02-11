const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const port = 3000;
const router = express.Router();

if (!fs.existsSync("logs.json")) {
  fs.writeFileSync("logs.json", "[]");
}

const DATA_FILE = "logs.json";

app.use(express.json());

router.route("/")
  .get((req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
      if (err) {
        res.status(500).json({ error: "파일 읽기 실패" });
        console.log(err);
        return;
      }
      res.json(JSON.parse(data));
    });
  })
  .post((req, res) => {
    const newLog = req.body.content;

    fs.readFile(DATA_FILE, "utf8", (err, data) => {
      if (err) {
        res.status(500).json({ error: "파일 읽기 실패" });
        console.log(err);
        return;
      }
      let logs = JSON.parse(data);

      const newId = logs.length > 0 ? logs[logs.length - 1].id + 1 : 1;

      logs.push({ id: newId, date: new Date().toLocaleString("ko-KR"), content: newLog });

      fs.writeFile(DATA_FILE, JSON.stringify(logs, null, 2), (err) => {
        if (err) {
          res.status(500).json({ error: "파일 읽기 실패" });
          console.log(err);
          return;
        }
        res.status(201).json({ message: "성공" })
      });
    })
  });

app.use("/main", router);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.status(404).send("페이지가 없어.") // 라우터 버그낫을때
})

app.listen(port, () => {
  console.log(`http://localhost:${port}/`)
});