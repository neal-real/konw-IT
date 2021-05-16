# Vue实例对象

## 核心属性

~~~js
export default {
  name: 'app', 					//组件名称
  model: 			//自定义组件,使用v-model时定制 prop 和 event
  inheritAttrs: false,  // 避免顶层容器继承属性
  comments: true 				//保留模板中的HTML注释。默认false,不保留
  # 自定义操作函数
  directives:						// 自定义指令挂载属性
  filter 	: 						//过滤器
	components: {}, 			//挂载子组件(关联子组件)
	#路由卫士类群
	beforeRouteEnter
	beforeRouteUpdate
	beforeRouteLeave		
  #生命周期函数
  created								//实例创建后, 自会触发一次
  activited 	  				//每次进入当前页面被调用一次,用来初始化当前页面
	mounted	 							//mounted实例挂载完成
	update								//数据更新会触发
	# 数据传递操作类
  provide(){return { 属性名:属性值 }} //祖父传值用和inject搭配
	inject: ['属性名']									//后代接受值用和provide搭配
	props:{ sonMsg: String } 					//接收父组件传值属性
  data() {return { 属性名:属性值 }} 	//本组件属性声明属性
	propsData
	computed													//数据计算属性
  methods:{					 								//方法/函数声明属性
    touchBtn: function() {
			this.show = !this.show
    }
  }	
	watch															// 数据监听属性
}
~~~



## 自定义操作函数

### filter:过滤器

- Vue.js允许自定义过滤器，可被用于一些常见的文本格式化。
- 过滤器可以用在两个地方：双花括号插值和v-bind表达式。
- 过滤器应该被添加在JavaScript表达式的尾部，由“管道”符号指示
- 支持级联操作
- 过滤器不改变真正的`data`，而只是改变渲染的结果，并返回过滤后的版本
- 全局注册时是filter，没有s的。而局部过滤器是filters，是有s的

```html
  <div id="app">
    <input type="text" v-model='msg'>
      <!-- upper 被定义为接收单个参数的过滤器函数，表达式  msg  的值将作为参数传入到函数中 -->
    <div>{{msg | upper}}</div>
    <!--  
      支持级联操作
      upper  被定义为接收单个参数的过滤器函数，表达式msg 的值将作为参数传入到函数中。
	  然后继续调用同样被定义为接收单个参数的过滤器 lower ，将upper 的结果传递到lower中
 	-->
    <div>{{msg | upper | lower}}</div>
    <div :abc='msg | upper'>测试数据</div>
  </div>

<script type="text/javascript">
   //  lower  为全局过滤器     
   Vue.filter('lower', function(val) {
      return val.charAt(0).toLowerCase() + val.slice(1);
    });
    var vm = new Vue({
      el: '#app',
      data: {
        msg: ''
      },
       //filters  属性 定义 和 data 已经 methods 平级 
       //  定义filters 中的过滤器为局部过滤器 
      filters: {
        //   upper  自定义的过滤器名字 
        //    upper 被定义为接收单个参数的过滤器函数，表达式  msg  的值将作为参数传入到函数中
        upper: function(val) {
         //  过滤器中一定要有返回值 这样外界使用过滤器的时候才能拿到结果
          return val.charAt(0).toUpperCase() + val.slice(1);
        }
      }
    });
  </script>
```

####  过滤器中传递参数

```html
    <div id="box">
        <!--
			filterA 被定义为接收三个参数的过滤器函数。
  			其中 message 的值作为第一个参数，
			普通字符串 'arg1' 作为第二个参数，表达式 arg2 的值作为第三个参数。
		-->
        {{ message | filterA('arg1', 'arg2') }}
    </div>
    <script>
        // 在过滤器中 第一个参数 对应的是  管道符前面的数据   n  此时对应 message
        // 第2个参数  a 对应 实参  arg1 字符串
        // 第3个参数  b 对应 实参  arg2 字符串
        Vue.filter('filterA',function(n,a,b){
            if(n<10){
                return n+a;
            }else{
                return n+b;
            }
        });
        
        new Vue({
            el:"#box",
            data:{
                message: "哈哈哈"
            }
        })

    </script>
```

## 路由卫士类群

> ​	三个类群相同的部分

每个守卫接受三个参数

* to: Route: 即将要进入的目标路由对象

* from: Route: 当前导航正要离开的路由

