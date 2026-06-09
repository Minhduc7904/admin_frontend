export const ApiResponsePlaceholder = ({ message = 'Chưa có dữ liệu phản hồi.' }) => {
    return (
        <div className="text-sm text-foreground-light border border-dashed border-border rounded-sm p-4">
            {message}
        </div>
    );
};
