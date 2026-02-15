'use client';

import ExerciseForm from '@/components/exercises/exercise-form';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';

export default function NewExercisePage() {
    const { t } = useTranslation();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link
                href="/exercises"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                {t('exercises.form.back')}
            </Link>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('exercises.form.create_title')}</h1>
                <ExerciseForm />
            </div>
        </div>
    );
}
