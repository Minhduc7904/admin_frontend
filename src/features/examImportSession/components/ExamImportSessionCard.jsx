import { Calendar, FileText, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

export const ExamImportSessionCard = ({ session, onClick }) => {
    return (
        <div
            onClick={() => onClick?.(session)}
            className="group relative aspect-square bg-white border-2 border-gray-200 rounded-xl hover:shadow-lg hover:border-primary transition-all cursor-pointer overflow-hidden"
        >
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
            {/* Header */}
            <div className="space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            Session {session.sessionId}
                        </h3>
                        {session.description && (
                            <p className="text-sm text-foreground-light mt-1 line-clamp-2">
                                {session.description}
                            </p>
                        )}
                    </div>
                    <FileText className="text-foreground-light group-hover:text-primary transition-colors flex-shrink-0 ml-2" size={20} />
                </div>

                {/* Metadata */}
                <div className="space-y-2">
                    {session.createdBy && (
                        <div className="flex items-center gap-2 text-sm text-foreground-light">
                            <User size={14} />
                            <span className="line-clamp-1">{session.createdBy.fullName || 'N/A'}</span>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-foreground-light">
                        <Calendar size={14} />
                        <span>
                            {session.createdAt
                                ? formatDistanceToNow(new Date(session.createdAt), {
                                      addSuffix: true,
                                      locale: vi,
                                  })
                                : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs text-foreground-light">
                    <span className="truncate">ID: {session.sessionId.slice(0, 8)}...</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded flex-shrink-0">
                        Session
                    </span>
                </div>
            </div>
        </div>
        </div>
    )
}
