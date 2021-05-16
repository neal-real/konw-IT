## **WiredTiger Storage Engine**

## **WiredTiger存储引擎**

Starting in MongoDB 3.2, the WiredTiger storage engine is the default storage engine. For existing deployments, if you do not specify the --storageEngine or the storage.engine setting, the version 3.2+ mongod instance can automatically determine the storage engine used to create the data files in the --dbpath or storage.dbPath. See Default Storage Engine Change.
从MongoDB 3.2开始，WiredTiger存储引擎开始作为默认的存储引擎。 对于现有部署，如果未指定参数--storageEngine或storage.engine设置，则版本3.2+ mongod实例可以自动确定用于在--dbpath或storage.dbPath中创建数据文件的存储引擎。 请参阅默认存储引擎配置参数更改文档。

**Document Level Concurrency 文档级别的并发**

WiredTiger uses document-level concurrency control for write operations. As a result, multiple clients can modify different documents of a collection at the same time.
WiredTiger使用文档级并发控制进行写操作。 因此，多个客户端可以并发同时修改集合的不同文档。

For most read and write operations, WiredTiger uses optimistic concurrency control. WiredTiger uses only intent locks at the global, database and collection levels. When the storage engine detects conflicts between two operations, one will incur a write conflict causing MongoDB to transparently retry that operation.
对于大多数读写操作，WiredTiger使用乐观并发控制模式。 WiredTiger仅在全局、数据库和集合级别使用意向锁。 当存储引擎检测到两个操作之间存在冲突时，将引发写冲突，从而导致MongoDB自动重试该操作。

Some global operations, typically short lived operations involving multiple databases, still require a global “instance-wide” lock. Some other operations, such as dropping a collection, still require an exclusive database lock.
一些全局操作（通常是涉及多个数据库的短暂操作）仍然需要全局“实例范围级别的”锁。 其他一些操作（例如删除集合）仍然需要独占数据库锁。

**Snapshots and Checkpoints 快照与检查点**

WiredTiger uses MultiVersion Concurrency Control (MVCC). At the start of an operation, WiredTiger provides a point-in-time snapshot of the data to the operation. A snapshot presents a consistent view of the in-memory data.
WiredTiger使用MultiVersion并发控制（MVCC）方式。 在操作开始时，WiredTiger为操作提供数据的时间点快照。 快照提供了内存数据的一致视图。

When writing to disk, WiredTiger writes all the data in a snapshot to disk in a consistent way across all data files. The now-durable data act as a checkpoint in the data files. The checkpoint ensures that the data files are consistent up to and including the last checkpoint; i.e. checkpoints can act as recovery points.
写入磁盘时，WiredTiger将所有数据文件中的快照中的所有数据以一致的方式写入磁盘。 现在持久的数据充当数据文件中的检查点。 该检查点可确保数据文件直到最后一个检查点（包括最后一个检查点）都保持一致； 即检查点可以充当恢复点。

Starting in version 3.6, MongoDB configures WiredTiger to create checkpoints (i.e. write the snapshot data to disk) at intervals of 60 seconds. In earlier versions, MongoDB sets checkpoints to occur in WiredTiger on user data at an interval of 60 seconds or when 2 GB of journal data has been written, whichever occurs first.

从3.6版本开始，MongoDB配置WiredTiger以60秒的间隔创建检查点（即将快照数据写入磁盘）。 在早期版本中，MongoDB将检查点设置为在WiredTiger中以60秒的间隔或在写入2GB日志数据时对用户数据进行检查，以先到者为准。

During the write of a new checkpoint, the previous checkpoint is still valid. As such, even if MongoDB terminates or encounters an error while writing a new checkpoint, upon restart, MongoDB can recover from the last valid checkpoint.
在写入新检查点期间，先前的检查点仍然有效。 这样，即使MongoDB在写入新检查点时终止或遇到错误，重启后，MongoDB仍可从上一个有效检查点恢复。

The new checkpoint becomes accessible and permanent when WiredTiger’s metadata table is atomically updated to reference the new checkpoint. Once the new checkpoint is accessible, WiredTiger frees pages from the old checkpoints.
当WiredTiger的元数据表被原子更新以引用新的检查点时，新的检查点将变为可访问且永久的。 一旦可以访问新的检查点，WiredTiger就会从旧的检查点释放页面。

Using WiredTiger, even without journaling, MongoDB can recover from the last checkpoint; however, to recover changes made after the last checkpoint, run with journaling.
使用WiredTiger，即使没有日记，MongoDB也可以从最后一个检查点恢复； 但是，要恢复上一个检查点之后所做的更改，请运行日志功能。

