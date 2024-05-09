

import { fetchData, url } from "./api.js";


import jwt from 'jsonwebtoken';

const payload = jwt.verify(jwt, 'khong-biet-ghi-gi');

const userId = payload.sub;

console.log(userId);


const scrollContainer = document.querySelector('.RA-books');
const scrollLeftBtn = document.querySelector('.scroll-left-btn');
const scrollRightBtn = document.querySelector('.scroll-right-btn');
const errorContent = document.querySelector("[data-error-content]");

scrollContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY;
});



document.addEventListener('DOMContentLoaded', function () {
    const userSection = document.getElementById('user-info');

    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    if (token) {
        // Token exists, user is logged in
        // Fetch user data and display name and avatar
        fetchUserData(token);
    } else {
        // Token doesn't exist, user is not logged in
        // Hide user info section
        userSection.style.display = 'none';
    }
});

async function fetchUserData(token) {
    try {
        const response = await fetch('http://localhost:3000/api/v1/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        // Display user name and avatar
        document.getElementById('user-name').textContent = data.user.name;
        document.getElementById('avatar').src = data.user.avatar;
    } catch (error) {
        console.error('Error:', error);
    }
}





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