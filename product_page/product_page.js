function changeTab(tabIndex) {
    // Hide all content divs

    document.querySelector('.nav-wrap ul li.act').classList.remove('act');


    document.getElementById('bookContent').style.display = 'none';
    document.getElementById('catalogContent').style.display = 'none';
    
    
    // Show the selected content div based on the clicked link
    if (tabIndex === 1) {

        document.getElementById('bookContent').style.display = 'block';
    } else if (tabIndex === 2) {
        
        document.getElementById('catalogContent').style.display = 'block';
    }
}


let thisPage = 1;
let limit = 12;
const list =  document.querySelectorAll('.catalog-content-wrap .volume-wrap .volume .chapters > li');

function Loading() {
    let beginGet = limit * (thisPage - 1);
    let endGet = limit * thisPage - 1;
    list.forEach((item, key) =>{
        if(key >= beginGet && key <= endGet){
            item.style.display = 'block';
        }else {
            item.style.display = 'none';
        }
    });
    listPage(); 
}
Loading();



function listPage() {
    let count = Math.ceil(list.length / limit);
    const listChapter = document.querySelector('.pagination');
    listChapter.innerHTML = "";

    if(thisPage != 1 && thisPage >= 4) {
        let firstPage = document.createElement('li');
        firstPage.innerHTML = `
        <a aria-label="Previous">
            <span aria-hidden="true">Trang đầu</span>
        </a>
        `;
        firstPage.setAttribute('onclick', "changePage(" + 1 + ")");
        listChapter.appendChild(firstPage);
    }

    if(thisPage != 1) {
        let prev = document.createElement('li');
        prev.innerHTML = `
            <a aria-label="Previous">
                <span aria-hidden="true">«</span>
            </a>
        `;
        prev.setAttribute('onclick', "changePage(" + (thisPage - 1) + ")");
        listChapter.appendChild(prev);
    }
    
    for(i = 1; i <= count; i++) {
        let newPage = document.createElement('li');
        newPage.innerHTML = `
            <a>
                ${i}
                <span class="sr-only" style>(current)</span>
            </a>
        `;
        if(i == thisPage) {
            newPage.classList.add('active');
        }

        newPage.setAttribute('onclick', "changePage(" + i + ")");
        listChapter.appendChild(newPage);
    }

    if(thisPage != count) {
        let next = document.createElement('li');
        next.innerHTML = `
            <a aria-label="Next">
                <span aria-hidden="true">»</span>
            </a>
        `;
        next.setAttribute('onclick', "changePage(" + (thisPage + 1) + ")");
        listChapter.appendChild(next);
    }

    if(thisPage != count) {
        let finalPage = document.createElement('li');
        finalPage.innerHTML = `
            <a  aria-label="Next">
                <span aria-hidden="true">Trang cuối</span>
            </a>
        `;
        finalPage.setAttribute('onclick', "changePage(" + (count) + ")");
        listChapter.appendChild(finalPage);
    }
}

function changePage(i) {
    thisPage = i;
    Loading();
}


