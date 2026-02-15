'use client';

import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateClient } from '@/hooks/use-clients';
import { User } from '@/types';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: User;
}

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    birthDate: z.string().optional().or(z.literal('')),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional().nullable().or(z.literal('')),
    height: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
    weight: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
    maxHeartRate: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
    restingHeartRate: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
    leanMass: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
    avatarUrl: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

export default function EditProfileModal({ isOpen, onClose, client }: EditProfileModalProps) {
    const { t } = useTranslation();
    const updateClient = useUpdateClient();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (client && isOpen) {
            reset({
                name: client.name || '',
                birthDate: client.birthDate ? new Date(client.birthDate).toISOString().split('T')[0] : '',
                gender: client.gender || '',
                height: client.height?.toString() || '',
                weight: client.weight?.toString() || '',
                maxHeartRate: client.maxHeartRate?.toString() || '',
                restingHeartRate: client.restingHeartRate?.toString() || '',
                leanMass: client.leanMass?.toString() || '',
                avatarUrl: client.avatarUrl || '',
            } as any);
        }
    }, [client, isOpen, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            await updateClient.mutateAsync({
                id: client.id,
                data: {
                    ...data,
                    gender: data.gender === '' ? null : (data.gender as any),
                    // transforms handle numbers
                } as any,
            });
            toast.success(t('clients.edit.success'));
            onClose();
        } catch (error) {
            toast.error(t('clients.edit.error'));
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">{t('common.close')}</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div>
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                            {t('clients.edit.title')}
                                        </Dialog.Title>
                                        <div className="mt-4">
                                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                                {/* Avatar Selection */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        {t('settings.profile.select_avatar')}
                                                    </label>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {Array.from({ length: 8 }).map((_, i) => {
                                                            const avatarPath = `/avatars/avatar-0${i + 1}.png`;
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    onClick={() => setValue('avatarUrl', avatarPath)}
                                                                    className={`
                                                                        cursor-pointer rounded-lg p-1 border-2 transition-all
                                                                        ${watch('avatarUrl') === avatarPath ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:bg-gray-50'}
                                                                    `}
                                                                >
                                                                    <img
                                                                        src={avatarPath}
                                                                        alt={`Avatar ${i + 1}`}
                                                                        className="w-full h-auto rounded-full"
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                        {t('clients.edit.name')}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('name')}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    />
                                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                                                            {t('clients.edit.birthDate')}
                                                        </label>
                                                        <input
                                                            type="date"
                                                            {...register('birthDate')}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                                            {t('clients.edit.gender')}
                                                        </label>
                                                        <select
                                                            {...register('gender')}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        >
                                                            <option value="">{t('common.select')}</option>
                                                            <option value="MALE">{t('common.gender.male')}</option>
                                                            <option value="FEMALE">{t('common.gender.female')}</option>
                                                            <option value="OTHER">{t('common.gender.other')}</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                                                            {t('clients.edit.height')} (cm)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            {...register('height')}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                                                            {t('clients.edit.weight')} (kg)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            {...register('weight')}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <label htmlFor="maxHeartRate" className="block text-sm font-medium text-gray-700">
                                                            {t('clients.edit.maxHeartRate')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            {...register('maxHeartRate')}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="restingHeartRate" className="block text-sm font-medium text-gray-700">
                                                            {t('clients.edit.restingHeartRate')}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            {...register('restingHeartRate')}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="leanMass" className="block text-sm font-medium text-gray-700">
                                                            {t('clients.edit.leanMass')} (%)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            {...register('leanMass')}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                    </div>
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
