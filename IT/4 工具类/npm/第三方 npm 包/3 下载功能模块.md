### 下载模块



~~~js
//download-git-repo  下载模块
//ora 进度模块

const download = require('download-git-repo')
const ora = require('ora')
const process = ora('下载**项目')
process.start()
download('下载url','到什么路径',err => {
	// 正常返回Success,	
  console.log(err?'Error': 'Success')
})

~~~

