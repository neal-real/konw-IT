## mongoose

### 下载

```shell
npm i egg-mongoose --save
```

### 配置插件文件

开启插件:   `/config/plugin.js`

```js
// ts+egg
import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
};

export default plugin;

// egg 
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};
```

## 配置登录

`/config/config.default.js`

- ​    `url: "mongodb://用户名:密码@IP 地址:端口号/数据库名称"`

```js
// 单个数据库配置
config.mongoose = {
  client: {
    url: "mongodb://knowmap:knowmap@122.51.64.***:27017/knowmap", // 示例
    options: {},  // 其他配置项
    plugins: [createdPlugin, [updatedPlugin, pluginOptions]], // 有插件配置插件, 没有不用配置. 此时我没有添加此行
  }
}
// 多个数据库配置
config.mongoose = {
  clients: {
    // db1 数据库别名
    db1: {
      url: "mongodb://knowmap:knowmap@122.51.64.***:27017/knowmap",
      options: {},
    },
    db2: {
      url: "mongodb://knowmap:knowmap@122.51.64.***:27017/goods",
      options: {},
    }
  }
}
```

/config/config.default.js 示例

```js
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;
  config.mongoose = {
    client: {
      url: "mongodb://用户名:密码@IP 地址:27107/数据库名称",
      options: { useNewUrlParser: true, useUnifiedTopology: true }
    }
  };
  // 返回配置将合并到EggAppConfig
  return {
    ...config
  };
};

```



## 使用方法

1. 在 `app`目录下 创建` model`目录 创建数据库模型: `Schema` 
2. 在 `app`目录下 创建` service`目录处理数据的解析,写入等复杂业务逻辑
3. 在`app`目录下 创建`controller`目录 接受请求, 传递给 service 目录,并获取结果 返回给客户端

### 示例

`/app/model/user.ts`

```js
// 单数据库时
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const userSchema = new Schema({
    username: { type: String, required: true }, // 用户名
    password: { type: String, required: true }, //用户密码
    avatar: { type: String }, // 头像
    motto: { type: String } //座右铭
  });
  return mongoose.model('user', userSchema, 'user');
}


// 配置多数据库时
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('db1');  // 使用书库别名

  const UserSchema = new Schema({
    userName: { type: String },
    password: { type: String },
  });

  return conn.model('User', UserSchema);
}
```

app/service/user.ts

```js
// app/service/user.ts
import { Service } from 'egg';
class User extends Service {
  public async setUserInfo(obj: object) {
    const data = await this.ctx.model.User.create(obj);
    return data;
  }
}
module.exports = User
```



`/app/controller/user.ts`

```js
import { Controller } from 'egg';
export default class UserController extends Controller {
  public async addUserInfo() {
    this.ctx.body = await this.ctx.service.user.setUserInfo(this.ctx.request.body);
  }
}

```



## 功能分类

-  service 层操作 model 层,返回的是一个 promise 给 controller 返回结果到客户端

`WMS/app/service` 处理业务逻辑

`WMS/app/model/book.ts` 提供 Schema 数据结构模型

`WMS/app/controller/book.ts`  接受请求, 返回结果给客户端





## 常用的Mongoose 方法

### 一，增加数据

```js
this.ctx.model.User.create(post,callback);

const data = await this.ctx.model.User.create(post,callback);
```

备注：其中post为json数据结构，callback为操作后的回调函数

### 二，查询数据

#### 1，获取所有数据，返回是一个数组

```js
this.ctx.model.User.find()
```

#### 2，获取一个数据，返回是一个对象

```
this.ctx.model.User.findOne()
```

#### 3，条件查询

```
this.ctx.model.User.find(conditions,callback);
```

condition有以下几种类型

#### 1），根据具体数据进行查询

```
this.ctx.model.User.find({_id：5c4a819fb87ba4002a47bc4f,title:"123"},callback);
```

- 返回_id为5c4a819fb87ba4002a47bc4f，title为123的结果

#### 2），条件查询

```
"$lt"	小于
"$lte"	小于等于
"$gt"	大于
"$gte"	大于等于
"$ne"	不等于
this.ctx.model.User.find({“sort”:{ $get:18 , $lte:30 });
```

- 返回User表中sort 大于等于18并小于等于30的结果

#### 3），或查询 OR

```
"$in" 一个键对应多个值
"$nin" 同上取反, 一个键不对应指定值
"$or" 多个条件匹配, 可以嵌套 $in 使用
"$not"	同上取反, 查询与特定模式不匹配的文档
this.ctx.model.User.find({"title":{ $in:[20,21,22."haha"]} );
```

- 返回User表中title等于20或21或21或"haha"的结果

```
this.ctx.model.User.find({"$or" :  [ {"age":18} , {"name":"wxw"} ] });
```

- 返回User表中age等于18或 name等于"wxw"的结果

#### 4），类型查询（`"$exists"`条件判定）

```
this.ctx.model.User.find({name: {$exists: true}},function(error,docs){
  //返回User表中所有存在name属性的结果
});
this.ctx.model.User.find({telephone: {$exists: false}},function(error,docs){
  //返回User表中所有不存在telephone属性的结果
});
```

#### 5），匹配正则表达式查询

MongoDb 是使用 Prel兼容的正则表达式库来匹配正则表达式

```
this.ctx.model.User.find( {"name" : /joe/i } );
```

- 返回User表中name为 joe 的结果, 并忽略大小写

#### 6），查询数组

```
this.ctx.model.User.find({"array":10} );
```

- 返回User表中array(数组类型)键中有10的文档, array : [1,2,3,4,5,10] 会匹配到

```
this.ctx.model.User.find({"array[5]":10}  );
```

