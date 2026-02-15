'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { ExclamationCircleIcon, CheckCircleIcon, LanguageIcon } from '@heroicons/react/24/outline';
import Avatar from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { useTranslation } from '@/hooks/use-translation';

export default function SettingsPage() {
    const { t, language, setLanguage } = useTranslation();
    const { user, login } = useAuthStore();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);

    // Dynamic schema based on translations
    const changePasswordSchema = z.object({
        oldPassword: z.string().min(8, t('settings.password.min_length')),
        newPassword: z.string().min(8, t('settings.password.min_length')),
        confirmPassword: z.string(),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: t('settings.password.mismatch'),
        path: ["confirmPassword"],
    });

    type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

    // Pixar-style avatar placeholders (Authentic 3D Renders)
    const pixarAvatars = [
        '/images/avatars/pixar-1.png',
        '/images/avatars/pixar-2.png',
        '/images/avatars/pixar-3.png',
        '/images/avatars/pixar-4.png',
        '/images/avatars/pixar-5.png',
        '/images/avatars/pixar-6.png',
    ];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const handleAvatarClick = async (url: string) => {
        setAvatarLoading(true);
        try {
            const response = await api.patch('/users/profile', { avatarUrl: url });
            // Update auth store with merged data to ensure role and other fields are preserved
            if (user && response.data) {
                const refreshedUser = {
                    ...user,
                    ...response.data
                };

                // Update local storage and state via login function
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                if (token) {
                    login(token, refreshedUser);
                }
                toast.success(t('settings.profile.avatar_updated'));
            }
        } catch (error: any) {
            console.error('Error updating avatar:', error);
            toast.error(t('settings.profile.avatar_error'));
        } finally {
            setAvatarLoading(false);
        }
    };

    const onSubmit = async (data: ChangePasswordFormData) => {
        setSubmitError(null);
        setSubmitSuccess(null);
        try {
            await api.post('/auth/change-password', {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });
            setSubmitSuccess(t('settings.password.success'));
            reset();
        } catch (error: any) {
            setSubmitError(error.response?.data?.message || t('settings.password.error_generic'));
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
            {/* Language Section */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                        <LanguageIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                        {t('settings.language.title')}
                    </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t('settings.language.description')}
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => setLanguage('es')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg border transition-colors ${language === 'es'
                            ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        🇪🇸 {t('settings.language.es')}
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg border transition-colors ${language === 'en'
                            ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        🇺🇸 {t('settings.language.en')}
                    </button>
                </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                    {t('settings.profile.title')}
                </h3>

                <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
                    <div className="flex flex-col items-center gap-2">
                        <Avatar
                            id={user?.id || 'demo'}
                            name={user?.name || user?.email}
                            avatarUrl={user?.avatarUrl}
                            size="xl"
                            className="border-4 border-blue-500 shadow-xl"
                        />
                        <span className="text-xs text-gray-500 font-medium">{t('settings.profile.current_avatar')}</span>
                    </div>

                    <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {t('settings.profile.select_avatar')}
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                            {pixarAvatars.map((url, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAvatarClick(url)}
                                    disabled={avatarLoading}
                                    className={`relative rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${user?.avatarUrl === url ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'}`}
                                >
                                    <img src={url} alt={`Avatar option ${idx + 1}`} className="w-full h-full object-cover aspect-square" />
                                    {user?.avatarUrl === url && (
                                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                            <div className="bg-blue-600 rounded-full p-1 shadow-lg">
                                                <CheckCircleIcon className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">{t('settings.profile.personal_info')}</h4>
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label htmlFor="display-name" className="block text-xs text-gray-500 mb-1">{t('settings.profile.display_name')}</label>
                            <input
                                type="text"
                                id="display-name"
                                defaultValue={user?.name || ''}
                                placeholder={t('settings.profile.name_placeholder')}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                                onBlur={async (e) => {
                                    const newName = e.target.value.trim();
                                    if (newName && newName !== user?.name) {
                                        try {
                                            const response = await api.patch('/users/profile', { name: newName });
                                            if (user && response.data) {
                                                const refreshedUser = { ...user, name: response.data.name };
                                                const token = localStorage.getItem('token');
                                                if (token) login(token, refreshedUser);
                                                toast.success(t('settings.profile.name_updated'));
                                            }
                                        } catch (error) {
                                            toast.error(t('settings.profile.name_error'));
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                    {t('settings.password.title')}
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {submitError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700 dark:text-red-200">{submitError}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {submitSuccess && (
                        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700 dark:text-green-200">{submitSuccess}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('settings.password.current')}
                        </label>
                        <input
                            type="password"
                            id="oldPassword"
                            {...register('oldPassword')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {errors.oldPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.oldPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('settings.password.new')}
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            {...register('newPassword')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('settings.password.confirm')}
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register('confirmPassword')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSubmitting ? t('settings.password.submitting') : t('settings.password.submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
