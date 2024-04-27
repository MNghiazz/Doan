


export const fetchData = function (URL, callback) {
    fetch(`${URL}`)
    .then(res => res.json())
    .then(data => callback(data));  
}

export const url = {
    products() {
        return `http://localhost:3000/api/v1/products`
    },

    categories() {
        return `http://localhost:3000/api/v1/categories`
    },
    productsId(id) {
        return `http://localhost:3000/api/v1/products/${id}`
    },
}