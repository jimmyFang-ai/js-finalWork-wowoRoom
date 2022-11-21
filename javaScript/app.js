
// DOM
// 產品列表
const productWrap = document.querySelector('.productWrap');
// 產品下拉選單
const productSelect = document.querySelector('.productSelect');
// 購物車列表
const cartsList = document.querySelector('#shoppingCart-list');



// API基本路徑
let baseUrl = "https://livejs-api.hexschool.io";

// 儲存遠端資料
let productsData = [];
let cartsData = [];


// 初始化
function init() {
    // 取得產品列表
    getProducts();
    // 取得購物車列表
    getCarts();
};
init();


// util 工具
// 數字轉換千分位函式
function tothousands(num) {
    let parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};

// 計算總金額
function calcTotalPrice(data) {
    return tothousands(data.reduce((acc, cur) => acc + cur, 0));
};


// 資料處理
// 產品 -  取得產品列表
function getProducts() {
    axios.get(`${baseUrl}/api/livejs/v1/customer/jimmyji/products`)
        .then((res) => {
            productsData = res.data.products;
            renderProductsList(productsData);
            renderProductsOption(productsData);
        })
        .catch((error) => {
            console.log(error);
        })
};


// 產品 -  顯示產品列表
function renderProductsList(data) {
    productWrap.innerHTML = data.map((product) => {
        return `<li class="productCard" data-product-id="${product.id}">
        <h4 class="productType">${product.category}</h4>
        <img src="${product.images}" alt="${product.title}">
        <a href="#" class="addCardBtn">加入購物車</a>
        <h3>${product.title}</h3>
        <del class="originPrice">NT$${tothousands(product.origin_price)}</del>
        <p class="nowPrice">NT$${tothousands(product.price)}</p>
    </li>`
    }).join('');
};


// 產品 - 顯示 select 下拉選單選項
function renderProductsOption(data) {
    // 去除重複類別
    const options = Array.from(new Set(data.map((product) => product.category)));

    // 組下拉選項字串
    let optionsList = `<option value="全部" selected>全部</option>`;

    options.forEach((option) => {
        optionsList += `<option value="${option}">${option}</option>`
    });
    productSelect.innerHTML = optionsList;
};


// 產品 -  篩選產品類別
productSelect.addEventListener('click', (e) => {
    let productCategory = e.target.value;
    // 篩選產品類別
    const filterProducts = productsData.filter((product) => product.category === productCategory);
    productCategory === "全部" ? renderProductsList(productsData) : renderProductsList(filterProducts);
});




// 購物車 - 取得購物車列表
function getCarts() {
    axios.get(`${baseUrl}/api/livejs/v1/customer/jimmyji/carts`)
        .then((res) => {
            cartsData = res.data.carts;
            renderCartsList(cartsData);
        })
        .catch((error) => {
            console.log(error);
        })
};


// 購物車 - 顯示購物車列表
function renderCartsList(data) {

    // DOM - 取得最後購買產品總價
    const cartFinalTotal = document.querySelector('#cart-finalTotal');

    // 購物車產品金額
    const finalTotalAry = data.map((cart) => cart.product.price * cart.quantity);

    cartsList.innerHTML = data.map((cart) => {
        return `<tr data-cart-id=${cart.id}>
        <td>
        <div class="cardItem-title">
            <img src="${cart.product.images}" alt="${cart.product.title}">
            <p>${cart.product.title}</p>
        </div>
       </td>
        <td>NT$${tothousands(cart.product.price)}</td>
        <td>${cart.quantity}</td>
        <td>NT$${tothousands(cart.product.price * cart.quantity)}</td>
        <td class="discardBtn">
           <a href="#" class="material-icons"> clear </a>
        </td>
        </tr>`
    }).join('');


    // 顯示購物車內的產品總價
    cartFinalTotal.textContent = `NT$${calcTotalPrice(finalTotalAry)}`;
};
