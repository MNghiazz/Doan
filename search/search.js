document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchResultsContainer = document.getElementById('searchResults');
    const searchInput = document.getElementById('searchInput');

    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Ngăn trang bị tải lại
        await fetchSearchResults(searchInput.value);
    });

    document.addEventListener('click', function(event) {
        if (!searchForm.contains(event.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });

    searchInput.addEventListener('focus', function() {
        if (searchResultsContainer.children.length > 0) {
            searchResultsContainer.style.display = 'block';
        }
    });
});

async function fetchSearchResults(query) {
    try {
        const token = localStorage.getItem('token'); // Lấy mã thông báo từ localStorage
        if (!token) {
            throw new Error('Token không tồn tại trong localStorage');
        }
        
        console.log(`Sending request to http://localhost:3000/api/v1/search?name=${query}`);
        const response = await fetch(`http://localhost:3000/api/v1/search?name=${query}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Đính kèm mã thông báo vào tiêu đề
            }
        });
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
        searchResultsContainer.style.display = 'block';
        return;
    }

    results.forEach(book => {
        const bookElement = document.createElement('li');
        bookElement.className = 'book-card';
        bookElement.innerHTML = `
            <img src="${book.image}" alt="${book.name}">
            <div class="book-info">
                <h3>${book.name}</h3>
                <p>Tác giả: ${book.author.name}</p>
                <p>Thể loại: ${book.category.map(c => c.name).join(', ')}</p>
            </div>
        `;
        bookElement.addEventListener('click', function() {
            // Điều hướng đến trang chi tiết sản phẩm với ID của sản phẩm được nhấp vào
            window.location.href = `/product_page/product_page.html?id=${book._id}`;
        });

        searchResultsContainer.appendChild(bookElement);
    });

    searchResultsContainer.style.display = 'block'; // Hiển thị danh sách kết quả sau khi đã thêm các phần tử
}
