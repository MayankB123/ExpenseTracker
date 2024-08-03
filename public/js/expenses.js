const categories = ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Travel', 'Savings', 'Debt Repayment', 'Healthcare', 'Transportation', 'Miscellaneous']
const backgroundColors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F','#9B59B6', '#E67E22', '#1ABC9C', '#E74C3C', '#3498DB', '#2ECC71']
const grey = '#D3D3D3'
let expenses;

document.addEventListener('DOMContentLoaded', async () => {

    
    try {
        const USD = document.getElementById('USD')
        const AUD = document.getElementById('AUD')
        const EUR = document.getElementById('EUR')
        const GBP = document.getElementById('GBP')
        const INR = document.getElementById('INR')
        
        async function changeCurrency(currency) {
            try {
                const response = await fetch('/api/change-currency', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ currency })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                console.log(`${currency} change successful`);

                location.reload();
            } catch (error) {
                console.error('Error:', error);
            }
        }

        USD.onclick = () => changeCurrency('USD');
        AUD.onclick = () => changeCurrency('AUD');
        EUR.onclick = () => changeCurrency('EUR');
        GBP.onclick = () => changeCurrency('GBP');
        INR.onclick = () => changeCurrency('INR');

        const budgetResponse = await fetch('/api/monthly-budget');
        
        if (!budgetResponse.ok) {
            throw new Error(`HTTP error! Status: ${budgetResponse.status}`);
        }

        const currentCurrency = document.getElementById('currentCurrency').innerHTML;
        

        const budgetData = await budgetResponse.json();
        const budgetH2 = document.getElementById('monthlyBudget');
        const monthlyBudget = budgetData.monthlyBudget
        budgetH2.innerHTML = `$${monthlyBudget}`

        if (currentCurrency == 'USD' || currentCurrency == 'AUD') {
            budgetH2.innerHTML = `$${monthlyBudget}`
        } 
        else if (currentCurrency == 'EUR') {
            budgetH2.innerHTML = `€${monthlyBudget}`
        }
        else if (currentCurrency == 'GBP') {
            budgetH2.innerHTML = `£${monthlyBudget}`
        }
        else {
            budgetH2.innerHTML = `₹${monthlyBudget}`
        }
        
        const response = await fetch('/api/expenses');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        expenses = await response.json();

        const tableBody = document.getElementById('expenseTableBody'); 

        tableBody.innerHTML = '';

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
            if (currentCurrency == 'USD' || currentCurrency == 'AUD') {
                amountCell.textContent = `$${item.amount.toFixed(2)}`;
            } 
            else if (currentCurrency == 'EUR') {
                amountCell.textContent = `€${item.amount.toFixed(2)}`;
            }
            else if (currentCurrency == 'GBP') {
                amountCell.textContent = `£${item.amount.toFixed(2)}`;
            }
            else {
                amountCell.textContent = `₹${item.amount.toFixed(2)}`;
            }
            
            row.appendChild(amountCell);

            tableBody.appendChild(row);
        });



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
                maintainAspectRatio: false,
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

        const expenseMap = {};
        let amount = 0;

        const dateNow = new Date();
        const monthNow = dateNow.getMonth()
        const yearNow = dateNow.getFullYear()

        expenses.forEach(item => {
            expenseDate = new Date(item.created_at)
            if (expenseDate.getMonth() == monthNow && expenseDate.getFullYear() == yearNow) {
            if (expenseMap[item.category]) {
                expenseMap[item.category] += item.amount.toFixed(2);
            } else {
                expenseMap[item.category] = item.amount.toFixed(2);
            }
            amount += item.amount;
            }
        });

        Object.keys(expenseMap).forEach((category, index) => {
            labelsReference.push(category);
            dataReference.push(expenseMap[category]);
            colorReference.push(backgroundColors[index % backgroundColors.length]); // Use modulo to avoid out of bounds
        });


        if (amount < monthlyBudget) {
            dataReference.push((monthlyBudget - amount).toFixed(2));
            labelsReference.push('Leftover');
            colorReference.push(grey);
            textColor = 'green';
            const totalExpensesAmount = document.getElementById('totalExpensesAmount');
            if (currentCurrency == 'USD' || currentCurrency == 'AUD') {
                totalExpensesAmount.innerHTML = `<div style="text-align: center; margin: 5px 0 5px 0; font-size: 1.5rem;">$${parseFloat(amount).toFixed(2)} <span style="color: rgb(93, 93, 93); font-size: 0.9rem;"> / $${parseInt(monthlyBudget)}.00</span></div>`;
            } 
            else if (currentCurrency == 'EUR') {
                totalExpensesAmount.innerHTML = `<div style="text-align: center; margin: 5px 0 5px 0; font-size: 1.5rem;">€${parseFloat(amount).toFixed(2)} <span style="color: rgb(93, 93, 93); font-size: 0.9rem;"> / €${parseInt(monthlyBudget)}.00</span></div>`;
            }
            else if (currentCurrency == 'GBP') {
                totalExpensesAmount.innerHTML = `<div style="text-align: center; margin: 5px 0 5px 0; font-size: 1.5rem;">£${parseFloat(amount).toFixed(2)} <span style="color: rgb(93, 93, 93); font-size: 0.9rem;"> / £${parseInt(monthlyBudget)}.00</span></div>`;
            }
            else {
                budgetH2.innerHTML = `₹${monthlyBudget}`
                totalExpensesAmount.innerHTML = `<div style="text-align: center; margin: 5px 0 5px 0; font-size: 1.5rem;">₹${parseFloat(amount).toFixed(2)} <span style="color: rgb(93, 93, 93); font-size: 0.9rem;"> / ₹${parseInt(monthlyBudget)}.00</span></div>`;
            }
        } else {
            const totalExpensesAmount = document.getElementById('totalExpensesAmount');
            if (currentCurrency == 'USD' || currentCurrency == 'AUD') {
                totalExpensesAmount.innerHTML = `<div style="text-align: center; margin: 5px 0 5px 0; font-size: 1.5rem; color: red;">$${parseFloat(amount).toFixed(2)}<span style="color: rgb(93, 93, 93); font-size: 0.9rem;"> / $${parseInt(monthlyBudget)}.00</span></div>`;
            } 
            else if (currentCurrency == 'EUR') {
                totalExpensesAmount.innerHTML = `<div style="text-align: center; margin: 5px 0 5px 0; font-size: 1.5rem; color: red;">€${parseFloat(amount).toFixed(2)}<span style="color: rgb(93, 93, 93); font-size: 0.9rem;"> / €${parseInt(monthlyBudget)}.00</span></div>`;
            }
            else if (currentCurrency == 'GBP') {
                totalExpensesAmount.innerHTML = `<div style="text-align: center; margin: 5px 0 5px 0; font-size: 1.5rem; color: red;">£${parseFloat(amount).toFixed(2)}<span style="color: rgb(93, 93, 93); font-size: 0.9rem;"> / £${parseInt(monthlyBudget)}.00</span></div>`;
            }
            else {
                totalExpensesAmount.innerHTML = `<div style="text-align: center; margin: 5px 0 5px 0; font-size: 1.5rem; color: red;">₹${parseFloat(amount).toFixed(2)}<span style="color: rgb(93, 93, 93); font-size: 0.9rem;"> / ₹${parseInt(monthlyBudget)}.00</span></div>`;
            }
            
        }

        
        const expensesChart = new Chart(ctx, chartData);
        expensesChart.update();

        

    } catch (error) {
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

