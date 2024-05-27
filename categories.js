import { fetchData, url } from "./api.js";

const categoriesPanel = document.querySelector('[categories-panel]');
categoriesPanel.innerHTML = `
    <div class="container mt-5">
        <div class="inner-categories row justify-content-md-center">
        </div>

    </div>
`

fetchData(url.categories(),null, function (categories) { 

    console.log(categories);

    categories.forEach(category => {
        const {
            id: headCategoryId,
            name: headCategoryName, 
            subcategories
        } = category;

        const card = document.createElement('ul');
        card.classList.add("categories-list", "col-sm-3");
        card.innerHTML = `
            <p class="head-category">${headCategoryName}</p>
                
        `;
        card.querySelector('.head-category').addEventListener('click', function() {
            // Navigate to product page with the ID of the clicked product
            window.location.href = `/tatcasach.html?category=${headCategoryId}`;
        });
        

        subcategories.forEach(subcategory => {
            const {
                id: subCategoryId,
                name: subCategoryName
            } = subcategory
            
            const subcard = document.createElement('li');
            subcard.classList.add("categorie");
            subcard.innerText = `${subCategoryName}`;
            
            subcard.addEventListener('click', function() {
                // Navigate to product page with the ID of the clicked product
                window.location.href = `/tatcasach.html?category=${subCategoryId}`;
            });

            card.appendChild(subcard);
        })

        categoriesPanel.querySelector('.inner-categories').appendChild(card);

    });
})