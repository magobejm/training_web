'use client';

import { useState } from 'react';
import { useConsultation, useSendMessage, useResolveConsultation } from '@/hooks/use-consultations';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/auth-store';
import { useTranslation } from '@/hooks/use-translation';

export default function ConsultationDetailPage() {
    const { t } = useTranslation();
    const params = useParams();
    const router = useRouter();
    const consultationId = params.id as string;
    const { data: consultation, isLoading } = useConsultation(consultationId);
    const sendMessage = useSendMessage();
    const resolveConsultation = useResolveConsultation();
    const user = useAuthStore((state) => state.user);

    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await sendMessage.mutateAsync({
                consultationId,
                content: newMessage,
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleResolve = async () => {
        try {
            await resolveConsultation.mutateAsync(consultationId);
        } catch (error) {
            console.error('Error resolving consultation:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('inbox.loading_single')}</p>
                </div>
            </div>
        );
    }

    if (!consultation) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{t('inbox.not_found')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/inbox"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                {t('inbox.back')}
            </Link>

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {consultation.subject}
                        </h1>
                        <div className="flex items-center space-x-3">
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${consultation.status === 'OPEN'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                {consultation.status === 'OPEN' ? t('inbox.status.open') : t('inbox.status.resolved')}
                            </span>
                            <span className="text-sm text-gray-600">
                                {t('inbox.created_at', { date: new Date(consultation.createdAt).toLocaleDateString() })}
                            </span>
                        </div>
                    </div>
                    {consultation.status === 'OPEN' && (
                        <button
                            onClick={handleResolve}
                            disabled={resolveConsultation.isPending}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {t('inbox.resolve')}
                        </button>
                    )}
                </div>
            </div>

            {/* Messages Thread */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('inbox.conversation')}</h2>

                {consultation.messages && consultation.messages.length > 0 ? (
                    <div className="space-y-4">
                        {consultation.messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                <div
                                    className={`max-w-lg rounded-lg p-4 ${message.senderId === user?.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                        }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                    <p
                                        className={`text-xs mt-2 ${message.senderId === user?.id
                                            ? 'text-blue-100'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        {new Date(message.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center py-8">
                        {t('inbox.no_messages')}
                    </p>
                )}

                {/* Reply Form */}
                {consultation.status === 'OPEN' && (
                    <form onSubmit={handleSendMessage} className="mt-6">
                        <div className="flex space-x-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={t('inbox.type_message')}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={sendMessage.isPending}
                            />
                            <button
                                type="submit"
                                disabled={sendMessage.isPending || !newMessage.trim()}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 inline-flex items-center"
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
