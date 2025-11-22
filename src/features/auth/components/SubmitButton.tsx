import React from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

interface SubmitButtonProps {
    isLoading: boolean;
    text: string;
    loadingText: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    isLoading,
    text,
    loadingText,
}) => {
    return (
        <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{loadingText}</span>
                </>
            ) : (
                <>
                    <span>{text}</span>
                    <ArrowRight className="w-5 h-5" />
                </>
            )}
        </button>
    );
};
