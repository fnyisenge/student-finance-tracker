import { load, save, KEY } from './storage.js';
import { renderRecords } from './ui.js';
import { validateRecord } from './validators.js';

let records = load();
if (records.length === 0) {
    records = [
        { id: 'txn_1', description: 'Lunch', amount: 12.50, category: 'Food', date: '2025-09-25', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'txn_2', description: 'Books', amount: 89.99, category: 'Books', date: '2025-09-23', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'txn_3', description: 'Bus Pass', amount: 45.00, category: 'Transport', date: '2025-09-20', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'txn_4', description: 'Coffee', amount: 8.75, category: 'Entertainment', date: '2025-09-28', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'txn_5', description: 'Stationery', amount: 15.30, category: 'Other', date: '2025-09-26', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
    save(records);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('record-form');
    const status = document.getElementById('status');
    const searchInput = document.getElementById('searchInput');
    const statsContainer = document.getElementById('stats');
    const budgetInput = document.getElementById('budgetCap');

    // Load budget cap if stored
    let budgetCap = parseFloat(localStorage.getItem('budgetCap') || 0);
    if (budgetCap) budgetInput.value = budgetCap;

    const renderStats = (records) => {
        if (!records || records.length === 0) {
            statsContainer.innerHTML = '<p>No records yet.</p>';
            return;
        }

        const totalRecords = records.length;
        const totalAmount = records.reduce((sum, r) => sum + parseFloat(r.amount), 0);
        const avgSpending = (totalAmount / totalRecords).toFixed(2);

        const categoryTotals = {};
        records.forEach(r => {
            categoryTotals[r.category] = (categoryTotals[r.category] || 0) + parseFloat(r.amount);
        });
        const topCategory = Object.keys(categoryTotals).reduce((a, b) =>
            categoryTotals[a] > categoryTotals[b] ? a : b
        );

        const budgetUsedPercent = budgetCap > 0 ? ((totalAmount / budgetCap) * 100).toFixed(2) : 'N/A';

        statsContainer.innerHTML = `
            <p><strong>Total Records:</strong> ${totalRecords}</p>
            <p><strong>Total Amount:</strong> ${totalAmount.toFixed(2)}</p>
            <p><strong>Average Spending:</strong> ${avgSpending}</p>
            <p><strong>Top Category:</strong> ${topCategory}</p>
            <p><strong>Budget Used:</strong> ${budgetUsedPercent === 'N/A' ? 'No budget set' : budgetUsedPercent + '%'}</p>
        `;
    };

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
        if (confirm('Are you sure you want to delete this record?')) {
            const removed = records.splice(idx, 1)[0];
            save(records);
            updateUI();
            status.textContent = `Record deleted: ${removed.description}`;
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newRecord = {
            id: 'txn_' + (records.length + 1),
            description: form.description.value.trim(),
            amount: parseFloat(form.amount.value),
            category: form.category.value.trim(),
            date: form.date.value,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const validation = validateRecord(newRecord);
        if (!validation.valid) {
            status.textContent = validation.message;
            return;
        }

        if (form.dataset.editIndex !== undefined) {
            const idx = form.dataset.editIndex;
            records[idx] = { ...records[idx], ...newRecord, updatedAt: new Date().toISOString() };
            delete form.dataset.editIndex;
            status.textContent = `Record updated: ${newRecord.description}`;
        } else {
            records.push(newRecord);
            status.textContent = `Record added: ${newRecord.description}`;
        }

        save(records);
        form.reset();
        updateUI();
    });

    searchInput.addEventListener('input', () => {
        const pattern = searchInput.value;
        let re = null;
        try {
            re = new RegExp(pattern, 'i');
        } catch {
            return;
        }
        const filtered = records.filter(r => re.test(r.description) || re.test(r.category));
        renderRecords(filtered, editRecord, deleteRecord);
    });

    budgetInput.addEventListener('change', (e) => {
        budgetCap = parseFloat(e.target.value) || 0;
        localStorage.setItem('budgetCap', budgetCap);
        renderStats(records);
    });

    updateUI();
});

