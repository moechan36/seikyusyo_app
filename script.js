// 数量 × 単価 = 金額
function calc(i) {
  const qty = Number(document.getElementById("qty" + i).value || 0);
  const price = Number(document.getElementById("price" + i).value || 0);
  const amount = qty * price;

  document.getElementById("amount" + i).value =
    amount === 0 ? "" : amount.toLocaleString();
}


// PDF生成（画面を丸ごと画像としてPDF化 → 日本語も文字化けゼロ）
async function createPDF() {
  const element = document.body;

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;          // A4幅
  const imgHeight = canvas.height * (imgWidth / canvas.width);

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save("invoice.pdf");
}