NOTE 注意

Starting in MongoDB 4.0, you cannot specify --nojournal option or storage.journal.enabled: false for replica set members that use the WiredTiger storage engine.
从MongoDB 4.0开始，您不能指定--nojournal选项或storage.journal.enabled：使用WiredTiger存储引擎的副本集成员为false。

**Journal日志**

WiredTiger uses a write-ahead log (i.e. journal) in combination with checkpoints to ensure data durability.
WiredTiger将预写日志（即日志）与检查点结合使用以确保数据持久性。

The WiredTiger journal persists all data modifications between checkpoints. If MongoDB exits between checkpoints, it uses the journal to replay all data modified since the last checkpoint. For information on the frequency with which MongoDB writes the journal data to disk, see Journaling Process.
WiredTiger日记保留检查点之间的所有数据修改。 如果MongoDB在检查点之间退出，它将使用日志重播自上一个检查点以来修改的所有数据。 有关MongoDB将日记数据写入磁盘的频率的信息，请参阅日志处理。

WiredTiger journal is compressed using the snappy compression library. To specify a different compression algorithm or no compression, use the storage.wiredTiger.engineConfig.journalCompressor setting. For details on changing the journal compressor, see Change WiredTiger Journal Compressor.
WiredTiger日志使用快速压缩库进行压缩。 要指定其他压缩算法或不进行压缩，请使用storage.wiredTiger.engineConfig.journalCompressor设置参数。 有关更改日志压缩器的详细信息，请参阅“更改WiredTiger日志压缩器”文档。

NOTE 注意

If a log record less than or equal to 128 bytes (the mininum log record size for WiredTiger), WiredTiger does not compress that record.
如果日志记录小于或等于128字节（WiredTiger的最小日志记录大小），则WiredTiger不会压缩该记录。

You can disable journaling for standalone instances by setting storage.journal.enabled to false, which can reduce the overhead of maintaining the journal. For standalone instances, not using the journal means that, when MongoDB exits unexpectedly, you will lose all data modifications prior to the last checkpoint.
您可以通过将storage.journal.enabled设置为false来禁用独立实例的日志记录，这可以减少维护日志记录的开销。 对于独立实例，不使用日志意味着MongoDB意外退出时，您将丢失最后一个检查点之前的所有数据修改信息。

NOTE 注意

Starting in MongoDB 4.0, you cannot specify --nojournal option or storage.journal.enabled: false for replica set members that use the WiredTiger storage engine.
从MongoDB 4.0开始，您不能指定--nojournal选项或storage.journal.enabled：使用WiredTiger存储引擎的副本集成员为false。

SEE ALSO 也可以参考

Journaling with WiredTiger
使用WiredTiger日志

**Compression压缩**

With WiredTiger, MongoDB supports compression for all collections and indexes. Compression minimizes storage use at the expense of additional CPU.
使用WiredTiger，MongoDB支持对所有集合和索引进行压缩。 压缩可最大程度地减少存储空间的使用量，但会增加CPU的开销。

By default, WiredTiger uses block compression with the snappy compression library for all collections and prefix compression for all indexes.
默认情况下，WiredTiger对所有集合使用块压缩和snappy压缩库，对所有索引使用前缀压缩。

For collections, the following block compression libraries are also available:
对于集合，还提供以下块压缩库：

zlib
zstd (Available starting in MongoDB 4.2)
To specify an alternate compression algorithm or no compression, use the storage.wiredTiger.collectionConfig.blockCompressor setting.
zstd（从MongoDB 4.2开始支持）
要指定替代压缩算法或不压缩，请使用storage.wiredTiger.collectionConfig.blockCompressor参数设置。

For indexes, to disable prefix compression, use the storage.wiredTiger.indexConfig.prefixCompression setting.
对于索引，要禁用前缀压缩，请使用storage.wiredTiger.indexConfig.prefixCompression设置。

Compression settings are also configurable on a per-collection and per-index basis during collection and index creation. See Specify Storage Engine Options and db.collection.createIndex() storageEngine option.
压缩设置还可以在集合和索引创建期间基于每个集合和每个索引进行配置。 请参见指定存储引擎选项和db.collection.createIndex（）storageEngine选项。

For most workloads, the default compression settings balance storage efficiency and processing requirements.
对于大多数压缩工作负载，默认压缩设置可以平衡存储效率和处理要求。

