'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    PlusIcon,
    TrashIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Trainer {
    id: string;
    email: string;
    name?: string;
    role: string;
    createdAt: string;
}

const createTrainerSchema = z.object({
    email: z.string().email('Email inválido'),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
});

const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
});

type CreateTrainerForm = z.infer<typeof createTrainerSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function TrainersPage() {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [resetPasswordTrainerId, setResetPasswordTrainerId] = useState<string | null>(null);

    // Forms
    const {
        register: registerCreate,
        handleSubmit: handleSubmitCreate,
        reset: resetCreate,
        formState: { errors: errorsCreate, isSubmitting: isSubmittingCreate },
    } = useForm<CreateTrainerForm>({ resolver: zodResolver(createTrainerSchema) });

    const {
        register: registerReset,
        handleSubmit: handleSubmitReset,
        reset: resetResetForm,
        formState: { errors: errorsReset, isSubmitting: isSubmittingReset },
    } = useForm<ResetPasswordForm>({ resolver: zodResolver(resetPasswordSchema) });

    const fetchTrainers = async () => {
        try {
            const res = await api.get<Trainer[]>('/admin/trainers');
            setTrainers(res.data);
        } catch (error) {
            console.error('Error fetching trainers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    const onCreateTrainer = async (data: CreateTrainerForm) => {
        try {
            await api.post('/admin/trainers', data);
            setIsCreateModalOpen(false);
            resetCreate();
            fetchTrainers();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al crear entrenador');
        }
    };

    const onDeleteTrainer = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este entrenador? Esta acción no se puede deshacer.')) return;
        try {
            await api.delete(`/admin/trainers/${id}`);
            fetchTrainers();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al eliminar entrenador');
        }
    };

    const onResetPassword = async (data: ResetPasswordForm) => {
        if (!resetPasswordTrainerId) return;
        try {
            await api.post(`/admin/trainers/${resetPasswordTrainerId}/reset-password`, data);
            setResetPasswordTrainerId(null);
            resetResetForm();
            alert('Contraseña restablecida correctamente');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al restablecer contraseña');
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Cargando entrenadores...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Entrenadores</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nuevo Entrenador
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Registro</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {trainers.map((trainer) => (
                            <tr key={trainer.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    <div className="font-medium">{trainer.name || trainer.email.split('@')[0]}</div>
                                    <div className="text-xs text-gray-500">{trainer.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(trainer.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => setResetPasswordTrainerId(trainer.id)}
                                        className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400 mr-4"
                                        title="Restablecer Contraseña"
                                    >
                                        <ArrowPathIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteTrainer(trainer.id)}
                                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                        title="Eliminar"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {trainers.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    No hay entrenadores registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4 dark:text-white">Nuevo Entrenador</h2>
                        <form onSubmit={handleSubmitCreate(onCreateTrainer)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    {...registerCreate('email')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                                {errorsCreate.email && <p className="text-red-500 text-xs mt-1">{errorsCreate.email.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                                <input
                                    type="text"
                                    {...registerCreate('name')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                                {errorsCreate.name && <p className="text-red-500 text-xs mt-1">{errorsCreate.name.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                                <input
                                    type="password"
                                    {...registerCreate('password')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                                {errorsCreate.password && <p className="text-red-500 text-xs mt-1">{errorsCreate.password.message}</p>}
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingCreate}
                                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    {isSubmittingCreate ? 'Creando...' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {resetPasswordTrainerId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
                        <div className="flex items-center mb-4 text-amber-600">
                            <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                            <h2 className="text-lg font-bold dark:text-white">Restablecer Contraseña</h2>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Ingresa la nueva contraseña para el entrenador.
                        </p>
                        <form onSubmit={handleSubmitReset(onResetPassword)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    {...registerReset('newPassword')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                                {errorsReset.newPassword && <p className="text-red-500 text-xs mt-1">{errorsReset.newPassword.message}</p>}
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResetPasswordTrainerId(null);
                                        resetResetForm();
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingReset}
                                    className="px-4 py-2 bg-amber-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-amber-700"
                                >
                                    {isSubmittingReset ? 'Guardando...' : 'Restablecer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
