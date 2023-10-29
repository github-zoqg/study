var target = {
  dep: {
    a: 1,
    b: {
      c: 3,
    },
  },
  a: 2,
  b: 1,
};
function createGetter() {
  //   return function (target, propKey) {
  //     let res = target[propKey];
  return function (target, propKey, receiver) {
    console.log(...arguments, "...getArguments");
    let res = Reflect.get(target, propKey, receiver);
    console.log(`getting key：${propKey}`);
    if (typeof res == "object") {
      return reactive(res);
    }
    return res;
  };
}
let get = createGetter();
const hasOwn = (target, key) => hasOwnProperty.call(target, key);
var handler = {
  get,
  //   set: function (target, propKey, value) {
  set: function (target, propKey, value, receiver) {
    console.log(...arguments, "setArgu");
    const result = Reflect.set(target, propKey, value, receiver);
    const oldValue = target[propKey];
    const hadKey = hasOwn(target, propKey);
    if (!hadKey || oldValue != value) {
      target[propKey] = value;
    }
    return result;
  },
};
let ind = 0;
function reactive(targ) {
  //   console.log(++ind, targ, "index");
  return new Proxy(targ, handler);
}
var proxy = reactive(target);
console.log(proxy.dep.b.c);
proxy.dep.b.c = "asdf";
console.log("target: " + target.dep.b.c, ", proxy: " + proxy.dep.b.c);
