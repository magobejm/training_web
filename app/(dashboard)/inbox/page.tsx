'use client';

import { useState } from 'react';
import { useConsultations } from '@/hooks/use-consultations';
import { InboxIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';

type FilterStatus = 'ALL' | 'OPEN' | 'RESOLVED';

export default function InboxPage() {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<FilterStatus>('ALL');
    const { data: consultations, isLoading } = useConsultations(
        filter === 'ALL' ? undefined : filter
    );

    const filters: { label: string; value: FilterStatus; count?: number }[] = [
        { label: t('inbox.filters.all'), value: 'ALL', count: consultations?.length },
        {
            label: t('inbox.filters.open'),
            value: 'OPEN',
            count: consultations?.filter(c => c.status === 'OPEN').length
        },
        {
            label: t('inbox.filters.resolved'),
            value: 'RESOLVED',
            count: consultations?.filter(c => c.status === 'RESOLVED').length
        },
    ];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH':
                return 'bg-red-100 text-red-700';
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-700';
            case 'LOW':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'HIGH':
                return t('inbox.priority.high');
            case 'MEDIUM':
                return t('inbox.priority.medium');
            case 'LOW':
                return t('inbox.priority.low');
            default:
                return priority;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('inbox.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('inbox.title')}</h2>
                    <p className="text-gray-600 mt-1">
                        {t('inbox.subtitle')}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center space-x-2">
                    <FunnelIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{t('inbox.filters.label')}</span>
                    <div className="flex space-x-2">
                        {filters.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setFilter(f.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f.value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {f.label}
                                {f.count !== undefined && (
                                    <span className="ml-2">({f.count})</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Consultations List */}
            {consultations && consultations.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
                    {consultations.map((consultation) => (
                        <Link
                            key={consultation.id}
                            href={`/inbox/${consultation.id}`}
                            className="block px-6 py-4 hover:bg-gray-50 transition"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {consultation.subject}
                                        </h3>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                                consultation.priority
                                            )}`}
                                        >
                                            {getPriorityLabel(consultation.priority)}
                                        </span>
                                        {consultation.status === 'OPEN' ? (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                {t('inbox.status.open')}
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                {t('inbox.status.resolved')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {consultation.messages?.[0]?.content?.substring(0, 100)}...
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {t('inbox.created_at', { date: new Date(consultation.createdAt).toLocaleDateString() })}
                                    </p>
                                </div>
                                <svg
                                    className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4"
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
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <InboxIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {filter === 'ALL' && t('inbox.no_consultations')}
                        {filter === 'OPEN' && t('inbox.no_open')}
                        {filter === 'RESOLVED' && t('inbox.no_resolved')}
                    </h3>
                    <p className="text-gray-600">
                        {t('inbox.empty_desc')}
                    </p>
                </div>
            )}
        </div>
    );
}
