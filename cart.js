
import { fetchData, url } from "../api.js";


const title = document.querySelector('.cart-title');

const listItem = document.querySelector('.table-container .list-item');

function displayBooksInCart() {
    var storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    console.log("Books in Cart:");
        storedBooks.forEach(function(bookId, index) {
            console.log(`${index + 1}. Book ID: ${bookId}`);
        });
    
    if (storedBooks.length === 0) {
        title.innerHTML = 'Bạn chưa chọn sách';
    } else {
        title.innerHTML = 'Sách đã chọn'
        storedBooks.forEach(function(bookId, index) {
            fetchData(url.productsId(bookId),null,  function(bookDetail) {
                const {
                        id, 
                        name,
                        image, 
                        author : { name: authorName, id: authorId},
                        category : [{name: categoryName, id: categoryId}],
                        numReviews
                } = bookDetail;

                const card = document.createElement('li');
                card.classList.add('item');
                card.dataset.bookid = id;

                const categoriesContainer = document.createElement('div'); // Create a container for categories
                categoriesContainer.classList.add('categories');

                bookDetail.category.forEach(categoryItem  => {

                    const categoryLink = document.createElement('span');
                    categoryLink.classList.add("category");
                    categoryLink.textContent = categoryItem.name;
                    categoriesContainer.appendChild(categoryLink);

                    const divider = document.createElement('em');
                    divider.innerHTML = `|`;
                    categoriesContainer.appendChild(divider);
                })

                card.innerHTML = `
                    <img src="${image}" class="book-images">
                    <div class="book-details">
                        <p class="book-info">
                            <span class="book-name">${name}</span>
                            <span class="author-name">${authorName}</span>
                            
                        </p>
                        <div class="btn btn-danger delete-button">Xóa</div>
                    </div>
                `;

                card.querySelector('.book-details').appendChild(categoriesContainer);
                listItem.appendChild(card);

                
                

                const divider_y = document.createElement('div');
                divider_y.classList.add('divider-y');
                listItem.appendChild(divider_y);

                card.querySelector('.delete-button').addEventListener('click', function() {
                    removeBookFromCart(id);
                })

                
            });
        });
    }
}

displayBooksInCart();


function removeBookFromCart(bookIdToRemove) {
    try {
        var storedBooks = JSON.parse(localStorage.getItem('books')) || [];
        
        var indexToRemove = storedBooks.indexOf(bookIdToRemove);
        
        if (indexToRemove !== -1) {
            storedBooks.splice(indexToRemove, 1);
            localStorage.setItem('books', JSON.stringify(storedBooks));
            
            // Reload the page to reflect the changes
            window.location.reload();
        }
    } catch (error) {
        console.error("Error occurred while removing book from cart:", error);
    }
}


