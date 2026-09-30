import { useEffect, useState } from 'react'
import { Button, Input, Pagination } from '../../../shared/components/ui'
import { notificationApi } from '../../../core/api'

export const RecipientSearchPicker = ({ recipientType, selected, onToggle, grade, onGradeChange }) => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ items: [], pagination: { page: 1, totalPages: 0, total: 0 } })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const term = search.trim()
    if (term.length < 2) return undefined
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true); setError('')
      try {
        const response = await notificationApi.searchRecipients({ recipientType, search: term, page, limit: 20, ...(grade ? { grade } : {}) }, { signal: controller.signal })
        setResult(response.data?.data ?? { items: [], pagination: {} })
      } catch (requestError) {
        if (requestError?.code !== 'ERR_CANCELED') setError(requestError?.response?.data?.message || 'Không thể tìm người nhận')
      } finally { setLoading(false) }
    }, 300)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [recipientType, search, page, grade])

  return <section className="rounded-sm border border-border bg-white p-5" aria-busy={loading}>
    <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Chọn người nhận</h2><span className="text-sm text-foreground-light">Đã chọn {selected.size}</span></div>
    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
      <Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Nhập ít nhất 2 ký tự tên, email hoặc số điện thoại" />
      {recipientType === 'STUDENT' && <select className="rounded-sm border border-border px-3" value={grade} onChange={(event) => { onGradeChange(event.target.value); setPage(1) }}><option value="">Mọi khối</option>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>Khối {index + 1}</option>)}</select>}
    </div>
    {search.trim().length < 2 && <p className="py-10 text-center text-sm text-foreground-light">Nhập từ khóa để tìm, hệ thống không tải toàn bộ danh sách.</p>}
    {loading && <p className="py-10 text-center text-sm">Đang tìm kiếm…</p>}
    {error && <p role="alert" aria-live="polite" className="mt-3 text-sm text-error">{error}</p>}
    {!loading && search.trim().length >= 2 && !result.items?.length && !error && <p className="py-10 text-center text-sm text-foreground-light">Không có kết quả phù hợp.</p>}
    {!loading && search.trim().length >= 2 && result.items?.length > 0 && <div className="mt-4 divide-y divide-border border-y border-border">{result.items.map((item) => {
      const active = selected.has(item.userId)
      return <button type="button" key={item.userId} onClick={() => onToggle(item)} className="flex w-full items-center justify-between gap-3 px-2 py-3 text-left hover:bg-muted/40">
        <span><span className="block font-medium">{item.displayName}</span><span className="block text-xs text-foreground-light">{item.email || item.phone || `User #${item.userId}`}{item.grade ? ` · Khối ${item.grade}` : ''}</span></span>
        <span className={active ? 'text-primary font-medium' : 'text-foreground-light'}>{active ? 'Đã chọn' : 'Chọn'}</span>
      </button>
    })}</div>}
    {result.pagination?.totalPages > 1 && <div className="mt-4"><Pagination currentPage={page} totalPages={result.pagination.totalPages} totalItems={result.pagination.total} itemsPerPage={20} onPageChange={setPage} onItemsPerPageChange={() => {}} disabled={loading} /></div>}
    {selected.size > 0 && <div className="mt-5"><h3 className="mb-2 text-sm font-medium">Danh sách đã chọn</h3><div className="flex flex-wrap gap-2">{Array.from(selected.values()).map((item) => <Button key={item.userId} type="button" size="sm" variant="outline" onClick={() => onToggle(item)}>{item.displayName} ×</Button>)}</div></div>}
  </section>
}
