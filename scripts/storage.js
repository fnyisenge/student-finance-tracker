export const KEY = 'finance:data';

export function load() {
    try {
        const data = localStorage.getItem(KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function save(records) {
    localStorage.setItem(KEY, JSON.stringify(records));
}