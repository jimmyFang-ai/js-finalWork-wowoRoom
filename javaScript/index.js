// 匯入 共用工具
import * as utils from './utils.js';
// 匯入 共用 API
import * as api from './api.js';

// DOM
// 產品列表
const productWrap = document.querySelector('.productWrap');
// 產品下拉選單
const productSelect = document.querySelector('.productSelect');
// 購物車列表
const cartsList = document.querySelector('#shoppingCart-list');
// 刪除全部購物車產品
const deleteCartsBtn = document.querySelector('.discardAllBtn');
// 表單
const orderInfoForm = document.querySelector('.orderInfo-form');
const orderInfoBtn = document.querySelector('.orderInfo-btn');

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

// 產品 -  取得產品列表
function getProducts() {
    // loding 動畫載入
    utils.toggleLoading(true);
    api.apiGetProducts()
        .then((res) => {
            console.log(res);
            productsData = res.data.products;
            renderProductsList(productsData);
            renderProductsOption(productsData);
            setTimeout(() => utils.toggleLoading(false), 800);
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
        <del class="originPrice">NT$${utils.tothousands(product.origin_price)}</del>
        <p class="nowPrice">NT$${utils.tothousands(product.price)}</p>
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
    api.apiGetCarts()
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

    if (cartsData.length > 0) {
        cartsList.innerHTML = data.map((cart) => {
            return `<tr data-cart-id=${cart.id}>
            <td>
            <div class="cardItem-title">
                <img src="${cart.product.images}" alt="${cart.product.title}">
                <p>${cart.product.title}</p>
            </div>
           </td>
            <td>NT$${utils.tothousands(cart.product.price)}</td>
            <td>
            <div class="input-group">
            <a href="#" data-cart-btn="minus"> - </a>
            <input type="number" data-cart-qty  data-cart-id="${cart.id}" value="${cart.quantity}"  min="1" style="max-width: 60px;">
            <a href="#" data-cart-btn="plus"> +  </a>
            </div>
            </td>
            <td>NT$ ${utils.tothousands(cart.product.price * cart.quantity)}</td>
            <td class="discardBtn">
               <a href="#" class="material-icons" data-cart-item="${cart.product.title}" data-cart-btn="deleteCartItem"> clear </a>
            </td>
            </tr>`
        }).join('');
    } else {
        cartsList.innerHTML = `<tr class="text-center">
        <td colspan="6">
            <h3>購物車內沒有產品，趕快去選購吧!</h3>
        </td>
        </tr>`
    };

    // 顯示購物車內的產品總價
    cartFinalTotal.textContent = `NT$${utils.calcTotalPrice(finalTotalAry)}`;
};

// 購物車 - 新增產品
function addCartItem(productId, quantity) {
    api.apiAddCart({
        "data": {
            productId,
            quantity
        }
    })
        .then((res) => {
            cartsData = res.data.carts;
            console.log(cartsData);
            renderCartsList(cartsData);
            utils.swalMassage("已加入購物車", "success", 800);
        })
        .catch((error) => {
            console.log(error);
        })
};

// 購物車 - 功能整合(單筆刪除、修改數量)
cartsList.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.nodeName !== "A") return;
    //  購物車 id
    let cartId = e.target.closest('tr').dataset.cartId;
    // 購物車的按鈕上的 data 值
    let cartBtnVal = e.target.dataset.cartBtn;
    //  單筆刪除
    if (cartBtnVal === "deleteCartItem") {
        const cartItemTitle = e.target.dataset.cartItem;
        deleteCartItem(cartId, cartItemTitle);
    };

    // 修改數量
    if (cartBtnVal === "minus" || cartBtnVal === "plus") {
        const cartItemQty = document.querySelectorAll('[data-cart-qty]');

        let cartItemQtyVal = 0;

        // 所有 input 跑迴圈 與 cartId 比對，相同的產品將值取出來
        [...cartItemQty].forEach((cartItem) => {
            if (cartItem.dataset.cartId === cartId) {
                cartItemQtyVal = Number(cartItem.getAttribute('value'));
            };
        });

        // 修改購物車產品數量
        changeCartItemQty(cartId, cartBtnVal, cartItemQtyVal);
    };
});

