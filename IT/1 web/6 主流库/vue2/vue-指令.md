##  指令->14个

- 本质就是自定义属性

###  v-cloak

- 防止页面加载时出现闪烁问题

  ```html
   <style type="text/css">
    /* 
      1、通过属性选择器 选择到 带有属性 v-cloak的标签  让他隐藏
   */
    [v-cloak]{
      /* 元素隐藏    */
      display: none;
    }
    </style>
  <body>
    <div id="app">
      <!-- 2、 让带有插值表达式的元素 添加 v-cloak 属性 
           此元素暂时隐藏,等vue完成渲染后插值表达式的msg有值既显示此元素
  				 避免因为值快速变动引起的内容替换的闪烁问题
      -->
      <div  v-cloak  >{{msg}}</div>
    </div>
    <script type="text/javascript" src="js/vue.js"></script>
    <script type="text/javascript">
      var vm = new Vue({
        el: '#app',
        //  data  里面存储的是数据
        data: {
          msg: 'Hello Vue'
        }
      });
  </script>
  </body>
  </html>
  ```
  

###  v-text/v-html

- v-text指令用于将数据填充到标签中，作用于插值表达式类似，但是没有闪动问题
- 如果数据中有HTML标签会将html标签一并输出
- 注意：此处为单向绑定，数据对象上的值改变，插值会发生变化；但是当插值发生变化并不会影响数据对象的值

```html
<div id="app">
		<!-- 使用v-text和v-html时不需要写插值表达,但效果一样 -->
    <p v-text="msg"></p> <!-- msg属性全部渲染为文本 -->
    <p v-html="html"></p> <!-- html属性中如果有标签,渲染时被解析为标签 -->
		<!-- 插值表达式不会解析标签 -->
  	<p>{{msg}}</p>
</div>
<script>
    new Vue({
        el: '#app',
        data: {
         msg: "<span>通过双括号绑定</span>",
　　　　  html: "<span>html标签在渲染的时候被解析</span>",
        }
    });
</script>
```

### **v-once/v-pre**

- v-once 仅执行一次插值解析和渲染后转为静态资源,不在参与vue的解析
- v-pre 一次都不参与解析,值是什么显示什么

```html
  <!-- 即使data里面定义了msg 后期我们修改了 仍然显示的是第一次data里面存储的数据即 Hello Vue.js  -->
     <span v-once>{{ msg}}</span>    
<script>
    new Vue({
        el: '#app',
        data: {
            msg: 'Hello Vue.js'
        }
    });
</script>
```



### v-model

- 双向数据绑定

- **v-model**是一个指令，限制在 `<input>、<select>、<textarea>、components`中使用
- v-model绑定的属性值发生变化,所有使用msg属性地方同步变化.

