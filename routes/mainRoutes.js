const express = require("express");
const router = express.Router();
const fs = require("fs");

const DATA_FILE = "logs.json";

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
    });
  });

router.route("/:id")
  .patch((req, res) => {
    const id = req.params.id;
    const content = req.body.content;

    fs.readFile(DATA_FILE, "utf8", (err, data) => {
      if (err) {
        res.status(500).json({ error: "파일 읽기 실패" });
        console.log(err);
        return;
      }
      let logs = JSON.parse(data);

      const targetIndex = logs.findIndex(log => log.id === Number(id));

      if (targetIndex !== -1) {
        logs[targetIndex].content = content;

        fs.writeFile(DATA_FILE, JSON.stringify(logs, null, 2), (err) => {
          if (err) {
            res.status(500).json({ error: "저장 실패" });
            console.log(err);
            return;
          }
          res.json({ message: "수정 완료!" });
        });
      }
      else {
        res.status(404).json({ message: "해당 번호의 로그가 없어요." });
      }
    });
  })

  .delete((req, res) => {
    const id = req.params.id;

    fs.readFile(DATA_FILE, "utf-8", (err, data) => {
      if (err) {
        res.status(500).json({ error: "파일 읽기 실패" });
        console.log(err);
        return;
      }
      let logs = JSON.parse(data);

      const newLogs = logs.filter(log => log.id !== Number(id));

      if (logs.length === newLogs.length) {
        return res.status(404).json({ message: "삭제할 로그가 없어요." });
      }
      fs.writeFile(DATA_FILE, JSON.stringify(newLogs, null, 2), (err) => {
        if (err) {
          res.status(500).json({ error: "저장 실패" });
          return;
        }
        res.json({ message: "삭제 완료" });
      });
    });
  });

module.exports = router;