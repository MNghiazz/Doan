import { fetchData, url } from "./api.js";

const urlParams = new URLSearchParams(window.location.search);

// Check if the category or authors query parameters are present
const category = urlParams.get('category');
const author = urlParams.get('authors');

const product_grid = document.querySelector('[book-content]');

if (category) {
    // Case 2: Render books by category
    fetchDataCategory(category);
} else if (author) {
    // Case 3: Render books by author
    fetchDataWithAuthor(author);
} else {
    // Case 1: Render all books
    fetchDataAllBook();
}

function fetchDataWithAuthor(author) {
    fetchData(url.productWithAuthor(author), null, function (mainProduct) {
        displayBooks(mainProduct, `Sách có cùng tác giả: ${mainProduct[0]?.author.name}`);
    });
}

function fetchDataCategory(category) {
    fetchData(url.productWithCategories(category), null, function (mainProduct) {
        displayBooks(mainProduct, `Sách có cùng thể loại: ${mainProduct[0]?.category[0].name}`);
    });
}

function fetchDataAllBook() {
    fetchData(url.products(), null, function (mainProduct) {
        displayBooks(mainProduct);
    });
}

function displayBooks(books, title = 'Tất cả sách') {
    product_grid.querySelector('.title').innerText = title;
    product_grid.querySelector('.products-grid').innerHTML = ''; // Clear previous content
    books.forEach(book => {
        const {
            id, 
            name, 
            description, 
            image, 
            author: { name: authorName },
            rating
        } = book;

        const card = document.createElement('li');
        card.innerHTML = `
        <div class="box-content">
            <div class="book-images">
                <img src="${image}" width="200" height="200" class="lazyloaded">
            </div>
            <p class="title">${name}</p>
            <p class="author">${authorName}</p>
            <div class="rating-container">
                <div class="desktop-only ratings">
                    <div class="rating-box">
                        <div class="rating" style="width: ${rating * 20}%;"></div>
                    </div>
                </div>
            </div>
        </div>
        `;
        card.addEventListener('click', function() {
            // Navigate to product page with the ID of the clicked product
            window.location.href = `./product_page/product_page.html?id=${id}`;
        });

        product_grid.querySelector('.products-grid').appendChild(card);
    });

    // Update the list variable with the new items and call Loading
    updateListAndLoad();
}

function updateListAndLoad() {
    const list = document.querySelectorAll('.main-container .allBook .products-grid > li');
    Loading(list);
}

let thisPage = 1;
let limit = 20;

function changePage(i) {
    thisPage = i;
    Loading();
}

function Loading(list) {
    let beginGet = limit * (thisPage - 1);
    let endGet = limit * thisPage - 1;
    list.forEach((item, key) => {
        if (key >= beginGet && key <= endGet) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    listPage(list);
}

function listPage(list) {
    let count = Math.ceil(list.length / limit);
    const listChapter = document.querySelector('.pagination');

    // Clear existing pagination
    listChapter.innerHTML = '';

    if (thisPage != 1 && thisPage >= 4) {
        let firstPage = document.createElement('li');
        firstPage.innerHTML = `
        <a aria-label="Previous">
            <span aria-hidden="true">Trang đầu</span>
        </a>
        `;
        firstPage.addEventListener('click', function () {
            changePage(1);
        });
        listChapter.appendChild(firstPage);
    }

    if (thisPage != 1) {
        let prev = document.createElement('li');
        prev.innerHTML = `
            <a aria-label="Previous">
                <span aria-hidden="true">«</span>
            </a>
        `;
        prev.addEventListener('click', () => changePage(thisPage - 1));
        listChapter.appendChild(prev);
    }

    for (let i = 1; i <= count; i++) {
        let newPage = document.createElement('li');
        newPage.innerHTML = `
            <a>
                ${i}
                <span class="sr-only">(current)</span>
            </a>
        `;
        if (i == thisPage) {
            newPage.classList.add('active');
        }

        newPage.addEventListener('click', () => changePage(i));
        listChapter.appendChild(newPage);
    }

    if (thisPage != count) {
        let next = document.createElement('li');
        next.innerHTML = `
            <a aria-label="Next">
                <span aria-hidden="true">»</span>
            </a>
        `;
        next.addEventListener('click', () => changePage(thisPage + 1));
        listChapter.appendChild(next);
    }

    if (thisPage != count) {
        let finalPage = document.createElement('li');
        finalPage.innerHTML = `
            <a aria-label="Next">
                <span aria-hidden="true">Trang cuối</span>
            </a>
        `;
        finalPage.addEventListener('click', () => changePage(count));
        listChapter.appendChild(finalPage);
    }
}
