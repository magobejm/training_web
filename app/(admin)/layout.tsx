'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';
import {
    UsersIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Entrenadores', href: '/admin/trainers', icon: UsersIcon },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else if (user?.role?.name !== 'ADMIN') {
            router.push('/dashboard');
        }
    }, [isAuthenticated, user, router]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!isAuthenticated || user?.role?.name !== 'ADMIN') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Verificando acceso de administrador...</p>
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
                        <div className="flex items-center space-x-2">
                            <ShieldCheckIcon className="h-8 w-8 text-red-500" />
                            <div>
                                <h1 className="text-xl font-bold">Admin Panel</h1>
                            </div>
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
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center px-4 py-3 rounded-lg transition ${isActive
                                        ? 'bg-red-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <item.icon className="h-5 w-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white">
                                    <span className="text-lg font-semibold">A</span>
                                </div>
                                <div className="ml-3 min-w-0">
                                    <p className="text-sm font-medium text-white truncate max-w-[100px]">
                                        {user?.email}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Administrador
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                            Cerrar Sesión
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
                                {navigation.find((item) => pathname === item.href)?.name || 'Admin Dashboard'}
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
