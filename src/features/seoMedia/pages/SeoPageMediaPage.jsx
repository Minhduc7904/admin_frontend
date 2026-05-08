import {
  SeoMediaPreview,
  SeoPageHeader,
  SeoPageSelector,
  SeoPageSlotPanel,
} from '../components/seoPageMedia';

export const SeoPageMediaPage = () => {
  return (
    <div className="p-6 space-y-6">
      <SeoPageHeader />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <SeoPageSelector />
        <SeoPageSlotPanel />
        <SeoMediaPreview />
      </div>
    </div>
  );
};
