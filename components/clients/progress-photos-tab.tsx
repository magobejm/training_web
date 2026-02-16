'use client';

import { useState } from 'react';
import { useProgressPhotos, useUploadPhoto, useDeletePhoto } from '@/hooks/use-body-metrics';
import { useTranslation } from '@/hooks/use-translation';
import { TrashIcon, PlusIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { toast } from 'sonner';
import { ProgressPhoto } from '@/types';

interface ProgressPhotosTabProps {
    clientId: string;
}

export default function ProgressPhotosTab({ clientId }: ProgressPhotosTabProps) {
    const { t, language } = useTranslation();
    const { data, isLoading } = useProgressPhotos(clientId);
    const uploadPhoto = useUploadPhoto();
    const deletePhoto = useDeletePhoto();

    const [isUploading, setIsUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [caption, setCaption] = useState('');

    const dateLocale = language === 'es' ? es : enUS;

    const handleUpload = async () => {
        if (!imageUrl.trim()) return;
        try {
            await uploadPhoto.mutateAsync({ userId: clientId, imageUrl, caption });
            setImageUrl('');
            setCaption('');
            setIsUploading(false);
            toast.success(t('clients.photos.success_upload'));
        } catch (error) {
            toast.error(t('clients.photos.error_upload'));
        }
    };

    const handleDelete = async (photoId: string) => {
        if (!confirm(t('common.confirm_delete'))) return;
        try {
            await deletePhoto.mutateAsync({ photoId, userId: clientId });
            toast.success(t('common.delete_success'));
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

    const photos = data?.photos || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">{t('clients.photos.title')}</h3>
                {!isUploading && (
                    <button
                        onClick={() => setIsUploading(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        {t('clients.photos.upload_button')}
                    </button>
                )}
            </div>

            {isUploading && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('clients.photos.caption_placeholder')}</label>
                        <input
                            type="text"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setIsUploading(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!imageUrl.trim() || uploadPhoto.isPending}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {t('common.save')}
                        </button>
                    </div>
                </div>
            )}

            {photos.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">{t('clients.photos.empty')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photos.map((photo: ProgressPhoto) => (
                        <div key={photo.id} className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <img
                                src={photo.imageUrl}
                                alt={photo.caption || 'Progress Photo'}
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-3">
                                <p className="text-xs text-gray-400">
                                    {format(new Date(photo.loggedAt), 'PPP', { locale: dateLocale })}
                                </p>
                                {photo.caption && (
                                    <p className="mt-1 text-sm font-medium text-gray-900 truncate">
                                        {photo.caption}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => handleDelete(photo.id)}
                                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
