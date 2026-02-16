'use client';

import { useTranslation } from '@/hooks/use-translation';
import { CreditCardIcon } from '@heroicons/react/24/outline';

export default function PaymentsPage() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="bg-green-100 p-4 rounded-full mb-6">
                <CreditCardIcon className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('sidebar.payments')}</h1>
            <p className="text-gray-500 max-w-md">
                Gestión de métodos de pago y facturación próximamente.
            </p>
        </div>
    );
}
