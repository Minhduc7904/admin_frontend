import { FileText, Image, Video, File, MousePointerClick } from 'lucide-react';

export const ExamProcessing = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-8 h-full flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                {/* Icon */}
                <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                        <FileText className="w-12 h-12 text-primary" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <MousePointerClick className="w-4 h-4 text-white" />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground mb-2">
                    Chọn file để xem trước
                </h3>
                
                {/* Description */}
                <p className="text-foreground-light mb-8 max-w-md">
                    Click vào bất kỳ file nào bên trái để xem nội dung chi tiết ở đây
                </p>

                {/* Media Type List */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-foreground">File đề thi</p>
                            <p className="text-xs text-foreground-light">PDF, DOC, DOCX</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Image className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-foreground">Hình ảnh</p>
                            <p className="text-xs text-foreground-light">JPG, PNG, WEBP</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Video className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-foreground">Video</p>
                            <p className="text-xs text-foreground-light">MP4, WEBM</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <File className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-foreground">Đáp án</p>
                            <p className="text-xs text-foreground-light">PDF, Video</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
