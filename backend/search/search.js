document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');

    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const query = document.querySelector('input[name="search"]').value;

        try {
            const response = await fetch(`http://localhost:3000/api/v1/search?name=${query}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Tìm kiếm thất bại');
            }

            const results = await response.json();
            displaySearchResults(results);
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    });
});

function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = '';

    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<li>Không tìm thấy sách nào.</li>';
        return;
    }

    results.forEach(book => {
        const bookElement = document.createElement('li');
        bookElement.className = 'book-card';
        bookElement.innerHTML = `
            <div class="book-card">
                <img src="${book.image}" alt="${book.name}">
                <div class="book-info">
                    <h3>${book.name}</h3>
                    <p>Tác giả: ${book.author ? book.author.name : 'N/A'}</p>
                    <p>Thể loại: ${book.category ? book.category.name : 'N/A'}</p>
                </div>
            </div>
        `;
        searchResultsContainer.appendChild(bookElement);
    });
}
