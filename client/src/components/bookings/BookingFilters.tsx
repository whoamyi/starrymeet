import type { Booking } from '@/types';

interface BookingFiltersProps {
  selectedStatus: Booking['status'] | 'all';
  onStatusChange: (status: Booking['status'] | 'all') => void;
}

export const BookingFilters = ({ selectedStatus, onStatusChange }: BookingFiltersProps) => {
  const filters: Array<{ value: Booking['status'] | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onStatusChange(filter.value)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
            selectedStatus === filter.value
              ? 'bg-[rgba(255, 255, 255, 0.8)] text-black font-semibold'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
