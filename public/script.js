const log = document.getElementById("inp");
const write = document.getElementById("write");
const read = document.getElementById("read");
const show = document.getElementById("log");
const logId = document.getElementById("log-id");
const modify = document.getElementById("modify");
const remove = document.getElementById("remove");


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

modify.addEventListener("click", () => {
  const text = log.value.trim();
  const id = logId.value;

  if (id === "" || text === "") {  // 어차피 플레이스홀더는 아무것도 입력 안 했을 때만 있음 or로 연결하면 둘중 하나만 비워져있어도 예외처리 잘한것처럼보이는꼼수
    logId.placeholder = "수정할 로그 번호를 입력해주세요.";
    log.placeholder = "수정할 내용을 입력해주세요.";
    return;
  }

  fetch(`/main/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id, content: text })
  })

    .then(res => res.json())
    .then(data => {
      log.value = "";
      logId.value = "";
    });
});

remove.addEventListener("click", () => {
  const id = logId.value;

  if (id === "") {
    logId.placeholder = "삭제할 로그 번호를 입력해주세요.";
    return;
  }

  fetch(`/main/${id}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      log.value = "";
      logId.value = "";
    })
});
