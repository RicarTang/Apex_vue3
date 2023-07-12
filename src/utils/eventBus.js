// 这里我们在js中暴露这个事件总线对象
// 组件通信插件
import mitt from "mitt";
const emitter = mitt();
export default emitter;