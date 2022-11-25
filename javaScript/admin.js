// 匯入 c3.js
import 'https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js';
import 'https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js';
// 匯入 共用工具
import { swalMassage, timeDate } from './utils.js';
// 匯入 共用 API
import * as api from './api.js';


// DOM
const orderList = document.querySelector('#orderList');
const deleteOrdersBtn = document.querySelector('.discardAllBtn');

// 定義資料
let orderData = [];

// 初始化
function adminInit() {
    getOrders();
};
adminInit();


// 訂購表單 - 取得客戶訂單資料
function getOrders() {
    api.apiGetOrders()
        .then((res) => {
            orderData = res.data.orders;
            // 顯示訂單列表
            renderOrderLists(orderData);
            // 顯示 C3 圖表
            renderC3Chart_LV2(orderData);
        })
        .catch((error) => {
            console.log(error);
        })
};

// 訂購表單 - 顯示客戶訂單列表
function renderOrderLists(data) {
    // 顯示訂單列表資料
    orderList.innerHTML = data.map((order) => {
        //組訂購產品字串
        const orderProducts = order.products.map((product) => {
            return ` ${product.title} x ${product.quantity} <br>`;
        }).join('');

        return `
        <tr data-order-id="${order.id}">
        <td>${order.id}</td>
        <td>
            <p>${order.user.name}</p>
            <p>${order.user.tel}</p>
        </td>
        <td>${order.user.address}</td>
        <td>${order.user.email}</td>
        <td>
            <p>${orderProducts}</p>
        </td>
        <td>${timeDate(order.createdAt)}</td>
        <td>
            <button  class="btn btn-sm btn-primary"  data-order-status=${order.paid}  data-order-btn="changeStatus">${order.paid ? "已處理" : "未處理"}</button>
        </td>
        <td>
            <button type="button"  class="btn btn-sm btn-danger" data-order-btn="deleteOrder">刪除</button>
        </td>
    </tr>`
    }).join('');
};

// 訂購表單 - 功能整合(修改訂單狀態、刪除單一訂單)
orderList.addEventListener('click', (e) => {
    e.preventDefault();
    // 取出訂單id
    let orderId = e.target.closest('tr').dataset.orderId;
    let orderBTn = e.target.dataset.orderBtn;

    if (e.target.nodeName !== "BUTTON") return;

    // 單筆刪除
    if (orderBTn === "deleteOrder") {
        deleteOrderItem(orderId);
    };

    // 修改訂單狀態
    if (orderBTn === "changeStatus") {
        let orderStatus = e.target.dataset.orderStatus;
        // 切換付款狀態，如果目前訂單狀態為 'false' ，點擊後就轉為 true
        let checkStatus = orderStatus === 'false' ? true : false;
        changeOrderStatus(orderId, checkStatus);
    };
});


// 訂購表單 - 刪除單一訂單
function deleteOrderItem(orderId) {
    api.apiDeleteOrder(orderId)
        .then((res) => {
            orderData = res.data.orders;
            // 顯示訂單列表
            renderOrderLists(orderData);
            // 顯示 C3 圖表
            renderC3Chart_LV2(orderData);
            swalMassage(`訂單編號: ${orderId} 已成功刪除!`, 'success', 800);
        })
        .catch((error) => {
            console.log(error);
        })
};


// 訂購表單 - 修改全部狀態
function changeOrderStatus(orderId, checkStatus) {
    api.apiUpdateOrder({
        "data": {
            "id": orderId,
            "paid": checkStatus
        }
    })
        .then((res) => {
            orderData = res.data.orders;
            // 顯示訂單列表
            renderOrderLists(orderData);
            swalMassage(`訂單編號: ${orderId} ，訂單狀態已修改!`, 'success', 800);
        })
        .catch((error) => {
            console.log(error);
        })
};


// 訂購表單 - 刪除全部訂單
deleteOrdersBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // 阻擋訂單為 0 ，不得點擊刪除全部訂單
    if (orderData.length === 0) {
        swalMassage(`目前訂單列表沒有任何東西 RRR ((((；゜Д゜)))`, 'warning', 800);
        return;
    };

    api.apiDeleteAllOrders()
        .then((res) => {
            console.log(res);
            // 解構取出客戶訂單資料
            const { orders, message } = res.data;
            orderData = orders;
            // 顯示訂單列表
            renderOrderLists(orderData);
            // 顯示 C3 圖表
            renderC3Chart_LV2(orderData);
            swalMassage(`${message}`, 'success', 800);
        })
        .catch((error) => {
            console.log(error);
        })
});


// C3.js 圖表設計
function renderC3Chart_LV2(orderData) {

    // 整理 C3 圖表要的資料 => ex: [['Louvre 雙人床架', 111100],['Antony 雙人床架', 12000]]
    const orderDataObj = {};
    orderData.forEach((order) => {
        order.products.forEach((product) => {
            // console.log(product);
            const { title, price, quantity } = product;
            if (orderDataObj[title] === undefined) {
                orderDataObj[title] = price * quantity;
            } else {
                orderDataObj[title] += (price * quantity);
            }
        });
    });


    const orderChartData = Object
        .keys(orderDataObj)
        .map((product) => [product, orderDataObj[product]]);


    // 降冪排列，取前三高營收，第四筆以後變其他
    const reankSortArray = orderChartData.sort((a, b) => b[1] - a[1]);
    if (reankSortArray.length > 3) {
        let otherTotal = 0;
        reankSortArray.forEach((item, index) => {
            if (index > 2) {
                otherTotal += reankSortArray[index][1];
            };
        });
        reankSortArray.splice(3, reankSortArray.length - 1);
        reankSortArray.push(['其他', otherTotal]);
    };

    c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: reankSortArray,
        },
        color: {
            pattern: ["#DACBFF", "#9D7FEA", "#5434A7", "#301E5F"]
        }
    });
};
























