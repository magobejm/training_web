'use client';

import { useState } from 'react';
import { useClients } from '@/hooks/use-clients';
import { PlusIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import NewClientModal from '@/components/new-client-modal';
import Avatar from '@/components/ui/avatar';
import { useTranslation } from '@/hooks/use-translation';

export default function ClientsPage() {
    const { data: clients, isLoading, error } = useClients();
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                    <h2 className="text-2xl font-bold text-gray-900">{t('clients.title')}</h2>
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
                                {clients?.length || 0}
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
                            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
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
                                {clients?.length || 0}
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

            {/* Clients List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t('clients.active_clients')}
                    </h3>
                </div>

                {clients && clients.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {clients.map((client) => (
                            <Link
                                key={client.id}
                                href={`/clients/${client.id}`}
                                className="block px-6 py-4 hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Avatar id={client.id} name={client.name || client.email} size="md" src={client.avatarUrl} />
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {client.name || client.email}
                                            </h4>
                                            <p className="text-sm text-gray-500">{t('clients.status.active')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-medium text-gray-900">{t('clients.table.plan')}</p>
                                            <p className="text-sm text-gray-500">
                                                {client.activePlan?.name || t('clients.table.no_plan_assigned')}
                                            </p>
                                        </div>
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center">
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
            </div>

            {/* New Client Modal */}
            <NewClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
