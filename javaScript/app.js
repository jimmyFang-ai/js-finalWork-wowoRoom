// DOM
// 產品列表
const productWrap = document.querySelector('.productWrap');
// 產品下拉選單
const productSelect = document.querySelector('.productSelect');
// 購物車列表
const cartsList = document.querySelector('#shoppingCart-list');
// 刪除全部購物車產品
const deleteCartsBtn = document.querySelector('.discardAllBtn');

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




// 資料處理
// 產品 -  取得產品列表
function getProducts() {
    axios.get(`${baseUrl}/api/livejs/v1/customer/${api_path}/products`)
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


// 產品 - 新增產品到購物車
productWrap.addEventListener('click', (e) => {
    e.preventDefault();

    // 只有點擊到加入購物車按鈕， 就取得 li 內的 產品 id
    if (e.target.getAttribute('class') !== "addCardBtn") return;

    // 產品數量(預設第一次新增產品的值)
    let productQty = 1;
    //  產品 id
    let productId = e.target.closest('li').dataset.productId;

    // 比對購物車內是否存在相同產品
    cartsData.forEach((cart) => {
        if (cart.product.id === productId) {
            productQty = cart.quantity += 1;
        };
    });

    // 新增產品到購物車
    addCartItem(productId, productQty);
});


// 購物車 - 取得購物車列表
function getCarts() {
    axios.get(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`)
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
           <a href="#" class="material-icons deleteCartBtn" > clear </a>
        </td>
        </tr>`
    }).join('');


    // 顯示購物車內的產品總價
    cartFinalTotal.textContent = `NT$${calcTotalPrice(finalTotalAry)}`;
};


// 購物車 - 新增產品
function addCartItem(productId, quantity) {
    axios.post(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`, {
        "data": {
            productId,
            quantity
        }
    })
        .then((res) => {
            cartsData = res.data.carts;
            renderCartsList(cartsData);
            swalMassage("已加入購物車", "success", 800);
        })
        .catch((error) => {
            console.log(error);
        })
};



// 購物車 - 功能整合(單筆刪除、修改數量)
cartsList.addEventListener('click', (e) => {
    e.preventDefault();

    if (e.target.nodeName !== "A") return;

    //  產品 id
    let cartId = e.target.closest('tr').dataset.cartId;
    console.log(cartId);


    //   單筆刪除
    if (e.target.classList.contains("deleteCartBtn")) {
        deleteCartItem(cartId);
    };

    // 修改數量
})


// 購物車 - 單筆刪除
function deleteCartItem(cartId) {
    axios.delete(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
        .then((res) => {
            cartsData = res.data.carts;
            renderCartsList(cartsData);
            swalMassage("已刪除單筆產品", "success", 800)
        })
        .catch((error) => {
            console.log(error);
        })
};



// 購物車 - 清空購物車
deleteCartsBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (cartsData.length > 0) {
        axios.delete(`${baseUrl}/api/livejs/v1/customer/${api_path}/carts`)
            .then((res) => {
                const { carts, message } = res.data
                cartsData = carts;
                renderCartsList(cartsData);
                swalMassage(message, 'success', 800);
            })
            .catch((error) => {
                console.log(error);
            })
    } else {
        e.target.setAttribute("disabled", "");
        swalMassage('購物車產品數量不得為 0', 'warning', 800);
    }
});
