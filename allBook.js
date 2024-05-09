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
    renderAllBooks();
}


function fetchDataWithAuthor() {
    
    

    fetchData(url.productWithAuthor(author), function (mainProduct) {

        for(let i =0; i < 20; i++) {
            const {
                id, 
                name, 
                description, 
                image, 
                author: { name: authorName, id: authorId},
                rating
            } = mainProduct[i];

            product_grid.querySelector('.title').innerText = `Sách có cùng tác giả: ${authorName}`;

            const card = document.createElement('li');
            card.innerHTML = `
            <div class="box-content">
                <div class="book-images">
                    <img src="${image}"  width="200" height="200" class="lazyloaded ">
                </div>
                <p class="title">${name}</p>
                <p class="author">${authorName}</p>
                <div class="rating-container">
                    <div class="desktop-only ratings">
                        <div class="rating-box">
                            <div class="rating" style="width: 87%;"></div>
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
            
        }
        
        

    });
}

function fetchDataCategory() {

    fetchData(url.productWithCategories(category), function (mainProduct) {

        for(let i =0; i < 20; i++) {
            const {
                id, 
                name, 
                description, 
                image, 
                author: { name: authorName, id: authorId},
                category : [{name: categoryName, id: categoryId}],
                rating
            } = mainProduct[i];

            product_grid.querySelector('.title').innerText = `Sách có cùng thể loại: ${categoryName}`;


            const card = document.createElement('li');
            card.innerHTML = `
            <div class="box-content">
                <div class="book-images">
                    <img src="${image}"  width="200" height="200" class="lazyloaded ">
                </div>
                <p class="title">${name}</p>
                <p class="author">${authorName}</p>
                <div class="rating-container">
                    <div class="desktop-only ratings">
                        <div class="rating-box">
                            <div class="rating" style="width: 87%;"></div>
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
            
        }
        
        

    });
}

function fetchDataAllBook() {

    fetchData(url.products(), function (mainProduct) {

        for(let i =0; i < 20; i++) {
            const {
                id, 
                name, 
                description, 
                image, 
                author: { name: authorName, id: authorId},
                rating
            } = mainProduct[i];

            const card = document.createElement('li');
            card.innerHTML = `
            <div class="box-content">
                <div class="book-images">
                    <img src="${image}"  width="200" height="200" class="lazyloaded ">
                </div>
                <p class="title">${name}</p>
                <p class="author">${authorName}</p>
                <div class="rating-container">
                    <div class="desktop-only ratings">
                        <div class="rating-box">
                            <div class="rating" style="width: 87%;"></div>
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
            
        }
        
        

    });
}



let thisPage = 1;
let limit = 20;
const list = document.querySelectorAll('.main-container .allBook .products-grid > li');


function changePage(i) {
    thisPage = i;
    Loading();
}

function Loading() {
    let beginGet = limit * (thisPage - 1);
    let endGet = limit * thisPage - 1;
    list.forEach((item, key) => {
        if (key >= beginGet && key <= endGet) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    listPage();
}
Loading();

function listPage() {
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
                <span class="sr-only" style>(current)</span>
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
            <a  aria-label="Next">
                <span aria-hidden="true">Trang cuối</span>
            </a>
        `;
        finalPage.addEventListener('click', () => changePage(count));
        listChapter.appendChild(finalPage);
    }
}



