const list = document.getElementById("items");

function formatDate(value) {
  if (!value) return "等待首次更新";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "最近已更新" : `更新于 ${new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Shanghai" }).format(date)}`;
}

async function load() {
  try {
    const response = await fetch(`content.json?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error("load failed");
    const data = await response.json();
    document.getElementById("page-title").textContent = data.title || "群聊共创页";
    document.getElementById("subtitle").textContent = data.subtitle || "来自群聊的公开更新";
    document.getElementById("updated").textContent = formatDate(data.updated_at);
    const items = Array.isArray(data.items) ? data.items : [];
    document.getElementById("count").textContent = `${items.length} 条`;
    list.replaceChildren();
    for (const item of items) {
      const article = document.createElement("article");
      article.className = "item";
      const heading = document.createElement("h3");
      heading.textContent = item.title || "未命名";
      const body = document.createElement("p");
      body.textContent = item.body || "";
      const meta = document.createElement("div");
      meta.className = "item-meta";
      const author = document.createElement("span");
      author.textContent = item.author || "群成员";
      const time = document.createElement("span");
      time.textContent = formatDate(item.updated_at).replace("更新于 ", "");
      meta.append(author, time);
      article.append(heading, body, meta);
      list.append(article);
    }
    if (!items.length) list.innerHTML = '<p class="empty">还没有内容</p>';
  } catch (_) {
    list.textContent = "内容暂时无法加载，请稍后刷新。";
  }
}

load();
