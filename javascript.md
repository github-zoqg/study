## 一、基本数据类型：

string、number、bloor、null、undefined、Symbol(es6)

## 二、引用数据类型：

object（包括 array、regExp、date）、function
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
  let newobj = {};
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

- 所有代码从上到下依次执行，微任务和宏任务依次放入各自队列；`new Promise`参数方法直接执行，`then`为异步函数，需要`resolve`触发
  同步代码执行完毕后，开始执行微任务队列，队列中如有宏任务依旧添加至宏任务队列中；
  微任务队列执行完毕后，开始执行宏任务队列，队列中如有微任务依旧添加至微任务队列中，并立即执行，之后再执行宏任务队列
