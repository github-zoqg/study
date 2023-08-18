## 一、数据劫持

1. 初始化 data

   - `initData`方法中调用`observe`方法。`observe`方法中`new Observer`进行实例化`Observer`,并对`data`中定义数据通过`defineReactive`进行数据劫持。

   - `observe`方法回为每层对象添加`__ob__`属性

2. `$mount`时，调用`mountComponent`方法。`mountComponent`内，先定义`updateComponent`方法如下：

```js
updateComponent = vm._update(vm._render(), hydrating);
```

之后将`updateComponent`作为`expOrFn`参数,实例化渲染 watcher。实例化中调用`get`方法

```js
// Class Watcher
 get() {
    pushTarget(this);
    let value;
    const vm = this.vm;
    try {
      value = this.getter.call(vm, vm); // 如果是computed 会再次读取其中的依赖 触发getter 此时Dep.target为computed Watcher
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`);
      } else {
        throw e;
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value;
    }
```

`this.getter`方法即`updateComponent`方法，在编译虚拟 Dom`vm._render()`过程中，读取`data`之中定义数据，触发`getter`。

```js
function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep();

  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  // 递归遍历对象
  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== "production" && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return;
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    },
  });
}
```

此时`Dep.target`即渲染`Watcher`。将此属性的`dep`与`渲染watcher`进行关联。

3. set
   - 更改属性时，触发属性的`set`方法。调用`dep.notify`方法

## 二、Dep 和 Watcher

1. Dep

```js
depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
        // subs aren't sorted in scheduler if not running async
        // we need to sort them now to make sure they fire in correct
        // order
        subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
        subs[i].update()
    }
}
```

2. Watcher

```js
  addDep(dep: Dep) {
    const id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  }
  update() {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      // 添加异步队列
      queueWatcher(this);
    }
  }
  evaluate() {  // computed watcher 会调用
    this.value = this.get();
    this.dirty = false;
  }
  depend() {  // computed watcher 会调用
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  }
```

## 三、computed

1. 初始化`computed`

   - `computedWatcherOptions = { lazy: true }`
   - 调用`initComputed`，`initComputed`执行中，将`computed`中定义的方法作为`expOrFn`参数，`new Watcher`实例化`computed watcher`。实例化过程中调用`get`方法。若返回值为`data`中定义属性，则触发`getter`。将属性的`dep`与`computed watcher`进行关联。
     此时`Dep.target`为`computed watcher`。

   ```js
   function initComputed(vm: Component, computed: Object) {
     // $flow-disable-line
     const watchers = (vm._computedWatchers = Object.create(null));
     // computed properties are just getters during SSR
     const isSSR = isServerRendering();

     for (const key in computed) {
       const userDef = computed[key];
       const getter = typeof userDef === "function" ? userDef : userDef.get;
       if (process.env.NODE_ENV !== "production" && getter == null) {
         warn(`Getter is missing for computed property "${key}".`, vm);
       }

       if (!isSSR) {
         // create internal watcher for the computed property.
         watchers[key] = new Watcher(
           vm,
           getter || noop,
           noop,
           computedWatcherOptions
         );
       }

       // component-defined computed properties are already defined on the
       // component prototype. We only need to define computed properties defined
       // at instantiation here.
       if (!(key in vm)) {
         defineComputed(vm, key, userDef);
       } else if (process.env.NODE_ENV !== "production") {
         if (key in vm.$data) {
           warn(
             `The computed property "${key}" is already defined in data.`,
             vm
           );
         } else if (vm.$options.props && key in vm.$options.props) {
           warn(
             `The computed property "${key}" is already defined as a prop.`,
             vm
           );
         }
       }
     }
   }
   ```

   - 对`computed`中定义方法进行数据劫持，并定义其`get`方法如下：

   ```js
   function defineComputed(
     target: any,
     key: string,
     userDef: Object | Function
   ) {
     const shouldCache = !isServerRendering();
     if (typeof userDef === "function") {
       sharedPropertyDefinition.get = shouldCache
         ? createComputedGetter(key)
         : createGetterInvoker(userDef);
       sharedPropertyDefinition.set = noop;
     } else {
       sharedPropertyDefinition.get = userDef.get
         ? shouldCache && userDef.cache !== false
           ? createComputedGetter(key)
           : createGetterInvoker(userDef.get)
         : noop;
       sharedPropertyDefinition.set = userDef.set || noop;
     }
     if (
       process.env.NODE_ENV !== "production" &&
       sharedPropertyDefinition.set === noop
     ) {
       sharedPropertyDefinition.set = function () {
         warn(
           `Computed property "${key}" was assigned to but it has no setter.`,
           this
         );
       };
     }
     Object.defineProperty(target, key, sharedPropertyDefinition);
   }

   function createComputedGetter(key) {
     return function computedGetter() {
       const watcher = this._computedWatchers && this._computedWatchers[key];
       if (watcher) {
         if (watcher.dirty) {
           watcher.evaluate();
         }
         if (Dep.target) {
           watcher.depend();
         }
         return watcher.value;
       }
     };
   }
   ```

2. 渲染时读取 computed 中定义的属性时，触发该属性的`get`方法。在第一次调用`watcher.evaluate()`后，将`watcher.dirty`更改为`false`，之后便不会调用`watcher.get`方法。直接读取缓存。此时`Dep.target`为`computed watcher`。

## 四、watch

1. 初始化 watch
   - 调用`initWatch`方法，循环遍历`watch`中定义的属性 or 方法，并调用`createWatcher`方法，`createWatcher`最终调用`vm.$watch`方法
   ```js
   Vue.prototype.$watch = function (
     expOrFn: string | Function,
     cb: any,
     options?: Object
   ): Function {
     const vm: Component = this;
     if (isPlainObject(cb)) {
       return createWatcher(vm, expOrFn, cb, options);
     }
     options = options || {};
     options.user = true;
     const watcher = new Watcher(vm, expOrFn, cb, options);
     if (options.immediate) {
       try {
         cb.call(vm, watcher.value);
       } catch (error) {
         handleError(
           error,
           vm,
           `callback for immediate watcher "${watcher.expression}"`
         );
       }
     }
     return function unwatchFn() {
       watcher.teardown();
     };
   };
   ```
   将`watch`中定义属性的`key`作为`expOrFn`参数，`new Watcher`实例化`user watcher`。实例化过程中，调用`get`方法，读取`data`中定义的属性，触发`getter`,将此属性的`dep`与`user watcher`进行关联。

## 五、nextTick

1. queueWatcher

```js
// src\core\observer\scheduler.js
function flushSchedulerQueue() {
  currentFlushTimestamp = getNow();
  flushing = true;
  let watcher, id;

  // 刷新前对队列进行排序。
  // 这样可以确保：
  // 1。组件从父级更新到子级。（因为父母总是在子项之前创建）
  // 2。组件的用户观察程序在其渲染观察程序之前运行（因为用户观察程序是在渲染观察程序之前创建的）
  // 3。如果组件在父组件的观察程序运行期间被破坏，它的观察者可以被跳过。
  queue.sort((a, b) => a.id - b.id);

  // 不要缓存长度，因为可能会推送更多的观察者
  // 当我们运行现有的观察程序时
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // 在dev-build中，检查并停止循环更新。
    if (process.env.NODE_ENV !== "production" && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          "You may have an infinite update loop " +
            (watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`),
          watcher.vm
        );
        break;
      }
    }
  }

  // 在重置状态之前保留投递队列的副本
  const activatedQueue = activatedChildren.slice();
  const updatedQueue = queue.slice();

  resetSchedulerState();

  // 调用组件更新并激活挂钩
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit("flush");
  }
}

function queueWatcher(watcher: Watcher) {
  // 过滤watcher
  const id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if (process.env.NODE_ENV !== "production" && !config.async) {
        flushSchedulerQueue();
        return;
      }
      nextTick(flushSchedulerQueue);
    }
  }
}
```

## 六、vuex

- state、getters
- action
- mutation
- modoules

## 七、vue-router

1. 初始化

- 执行 `Vue.use(VueRouter)` 的时候，实际上就是在执行 `install` 函数，为了确保 `install` 逻辑只执行一次，用了 `install.installed` 变量做已安装的标志位。
- 混入`beforeCreate`生命周期，`this._router.init(this)`初始化 `vueRouter`
- 注册全局属性`$router、$route`
- 注册全局组件`router-link、router-view`

```js
install (Vue) {
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  const strats = Vue.config.optionMergeStrategies
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
```