* next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。

  * next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed （确认的）
  * next(false): 中断当前的导航。如果浏览器的 URL 改变了（可能是用户手动或者浏览器后退按钮），那么 URL 地址会重置到 from 路由对应的地址。
  * next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
  * next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。

  确保要调用 next 方法，否则钩子就不会被 resolved。

###    beforeRouteEnter
###	beforeRouteUpdate
###	beforeRouteLeave	



## [生命周期函数](./vue-声明周期.md)

## 数据传递操作类



### methods:方法属性

~~~js
methods: {
    plus: function () {
			this.show = !this.show
    }
}
~~~

###  computed:计算属性

- 模板中放入太多的逻辑会让模板过重且难以维护  使用计算属性可以让模板更加的简洁
- **计算属性是基于它们的响应式依赖进行缓存的**
- computed比较适合对多个变量或者对象进行处理后返回一个结果值，也就是数多个变量中的某一个值发生了变化则我们监控的这个值也就会发生变化

```html
 <div id="app">
     <!--  
        当多次调用 reverseString  的时候 
        只要里面的 num 值不改变 他会把第一次计算的结果直接返回
		直到data 中的num值改变 计算属性才会重新发生计算
     -->
    <div>{{reverseString}}</div>
    <div>{{reverseString}}</div>
     <!-- 调用methods中的方法的时候  他每次会重新调用 -->
    <div>{{reverseMessage()}}</div>
    <div>{{reverseMessage()}}</div>
  </div>
  <script type="text/javascript">
    /*
      计算属性与方法的区别:计算属性是基于依赖进行缓存的，而方法不缓存
    */
    var vm = new Vue({
      el: '#app',
      data: {
        msg: 'Nihao',
        num: 100
      },
      methods: {
        reverseMessage: function(){
          console.log('methods')
          return this.msg.split('').reverse().join('');
        }
      },
      //computed  属性 定义 和 data 已经 methods 平级 
      computed: {
        //  reverseString   这个是我们自己定义的名字 
        reverseString: function(){
          console.log('computed')
          var total = 0;
          //  当data 中的 num 的值改变的时候  reverseString  会自动发生计算  
          for(var i=0;i<=this.num;i++){
            total += i;
          }
          // 这里一定要有return 否则 调用 reverseString 的 时候无法拿到结果    
          return total;
        }
      }
    });
  </script>
```

###  侦听器   watch

- watch仅监听 data 中 已经声明的数据 

#### 监听属性

~~~js
// 正常监听方式
data() {
    return {
      name: '',
    }
},
watch: {
   //name 属性发现变化就会更新
    name(newValue, oldValue) {
      console.log('最新值',newValue)
      console.log('原来的值',oldValue)
    }
}
# 这个方法无法监听对象内部属性变化
~~~

####  添加关键字 **immediate(立即执行)** 和 **deep(深度监听)**

```js
#deep:true 深度监听(监听对象内部属性变化)
data() {
  return {
    model: {
      userName: ''
    }
  }
},
  watch: {
    //原本的方式无法监听对象内部的属性,可以开启深度监听,但是这样递归监听消耗性能
    model: {
      //1. handler 固定写法用来接受值的变化,model下任何值变化都会触发
      handler(newValue, oldValue) {
        console.log('1值变化了', newValue.userName)
      },
      // 开启深度监听,递归监听model全部对象的每个值
      deep: true
    },
     // 仅监听对象的username属性的写法,节省性能,同步不用开启deep
    'model.userName': {
      handler(newValue, oldValue) {
        console.log('2值变化了', newValue)
      }
    }
  }
}
#immediate: true //让handler方法在开始的执行一次,不需要触发
watch: {
  firstName: {
    handler(newName, oldName) {
      this.fullName = newName + ' ' + this.lastName;
    },
    // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
    immediate: true
  }
}

```





## vue实例属性的两种写法

~~~js
// 不用指定根元素,这个页面本身已经说明根元素了
export default {
  //数据data的写法
  data() { return { msg: '' } },
  //方法/函数的写入位置:methods
  methods: { }
}
~~~

或Vue的引用文件中

~~~js
var vue = new Vue({
  //指定根元素
  el:'#app',
  //数据源属性
  data: function () { return { a: 1 } },
  //方法/函数的写入位置:methods
   methods: {}
})
~~~



