const categories = ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Travel', 'Savings', 'Debt Repayment', 'Healthcare', 'Transportation', 'Miscellaneous']
const backgroundColors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F','#9B59B6', '#E67E22', '#1ABC9C', '#E74C3C', '#3498DB', '#2ECC71']
const grey = '#D3D3D3'
let expenses;

document.addEventListener('DOMContentLoaded', async () => {

    
    try {
        const budgetResponse = await fetch('/api/monthly-budget');
        
        if (!budgetResponse.ok) {
            throw new Error(`HTTP error! Status: ${budgetResponse.status}`);
        }

        const budgetData = await budgetResponse.json();
        const budgetH2 = document.getElementById('monthlyBudget');
        const monthlyBudget = budgetData.monthlyBudget
        budgetH2.innerHTML = `$${monthlyBudget}`
        
        const response = await fetch('/api/expenses');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        expenses = await response.json();

        const ctx = document.getElementById('expensesChart').getContext('2d');

        const chartData = {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    label: 'Monthly Expenses',
                    data: [],
                    backgroundColor: [],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': $' + context.raw;
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        }

        const labelsReference = chartData.data.labels;
        const dataReference = chartData.data.datasets[0].data;
        const colorReference = chartData.data.datasets[0].backgroundColor;

        // Aggregating expenses by category
        const expenseMap = {};
        let amount = 0;

        expenses.forEach(item => {
            if (expenseMap[item.category]) {
                expenseMap[item.category] += item.amount;
            } else {
                expenseMap[item.category] = item.amount;
            }
            amount += item.amount;
        });

        // Adding data to chart
        Object.keys(expenseMap).forEach((category, index) => {
            labelsReference.push(category);
            dataReference.push(expenseMap[category]);
            colorReference.push(backgroundColors[index % backgroundColors.length]); // Use modulo to avoid out of bounds
        });


        if (amount < monthlyBudget) {
            dataReference.push(monthlyBudget - amount);
            labelsReference.push('Leftover');
            colorReference.push(grey);
            textColor = 'green';
            const totalExpensesAmount = document.getElementById('totalExpensesAmount');
            totalExpensesAmount.innerHTML = `<div style="text-align: center; margin: 5px 0 5px 0; font-size: 1.5rem;">$${parseFloat(amount).toFixed(2)} <span style="color: rgb(93, 93, 93); font-size: 0.9rem;"> / $${parseInt(monthlyBudget)}.00</span></div>`;
        } else {
            const totalExpensesAmount = document.getElementById('totalExpensesAmount');
            totalExpensesAmount.innerHTML = `<div style="text-align: center; margin: 5px 0 5px 0; font-size: 1.5rem; color: red;">$${parseFloat(amount).toFixed(2)}<span style="color: rgb(93, 93, 93); font-size: 0.9rem;"> / $${parseInt(monthlyBudget)}.00</span></div>`;
        }

        
        // Create the pie chart
        const expensesChart = new Chart(ctx, chartData);
        expensesChart.update();

        const tableBody = document.getElementById('expenseTableBody'); // Getting the table body element

        // Clear the table body
        tableBody.innerHTML = '';

        // Iterate over the expenses array
        expenses.forEach(item => {
            const row = document.createElement('tr');

            const dateCell = document.createElement('td');
            dateCell.textContent = new Date(item.created_at).toLocaleDateString();
            row.appendChild(dateCell);

            const categoryCell = document.createElement('td');
            categoryCell.textContent = item.category;
            row.appendChild(categoryCell);

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = item.description;
            row.appendChild(descriptionCell);

            const amountCell = document.createElement('td');
            amountCell.textContent = `$${item.amount.toFixed(2)}`;
            row.appendChild(amountCell);

            tableBody.appendChild(row);
        });

    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error fetching expenses:', error);
        const container = document.getElementById('expenses-container');
        container.innerHTML = '<p>Failed to load expenses. Please try again later.</p>';
    }

    function convertJSONToCSV(data) {
        const header = 'Category,Description,Amount\n';
        const csv = data.map(item => `${item.category},"${item.description}",${item.amount}`).join('\n');
        return header + csv;
    }
    
    const exportButton = document.getElementById('exportData')
    exportButton.onclick = function() {
        const csv = convertJSONToCSV(expenses);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'expenses.csv');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
});

