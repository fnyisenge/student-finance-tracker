import { load, save } from './storage.js';
export let records = load();
export const updateRecords = (newRecords) => {
    records = newRecords;
    save(records);
};
