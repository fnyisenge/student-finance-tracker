export const KEY = 'finance:data';

export let records = [];

export let budgetCap = 0;

export function loadState() {
    const saved = localStorage.getItem(KEY);
    records = saved ? JSON.parse(saved) : [];
}

export function saveState() {
    localStorage.setItem(KEY, JSON.stringify(records));
}

export function addRecord(record) {
    records.push(record);
    saveState();
}

export function updateRecord(id, updated) {
    const idx = records.findIndex(r => r.id === id);
    if (idx > -1) {
        records[idx] = { ...records[idx], ...updated, updatedAt: new Date() };
        saveState();
    }
}

export function deleteRecord(id) {
    records = records.filter(r => r.id !== id);
    saveState();
}
