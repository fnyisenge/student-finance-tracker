export const renderRecords = (records, editFn, deleteFn) => {
    const container = document.getElementById('records-container');
    container.innerHTML = '';

    if (records.length === 0) {
        container.innerHTML = '<p>No records yet.</p>';
        return;
    }

    const table = document.createElement('table');
    table.classList.add('records-table');

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    records.forEach((r, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r.description}</td>
            <td>${r.amount.toFixed(2)}</td>
            <td>${r.category}</td>
            <td>${r.date}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        tr.querySelector('.edit-btn').addEventListener('click', () => editFn(idx));
        tr.querySelector('.delete-btn').addEventListener('click', () => deleteFn(idx));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);
};

export const renderStats = (records) => {
    const statsContainer = document.getElementById('stats');
    statsContainer.innerHTML = '';

    if (records.length === 0) {
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

    const budgetCap = parseFloat(document.getElementById('budgetCap').value || 0);
    const budgetUsedPercent = budgetCap > 0 ? ((totalAmount / budgetCap) * 100).toFixed(2) : 'N/A';

    const statsHTML = `
        <div class="stats-card">
            <p><strong>Total Records:</strong> ${totalRecords}</p>
            <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
            <p><strong>Average Spending:</strong> $${avgSpending}</p>
            <p><strong>Top Category:</strong> ${topCategory}</p>
            <p><strong>Budget Used:</strong> ${budgetUsedPercent === 'N/A' ? 'No budget set' : budgetUsedPercent + '%'}</p>
        </div>
    `;
    statsContainer.innerHTML = statsHTML;
};
