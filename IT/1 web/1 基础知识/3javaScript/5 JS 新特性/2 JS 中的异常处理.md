## JS中的异常

> - 简单粗暴的理解就是有错误出现.
> - 由于JS是单线程的, 编写的代码都是串行的,
> - 所以一旦前面代码出现错误,程序就会被中断, **后续代码就不会被执行**



## JS中的异常处理

1. 自身编写代码问题, --> 手动修复BUG
2. 外界原因问题, --> try{}catch{}
   1. 对于一些可预见的异常, 我们可以使用try{}catch{}来处理,

## try{}catch{}

>  利用try{}catch{}来处理异常**可以保证程序不被中断**, 也可以记录错误原因以便于后续优化迭代更新

~~~js
try {
	// 可能遇到的意外的代码
} catch (error) {
	// 捕获错误的代码块
}
~~~