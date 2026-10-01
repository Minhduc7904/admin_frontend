import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks'
import { ROUTES } from '../../../core/constants'
import { PERMISSIONS } from '../../../core/constants/permission/permission.codes'
import { useHasPermission } from '../../../shared/hooks'
import { NotificationForm } from '../components/NotificationForm'
import { RecipientSearchPicker } from '../components/RecipientSearchPicker'
import { selectLoadingSend, sendNotificationAsync } from '../store/notificationSlice'

const newKey = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`

export const BroadcastNotificationsPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const canSend = useHasPermission(PERMISSIONS.NOTIFICATION.SEND)
  const loading = useAppSelector(selectLoadingSend)
  const [recipientType, setRecipientType] = useState('PARENT')
  const [selected, setSelected] = useState(new Map())
  const [grade, setGrade] = useState('')
  const keyRef = useRef(newKey())

  if (!canSend) return <Navigate to={ROUTES.FORBIDDEN} replace />

  const payloadChanged = () => { if (!loading) keyRef.current = newKey() }
  const changeType = (type) => { setRecipientType(type); setSelected(new Map()); setGrade(''); keyRef.current = newKey() }
  const toggle = (item) => setSelected((current) => {
    const next = new Map(current)
    if (next.has(item.userId)) next.delete(item.userId); else next.set(item.userId, item)
    keyRef.current = newKey()
    return next
  })

  const submit = async (form) => {
    const data = {
      title: form.title,
      message: form.message,
      type: form.type,
      level: form.level,
      channels: form.channels,
      recipientType: ['PARENT', 'STUDENT', 'ADMIN'].includes(recipientType) ? recipientType : undefined,
      userIds: ['PARENT', 'STUDENT', 'ADMIN'].includes(recipientType) ? Array.from(selected.keys()) : undefined,
      all: recipientType === 'ALL' || undefined,
      allUnpaidTuition: recipientType === 'UNPAID_TUITION_STUDENTS' || undefined,
      data: { entity: 'broadcast', recipientType, isMarkdown: true, ...(form.shouldShowReminderModal ? { shouldShowReminderModal: true } : {}) },
    }
    const response = await dispatch(sendNotificationAsync({ data, idempotencyKey: keyRef.current })).unwrap()
    keyRef.current = newKey()
    setSelected(new Map())
    navigate(ROUTES.NOTIFICATION_LOG_DETAIL(response.data.jobId))
  }

  const isSpecific = ['PARENT', 'STUDENT', 'ADMIN'].includes(recipientType)
  return <div>
    <div className="mb-5"><h1 className="text-2xl font-bold">Gửi thông báo</h1><p className="text-sm text-foreground-light">Tìm và chọn người nhận, sau đó theo dõi tiến độ giao theo từng kênh.</p></div>
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <NotificationForm key={`notification-form-${recipientType}`} recipientType={recipientType} onRecipientTypeChange={changeType} selectedCount={selected.size} onSubmit={submit} onReset={() => { setSelected(new Map()); keyRef.current = newKey() }} onPayloadChange={payloadChanged} loading={loading} />
      {isSpecific ? <RecipientSearchPicker key={`recipient-picker-${recipientType}`} recipientType={recipientType} selected={selected} onToggle={toggle} grade={grade} onGradeChange={setGrade} /> : <section className="rounded-sm border border-border bg-white p-8 text-center"><h2 className="font-semibold">{recipientType === 'ALL' ? 'Tất cả người dùng' : 'Học sinh chưa đóng học phí'}</h2><p className="mt-2 text-sm text-foreground-light">Danh sách người nhận được chốt tại thời điểm xếp hàng.</p></section>}
    </div>
  </div>
}
