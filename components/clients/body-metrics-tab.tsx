'use client';

import { useState } from 'react';
import { useBodyMetrics } from '@/hooks/use-body-metrics';
import { useTranslation } from '@/hooks/use-translation';
import { PlusIcon } from '@heroicons/react/24/outline';
import LogMetricModal from './log-metric-modal';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { BodyMetric } from '@/types';

interface BodyMetricsTabProps {
    clientId: string;
}

export default function BodyMetricsTab({ clientId }: BodyMetricsTabProps) {
    const { t, language } = useTranslation();
    const { data, isLoading } = useBodyMetrics(clientId);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const dateLocale = language === 'es' ? es : enUS;

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const metrics = data?.metrics || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">{t('clients.metrics.title')}</h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    {t('clients.metrics.log_button')}
                </button>
            </div>

            {metrics.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <p className="text-gray-500">{t('clients.metrics.empty')}</p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {metrics.map((metric: BodyMetric) => (
                            <li key={metric.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium text-blue-600 truncate">
                                            {format(new Date(metric.loggedAt), 'PPP', { locale: dateLocale })}
                                        </p>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                                            <span>
                                                <span className="font-semibold">{t('clients.metrics.form.weight')}:</span> {metric.weight} kg
                                            </span>
                                            {metric.bodyFat && (
                                                <span>
                                                    <span className="font-semibold">{t('clients.metrics.form.bodyFat')}:</span> {metric.bodyFat}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-gray-600">
                                        {metric.waist && (
                                            <div>
                                                <span className="font-medium">{t('clients.metrics.form.waist')}:</span> {metric.waist} cm
                                            </div>
                                        )}
                                        {metric.hips && (
                                            <div>
                                                <span className="font-medium">{t('clients.metrics.form.hips')}:</span> {metric.hips} cm
                                            </div>
                                        )}
                                        {metric.chest && (
                                            <div>
                                                <span className="font-medium">{t('clients.metrics.form.chest')}:</span> {metric.chest} cm
                                            </div>
                                        )}
                                        {metric.arm && (
                                            <div>
                                                <span className="font-medium">{t('clients.metrics.form.arm')}:</span> {metric.arm} cm
                                            </div>
                                        )}
                                        {metric.leg && (
                                            <div>
                                                <span className="font-medium">{t('clients.metrics.form.leg')}:</span> {metric.leg} cm
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {metric.notes && (
                                    <div className="mt-2 text-sm text-gray-600 italic border-t border-gray-50 pt-2">
                                        {metric.notes}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <LogMetricModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                clientId={clientId}
            />
        </div>
    );
}
