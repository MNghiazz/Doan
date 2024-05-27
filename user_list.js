
import {fetchData, url} from './api.js'

const userList = document.querySelector('.user-list');

const token = localStorage.getItem('token');

fetchData(url.allUser(),token, function(allUsers) {
   
    allUsers.forEach(user => {
    const {
        id, 
        name,
        avatar, 
        phone,
    } = user;

    const card = document.createElement('li');
    card.classList.add('user');
    card.innerHTML = `
        <div class="user-info">

            <img class="rounded-circle shadow-4-strong" id="avatar" src="${avatar}">
            <span id="user-name" class="user-name"><strong></strong>${name}</span>
        
        </div>   
    `;

    if (avatar) {
        card.querySelector('#avatar').src = avatar;
    } else {
        card.querySelector('#avatar').src = './image/default-avatar-icon-of-social-media-user-vector.jpg';
    }
    card.addEventListener('click', function () {
        window.location.href = `/order.html?user=${id}`
    })

    userList.appendChild(card);

});


});