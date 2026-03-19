export const ApiResponsePlaceholder = ({ message = 'Chua co du lieu phan hoi.' }) => {
    return (
        <div className="text-sm text-foreground-light border border-dashed border-border rounded-sm p-4">
            {message}
        </div>
    );
};
