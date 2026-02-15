import { usePlanWizardStore, WizardExercise } from '@/stores/plan-wizard.store';
import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Exercise } from '@/types';
import api from '@/lib/api';
import { useTranslation } from '@/hooks/use-translation';

export default function PlanExercisesStep() {
    const { days, addExerciseToDay, removeExerciseFromDay, updateExerciseConfig, nextStep, prevStep } = usePlanWizardStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeDayId, setActiveDayId] = useState<string | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        if (isModalOpen && exercises.length === 0) {
            api.get<Exercise[]>('/exercises').then(res => setExercises(res.data));
        }
    }, [isModalOpen, exercises.length]);

    const handleOpenModal = (dayId: string) => {
        setActiveDayId(dayId);
        setIsModalOpen(true);
    };

    const handleAddExercise = (exercise: Exercise) => {
        if (activeDayId) {
            addExerciseToDay(activeDayId, exercise);
            setIsModalOpen(false);
            setSearchQuery('');
        }
    };

    const filteredExercises = exercises.filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('plans.wizard.exercises.title')}</h2>

            <div className="space-y-6">
                {days.map((day) => (
                    <div key={day.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">{day.name}</h3>
                            <button
                                onClick={() => handleOpenModal(day.id)}
                                className="text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
                            >
                                <PlusIcon className="w-4 h-4" />
                                {t('plans.wizard.exercises.add_exercise_button')}
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {day.exercises.length === 0 ? (
                                <p className="text-sm text-gray-400 italic text-center py-2">{t('plans.wizard.exercises.empty')}</p>
                            ) : (
                                day.exercises.map((ex, index) => (
                                    <div key={ex.id} className="flex flex-col sm:flex-row gap-4 p-3 bg-white dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-md shadow-sm">
                                        <div className="flex-grow">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{ex.name}</span>
                                                <button onClick={() => removeExerciseFromDay(day.id, ex.id)} className="text-red-500 hover:text-red-700 p-1">
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">{t('plans.wizard.exercises.labels.sets')}</label>
                                                    <input
                                                        type="number"
                                                        value={ex.targetSets}
                                                        onChange={(e) => updateExerciseConfig(day.id, ex.id, { targetSets: parseInt(e.target.value) })}
                                                        className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">{t('plans.wizard.exercises.labels.reps')}</label>
                                                    <input
                                                        type="text"
                                                        value={ex.targetReps}
                                                        onChange={(e) => updateExerciseConfig(day.id, ex.id, { targetReps: e.target.value })}
                                                        className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">{t('plans.wizard.exercises.labels.rest')}</label>
                                                    <input
                                                        type="number"
                                                        value={ex.restSeconds}
                                                        onChange={(e) => updateExerciseConfig(day.id, ex.id, { restSeconds: parseInt(e.target.value) })}
                                                        className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">{t('plans.wizard.exercises.labels.rir')}</label>
                                                    <input
                                                        type="number"
                                                        value={ex.targetRir || ''}
                                                        onChange={(e) => updateExerciseConfig(day.id, ex.id, { targetRir: parseInt(e.target.value) })}
                                                        className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={prevStep}
                    className="px-6 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                    {t('plans.wizard.back')}
                </button>
                <button
                    onClick={nextStep}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                    {t('plans.wizard.next_review')}
                </button>
            </div>

            {/* Exercise Selector Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold dark:text-white">{t('plans.wizard.exercises.modal_title')}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                X
                            </button>
                        </div>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <input
                                type="text"
                                placeholder={t('plans.wizard.exercises.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex-grow overflow-y-auto p-2">
                            {filteredExercises.length === 0 ? (
                                <p className="text-center text-gray-500 p-4">{t('plans.wizard.exercises.no_results')}</p>
                            ) : (
                                <div className="space-y-1">
                                    {filteredExercises.map(ex => (
                                        <button
                                            key={ex.id}
                                            onClick={() => handleAddExercise(ex)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex justify-between items-center group"
                                        >
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100">{ex.name}</div>
                                                <div className="text-xs text-gray-500">{t(`exercises.muscles.${ex.muscleGroup}`) || ex.muscleGroup}</div>
                                            </div>
                                            <PlusIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
