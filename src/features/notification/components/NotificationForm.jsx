import { useState } from 'react'
import { Button, Checkbox, Dropdown, Input } from '../../../shared/components/ui'
import { MarkdownEditorPreview } from '../../../shared/components/markdown/MarkdownEditorPreview'

const RECIPIENT_OPTIONS = [
  { value: 'ALL', label: 'Tất cả người dùng' },
  { value: 'UNPAID_TUITION_STUDENTS', label: 'Học sinh chưa đóng học phí' },
  { value: 'PARENT', label: 'Phụ huynh cụ thể' },
  { value: 'STUDENT', label: 'Học sinh cụ thể' },
  { value: 'ADMIN', label: 'Quản trị viên cụ thể' },
]

export const NotificationForm = ({ recipientType, onRecipientTypeChange, selectedCount, onSubmit, onReset, onPayloadChange, loading }) => {
  const [form, setForm] = useState({ title: '', message: '', type: 'SYSTEM', level: 'INFO', channels: ['STUDENT', 'ADMIN', 'UNPAID_TUITION_STUDENTS'].includes(recipientType) ? ['IN_APP'] : ['IN_APP', 'PUSH'], shouldShowReminderModal: false })
  const [errors, setErrors] = useState({})
  const pushDisabled = ['STUDENT', 'ADMIN', 'UNPAID_TUITION_STUDENTS'].includes(recipientType)

  const update = (patch) => {
    setForm((current) => ({ ...current, ...patch }))
    onPayloadChange?.()
  }

  const toggleChannel = (channel) => {
    if (channel === 'PUSH' && pushDisabled) return
    update({ channels: form.channels.includes(channel) ? form.channels.filter((item) => item !== channel) : [...form.channels, channel] })
  }

  const submit = (event) => {
    event.preventDefault()
    const next = {}
    if (!form.title.trim()) next.title = 'Vui lòng nhập tiêu đề'
    if (!form.message.trim()) next.message = 'Vui lòng nhập nội dung'
    if (!form.channels.length) next.channels = 'Chọn ít nhất một kênh gửi'
    if (!['ALL', 'UNPAID_TUITION_STUDENTS'].includes(recipientType) && selectedCount === 0) next.recipients = 'Chọn ít nhất một người nhận'
    setErrors(next)
    if (!Object.keys(next).length) onSubmit(form)
  }

  const reset = () => {
    setForm({ title: '', message: '', type: 'SYSTEM', level: 'INFO', channels: pushDisabled ? ['IN_APP'] : ['IN_APP', 'PUSH'], shouldShowReminderModal: false })
    setErrors({})
    onReset?.()
  }

  return <form onSubmit={submit} className="space-y-5 rounded-sm border border-border bg-white p-5">
    <h2 className="text-lg font-semibold">Soạn thông báo</h2>
    <Dropdown label="Gửi đến" value={recipientType} options={RECIPIENT_OPTIONS} onChange={(value) => { onRecipientTypeChange(value); onPayloadChange?.() }} disabled={loading} />
    <Input label="Tiêu đề" value={form.title} onChange={(event) => update({ title: event.target.value })} error={errors.title} maxLength={255} required />
    <div>
      <label className="mb-2 block text-sm font-medium">Nội dung <span className="text-error">*</span></label>
      <MarkdownEditorPreview value={form.message} onChange={(message) => update({ message })} height="280px" editable={!loading} />
      {errors.message && <p className="mt-1 text-sm text-error">{errors.message}</p>}
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <Dropdown label="Loại" value={form.type} onChange={(type) => update({ type })} options={[
        ['SYSTEM','Hệ thống'],['COURSE','Khóa học'],['LESSON','Buổi học'],['ATTENDANCE','Điểm danh'],['TUITION','Học phí'],['MESSAGE','Tin nhắn'],['RESULT','Kết quả / điểm thi'],['OTHER','Khác'],
      ].map(([value,label]) => ({ value,label }))} />
      <Dropdown label="Mức độ" value={form.level} onChange={(level) => update({ level })} options={['INFO','SUCCESS','WARNING','ERROR'].map((value) => ({ value, label: value }))} />
    </div>
    <fieldset>
      <legend className="mb-2 text-sm font-medium">Kênh gửi</legend>
      <div className="flex flex-wrap gap-5">
        <Checkbox checked={form.channels.includes('IN_APP')} onChange={() => toggleChannel('IN_APP')} label="Trong ứng dụng" />
        <Checkbox checked={form.channels.includes('PUSH')} onChange={() => toggleChannel('PUSH')} label="Push notification" disabled={pushDisabled} />
      </div>
      {recipientType === 'ALL' && <p className="mt-2 text-xs text-foreground-light">Push chỉ được tạo cho phụ huynh và vẫn phụ thuộc thiết lập nhận thông báo.</p>}
      {pushDisabled && <p className="mt-2 text-xs text-foreground-light">Push chưa hỗ trợ đối tượng này; người nhận vẫn nhận thông báo trong ứng dụng.</p>}
      {errors.channels && <p className="mt-1 text-sm text-error">{errors.channels}</p>}
    </fieldset>
    <Checkbox checked={form.shouldShowReminderModal} onChange={() => update({ shouldShowReminderModal: !form.shouldShowReminderModal })} label="Hiển thị popup nhắc nhở" />
    {errors.recipients && <p role="alert" className="text-sm text-error">{errors.recipients}</p>}
    <div className="flex justify-end gap-3 border-t border-border pt-4">
      <Button type="button" variant="outline" onClick={reset} disabled={loading}>Đặt lại</Button>
      <Button type="submit" loading={loading} disabled={loading || !form.channels.length}>Xếp hàng gửi</Button>
    </div>
  </form>
}
