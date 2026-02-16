'use client';

import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogMetric } from '@/hooks/use-body-metrics';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

interface LogMetricModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
}

const schema = z.object({
    weight: z.string().transform((val) => Number(val)).pipe(z.number().min(0)),
    waist: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
    hips: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
    chest: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
    arm: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
    leg: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
    bodyFat: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
    notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LogMetricModal({ isOpen, onClose, clientId }: LogMetricModalProps) {
    const { t } = useTranslation();
    const logMetric = useLogMetric();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            await logMetric.mutateAsync({
                userId: clientId,
                weight: data.weight,
                waist: data.waist,
                hips: data.hips,
                chest: data.chest,
                arm: data.arm,
                leg: data.leg,
                bodyFat: data.bodyFat,
                notes: data.notes,
            });
            toast.success(t('clients.metrics.success_log'));
            onClose();
        } catch (error) {
            toast.error(t('clients.metrics.error_log'));
        }
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
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
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">{t('common.cancel')}</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div>
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                        <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                                            {t('clients.metrics.form.title')}
                                        </Dialog.Title>
                                        <div className="mt-4">
                                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        {t('clients.metrics.form.weight')}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        {...register('weight')}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    />
                                                    {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            {t('clients.metrics.form.waist')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            {...register('waist')}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            {t('clients.metrics.form.hips')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            {...register('hips')}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            {t('clients.metrics.form.chest')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            {...register('chest')}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            {t('clients.metrics.form.bodyFat')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            {...register('bodyFat')}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            {t('clients.metrics.form.arm')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            {...register('arm')}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            {t('clients.metrics.form.leg')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            {...register('leg')}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        {t('clients.metrics.form.notes')}
                                                    </label>
                                                    <textarea
                                                        {...register('notes')}
                                                        rows={2}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    />
                                                </div>

                                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                                                    >
                                                        {isSubmitting ? t('common.saving') : t('common.save')}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                        onClick={onClose}
                                                    >
                                                        {t('common.cancel')}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
