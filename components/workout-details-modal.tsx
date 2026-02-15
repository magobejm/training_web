'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ScheduledWorkout } from '@/types';
import { useRescheduleWorkout, useCancelScheduledWorkout } from '@/hooks/use-calendar';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

interface WorkoutDetailsModalProps {
    workout: ScheduledWorkout | null;
    isOpen: boolean;
    onClose: () => void;
}

export function WorkoutDetailsModal({ workout, isOpen, onClose }: WorkoutDetailsModalProps) {
    const { t, language } = useTranslation();
    const rescheduleMutation = useRescheduleWorkout();
    const cancelMutation = useCancelScheduledWorkout();

    const [isRescheduling, setIsRescheduling] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    if (!workout) return null;

    const handleCancel = async () => {
        if (confirm(t('calendar.details.cancel_confirm'))) {
            try {
                await cancelMutation.mutateAsync(workout.id);
                toast.success(t('calendar.details.cancel_success'));
                onClose();
            } catch (error) {
                toast.error(t('calendar.details.cancel_error'));
            }
        }
    };

    const handleReschedule = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const scheduledFor = new Date(`${newDate}T${newTime}:00`).toISOString();
            await rescheduleMutation.mutateAsync({ id: workout.id, date: scheduledFor });
            toast.success(t('calendar.details.reschedule_success'));
            setIsRescheduling(false);
            onClose();
        } catch (error) {
            toast.error(t('calendar.details.reschedule_error'));
        }
    };

    const startRescheduling = () => {
        const dateObj = new Date(workout.scheduledFor);
        setNewDate(dateObj.toISOString().split('T')[0]);
        setNewTime(dateObj.toTimeString().slice(0, 5));
        setIsRescheduling(true);
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
                                    {t('calendar.details.title')}
                                </Dialog.Title>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {!isRescheduling ? (
                                    <>
                                        <div className="flex items-start gap-4">
                                            <div className="bg-blue-100 p-3 rounded-full">
                                                <CalendarIcon className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    {format(new Date(workout.scheduledFor), "EEEE d 'de' MMMM, yyyy", { locale: language === 'es' ? es : enUS })}
                                                </h4>
                                                <p className="text-gray-500">
                                                    {format(new Date(workout.scheduledFor), "HH:mm")}
                                                </p>
                                                {workout.clientName && (
                                                    <p className="text-sm text-blue-600 font-medium mt-1">
                                                        {t('calendar.details.client_label', { name: workout.clientName })}
                                                    </p>
                                                )}
                                                {(workout.planName || workout.dayName) && (
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {workout.planName} • {workout.dayName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {workout.notes && (
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <p className="text-sm text-gray-600 italic">"{workout.notes}"</p>
                                            </div>
                                        )}

                                        <div className="pt-4 flex gap-3">
                                            <button
                                                onClick={startRescheduling}
                                                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                {t('calendar.details.reschedule')}
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex-1 px-4 py-2 bg-red-50 text-red-600 border border-red-100 font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                                {t('calendar.details.cancel')}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <form onSubmit={handleReschedule} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('calendar.details.new_date')}</label>
                                            <input
                                                type="date"
                                                value={newDate}
                                                onChange={(e) => setNewDate(e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('calendar.details.new_time')}</label>
                                            <input
                                                type="time"
                                                value={newTime}
                                                onChange={(e) => setNewTime(e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsRescheduling(false)}
                                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                            >
                                                {t('common.back')}
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={rescheduleMutation.isPending}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {rescheduleMutation.isPending ? t('calendar.details.saving') : t('calendar.details.confirm_change')}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
