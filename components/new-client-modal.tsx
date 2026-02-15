'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCreateClient } from '@/hooks/use-clients';
import { useTranslation } from '@/hooks/use-translation';

const createClientSchema = (t: (key: string) => string) => z.object({
    email: z.string().email(t('common.error')),
    name: z.string().min(2, t('clients.form.name_min')),
    password: z.string().min(8, t('clients.form.password_min')),
    confirmPassword: z.string(),
    avatarUrl: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: t('clients.form.password_mismatch'),
    path: ['confirmPassword'],
});

type ClientForm = z.infer<ReturnType<typeof createClientSchema>>;

interface NewClientModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewClientModal({ isOpen, onClose }: NewClientModalProps) {
    const createClient = useCreateClient();
    const [successMessage, setSuccessMessage] = useState('');
    const { t } = useTranslation();

    const clientSchema = createClientSchema(t);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<ClientForm>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            avatarUrl: '/avatars/avatar-01.png',
        },
    });

    const onSubmit = async (data: ClientForm) => {
        try {
            const result = await createClient.mutateAsync({
                email: data.email,
                name: data.name,
                password: data.password,
                avatarUrl: data.avatarUrl,
            });
            console.log('Cliente creado:', result);
            setSuccessMessage(t('clients.form.success_create'));
            reset();
            setTimeout(() => {
                setSuccessMessage('');
                onClose();
            }, 1500);
        } catch (error: any) {
            console.error('Error creating client:', error);
            console.error('Error response:', error.response?.data);
        }
    };

    const handleClose = () => {
        reset();
        setSuccessMessage('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={handleClose}
                ></div>

                {/* Modal */}
                <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">{t('clients.form.create_title')}</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-600">{successMessage}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {createClient.isError && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">
                                {t('clients.form.error_create')}
                            </p>
                        </div>
                    )}

                    {/* Form */}
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

                        {/* Name Field */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {t('clients.form.name')}
                            </label>
                            <input
                                {...register('name')}
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={t('clients.form.name_placeholder')}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {t('clients.form.email')}
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={t('clients.form.email_placeholder')}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {t('clients.form.password')}
                            </label>
                            <input
                                {...register('password')}
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={t('clients.form.password_placeholder')}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {t('clients.form.confirm_password')}
                            </label>
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                id="confirmPassword"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={t('clients.form.confirm_password_placeholder')}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-700">
                                {t('clients.form.info_credentials')}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={createClient.isPending}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {createClient.isPending ? t('clients.form.creating') : t('clients.form.create_title')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
