import { usePlanWizardStore } from '@/stores/plan-wizard.store';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'; // Adjust import based on installed version
import { useTranslation } from '@/hooks/use-translation';

export default function PlanStructureStep() {
    const { days, addDay, removeDay, updateDayName, nextStep, prevStep } = usePlanWizardStore();
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('plans.wizard.structure.title')}</h2>
                <button
                    onClick={addDay}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                    <PlusIcon className="w-5 h-5" />
                    {t('plans.wizard.structure.add_day')}
                </button>
            </div>

            <div className="space-y-4">
                {days.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <p className="text-gray-500 dark:text-gray-400">{t('plans.wizard.structure.empty_state')}</p>
                        <button
                            onClick={addDay}
                            className="mt-4 text-blue-600 hover:text-blue-500 font-medium"
                        >
                            {t('plans.wizard.structure.add_day_1')}
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {days.map((day, index) => (
                            <div
                                key={day.id}
                                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
                            >
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div className="flex-grow">
                                    <label className="block text-xs font-medium text-gray-500 uppercase px-1 mb-1">
                                        {t('plans.wizard.structure.day_name')}
                                    </label>
                                    <input
                                        type="text"
                                        value={day.name}
                                        onChange={(e) => updateDayName(day.id, e.target.value)}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder={t('plans.wizard.structure.day_placeholder', { index: index + 1 })}
                                    />
                                </div>
                                <button
                                    onClick={() => removeDay(day.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    title={t('plans.wizard.structure.remove_day')}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
                <button
                    onClick={prevStep}
                    className="px-6 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                    {t('plans.wizard.back')}
                </button>
                <button
                    onClick={nextStep}
                    disabled={days.length === 0}
                    className={`px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors ${days.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {t('plans.wizard.next_exercises')}
                </button>
            </div>
        </div>
    );
}
