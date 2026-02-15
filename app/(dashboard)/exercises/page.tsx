'use client';

import { useState } from 'react';
import { useExercises, useDeleteExercise } from '@/hooks/use-exercises';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from '@/hooks/use-translation';

export default function ExercisesPage() {
    const { data: exercises, isLoading, error } = useExercises();
    const deleteExercise = useDeleteExercise();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
    const { t } = useTranslation();

    const filteredExercises = exercises?.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Grouping logic
    const groupedExercises = filteredExercises?.reduce((acc, exercise) => {
        const group = exercise.muscleGroup || t('exercises.groups.others');
        if (!acc[group]) acc[group] = [];
        acc[group].push(exercise);
        return acc;
    }, {} as Record<string, any[]>);

    const [collapsedGroups, setCollapsedGroups] = useState<string[]>(() =>
        groupedExercises ? Object.keys(groupedExercises) : []
    );

    const toggleGroup = (group: string) => {
        setCollapsedGroups(prev =>
            prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
        );
    };

    const handleDelete = async () => {
        if (!exerciseToDelete) return;
        try {
            await deleteExercise.mutateAsync(exerciseToDelete);
            toast.success(t('exercises.delete_success'));
        } catch (error: any) {
            const message = error.response?.data?.message || t('exercises.delete_error');
            toast.error(message);
            console.error(error);
        } finally {
            setExerciseToDelete(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('exercises.loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{t('exercises.error')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 max-w-lg">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('exercises.search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <button
                    onClick={() => router.push('/exercises/new')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    {t('exercises.new_exercise')}
                </button>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm text-gray-600">
                    {t('exercises.showing', { shown: filteredExercises?.length || 0, total: exercises?.length || 0 })}
                </p>
            </div>

            {/* Exercise Grouping */}
            <div className="space-y-4">
                {Object.entries(groupedExercises || {}).map(([muscleGroup, groupExercises]) => {
                    const isCollapsed = collapsedGroups.includes(muscleGroup);
                    return (
                        <div key={muscleGroup} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <button
                                onClick={() => toggleGroup(muscleGroup)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">
                                        {t(`exercises.muscles.${muscleGroup}`)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {t('exercises.groups.count', { count: groupExercises.length })}
                                    </span>
                                </div>
                                <div className="text-gray-400">
                                    {isCollapsed ? (
                                        <ChevronDownIcon className="h-5 w-5" />
                                    ) : (
                                        <ChevronUpIcon className="h-5 w-5" />
                                    )}
                                </div>
                            </button>

                            {!isCollapsed && (
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-gray-100">
                                    {(groupExercises || []).map((exercise) => (
                                        <div
                                            key={exercise.id}
                                            className="bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition overflow-hidden flex flex-col"
                                        >
                                            {/* Media Preview */}
                                            <div className="h-40 bg-gray-200 relative group">
                                                {exercise.defaultImageUrl ? (
                                                    <img
                                                        src={exercise.defaultImageUrl}
                                                        alt={exercise.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : exercise.defaultVideoUrl?.includes('youtube.com') ? (
                                                    <div className="w-full h-full bg-black flex items-center justify-center">
                                                        <AcademicCapIcon className="h-12 w-12 text-white/50" />
                                                        <span className="absolute bottom-2 right-2 text-[10px] bg-red-600 text-white px-1 rounded">{t('exercises.video_label')}</span>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                                        <img
                                                            src="/images/placeholders/exercise-placeholder.jpg"
                                                            alt="GYM"
                                                            className="w-full h-full object-cover opacity-30 grayscale"
                                                        />
                                                        <span className="absolute font-bold text-blue-900/20">{t(`exercises.muscles.${exercise.muscleGroup}`)}</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                    <button
                                                        onClick={() => router.push(`/exercises/${exercise.id}`)}
                                                        className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-bold shadow-lg"
                                                    >
                                                        {t('exercises.view_details')}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <h4 className="font-bold text-gray-900 mb-1 truncate">{exercise.name}</h4>
                                                <p className="text-xs text-gray-500 line-clamp-2 h-8">{exercise.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {(!groupedExercises || Object.keys(groupedExercises).length === 0) && (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {t('exercises.no_exercises')}
                    </h3>
                    <p className="text-gray-600">
                        {t('exercises.empty_search')}
                    </p>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!exerciseToDelete} onOpenChange={() => setExerciseToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('exercises.details.confirm_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('exercises.details.delete_confirm_desc')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {t('common.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
