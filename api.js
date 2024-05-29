


export const fetchData = function (URL, token = null,  callback) {
    const headers={};
    if(token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    fetch(`${URL}`, {
        headers: headers
    })
    .then(res => res.json())
    .then(data => callback(data));  
}

export const url = {
    products() {
        return `http://thuvien-bice.vercel.app/api/v1/products`
    },

    recentAddedProduct() {
        return `http://thuvien-bice.vercel.app/api/v1/products/recent`
    },

    categories() {
        return `http://thuvien-bice.vercel.app/api/v1/categories`
    },

    productWithCategories(id) {
        return `http://thuvien-bice.vercel.app/api/v1/products?categories=${id}`
    },

    productWithAuthor(id){
        return `http://thuvien-bice.vercel.app/api/v1/products?authors=${id}`
    },

    productsId(id) {
        return `http://thuvien-bice.vercel.app/api/v1/products/${id}`
    },

    userInf(id) {
        return `http://thuvien-bice.vercel.app/api/v1/users/${id}`
    },

    allUser() {
        return `http://thuvien-bice.vercel.app/api/v1/users`
    },

    orders(id) {
        return `http://thuvien-bice.vercel.app/api/v1/orders/user/${id}`
    },
    search(query) {
        return `http://thuvien-bice.vercel.app/api/v1/search?name=${query}`;
    }


}