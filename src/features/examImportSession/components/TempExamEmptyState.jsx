import { FileText, Plus } from 'lucide-react';
import { Button } from '../../../shared/components';

export const TempExamEmptyState = ({ onAddClick }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-5 h-5 text-foreground" />
                    Thông tin đề thi
                </h2>
            </div>

            {/* Empty */}
            <div className="flex flex-col items-center justify-center py-12 h-full">
                <div className="text-center mb-6">
                    <div className="
                        w-16 h-16 rounded-full
                        bg-primary/20
                        flex items-center justify-center
                        mx-auto mb-4
                    ">
                        <FileText className="w-8 h-8 text-foreground-light" />
                    </div>

                    <p className="text-foreground-light mb-1">
                        Chưa có thông tin đề thi
                    </p>
                    <p className="text-sm text-gray-500">
                        Tạo đề thi để bắt đầu
                    </p>
                </div>

                {/* CTA – OUTLINE */}
                <Button
                    variant="outline"
                    onClick={onAddClick}
                >
                    <Plus className="w-5 h-5" />
                    Thêm đề thi
                </Button>
            </div>
        </div>
    )
}
