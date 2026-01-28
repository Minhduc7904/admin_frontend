const currentYear = new Date().getFullYear();
export const ACADEMIC_YEARS_OPTIONS = [
  { value: "", label: "Chọn năm học" },
  ...Array.from({ length: 5 }, (_, i) => {
    const startYear = currentYear - 2 + i;
    const endYear = startYear + 1;
    const value = `${startYear}-${endYear}`;
    return { value, label: `${value}` };
  }),
];
