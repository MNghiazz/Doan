document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('http://localhost:3000/api/v1/users/account', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load user profile');
        }

        const user = await response.json();
        console.log(user);
        document.querySelector('input[name="name"]').value = user.name;
        document.querySelector('input[name="email"]').value = user.email;
        document.querySelector('input[name="phone"]').value = user.phone;
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});


document.getElementById('profileForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    
    try {
        const response = await fetch('http://localhost:3000/api/v1/users/update-profile', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Cập nhật thông tin thất bại');
        }

        alert('Cập nhật thông tin thành công');
    } catch (error) {
        alert(error.message);
    }
});
