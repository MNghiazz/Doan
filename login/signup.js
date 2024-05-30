
document.addEventListener('DOMContentLoaded', function () {
const signupForm = document.getElementById('signupForm');
const successMessage = document.getElementById('successMessage');
const signup = document.querySelector('.signup');

signupForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const phone = document.getElementById('signupPhone').value;

    try {
        const response = await fetch('http://localhost:3000/api/v1/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phone })
        });
        const data = await response.json();
        console.log(data); // Handle response

        signup.style.display = 'none';
            
            // Display success message
        
        successMessage.style.display = 'block'; // Display the success message
    } catch (error) {
        console.error('Error:', error);
    }
});
});