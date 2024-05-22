
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('http://localhost:3000/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            console.log(data); // Handle response

            if (response.ok) {
                localStorage.setItem('token', data.token);
                // Redirect to the homepage
                window.location.href = '../index.html';
            }

        } catch (error) {
            console.error('Error:', error);
        }
    });
});

