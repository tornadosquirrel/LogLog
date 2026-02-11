const log = document.getElementById("inp");
const write = document.getElementById("write");
const read = document.getElementById("read");
const show = document.getElementById("log");

write.addEventListener("click", () => {
  const text = log.value.trim();

  if (text === "") {
    log.placeholder = "뭐라도 써주세요.";
    return;
  }

  fetch("/main", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: text })
  })

    .then(res => res.json())
    .then(data => {
      log.value = "";
    });
});

read.addEventListener("click", () => {
  fetch("/main")
    .then(res => res.json())
    .then(data => {
      show.textContent = "";

      if (data.length === 0) {
        show.textContent = "저장된 기록이 없어요.";
        return;
      }

      data.forEach(item => {
        const line = document.createElement("div");

        line.textContent = `${item.id} ${item.date} ${item.content}`;

        show.appendChild(line);
      });
    });
});