

import { fetchData, url } from "./api.js";





const scrollContainer = document.querySelector('.RA-books');
const scrollLeftBtn = document.querySelector('.scroll-left-btn');
const scrollRightBtn = document.querySelector('.scroll-right-btn');
const errorContent = document.querySelector("[data-error-content]");

const recentAdded = document.querySelector('.recent-list');

scrollContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY;
});

const token = localStorage.getItem('token');


function fetchRecentAdded() {
    fetchData(url.recentAddedProduct(), token, function(recentAddedBook) {
        recentAdded.innerHTML = '';
        const itemsToDisplay = recentAddedBook.slice(0, 7);
        itemsToDisplay.forEach(book => {
            const  {
                id,
                name, 
                description, 
                image, 
                author: { name: authorName, id: authorId},
                rating
            } = book;

            const card = document.createElement('div');
            card.classList.add('card', 'me-3', 'border-0');
            card.style.width = '180px';
            card.innerHTML = `
                <img src="${image}"  width="189" class="card-img-top" alt="A picture of ${name} book" name="${name}">
                <div class="card-body">
                    <p class="title mb-0">${name}</p>
                    <p class="author">${authorName}</p>
                </div>
            `;

            card.addEventListener('click', function() {
                // Navigate to product page with the ID of the clicked product
                window.location.href = `./product_page/product_page.html?id=${id}`;
            });

            recentAdded.appendChild(card);
        })
    })
}


const product_grid = document.querySelector('[book-content]');




function fetchDataHomePage() {

    fetchData(url.products(),token,  function (mainProduct) {
        product_grid.querySelector('.products-grid').innerHTML = '';
        const itemsToDisplay = mainProduct.slice(0, 20);
        itemsToDisplay.forEach(book => {
            const {
                id,
                name, 
                description, 
                image, 
                author: { name: authorName, id: authorId},
                rating
            } = book;

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
            
        });
        
        

    });
}

window.addEventListener('load', fetchDataHomePage(), fetchRecentAdded());



export const error404 = function () {
        errorContent.style.display = "none";
}