以下 API 仅保证与MeiliSearch v0.22.0版本的兼容性。

## 编程语言

https://github.com/meilisearch/meilisearch-js

- TypeScript 95.2% ;  JavaScript 4.1%;   Other0.7%

- **操作文档**：请参阅[API 参考](https://docs.meilisearch.com/reference/api/documents.html)或阅读有关[文档的](https://docs.meilisearch.com/learn/core_concepts/documents.html)更多信息。
- **搜索**：请参阅[API 参考](https://docs.meilisearch.com/reference/api/search.html)或按照我们的[搜索参数](https://docs.meilisearch.com/reference/features/search_parameters.html)指南进行操作。
- **管理索引**：请参阅[API 参考](https://docs.meilisearch.com/reference/api/indexes.html)或阅读有关[索引的](https://docs.meilisearch.com/learn/core_concepts/indexes.html)更多信息。
- **配置索引设置**：请参阅[API 参考](https://docs.meilisearch.com/reference/api/settings.html)或按照我们的[设置参数](https://docs.meilisearch.com/reference/features/settings.html)指南进行操作。

此存储库还包含[更多示例](https://github.com/meilisearch/meilisearch-js/blob/main/examples)。

##  

## 添加文档

> 使用updateId，您可以使用更新端点检查文档添加的状态（排队、处理、已处理或失败）。

```js
const { MeiliSearch } = require('meilisearch')
// Or if you are in a ES environment
import { MeiliSearch } from 'meilisearch';

(async () => {
  const client = new MeiliSearch({
    host: 'http://127.0.0.1:7700',
    apiKey: 'masterKey',
  })

  // 索引是存储文档的地方。
  const index = client.index('movies')

  const documents = [
      { id: 1, title: 'Carol', genres: ['Romance', 'Drama'] },
      { id: 2, title: 'Wonder Woman', genres: ['Action', 'Adventure'] },
      { id: 3, title: 'Life of Pi', genres: ['Adventure', 'Drama'] },
      { id: 4, title: 'Mad Max: Fury Road', genres: ['Adventure', 'Science Fiction'] },
      { id: 5, title: 'Moana', genres: ['Fantasy', 'Action']},
      { id: 6, title: 'Philadelphia', genres: ['Drama'] },
  ]

  // 如果索引“movies”不存在，MeiliSearch会在您首次添加文档时创建它。
  let response = await index.addDocuments(documents)
	// 使用updateId，您可以使用更新端点检查文档添加的状态（排队、处理、已处理或失败）。
  console.log(response) // => { "updateId": 0 }
})()

```



## 基础搜索

```js
// MeiliSearch具有防错能力：
const search = await index.search('philoudelphia')
console.log(search)
```

输出

````js
{
  "hits": [
    {
      "id": "6",
      "title": "Philadelphia",
      "genres": ["Drama"]
    }
  ],
  "offset": 0,
  "limit": 20,
  "nbHits": 1,
  "processingTimeMs": 1,
  "query": "philoudelphia"
}
````

## 自定义搜索

- 文档的“搜索参数”部分介绍了所有支持的选项。 [点击跳转](https://docs.meilisearch.com/reference/features/search_parameters.html)

```js
await index.search(
  'wonder',
  {
    attributesToHighlight: ['*'],
    filter: 'id >= 1'
  }
)
```

输出

```js
{
  "hits": [
    {
      "id": 2,
      "title": "Wonder Woman",
      "genres": ["Action", "Adventure"],
      "_formatted": {
        "id": 2,
        "title": "<em>Wonder</em> Woman",
        "genres": ["Action", "Adventure"]
      }
    }
  ],
  "offset": 0,
  "limit": 20,
  "nbHits": 1,
  "processingTimeMs": 0,
  "query": "wonder"
}
```

## 占位符搜索

- 占位符搜索可以接收基于您的参数的点击，而无需任何查询(q)。要在您的数据集上启用分面搜索，您需要在设置中添加类型。

```js
await index.search(
  '',
  {
    filter: ['genres = fantasy'],
    facetsDistribution: ['genres']
  }
)
```

输出

```js
{
  "hits": [
    {
      "id": 2,
      "title": "Wonder Woman",
      "genres": ["Action","Adventure"]
    },
    {
      "id": 5,
      "title": "Moana",
      "genres": ["Fantasy","Action"]
    }
  ],
  "offset": 0,
  "limit": 20,
  "nbHits": 2,
  "processingTimeMs": 0,
  "query": "",
  "facetsDistribution": {
    "genres": {
      "Action": 2,
      "Fantasy": 1,
      "Adventure": 1
    }
  }
```

## 可中止搜索

- 通过向请求提供[中止信号](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以中止挂起的搜索请求。

输出

```js
const controller = new AbortController()

index
  .search('wonder', {}, {
    signal: controller.signal,
  })
  .then((response) => {
    /** ... */
  })
  .catch((e) => {
    /** Catch AbortError here. */
  })

controller.abort()
```





## 其他 API

## API Resources

### Search

- Make a search request:

```
client.index<T>('xxx').search(query: string, options: SearchParams = {}, config?: Partial<Request>): Promise<SearchResponse<T>>
```

- Make a search request using GET method (slower than the search method):

```
client.index<T>('xxx').searchGet(query: string, options: SearchParams = {}, config?: Partial<Request>): Promise<SearchResponse<T>>
```

### Indexes

- List all indexes:

```
client.listIndexes(): Promise<IndexResponse[]>
```

- Create new index:

```
client.createIndex<T>(uid: string, options?: IndexOptions): Promise<Index<T>>
```

- Create a local reference to an index:

```
client.index<T>(uid: string): Index<T>
```

- Get an index:

```
client.getIndex<T>(uid: string): Promise<Index<T>>
```

- Get or create index if it does not exist

```
client.getOrCreateIndex<T>(uid: string, options?: IndexOptions): Promise<Index<T>>
```

- Get Index information:

```
index.getRawInfo(): Promise<IndexResponse>
```

- Update Index:

```
client.updateIndex(uid: string, options: IndexOptions): Promise<Index>` Or using the index object: `index.update(data: IndexOptions): Promise<Index>
```

- Delete Index:

```
client.deleteIndex(uid): Promise<void>` Or using the index object: `index.delete(): Promise<void>
```

- Get specific index stats

```
index.getStats(): Promise<IndexStats>
```

- Return Index instance with updated information:

```
index.fetchInfo(): Promise<Index>
```

- Get Primary Key of an Index:

```
index.fetchPrimaryKey(): Promise<string | undefined>
```

### Updates

- Get One update info:

```
index.getUpdateStatus(updateId: number): Promise<Update>
```

- Get all updates info:

```
index.getAllUpdateStatus(): Promise<Update[]>
```

- Wait for pending update:

```
index.waitForPendingUpdate(updateId: number, { timeOutMs?: number, intervalMs?: number }): Promise<Update>
```

### Documents

- Add or replace multiple documents:

```
index.addDocuments(documents: Document<T>[]): Promise<EnqueuedUpdate>
```

- Add or update multiple documents:

```
index.updateDocuments(documents: Document<T>[]): Promise<EnqueuedUpdate>
```

- Get Documents:

```
index.getDocuments(params: getDocumentsParams): Promise<Document<T>[]>
```

- Get one document:

```
index.getDocument(documentId: string): Promise<Document<T>>
```

- Delete one document:

```
index.deleteDocument(documentId: string | number): Promise<EnqueuedUpdate>
```

- Delete multiple documents:

```
index.deleteDocuments(documentsIds: string[] | number[]): Promise<EnqueuedUpdate>
```

- Delete all documents:

```
index.deleteAllDocuments(): Promise<Types.EnqueuedUpdate>
```

### Settings

- Get settings:

```
index.getSettings(): Promise<Settings>
```

- Update settings:

```
index.updateSettings(settings: Settings): Promise<EnqueuedUpdate>
```

- Reset settings:

```
index.resetSettings(): Promise<EnqueuedUpdate>
```

### Synonyms

- Get synonyms:

```
index.getSynonyms(): Promise<object>
```

- Update synonyms:

```
index.updateSynonyms(synonyms: Synonyms): Promise<EnqueuedUpdate>
```

- Reset synonyms:

```
index.resetSynonyms(): Promise<EnqueuedUpdate>
```

### Stop-words

- Get Stop Words `index.getStopWords(): Promise<string[]>`
- Update Stop Words `index.updateStopWords(stopWords: string[] | null ): Promise<EnqueuedUpdate>`
- Reset Stop Words `index.resetStopWords(): Promise<EnqueuedUpdate>`

### Ranking rules

- Get Ranking Rules `index.getRankingRules(): Promise<string[]>`
- Update Ranking Rules `index.updateRankingRules(rankingRules: string[] | null): Promise<EnqueuedUpdate>`
- Reset Ranking Rules `index.resetRankingRules(): Promise<EnqueuedUpdate>`

### Distinct Attribute

- Get Distinct Attribute `index.getDistinctAttribute(): Promise<string | void>`
- Update Distinct Attribute `index.updateDistinctAttribute(distinctAttribute: string | null): Promise<EnqueuedUpdate>`
- Reset Distinct Attribute `index.resetDistinctAttribute(): Promise<EnqueuedUpdate>`

### Searchable Attributes

- Get Searchable Attributes `index.getSearchableAttributes(): Promise<string[]>`
- Update Searchable Attributes `index.updateSearchableAttributes(searchableAttributes: string[] | null): Promise<EnqueuedUpdate>`
- Reset Searchable Attributes `index.resetSearchableAttributes(): Promise<EnqueuedUpdate>`

### Displayed Attributes

- Get Displayed Attributes `index.getDisplayedAttributes(): Promise<string[]>`
- Update Displayed Attributes `index.updateDisplayedAttributes(displayedAttributes: string[] | null): Promise<EnqueuedUpdate>`
- Reset Displayed Attributes `index.resetDisplayedAttributes(): Promise<EnqueuedUpdate>`

### Filterable Attributes

- Get Filterable Attributes `index.getFilterableAttributes(): Promise<string[]>`
- Update Filterable Attributes `index.updateFilterableAttributes(filterableAttributes: string[] | null): Promise<EnqueuedUpdate>`
- Reset Filterable Attributes `index.resetFilterableAttributes(): Promise<EnqueuedUpdate>`

### Sortable Attributes

- Get Sortable Attributes `index.getSortableAttributes(): Promise<string[]>`
- Update Sortable Attributes `index.updateSortableAttributes(sortableAttributes: string[] | null): Promise<EnqueuedUpdate>`
- Reset Sortable Attributes `index.resetSortableAttributes(): Promise<EnqueuedUpdate>`

### Keys

- Get keys

```
client.getKeys(): Promise<Keys>
```

### isHealthy

- Return `true` or `false` depending on the health of the server.

```
client.isHealthy(): Promise<boolean>
```

### Health

- Check if the server is healthy

```
client.health(): Promise<Health>
```

### Stats

- Get database stats

```
client.getStats(): Promise<Stats>
```

### Version

- Get binary version

```
client.getVersion(): Promise<Version>
```

### Dumps

- Trigger a dump creation process

```
client.createDump(): Promise<Types.EnqueuedDump>
```

- Get the status of a dump creation process

```
client.getDumpStatus(dumpUid: string): Promise<Types.EnqueuedDump>
```