// 購物車 - 修改數量
function changeCartItemQty(cartId, cartBtnVal, cartItemQty) {

    // 計算購物車數量
    let cartQtySum = cartItemQty;

    // 減少數量
    if (cartBtnVal === "minus") {
        if (cartQtySum === 1) {
            utils.swalMassage("產品數量最少為1", "warning", 800);
            return;
        } else {
            cartQtySum -= 1;
        };
    } else if (cartBtnVal === "plus") {
        //增加數量
        cartQtySum += 1;
    };

    // // loding 動畫載入
    utils.toggleLoading(true);

    api.apiUpdateCart({
        "data": {
            "id": cartId,
            "quantity": cartQtySum
        }
    })
        .then((res) => {
            cartsData = res.data.carts;
            renderCartsList(cartsData);
            setTimeout(() => utils.toggleLoading(false), 200);
            utils.swalMassage('購物車商品數量已更新', 'success', 800);
        })
        .catch((error) => {
            console.log(error);
        })
};

// 購物車 - 單筆刪除
function deleteCartItem(cartId, cartItemTitle) {
    api.apiDeleteCart(cartId)
        .then((res) => {
            cartsData = res.data.carts;
            renderCartsList(cartsData);
            utils.swalMassage(`刪除${cartItemTitle} 產品成功 `, "success", 800)
        })
        .catch((error) => {
            console.log(error);
        })
};

// 購物車 - 清空購物車
deleteCartsBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (cartsData.length === 0) {
        e.target.setAttribute("disabled", "");
        utils.swalMassage('購物車內已經沒有商品了', 'warning', 800);
        return;
    };

    api.apiDeleteAllCarts()
        .then((res) => {
            const { carts, message } = res.data
            cartsData = carts;
            renderCartsList(cartsData);
            utils.swalMassage(message, 'success', 800);
        })
        .catch((error) => {
            console.log(error);
        })
});


// 表單 - 驗證功能
orderInfoBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // DOM
    // 所有表單 inupt
    const orderInfoInputs = document.querySelectorAll('input[name],select[id=tradeWay]');
    const customerName = document.querySelector('#customerName');
    const customerPhone = document.querySelector('#customerPhone');
    const customerEmail = document.querySelector('#customerEmail');
    const customerAddress = document.querySelector('#customerAddress');
    const tradeWay = document.querySelector('#tradeWay');


    // 存放顧客表單欄位資訊的值
    const customerFormInfo = {
        "name": customerName.value,
        "tel": customerPhone.value,
        "email": customerEmail.value,
        "address": customerAddress.value,
        "payment": tradeWay.value
    };


    // change 驗證欄位
    orderInfoInputs.forEach((input) => {
        input.addEventListener("change", function () {
            input.nextElementSibling.textContent = '';
            let errors = validate(orderInfoForm, validateRules()) || '';
            formCheck(errors);
        });
    });


    // 判斷購物車是否有產品
    if (cartsData.length === 0) {
        utils.swalMassage('購物車內沒有產品，請去選購', 'warning', 800);
        return;
    };


    // validate 套件 驗證表單內的欄位規則
    let errors = validate(orderInfoForm, validateRules());
    if (errors) {
        formCheck(errors);
        utils.swalMassage('表單欄位需填寫完整', 'warning', 800);
    } else {
        creatOrderForm(customerFormInfo);
        orderInfoForm.reset();
    };
});


// validate 套件的驗證規則
function validateRules() {
    const constraints = {
        "姓名": {
            presence: {
                message: "必填欄位"
            }
        },
        "手機號碼": {
            presence: {
                message: "是必填的欄位"
            },
            format: {
                pattern: /^09\d{2}-?\d{3}-?\d{3}$/,
                message: "開頭須為09"
            },
            length: {
                is: 10,
                message: "長度須為10碼"
            }
        },
        "信箱": {
            presence: {
                message: "是必填的欄位"
            },
            format: {
                pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: "格式輸入錯誤，需有@ 、.等符號"
            },
        },
        "寄送地址": {
            presence: {
                message: "是必填欄位"
            }
        },
        "交易方式": {
            presence: {
                message: "是必填欄位"
            }
        },
    };

    return constraints;
};


// 表單 -  驗證錯誤提示訊息
function formCheck(errors) {
    Object.keys(errors).forEach(function (keys) {
        // console.log(document.querySelector(`[data-message=${keys}]`))
        document.querySelector(`[data-message="${keys}"]`).textContent = errors[keys];
    });
};

// 表單 - 送出購買訂單
function creatOrderForm(customerFormInfo) {
    api.apiAddOrder(
        {
            "data": {
                "user": customerFormInfo
            }
        }
    )
        .then((res) => {
            utils.swalMassage('表單已送出', 'success', 800);
            getCarts();
        })
        .catch((error) => {
            console.log(error);
        })
};




