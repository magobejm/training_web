'use client';

import { useState } from 'react';
import { useExercise, useDeleteExercise } from '@/hooks/use-exercises';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, TrashIcon, VideoCameraIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

export default function ExerciseDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const exerciseId = params.id as string;
    const { data: exercise, isLoading, error } = useExercise(exerciseId);
    const { mutateAsync: deleteExercise, isPending: isDeleting } = useDeleteExercise();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { t } = useTranslation();

    const handleDelete = async () => {
        try {
            await deleteExercise(exerciseId);
            toast.success(t('exercises.delete_success'));
            router.push('/exercises');
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('exercises.delete_error'));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('exercises.details.loading')}</p>
                </div>
            </div>
        );
    }

    if (error || !exercise) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{t('exercises.details.error')}</p>
            </div>
        );
    }

    // Helper to get YouTube ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = exercise.defaultVideoUrl ? getYouTubeId(exercise.defaultVideoUrl) : null;

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/exercises"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                {t('exercises.details.back')}
            </Link>

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Media Section */}
                        <div className="w-full md:w-1/2 space-y-4">
                            {youtubeId ? (
                                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${youtubeId}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : exercise.defaultImageUrl ? (
                                <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 shadow-lg">
                                    <img
                                        src={exercise.defaultImageUrl}
                                        alt={exercise.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video w-full rounded-xl bg-blue-50 flex items-center justify-center border-2 border-dashed border-blue-200">
                                    <div className="text-center text-blue-300">
                                        <PhotoIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm font-medium">{t('exercises.details.no_preview')}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4">
                                {exercise.defaultVideoUrl && (
                                    <a
                                        href={exercise.defaultVideoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                                    >
                                        <VideoCameraIcon className="h-4 w-4" />
                                        {t('exercises.details.view_original')}
                                    </a>
                                )}
                                <Link
                                    href={`/exercises/${exerciseId}/edit`}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition text-center"
                                >
                                    {t('exercises.details.edit_info')}
                                </Link>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="w-full md:w-1/2 flex flex-col">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{exercise.name}</h1>
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">
                                    {t(`exercises.muscles.${exercise.muscleGroup}`) || exercise.muscleGroup}
                                </span>
                            </div>

                            <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{t('exercises.details.description_title')}</h3>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {exercise.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-red-200">
                <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                    <h3 className="text-lg font-semibold text-red-900">{t('exercises.details.danger_zone')}</h3>
                </div>
                <div className="px-6 py-4">
                    <p className="text-sm text-gray-600 mb-4">
                        {t('exercises.details.danger_desc')}
                    </p>
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            <TrashIcon className="h-5 w-5 mr-2" />
                            {t('exercises.details.delete_button')}
                        </button>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <p className="text-sm font-medium text-red-600">{t('exercises.details.confirm_title')}</p>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {isDeleting ? t('exercises.details.deleting') : t('exercises.details.confirm_yes')}
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
