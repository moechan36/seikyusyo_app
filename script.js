// 入力フォーム → プレビューへ値を渡す
function goPreview() {
  const data = {
    clientName: document.getElementById("clientName").value,
    subject: document.getElementById("subject").value,
    workDate: document.getElementById("workDate").value,
    invoiceNo: document.getElementById("invoiceNo").value,
    invoiceDate: document.getElementById("invoiceDate").value,
    details: []
  };

  // 明細10行
  for (let i = 1; i <= 10; i++) {
    data.details.push({
      item: document.getElementById("item" + i).value,
      qty: document.getElementById("qty" + i).value,
      unit: document.getElementById("unit" + i).value,
      price: document.getElementById("price" + i).value
    });
  }

  localStorage.setItem("invoiceData", JSON.stringify(data));

  window.location.href = "invoice_layout.html";
}

// ■ プレビュー画面：値を反映
if (location.pathname.includes("invoice_layout.html")) {
  const data = JSON.parse(localStorage.getItem("invoiceData") || "{}");

  document.getElementById("client-name").textContent = data.clientName || "";
  document.getElementById("subject").textContent = data.subject || "";
  document.getElementById("work-date").textContent = data.workDate || "";
  document.getElementById("inv-no").textContent = data.invoiceNo || "";
  document.getElementById("inv-date").textContent = data.invoiceDate || "";

  const tbody = document.getElementById("details-body");

  let subtotal = 0;

  data.details.forEach((row) => {
    if (!row.item && !row.qty && !row.unit && !row.price) return;

    const qty = Number(row.qty || 0);
    const price = Number(row.price || 0);
    const amount = qty * price;
    subtotal += amount;

    tbody.innerHTML += `
      <tr>
        <td>${row.item}</td>
        <td style="text-align:right;">${qty}</td>
        <td>${row.unit}</td>
        <td style="text-align:right;">${price ? price.toLocaleString() : ""}</td>
        <td style="text-align:right;">${amount ? amount.toLocaleString() : ""}</td>
      </tr>
    `;
  });

  document.getElementById("subtotal").textContent = subtotal.toLocaleString();
  document.getElementById("total").textContent = subtotal.toLocaleString();
}

// ■ PDF生成（ボタン消去 + スクロール対策付き）
async function createPDF() {
  const element = document.getElementById("invoice-layout");
  const btn = document.querySelector(".no-print");

  // ボタン一時消去
  if (btn) btn.style.display = "none";

  // スクロール位置を固定
  window.scrollTo(0, 0);

  // 高画質キャプチャ
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true
  });

  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const imgHeight = canvas.height * (imgWidth / canvas.width);

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save("invoice.pdf");

  // ボタン復帰
  if (btn) btn.style.display = "block";
}