The WiredTiger journal is also compressed by default. For information on journal compression, see Journal.
默认情况下，WiredTiger日志也被压缩。 有关日志压缩的信息，请参阅日记。

**Memory Use 内存使用**

With WiredTiger, MongoDB utilizes both the WiredTiger internal cache and the filesystem cache.
通过WiredTiger，MongoDB可以利用WiredTiger内部缓存和文件系统缓存。

Starting in MongoDB 3.4, the default WiredTiger internal cache size is the larger of either:
从MongoDB 3.4开始，默认的WiredTiger内部缓存大小是以下两者中的较大者：

50% of (RAM - 1 GB), or 256 MB.
50％（RAM-1 GB）或256 MB。

For example, on a system with a total of 4GB of RAM the WiredTiger cache will use 1.5GB of RAM (0.5 * (4 GB - 1 GB) = 1.5 GB). Conversely, a system with a total of 1.25 GB of RAM will allocate 256 MB to the WiredTiger cache because that is more than half of the total RAM minus one gigabyte (0.5 * (1.25 GB - 1 GB) = 128 MB < 256 MB).
例如，在总共有4GB RAM的系统上，WiredTiger缓存将使用1.5GB RAM（0.5 *（4 GB-1 GB）= 1.5 GB）。 相反，总内存为1.25 GB的系统将为WiredTiger缓存分配256 MB，因为这是总RAM的一半以上减去一GB（0.5 *（1.25 GB-1 GB）= 128 MB <256 MB） 。

NOTE 注意

In some instances, such as when running in a container, the database can have memory constraints that are lower than the total system memory. In such instances, this memory limit, rather than the total system memory, is used as the maximum RAM available.
在某些情况下，例如在容器中运行时，数据库的内存限制可能低于系统总内存。 在这种情况下，此内存限制而不是系统总内存将用作最大可用RAM。

To see the memory limit, see hostInfo.system.memLimitMB.
要查看内存限制，请参阅hostInfo.system.memLimitMB。

By default, WiredTiger uses Snappy block compression for all collections and prefix compression for all indexes. Compression defaults are configurable at a global level and can also be set on a per-collection and per-index basis during collection and index creation.
默认情况下，WiredTiger对所有集合使用Snappy块压缩，对所有索引使用前缀压缩。 压缩默认值是可以在全局级别配置的，也可以在收集和索引创建期间基于每个集合和每个索引进行设置。

Different representations are used for data in the WiredTiger internal cache versus the on-disk format:
WiredTiger内部缓存中的数据与磁盘格式使用不同的表示形式：

Data in the filesystem cache is the same as the on-disk format, including benefits of any compression for data files. The filesystem cache is used by the operating system to reduce disk I/O.
Indexes loaded in the WiredTiger internal cache have a different data representation to the on-disk format, but can still take advantage of index prefix compression to reduce RAM usage. Index prefix compression deduplicates common prefixes from indexed fields.
Collection data in the WiredTiger internal cache is uncompressed and uses a different representation from the on-disk format. Block compression can provide significant on-disk storage savings, but data must be uncompressed to be manipulated by the server.
Via the filesystem cache, MongoDB automatically uses all free memory that is not used by the WiredTiger cache or by other processes.

文件系统缓存中的数据与磁盘上的格式相同，包括对数据文件进行任何压缩的好处。 操作系统使用文件系统缓存来减少磁盘I/O。
加载到WiredTiger内部缓存中的索引具有与磁盘上格式不同的数据表示形式，但仍可以利用索引前缀压缩来减少RAM使用量。 索引前缀压缩可从索引字段中删除通用前缀。
WiredTiger内部缓存中的集合数据未经压缩，并使用与磁盘格式不同的表示形式。 块压缩可以节省大量的磁盘存储空间，但是必须对数据进行解压缩才能由服务器进行处理。
通过文件系统缓存，MongoDB自动使用WiredTiger缓存或其他进程未使用的所有可用内存。

To adjust the size of the WiredTiger internal cache, see storage.wiredTiger.engineConfig.cacheSizeGB and --wiredTigerCacheSizeGB. Avoid increasing the WiredTiger internal cache size above its default value.

要调整WiredTiger内部缓存的大小，请参阅storage.wiredTiger.engineConfig.cacheSizeGB和--wiredTigerCacheSizeGB。 避免将WiredTiger内部缓存的大小超过其默认值以上。



原文链接：https://docs.mongodb.com/manual/core/wiredtiger/

译者：徐雷

