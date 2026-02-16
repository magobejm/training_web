'use client';

import { useTranslation } from '@/hooks/use-translation';
import { CakeIcon } from '@heroicons/react/24/outline';

export default function NutritionPage() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="bg-blue-100 p-4 rounded-full mb-6">
                <CakeIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('sidebar.nutrition')}</h1>
            <p className="text-gray-500 max-w-md">
                Esta funcionalidad está en desarrollo. Pronto podrás gestionar planes de alimentación aquí.
            </p>
        </div>
    );
}
