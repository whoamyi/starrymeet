import { format, formatDistance, parseISO } from 'date-fns';

export const formatDate = (dateString: string, formatStr: string = 'MMM d, yyyy'): string => {
  try {
    return format(parseISO(dateString), formatStr);
  } catch {
    return dateString;
  }
};

export const formatTime = (timeString: string): string => {
  try {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch {
    return timeString;
  }
};

export const timeAgo = (dateString: string): string => {
  try {
    return formatDistance(parseISO(dateString), new Date(), { addSuffix: true });
  } catch {
    return 'some time ago';
  }
};

export const formatDateTime = (date: string, time: string): string => {
  return `${formatDate(date, 'EEE, MMM d')} at ${formatTime(time)}`;
};
