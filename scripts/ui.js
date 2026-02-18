export const renderRecords = (records, onEdit, onDelete) => {
    const container = document.getElementById('records-container');
    container.innerHTML = '';

    if (records.length === 0) {
        container.textContent = 'No records yet.';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
        </thead>
    `;

    const tbody = document.createElement('tbody');

    records.forEach((record, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${record.description}</td>
            <td>${record.amount.toFixed(2)}</td>
            <td>${record.category}</td>
            <td>${record.date}</td>
            <td>
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    table.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = e.target.dataset.index;
            onEdit(idx);
        });
    });

    table.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = e.target.dataset.index;
            onDelete(idx);
        });
    });
};

export const renderStats = (records) => {
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = '';
    const totalRecords = records.length;
    const totalAmount = records.reduce((sum, r) => sum + r.amount, 0);
    const categories = {};
    records.forEach(r => categories[r.category] = (categories[r.category] || 0) + 1);
    let topCategory = Object.keys(categories)[0] || '-';
    let maxCount = categories[topCategory] || 0;
    for (let cat in categories) {
        if (categories[cat] > maxCount) {
            maxCount = categories[cat];
            topCategory = cat;
        }
    }

    statsDiv.innerHTML = `
        <p>Total Records: ${totalRecords}</p>
        <p>Total Amount: ${totalAmount.toFixed(2)}</p>
        <p>Top Category: ${topCategory}</p>
    `;
};
