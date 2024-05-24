function getChapterIndex() {
  const currenHref = window.location.href;
  const url = new URL(currenHref);
  const chapterIndex = url.searchParams.get("chapter");
  console.log("Chapter Index: ", chapterIndex);
  return chapterIndex;
}
const chapterIndex = getChapterIndex();

var url =
  "https://firebasestorage.googleapis.com/v0/b/library-web-c1d9a.appspot.com/o/Kafka%20ben%20bo%20bien%20-%20Haruki%20Murakami.pdf?alt=media&token=6df0b6b4-2542-4dd9-b630-d90e73907603";

// Load thư viện PDF.js
var { pdfjsLib } = globalThis;

// Xác định worker của PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.mjs";

var pdfDoc = null,
  pageNum = 1,
  pageRendering = false,
  pageNumPending = null,
  scale = 1.8,
  canvas = document.getElementById("pdf-canvas"),
  ctx = canvas.getContext("2d");

if (chapterIndex) {
  pageNum = chapterIndex;
}
/**
 * Lấy dữ liệu trang từ file PDF, điều chỉnh kích thước canvas, và render trang
 * @param num Page number
 */
function renderPage(num) {
  pageRendering = true;
  pdfDoc.getPage(num).then(function (page) {
    var viewport = page.getViewport({ scale: scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render trang PDF vào canvas
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    var renderTask = page.render(renderContext);

    // Đợi cho việc render hoàn thành
    renderTask.promise.then(function () {
      pageRendering = false;
      if (pageNumPending !== null) {
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });
  // Cập nhật trang hiện tại lên giao diện
  document.getElementById("page_num").textContent = num;
}

/**
 * Nếu có trang đang được render thì đợi cho đến khi render hoàn thành.
 * Ngược lại, thực hiện render naay.
 */
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Hiển thị trang trước
 */
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}
document.getElementById("prev").addEventListener("click", onPrevPage);

/**
 * Hiển thị trang sau
 */
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}
document.getElementById("next").addEventListener("click", onNextPage);

/**
 * Tải PDF bất đồng bộ
 */
pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
  pdfDoc = pdfDoc_;
  document.getElementById("page_count").textContent = pdfDoc.numPages;

  // Hiển thị trang đầu tiên
  renderPage(pageNum);
});
