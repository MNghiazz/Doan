

import { fetchData, url } from "./api.js";




const scrollContainer = document.querySelector('.RA-books');
const scrollLeftBtn = document.querySelector('.scroll-left-btn');
const scrollRightBtn = document.querySelector('.scroll-right-btn');
const errorContent = document.querySelector("[data-error-content]");

scrollContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY;
});



const product_grid = document.querySelector('[book-content]');

function fetchDataHomePage() {

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

window.addEventListener('load', fetchDataHomePage);



    export const error404 = function () {
        errorContent.style.display = "flex";
    }