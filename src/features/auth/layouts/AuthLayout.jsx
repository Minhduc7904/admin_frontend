import AdminBanner from '../../../assets/adminBanner.png'

export const AuthLayout = ({ children }) => {
    return (
        <div className='h-screen w-full p-20'>
            <div className="h-full w-full grid grid-cols-1 lg:grid-cols-2 shadow-lg rounded-xl overflow-hidden">
    
                {/* LEFT – Banner */}
                <div className="relative hidden lg:block overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110 blur-md"
                        style={{
                            backgroundImage: `url(${AdminBanner})`,
                        }}
                    />
                    <div className="absolute inset-0 bg-black/20" />
    
                    {/* Optional text / branding */}
                    <div className="relative z-10 h-full flex flex-col justify-center px-12 text-white">
                        <h1 className="text-3xl font-bold tracking-wide">
                            Admin System
                        </h1>
                        <p className="mt-3 text-sm text-white/70 max-w-md">
                            Secure management • Role-based access • Audit logs
                        </p>
                    </div>
                </div>
    
                {/* RIGHT – Auth Card */}
                <div className="flex items-center justify-center bg-primary px-4">
                    <div className="w-full max-w-md">
                        <div className="bg-primary backdrop-blur-md rounded-sm p-6 ">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
