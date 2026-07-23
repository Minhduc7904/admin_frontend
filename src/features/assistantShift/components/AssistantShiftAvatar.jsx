import { useState } from 'react';

const initials = (name = '') => name.split(' ').filter(Boolean).slice(-2).map((part) => part[0]).join('').toUpperCase() || 'TG';
const statusBorder = { PENDING: 'border-amber-400', PRESENT: 'border-emerald-500', ABSENT: 'border-red-500' };

export const AssistantShiftAvatar = ({ admin, status, sizeClass = 'h-5 w-5', textClass = 'text-[8px]' }) => {
  const [failed, setFailed] = useState(false);
  const name = admin?.fullName || `Admin #${admin?.adminId || ''}`;
  const border = statusBorder[status] || 'border-white';
  if (admin?.avatarUrl && !failed) return <img src={admin.avatarUrl} alt={name} title={name} loading="lazy" onError={() => setFailed(true)} className={`${sizeClass} shrink-0 rounded-full border-2 object-cover ${border}`} />;
  return <span title={name} className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full border-2 bg-indigo-500 font-semibold text-white ${textClass} ${border}`}>{initials(admin?.fullName)}</span>;
};
