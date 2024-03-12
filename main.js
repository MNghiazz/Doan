const scrollContainer = document.querySelector('.RA-books');
const scrollLeftBtn = document.querySelector('.scroll-left-btn');
const scrollRightBtn = document.querySelector('.scroll-right-btn');

scrollContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY;
});
