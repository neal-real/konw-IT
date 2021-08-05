## vue 传值方式

### 父传子

#### 方法1:props


父组件 :在子组件的元素赋值给子组件props属性中属性名

~~~html
<template>
  <div>
		<indexSon sonMsg="传字符串,去掉:号"></indexSon>
    <indexSon :sonMsg="msgage"></indexSon>
  </div>
</template>
<script>
import indexSon from './indexSon.vue'
export default {
  data() {
    return {
      msgage: '今天天气怎样'
    }
  }
}
</script>
~~~

子组件 中

~~~html
<template>
  <div>
    <div v-text="sonMsg"></div>
  </div>
</template>

<script>
export default {
  props: {		// 在props属性中声明属性名sonMsg,设定值类型为String
    sonMsg: String
  }
}
</script>
~~~

#### 方法2 $ref

在父组件中,用ref获取子元素实例,直接给其属性赋值

~~~html

<template>
  <div>
	  // 1. ref的div是给子元素起的别名,方便在本组件中使用
		<indexSon ref="div"></indexSon>  
  </div>
</template>
<script>
import indexSon from './indexSon.vue'
export default {
  data() {
    return {
      msgage: '今天天气怎样'
    }
  },
  mounted() {
    //2. 直接调用子元素的foo属性赋值
    this.$refs.div.foo = '今天天气很好'
  },
}
</script>
~~~

子组件中, data的属性可以直接被使用.

~~~php+HTML
<template>
  <div>
    <div v-text="foo"></div>
  </div>
</template>
<script>
export default {
data() {
    return {
      foo: '值'
    }
  }
}
</script>
~~~

#### 方法3: $children

父组件中通过$children数组直接拿到子组件实例,修改其属性

> $children是只读属性无法修改,但是可以修改其内部组件的属性.
>
> $children内部子元素是不保证子元素顺序的,多子元素需要做判断

~~~js
mounted() {
    this.$children[0].foo = 'children今天天气很好'
  	// 仅有一个子元素可以这样写
    console.log(this.$children[0].$vnode.componentOptions.tag)
  	// 有多个子元素
    this.$children.filter(item => {
      // 获取到子元素的tag,截取字符串最后一段的值获取到name属性
      var strArrary = item.$vnode.tag.split('-')
      var strItem = strArrary[strArrary.length - 1]
      if (strItem === 'sonName') {  //'sonName是子元素name属性的值
        item.foo = '满足条件'
      }
    })
  	// 或者通过挂载的子组件别名 确定也可以
  	this.$children.filter(item => {
      if (item.$vnode.componentOptions.tag === 'indexSon') {
        item.foo = '满足条件'
      }
    })
  },
~~~





### 子传父

#### 观察者模式

> 子组件发起事件, 父组件响应事件

~~~html
<!-- 
1. 用$emit() 包裹事件名称
2. 事件名称用''号包裹
3. 参数不要用''号,写在事件名称后面用逗号分开
-->
<template>
  <div>
    <button @click="onClick()">son按钮</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: '身体健康,早日康复'
    }
  },
  methods: {
    onClick(e) {
      // 通过$emit('请实现的方法名',参数)
      this.$emit('clickSonBtn', msg)
      // 方式2 
      this.$parent.$emit('clickSonBtn', msg)
    }
  }
}
</script>

~~~

父组件的位置

~~~html
<template>
  <div>
    <div v-text="msg"></div>
    <!-- 
			1. 使用子组件中emit函数包裹的方法名 
			2. 传参用$event 固定写法
			3. 设置响应方法onFather
		-->
    <indexSon ref="div" @clickSonBtn="onFather($event)"></indexSon>
  </div>
</template>
<script>
import indexSon from './indexSon.vue'
export default {
  components: {
    indexSon
  },
  data() {
    return {
      msg: ''
    }
  },
  mounted() {
    // 方式2 e是参数
    this.$on('validate', (e) => {
      this.validate(e)
    })
  },
  methods: {
    // 响应 event就是参数
    onFather(event) {
      this.msg = '父组件已经收的' + event
    }
  }
}
</script>
~~~

#### 自定义组件实现 v-model

> ​	需要重写:value和@input事件(这里的**双向绑定不同于传值**)

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



### 兄弟传值

> 通过父组件$parent实现传值

子组件1: 发出消息

~~~html
<template>
  <div>
    <!-- 语义: 告诉父组件的$emit事件名称和参数  -->
    <button @click="$parent.$emit('clickSonBtn', msg)">son按钮</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: '兄弟组件1'
    }
  }
}
</script>
~~~

子组件2: 接受信息

~~~html
<template>
  <div>
    <div v-text="msg"></div>
  </div>
</template>
<script>
export default {
  created() {
    this.$parent.$on('clickSonBtn', msg1 => {
      this.msg = msg1
    })
  }
}
</script>
~~~

### 祖先和某后代

> 1. 优于嵌套关系太深,导致传递繁琐,vue提供了provide和inject API **用户高阶插件/组件库**不推荐用于应用程序代码中
>
>   2 . 用户组件开发,不要用于程序开发
>
> 3. 仅可以祖先传向 子孙代 ,
> 4. 传入的值,仅仅作为读取. 官方不建议修改值,如果非要改,建议传个函数进来修改

