'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useDashboard } from '@/hooks/use-dashboard';
import { TrainerStats, ClientStats } from '@/types';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';
import {
    UsersIcon,
    ClipboardDocumentListIcon,
    CalendarIcon,
    RocketLaunchIcon,
    PlusIcon,
    AcademicCapIcon,
    DocumentPlusIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import Avatar from '@/components/ui/avatar';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    const { data: dashboard, isLoading, error } = useDashboard();
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (error || !dashboard) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{t('common.error')}</p>
            </div>
        );
    }

    const getRoleName = (role: any): string => {
        if (!role) return '';
        if (typeof role === 'string') return role;
        return role.name || '';
    };

    const isTrainer = getRoleName(dashboard.role) === 'TRAINER';
    const stats = dashboard.data;

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 bg-gradient-to-r from-white to-blue-50 flex items-center gap-6">
                {user && <Avatar id={user.id} name={user.email} avatarUrl={user.avatarUrl} size="xl" />}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t('dashboard.welcome', { name: user?.name || user?.email?.split('@')[0] || '' })}
                    </h1>
                    <p className="text-gray-600">
                        {isTrainer
                            ? t('dashboard.trainer_subtitle')
                            : t('dashboard.client_subtitle')}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isTrainer ? (
                    <>
                        <StatsCard
                            title={t('dashboard.stats.total_clients')}
                            value={(stats as TrainerStats).totalClients}
                            description={t('dashboard.stats.clients_desc')}
                            icon={<UsersIcon className="h-6 w-6 text-blue-600" />}
                            iconBg="bg-blue-100"
                        />
                        <StatsCard
                            title={t('dashboard.stats.total_exercises')}
                            value={(stats as TrainerStats).totalExercises}
                            description={t('dashboard.stats.exercises_desc')}
                            icon={<AcademicCapIcon className="h-6 w-6 text-green-600" />}
                            iconBg="bg-green-100"
                        />
                        <StatsCard
                            title={t('dashboard.stats.sessions_today')}
                            value={(stats as TrainerStats).sessionsToday}
                            description={t('dashboard.stats.sessions_today_desc')}
                            icon={<CalendarIcon className="h-6 w-6 text-purple-600" />}
                            iconBg="bg-purple-100"
                        />
                    </>
                ) : (
                    <>
                        <StatsCard
                            title={t('dashboard.stats.sessions_month')}
                            value={(stats as ClientStats).completedWorkoutsThisMonth}
                            description={t('dashboard.stats.sessions_month_desc')}
                            icon={<RocketLaunchIcon className="h-6 w-6 text-orange-600" />}
                            iconBg="bg-orange-100"
                        />
                        <div className="bg-white rounded-xl shadow-sm p-6 col-span-1 md:col-span-2">
                            <h3 className="text-sm font-medium text-gray-600 mb-4">{t('dashboard.active_plan.title')}</h3>
                            {(stats as ClientStats).activePlan ? (
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{(stats as ClientStats).activePlan?.name}</p>
                                        <p className="text-sm text-gray-500 mt-1">{(stats as ClientStats).activePlan?.description || 'Sin descripción'}</p>
                                    </div>
                                    <Link
                                        href={`/training-plans/${(stats as ClientStats).activePlan?.id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        {t('dashboard.active_plan.view_details')}
                                    </Link>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">{t('dashboard.active_plan.no_plan')}</p>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Quick Actions (Trainer Only for now as requested) */}
            {isTrainer && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        {t('dashboard.quick_actions.title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <QuickAction
                            title={t('dashboard.quick_actions.new_client')}
                            description={t('dashboard.quick_actions.new_client_desc')}
                            href="/clients"
                            icon={<PlusIcon className="h-5 w-5" />}
                            color="blue"
                        />
                        <QuickAction
                            title={t('dashboard.quick_actions.new_exercise')}
                            description={t('dashboard.quick_actions.new_exercise_desc')}
                            href="/exercises"
                            icon={<DocumentPlusIcon className="h-5 w-5" />}
                            color="green"
                        />
                        <QuickAction
                            title={t('dashboard.quick_actions.new_plan')}
                            description={t('dashboard.quick_actions.new_plan_desc')}
                            href="/training-plans"
                            icon={<ClipboardDocumentListIcon className="h-5 w-5" />}
                            color="purple"
                        />
                        <QuickAction
                            title={t('dashboard.quick_actions.view_calendar')}
                            description={t('dashboard.quick_actions.view_calendar_desc')}
                            href="/calendar"
                            icon={<CalendarIcon className="h-5 w-5" />}
                            color="orange"
                        />
                    </div>
                </div>
            )}

            {!isTrainer && (stats as ClientStats).nextSession && (
                <div className="bg-blue-600 rounded-xl shadow-lg p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                            <ClockIcon className="h-5 w-5" />
                            {t('dashboard.next_session.title')}
                        </h3>
                        <p className="text-blue-100">
                            {t('dashboard.next_session.scheduled_for', { date: new Date((stats as ClientStats).nextSession!.date).toLocaleDateString() })}
                        </p>
                    </div>
                    <Link href="/calendar" className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition">
                        {t('dashboard.next_session.view_calendar')}
                    </Link>
                </div>
            )}
        </div>
    );
}

function StatsCard({ title, value, description, icon, iconBg }: { title: string, value: number, description: string, icon: React.ReactNode, iconBg: string }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <div className={`h-12 w-12 ${iconBg} rounded-lg flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
                {description}
            </p>
        </div>
    );
}

function QuickAction({ title, description, href, icon, color }: { title: string, description: string, href: string, icon: React.ReactNode, color: string }) {
    const colors = {
        blue: 'hover:border-blue-500 hover:bg-blue-50',
        green: 'hover:border-green-500 hover:bg-green-50',
        purple: 'hover:border-purple-500 hover:bg-purple-50',
        orange: 'hover:border-orange-500 hover:bg-orange-50',
    };

    return (
        <Link
            href={href}
            className={`p-4 border-2 border-dashed border-gray-300 rounded-lg ${colors[color as keyof typeof colors]} transition text-left block group`}
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{title}</h3>
                <div className="text-gray-400 group-hover:text-gray-600">
                    {icon}
                </div>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
        </Link>
    );
}

