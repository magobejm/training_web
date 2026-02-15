'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';

const createForgotPasswordSchema = (t: (key: string) => string) => z.object({
    email: z.string().email(t('common.error')),
});

type ForgotPasswordForm = z.infer<ReturnType<typeof createForgotPasswordSchema>>;

export default function ForgotPasswordPage() {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const { t } = useTranslation();

    const forgotPasswordSchema = createForgotPasswordSchema(t);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        setSubmitError(null);
        try {
            await api.post('/auth/forgot-password', data);
            setSubmitSuccess(true);
        } catch (error: any) {
            // Even on error we might want to show success to prevent enumeration,
            // but for this MVP let's show success always unless network error.
            setSubmitSuccess(true);
        }
    };

    if (submitSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        {t('auth.forgotPassword.success_title')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {t('auth.forgotPassword.success_subtitle')}
                    </p>
                    <div className="mt-4">
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            {t('auth.forgotPassword.backToLogin')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        {t('auth.forgotPassword.title')}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {t('auth.forgotPassword.subtitle')}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                {t('auth.login.email')}
                            </label>
                            <input
                                id="email-address"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder={t('auth.login.email')}
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                        >
                            {isSubmitting ? t('auth.forgotPassword.submitting') : t('auth.forgotPassword.submit')}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            {t('auth.forgotPassword.backToLogin')}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
