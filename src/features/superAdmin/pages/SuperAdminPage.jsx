import {
    ResetPasswordByDateRangeApiCard,
    CleanupUnusedMediaOlderThan30DaysApiCard,
    UpdateAdminDirectApiCard,
} from '../component';

export const SuperAdminPage = () => {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Super Admin API Console</h1>
                <p className="text-sm text-foreground-light mt-1">
                    Giao diện gọi API trực tiếp.
                </p>
            </div>

            <ResetPasswordByDateRangeApiCard />
            <CleanupUnusedMediaOlderThan30DaysApiCard />
            <UpdateAdminDirectApiCard />
        </div>
    );
};
