import { records, loadState, saveState, addRecord, updateRecord, deleteRecord, KEY } from './state.js';

loadState();
renderRecords();
renderStats();

const form = document.getElementById('record-form');
const recordsContainer = document.getElementById('records-container');
const searchInput = document.createElement('input');
searchInput.placeholder = 'Search regex';
recordsContainer.before(searchInput);
const status = document.getElementById('status');

form.addEventListener('submit', e => {
    e.preventDefault();
    const id = 'rec_' + Date.now();
    const description = form.description.value.trim();
    const amount = parseFloat(form.amount.value);
    const category = form.category.value.trim();
    const date = form.date.value;

    if (!description || !amount || !category || !date) return;

    addRecord({
        id, description, amount, category, date,
        createdAt: new Date(), updatedAt: new Date()
    });

    form.reset();
    renderRecords();
    renderStats();
    status.textContent = 'Record added';
});

searchInput.addEventListener('input', () => {
    const pattern = searchInput.value;
    let re;
    try {
        re = new RegExp(pattern, 'i');
    } catch {
        re = null;
    }
    renderRecords(re);
});

function renderRecords(regex = null) {
    recordsContainer.innerHTML = '';
    records.forEach(r => {
        let description = r.description;
        if (regex) {
            description = description.replace(regex, m => `<mark>${m}</mark>`);
        }
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${description}</strong> |
            ${r.amount.toFixed(2)} |
            ${r.category} |
            ${r.date}
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        `;
        const editBtn = div.querySelector('.edit');
        const deleteBtn = div.querySelector('.delete');

        editBtn.addEventListener('click', () => {
            form.description.value = r.description;
            form.amount.value = r.amount;
            form.category.value = r.category;
            form.date.value = r.date;
            deleteRecord(r.id);
            renderRecords();
            renderStats();
        });

        deleteBtn.addEventListener('click', () => {
            if (confirm('Delete this record?')) {
                deleteRecord(r.id);
                renderRecords();
                renderStats();
            }
        });

        recordsContainer.appendChild(div);
    });
}

function renderStats() {
    const statsDiv = document.getElementById('stats');
    const total = records.reduce((sum, r) => sum + r.amount, 0);
    const categoryCounts = {};
    records.forEach(r => categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1);
    const topCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b, '');

    let remaining = budgetCap - total;
    let message = budgetCap ? 
        (remaining >= 0 ? `Remaining budget: ${remaining.toFixed(2)}` : `Over budget by ${Math.abs(remaining).toFixed(2)}`) 
        : '';

    statsDiv.innerHTML = `
        Total Records: ${records.length} <br>
        Total Amount: ${total.toFixed(2)} <br>
        Top Category: ${topCategory || '-'} <br>
        ${message}
    `;
    if (budgetCap) {
        status.textContent = message;
    }
}

document.getElementById('budgetCap')?.addEventListener('input', e => {
    budgetCap = parseFloat(e.target.value) || 0;
    renderStats();
});
