function getChapterInfo() {
  const currenHref = window.location.href;
  const url = new URL(currenHref);

  const bookTitle = url.searchParams.get("name");
  const chapterIndex = url.searchParams.get("startPage");
  const pdfUrl = url.searchParams.get("pdf");
  console.log("Book Title: ", bookTitle);
  console.log("PDF URL: ", pdfUrl);
  console.log("Chapter Index: ", chapterIndex);
  return { bookTitle, chapterIndex, pdfUrl };
}

function loadBookTitle({title}) {
  if (!title) {
    console.error("Title is required");
    return;
  }
  document.getElementById("book-title").innerText = title;
}

function loadPdfReader({url, chapterIndex}) {
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
    pageNum = parseInt(chapterIndex);
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
}

function loadPage() {
  const {bookTitle, chapterIndex, pdfUrl} = getChapterInfo();
  loadBookTitle({title: bookTitle});
  loadPdfReader({url: pdfUrl, chapterIndex: chapterIndex});
}
loadPage();
