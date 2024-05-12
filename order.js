function changeTab(tabIndex) {
    // Hide all content divs

    document.querySelector('.nav-wrap ul li.act').classList.remove('act');

    document.querySelectorAll('.nav-wrap ul li')[tabIndex - 1].classList.add('act');

    document.getElementById('pending').style.display = 'none';
    document.getElementById('borrowed').style.display = 'none';
    document.getElementById('not-yet-returned').style.display = 'none';
    
    
    // Show the selected content div based on the clicked link
    if (tabIndex === 1) {

        document.getElementById('pending').style.display = 'block';
    }else if (tabIndex === 2) {
        
        document.getElementById('borrowed').style.display = 'block';
    }else if (tabIndex === 3) {
        document.getElementById('not-yet-returned').style.display = 'block';
    }
}

const pending = document.querySelector('.order-table .pending');
const borrowed = document.querySelector('.order-table .borrowed');
const nyr = document.querySelector('.order-table .not-yet-returned');

pending.addEventListener('click', function() {
    changeTab(1);
});
borrowed.addEventListener('click', function() {
    changeTab(2);
});
nyr.addEventListener('click', function() {
    changeTab(3);
});