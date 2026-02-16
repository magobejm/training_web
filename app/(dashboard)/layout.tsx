'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import Avatar from '@/components/ui/avatar';
import { useTranslation } from '@/hooks/use-translation';
import {
    HomeIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
    CubeIcon,
    CalendarIcon,
    InboxIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    Cog6ToothIcon,
    CakeIcon,
    BookOpenIcon,
    InformationCircleIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { t } = useTranslation();

    const getRoleName = (role: any): string => {
        if (!role) return '';
        if (typeof role === 'string') return role;
        return role.name || '';
    };

    const roleName = getRoleName(user?.role);
    const isTrainer = roleName === 'TRAINER';
    const isAdmin = roleName === 'ADMIN';

    const navigation = [
        { name: t('sidebar.dashboard'), href: '/dashboard', icon: HomeIcon },
        { name: t('sidebar.clients'), href: '/clients', icon: UsersIcon },
        { name: t('sidebar.exercises'), href: '/exercises', icon: CubeIcon },
        { name: t('sidebar.nutrition'), href: '/nutrition', icon: CakeIcon },
        { name: t('sidebar.plans'), href: '/training-plans', icon: ClipboardDocumentListIcon },
        { name: t('sidebar.calendar'), href: '/calendar', icon: CalendarIcon },
        { name: t('sidebar.instructions'), href: '/instructions', icon: InformationCircleIcon },
        { name: t('sidebar.inbox'), href: '/inbox', icon: InboxIcon },
        { name: t('sidebar.payments'), href: '/payments', icon: CreditCardIcon },
        { name: t('sidebar.settings'), href: '/settings', icon: Cog6ToothIcon },
    ];

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo & Close Button */}
                    <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">{t('sidebar.app_name')}</h1>
                            <p className="text-sm text-gray-400 mt-1">{t('sidebar.subtitle')}</p>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden text-gray-400 hover:text-white"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center px-4 py-3 rounded-lg transition ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <item.icon className="h-5 w-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section & Theme Toggle */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <Avatar
                                    id={user?.id || 'default'}
                                    name={user?.email}
                                    avatarUrl={user?.avatarUrl}
                                    size="md"
                                    className="border-2 border-blue-500"
                                />
                                <div className="ml-3 min-w-0">
                                    <p className="text-sm font-medium text-white truncate max-w-[100px]">
                                        {user?.name || user?.email}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {isAdmin
                                            ? t('sidebar.role.admin')
                                            : isTrainer
                                                ? t('sidebar.role.trainer')
                                                : t('sidebar.role.client')}
                                    </p>
                                </div>
                            </div>
                            <ThemeToggle />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                            {t('sidebar.logout')}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
                    <div className="px-4 sm:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="mr-4 text-gray-500 hover:text-gray-700 md:hidden focus:outline-none"
                            >
                                <Bars3Icon className="h-6 w-6" />
                            </button>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {navigation.find((item) => pathname === item.href)?.name || t('sidebar.app_name')}
                            </h2>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    {children}
                </div>
            </main>
        </div>
    );
}