> - [`.lazy`](https://cn.vuejs.org/v2/guide/forms.html#lazy) -  替换 `input` 事件(内容发生变化时)为 `change` 事件(失去焦点时)
> - [`.number`](https://cn.vuejs.org/v2/guide/forms.html#number) - 输入字符串转为数字类型
> - [`.trim`](https://cn.vuejs.org/v2/guide/forms.html#trim) - 输入内容自动过滤收尾的空格

```html
 <div id="app">
      <div v-text="msg"></div>
      <div>
        <input type="text" v-model='msg'>
        <!-- 修饰符用法 -->
        <input type="text" v-model.lazy='msg'>
      </div>
  </div>
```

#### 自定义组件实现v-model 

> ​	需要重写:value和@input事件

~~~html
<template>
  <input v-bind="$attrs" :value="value" @input="onInput" />
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    onInput(e) {
      // input这里传出去的是input的事件,不是OnInput
      this.$emit('input', e.target.value)
    }
  }
}
</script>

在外部使用的时候直接 正常使用v-model即可
<KInput v-model="model.userName"></KInput>
~~~





###   v-on

- 用来绑定事件的
-  形式如：v-on:click  缩写为 @click;

####  v-on事件函数中传入参数

```html
<body>
  <div id="app">
    <div>
      <!-- 无参数,事件对象默认最为第一个参数 -->
      <button v-on:click='handle1'>点击1</button>
      <!-- 传参时,事件对象必须作为最后一个参数显示传递，且事件对象的名称必须是$event -->
      <button @click='handle2(123, 456, $event)'>点击2</button>
    </div>
    </div>
  <script type="text/javascript" src="js/vue.js"></script>
  <script type="text/javascript">
    var vm = new Vue({
      el: '#app',
      data: { num: 0 },
      methods: {
        handle1: function(event) {
        console.log(event.target.innerHTML)
       },
        handle2: function(p, p1, event) {
          console.log(p, p1)
          console.log(event.target.innerHTML)
        }
     }
  });
</script>
```

####  事件修饰符

- 在事件处理程序中调用 `event.preventDefault()` 或 `event.stopPropagation()` 是非常常见的需求。
- Vue 不推荐我们操作DOM    为了解决这个问题，Vue.js 为 `v-on` 提供了**事件修饰符**
- 修饰符是由点开头的指令后缀来表示的

```html
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联   即阻止冒泡也阻止默认事件 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>
使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用 v-on:click.prevent.self 会阻止所有的点击，而 v-on:click.self.prevent 只会阻止对元素自身的点击。
```

#### 按键修饰符

- 在做项目中有时会用到键盘事件，在监听键盘事件时，我们经常需要检查详细的按键。Vue 允许为 `v-on` 在监听键盘事件时添加按键修饰符

```html
<!-- 只有在 `keyCode` 是 13 时调用 `vm.submit()` -->
<input v-on:keyup.13="submit">

<!-- -当点击enter 时调用 `vm.submit()` -->
<input v-on:keyup.enter="submit">

<!--当点击enter或者space时  时调用 `vm.alertMe()`   -->
<input type="text" v-on:keyup.enter.space="alertMe" >

常用的按键修饰符
.enter =>    enter键
.tab => tab键
.delete (捕获“删除”和“退格”按键) =>  删除键
.esc => 取消键
.space =>  空格键
.up =>  上
.down =>  下
.left =>  左
.right =>  右

<script>
	var vm = new Vue({
        el:"#app",
        methods: {
              submit:function(){},
              alertMe:function(){},
        }
    })

</script>
```

#### 自定义按键修饰符别名

- 在Vue中可以通过`config.keyCodes`自定义按键修饰符别名

```html
<div id="app">
    预先定义了keycode 116（即F5）的别名为f5，因此在文字输入框中按下F5，会触发prompt方法
    <input type="text" v-on:keydown.f5="prompt()">
</div>

<script>
	// 键盘每个键都对应了一个数字字符,用f5自定义的名,可以替代116的数字.在上面使用时更明确知道指定的键盘上的哪个键
    Vue.config.keyCodes.f5 = 116;

    let app = new Vue({
        el: '#app',
        methods: {
            prompt: function() {
                alert('我是 F5！');
            }
        }
    });
</script>
```

### v-bind

- v-bind 指令被用来响应地更新 HTML 属性
- v-bind:href    可以缩写为    :href;

```html
<!-- 绑定一个属性 -->
<img v-bind:src="imageSrc">
<!-- 缩写 -->
<img :src="imageSrc">
```

#### 绑定对象

- 我们可以给v-bind:class 一个对象，以动态地切换class。
- 注意：v-bind:class指令可以与普通的class特性共存

```html
1、 v-bind 中支持绑定一个对象 
	如果绑定的是一个对象 则 键为 对应的类名  值 为对应data中的数据 
<!-- 
	HTML最终渲染为 <ul class="box textColor textSize"></ul>
	注意：
		textColor，textSize  对应的渲染到页面上的CSS类名	
		isColor，isSize  对应vue data中的数据  如果为true 则对应的类名 渲染到页面上 


		当 isColor 和 isSize 变化时，class列表将相应的更新，
		例如，将isSize改成false，
		class列表将变为 <ul class="box textColor"></ul>
-->

<ul class="box" v-bind:class="{textColor:isColor, textSize:isSize}">
    <li>学习Vue</li>
    <li>学习Node</li>
    <li>学习React</li>
</ul>
  <div v-bind:style="{color:activeColor,fontSize:activeSize}">对象语法</div>

<sript>
var vm= new Vue({
    el:'.box',
    data:{
        isColor:true,
        isSize:true，
    	activeColor:"red",
        activeSize:"25px",
    }
})
</sript>
<style>

    .box{
        border:1px dashed #f0f;
    }
    .textColor{
        color:#f00;
        background-color:#eef;
    }
    .textSize{
        font-size:30px;
        font-weight:bold;
    }
</style>
```

####  绑定class

```html
2、  v-bind 中支持绑定一个数组    数组中classA和 classB 对应为data中的数据

这里的classA  对用data 中的  classA
这里的classB  对用data 中的  classB
<ul class="box" :class="[classA, classB]">
    <li>学习Vue</li>
    <li>学习Node</li>
    <li>学习React</li>
</ul>
<script>
var vm= new Vue({
    el:'.box',
    data:{
        classA:‘textColor‘,
        classB:‘textSize‘
    }
})
</script>
<style>
    .box{
        border:1px dashed #f0f;
    }
    .textColor{
        color:#f00;
        background-color:#eef;
    }
    .textSize{
        font-size:30px;
        font-weight:bold;
    }
</style>
```

#### 绑定对象和绑定数组 的区别

- 绑定对象的时候 对象的属性 即要渲染的类名 对象的属性值对应的是 data 中的数据 
- 绑定数组的时候数组里面存的是data 中的数据 

#### 绑定style

```html
 <div v-bind:style="styleObject">绑定样式对象</div>'
 
<!-- CSS 属性名可以用驼峰式 (camelCase) 或短横线分隔 (kebab-case，记得用单引号括起来)    -->
 <div v-bind:style="{ color: activeColor, fontSize: fontSize,background:'red' }">内联样式</div>

<!--组语法可以将多个样式对象应用到同一个元素 -->
<div v-bind:style="[styleObj1, styleObj2]"></div>


<script>
	new Vue({
      el: '#app',
      data: {
        styleObject: {
          color: 'green',
          fontSize: '30px',
          background:'red'
        }，
        activeColor: 'green',
   		fontSize: "30px"
      },
      styleObj1: {
             color: 'red'
       },
       styleObj2: {
            fontSize: '30px'
       }

</script>
```

### v-if/v-else/v-else-if

-  根据条件判断,满足条件的元素参与渲染并显示,不是满足条件的不进行渲染

```html
<div id="app">
  <!--  判断是否加载，如果为真，就加载，否则不加载-->
  <span v-if="flag">如果flag为true则显示,false不显示!</span>
</div>
<script>
    var vm = new Vue({
        el:"#app",
        data:{ flag:true }
    })
</script>
----------------------------------------------------------
    <div v-if="type === 'A'"> A </div>
    <!-- v-else-if紧跟在v-if或v-else-if之后   表示v-if条件不成立时执行-->
    <div v-else-if="type === 'B'"> B </div>
    <div v-else-if="type === 'C'"> C </div>
    <!-- v-else紧跟在v-if或v-else-if之后-->
    <div v-else> Not A/B/C </div>
<script>
    new Vue({
      el: '#app',
      data: { type: 'C' }
    })
</script>
```

### v-show

> 和 v-if的区别

- v-show本质就是标签display设置为none，控制隐藏
  - v-show只编译一次，后面其实就是控制css，而v-if不停的销毁和创建，故v-show性能更好一点。
- v-if是动态的向DOM树内添加或者删除DOM元素
  - v-if切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件

### v-for

- 用于循环的数组里面的值可以是对象，也可以是普通元素  

```html
<ul id="example-1">
   <!-- 循环结构-遍历数组  
	item 是我们自己定义的一个名字  代表数组里面的每一项  
	items对应的是 data中的数组-->
  <li v-for="item in items">
    {{ item.message }}
  </li> 

</ul>
<script>
 new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]，
   
  }
})
</script>
```

- **不推荐**同时使用 `v-if` 和 `v-for`
- 当 `v-if` 与 `v-for` 一起使用时，`v-for` 具有比 `v-if` 更高的优先级。

```html
   <!--  循环结构-遍历对象
		v 代表   对象的value
		k  代表对象的 键 
		i  代表索引	
	---> 
     <div v-if='v==13' v-for='(v,k,i) in obj'>{{v + '---' + k + '---' + i}}</div>

<script>
 new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]，
    obj: {
        uname: 'zhangsan',
        age: 13,
        gender: 'female'
    }
  }
})
</script>
```

- key 的作用
  - **key来给每个节点做一个唯一标识**
  - **key的作用主要是为了高效的更新虚拟DOM**

```html
<ul>
  <li v-for="item in items" :key="item.id">...</li>
</ul>

```

### v-solt

* 插槽指令: 子组件预留好位置,让使用的父组件可以将内容放入特定的位置
* 根据需求不同,分为匿名/具名插槽

~~~html
在子组件的写法
<!-- 匿名插槽 -->
<template id="temp">
   <div>
    <slot></slot>
  </div>
</template>
<!-- 具名插槽 -->
<template id="temp">
   <div>
    <slot name="content"></slot>
  </div>
</template>

父组件中的使用
<!-- 匿名插槽两种写法 -->
  <div v-slot>匿名插槽内容</div>
  <div v-slot:default>匿名插槽内容</div>
<!-- 通过v-slot:的值指向同名的子组件slot元素的name值所在的元素位置-->
  <div v-slot:content>具名插槽内容</div>

父组件中的使用方法2: 
<!-- 通过template元素可以在父组件编辑子组件对应位置的详细内容 -->
<template v-slot:content>
  <div> 具名插槽内容 </div>
</template>
~~~

#### 具名插槽做参数

~~~php+HTML
<!-- 子组件 -->
<slot name="content" str='子组件bla的字符串1' :bar='bar'></slot>
export default {
  data() {
   return {
      bar: '子组件bar的属性值'
    }
  },
<!-- 父组件 -->
<!-- v-slot:content="" 冒号处会从子组件返回一个对象,可以直接用{ }结构子组件传回来的值 -->
<loginson v-slot:content="{ str, bar }"> 
    {{str}}---这是父组件--{{bar}}
</loginson>
~~~

#### 作用域插槽


~~~js
就是一种根据父组件的数据，来决定子组件的内容的思路。
/*
      作用域插槽:在子组件设定好插糟，然后在父组件决定往插槽中放入什么数据
    */
Vue.component('fruit-list', {
props: ['list'],
template: `
        <div>
          <li :key='item.id' v-for='item in list'>
            <slot :info='item'>{{item.name}}</slot>
          </li>
        </div>
      `
    });

父组件的数据
varvm=newVue({
el: '#app',
data: {
list: [
          {id: 1,name: 'apple'},
          {id: 2,name: 'orange'},
          {id: 3,name: 'banana'}
        ]
      }    });


在根元素中
<divid="app">
    <fruit-list:list='list'>
<!-- template是容器元素,
         slot-scope是固定写法,用来获取子组件的数据
         slot-scope='item'的item是自定义变量名
      -->
      <templateslot-scope='item'>
<!-- slotProps.子组件的slot中的属性info是随意写
           下面两行,满足if条件的 赋予类,不满足的直接显示item的name值
         -->
        <strongv-if='item.info.id==3'class="current">{{item.info.name}}</strong>
        <spanv-else>{{item.info.name}}</span>
      </template>
    </fruit-list>
  </div>
~~~



### 自定义指令

- 内置指令不能满足我们特殊的需求
- Vue允许我们自定义指令

#### Vue.directive  注册全局指令

```html
<!-- 
  使用自定义的指令，只需在对用的元素中，加上'v-'的前缀形成类似于内部指令'v-if'，'v-text'的形式。 
-->
<input type="text" v-focus>
<script>
// 注意点： 
//   1、 在自定义指令中  如果以驼峰命名的方式定义 如  Vue.directive('focusA',function(){}) 
//   2、 在HTML中使用的时候 只能通过 v-focus-a 来使用 
    
// 注册一个全局自定义指令 v-focus
Vue.directive('focus', {
  	// 当绑定元素插入到 DOM 中。 其中 el为dom元素
  	inserted: function (el) {
    		// 聚焦元素
    		el.focus();
 	}
});
new Vue({
　　el:'#app'
});
</script>
```

#### Vue.directive  注册全局指令 带参数

```html
  <input type="text" v-color='msg'>
 <script type="text/javascript">
    /*
      自定义指令-带参数
      bind - 只调用一次，在指令第一次绑定到元素上时候调用

    */
    Vue.directive('color', {
      // bind声明周期, 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
      // el 为当前自定义指令的DOM元素  
      // binding 为自定义的函数形参   通过自定义属性传递过来的值 存在 binding.value 里面
      bind: function(el, binding){
        // 根据指令的参数设置背景色
        // console.log(binding.value.color)
        el.style.backgroundColor = binding.value.color;
      }
    });
    var vm = new Vue({
      el: '#app',
      data: {
        msg: {
          color: 'blue'
        }
      }
    });
  </script>
```

#### 自定义指令局部指令

- 局部指令，需要定义在  directives 的选项   用法和全局用法一样 
- 局部指令只能在当前组件里面使用
- 当全局指令和局部指令同名时以局部指令为准

```html
<input type="text" v-color='msg'>
 <input type="text" v-focus>
 <script type="text/javascript">
    /*
      自定义指令-局部指令
    */
    var vm = new Vue({
      el: '#app',
      data: {
        msg: {
          color: 'red'
        }
      },
   	  //局部指令，需要定义在  directives 的选项
      directives: {
        color: {
          bind: function(el, binding){
            el.style.backgroundColor = binding.value.color;
          }
        },
        focus: {
          inserted: function(el) {
            el.focus();
          }
        }
      }
    });
  </script>
```