## 一、css

1. 变量定义
   ```css
   定义：--something-font-size: 14px 使用： * {
     font-size: var(something-font-size);
   }
   ```
2. background 线性渐变色

```css
linear-gradient(red, orange, yellow, green, blue);

等价于

linear-gradient(red 0%, orange 25%, yellow 50%, green 75%, blue 100%);

例:background: linear-gradient(to right, red, orange, yellow, green, blue);
```

3. transition 过渡
   前后两个样式 默认样式添加 transfrom 属性
   .temp{
   width:100px;
   height:100px
   // ...;
   transition:all 2s linear .2s
   }
   .temp:hover{
   width:200px
   }
4. animation 动画
   <!-- 关键帧:keyframes -->
   @keyframes animat{
   from {
   margin-left: -20%;
   }
   to {
   margin-left: 100%;
   }
   }
   .temp{
   animation:animat 2s linear .2s infinite alternate
   }

## 二、less

1. 变量定义
   ```less
   定义：@something-font-size: 14px 使用：* {
     font-size: @something-font-size;
   }
   ```

## 三、sass

使用时应注意 `node`、`node-sass` 和 `sass-loader` 版本之间的相互依赖。例：

```shell
npm i node-sass@6.0.1 -D
npm i sass-loader@10.2.0 -D
```

1. 变量定义
   ```scss
   定义：$something-font-size: 14px 使用： * {
     font-size: $something-font-size;
   }
   ```

## 四、stylus

1. 变量定义
   ```stylus
   定义：something-font-size = 14px
   使用：*{font-size: something-font-size}
   ```

## 五、移动端适配

安装以下依赖：

```shell
npm i postcss -D
npm i postcss-pxtorem -D
npm i postcss-loader -D

```

1. 设置跟标签字体大小

```js
function setHtmlFontSize() {
  const htmlWidth =
    document.documentElement.clientWidth || document.body.clientWidth;
  const htmlDom = document.getElementsByTagName("html")[0];
  htmlDom.style.fontSize = htmlWidth / 10 + "px";
}
window.onresize = setHtmlFontSize;
setHtmlFontSize();
```

2. 根目录下添加 `postcss.config.js` 配置文件

```js
module.exports = {
  plugins: {
    autoprefixer: {
      // 报错删除此项
      browsers: ["Android >= 4.0", "iOS >= 8"],
    },
    "postcss-pxtorem": {
      rootValue: 37.5, // 表示根元素字体大小，它会根据根元素大小进行单位转换
      propList: ["*"], // 用来设定可以从 px 转为 rem 的属性
    },
  },
};
```

注意：该插件不能转变行内样式中的 `px`

## 六、响应式布局

1. 相对单位 `%`，`vh`，`rem`
2. 媒体查询

```css
@media screen and (min-width: 1200px) {
  html {
    font-size: 20px;
  }
}
@media screen and (max-width: 1200px) {
  html {
    font-size: 10px;
  }
}
```

3. flex 布局

注：自适应布局针对不同分辨率采用@media 媒体查询给不同范围的屏幕分别写一套样式布局，每一套样式布局采用的还是静态布局的方式。元素大小不会根据屏幕大小而改变，可能会切换到另一套样式。响应式布局元素大小会根据屏幕大小改变而改变。

## 触发回流的属性和方法:

clientWidth、clientHeight、clientTop、clientLeft
offsetWidth、offsetHeight、offsetTop、offsetLeft
scrollWidth、scrollHeight、scrollTop、scrollLeft
scrollIntoView()、scrollIntoViewIfNeeded()
getComputedStyle()
getBoundingClientRect()
scrollTo()
