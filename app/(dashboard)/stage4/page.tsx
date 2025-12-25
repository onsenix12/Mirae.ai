'use client';

import { useI18n } from '@/lib/i18n';

export default function Stage4Page() {
  const { t } = useI18n();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{t('stage4ComingSoon')}</h1>
    </div>
  );
}
