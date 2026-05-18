import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchableMultiSelect, SearchableSelect } from '../../../shared/components/ui';
import {
    getDocumentTypeTagsAsync,
    getLevelTagsAsync,
    getSubjectTagsAsync,
    selectDocumentTypeTags,
    selectLevelTags,
    selectSubjectTags,
} from '../../tag/store/tagSlice';

const filterTags = (tags, keyword = '') => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return tags;

    return tags.filter((tag) =>
        [tag.name, tag.slug].some((value) =>
            value?.toLowerCase().includes(normalizedKeyword)
        )
    );
};

const getTagLabel = (tag) => tag?.name || 'N/A';
const getTagValue = (tag) => tag?.tagId;
const renderTagOption = (tag) => (
    <div className="flex flex-col">
        <span className="font-medium">{tag.name}</span>
        <span className="text-xs text-foreground-light">{tag.slug}</span>
    </div>
);

export const DocumentPublishTagFields = ({ value, onChange, errors, disabled }) => {
    const dispatch = useDispatch();
    const levelTags = useSelector(selectLevelTags);
    const documentTypeTags = useSelector(selectDocumentTypeTags);
    const subjectTags = useSelector(selectSubjectTags);

    useEffect(() => {
        dispatch(getLevelTagsAsync());
        dispatch(getDocumentTypeTagsAsync());
        dispatch(getSubjectTagsAsync());
    }, [dispatch]);

    const selectedTagsByType = useMemo(
        () =>
            value.reduce((acc, tag) => {
                acc[tag.type] = [...(acc[tag.type] || []), tag];
                return acc;
            }, {}),
        [value]
    );

    const createLocalSearch = (tags) => async (keyword = '') => ({
        data: filterTags(tags, keyword),
        meta: { hasNext: false },
    });

    return (
        <div className="space-y-4">
            <SearchableSelect
                label="Cấp học"
                required
                placeholder="Chọn cấp học"
                value={selectedTagsByType.LEVEL?.[0] || null}
                onSelect={(tag) => onChange('LEVEL', tag)}
                searchFunction={createLocalSearch(levelTags)}
                fetchDefaultItems={() => ({ data: levelTags })}
                getOptionLabel={getTagLabel}
                getOptionValue={getTagValue}
                renderOption={renderTagOption}
                error={errors.levelTag}
                disabled={disabled}
            />

            <SearchableSelect
                label="Môn học"
                required
                placeholder="Chọn môn học"
                value={selectedTagsByType.SUBJECT?.[0] || null}
                onSelect={(tag) => onChange('SUBJECT', tag)}
                searchFunction={createLocalSearch(subjectTags)}
                fetchDefaultItems={() => ({ data: subjectTags })}
                getOptionLabel={getTagLabel}
                getOptionValue={getTagValue}
                renderOption={renderTagOption}
                error={errors.subjectTag}
                disabled={disabled}
            />

            <SearchableMultiSelect
                label="Loại tài liệu"
                required
                placeholder="Chọn ít nhất 1 loại tài liệu"
                value={selectedTagsByType.DOCUMENT_TYPE || []}
                onChange={(tags) => onChange('DOCUMENT_TYPE', tags)}
                searchFunction={(keyword) => createLocalSearch(documentTypeTags)(keyword)}
                fetchDefaultItems={() => ({ data: documentTypeTags, meta: { hasNext: false } })}
                getOptionLabel={getTagLabel}
                getOptionValue={getTagValue}
                renderOption={renderTagOption}
                error={errors.documentTypeTags}
                disabled={disabled}
            />
        </div>
    );
};
