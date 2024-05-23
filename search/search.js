async function fetchSearchResults(query) {
    try {
        console.log(`Sending request to http://localhost:3000/api/v1/search?name=${query}`);
        const response = await fetch(`http://localhost:3000/api/v1/search?name=${query}`);
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const results = await response.json();
        console.log('Results:', results);
        displaySearchResults(results);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

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
                    <p>Tác giả: ${book.author.name}</p>
                    <p>Thể loại: ${book.category.map(c => c.name).join(', ')}</p>
                </div>
            </div>
        `;
        searchResultsContainer.appendChild(bookElement);
    });
}
