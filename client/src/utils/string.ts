export const truncate = (str: string, maxLength: number = 50): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
  const names = name.split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatStatus = (status: string): string => {
  return status
    .replace(/_/g, ' ')
    .split(' ')
    .map(capitalize)
    .join(' ');
};
