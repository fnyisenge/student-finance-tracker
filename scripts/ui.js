import { state } from './state.js';
import { highlight } from './search.js';

const container = document.getElementById('records-container');

export const renderRecords = (records, searchRegex = null) => {
    if (!container) return;
    container.innerHTML = '';

    if (records.length === 0) {
        container.innerHTML = '<p>No records yet.</p>';
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
            </tr>
        </thead>
        <tbody>
            ${records.map(r => `
                <tr>
                    <td>${highlight(r.description, searchRegex)}</td>
                    <td>${r.amount}</td>
                    <td>${r.category}</td>
                    <td>${r.date}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    container.appendChild(table);
};
