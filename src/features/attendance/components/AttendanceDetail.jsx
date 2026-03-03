import { AttendanceDetailInfo } from './AttendanceDetailInfo';

export const AttendanceDetail = ({ attendance }) => {
    if (!attendance) {
        return (
            <div className="p-6 text-center text-foreground-light">
                Không có dữ liệu điểm danh
            </div>
        );
    }

    return <AttendanceDetailInfo attendance={attendance} />;
};
