
import { fetchData, url } from "./api.js";



const userInfo = document.querySelector('header .user-info');
const logoutButton = document.getElementById('logoutButton');

function toggleLogoutButton() {
    logoutButton.style.display = logoutButton.style.display === 'none' ? 'block' : 'none';
}
userInfo.addEventListener('click', toggleLogoutButton);

logoutButton.addEventListener('click', logout);

    // Logout function
function logout() {
        localStorage.removeItem('token');
        window.location.href = '/index.html'; // Redirect to the login page
}

const token = localStorage.getItem('token');


let userId;

if(token) {

    fetch('http://localhost:3000/api/v1/users/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
     userId = data.userId;
     
     fetchData(url.userInf(userId), token,  function (userInfo)  {
        const { 
            name, 
            avatar,
        } = userInfo;
    
        const avatarImg = document.getElementById('avatar')
        console.log(avatar);
    
        if(avatar) {
            avatarImg.src = avatar;
        }else {
            avatarImg.src = './image/default-avatar-icon-of-social-media-user-vector.jpg'
        }
      });
  });


  
}else {
    userInfo.innerHTML = `<a href="./login/login.html">Login / Register</a>`
}


