/**
 * Đồng bộ với backend TypeOfExam enum
 */
export const TYPE_OF_EXAM = {
    CK1: 'CK1',
    CK2: 'CK2',
    GK1: 'GK1',
    GK2: 'GK2',
    TSA: 'TSA',
    THPT: 'THPT',
    OTTHPT: 'OTTHPT',
    OT: 'OT',
    HSA: 'HSA',
    OTHS: 'OTHS',
};

export const TYPE_OF_EXAM_OPTIONS = [
    { value: '', label: 'Chọn loại đề thi' },
    { value: TYPE_OF_EXAM.CK1, label: 'Cuối kỳ 1' },
    { value: TYPE_OF_EXAM.CK2, label: 'Cuối kỳ 2' },
    { value: TYPE_OF_EXAM.GK1, label: 'Giữa kỳ 1' },
    { value: TYPE_OF_EXAM.GK2, label: 'Giữa kỳ 2' },
    { value: TYPE_OF_EXAM.TSA, label: 'Đánh giá tư duy' },
    { value: TYPE_OF_EXAM.THPT, label: 'THPT Quốc Gia' },
    { value: TYPE_OF_EXAM.OTTHPT, label: 'Ôn tập THPT Quốc Gia' },
    { value: TYPE_OF_EXAM.OT, label: 'Ôn tập' },
    { value: TYPE_OF_EXAM.HSA, label: 'Đánh giá năng lực' },
    { value: TYPE_OF_EXAM.OTHS, label: 'Ôn tập chung' },
];

export const TYPE_OF_EXAM_LABELS = {
    [TYPE_OF_EXAM.CK1]: 'Cuối kỳ 1',
    [TYPE_OF_EXAM.CK2]: 'Cuối kỳ 2',
    [TYPE_OF_EXAM.GK1]: 'Giữa kỳ 1',
    [TYPE_OF_EXAM.GK2]: 'Giữa kỳ 2',
    [TYPE_OF_EXAM.TSA]: 'Đánh giá tư duy',
    [TYPE_OF_EXAM.THPT]: 'THPT Quốc Gia',
    [TYPE_OF_EXAM.OTTHPT]: 'Ôn tập THPT Quốc Gia',
    [TYPE_OF_EXAM.OT]: 'Ôn tập',
    [TYPE_OF_EXAM.HSA]: 'Đánh giá năng lực',
    [TYPE_OF_EXAM.OTHS]: 'Ôn tập chung',
};
