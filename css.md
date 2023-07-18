## 一、css

1. 变量定义
   ```css
   定义：--something-font-size: 14px 使用： * {
     font-size: var(something-font-size);
   }
   ```

## 二、less

1. 变量定义
   ```less
   定义：@something-font-size: 14px 使用：* {
     font-size: @something-font-size;
   }
   ```

## 三、sass

使用时应注意`node`、`node-sass`和`sass-loader`版本之间的相互依赖。例：

```json
"node-sass": "6.0.1",
"sass-loader": "10.2.0",
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

## 五、自适应布局

```

```
