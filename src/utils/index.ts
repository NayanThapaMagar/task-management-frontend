import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const timeAgo = (date: Date): string => {
    return dayjs(date).fromNow();
};

export const formatDateTime = (createdAt: Date): string => {
    return dayjs(createdAt).format("MMMM D, YYYY [at] h:mm A");
};

export const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.map((n) => n[0].toUpperCase()).join('');
};