// 後台使用
const auth_token = "weyzH1bcy7OlBO4rWQR44F07FE23";


// 前台使用者
const userRequest = axios.create({
    baseURL: 'https://livejs-api.hexschool.io/api/livejs/v1/customer/testwoworoom/',
    headers: {
        'Content-Type': 'application/json',
    }
});

// 後台管理者
const adminRequest = axios.create({
    baseURL: 'https://livejs-api.hexschool.io/api/livejs/v1/admin/testwoworoom',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': auth_token,
    }
});


// 前台 
// 產品 API
export const apiGetProducts = () => userRequest.get('/products');
// 購物車 API
export const apiGetCarts = () => userRequest.get('/carts');
export const apiDeleteAllCarts = () => userRequest.delete('/carts');
export const apiAddCart = (data) => userRequest.post('/carts',data);
export const apiUpdateCart = (data) => userRequest.patch('/carts',data);
export const apiDeleteCart = (id) => userRequest.delete(`/carts/${id}`);
export const apiAddOrder = (data) => userRequest.post('/orders',data);


// 後台 - 訂單 API
export const apiGetOrders = () => adminRequest.get('/orders');
export const apiDeleteAllOrders = () => adminRequest.delete(`/orders`);
export const apiDeleteOrder = (id) => adminRequest.delete(`/orders/${id}`);
export const apiUpdateOrder  = (data) => adminRequest.put('/orders', data);


