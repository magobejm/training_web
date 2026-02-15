import { usePlanWizardStore } from '@/stores/plan-wizard.store';
import { useTranslation } from '@/hooks/use-translation';

export default function WizardProgress({ currentStep }: { currentStep: number }) {
    const { setStep, activeStep } = usePlanWizardStore();
    const { t } = useTranslation();

    const steps = [
        { id: 0, name: t('plans.wizard.steps.info') },
        { id: 1, name: t('plans.wizard.steps.structure') },
        { id: 2, name: t('plans.wizard.steps.exercises') },
        { id: 3, name: t('plans.wizard.steps.review') },
    ];

    return (
        <div className="w-full">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10" />

                {steps.map((step, index) => {
                    const isCompleted = currentStep > index;
                    const isCurrent = currentStep === index;
                    const canNavigate = isCompleted || index === currentStep; // Allow going back

                    return (
                        <div key={step.id} className="flex flex-col items-center">
                            <button
                                onClick={() => canNavigate ? setStep(index) : null}
                                disabled={!canNavigate}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${isCompleted
                                    ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                                    : isCurrent
                                        ? 'bg-white dark:bg-gray-800 border-blue-600 text-blue-600'
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {index + 1}
                            </button>
                            <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                                {step.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
