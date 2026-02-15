'use client';

import { usePlanWizardStore } from '@/stores/plan-wizard.store';
import WizardProgress from './components/WizardProgress';
import PlanInfoStep from './components/PlanInfoStep';
import PlanStructureStep from './components/PlanStructureStep';
import PlanExercisesStep from './components/PlanExercisesStep';
import PlanReviewStep from './components/PlanReviewStep';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';

export default function CreatePlanPage() {
    const { activeStep, reset } = usePlanWizardStore();
    const router = useRouter();
    const { t } = useTranslation();

    const handleCancel = () => {
        if (confirm(t('plans.wizard.cancel_confirm'))) {
            reset();
            router.push('/training-plans');
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('plans.wizard.title')}</h1>
            </div>

            <div className="mb-8">
                <WizardProgress currentStep={activeStep} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {activeStep === 0 && <PlanInfoStep />}
                {activeStep === 1 && <PlanStructureStep />}
                {activeStep === 2 && <PlanExercisesStep />}
                {activeStep === 3 && <PlanReviewStep />}

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-center">
                    <button
                        onClick={handleCancel}
                        className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
                    >
                        {t('plans.wizard.cancel_button')}
                    </button>
                </div>
            </div>
        </div>
    );
}
