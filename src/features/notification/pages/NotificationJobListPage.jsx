import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationApi } from '../../../core/api'
import { ROUTES } from '../../../core/constants'
import { Badge, Dropdown, Input, Pagination } from '../../../shared/components/ui'

const variant = (status) => status === 'SUCCEEDED' ? 'success' : status === 'PARTIAL_FAILED' ? 'warning' : ['FAILED','CANCELLED'].includes(status) ? 'danger' : 'info'

export const NotificationJobListPage = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({ page: 1, limit: 20, search: '', status: '', type: '', creatorId: '', fromDate: '', toDate: '' })
  const [data, setData] = useState({ items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { const response = await notificationApi.getDispatchJobs(Object.fromEntries(Object.entries(filters).filter(([,value]) => value !== ''))); setData(response.data.data) }
    catch (requestError) { setError(requestError?.response?.data?.message || 'Không thể tải lịch sử') }
    finally { setLoading(false) }
  }, [filters])
  useEffect(() => { const timer = window.setTimeout(load, 0); return () => window.clearTimeout(timer) }, [load])

  return <div className="space-y-5">
    <div><h1 className="text-2xl font-bold">Lịch sử gửi notification</h1><p className="text-sm text-foreground-light">Theo dõi toàn bộ job và tiến độ delivery.</p></div>
    <div className="grid gap-3 rounded-sm border border-border bg-white p-4 md:grid-cols-3 lg:grid-cols-6">
      <Input value={filters.search} onChange={(event) => setFilters((f) => ({ ...f, search: event.target.value, page: 1 }))} placeholder="Tìm tiêu đề, nội dung hoặc key" />
      <Dropdown value={filters.status} onChange={(status) => setFilters((f) => ({ ...f, status, page: 1 }))} options={[{value:'',label:'Mọi trạng thái'}, ...['QUEUED','PROCESSING','SUCCEEDED','PARTIAL_FAILED','FAILED','CANCELLED'].map((value) => ({value,label:value}))]} />
      <Dropdown value={filters.type} onChange={(type) => setFilters((f) => ({ ...f, type, page: 1 }))} options={[{value:'',label:'Mọi loại'}, ...['SYSTEM','COURSE','LESSON','ATTENDANCE','TUITION','MESSAGE','RESULT','OTHER'].map((value) => ({value,label:value}))]} />
      <Input type="number" min="1" value={filters.creatorId} onChange={(event) => setFilters((f) => ({ ...f, creatorId: event.target.value, page: 1 }))} placeholder="Admin ID" />
      <Input type="date" value={filters.fromDate} onChange={(event) => setFilters((f) => ({ ...f, fromDate: event.target.value, page: 1 }))} aria-label="Từ ngày" />
      <Input type="date" value={filters.toDate} onChange={(event) => setFilters((f) => ({ ...f, toDate: event.target.value, page: 1 }))} aria-label="Đến ngày" />
    </div>
    {error && <p role="alert" aria-live="polite" className="text-sm text-error">{error}</p>}
    <div className="overflow-hidden rounded-sm border border-border bg-white">
      <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-gray-50 text-left"><tr><th className="p-3">Job</th><th className="p-3">Đối tượng</th><th className="p-3">Trạng thái</th><th className="p-3">Tiến độ</th><th className="p-3">Người tạo</th><th className="p-3">Thời gian</th></tr></thead><tbody className="divide-y divide-border">
        {loading ? <tr><td colSpan="6" className="p-10 text-center">Đang tải…</td></tr> : data.items.length === 0 ? <tr><td colSpan="6" className="p-10 text-center text-foreground-light">Chưa có job phù hợp.</td></tr> : data.items.map((job) => <tr key={job.notificationDispatchJobId} onClick={() => navigate(ROUTES.NOTIFICATION_LOG_DETAIL(job.notificationDispatchJobId))} className="cursor-pointer hover:bg-gray-50"><td className="p-3"><div className="font-medium">{job.title}</div><div className="text-xs text-foreground-light">#{job.notificationDispatchJobId} · {job.type}</div></td><td className="p-3">{job.audienceType}<div className="text-xs text-foreground-light">{job.recipientCount} người</div></td><td className="p-3"><Badge size="small" variant={variant(job.status)}>{job.status}</Badge></td><td className="p-3">{job.sentDeliveryCount}/{job.totalDeliveryCount}<div className="text-xs text-foreground-light">Bỏ qua {job.skippedDeliveryCount} · Lỗi {job.deadDeliveryCount}</div></td><td className="p-3">{job.creator?.displayName || 'Hệ thống'}</td><td className="p-3 whitespace-nowrap">{new Date(job.createdAt).toLocaleString('vi-VN')}</td></tr>)}
      </tbody></table></div>
      {data.pagination.totalPages > 0 && <Pagination currentPage={filters.page} totalPages={data.pagination.totalPages} totalItems={data.pagination.total} itemsPerPage={filters.limit} onPageChange={(page) => setFilters((f) => ({...f,page}))} onItemsPerPageChange={(limit) => setFilters((f) => ({...f,limit,page:1}))} disabled={loading} />}
    </div>
  </div>
}
