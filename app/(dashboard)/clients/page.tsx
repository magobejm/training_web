'use client';

import { useState } from 'react';
import { useClients } from '@/hooks/use-clients';
import { PlusIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import NewClientModal from '@/components/new-client-modal';
import Avatar from '@/components/ui/avatar';
import { useTranslation } from '@/hooks/use-translation';
import { User } from '@/types';

// Helper to calculate age from birthDate
function calculateAge(birthDateString?: string | Date | null): string {
    if (!birthDateString) return 'N/A';
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return `${age} años`;
}

export default function ClientsPage() {
    const { data: unsortedClients, isLoading, error } = useClients();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useTranslation();

    // Sort clients alphabetically by name
    const clients = unsortedClients ? [...unsortedClients].sort((a, b) => {
        const nameA = a.name || a.email || '';
        const nameB = b.name || b.email || '';
        return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
    }) : [];

    const totalClients = clients.length;
    const activeThisMonth = clients.filter(c => (c as any).completedSessionsCount > 0).length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newLast30d = clients?.filter(c => new Date(c.createdAt) > thirtyDaysAgo).length || 0;

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

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{t('common.error')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de clientes</h2>
                    <p className="text-gray-600 mt-1">
                        {t('dashboard.stats.clients_desc')}
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    {t('clients.new_client')}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('dashboard.stats.total_clients')}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {totalClients}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('clients.stats.active_this_month')}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{activeThisMonth}</p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="h-6 w-6 text-green-600"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('clients.stats.new_last_30d')}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {newLast30d}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="h-6 w-6 text-purple-600"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clients Header Section title if needed, or just the grid directly */}
            <div className="flex items-center justify-between pt-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    {t('clients.active_clients')}
                </h3>
            </div>

            {/* Clients Grid */}
            {clients && clients.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {clients.map((client) => {
                        const age = calculateAge(client.birthDate);
                        const goal = client.goal || 'Sin objetivo'; // Fallback
                        const height = client.height ? `${client.height} cm` : 'N/A';
                        const weight = client.weight ? `${client.weight} kg` : 'N/A';

                        return (
                            <Link
                                key={client.id}
                                href={`/clients/${client.id}`}
                                className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow relative group"
                            >
                                {/* Active Indicator (Optional but nice) */}
                                <div className="absolute top-4 right-4 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>

                                <div className="flex flex-col items-center text-center">
                                    <Avatar
                                        id={client.id}
                                        name={client.name || client.email}
                                        size="lg" // Larger avatar
                                        src={client.avatarUrl}
                                        className="h-24 w-24 mb-4" // Explicit size override if needed by Avatar component logic or CSS
                                    />

                                    <h4 className="text-lg font-bold text-gray-900 truncate w-full">
                                        {client.name || client.email}
                                    </h4>

                                    {/* Goal Badge/Text */}
                                    <p className="text-xs uppercase tracking-wide font-bold text-blue-600 mt-1 mb-4">
                                        {goal}
                                    </p>

                                    {/* Stats Row */}
                                    <div className="flex items-center justify-center space-x-4 w-full text-xs text-gray-500 border-t border-gray-100 pt-4">
                                        <div className="flex items-center">
                                            <span className="font-semibold text-gray-700 mr-1">⚖️</span>
                                            {weight}
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-semibold text-gray-700 mr-1">📏</span>
                                            {height}
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-semibold text-gray-700 mr-1">🎂</span>
                                            {age}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {t('clients.no_clients')}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {t('dashboard.quick_actions.new_client_desc')}
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        {t('clients.new_client')}
                    </button>
                </div>
            )}

            {/* New Client Modal */}
            <NewClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
