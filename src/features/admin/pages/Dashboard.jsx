import OnlineUsersStats from '../../../shared/components/socket/OnlineUsersStats'

export const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">
        Admin Dashboard
      </h1>
      <p className="text-sm text-foreground-light mb-6">
        Chào mừng đến với trang quản trị hệ thống.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OnlineUsersStats />
        {/* Add more dashboard widgets here */}
      </div>
    </div>
  );
};
