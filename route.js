

 import { error404 } from "./main.js";

const defaultPage = "#/index.html";

const selectedProduct = query => productPage(...query);

const routes = new Map([
    ["/product_page/product_page.html", selectedProduct],
    
]);

const checkHash = function () {
    const path = window.location.pathname; // Get the part of the URL after the port and before the query parameters
    const parts = path.split('/'); // Split the path into parts based on '/'
    const desiredPart = parts.slice(2).join('/');
    console.log(desiredPart);

    const [route, query] = desiredPart.includes ? desiredPart.split("?") : [desiredPart];

    routes.get(route) ? routes.get(route)(query) : error404()
}

window.addEventListener("hashchange", checkHash);


window.addEventListener("load", function(){ 
    if( !window.location.hash) {
        window.location.hash = "/index.html";
    } else {
        checkHash();
    }
});