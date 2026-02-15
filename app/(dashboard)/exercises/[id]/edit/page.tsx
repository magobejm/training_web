'use client';

import ExerciseForm from '@/components/exercises/exercise-form';
import { useExercise } from '@/hooks/use-exercises';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function EditExercisePage() {
    const params = useParams();
    const id = params.id as string;
    const { data: exercise, isLoading } = useExercise(id);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Cargando ejercicio...</div>;
    }

    if (!exercise) {
        return <div className="p-8 text-center text-red-500">Ejercicio no encontrado</div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link
                href="/exercises"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Volver a Ejercicios
            </Link>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Ejercicio</h1>
                <ExerciseForm initialData={exercise} isEditing />
            </div>
        </div>
    );
}
