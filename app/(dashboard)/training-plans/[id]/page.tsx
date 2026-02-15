'use client';

import { useState } from 'react';

import { useTrainingPlan, useDeleteTrainingPlan } from '@/hooks/use-training-plans';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';



export default function TrainingPlanDetailPage() {
    const params = useParams();
    const router = useRouter();
    const planId = params.id as string;
    const { data: plan, isLoading } = useTrainingPlan(planId);
    const { mutateAsync: deletePlan, isPending: isDeleting } = useDeleteTrainingPlan();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { t } = useTranslation();

    const handleDelete = async () => {
        try {
            await deletePlan(planId);
            toast.success(t('plans.delete_success'));
            router.push('/training-plans');
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('plans.delete_error'));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('plans.loading_details')}</p>
                </div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{t('plans.not_found')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/training-plans"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                {t('plans.back_to_list')}
            </Link>

            {/* Plan Header */}
            <div className="relative rounded-xl overflow-hidden shadow-sm h-48 group">
                {/* Background Image - Absolute */}
                <div className="absolute inset-0">
                    <img
                        src="/images/placeholders/plan-bg.jpg"
                        alt="Training Plan"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                </div>

                {/* Content - Absolute Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                    <h1 className="text-3xl font-bold mb-2">{plan.name}</h1>
                    {plan.description && (
                        <p className="text-gray-200 max-w-2xl opacity-90">{plan.description}</p>
                    )}
                </div>
            </div>

            {/* Days List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {t('plans.days_count', { count: plan.days?.length || 0 })}
                    </h2>
                </div>

                {plan.days && plan.days.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {plan.days.map((day, index) => (
                            <div key={day.id} className="px-6 py-4">
                                <h3 className="font-medium text-gray-900 mb-2">
                                    {t('plans.day_header', { order: day.order || index + 1, name: day.name })}
                                </h3>
                                {day.exercises && day.exercises.length > 0 ? (
                                    <ul className="space-y-1">
                                        {day.exercises.map((de) => (
                                            <li key={de.id} className="text-sm text-gray-600">
                                                • {de.exercise?.name || t('common.exercise')} - {de.targetSets} series x {de.targetReps} reps
                                                {de.restSeconds && ` ${t('plans.rest_display', { rest: de.restSeconds })}`}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">{t('plans.no_exercises')}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center">
                        <p className="text-gray-600">
                            {t('plans.no_days')}
                        </p>
                    </div>
                )}
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-red-200">
                <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                    <h3 className="text-lg font-semibold text-red-900">{t('plans.danger_zone')}</h3>
                </div>
                <div className="px-6 py-4">
                    <p className="text-sm text-gray-600 mb-4">
                        {t('plans.danger_desc')}
                    </p>
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            <TrashIcon className="h-5 w-5 mr-2" />
                            {t('plans.delete_button')}
                        </button>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <p className="text-sm font-medium text-red-600">{t('plans.confirm_title')}</p>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {isDeleting ? t('plans.deleting') : t('plans.confirm_delete')}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                {t('common.cancel')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
