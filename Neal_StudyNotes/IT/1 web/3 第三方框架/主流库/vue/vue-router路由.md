## vue 全家桶系列 路由

## 基础

> ​	匹配优先级

####  安装:终端在vue项目目录下

> ​	vue add router

~~~js
1. 第一个问题: 你是否要用router模式 ,输入yes
2. 等待安装完成,安装后会改变目录结构要注意
~~~

​	

#### 在根组件下的使用

~~~js
// 路由路径: 基于基础url下的路径  name: 此位置写子组件别名
<router-link to="路由path路径">name</router-link>
// 路由占位符, 以后的文件将会出现在此位置,
<router-view />
~~~



### 基本说明

~~~js
# 1.引入
//引入基本文件 vue和vue-router
import Vue from 'vue'
import VueRouter from 'vue-router'
// 添加路由引导 格式 import 路由文件别名  from '组件目录路径'
import Test from '../components/test/Test.vue'
import Notice from '../components/Notice/index.vue'

// 挂载路由对象给单例对象vue
Vue.use(VueRouter)
# 2.路由对象和路径关联
// 路由的设置,因为后面会非常多,就单独那出来设置,并在创建路由对象时挂载.
const routes = [
  // 路由基本关系 path:基本url+分歧路径 component: 这个路径对应的页面是哪个
  { path: '/', component: Test },
  { path: '/n', component: Notice }
]
# 3.创建路由对象,并关联设置
const router = new VueRouter({
  // 基本url 在这个基础上在匹配 其他路由 http://111.111.111.11/shop
  base: 'http://localhost:8080',
	// 挂载路由设置  
  routes
})
# 4.导入对路对象,给根组件或main函数使用
// 完善上面设置后,导出路队对象
export default router

~~~



## 路由基础设置

### 动态路由匹配

#### 实例说明

~~~js
#正常用法:
const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
})

//User 文件内可以通过  this.$route.params拿到动态路径的参数 例如:
template: '<div>User {{ $route.params.id }}</div>'

# 不想看到$rout.params可以这样传参
const router = new VueRouter({
  routes: [
    // 开启porps: true
    { path: '/user/:id', component: User, porps: true }
  ]
})

//User 文件内用props接受id的值,直接使用
template: '<div>User {{ id }}</div>'
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  }
}
~~~



