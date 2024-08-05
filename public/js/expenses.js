const categories = ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Travel', 'Savings', 'Debt Repayment', 'Healthcare', 'Transportation', 'Miscellaneous']
const backgroundColors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 71, 1)', 'rgba(144, 238, 144, 1)', 'rgba(255, 105, 180, 1)', 'rgba(0, 128, 128, 1)']
const grey = '#D3D3D3'
let expenses;

document.addEventListener('DOMContentLoaded', async () => {

    function getLegendDisplay() {
        return window.innerWidth >= 500; // Adjust the width as needed
    }
    
    try {
        const hamburgerMenu = document.getElementById("hamburgerMenu");
        const mobileNavMenu = document.getElementById("mobileNavMenu");

        hamburgerMenu.addEventListener("click", function() {
            mobileNavMenu.classList.toggle("show");
            console.log('Hello')
        });


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
            descriptionCell.classList.add("description")
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
                        display: getLegendDisplay(),
                        position: 'top',
                        font: {
                            size: 10
                        }
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
                // console.log(item)
            if (expenseMap[item.category]) {
                expenseMap[item.category] += parseFloat(item.amount.toFixed(2));
                // console.log(expenseMap[item.category])
            } else {
                expenseMap[item.category] = parseFloat(item.amount.toFixed(2));
            }
            amount += item.amount;
            }
        });

        Object.keys(expenseMap).forEach((category, index) => {
            labelsReference.push(category);
            dataReference.push(parseFloat(expenseMap[category].toFixed(2)));
            colorReference.push(backgroundColors[index % backgroundColors.length]); // Use modulo to avoid out of bounds
        });


        if (amount < monthlyBudget) {
            dataReference.push((monthlyBudget - amount).toFixed(2));
            labelsReference.push('Leftover');
            colorReference.push(grey);
            textColor = 'green';
            const totalExpensesAmount = document.getElementById('totalExpensesAmount');
            if (currentCurrency == 'USD' || currentCurrency == 'AUD') {
                totalExpensesAmount.innerHTML = `<h2 class="total-expenses-amount">$${parseFloat(amount).toFixed(2)} <span class="total-expenses-amount-span"> / $${parseInt(monthlyBudget)}.00</span></h2>`;
            } 
            else if (currentCurrency == 'EUR') {
                totalExpensesAmount.innerHTML = `<h2 class="total-expenses-amount">€${parseFloat(amount).toFixed(2)} <span class="total-expenses-amount-span"> / €${parseInt(monthlyBudget)}.00</span></h2>`;
            }
            else if (currentCurrency == 'GBP') {
                totalExpensesAmount.innerHTML = `<h2 class="total-expenses-amount">£${parseFloat(amount).toFixed(2)} <span class="total-expenses-amount-span"> / £${parseInt(monthlyBudget)}.00</span></h2>`;
            }
            else {
                budgetH2.innerHTML = `₹${monthlyBudget}`
                totalExpensesAmount.innerHTML = `<h2 class="total-expenses-amount">₹${parseFloat(amount).toFixed(2)} <span class="total-expenses-amount-span"> / ₹${parseInt(monthlyBudget)}.00</span></h2>`;
            }
        } else {
            const totalExpensesAmount = document.getElementById('totalExpensesAmount');
            if (currentCurrency == 'USD' || currentCurrency == 'AUD') {
                totalExpensesAmount.innerHTML = `<h2 class="total-expenses-amount-exceed">$${parseFloat(amount).toFixed(2)}<span class="total-expenses-amount-span"> / $${parseInt(monthlyBudget)}.00</span></h2>`;
            } 
            else if (currentCurrency == 'EUR') {
                totalExpensesAmount.innerHTML = `<h2 class="total-expenses-amount-exceed">€${parseFloat(amount).toFixed(2)}<span class="total-expenses-amount-span"> / €${parseInt(monthlyBudget)}.00</span></div>`;
            }
            else if (currentCurrency == 'GBP') {
                totalExpensesAmount.innerHTML = `<h2 class="total-expenses-amount-exceed"">£${parseFloat(amount).toFixed(2)}<span class="total-expenses-amount-span"> / £${parseInt(monthlyBudget)}.00</span></div>`;
            }
            else {
                totalExpensesAmount.innerHTML = `<h2 class="total-expenses-amount-exceed"">₹${parseFloat(amount).toFixed(2)}<span class="total-expenses-amount-span"> / ₹${parseInt(monthlyBudget)}.00</span></div>`;
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