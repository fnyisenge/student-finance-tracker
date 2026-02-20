import { load, save } from './storage.js';
import { renderRecords, renderStats } from './ui.js';
import { validateRecord } from './validators.js';

let records = load();
if (!records || records.length === 0) {
    records = [
        { id: 'txn_1', description: 'Lunch at cafeteria', amount: 12.50, category: 'Food', date: '2025-09-25', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'txn_2', description: 'Chemistry textbook', amount: 89.99, category: 'Books', date: '2025-09-23', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'txn_3', description: 'Bus pass', amount: 45.00, category: 'Transport', date: '2025-09-20', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'txn_4', description: 'Coffee with friends', amount: 8.75, category: 'Entertainment', date: '2025-09-28', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
    save(records);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('record-form');
    const status = document.getElementById('status');
    const searchInput = document.getElementById('searchInput');
    const budgetInput = document.getElementById('budgetCap');
    let budgetCap = parseFloat(localStorage.getItem('budgetCap') || 0);
    if (budgetCap) budgetInput.value = budgetCap;

    const updateUI = () => {
        renderRecords(records, editRecord, deleteRecord);
        renderStats(records);
    };

    const editRecord = (idx) => {
        const r = records[idx];
        form.description.value = r.description;
        form.amount.value = r.amount;
        form.category.value = r.category;
        form.date.value = r.date;
        form.dataset.editIndex = idx;
    };

    const deleteRecord = (idx) => {
        if (confirm('Delete this record?')) {
            records.splice(idx, 1);
            save(records);
            updateUI();
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newRecord = {
            id: 'txn_' + Date.now(),
            description: form.description.value.trim(),
            amount: parseFloat(form.amount.value),
            category: form.category.value.trim(),
            date: form.date.value,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const validation = validateRecord(newRecord);
        if (!validation.valid) { status.textContent = validation.message; return; }
        if (form.dataset.editIndex !== undefined) {
            const idx = form.dataset.editIndex;
            records[idx] = { ...records[idx], ...newRecord, updatedAt: new Date().toISOString() };
            delete form.dataset.editIndex;
        } else {
            records.push(newRecord);
        }
        save(records);
        form.reset();
        updateUI();
    });

    searchInput.addEventListener('input', () => {
        const pattern = searchInput.value;
        let re = null;
        try { re = new RegExp(pattern, 'i'); } catch { return; }
        const filtered = records.filter(r => re.test(r.description) || re.test(r.category));
        renderRecords(filtered, editRecord, deleteRecord);
    });

    budgetInput.addEventListener('change', () => {
        budgetCap = parseFloat(budgetInput.value) || 0;
        localStorage.setItem('budgetCap', budgetCap);
        updateUI();
    });

    updateUI();
});