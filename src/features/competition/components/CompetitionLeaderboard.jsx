import { Trophy, Medal, Award, User } from 'lucide-react'
import { Table } from '../../../shared/components/ui'

export const CompetitionLeaderboard = ({ competition }) => {
    const leaderboardData = [
        { rank: 1, fullName: 'Nguyễn Văn An', email: 'nguyenvanan@example.com', score: 95.5, completedAt: '2024-02-10T10:30:00', duration: 45, attemptCount: 1 },
        { rank: 2, fullName: 'Trần Thị Bình', email: 'tranthibinh@example.com', score: 92.0, completedAt: '2024-02-10T11:15:00', duration: 50, attemptCount: 2 },
        { rank: 3, fullName: 'Lê Hoàng Cường', email: 'lehoangcuong@example.com', score: 89.5, completedAt: '2024-02-10T09:45:00', duration: 48, attemptCount: 1 },
        { rank: 4, fullName: 'Phạm Thị Dung', email: 'phamthidung@example.com', score: 87.0, completedAt: '2024-02-10T14:20:00', duration: 52, attemptCount: 3 },
    ]

    const formatDate = (d) =>
        new Date(d).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })

    const rankBadge = (rank) => {
        if (rank === 1) return <Trophy size={12} className="text-yellow-500" />
        if (rank === 2) return <Medal size={12} className="text-gray-400" />
        if (rank === 3) return <Award size={12} className="text-orange-500" />
        return <span className="text-[11px] font-semibold">#{rank}</span>
    }

    const scoreBadge = (score) => {
        const color =
            score >= 90
                ? 'bg-green-100 text-green-700'
                : score >= 80
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'

        return (
            <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${color}`}>
                {score.toFixed(1)}
            </span>
        )
    }

    const columns = [
        {
            key: 'rank',
            label: '#',
            render: (i) => rankBadge(i.rank),
        },
        {
            key: 'student',
            label: 'Thí sinh',
            render: (i) => (
                <div className="flex items-center gap-1.5 min-w-0">
                    <User size={12} className="text-primary-600" />
                    <div className="min-w-0">
                        <div className="text-[11px] font-medium truncate">{i.fullName}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{i.email}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'score',
            label: 'Điểm',
            render: (i) => scoreBadge(i.score),
        },
        {
            key: 'duration',
            label: 'TG',
            render: (i) => <span className="text-[11px]">{i.duration}'</span>,
        },
        {
            key: 'attemptCount',
            label: 'Lần',
            render: (i) => <span className="text-[11px]">{i.attemptCount}</span>,
        },
        {
            key: 'completedAt',
            label: 'Xong',
            render: (i) => <span className="text-[10px]">{formatDate(i.completedAt)}</span>,
        },
    ]

    return (
        <div className="flex flex-col h-full border rounded-md overflow-hidden">

            {/* Header */}
            <div className="px-3 py-2 border-b">
                <div className="flex items-center gap-1">
                    <Trophy size={14} className="text-primary-600" />
                    <span className="text-sm font-semibold">Bảng xếp hạng</span>
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                    {competition?.title || 'Cuộc thi'}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 text-center border-b bg-muted px-2 py-1">
                <div>
                    <div className="text-sm font-bold">{leaderboardData.length}</div>
                    <div className="text-[10px] text-muted-foreground">Thí sinh</div>
                </div>
                <div>
                    <div className="text-sm font-bold">{Math.max(...leaderboardData.map(d => d.score)).toFixed(1)}</div>
                    <div className="text-[10px] text-muted-foreground">Cao nhất</div>
                </div>
                <div>
                    <div className="text-sm font-bold">
                        {(leaderboardData.reduce((s, d) => s + d.score, 0) / leaderboardData.length).toFixed(1)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">TB</div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <Table
                    dense
                    columns={columns}
                    data={leaderboardData}
                    loading={false}
                />
            </div>
        </div>
    )
}
