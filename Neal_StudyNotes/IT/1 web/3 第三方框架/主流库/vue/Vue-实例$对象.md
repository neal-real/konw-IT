# Vue 实例属性 $类

> vue的实例属性$类
>
> 实例 property = 实例属性

~~~js
//Vue 实例观察的数据对象。Vue 实例代理了对其 data 对象 property 的访问。
vm.$data
//当前组件接收到的 props 对象。Vue 实例代理了对其 props 对象 property 的访问。
vm.$props
//Vue 实例使用的根 DOM 元素。
vm.$el
/*this.$options可以获取当前实例中全部的属性和其内容例
如:this.$options.methods*/
vm.$options
//父实例，如果当前实例有的话
vm.$parent
//当前组件树的根 Vue 实例
vm.$root
//当前实例的直接子组件,子组件的顺序不保证
vm.$children
/*插糟的数组。具名插槽依靠名字获取;例如：v-slot:foo -> vm.$slots.foo
匿名插槽: this.$slots.default(可能)
*/
vm.$slots
// 用来访问作用域插槽,且$slots都作为函数在此属性中,以后vue3也会把插槽全部当做函数,推荐在这里使用插槽相关的
vm.$scopedSlots
//持有注册过 ref 属性 的所有 DOM 元素和组件实例
vm.$refs
//当前 Vue 实例是否运行于服务器。 返回boolean值
vm.$isServer
/*
	获取从父组件传来的属性和值,展开在所在元素的位置.
	其中三种属性和值不会被获取: 
	1. 被prop识别获取的
	2. class
	3. style
*/ 
vm.$attrs
/*
* 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器
*/
vm.$listeners
~~~

