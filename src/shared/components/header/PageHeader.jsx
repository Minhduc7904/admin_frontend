import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export const PageHeader = ({
    breadcrumb = [],
    title,
    badge,
    description,
}) => {
    return (
        <div className="space-y-2">
            {/* Breadcrumb */}
            <nav
                className="flex items-center gap-2 text-sm text-foreground-light"
                aria-label="Breadcrumb"
            >
                {breadcrumb.map((item, index) => {
                    const isLast = index === breadcrumb.length - 1

                    return (
                        <div key={index} className="flex items-center gap-2">
                            {item.to && !isLast ? (
                                <Link
                                    to={item.to}
                                    className="hover:text-foreground hover:underline transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span
                                    className={`${isLast
                                        ? 'text-foreground font-semibold truncate'
                                        : ''
                                        }`}
                                    title={item.label}
                                >
                                    {item.label}
                                </span>
                            )}

                            {!isLast && <ChevronRight className="w-4 h-4" />}
                        </div>
                    )
                })}
            </nav>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3">
                {badge && (
                    <span className="px-3 py-1 text-xs font-semibold tracking-widest uppercase bg-info-bg text-info-text rounded-sm">
                        {badge}
                    </span>
                )}

                {description && (
                    <p className="text-sm text-foreground-light">
                        {description}
                    </p>
                )}
            </div>
        </div>
    )
}