- 返回User表中array(数组类型)键中下标5对应的值是10, array : [1,2,3,4,5,10] 会匹配到

```
this.ctx.model.User.find({"array":[5,10]});
```

- 返回User表中查询匹配array数组中既有5又有10的结果

```
this.ctx.model.User.find({"array":{$size : 3} });
```

- 返回User表中查询匹配array数组长度为3 的的结果

```
this.ctx.model.User.find({"array":{$slice : 10} });
```

- 返回User表中查询匹配array数组的前10个元素

```
this.ctx.model.User.find({"array":{$slice :  [5,10]} });
```

- 返回User表中查询匹配array数组的第5个到第10个元素

#### 7)，where

用它可以执行任意javacript语句作为查询的一部分,如果回调函数返回 true 文档就作为结果的一部分返回

```
this.ctx.model.User.find( {"$where" :  "this.x + this.y === 10" } );
this.ctx.model.User.find( {"$where" : " function(){ return this.x + this.y ===10; } " } )
```

- 其中this为数据表中的数据，上述返回User表中属性x+属性y=10的所有数据

#### 8) 分页查找

```js
this.ctx.model.Article.find(search)
  .sort({ _id: -1 }) # 按照创建时间倒序
  .skip(page_size * (current_page - 1)) # 跳过前n个数据
  .limit(page_size); # 限制n个数据
```



### 三，删除数据

```
this.ctx.model.User.remove(conditions,callback);
```

备注：conditions为查询条件，与查询数据介绍的一样，eg：{ _id：5c4a819fb87ba4002a47bc4f }，找到_id为5c4a819fb87ba4002a47bc4f的数据，callback为操作成功后的回调函数

### 四，更新数据

```
this.ctx.model.User.update(conditions, update, callback)
```

- 参数1:查询条件, 参数2:更新对象,可以使用MondoDB的更新修改器

备注：conditions与查询数据中介绍的一样

#### 1，update为更新对象

```
let post = {
    wid: '5c492c57acbe363fd4824446',
    column: [ '新闻' ],
    titleHead: '',
    img: '',
    isAbstract: 'false',
}
this.ctx.model.User.update({ _id: '5c4a819fb87ba4002a47bc4f ' }, post)
```

- 查询User表中特定_id，并对post中所包含的属性进行更新。

#### 2，update使用MondoDB的更新修改器，有以下几种使用场景

#### 1），`"$inc"`增减修改器,只对数字有效

```
this.ctx.model.User.update({"age":22}, {$inc:{"age":1} }  );
```

- 找到age=22的文档,修改文档的age值自增1

#### 2），`'$set'` 指定一个键的值,这个键不存在就创建它.可以是任何MondoDB支持的类型.

```
this.ctx.model.User.update({ _id：5c4a819fb87ba4002a47bc4f }, { $set: { isDelete: true } });
```

- 对5c4a819fb87ba4002a47bc4f 表进行软删除，找到特定_id数据，增加或者修改isDelete属性

#### 3），`"$unset"`同上取反,删除一个键

```
this.ctx.model.User.update({age:22}, {$unset:{age:18} } );
```

- 执行后age键不存在

#### 4），`'$push'`给一个键push一个数组成员,键不存在会创建,对数组有效

```
this.ctx.model.User.update({name:'wxw'}, {$push:{array:10} } );
```

- 返回User表中name为wxw的数据，增加一个array键,类型为数组,有一个成员 10

#### 5），`'$addToSet'`向数组中添加一个元素,如果存在就不添加

```
this.ctx.model.User.update({name:'wxw'},{$addToSet:{array:10} } );
```

- 返回User表中name为wxw的数据，array中有10所以不会添加

#### 6），`'$each'`遍历数组和 $push 修改器配合可以插入多个值

```
this.ctx.model.User.update({name:'wxw'}, {$push:{array:{$each: [1,2,3,4,5]}} } );
```

- 返回User表中name为wxw的数据，执行后array : [10,1,2,3,4,5]

#### 7），`'$pop'` 向数组中尾部删除一个元素

```
this.ctx.model.User.update({name:'wxw'}, {$pop:{array:1} } );
```

- 返回User表中name为wxw的数据，其中array : [10,1,2,3,4,5]，执行后 array : [10,1,2,3,4]
- tip:将1改成-1可以删除数组首部元素

#### 8），`'$pull'` 向数组中删除指定元素

```
this.ctx.model.User.update({name:'wxw'}, {$pull:{array:10} });
```

- 返回User表中name为wxw的数据，匹配到array中的10后将其删除。

### 五，排序（sort）

```
this.ctx.model.User.sort({ isSetTop: -1, sort: 1, editTime: -1 });
```

- 对User表中的数据进行排序，先按“isSetTop”降序，再按“sort”升序，最后按“editTime”降序

备注：键对应数据中的键名，值代表排序方向，1 升序, -1降序。

### 六，限制返回结果的数量（limit）

```
this.ctx.model.User.limit(3);
```

- 对User表中的数据进行返回，返回为前面3条数据

### 七，跳过前3个文档,返回其余的（skip）

```
this.ctx.model.User.skip(3);
```

- 对User表中的数据进行返回，跳过前面3条数据，返回其余数据

附：综合使用最后三个方法进行分页查询

```
this.ctx.model.User.find({ _id：5c4a819fb87ba4002a47bc4f }).skip(pageSize * (pageNum - 1)).limit(parseInt(pageSize)).sort({ isSetTop: -1, sort: 1, editTime: -1 });
```

- 其中pageSize和pageNum为动态传递数据，返回User表中特定_id在每页数据为pageSize条件下的第pageNum页中的数据，并按照“isSetTop”降序，再按“sort”升序，最后按“editTime”降序进行排序。