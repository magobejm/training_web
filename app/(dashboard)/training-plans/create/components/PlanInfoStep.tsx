import { usePlanWizardStore } from '@/stores/plan-wizard.store';
import { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';

export default function PlanInfoStep() {
    const { planInfo, setPlanInfo, nextStep } = usePlanWizardStore();
    const [email, setEmail] = useState(''); // Just a placeholder if we need client search later
    const { t } = useTranslation();

    const isValid = planInfo.name.trim().length > 3;

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('plans.wizard.info.title')}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('plans.wizard.info.name')}
                        </label>
                        <input
                            type="text"
                            value={planInfo.name}
                            onChange={(e) => setPlanInfo({ ...planInfo, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                            placeholder={t('plans.wizard.info.name_placeholder')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('plans.wizard.info.description')}
                        </label>
                        <textarea
                            value={planInfo.description}
                            onChange={(e) => setPlanInfo({ ...planInfo, description: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors min-h-[100px]"
                            placeholder={t('plans.wizard.info.description_placeholder')}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <button
                    onClick={nextStep}
                    disabled={!isValid}
                    className={`px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors ${!isValid ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {t('plans.wizard.next')}
                </button>
            </div>
        </div>
    );
}
