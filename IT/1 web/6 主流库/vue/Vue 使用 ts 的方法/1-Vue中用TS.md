## 在Vue项目中使用了TypeScript,

1. 可以像过去一样通过对象的方式来定义组件以外
2. 还可以借助官方的vue-class-component库和vue-property-decorator库用类的方式来定义组件
3. 因为通过脚手架创建,并指定使用 ts 在创建时已经安装好了,可直接使用



## 更多学习资源

- vue-class-component：强化 Vue 组件，使用 TypeScript/装饰器 增强 Vue 组件
  https://class-component.vuejs.org/
- vue-property-decorator：在 vue-class-component 上增强更多的结合 Vue 特性的装饰器
  https://github.com/kaorun343/vue-property-decorator
  - 比如增加了 监听属性 watch 





## 使用步骤

1. 引入组件
2. 常用方式说明

```js
<script>
// import Vue from 'vue'
// import Component from 'vue-class-component'
  // 使用 vue-property-decorator 代替上面两句话
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Home extends Vue {
  // 数据绑定
  // 如果是通过类的方式来定义组件, 那么类中的属性就是过去data中定义的数据
  message = 'www.it666.com';
str = '12345678';
// 方法绑定
// 如果是通过类的方式来定义组件, 那么类中的方法就是过去methods中定义的方法
myFn(){
  alert('www.itzb.com');
}
// 计算属性
// 如果是通过类的方式来定义组件, 那么我们类中的getter方法就是过去computed中的方法
get msg(){
  console.log('执行了');
  return this.str.split("").reverse().join("");
}
// 第一个参数: 需要观察的属性名称
// 第二个参数: 可选配置, 如果deep:true,表示深度监听
@Watch('message', {deep: true})
messageChange(newValue, oldValue){
  console.log(newValue, oldValue);
}
}
  </script>

```



