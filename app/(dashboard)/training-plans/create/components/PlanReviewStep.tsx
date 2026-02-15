import { usePlanWizardStore } from '@/stores/plan-wizard.store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';
import { useTranslation } from '@/hooks/use-translation';
import { useQueryClient } from '@tanstack/react-query';

export default function PlanReviewStep() {
    const { planInfo, days, prevStep } = usePlanWizardStore();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleCreatePlan = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                name: planInfo.name,
                description: planInfo.description,
                days: days.map(day => ({
                    name: day.name,
                    order: day.order,
                    exercises: day.exercises.map(ex => ({
                        exerciseId: ex.exerciseId,
                        order: ex.order,
                        targetSets: ex.targetSets,
                        targetReps: ex.targetReps,
                        targetRir: ex.targetRir,
                        restSeconds: ex.restSeconds,
                        customDescription: ex.customDescription,
                        customVideoUrl: ex.customVideoUrl,
                        customImageUrl: ex.customImageUrl,
                        coachNotes: ex.coachNotes
                    }))
                }))
            };

            await api.post('/training-plans', payload);
            queryClient.invalidateQueries({ queryKey: ['training-plans'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });

            router.push('/training-plans');

        } catch (err: any) {
            console.error('Failed to create plan:', err);
            setError(err.response?.data?.message || t('plans.wizard.review.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalExercises = days.reduce((acc, day) => acc + day.exercises.length, 0);

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('plans.wizard.review.title')}</h2>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase">{t('plans.wizard.review.plan_name')}</h3>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{planInfo.name}</p>
                </div>

                {planInfo.description && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase">{t('plans.wizard.review.description')}</h3>
                        <p className="text-gray-700 dark:text-gray-300">{planInfo.description}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase">{t('plans.wizard.review.total_days')}</h3>
                        <p className="text-xl font-bold text-blue-600">{days.length}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase">{t('plans.wizard.review.total_exercises')}</h3>
                        <p className="text-xl font-bold text-blue-600">{totalExercises}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">{t('plans.wizard.review.preview_title')}</h3>
                {days.map((day, idx) => (
                    <div key={day.id} className="ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                                {t('plans.wizard.review.day_label', { idx: idx + 1 })}
                            </span>
                            {day.name}
                        </div>
                        <ul className="mt-2 space-y-1">
                            {day.exercises.map(ex => (
                                <li key={ex.id} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                    {ex.name} <span className="text-xs text-gray-500">({t('plans.exercise_format', { sets: ex.targetSets, reps: ex.targetReps })})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                    {t('plans.wizard.back')}
                </button>
                <button
                    onClick={handleCreatePlan}
                    disabled={isSubmitting}
                    className={`px-8 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 ${isSubmitting ? 'opacity-70 cursor-wait' : ''
                        }`}
                >
                    {isSubmitting ? t('plans.wizard.review.creating') : t('plans.wizard.review.create_button')}
                </button>
            </div>
        </div>
    );
}
