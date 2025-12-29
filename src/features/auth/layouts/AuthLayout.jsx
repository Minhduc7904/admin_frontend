export const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-primary-dark flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-foreground rounded-sm mb-3">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-foreground mb-1">AD Frontend</h1>
                    {subtitle && <p className="text-sm text-foreground-light">{subtitle}</p>}
                </div>

                {/* Auth Card */}
                <div className="bg-primary border border-border rounded-sm p-6">
                    {title && <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>}
                    {children}
                </div>
            </div>
        </div>
    );
};
