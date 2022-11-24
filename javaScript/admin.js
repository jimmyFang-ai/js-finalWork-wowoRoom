// 匯入 js
import { baseUrl, api_path, auth_token } from './api-config.js';
import { swalMassage, timeDate } from './utils.js';
// console.log(swalMassage);
// console.log(baseUrl, api_path, auth_token);


// DOM
const orderList = document.querySelector('#orderList');
const deleteOrdersBtn = document.querySelector('.discardAllBtn');

// // 定義資料
let orderData = [];


// 初始化
function adminInit() {
    getOrders();
};

adminInit();



// 訂購表單 - 取得客戶訂單資料
function getOrders() {
    axios.get(`${baseUrl}/api/livejs/v1/admin/${api_path}/orders`, {
        headers: {
            'Authorization': auth_token,
        }
    })
        .then((res) => {
            orderData = res.data.orders;
            // 顯示訂單列表
            renderOrderLists(orderData);
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
    axios.delete(`${baseUrl}/api/livejs/v1/admin/${api_path}/orders/${orderId}`, {
        headers: {
            'Authorization': auth_token,
        }
    })
        .then((res) => {
            orderData = res.data.orders;
            // 顯示訂單列表
            renderOrderLists(orderData);
            swalMassage(`訂單編號: ${orderId} 已成功刪除!`, 'success', 800);
        })
        .catch((error) => {
            console.log(error);
        })
};



// 訂購表單 - 修改全部狀態
function changeOrderStatus(orderId, checkStatus) {
    axios.put(`${baseUrl}/api/livejs/v1/admin/${api_path}/orders`,
        {
            "data": {
                "id": orderId,
                "paid": checkStatus
            }
        },
        {
            headers: {
                'Authorization': auth_token,
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

    axios.delete(`${baseUrl}/api/livejs/v1/admin/${api_path}/orders`, {
        headers: {
            'Authorization': auth_token,
        }
    })
        .then((res) => {
            console.log(res);
            // 解構取出客戶訂單資料
            const { orders, message } = res.data;
            orderData = orders;
            // 顯示訂單列表
            renderOrderLists(orderData);
            swalMassage(`${message}`, 'success', 800);
        })
        .catch((error) => {
            console.log(error);
        })
});























































// 圖表
// C3.js
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
            ['Louvre 雙人床架', 1],
            ['Antony 雙人床架', 2],
            ['Anty 雙人床架', 3],
            ['其他', 4],
        ],
        colors: {
            "Louvre 雙人床架": "#DACBFF",
            "Antony 雙人床架": "#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});