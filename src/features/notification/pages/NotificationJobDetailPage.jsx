import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { notificationApi } from '../../../core/api'
import { Badge, Button, Dropdown, Input, Pagination } from '../../../shared/components/ui'

const TERMINAL = new Set(['SUCCEEDED','PARTIAL_FAILED','FAILED','CANCELLED'])
const badgeVariant = (status) => status === 'SENT' || status === 'SUCCEEDED' ? 'success' : status === 'SKIPPED' || status === 'PARTIAL_FAILED' ? 'warning' : status === 'DEAD' || status === 'FAILED' ? 'danger' : 'info'

export const NotificationJobDetailPage = () => {
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [filters, setFilters] = useState({ page: 1, limit: 20, search: '', recipientType: '', channel: '', deliveryStatus: '' })
  const [recipients, setRecipients] = useState({ items: [], pagination: { total: 0, totalPages: 0 } })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true)
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([,value]) => value !== ''))
      const [jobResponse, recipientResponse] = await Promise.all([notificationApi.getDispatchJob(jobId), notificationApi.getDispatchRecipients(jobId, params)])
      setJob(jobResponse.data.data); setRecipients(recipientResponse.data.data); setError('')
    } catch (requestError) { setError(requestError?.response?.data?.message || 'Không thể tải chi tiết job') }
    finally { if (!quiet) setLoading(false) }
  }, [jobId, filters])
  useEffect(() => { const timer = window.setTimeout(load, 0); return () => window.clearTimeout(timer) }, [load])
  useEffect(() => {
    if (!job || TERMINAL.has(job.status)) return undefined
    const timer = window.setInterval(() => load(true), 5000)
    return () => window.clearInterval(timer)
  }, [job, load])

  const summary = (channel) => (job?.deliverySummary || []).filter((item) => item.channel === channel)
  return <div className="space-y-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-bold">Job #{jobId}</h1><p className="text-sm text-foreground-light">Chi tiết giao notification theo người nhận và kênh.</p></div><Button variant="outline" onClick={() => load()} loading={loading}>Làm mới</Button></div>
    {error && <p role="alert" aria-live="polite" className="text-sm text-error">{error}</p>}
    {loading && !job ? <div className="rounded-sm border border-border bg-white p-10 text-center">Đang tải…</div> : job && <>
      <section className="rounded-sm border border-border bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-semibold">{job.title}</h2><p className="mt-2 whitespace-pre-wrap text-sm">{job.message}</p></div><Badge variant={badgeVariant(job.status)}>{job.status}</Badge></div><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4"><div><dt className="text-foreground-light">Đối tượng</dt><dd>{job.audienceType}{job.audienceRecipientType ? ` · ${job.audienceRecipientType}` : ''}</dd></div><div><dt className="text-foreground-light">Kênh yêu cầu</dt><dd>{job.requestedChannels?.join(', ') || '—'}</dd></div><div><dt className="text-foreground-light">Người tạo</dt><dd>{job.creator?.displayName || 'Hệ thống'}</dd></div><div><dt className="text-foreground-light">Tạo lúc</dt><dd>{new Date(job.createdAt).toLocaleString('vi-VN')}</dd></div></dl></section>
      <div className="grid gap-4 md:grid-cols-2">{['IN_APP','PUSH'].map((channel) => <section key={channel} className="rounded-sm border border-border bg-white p-4"><h3 className="font-semibold">{channel}</h3><div className="mt-3 flex flex-wrap gap-2">{summary(channel).length ? summary(channel).map((item) => <Badge key={item.status} size="small" variant={badgeVariant(item.status)}>{item.status}: {item.count}</Badge>) : <span className="text-sm text-foreground-light">Không có delivery</span>}</div></section>)}</div>
      <section className="rounded-sm border border-border bg-white"><div className="grid gap-3 p-4 md:grid-cols-4"><Input value={filters.search} onChange={(event) => setFilters((f) => ({...f,search:event.target.value,page:1}))} placeholder="Tên, email, điện thoại" /><Dropdown value={filters.recipientType} onChange={(recipientType) => setFilters((f) => ({...f,recipientType,page:1}))} options={[{value:'',label:'Mọi đối tượng'},...['PARENT','STUDENT','ADMIN','UNKNOWN'].map((value)=>({value,label:value}))]} /><Dropdown value={filters.channel} onChange={(channel) => setFilters((f) => ({...f,channel,page:1}))} options={[{value:'',label:'Mọi kênh'},{value:'IN_APP',label:'IN_APP'},{value:'PUSH',label:'PUSH'}]} /><Dropdown value={filters.deliveryStatus} onChange={(deliveryStatus) => setFilters((f) => ({...f,deliveryStatus,page:1}))} options={[{value:'',label:'Mọi trạng thái'},...['PENDING','PROCESSING','RETRY_WAIT','SENT','SKIPPED','DEAD','CANCELLED'].map((value)=>({value,label:value}))]} /></div>
        <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-gray-50 text-left"><tr><th className="p-3">Người nhận</th><th className="p-3">Loại</th><th className="p-3">Delivery</th></tr></thead><tbody className="divide-y divide-border">{recipients.items.length === 0 ? <tr><td colSpan="3" className="p-10 text-center text-foreground-light">Không có recipient phù hợp.</td></tr> : recipients.items.map((recipient) => <tr key={recipient.notificationDispatchRecipientId}><td className="p-3"><div className="font-medium">{recipient.displayName || `User #${recipient.userId}`}</div><div className="text-xs text-foreground-light">{recipient.email || recipient.phone || '—'}</div></td><td className="p-3">{recipient.recipientType}</td><td className="p-3"><div className="space-y-2">{recipient.deliveries.map((delivery) => <div key={delivery.notificationDeliveryId} className="flex flex-wrap items-center gap-2"><span className="w-16 font-medium">{delivery.channel}</span><Badge size="small" variant={badgeVariant(delivery.status)}>{delivery.status}</Badge><span className="text-xs text-foreground-light">Lần thử {delivery.attemptCount}/{delivery.maxAttempts}</span>{delivery.skipReason && <span className="text-xs">Bỏ qua: {delivery.skipReason}</span>}{delivery.lastErrorMessage && <span className="text-xs text-error">{delivery.lastErrorMessage}</span>}</div>)}</div></td></tr>)}</tbody></table></div>
        {recipients.pagination.totalPages > 0 && <Pagination currentPage={filters.page} totalPages={recipients.pagination.totalPages} totalItems={recipients.pagination.total} itemsPerPage={filters.limit} onPageChange={(page) => setFilters((f) => ({...f,page}))} onItemsPerPageChange={(limit) => setFilters((f) => ({...f,limit,page:1}))} disabled={loading} />}
      </section>
    </>}
  </div>
}
