'use client';

import { useState } from 'react';
import { useScheduledWorkouts } from '@/hooks/use-calendar';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ScheduleSessionModal } from '@/components/schedule-session-modal';
import { WorkoutDetailsModal } from '@/components/workout-details-modal';
import { ScheduledWorkout } from '@/types';
import { Tooltip } from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/use-translation';

export default function CalendarPage() {
    const { t } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    // Details Modal State
    const [selectedWorkout, setSelectedWorkout] = useState<ScheduledWorkout | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const { data: workouts, isLoading } = useScheduledWorkouts(month, year);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleOpenModal = (date?: Date) => {
        setSelectedDate(date || new Date());
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDate(undefined);
    };

    const handleWorkoutClick = (e: React.MouseEvent, workout: ScheduledWorkout) => {
        e.stopPropagation();
        setSelectedWorkout(workout);
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedWorkout(null);
    };

    // Get arrays from translation, fallback to hardcoded if issue (but should work with updated hook/json)
    // Note: t('calendar.months') returns string if not typed properly, but our hook returns string.
    // We need to handle array return from t().
    // Actually, our current translation hook implementation returns string.
    // So distinct keys or JSON.parse if we stored as string? No, standard i18n libs return array.
    // Our custom hook might need adjustment or we can just fetch individual keys if they were indexed.
    // BUT, in dictionaries they are arrays.
    // Let's assume for now we can get the array or we need to change how we access it.
    // Given the hook implementation: `let translation = current as string;`
    // It casts to string. If it's an array it might return "[object Object]" or similar if not handled.
    // Checking hook again: `return translation;`
    // If leaf is array, it returns array. TS return type says string.
    // I should cast it.

    const monthNames = t('calendar.months') as unknown as string[];
    const dayNames = t('calendar.days_short') as unknown as string[];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('calendar.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ScheduleSessionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                preselectedDate={selectedDate}
            />

            <WorkoutDetailsModal
                isOpen={isDetailsOpen}
                onClose={handleCloseDetails}
                workout={selectedWorkout}
            />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('calendar.title')}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {t('calendar.subtitle')}
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    {t('calendar.schedule_session')}
                </button>
            </div>

            {/* Calendar Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                {/* Month Navigation */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-xl">
                    <button
                        onClick={previousMonth}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                        <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {Array.isArray(monthNames) ? monthNames[currentDate.getMonth()] : currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                    </h3>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                        <ChevronRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                    {/* Day Names */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {Array.isArray(dayNames) && dayNames.map((day) => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square"></div>
                        ))}

                        {/* Days of month */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                            // Filter using scheduledFor
                            const dayWorkouts = workouts?.filter(w => w.scheduledFor?.startsWith(dateStr)) || [];

                            const isToday =
                                day === new Date().getDate() &&
                                month === new Date().getMonth() + 1 &&
                                year === new Date().getFullYear();

                            return (
                                <div
                                    key={day}
                                    onClick={() => handleOpenModal(new Date(year, month - 1, day))}
                                    className={`aspect-square border rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-750 transition cursor-pointer flex flex-col relative group ${isToday
                                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                        }`}
                                >
                                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900 dark:text-gray-300'}`}>
                                        {day}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        {dayWorkouts.slice(0, 3).map((workout) => (
                                            <Tooltip
                                                key={workout.id}
                                                content={
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-bold text-blue-400">{workout.clientName || t('calendar.tooltip.client')}</span>
                                                        <span>{workout.planName}</span>
                                                        <span className="text-[10px] opacity-80">{workout.dayName}</span>
                                                    </div>
                                                }
                                            >
                                                <button
                                                    onClick={(e) => handleWorkoutClick(e, workout)}
                                                    className={`w-full text-left text-xs rounded px-1.5 py-1 truncate transition-colors ${workout.completed
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                                        }`}
                                                >
                                                    {new Date(workout.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </button>
                                            </Tooltip>
                                        ))}
                                        {dayWorkouts.length > 3 && (
                                            <div className="text-xs text-gray-400 pl-1">
                                                {t('calendar.tooltip.more', { count: dayWorkouts.length - 3 })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover Add Button */}
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-0.5">
                                            <PlusIcon className="w-3 h-3 text-gray-500" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Upcoming Workouts List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t('calendar.upcoming.title')} ({Array.isArray(monthNames) ? monthNames[currentDate.getMonth()] : ''})
                </h3>
                {workouts && workouts.length > 0 ? (
                    <div className="space-y-3">
                        {workouts.slice(0, 5).map((workout) => (
                            <div
                                key={workout.id}
                                onClick={(e) => handleWorkoutClick(e, workout)}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                            >
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {t('calendar.upcoming.session_type')}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(workout.scheduledFor).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${workout.completed
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>
                                    {workout.completed ? t('calendar.status.completed') : t('calendar.status.pending')}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        {t('calendar.upcoming.empty')}
                    </p>
                )}
            </div>
        </div>
    );
}
