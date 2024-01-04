## 一、基本数据类型：

string、number、bloor、null、undefined、Symbol(es6)

存储地址为**内存**的**栈**中，key 与 value 一一对应

## 二、引用数据类型：

object（包括 array、regExp、date）、function

存储地址为**内存**的**堆**中，**栈**中 key 赋值的为内存地址

对象浅拷贝：引用地址相同，其中一个变化另一个也会产生变化
对象深拷贝：创建一个新的对象，两个内存地址。方法有：

1. `Json.parse(Json.stringfy(obj))`，无法多层次层深拷贝
2. `Object.assign({},obj)`，无法多层次层深拷贝
3. 递归遍历对象

```js
function deepClone(obj) {
  if (typeof obj !== "Object") {
    return obj;
  }
  let newobj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    newobj[key] = deepClone(obj[key]);
  }
  return newobj;
}
```

## 三、原型链

每一个实例对象的`__proto__`都指向他的构造函数的 prototype。构造函数的 prototype 也是对象，她的`__proto__`指向 Object.prototype,
Object.prototype 的`__proto__`为 null

## 四、对象的继承

1. 原型链继承
   ```js
   function funcA() {
     this.obj = { name: "funcA" };
     this.say = function () {
       return `this is ${this.name}`;
     };
   }
   funcA.prototype.type = "function";
   function funcB() {
     this.sayHello = function () {
       return "Hello";
     };
   }
   // 继承
   funcB.prototype = new funcA();
   ```
   缺点：引用值共享问题
2. 通过`call`、`apply`改变`this`指向
   ```js
    function funcA(){
        this.name = 'funcA'
        this.say = function(){
            return `this is ${this.name}`
        }
    }
    funcA.prototype.type = 'function'
    function funcB(){
        <!-- 继承 -->
        funcA.call(this)
        this.name = 'funcB'
        this.sayHello = function(){
            return 'Hello'
        }
    }
   ```
   缺点：无法继承原型上的属性
3. 组合继承（伪经典继承）
   ```js
    function funcA(){
        this.name = 'funcA'
        this.say = function(){
            return `this is ${this.name}`
        }
    }
    funcA.prototype.type = 'function'
    function funcB(){
        <!-- 继承 -->
        funcA.call(this)
        this.name = 'funcB'
        this.sayHello = function(){
            return 'Hello'
        }
    }
    funcB.prototype = new funcA()
   ```
   缺点：实例化`funcB`需两次`new funcA()`，会产生了属性与方法重叠的问题
4. 寄生组合继承（经典继承）
   ```js
    function funcA(){
        this.name = 'funcA'
        this.say = function(){
            return `this is ${this.name}`
        }
    }
    funcA.prototype.type = 'function'
    function funcB(){
        <!-- 继承 -->
        funcA.call(this)
        this.name = 'funcB'
        this.sayHello = function(){
            return 'Hello'
        }
    }
    //es5之前就重写Object.create方法
    if(!Object.create){
        Object.create = function(proto){
            function F(){}
            F.prototype = proto
            return new F()
        }
    }
    funcB.prototype = Object.create(funcA.prototype)
   ```
   缺点：通过`Object.create`改变`funcB`原型的指向后，`funcB`原型上原有的属性和方法就消失了。
5. 组合继承优化
   ```js
    function funcA(){
        this.name = 'funcA'
        this.say = function(){
            return `this is ${this.name}`
        }
    }
    funcA.prototype.type = 'function'
    function funcB(){
        <!-- 继承 -->
        funcA.call(this)
        this.name = 'funcB'
        this.sayHello = function(){
            return 'Hello'
        }
    }
    <!-- 继承原型上属性 -->
    for (let key in funcA.prototype){
        funcB.prototype[key] = funcA.prototype[key]
    }
   ```
6. `class`类`extends`继承

   ```js
   class parent {
     constructor(a) {
       this.filed1 = a;
     }
     filed2 = 2;
     func1 = function () {};
   }

   class child extends parent {
     constructor(a, b) {
       super(a);
       this.filed3 = b;
     }

     filed4 = 1;
     func2 = function () {};
   }
   ```

## 五、Promiss

## 六、异步队列

- 所有代码从上到下依次执行，微任务和宏任务依次放入各自队列，并开始计时；`new Promise`参数方法直接执行，`then`为异步函数，需要`resolve`触发

  同步代码执行完毕后，开始执行微任务队列，队列中如有宏任务依旧添加至宏任务队列中；

  微任务队列执行完毕后，开始执行宏任务队列，队列中如有微任务依旧添加至微任务队列中，并立即执行，之后再执行宏任务队列

## 七、算法