| 模式                          | 匹配路径            | $route.params                          |
| ----------------------------- | ------------------- | -------------------------------------- |
| /user/:username               | /user/evan          | `{ username: 'evan' }`                 |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: '123' }` |



#### 动态路由的注意点

##### 生命周期的问题

从 `/user/foo` 导航到 `/user/bar` 组件foo并不会被销毁,而是服用,所以无法触及组件销毁和重新加载等生命周期函数

~~~js
# 在生命周期的函数不会被触及的情况下,想因为路由参数的变化做出响应的话,有两种方式
1. wathc $rute对象的变化
const User = {
  template: '...',
  watch: {
    $route(to, from) {
      // 对路由变化作出响应...
    }
  }
}
2. 引用导航守卫: beforeRouteUpdate
const User = {
  template: '...',
  beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
  }
}
~~~



##### 捕获所有路由或404

常规参数只会匹配被 `/` 分隔的 URL 片段中的字符。如果想匹配**任意路径**，我们可以使用通配符 (`*`)：

```js
{
  // 会匹配所有路径
  path: '*'
}
{
  // 会匹配以 `/user-` 开头的任意路径
  path: '/user-*'
}
```

当使用*通配符*路由时，请确保路由的顺序是正确的，也就是说含有*通配符*的路由应该放在最后。路由 `{ path: '*' }` 通常用于客户端 404 错误。如果你使用了*History 模式*，请确保[正确配置你的服务器](https://router.vuejs.org/zh/guide/essentials/history-mode.html)。

当使用一个*通配符*时，`$route.params` 内会自动添加一个名为 `pathMatch` 参数。它包含了 URL 通过*通配符*被匹配的部分：

```js
// 给出一个路由 { path: '/user-*' }
this.$router.push('/user-admin')
this.$route.params.pathMatch // 'admin'
// 给出一个路由 { path: '*' }
this.$router.push('/non-existing')
this.$route.params.pathMatch // '/non-existing'
```



### 路由嵌套

> ​	1. 嵌套路由,必须在嵌套的路由文件上预留子组件入口(路由占位符)

~~~js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
          // 当 /user/:id/profile 匹配成功， UserProfile 会被渲染在 User 的 <router-view> 中
        { path: 'profile', component: UserProfile },
          // 当 /user/:id/posts 匹配成功  UserPosts 会被渲染在 User 的 <router-view> 中
        { path: 'posts', component: UserPosts }
					// 当 /user/:id 匹配成功，UserHome 会被渲染在 User 的 <router-view> 中
        { path: '', component: UserHome }
      ]
    }
  ]
})
~~~





### 重定向

~~~js
//redirect 将重定向的路径写在后面
const router = new VueRouter({
  routes: [
    // 写法1
    { path: '/a', redirect: '/b' }
    // 写法2 可以是一个命名的路由 :foo路由名字
    { path: '/a', redirect: { name: 'foo' }}
		// 写法3
     { path: '/a', redirect: to => {
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
    	}}
  ]
})
~~~



### 别名

> **`/a` 的别名是 `/b`，意味着，当用户访问 `/b` 时，URL 会保持为 `/b`，但是路由匹配则为 `/a`，就像用户访问 `/a` 一样。**

~~~js
// 地址栏是/b但还是显示/a的内容
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
~~~



## 路由守卫

> 有时要保护某些界面,需要验证才可以登录, 例如: 个人设置



### 全局守卫

####  1.开启验证

> 1. 添加  meta: { auth:true }  为需要验证的路由,开启验证 

~~~js
const router = new VueRouter({
  routes: [
    { path: '/about', name:"about", meta: { auth:true }, component: () => import("./views/About.vue")}
  ]
})
~~~

#### 2. 添加全局守卫
> 声明使用全局守卫
~~~js
/*
*	to: Route: 即将要进入的目标 路由对象
*	from: Route: 当前导航正要离开的路由
*	next: 
*/
router.beforeEach((to, from, next) => {
	//判断用户是否需要登录 
  if (to.meta.auth && !window.isLogin){
		// 需要登录:让用户登录
    if(window.confirm('请登录'){
     	  // 伪代码
    		window.isLogin = true;
		    next();// 登录成功继续下一步  
     }else{// 需要登录: 用户不登录,会首页
  	  next('/') // 放弃回首页
	  }
	 }else{ //不要登录 继续
  	  next('') 
	  }
})

~~~

### 路由级别的守卫

### 

####  1.直接验证

> 1. 不要添加开启验证,直接验证

~~~js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      // 路由级别的守卫
      beforeEnter: (to, from, next) => {
        // 验证代码
      }
    }
  ]
})
~~~



### 组件级别的守卫

> 在路由组件内直接定义以下路由导航守卫
>
> - `beforeRouteEnter`
> - `beforeRouteUpdate` (2.2 新增)
> - `beforeRouteLeave`

~~~js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // 一般防止用户未保存修改前突然离开.
  	  if (answer) {// 没有保存
	  	  next()
		  } else {
    		next(false) // 取消离开
		  }
  }
}
~~~



##  完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数。

## 路由拓展

动态路路由

> 利⽤$router.addRoutes()可以实现动态路路由添加，常用于:用户权限控制,根据权限决定显示内容
```js
// router.js
 // 返回数据可能是这样的
 //[{
 // path: "/",
 // name: "home",
 // component: "Home", //Home //}]
// 异步获取路路由 
api.getRoutes().then(routes => {
		const routeConfig = routes.map(route => mapComponent(route));
		router.addRoutes(routeConfig); 
})
// 映射关系
 const compMap = {
		//异步加载
		'Home': () => import("./view/Home.vue") 
 }
 // 递归替换
function mapComponent(route) {
		route.component = compMap[route.component]; if(route.children) {
		route.children = route.children.map(child => mapComponent(child)) }
    return route
}
```
