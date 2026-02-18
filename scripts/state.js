import { load, save } from './storage.js';

export let records = load();

export const addRecord = (record) => {
    records.push(record);
    save(records);
};

export const updateRecord = (id, updated) => {
    records = records.map(r => r.id === id ? { ...r, ...updated } : r);
    save(records);
};

export const deleteRecord = (id) => {
    records = records.filter(r => r.id !== id);
    save(records);
};
