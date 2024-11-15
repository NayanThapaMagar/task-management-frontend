export const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
    switch (priority) {
        case 'high':
            return '#ff0000';
        case 'medium':
            return '#ffa500';
        case 'low':
            return '#00b300';
    }
};