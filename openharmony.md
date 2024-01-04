# 一、编辑器下载

参考链接：https://docs.openharmony.cn/pages/v4.0/zh-cn/release-notes/OpenHarmony-v4.0-release.md/#%E9%85%8D%E5%A5%97%E5%85%B3%E7%B3%BB

# 二、环境搭建

参考链接：https://docs.openharmony.cn/pages/v4.0/zh-cn/application-dev/quick-start/start-with-ets-stage.md/

# 三、arkTS 语法

1. @Styles 装饰器：定义组件重用样式

```ts
// 不支持传参
// 定义在全局的@Styles封装的样式
@Styles function globalFancy  () {
  .width(150)
  .height(100)
  .backgroundColor(Color.Pink)
}

@Entry
@Component
struct FancyUse {
  @State heightValue: number = 100
  // 定义在组件内的@Styles封装的样式
  @Styles fancy() {
    .width(200)
    .height(this.heightValue)
    .backgroundColor(Color.Yellow)
    .onClick(() => {
      this.heightValue = 200
    })
  }

  build() {
    Column({ space: 10 }) {
      // 使用全局的@Styles封装的样式
      Text('FancyA')
        .globalFancy ()
        .fontSize(30)
      // 使用组件内的@Styles封装的样式
      Text('FancyB')
        .fancy()
        .fontSize(30)
    }
  }
}

```

2. @Extend 装饰器：定义扩展组件样式

```ts
// 支持传参
@Extend(Text) function fancy (fontSize: number) {
  .fontColor(Color.Red)
  .fontSize(fontSize)
}

@Entry
@Component
struct FancyUse {
  @State fontSizeValue: number = 20
  build() {
    Row({ space: 10 }) {
      Text('Fancy')
        .fancy(this.fontSizeValue)
        .onClick(() => {
          this.fontSizeValue = 30
        })
    }
  }
}

```

3.@BuilderParam 装饰器：引用@Builder 函数

```ts
@Component
struct Child {
  label: string = `Child`
  @Builder FunABuilder0() {}
  @Builder FunABuilder1() {}
  @BuilderParam aBuilder0: () => void = this.FunABuilder0;
  @BuilderParam aBuilder1: () => void = this.FunABuilder1;

  build() {
    Column() {
      this.aBuilder0()
      this.aBuilder1()
    }
  }
}

@Entry
@Component
struct Parent {
  label: string = `Parent`

  @Builder componentBuilder() {
    Text(`${this.label}`)
  }

  build() {
    Column() {
      this.componentBuilder()
      Child({ aBuilder0: this.componentBuilder, aBuilder1: ():void=>{this.componentBuilder()} })
    }
  }
}

```

# 四、路由跳转

Router 模块提供了两种跳转模式，分别是 router.pushUrl()和 router.replaceUrl()。这两种模式决定了目标页面是否会替换当前页。

- router.pushUrl()：目标页面不会替换当前页，而是压入页面栈。这样可以保留当前页的状态，并且可以通过返回键或者调用 router.back()方法返回到当前页。

- router.replaceUrl()：目标页面会替换当前页，并销毁当前页。这样可以释放当前页的资源，并且无法返回到当前页。

```ts
import router from "@ohos.router";
class DataModelInfo {
  age: number = 0;
}

class DataModel {
  id: number = 0;
  info: DataModelInfo | null = null;
}

function onJumpClick(): void {
  // 在Home页面中
  let paramsInfo: DataModel = {
    id: 123,
    info: {
      age: 20,
    },
  };

  router.pushUrl(
    {
      url: "pages/Detail", // 目标url
      params: paramsInfo, // 添加params属性，传递自定义参数
    },
    (err) => {
      if (err) {
        console.error(
          `Invoke pushUrl failed, code is ${err.code}, message is ${err.message}`
        );
        return;
      }
      console.info("Invoke pushUrl succeeded.");
    }
  );
}
```

在目标页面中，可以通过调用 Router 模块的 getParams()方法来获取传递过来的参数。例如：

