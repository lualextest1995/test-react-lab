// utils.ts
/**
 * 泛型安全的 getRowId 工具
 * - row 有 id: 使用 id (支援跨頁選取)
 * - row 無 id: fallback index (僅當頁選取)
 */
export function getRowIdSafe<T extends object>(row: T, index: number): string {
    if ('id' in row) {
        const idVal = row.id
        if (typeof idVal === 'string' || typeof idVal === 'number') {
            return String(idVal)
        }
    }
    return String(index)
}
