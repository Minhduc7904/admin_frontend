import React from 'react';
import { Card } from '@/shared/components/ui';
import { CheckCircle, XCircle } from 'lucide-react';

interface Activity {
    id: string;
    action: string;
    description: string;
    timestamp: string;
    status: 'success' | 'failed';
}

interface AdminActivityTabProps {
    activities: Activity[];
}

export const AdminActivityTab: React.FC<AdminActivityTabProps> = ({ activities }) => {
    return (
        <Card>
            <div className="space-y-3">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {activity.status === 'success' ? (
                            <CheckCircle size={18} className="text-green-600 mt-0.5" />
                        ) : (
                            <XCircle size={18} className="text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                                </div>
                                <span className="text-xs text-gray-500">{activity.timestamp}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
