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


// ▼ プレビュー画面：値を挿入
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
        <td style="text-align:right;">${qty || ""}</td>
        <td>${row.unit}</td>
        <td style="text-align:right;">${price ? price.toLocaleString() : ""}</td>
        <td style="text-align:right;">${amount ? amount.toLocaleString() : ""}</td>
      </tr>
    `;
  });

  document.getElementById("subtotal").textContent = subtotal.toLocaleString();
  document.getElementById("total").textContent = subtotal.toLocaleString();
}


// ▼ PDF生成（スマホ対応版）
async function createPDF() {
  const element = document.getElementById("invoice-layout");

  // 高解像度で画像化（スマホ対応）
  const canvas = await html2canvas(element, {
    scale: window.devicePixelRatio * 2,
    useCORS: true
  });

  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  // A4横幅に合わせる
  const imgWidth = 210;
  const imgHeight = canvas.height * (imgWidth / canvas.width);

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  // ▼ iPhone / iPad / iOS：直接保存すると壊れるため別タブで開く
  if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");  // 新しいタブでPDFを表示（Safari対応）
  } else {
    // PCは普通に保存
    pdf.save("invoice.pdf");
  }
}
