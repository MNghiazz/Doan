
import { fetchData, url } from "../api.js";
import { getUserId, ensureUserId } from "./user_info.js";



const title = document.querySelector('.cart-title');

const listItem = document.querySelector('.table-container .list-item');
const submit = document.getElementById('confirm-rent');

function displayBooksInCart() {
    var storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    console.log("Books in Cart:");
        storedBooks.forEach(function(bookId, index) {
            console.log(`${index + 1}. Book ID: ${bookId}`);
        });
    
    if (storedBooks.length === 0) {
        title.innerHTML = 'Bạn chưa chọn sách';
        submit.style.display = 'none';
    } else {
        title.innerHTML = 'Sách đã chọn'
        submit.style.display = 'block';
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



async function postItemsToOrder(cartItems, token, userId) {
    try {
        let userOrders = await fetch(`http://localhost:3000/api/v1/orders/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json());

        console.log(userOrders.length);

        if (userOrders && userOrders.length > 0) {
            let userOrder = userOrders[0];

            const orderItemsIds = await Promise.all(cartItems.map(async itemId => {
                const newOrderItem = await fetch('http://localhost:3000/api/v1/order-items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ product: itemId })
                }).then(response => response.json());

                return newOrderItem._id;
            }));

            const updatedOrderItems = userOrder.orderItems.concat(orderItemsIds);

            await fetch(`http://localhost:3000/api/v1/orders/${userOrder._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ orderItems: updatedOrderItems })
            });

            console.log('Order updated successfully');
        } else {
            const orderItemsIds = await Promise.all(cartItems.map(async itemId => {
                const newOrderItem = await fetch('http://localhost:3000/api/v1/order-items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ product: itemId })
                }).then(response => response.json());

                return newOrderItem._id;
            }));

            const orderData = {
                orderItems: orderItemsIds,
                user: userId,
            };

            await fetch('http://localhost:3000/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            console.log('Order created successfully');
        }
    } catch (error) {
        console.error('Error posting items to order:', error.message);
        throw error;
    }
}


document.querySelector('.confirm-rent').addEventListener('click', async () => {
    await ensureUserId();
    const userId = getUserId();
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found. User might not be authenticated.');
        return;
    }
    try {
        const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
        
        
        // Post items from cart to order
        await postItemsToOrder(storedBooks,token, userId);
        
        // Optionally, clear the cart after posting items to order
        localStorage.removeItem('books');
        console.log('Cart cleared');
        
        location.reload();
    } catch (error) {
        console.error('Error confirming rent:', error.message);
        // Handle error
    }
});



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


