function changeTab(tabIndex) {
    // Hide all content divs

    document.querySelector('.nav-wrap ul li.act').classList.remove('act');

    document.querySelectorAll('.nav-wrap ul li')[tabIndex - 1].classList.add('act');

    document.getElementById('bookContent').style.display = 'none';
    document.getElementById('catalogContent').style.display = 'none';
    
    
    // Show the selected content div based on the clicked link
    if (tabIndex === 1) {

        document.getElementById('bookContent').style.display = 'block';
    } else if (tabIndex === 2) {
        
        document.getElementById('catalogContent').style.display = 'block';
    }
}
