
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


// 提示訊息  sweetAlert2
function swalMassage(title, icon, time) {

    // success 成功, error 錯誤, warning 驚嘆號 , info 說明
    swal.fire({
        toast: true,
        position: 'top-end',
        title: title,
        icon: icon,
        timer: time,
        showConfirmButton: false,
    });
};



// loading 載入動態
function toggleLoading(show) {
    //show的參數，從外部傳入如果是true 就 開啟loading，flase 就關閉
    document.querySelector(".loading").style.display = show ? 'block' : 'none';
};



