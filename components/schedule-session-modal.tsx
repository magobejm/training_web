'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useClients } from '@/hooks/use-clients';
import { useTrainingPlans } from '@/hooks/use-training-plans';
import { useCreateScheduledWorkout } from '@/hooks/use-calendar';
import { TrainingPlan, TrainingDay } from '@/types';
import { useTranslation } from '@/hooks/use-translation';

interface ScheduleSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedDate?: Date;
}

export function ScheduleSessionModal({ isOpen, onClose, preselectedDate }: ScheduleSessionModalProps) {
    const { t } = useTranslation();
    const { data: clients } = useClients();
    const { data: plans } = useTrainingPlans();
    const createWorkout = useCreateScheduledWorkout();

    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [selectedDayId, setSelectedDayId] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('09:00');
    const [notes, setNotes] = useState('');

    // Derived state
    const selectedPlan = plans?.find(p => p.id === selectedPlanId);

    // Reset form when opening/closing
    useEffect(() => {
        if (isOpen && preselectedDate) {
            const year = preselectedDate.getFullYear();
            const month = String(preselectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(preselectedDate.getDate()).padStart(2, '0');
            setDate(`${year}-${month}-${day}`);
        }
        if (!isOpen) {
            // Optional: reset fields
        }
    }, [isOpen, preselectedDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClientId || !selectedDayId || !date || !time) return;

        try {
            const scheduledFor = new Date(`${date}T${time}:00`).toISOString();

            await createWorkout.mutateAsync({
                clientId: selectedClientId,
                trainingDayId: selectedDayId,
                scheduledFor,
                notes,
            });

            onClose();
            // Optional: Show success toast
        } catch (error) {
            console.error('Failed to schedule workout', error);
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden pointer-events-auto">
                            <div className="flex justify-between items-center p-4 border-b border-gray-100">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">
                                    {t('calendar.modal.title')}
                                </Dialog.Title>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                {/* Client Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('calendar.modal.client')}
                                    </label>
                                    <select
                                        value={selectedClientId}
                                        onChange={(e) => {
                                            const clientId = e.target.value;
                                            setSelectedClientId(clientId);
                                            // Auto-select the client's active plan
                                            const client = clients?.find(c => c.id === clientId);
                                            if (client?.activePlan) {
                                                setSelectedPlanId(client.activePlan.id);
                                                setSelectedDayId('');
                                            } else {
                                                setSelectedPlanId('');
                                                setSelectedDayId('');
                                            }
                                        }}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">{t('calendar.modal.select_client')}</option>
                                        {clients?.filter(c => c.activePlan).map((client) => (
                                            <option key={client.id} value={client.id}>
                                                {client.name || client.email}
                                            </option>
                                        ))}
                                    </select>
                                    {(clients?.filter(c => !c.activePlan).length || 0) > 0 && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            {t('calendar.modal.client_hint')}
                                        </p>
                                    )}
                                </div>

                                {/* Plan Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('calendar.modal.plan')}
                                    </label>
                                    <select
                                        value={selectedPlanId}
                                        disabled={true} // Always locked to the client's active plan
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100 cursor-not-allowed"
                                        required
                                    >
                                        <option value="">
                                            {selectedClientId
                                                ? (clients?.find(c => c.id === selectedClientId)?.activePlan?.name || t('calendar.modal.no_plan'))
                                                : t('calendar.modal.select_client_first')}
                                        </option>
                                    </select>
                                </div>

                                {/* Day Selection (dependent on plan) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('calendar.modal.day')}
                                    </label>
                                    <select
                                        value={selectedDayId}
                                        onChange={(e) => setSelectedDayId(e.target.value)}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        required
                                        disabled={!selectedPlanId}
                                    >
                                        <option value="">{t('calendar.modal.select_day')}</option>
                                        {selectedPlan?.days?.map((day) => (
                                            <option key={day.id} value={day.id}>
                                                {day.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date & Time */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('calendar.modal.date')}
                                        </label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('calendar.modal.time')}
                                        </label>
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('calendar.modal.notes')}
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder={t('calendar.modal.notes_placeholder')}
                                    />
                                </div>

                                <div className="pt-4 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createWorkout.isPending}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {createWorkout.isPending ? t('calendar.modal.submitting') : t('calendar.modal.submit')}
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
