export function renderRecords(records, onEdit, onDelete) {
    const container = document.getElementById('records');
    if (!container) return;
    if (records.length === 0) {
        container.innerHTML = "<p>No records found.</p>";
        return;
    }
    const table = document.createElement('table');
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "15px";
    table.style.fontSize = "15px";
    table.innerHTML = `
        <thead>
            <tr style="background:#f2f2f2;">
                <th style="padding:12px;border:1px solid #ddd;">Description</th>
                <th style="padding:12px;border:1px solid #ddd;">Amount</th>
                <th style="padding:12px;border:1px solid #ddd;">Category</th>
                <th style="padding:12px;border:1px solid #ddd;">Date</th>
                <th style="padding:12px;border:1px solid #ddd;">Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');
    records.forEach((r, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding:12px;border:1px solid #ddd;">${r.description}</td>
            <td style="padding:12px;border:1px solid #ddd;">$${r.amount.toFixed(2)}</td>
            <td style="padding:12px;border:1px solid #ddd;">${r.category}</td>
            <td style="padding:12px;border:1px solid #ddd;">${r.date}</td>
            <td style="padding:12px;border:1px solid #ddd;">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        row.querySelector('.edit-btn').addEventListener('click', () => { onEdit(index); });
        row.querySelector('.delete-btn').addEventListener('click', () => { onDelete(index); });
        tbody.appendChild(row);
    });
    container.innerHTML = "";
    container.appendChild(table);
}

export function renderStats(records) {
    const stats = document.getElementById('stats');
    stats.innerHTML = '';
    if (records.length === 0) {
        stats.innerHTML = '<p>No records yet.</p>';
        return;
    }

    const totalRecords = records.length;
    const totalAmount = records.reduce((sum, r) => sum + parseFloat(r.amount), 0);
    const categoryTotals = {};
    records.forEach(r => {
        categoryTotals[r.category] = (categoryTotals[r.category] || 0) + parseFloat(r.amount);
    });
    const topCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);

    const budgetCap = parseFloat(document.getElementById('budgetCap').value || 0);
    const budgetPercent = budgetCap ? ((totalAmount / budgetCap) * 100).toFixed(2) : 0;

    const last7Days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(day.getDate() - i);
        const dayStr = day.toISOString().split('T')[0];
        const dayTotal = records
            .filter(r => r.date === dayStr)
            .reduce((sum, r) => sum + parseFloat(r.amount), 0);
        last7Days.push({ date: dayStr, amount: dayTotal });
    }

    stats.innerHTML = `
        <div style="margin-bottom:10px;">
            <p><strong>Total Records:</strong> ${totalRecords}</p>
            <p><strong>Total Spending:</strong> $${totalAmount.toFixed(2)}</p>
            <p><strong>Top Category:</strong> ${topCategory}</p>
            <p><strong>Budget Used:</strong> ${budgetCap ? budgetPercent + '%' : 'No budget set'}</p>
        </div>
        <canvas id="trendChart" style="width:100%;max-width:500px;height:150px;"></canvas>
    `;

    const ctx = document.getElementById('trendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days.map(d => d.date),
            datasets: [{
                label: 'Spending Last 7 Days',
                data: last7Days.map(d => d.amount),
                borderColor: '#6a1b9a',
                backgroundColor: 'rgba(106,27,154,0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true },
                x: { ticks: { maxRotation: 90, minRotation: 45 } }
            }
        }
    });
}