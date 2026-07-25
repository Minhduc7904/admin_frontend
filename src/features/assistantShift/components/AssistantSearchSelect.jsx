import { assistantShiftApi } from '../../../core/api';
import { SearchableSelect } from '../../../shared/components/ui';
import { AssistantShiftAvatar } from './AssistantShiftAvatar';

const DEFAULT_PARAMS = {
  page: 1,
  limit: 20,
  sortBy: 'adminId',
  sortOrder: 'asc',
};

/** Search and select admins who currently hold the assistant role. */
export const AssistantSearchSelect = ({
  label = 'Thêm trợ giảng',
  placeholder = 'Tìm theo tên hoặc email...',
  onSelect,
  value,
  error,
  required = false,
  disabled = false,
  className = '',
}) => {
  const fetchAssistants = async (params) => {
    try {
      const response = await assistantShiftApi.getEligibleAssistants(params);
      return response.data;
    } catch (requestError) {
      console.error('Error loading eligible assistants:', requestError);
      return { data: [] };
    }
  };

  const renderAssistantOption = (assistant) => (
    <div className="flex items-center gap-2">
      <AssistantShiftAvatar admin={assistant} sizeClass="h-8 w-8" textClass="text-[10px]" />
      <div className="min-w-0">
        <p className="truncate font-medium">{assistant.fullName || `Admin #${assistant.adminId}`}</p>
        <p className="truncate text-xs text-foreground-light">{assistant.email || `ID: ${assistant.adminId}`}</p>
      </div>
    </div>
  );

  return (
    <SearchableSelect
      label={label}
      placeholder={placeholder}
      searchFunction={(search) => fetchAssistants({ ...DEFAULT_PARAMS, search })}
      fetchDefaultItems={() => fetchAssistants(DEFAULT_PARAMS)}
      onSelect={onSelect}
      getOptionLabel={(assistant) => assistant?.fullName || `Admin #${assistant?.adminId || ''}`}
      getOptionValue={(assistant) => assistant?.adminId}
      renderOption={renderAssistantOption}
      value={value}
      error={error}
      required={required}
      disabled={disabled}
      className={className}
      debounceMs={400}
    />
  );
};
