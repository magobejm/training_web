'use client';

import { useState } from 'react';
import { useClient, useDeleteClient } from '@/hooks/use-clients';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    CalendarIcon,
    ChartBarIcon,
    ClipboardDocumentListIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

import AssignPlanModal from '@/components/clients/assign-plan-modal';
import EditProfileModal from '@/components/clients/edit-profile-modal';
import Avatar from '@/components/ui/avatar';
import { useTranslation } from '@/hooks/use-translation';

export default function ClientProfilePage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params.id as string;
    const { data: clientData, isLoading, error } = useClient(clientId);
    const deleteClient = useDeleteClient();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedModal, setSelectedModal] = useState<'assign-plan' | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { t } = useTranslation();

    const handleDelete = async () => {
        try {
            await deleteClient.mutateAsync(clientId);
            router.push('/clients');
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('clients.profile.loading')}</p>
                </div>
            </div>
        );
    }

    if (error || !clientData) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{t('clients.profile.error')}</p>
            </div>
        );
    }

    const client = clientData as import('@/types').User;

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/clients"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                {t('clients.profile.back')}
            </Link>

            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                <div className="px-6 pb-6">
                    <div className="flex justify-between items-end">
                        <div className="flex items-end -mt-12 mb-4">
                            <Avatar id={client.id} name={client.name || client.email} size="xl" src={client.avatarUrl} className="border-4 border-white" />
                        </div>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                        >
                            {t('clients.profile.edit_button')}
                        </button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{client.name || client.email}</h1>
                        <p className="text-gray-600">{client.email}</p>
                        <p className="text-xs text-gray-500 mt-1">{t('clients.profile.since')} {new Date(client.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-2">
                        <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="font-medium text-gray-900">{t('clients.profile.plan_title')}</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-600">{t('clients.profile.plan_subtitle')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-2">
                        <CalendarIcon className="h-5 w-5 text-green-600 mr-2" />
                        <h3 className="font-medium text-gray-900">{t('clients.profile.sessions_title')}</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-600">{t('clients.profile.sessions_subtitle')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-2">
                        <ChartBarIcon className="h-5 w-5 text-purple-600 mr-2" />
                        <h3 className="font-medium text-gray-900">{t('clients.profile.progress_title')}</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">-</p>
                    <p className="text-sm text-gray-600">{t('clients.profile.progress_subtitle')}</p>
                </div>
            </div>

            {/* Physical Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('clients.profile.physical_stats')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">{t('clients.edit.gender')}</p>
                        <p className="font-medium text-gray-900">{client.gender ? t(`common.gender.${client.gender.toLowerCase()}`) : '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">{t('clients.edit.birthDate')}</p>
                        <p className="font-medium text-gray-900">{client.birthDate ? new Date(client.birthDate).toLocaleDateString() : '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">{t('clients.edit.height')}</p>
                        <p className="font-medium text-gray-900">{client.height ? `${client.height} cm` : '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">{t('clients.edit.weight')}</p>
                        <p className="font-medium text-gray-900">{client.weight ? `${client.weight} kg` : '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">{t('clients.edit.maxHeartRate')}</p>
                        <p className="font-medium text-gray-900">{client.maxHeartRate ? `${client.maxHeartRate} bpm` : '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">{t('clients.edit.restingHeartRate')}</p>
                        <p className="font-medium text-gray-900">{client.restingHeartRate ? `${client.restingHeartRate} bpm` : '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">{t('clients.edit.leanMass')}</p>
                        <p className="font-medium text-gray-900">{client.leanMass ? `${client.leanMass}%` : '-'}</p>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button className="px-6 py-4 border-b-2 border-blue-600 text-sm font-medium text-blue-600">
                            {t('clients.profile.tabs.current_plan')}
                        </button>
                        <button className="px-6 py-4 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
                            {t('clients.profile.tabs.history')}
                        </button>
                        <button className="px-6 py-4 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
                            {t('clients.profile.tabs.metrics')}
                        </button>
                        <button className="px-6 py-4 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
                            {t('clients.profile.tabs.photos')}
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {client.activePlan ? (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{client.activePlan.name}</h3>
                                    {client.activePlan.description && (
                                        <p className="text-gray-600 mb-4">{client.activePlan.description}</p>
                                    )}
                                    <div className="flex gap-3">
                                        <Link
                                            href={`/training-plans/${client.activePlan.id}`}
                                            className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-50"
                                        >
                                            {t('clients.profile.view_details')}
                                        </Link>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedModal('assign-plan')}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    {t('clients.assign_plan.change_plan')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <ClipboardDocumentListIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {t('clients.assign_plan.no_plan_title')}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {t('clients.assign_plan.no_plan_desc')}
                            </p>
                            <button
                                onClick={() => setSelectedModal('assign-plan')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                {t('clients.assign_plan.assign_plan')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <AssignPlanModal
                isOpen={selectedModal === 'assign-plan'}
                onClose={() => setSelectedModal(null)}
                clientId={clientId}
                currentPlanId={client.activePlan?.id}
            />

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                client={client}
            />

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-red-200">
                <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                    <h3 className="text-lg font-semibold text-red-900">{t('clients.profile.danger_zone')}</h3>
                </div>
                <div className="px-6 py-4">
                    <p className="text-sm text-gray-600 mb-4">
                        {t('clients.profile.danger_desc')}
                    </p>
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            <TrashIcon className="h-5 w-5 mr-2" />
                            {t('clients.profile.delete_client')}
                        </button>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <p className="text-sm font-medium text-red-600">{t('clients.profile.confirm_delete')}</p>
                            <button
                                onClick={handleDelete}
                                disabled={deleteClient.isPending}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {deleteClient.isPending ? t('clients.profile.deleting') : t('clients.profile.confirm_yes')}
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
