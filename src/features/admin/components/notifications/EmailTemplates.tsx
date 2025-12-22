import React from 'react';
import { FileText } from 'lucide-react';

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    content: string;
}

interface EmailTemplatesProps {
    templates: EmailTemplate[];
    selectedTemplate: string;
    onTemplateSelect: (templateId: string) => void;
}

export const EmailTemplates: React.FC<EmailTemplatesProps> = ({
    templates,
    selectedTemplate,
    onTemplateSelect,
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Mẫu email có sẵn</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onTemplateSelect(template.id)}
                        className={`p-3 rounded border-2 text-left transition-all ${
                            selectedTemplate === template.id
                                ? 'border-gray-900 bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-start gap-2">
                            <FileText size={14} className="text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900">
                                    {template.name}
                                </p>
                                <p className="text-[10px] text-gray-600 mt-0.5 truncate">
                                    {template.subject}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
