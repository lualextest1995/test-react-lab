# 📘 example.md

## 簡介
這個 Table 元件是基於 **TanStack Table v8** 封裝的，提供三種模式：

- **BasicTable**：單純顯示資料，可選擇是否開啟勾選欄位  
- **ClientTable**：前端分頁，支援勾選（當頁 / 跨頁模式）  
- **ServerTable**：後端分頁，支援勾選（當頁 / 跨頁模式）  

統一由 `Table` Facade 匯出，使用時只需要傳入 `mode` 和對應的 props。  

---

## 1. BasicTable

```tsx
import { Table } from "@/components/tables"
import { createColumnHelper } from "@tanstack/react-table"

type User = {
  id: number
  name: string
  email: string
}

const columnHelper = createColumnHelper<User>()

const userColumns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("email", { header: "Email" }),
]

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@test.com" },
  { id: 2, name: "Bob", email: "bob@test.com" },
]

export default function ExampleBasic() {
  return (
    <Table
      mode="basic"
      columns={userColumns}
      data={users}
      enableRowSelection
      onRowSelectionChange={(rows) => {
        console.log("選中的 rows:", rows)
      }}
    />
  )
}
```

---

## 2. ClientTable (前端分頁)

```tsx
import { Table } from "@/components/tables"
import { createColumnHelper } from "@tanstack/react-table"

type Product = {
  id: number
  name: string
  price: number
}

const columnHelper = createColumnHelper<Product>()

const productColumns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("name", { header: "Product" }),
  columnHelper.accessor("price", { header: "Price" }),
]

const products: Product[] = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: (i + 1) * 10,
}))

export default function ExampleClient() {
  return (
    <Table
      mode="client"
      columns={productColumns}
      data={products}
      initialPageSize={5}
      enableRowSelection
      selectionMode="global" // "page" = 當頁選取, "global" = 跨頁累積
      onRowSelectionChange={(rows) => {
        console.log("選中的 products:", rows)
      }}
    />
  )
}
```

---

## 3. ServerTable (後端分頁)

```tsx
import { Table } from "@/components/tables"
import { createColumnHelper } from "@tanstack/react-table"
import { useState } from "react"

type Post = {
  id: number
  title: string
  content: string
}

const columnHelper = createColumnHelper<Post>()

const postColumns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("title", { header: "Title" }),
  columnHelper.accessor("content", { header: "Content" }),
]

export default function ExampleServer() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(5)

  // 模擬伺服器資料
  const total = 50
  const data: Post[] = Array.from({ length: pageSize }).map((_, i) => {
    const id = pageIndex * pageSize + i + 1
    return { id, title: `Post ${id}`, content: `Content for post ${id}` }
  })

  return (
    <Table
      mode="server"
      columns={postColumns}
      data={data}
      total={total}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPaginationChange={({ pageIndex, pageSize }) => {
        setPageIndex(pageIndex)
        setPageSize(pageSize)
      }}
      enableRowSelection
      selectionMode="page"
      onRowSelectionChange={(rows) => {
        console.log("選中的 posts:", rows)
      }}
    />
  )
}
```

---

## Props 總覽

### BasicTable
- `columns`：欄位定義  
- `data`：資料陣列  
- `enableRowSelection?`：是否開啟勾選  
- `onRowSelectionChange?`：(rows: T[]) => void  

### ClientTable
- 同 BasicTable  
- `initialPageSize?`：初始每頁大小  
- `pageSizeOptions?`：下拉選單頁數選項  
- `selectionMode?`："page" | "global"  

### ServerTable
- 同 ClientTable  
- `total`：資料總數  
- `pageIndex`：目前頁索引  
- `pageSize`：目前每頁筆數  
- `onPaginationChange`：(PaginationState) => void  
- `isLoading?`：是否顯示 Loading  