```ts
import router from "@ohos.router";

class InfoTmp {
  age: number = 0;
}

class RouTmp {
  id: object = () => {};
  info: InfoTmp = new InfoTmp();
}

const params: RouTmp = router.getParams() as RouTmp; // 获取传递过来的参数对象
const id: object = params.id; // 获取id属性的值
const age: number = params.info.age; // 获取age属性的值
```

# 五、组件传值

1. @prop

- @Prop 装饰的变量可以和父组件建立单向的同步关系。@Prop 装饰的变量是可变的，但是变化不会同步回其父组件。

2. @link

- 子组件中被@Link 装饰的变量与其父组件中对应的数据源建立双向数据绑定。

3. @Provide 和@Consume

- @Provide 和@Consume，应用于与后代组件的双向数据同步，应用于状态数据在多个层级之间传递的场景。不同于上文提到的父子组件之间通过命名参数机制传递，@Provide 和@Consume 摆脱参数传递机制的束缚，实现跨层级传递。

- 其中@Provide 装饰的变量是在祖先组件中，可以理解为被“提供”给后代的状态变量。@Consume 装饰的变量是在后代组件中，去“消费（绑定）”祖先组件提供的变量。

4. @ObjectLink 和@Observed

- 被@Observed 装饰的类，可以被观察到属性的变化；

- 子组件中@ObjectLink 装饰器装饰的状态变量用于接收@Observed 装饰的类的实例，和父组件中对应的状态变量建立双向数据绑定。这个实例可以是数组中的被@Observed 装饰的项，或者是 class object 中的属性，这个属性同样也需要被@Observed 装饰。

- 单独使用@Observed 是没有任何作用的，需要搭配@ObjectLink 或者@Prop 使用。

# 六、状态管理

1. 全局的 UI 状态存储

- AppStorage 是应用全局的 UI 状态存储，是和应用的进程绑定的，由 UI 框架在应用程序启动时创建，为应用程序 UI 状态属性提供中央存储。

- 和 AppStorage 不同的是，LocalStorage 是页面级的，通常应用于页面内的数据共享。而 AppStorage 是应用级的全局状态共享，还相当于整个应用的“中枢”，持久化数据 PersistentStorage 和环境变量 Environment 都是通过 AppStorage 中转，才可以和 UI 交互。

2. 页面级的 UI 状态存储

- LocalStorage 是页面级的 UI 状态存储，通过@Entry 装饰器接收的参数可以在页面内共享同一个 LocalStorage 实例。LocalStorage 支持 UIAbility 实例内多个页面间状态共享。

3. eventhub 同步

```ts
import emitter from '@ohos.events.emitter';
let innerEvent: emitter.InnerEvent = { eventId: item.id }
// 选中态：黑变红
let eventData: emitter.EventData = {
    data: {
    "colorTag": 1
    }
}
emitter.emit(innerEvent, eventData)
// 注册事件
aboutToAppear() {
    //定义事件ID
    let innerEvent: emitter.InnerEvent = { eventId: this.index }
    emitter.on(innerEvent, data => {
    this.onTapIndexChange(data)
    })
  }

```

4. PersistentStorage

- PersistentStorage 将选定的 AppStorage 属性保留在设备磁盘上。应用程序通过 API，以决定哪些 AppStorage 属性应借助 PersistentStorage 持久化。UI 和业务逻辑不直接访问 PersistentStorage 中的属性，所有属性访问都是对 AppStorage 的访问，AppStorage 中的更改会自动同步到 PersistentStorage。

- PersistentStorage 和 AppStorage 中的属性建立双向同步。应用开发通常通过 AppStorage 访问 PersistentStorage，另外还有一些接口可以用于管理持久化属性，但是业务逻辑始终是通过 AppStorage 获取和设置属性的。

参考文档链接：https://docs.openharmony.cn/pages/v4.0/zh-cn/application-dev/quick-start/arkts-application-state-management-overview.md/

# 七、三方插件使用

1. 打开 Terminal 窗口，通过如下指令进入到 entry 目录。

```shell
cd entry
```

2. 以引入“dayjs”为例，执行以下指令进行安装。

```shell
ohpm install dayjs
```

3. 在对应的 js 文件中直接引用。

```ts
import dayjs from "dayjs";
```

# 八、打包发布
