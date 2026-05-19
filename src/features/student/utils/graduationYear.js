const GRADUATION_YEAR_CUTOFF_MONTH = 4; // May, zero-based month index.
const GRADUATION_YEAR_CUTOFF_DAY = 18;

export const getSuggestedHighSchoolGraduationYear = (grade, date = new Date()) => {
    const numericGrade = Number(grade);

    if (!Number.isInteger(numericGrade) || numericGrade < 1 || numericGrade > 12) {
        return '';
    }

    const currentYear = date.getFullYear();
    const isAfterCutoff =
        date.getMonth() > GRADUATION_YEAR_CUTOFF_MONTH ||
        (
            date.getMonth() === GRADUATION_YEAR_CUTOFF_MONTH &&
            date.getDate() >= GRADUATION_YEAR_CUTOFF_DAY
        );

    const grade12GraduationYear = currentYear + (isAfterCutoff ? 1 : 0);

    return String(grade12GraduationYear + (12 - numericGrade));
};

export const getHighSchoolGraduationYearOptions = (date = new Date()) => {
    const currentYear = date.getFullYear();
    const startYear = currentYear - 15;
    const endYear = currentYear + 15;

    return [
        { value: '', label: 'Tất cả năm tốt nghiệp' },
        ...Array.from({ length: endYear - startYear + 1 }, (_, index) => {
            const year = String(startYear + index);
            return { value: year, label: year };
        }),
    ];
};