祖代( ancestor )

~~~html
<script>
export default {
  // provide 可以用函数,可以对象
  provide: {
    zuxian: this.msg
  },
  // 和data一样可以用函数,可以对象 
  provide(){
    return {
      zuxian: '我是index'
    }
  },
  data() {
    return {
      msg: '我是data中的msg'
    }
  }
}
</script>
~~~

某后代( descendant )

~~~html
<template>
  <div>
    <div v-text="zuxian"></div>
  </div>
</template>
<script>
export default {
  inject: ['zuxian']
}
</script>
~~~



### 任意两个组件之间 传值

> 事件总线或vuex

#### 事件总线

> ​	创建一个Bus类负责事件派发,监听和回调管理

~~~js
# 在main.js中创建
// 创建一个事件总线 这个Vue实例 起名叫$bus ,专门用来传递数据
Vue.prototype.$bus = new Vue()
// 起名叫bus是为了打印在其他组件中是否能获取到好识别,后期可以删除
Vue.prototype.$bus.name = 'bus'
// 在下面实例之前完成
new Vue({
  router,
  store,
  render: h => h(App) // 渲染
}).$mount('#app') // 挂载

~~~

> 组件1:  发出信息

~~~html
<template>
  <div>
    <!-- 点击事件触发信息发送 -->
    <button @click="clickSonBtn">按钮</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: '组件1',
    }
  },
  methods: {
    clickSonBtn: function() {
      // 为$bus实例添加一个foo事件,将本组件msg做参数传入
      this.$bus.$emit('foo', this.msg)
      // 可打印$bus的名字看看是否是总线实例
      console.log(this.$bus.name)
    }
  }
}
</script>
~~~

> ​	组件2 : 监听事件,接受消息

~~~html
<template>
  <div>
    <div v-text="msg"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: ''
    }
  },
  mounted() {
    #通过$bus 监听foo的时间,msg接收值
    this.$bus.$on('foo', msg => {
      this.msg = msg + '兄弟2'
    })
  }
}
</script>
<style lang="less" scoped></style>

~~~



## Vuex 传值

### 基本使用

~~~js
1. 安装依赖包
      npm install vuex 
2. 创建store.js文件
3. store.js中 -> 创建store对象
import Vue from 'vue'   	//引入 Vue
import Vuex from 'vuex'		//引入 Vuex
Vue.use(Vuex)
export default new Vuex.Store({
  // 1. 创建store数据源,提供唯一公共数据
  state: {
    count: 0
  },
  mutations: {// 2. 修改数据
  },
  actions: {  // 3. 异步修改数据
  },
  getters: {  // 4. 包装数据
  }
})
4.  将store对象挂载到vue实例中
import store from './store' // 引入数据共享组件
new Vue({
  router,
  store, 	//挂载store 数据属性
  render: h => h(App) // 渲染
}).$mount('#app') // 挂载
~~~



### 1. 使用数据

> 方法1 : 需要用vuex的$store.state调用

~~~js
this.$store.state.count
在组件的template中使用插值表达可以省略 this.直接从$store 开始
~~~

> 方法2 : 扩展后的count ,直接使用 this.count 调用即可

~~~html
在样式中使用插值表达使用即可,
<srcipt>
<!-- 导入 -->
import { mapState } from"vuex"
export default {
		data() {return {   }},
		computed: {
			<!-- 通过扩展属性...把数组内的属性扩展为计算属性 --> 
        ...mapState(['count'])
    }
}
</srcipt>

~~~



### 2. 修改属性值

> 1. 在store.js中定义add方法

~~~js
# 1. 在mutations中创建函数,通过调用函数修改state中的值
export default new Vuex.Store({
  // 创建store数据源,提供唯一公共数据
  state: {
    count: 1
  },
  mutations: {
    // state永远是第一个参数
    add(state, num) {
      state.count += num
    }
  }
})
~~~

> 2. 在其他地方使用

~~~js
# 使用方式1
this.$store.commit('add', 1)
~~~

#使用方式2

~~~html
<template>
  <div>
	  <!-- 点击按钮 -->
    <button @click="clickBtn2">son2</button>
  </div>
</template>
<script>
 // 1. 引入mapMutations 对象
import { mapMutations } from 'vuex'
export default {
  methods: {
    // 2. 扩展mapMutations对象保存的方法
    ...mapMutations(['add']),
    // 3. 直接通过this.add(实参) 使用
    clickBtn2: function() {
      this.add(2)
    }
  }
}
</script>
~~~



### 3. 异步修改数据

> 通过Vuex.Store实例的actions函数, 调用修改数据的mutations函数中的方法,实现异步修改数据

