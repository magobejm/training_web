'use client';

import { useTranslation } from '@/hooks/use-translation';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function InstructionsPage() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="bg-purple-100 p-4 rounded-full mb-6">
                <InformationCircleIcon className="h-12 w-12 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('sidebar.instructions')}</h1>
            <p className="text-gray-500 max-w-md">
                Esta sección contendrá indicaciones generales y documentos para tus clientes.
            </p>
        </div>
    );
}
