## html5 新 api

1. WebSocket

   - WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。

     WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

     在 WebSocket API 中，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。

   - 使用

   ```js
   function WebSocketTest() {
     if ("WebSocket" in window) {
       alert("您的浏览器支持 WebSocket!");

       // 打开一个 web socket
       var ws = new WebSocket("ws://localhost:9998/echo");

       ws.onopen = function () {
         // Web Socket 已连接上，使用 send() 方法发送数据
         ws.send("发送数据");
         alert("数据发送中...");
       };

       ws.onmessage = function (evt) {
         var received_msg = evt.data;
         alert("数据已接收...");
       };

       ws.onclose = function () {
         // 关闭 websocket
         alert("连接已关闭...");
       };
     } else {
       // 浏览器不支持 WebSocket
       alert("您的浏览器不支持 WebSocket!");
     }
   }
   ```

2. canvas

- `<canvas>` 标签只是图形容器，必须使用脚本来绘制图形。
- https://www.canvasapi.cn/

3. SVG

- SVG 与 Canvas 两者间的区别

  SVG 是一种使用 XML 描述 2D 图形的语言。

  Canvas 通过 JavaScript 来绘制 2D 图形。

  SVG 基于 XML，这意味着 SVG DOM 中的每个元素都是可用的。您可以为某个元素附加 JavaScript 事件处理器。

  在 SVG 中，每个被绘制的图形均被视为对象。如果 SVG 对象的属性发生变化，那么浏览器能够自动重现图形。

  Canvas 是逐像素进行渲染的。在 canvas 中，一旦图形被绘制完成，它就不会继续得到浏览器的关注。如果其位置发生变化，那么整个场景也需要重新绘制，包括任何或许已被图形覆盖的对象。

- Canvas 与 SVG 的比较

  Canvas

  依赖分辨率

  不支持事件处理器

  弱的文本渲染能力

  能够以 .png 或 .jpg 格式保存结果图像

  最适合图像密集型的游戏，其中的许多对象会被频繁重绘

  SVG

  不依赖分辨率

  支持事件处理器

  最适合带有大型渲染区域的应用程序（比如谷歌地图）

  复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快）

  不适合游戏应用