~~~js
export default new Vuex.Store({
  // 创建store数据源,提供唯一公共数据
  state: {
    count: 1
  },
  mutations: {  /只能在此函数内修改state内的数据
    // add修改
    add(state, num) {
      state.count += num
    }
  },
  actions: {	/只能在此函数内异步修改state内的数据
    // 1. 声明一个函数名,然后在内部调用mutations下的方法,
    // 2. mutations下的方法中实现修改state中的数据,
    addAsync(context, step) {
      //context相当于vuex的实例对象,可以调用 commit方法
  		// step 参数
      setTimeout(() => {
        // add方法
        context.commit('add', step)
      }, 1000)
    }
  },
  getters: {}
})
~~~



> ​	使用方法1 :任何地方调用$store.dispatc

~~~js
//addAsync是actions函数中的方法,5 是参数
this.$store.dispatch('addAsync',5)
~~~

> 使用方法2: 

~~~html
<!-- 1. 引入 -->
import { mapActions } from'vuex'
<!-- 2. 展开 -->
methods: {
    ...mapActions(['addAsync','异步函数2']),
		<!-- 3. 使用和组件内部方法一样 -->
		btnHandler() {
			this.addAsync(5)
		}
}
或者直接在元素中响应事件即可 ,和组件声明的函数是一样的
<button @click="addAsync">点击</button>
~~~



### 4. 包装数据

   > 1. 对store中已有的数据加工处理之后形成新的数据,类似Vue的计算属性.
   > 2. store 中数据发生变化,Getter的数据也会跟着变化

声明 

~~~js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    count: 1
  },
  getters: {
    // showNum相当起了一个别名,加工了State中的数据,暴露外部使用
    showNum: state => {
      return '当前最新的数据是[' + state.count + ']'
    }
  }
})

~~~



> 使用方法1 :插值表达式中使用

~~~html
<h3>{{$store.getters.showNum}}</h3>
this.$store.getters.showNum
~~~

> 使用方法2: 

~~~js
1.引入   
import { mapState, mapGetters } from'vuex'
2. 展开
computed: {
// 通过扩展属性...把数组内的属性扩展为计算属性
    ...mapState(['count']),
    ...mapGetters(['showNum'])
}
~~~



## 插槽

### 匿名插槽

> 基本用法

~~~html
<!-- 子组件 -->
<template>
  <div>
    <!-- 匿名插槽 -->
    <slot></slot>
  </div>
</template>

<!-- 父组件:用法1 -->
<indexSon v-slot>插入子组件1</indexSon>
<!-- 父组件:用法2 -->
<indexSon v-slot>
  <div>
    内容1
  </div>
</indexSon>
~~~



### 具名插槽

> 基本用法和传参(子组件传父组件)

~~~html
<!-- 子组件 -->
<template>
  <div>
    <!-- 具名插槽 传参 -->
    <slot name='slotName'></slot>
    <p>=======================</p>
    <slot name='slotName2' str='子组件字符串值' :bar='bar'></slot>
  </div>
</template>
<script>
export default {
  data() {
   return {
      bar: '子组件bar的变量值'
    }
  },
</script>




<!-- 父组件:用法1 -->
<indexSon v-slot:son2>插入子组件1</indexSon>
<!-- 父组件:用法2 template是个容器,渲染时会被删除-->
 <indexSon2>
    <!--templates是插槽容器标签,用来分类插槽的具体指向-->
		<template v-slot:slotName>
			<div>这里的内容插入名字是slotName的插槽</div>
		</template>
    <!-- 接受参数 -->
   <!-- v-slot:slotName2="" 冒号处会从子组件返回slotProps一个对象,可以直接用{}结构 -->
    <template v-slot:slotName2="{ str, bar }">
      {{bla}}---这是父组件--{{bar}}
			<div>这里的内容的插槽名字是slotName2的插槽</div>
    </template>
</indexSon2>
~~~



### 作用域插槽

> ​	根据父组件的数据决定子组件显示的内容

**子组件的设置**

~~~html
<template>
  <div>
    <ul>
      <!-- 2.通过list数据,for循环创建li -->
      <li :key="item.id" v-for='item in list' >
        <!-- 3.通过具名插槽方式,将li中具体的数据传给父组件 -->
        <slot name='item' :item='item'></slot>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  // 1.通过props 接受父组件的list数据
  props: ['list']
}
</script>
<style lang="less" scoped></style>

~~~

父组件的设置

~~~html
<template>
  <div>
    <!-- 1. 通过子组件的:list属性 先获得本组件的list数据 -->
    <indexSon :list="list">
      <!-- 2. 具名插槽的方式获得item的数据 -->
      <template v-slot:item="{ item }">
        <!-- 3. item的id==3 设置class类,并显示item.name -->
        <strong v-if="item.id == 3" class="current">{{ item.name }}</strong>
				<!-- 4. 不符合条件直接显示item.name -->
        <strong v-else>{{ item.name }}</strong>
      </template>
    </indexSon>
  </div>
</template>
<script>
import indexSon from './indexSon.vue'
export default {
  data() {
    return {
      list: [
        { id: 1, name: 'apple' },
        { id: 2, name: 'orange' },
        { id: 3, name: 'banana' }
      ]
    }
  },
  components: {
    indexSon,
  }
}
</script>
<style lang="less" scoped>
.current {
  color: orange;
}
</style>

~~~













