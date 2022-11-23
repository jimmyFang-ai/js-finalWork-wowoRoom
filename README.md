

# wowoRoom 傢俱電商


## 開發流程
- [x] 環境建立
    - [x] 調整版型結構
    - [x] 建立 SCSS 和 JS 結構(前、後台)
    - [x] 載入套件資源(bootstrap、axios、C3.js...)
    - [x] API config 設定確認

- [ ] 前台開發
    - [x] 串接產品 API 流程設計
        - [x] 取得產品資料
        - [x] 顯示產品列表
 
    - [x] 串接購物車 API 流程設計
 
        - [x] 取得購物車資料
        - [x] 顯示購物車列表
        - [x] 新增產品到購物車
        - [x] 單筆刪除購物車內的產品
        - [x] 修改購物車內的單筆產品數量
        - [x] 清空購物車
        - [x] 優化使用者體驗
             - 使用 [sweetalert2](https://sweetalert2.github.io/#usage) 套件，製作提示使用者訊息。
             - 增加 [loading](https://loading.io/) 動畫
  
    - [ ] 串接建立訂單 API 流程設計
           - [x]表單驗證功能(click + change)
           - [x]表單阻擋功能(購物車產品不得為 0 )
           - [x]整理送出購買訂單API，需要的資料格式。
           - [x]表單送出後，清空表單欄位的資訊。
           - 優化使用者體驗
            - 使用 [sweetalert2](https://sweetalert2.github.io/#usage) 套件，製作提示使用者訊息。
            - 使用 [validatejs](https://validatejs.org/) 套件，製作驗證表單欄位規則。
- [ ] 後台開發
    - [ ] 訂單列表設計
    - [ ] C3.js 圖表設計

- [ ] 優化細節
    - [x] 使用者體驗
    - [x] 千分位設計
    - [x] 計算總金額
    - [x] 表單驗證


## 使用套件
- [C3.js](https://c3js.org/)
- [axios](https://github.com/axios/axios)
- [validate.js](https://validatejs.org/)
- [sweetalert2](https://sweetalert2.github.io/)