1. 排序
   相关概念

   稳定：如果 a 原本在 b 前面，而 a=b，排序之后 a 仍然在 b 的前面。

   不稳定：如果 a 原本在 b 的前面，而 a=b，排序之后 a 可能会出现在 b 的后面。

   时间复杂度：对排序数据的总的操作次数。反映当 n 变化时，操作次数呈现什么规律。

   空间复杂度：是指算法在计算机内执行时所需存储空间的度量，它也是数据规模 n 的函数。

- 冒泡排序

```js
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 1; j < arr.length - 1 - i; j++) {
      if (arr[j] < arr[j - 1]) {
        let num = arr[j];
        arr[j] = arr[j - 1];
        arr[j - 1] = num;
      }
    }
  }
  return arr;
}
```

- 选择排序

```js
function selectSort(arr) {
  let minIndex, temp;
  for (let j = 0; j < arr.length - 1; j++) {
    let minIndex = j;
    for (let i = j + 1; i < arr.length; i++) {
      if (arr[i] < arr[minIndex]) {
        minIndex = i;
      }
    }
    temp = arr[j];
    arr[j] = arr[minIndex];
    arr[minIndex] = temp;
  }
  return arr;
}
```

- 插入排序

```js
function insertionSort(arr) {
  let preIndex, current;
  for (let i = 1; i < arr.length; i++) {
    preIndex = i - 1;
    current = arr[i];
    while (preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
    }
    arr[preIndex + 1] = current;
  }
  return arr;
}
```

- 基数排序

```js
var counter = [];
function radixSort(arr, maxDigit) {
  var mod = 10;
  var dev = 1;
  for (var i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
    for (var j = 0; j < arr.length; j++) {
      var bucket = parseInt((arr[j] % mod) / dev);
      if (counter[bucket] == null) {
        counter[bucket] = [];
      }
      counter[bucket].push(arr[j]);
    }
    var pos = 0;
    for (var j = 0; j < counter.length; j++) {
      var value = null;
      if (counter[j] != null) {
        while ((value = counter[j].shift()) != null) {
          arr[pos++] = value;
        }
      }
    }
  }
  return arr;
}
```

- 计数排序

```js
function countingSort(arr, maxValue) {
  var bucket = new Array(maxValue + 1),
    sortedIndex = 0;
  (arrLen = arr.length), (bucketLen = maxValue + 1);
  for (var i = 0; i < arrLen; i++) {
    if (!bucket[arr[i]]) {
      bucket[arr[i]] = 0;
    }
    bucket[arr[i]]++;
  }
  for (var j = 0; j < bucketLen; j++) {
    while (bucket[j] > 0) {
      arr[sortedIndex++] = j;
      bucket[j]--;
    }
  }
  return arr;
}
```

2. 回文子串

```js
// 双指针
```

3. 最多字符

```js
function func(data) {
  let arr = data.split("");
  let map = new Map();
  arr.forEach((i) => {
    if (map.has(i)) {
      let val = map.get(i);
      map.set(i, ++val);
    } else {
      map.set(i, 1);
    }
  });
  let key, value;
  map.forEach((i, itemKey) => {
    if (i > (value || 0)) {
      key = itemKey;
      value = i;
    }
  });
  return `key:${key} value:${value}`;
}
func("Hello world!");
```

## 模块化

`import`和`require`的区别

- `import`

1. 编译时加载是静态引用
2. 异步加载
3. 加载为对象本身(相当于浅拷贝)
4. es6 标准语法
5. import 有利于 tree-shaking（移除 JavaScript 上下文中未引用的代码），require 对 tree-shaking 不友好。
6. import 会触发代码分割（把代码分离到不同的 bundle 中，然后可以按需加载或者并行加载这些文件），require 不会触发。

- `require`

1. 运行时加载是动态引入
2. 同步加载
3. 加载为对象的拷贝值(通过 require 引入基础数据类型时，属于复制该变量。通过 require 引入复杂数据类型时，数据浅拷贝该对象。),当引入值被更改时,再被其他文件引入,其值仍不改变(为`key`添加`get`方法即可获取最新值)
4. AMD 规范

# 常识

1. this 指向

```js
function parent() {
  console.log(this.name);
}
parent()
// 此时this指向全局 window、严格模式中 this 为 undefined
// 当直接调用parent函数时，无论parent函数位于哪里，this都指向window

let man = new parent()
// 此时this指向新实例

let obj = {
  name: 'obj'
  fn: function(){
    console.log(this.name)
  }
}
obj.fn()
// 此时this指向obj，谁调用指向谁
```

2. 调用 new 的过程中会发生四件事

- 创建一个空对象
- 链接原型
- 绑定 this 指向
- 返回一个对象
