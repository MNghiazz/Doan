import { fetchData, url } from "./api.js";
import { getUserId, ensureUserId, getIsAdmin } from "./user_info.js";

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user');


const pending = document.querySelector('.pending-anchor');
const borrowed = document.querySelector('.borrowed-anchor');
const nyr = document.querySelector('.nyr-anchor');

const pendingItem = document.querySelector('[pending] .item-list');
const rentedItem = document.querySelector('[borrowed] .item-list');
const nyrItem = document.querySelector('[nyr] .item-list');

const nyrAnchor = document.querySelector('.nyr-anchor').parentElement;

if(nyrItem) {
    console.log("nnnnn");
}else {
    console.log("ssss");
}





pending.addEventListener("click", function() {
    changeTab(1);
});
borrowed.addEventListener("click", function() {
    changeTab(2);
});
nyr.addEventListener("click", function() {
    changeTab(3);
});






async function displayItem() {
    const token = localStorage.getItem('token');
    await ensureUserId();
    const isAdmin = getIsAdmin();
    const ordersUrl = url.orders(userId);
    console.log("Fetching orders from:", ordersUrl);
    console.log("Using token:", token);

    fetchData(url.orders(userId), token, function(orders) {

        console.log("Fetched orders:", orders);
        orders.forEach(order => {
            order.orderItems.forEach(orderItemDetail => {
                console.log("Processing order item:", orderItemDetail);

                const productUrl = url.productsId(orderItemDetail.product);
                console.log("Fetching product from:", productUrl);
                fetchData(url.productsId(orderItemDetail.product), token, function(item) {
                    console.log("Fetched item:", item);
                    const {
                        id: productId, 
                        name,  
                        image, 
                        author: { name: authorName, id: authorId },
                        category
                    } = item;

                    const itemCard = document.createElement('li');
                    itemCard.classList.add('item');
                    itemCard.innerHTML = `
                        <img src="${image}" class="book-images">
                        <div class="book-details">
                            <p class="book-info">
                                <span class="book-name">${name}</span>
                                <span class="author-name">${authorName}</span>
                                <div class="categories"></div>
                            </p>
                            <button class="btn btn-danger btn-sm reject-btn">Từ chối</button>
                            <button class="btn btn-success btn-sm permit-btn">Cho mượn</button> 
                            <button class="btn btn-success btn-sm returned-btn" id="returned" style="display:none;">Đã trả sách</button>
                        </div>
                        <span class="date-borrow">Ngày mượn <i>${new Date(orderItemDetail.dateOrdered).toLocaleDateString()}</i></span>
                    `;

                    category.forEach(cat => {
                        const categoryLink = document.createElement('span');
                        categoryLink.classList.add("category");
                        categoryLink.textContent = cat.name;
                        itemCard.querySelector(".categories").appendChild(categoryLink);
                    });
                    
                    const rentButton = itemCard.querySelector('.permit-btn');
                    const rejectButton = itemCard.querySelector('.reject-btn');
                    const returnedButton = itemCard.querySelector('.returned-btn');

                    
                    


                    if (orderItemDetail.status === 'Pending') {
                        pendingItem.appendChild(itemCard);

                        itemCard.querySelector('.reject-btn').addEventListener('click', () => {
                            // Handle reject button click
                            deleteOrderItem(orderItemDetail._id, token, () => {
                                itemCard.remove();
                            });
                            
                        });

                    } else if (orderItemDetail.status === 'Rented') {
                        rentedItem.appendChild(itemCard);
                        itemCard.querySelector('.permit-btn').style.display = 'none';
                        itemCard.querySelector('.reject-btn').style.display = 'none';

                        

                        const nyrCard = itemCard.cloneNode(true); // Clone node for NYR section
                        nyrCard.querySelector('.permit-btn').style.display = 'none';
                        nyrCard.querySelector('.reject-btn').style.display = 'none';
                        nyrCard.querySelector('.returned-btn').style.display = 'block';
                        nyrItem.appendChild(nyrCard);

                        if (!isAdmin) {
                            nyrCard.querySelector('.permit-btn').style.display = 'none';
                            nyrCard.querySelector('.reject-btn').style.display = 'none';
                            nyrCard.querySelector('.returned-btn').style.display = 'none';
                        }

                        nyrCard.querySelector('.returned-btn').addEventListener('click', () => {
                            updateOrderItemStatus(orderItemDetail._id, 'Returned', token, () => {
                                nyrCard.remove(); // Remove the item from the current list
                                window.location.reload();
                            });
                        });

                    } else if (orderItemDetail.status === 'Returned') {
                        rentedItem.appendChild(itemCard);
                        itemCard.querySelector('.permit-btn').style.display = 'none';
                        itemCard.querySelector('.reject-btn').style.display = 'none';
                    }

                    

                    

                    rentButton.addEventListener('click', () => {
                        // Handle permit button click
                        console.log("Permit button clicked for:", item);
                        updateOrderItemStatus(orderItemDetail._id, 'Rented', token, () => {
                            itemCard.remove(); // Remove the item from the current list
                            rentedItem.appendChild(itemCard); // Append to the rented list
                        });

                    });

                    

                    

                });
            });
        });
    });
}


function updateOrderItemStatus(orderItemId, newStatus, token, callback) {
    fetch(`http://localhost:3000/api/v1/order-items/${orderItemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Order item status updated:", data);
            if (callback) callback(data);
        })
        .catch(error => {
            console.error("Error updating order item status:", error);
        });
}

function deleteOrderItem(orderItemId, token, callback) {
    fetch(`http://localhost:3000/api/v1/order-items/${orderItemId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Order item deleted:", data);
        if (callback) callback(data);
    })
    .catch(error => {
        console.error("Error deleting order item:", error);
    });
}



displayItem();



function changeTab(tabIndex) {
    // Hide all content divs

    document.querySelector('.order-table .nav-wrap ul li.act').classList.remove('act');

    document.querySelectorAll('.order-table .nav-wrap ul li')[tabIndex - 1].classList.add('act');

    document.getElementById('pending').style.display = 'none';
    document.getElementById('borrowed').style.display = 'none';
    document.getElementById('not-yet-returned').style.display = 'none';
    
    
    // Show the selected content div based on the clicked link
    if (tabIndex === 1) {

        document.getElementById('pending').style.display = 'block';
    }
    else if (tabIndex === 2) {
        
        document.getElementById('borrowed').style.display = 'block';
    }
    else if (tabIndex === 3) {
        document.getElementById('not-yet-returned').style.display = 'block';
    }
}

