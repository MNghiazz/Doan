

const pending = document.querySelector('.pending-anchor');
const borrowed = document.querySelector('.borrowed-anchor');
const nyr = document.querySelector('.nyr-anchor');



pending.addEventListener("click", function() {
    changeTab(1);
});
borrowed.addEventListener("click", function() {
    changeTab(2);
});
nyr.addEventListener("click", function() {
    changeTab(3);
});

S


function changeTab(tabIndex) {
    // Hide all content divs

    document.querySelector('.order-table .nav-wrap ul li.act').classList.remove('act');

    document.querySelectorAll('.order-table .nav-wrap ul li')[tabIndex - 1].classList.add('act');

    document.getElementById('pending').style.display = 'none';
    document.getElementById('borrowed').style.display = 'none';
    document.getElementById('not-yet-returned').style.display = 'none';
    
    
    // Show the selected content div based on the clicked link
    if (tabIndex === 1) {

        document.getElementById('pending').style.display = 'block';
    }
    else if (tabIndex === 2) {
        
        document.getElementById('borrowed').style.display = 'block';
    }
    else if (tabIndex === 3) {
        document.getElementById('not-yet-returned').style.display = 'block';
    }
}

