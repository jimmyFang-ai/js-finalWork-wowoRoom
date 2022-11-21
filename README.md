[C3.js](https://c3js.org/gettingstarted.html#generate)

# Generate Chart

圖表顯示要綁定的DOM 
```html
<div id="chart"></div>
```

```jsx
let  chart = c3.generate({
    bindto: '#chart', // 對應 html的 id=chart DOM 元素
    data: {           // 存放資料的地方
      columns: [      
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
      ]
    },
    types: {        // 圖表類型 預設為折線圖
        data2: 'bar'  // 更改 data2 為 長條圖
    }
});
```


[VALIDATE.JS](https://validatejs.org/#validators-date)

"# js-finalWork-wowoRoom" 
"# js-finalWork-wowoRoom" 
