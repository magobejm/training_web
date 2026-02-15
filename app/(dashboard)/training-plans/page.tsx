'use client';

import { useTrainingPlans, useDeleteTrainingPlan } from '@/hooks/use-training-plans';
import { PlusIcon, ClipboardDocumentListIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

const PLAN_IMAGES = [
    '/images/placeholders/plan-bg.jpg',
    '/images/placeholders/plan-bg.jpg',
    '/images/placeholders/plan-bg.jpg',
    '/images/placeholders/plan-bg.jpg',
    '/images/placeholders/plan-bg.jpg',
];

export default function TrainingPlansPage() {
    const { data: plans, isLoading } = useTrainingPlans();
    const { mutateAsync: deletePlan } = useDeleteTrainingPlan();
    const { t } = useTranslation();

    const getPlanImage = (id: string) => {
        // Use the ID to get a consistent image for the same plan
        const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % PLAN_IMAGES.length;
        return PLAN_IMAGES[index];
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent navigation
        if (confirm(t('plans.delete_confirm'))) {
            try {
                await deletePlan(id);
                toast.success(t('plans.delete_success'));
            } catch (error: any) {
                toast.error(error.response?.data?.message || t('plans.delete_error'));
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('plans.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('plans.title')}</h2>
                    <p className="text-gray-600 mt-1">
                        {t('plans.subtitle')}
                    </p>
                </div>
                <Link
                    href="/training-plans/create"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    {t('plans.new_plan')}
                </Link>
            </div>

            {/* Plans Grid */}
            {plans && plans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <Link
                            key={plan.id}
                            href={`/training-plans/${plan.id}`}
                            className="block bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group relative"
                        >
                            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => handleDelete(e, plan.id)}
                                    className="p-1.5 bg-white/90 text-red-600 rounded-full hover:bg-red-50 shadow-sm"
                                    title={t('plans.delete_tooltip')}
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="h-40 relative">
                                <img
                                    src={getPlanImage(plan.id)}
                                    alt={plan.name}
                                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {plan.name}
                                </h3>
                                {plan.description && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {plan.description}
                                    </p>
                                )}
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>{t('plans.days', { count: plan.days?.length || 0 })}</span>
                                    <span>•</span>
                                    <span>
                                        {t('plans.exercises', { count: plan.days?.reduce((sum, day) => sum + (day.exercises?.length || 0), 0) || 0 })}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <ClipboardDocumentListIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {t('plans.empty_title')}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {t('plans.empty_desc')}
                    </p>
                    <Link
                        href="/training-plans/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        {t('plans.create_new')}
                    </Link>
                </div>
            )}
        </div>
    );
}
