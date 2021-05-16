# vuex 数据

>  传值部分内容在vue-传值文件内

## 模块化

#### 1. 文件分割

> 1. 创建一个store文件夹,全部的vuex都在其中
> 2. 创建index.js文件作为根文件
> 3. 创建功能模块count.js
> 4. 引入功能模块,挂载到根vuex对象中
> 5. 使用

##### 根文件

~~~js
import Vue from 'vue'
import Vuex from 'vuex'
// 引入功能模块,并设置别名
import count from './count'

// 挂载到vue
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    // 方法1: 引入功能模块,设置别名
    a: count,
    // 方法2: 直接引入功能模块
    count
  }
})

~~~

##### 功能文件

~~~js
// 所有内容在此export default对象中
export default {
  /*
	* 开启独立空间,避免和外面命名冲突
	*	开启命名空间,引用方式会发生变化
	* namespaced默认为false
  **/
  namespaced: true,
  // 数据声明
  state: {
    name: '我是vuex',
    count: 0
  },
  // 数据修改
  mutations: {
    setName(state) {
      state.name = '我修改了name'
    }
  },
  // 异步和复杂操作
  actions: {},
  // 包装数据
  modules: {},
  // ??
  getters: {
    score(state) {
      return 'score' + state.count
    }
  }
}

~~~



#####  使用文件

~~~js
# 开启命名空间隔离和不开启有两种方式引用
<template>
  <div>
    // 开启命名空间
    {{ $store.state.a.name }}
    // 不起开
    {{ $store.state.name }}
    <br>
    // 开启命名空间
    {{ $store.getters['a/score'] }}
    // 不开启
		{{ $store.getters.score }}
    <button @click="onClick">按钮</button>
  </div>
</template>
<script>
export default {
  components: {
    // Notice
  },
  data() {
    return {}
  },
  // 函数声明属性
  methods: {
    onLogin() {},
    onClick() {
      // 开启命名空间
      this.$store.commit('a/setName')
      // 不开启
      this.$store.commit('setName')
    }
  }
}
</script>
<style lang="less" scoped></style>

~~~

