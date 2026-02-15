'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTrainingPlans } from '@/hooks/use-training-plans';
import { useAssignPlan } from '@/hooks/use-clients';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

interface AssignPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    currentPlanId?: string;
}

export default function AssignPlanModal({ isOpen, onClose, clientId, currentPlanId }: AssignPlanModalProps) {
    const { data: plans, isLoading } = useTrainingPlans();
    const assignPlan = useAssignPlan();
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(currentPlanId || null);
    const { t } = useTranslation();

    const handleAssign = async () => {
        try {
            await assignPlan.mutateAsync({
                clientId,
                planId: selectedPlanId,
            });
            toast.success(t('clients.assign_plan.success'));
            onClose();
        } catch (error) {
            toast.error(t('clients.assign_plan.error'));
            console.error(error);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        {t('clients.assign_plan.title')}
                                    </Dialog.Title>
                                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="mt-2 space-y-4">
                                    <p className="text-sm text-gray-500">
                                        {t('clients.assign_plan.description')}
                                    </p>

                                    {isLoading ? (
                                        <div className="text-center py-4">{t('clients.assign_plan.loading')}</div>
                                    ) : (
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {plans?.map((plan) => (
                                                <div
                                                    key={plan.id}
                                                    onClick={() => setSelectedPlanId(plan.id)}
                                                    className={`p-3 rounded-lg border cursor-pointer transition ${selectedPlanId === plan.id
                                                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="font-medium text-gray-900">{plan.name}</div>
                                                    {plan.description && (
                                                        <div className="text-sm text-gray-500 line-clamp-1">{plan.description}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus:visible:ring-2 focus:visible:ring-blue-500 focus:visible:ring-offset-2"
                                        onClick={handleAssign}
                                        disabled={assignPlan.isPending}
                                    >
                                        {assignPlan.isPending ? t('clients.assign_plan.submitting') : t('clients.assign_plan.submit')}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
