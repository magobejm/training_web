'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCreateExercise, useUpdateExercise } from '@/hooks/use-exercises';
import { Exercise } from '@/types';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';

const createExerciseSchema = (t: (key: string) => string) => z.object({
    name: z.string().min(1, t('exercises.form.validation.name')),
    description: z.string().min(1, t('exercises.form.validation.description')),
    muscleGroup: z.string().min(1, t('exercises.form.validation.muscle')),
    defaultVideoUrl: z.string().trim().url(t('exercises.form.validation.video_url')).optional().or(z.literal('')),
    defaultImageUrl: z.string().trim().url(t('exercises.form.validation.image_url')).optional().or(z.literal('')),
});

type ExerciseFormData = z.infer<ReturnType<typeof createExerciseSchema>>;

const MUSCLE_GROUPS = [
    'PECTORAL', 'DORSAL', 'PIERNA', 'HOMBRO', 'BICEPS', 'TRICEPS',
    'ABDOMINALES', 'LUMBAR', 'CARDIO', 'MOVILIDAD', 'CALENTAMIENTO',
    'CUADRICEPS', 'FEMORAL', 'GLUTEO', 'GEMELO', 'DELTOIDES'
];

interface ExerciseFormProps {
    initialData?: Exercise;
    isEditing?: boolean;
}

export default function ExerciseForm({ initialData, isEditing = false }: ExerciseFormProps) {
    const router = useRouter();
    const createExercise = useCreateExercise();
    const updateExercise = useUpdateExercise();
    const { t } = useTranslation();

    const exerciseSchema = createExerciseSchema(t);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ExerciseFormData>({
        resolver: zodResolver(exerciseSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            muscleGroup: initialData?.muscleGroup || 'PECTORAL',
            defaultVideoUrl: initialData?.defaultVideoUrl || '',
            defaultImageUrl: initialData?.defaultImageUrl || '',
        },
    });

    const onSubmit = async (data: ExerciseFormData) => {
        try {
            // Clean empty strings to null to ensure Prisma clears the fields in the DB
            const payload = {
                ...data,
                defaultVideoUrl: data.defaultVideoUrl?.trim() || null,
                defaultImageUrl: data.defaultImageUrl?.trim() || null,
            };

            if (isEditing && initialData) {
                await updateExercise.mutateAsync({
                    id: initialData.id,
                    data: payload,
                });
                toast.success(t('exercises.form.success_update'));
            } else {
                await createExercise.mutateAsync(payload);
                toast.success(t('exercises.form.success_create'));
            }
            router.push('/exercises');
            router.refresh();
        } catch (error: any) {
            const message = error.response?.data?.message || t('exercises.form.error_save');
            toast.error(message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('exercises.form.name')}
                    </label>
                    <input
                        {...register('name')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('exercises.form.name_placeholder')}
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>

                {/* Muscle Group */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('exercises.form.muscle_group')}
                    </label>
                    <select
                        {...register('muscleGroup')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {MUSCLE_GROUPS.map((group) => (
                            <option key={group} value={group}>
                                {t(`exercises.muscles.${group}`)}
                            </option>
                        ))}
                    </select>
                    {errors.muscleGroup && (
                        <p className="mt-1 text-sm text-red-600">{errors.muscleGroup.message}</p>
                    )}
                </div>

                {/* Description */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('exercises.form.description')}
                    </label>
                    <textarea
                        {...register('description')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('exercises.form.description_placeholder')}
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                </div>

                {/* Video URL */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('exercises.form.video_url')}
                    </label>
                    <input
                        {...register('defaultVideoUrl')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('exercises.form.video_url_placeholder')}
                    />
                    {errors.defaultVideoUrl && (
                        <p className="mt-1 text-sm text-red-600">{errors.defaultVideoUrl.message}</p>
                    )}
                </div>
                {/* Image URL */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('exercises.form.image_url')}
                    </label>
                    <input
                        {...register('defaultImageUrl')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('exercises.form.image_url_placeholder')}
                    />
                    {errors.defaultImageUrl && (
                        <p className="mt-1 text-sm text-red-600">{errors.defaultImageUrl.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                    {t('exercises.form.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                    {isSubmitting ? t('exercises.form.saving') : (isEditing ? t('exercises.form.update') : t('exercises.form.create'))}
                </button>
            </div>
        </form>
    );
}
