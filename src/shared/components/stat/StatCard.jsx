export const StatCard = ({ icon: Icon, iconBg, iconColor, label, value }) => {
    return (
        <div className="bg-primary border border-border rounded-sm p-4">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-sm ${iconBg}`}>
                    <Icon size={20} className={iconColor} />
                </div>
                <div>
                    <p className="text-xs text-foreground-light">{label}</p>
                    <p className="text-xl font-semibold text-foreground">{value}</p>
                </div>
            </div>
        </div>
    );
};
