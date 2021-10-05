##  Swift 简介

### Swift中的常用术语1

- Account：用户定义的管理存储区域
- Container：存储隔间，类似于子文件夹或者目录
- Object：包含了基本的存储实体和它自身的元数据
- Ring：环，记录了磁盘上存储的实体名称和物理位置的映射关系。包括Account环、Container环和Object环。

### 常用术语2

- Region:地域，从地理位置上划分的一个概念。（往往代表不同城市的地理位置，是从灾备方面考虑的概念）    
- Zone：可用区，按照独立的供网、供电、空调等基础设施划分（不同的可用区可能是同一个城市的数据中心机房，也可能是同一个数据中心，不同供电供水网路接入等等隔离系统）    
- Node：节点，代表了一台存储服务器
- Disk：磁盘，代表着物理服务器上的存储设备
- Cluster：群集，为冗余考虑而设计的架构

![88fc95f1156dc973181eb502b98e7ef0](http://www.bjitwx.com/uploads/20200505/88fc95f1156dc973181eb502b98e7ef0.png)



- ring 环
- account 帐号
- container 容器
- object 对象
- zone 区域
- devcie 设备
- partition 虚节点
- replica 副本
- replication 复制
- Weight 权重
- Cluster 集群
- consistency window 一致性窗口





### 结构关系

首先

	- 可以创建多个account，
	- 每个account里可以创建多个容器container，
	- 每个container下可以创建多个object。【container 之间不能相互嵌套】
