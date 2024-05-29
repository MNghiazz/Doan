
import { fetchData, url } from "./api.js";




const userInfo = document.querySelector('header .user-info');
const logoutButton = document.getElementById('logoutButton');
const cartButton = document.querySelector('.header-actions .cart-button');
const allUserDiv = document.querySelector('.all-user');

const rentedSite = document.querySelector('.rentedBook');
const nyrSite = document.querySelector('#nyrBook');

rentedSite.addEventListener("click", function() {
    window.location.href = `/order.html?user=${userId}`;
});







logoutButton.addEventListener('click', logout);

    // Logout function
function logout() {
        localStorage.removeItem('token');
        window.location.href = './index.html'; // Redirect to the login page
}

const token = localStorage.getItem('token');
console.log(token);


let userId;
let isAdmin;

function fetchUserId(token) {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3000/api/v1/users/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            userId = data.userId;
            isAdmin = data.isAdmin;
            resolve({ userId, isAdmin });
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
            reject(error);
        });
    });
}

export async function ensureUserId() {
    if (!userId) {
        const token = localStorage.getItem('token');
        if (token) {
            await fetchUserId(token);
        }
    }
    return userId;
}

export function getUserId() {
    return userId;
}

export function getIsAdmin() {
    return isAdmin;
}

if (token) {
    fetchUserId(token).then(userInfo => {
        console.log(userInfo.userId); // This will log the correct userId

        


        fetchData(url.userInf(userInfo.userId), token, function (userInfoData) {
            const { name, avatar, isAdmin } = userInfoData;
            const avatarImg = './image/default-avatar-icon-of-social-media-user-vector.jpg';
            console.log(name);
            document.getElementById('user-name').innerHTML = name;

            if (avatar) {
                avatarImg.src = avatar;
            } else {
                avatarImg.src = './image/default-avatar-icon-of-social-media-user-vector.jpg';
            }
        });

        if (userInfo.isAdmin) {
            cartButton.style.display = 'none';
            allUserDiv.style.display = 'block';
        } else {
            cartButton.style.display = 'block';
            allUserDiv.style.display = 'none';
        }

    }).catch(error => {
        console.error('Error fetching user ID:', error);
    });
} else {
    userInfo.innerHTML = `<a href="./login/login.html">Login / Register</a>`;
}






