'use client';

import { useState } from 'react';
import { useCoachNotes, useCreateCoachNote, useUpdateCoachNote, useDeleteCoachNote } from '@/hooks/use-coach-notes';
import { useTranslation } from '@/hooks/use-translation';
import { useAuthStore } from '@/stores/auth-store';
import { TrashIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { toast } from 'sonner';

interface CoachNotesSectionProps {
    clientId: string;
}

export default function CoachNotesSection({ clientId }: CoachNotesSectionProps) {
    const { t, language } = useTranslation();
    const { user } = useAuthStore();
    const { data: notes, isLoading } = useCoachNotes(clientId);
    const createNote = useCreateCoachNote();
    const updateNote = useUpdateCoachNote();
    const deleteNote = useDeleteCoachNote();

    const [newNoteContent, setNewNoteContent] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');

    const dateLocale = language === 'es' ? es : enUS;

    const handleAddNote = async () => {
        if (!newNoteContent.trim()) return;
        try {
            await createNote.mutateAsync({ clientId, content: newNoteContent });
            setNewNoteContent('');
            toast.success(t('clients.coach_notes.success_add'));
        } catch (error) {
            toast.error(t('common.error'));
        }
    };

    const handleUpdateNote = async (id: string) => {
        if (!editingContent.trim()) return;
        try {
            await updateNote.mutateAsync({ id, content: editingContent, clientId });
            setEditingId(null);
            toast.success(t('clients.coach_notes.success_update'));
        } catch (error) {
            toast.error(t('common.error'));
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!confirm(t('clients.coach_notes.confirm_delete'))) return;
        try {
            await deleteNote.mutateAsync({ id, clientId });
            toast.success(t('clients.coach_notes.success_delete'));
        } catch (error) {
            toast.error(t('common.error'));
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">{t('clients.coach_notes.title')}</h3>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder={t('clients.coach_notes.placeholder')}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <div className="mt-2 flex justify-end">
                    <button
                        onClick={handleAddNote}
                        disabled={!newNoteContent.trim() || createNote.isPending}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                        {t('clients.coach_notes.add_button')}
                    </button>
                </div>
            </div>

            {notes?.length === 0 ? (
                <p className="text-center text-gray-500 py-8">{t('clients.coach_notes.empty')}</p>
            ) : (
                <div className="space-y-4">
                    {notes?.map((note) => (
                        <div key={note.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-sm text-gray-900">
                                        {note.author?.name || t('clients.coach_notes.author_trainer')}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {format(new Date(note.createdAt), 'PPp', { locale: dateLocale })}
                                    </span>
                                </div>
                                {note.authorId === user?.id && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingId(note.id);
                                                setEditingContent(note.content);
                                            }}
                                            className="text-gray-400 hover:text-blue-600"
                                        >
                                            <PencilSquareIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteNote(note.id)}
                                            className="text-gray-400 hover:text-red-600"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {editingId === note.id ? (
                                <div className="space-y-2">
                                    <textarea
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                        rows={3}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="inline-flex items-center p-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleUpdateNote(note.id)}
                                            className="inline-flex items-center p-1 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
