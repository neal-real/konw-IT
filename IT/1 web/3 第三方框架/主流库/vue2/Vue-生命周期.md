## Vue生命周期

> Vue实例从创建 到销毁的过程 ，这些过程中会伴随着一些函数的自调用。我们称这些函数为钩子函数

#### beforeCreate 实例创建前

> 在实例初始化之后，数据观测和事件配置之前被调用 此时data 和 methods 以及页面的DOM结构都没有初始化   什么都做不了

1. initLifecycle(vm): 主要作用是确认组件的父子关系和初始化某些实例属性。找到父组件实例赋值给`vm.$parent`，将自己`push`给父组件的`$children`；
2. initEvents(vm): 主要作用是将父组件使用`v-on`或`@`注册的自定义事件添加到子组件的私有属性`vm._events`中；
3. initRender(vm): 主要作用是初始化用来将`render`函数转为`vnode`的两个方法`vm._c` 和`vm.$createElement`。用户自定义的`render`函数的参数`h`就是`vm.$createElement`方法，它可以返回`vnode`。等以上操作全部完成，就会执行`beforeCreate`钩子函数，此时用户可以在函数中通过`this`访问到`vm.$parent`和`vm.$createElement`等有限的属性和方法。

#### created   实例创建后

> 1. 在实例创建完成后被立即调用此时data 和 methods已经可以使用  但是页面还没有渲染出来
> 2. created()只会触发一次

1. initInjections(vm): 初始化`inject`，使得`vm`可以访问到对应的依赖；
2. initState(vm): 初始化会被使用到的状态，状态包括`props`，`methods`，`data`，`computed`，`watch`五个选项。调用相应的`init`方法，使用`vm.$options`中提供的选项对这些状态进行初始化，其中`initData`方法会调用`observe(data, true)`，实现对`data`中属性的监听，实际上是使用`Object.defineProperty`方法定义属性的`getter`和`setter`方法；
3. initProvide(vm)：初始化`provide`，使得`vm`可以为子组件提供依赖。

#### beforeMount  挂载开始前

> 在挂载开始之前被调用   此时页面上还看不到真实数据 只是一个模板页面而已 

1. 如果用户在创建根 Vue 实例时提供了`el`选项，那么在实例化时会直接调用`vm.$mount`方法开始关联el：

```js
if (vm.$options.el) {
    vm.$mount(vm.$options.el)
}
```

2. 如果没有提供el的根元素,则回去检查vm.#mount方法中,是否手动关联el,如果依然没有则报错

~~~js
运行时版本：
Vue.prototype.$mount = function(el) { // 最初的定义
    return mountComponent(this, query(el));
}
完整版：
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function(el) {  // 拓展编译后的
    var options = this.$options;
    if(!options.render) {
        if(options.template) {
            ...                //一些判断
        } else if (el) {    //传入的 el 选项不为空
            options.template = getOuterHTML(el);
        }
        
        if (options.template) {
                options.render = compileToFunctions(template, ...).render    //将 template 编译成 render 函数
        }
    }
    ...
    return mount.call(this, query(el))    //即 Vue.prototype.$mount.call(this, query(el))
}

~~~

3. 在vm.mount方法中,需要提供render函数,如果没有就会将`template`或者`el.outerHTML`编译成`render`函数。
   然后会执行`mountComponent`函数

~~~js
export function mountComponent(vm, el) {
    vm.$el = el
    ...
    callHook(vm, 'beforeMount')
    ...
    const updateComponent = function () {
        vm._update(vm._render())    // 调用 render 函数生成 vnode，并挂载到 HTML中
    }
    ...
    if (vm.$vnode == null) {
        vm._isMounted = true;
        callHook(vm, 'mounted');
    }
}
~~~

4. 此时在函数中可以通过`this`访问到`vm.$el`属性，此时它的值为`el`提供的真实节点

####  mounted 实例挂载完成

1. 实例被关联后调用,但不保证所有子组件全都关联好了,如果希望整个视图都渲染完毕,可以在内部调用vm.$nextTick

~~~js
mounted: function () {
  this.$nextTick(function () {
    // 全部子组件都关联结束
  })
}
/el被新创建的vm.$el替换，并挂载到实例上去之后调用该钩子。  数据已经真实渲染到页面上  在这个钩子函数里面我们可以使用一些第三方的插件 
~~~

####  beforeDestroy

> 实例销毁前调用

####  destroyed

> 实例销毁后调用

####  errorCaptured

> 子组件抛出异常和错误时调用

~~~js
  /*
    * 错误对象  Error 
    * 发生错误的组件实例  Component
    * 错误来源信息的字符串 info
    */
    errorCaptured:function(Error,Component, info) { 
    }
~~~



#### beforeUpdate

> ​	 数据更新时调用，发生在虚拟DOM打补丁之前。   页面上数据还是旧的

~~~js
//发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。
~~~



#### updated

> 由于数据更改导致的虚拟DOM重新渲染和打补丁，在这之后会调用该钩子。 页面上数据已经替换成最新的 |

####  activated

> 1. 被 keep-alive 缓存的组件激活时调用。
> 2. 在vue对象存活的情况下，进入当前存在activated()函数的页面时，一进入页面就触发；可用于初始化页面数据等

####  deactivated

> 被 keep-alive 缓存的组件停用时调用。





