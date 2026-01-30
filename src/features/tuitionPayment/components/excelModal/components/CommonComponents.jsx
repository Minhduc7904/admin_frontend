export const StudentInfoCell = ({ student }) => (
    <div>
        <div className="font-medium">{student.fullName}</div>
        <div className="text-xs text-gray-500">
            HS: {student.studentPhone || '—'} | PH: {student.parentPhone || '—'}
        </div>
    </div>
)

export const Section = ({ title, icon: Icon, children, actions }) => (
    <div className="border rounded-lg bg-white">
        <div className="px-4 py-2 border-b font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
                {Icon && <Icon size={16} className="text-gray-500" />}
                {title}
            </div>
            {actions && <div>{actions}</div>}
        </div>
        <div className="p-4">{children}</div>
    </div>
)
