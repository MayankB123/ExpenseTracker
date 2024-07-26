const categories = ['Salary', 'Side Hustle', 'Passive Income', 'Investments', 'Pension']
const backgroundColors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)']
const borderColors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let incomes;

document.addEventListener('DOMContentLoaded', async () => {

    try {        
        const incomeResponse = await fetch('/api/income');

        if (!incomeResponse.ok) {
            throw new Error(`HTTP error! Status: ${incomeResponse.status}`);
        }

        incomes = await incomeResponse.json();

        const tableBody = document.getElementById('expenseTableBody');

        tableBody.innerHTML = '';

        incomes.forEach(item => {
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

        function getDaysInMonth(year, month) {
            const date = new Date(year, month + 1, 0);
            return date.getDate();
        }

        const incomeMap = {};
        let amount = 0;

        incomes.forEach(item => {
            if (incomeMap[item.category]) {
                incomeMap[item.category] += item.amount;
            } else {
                incomeMap[item.category] = item.amount;
            }
            amount += item.amount;
        });

        const ctx = document.getElementById('categoriesBarChart').getContext('2d');

        const data = {
            labels: [],
            datasets: [{
                label: 'Amount of Money',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1
            }]
        };

        Object.keys(incomeMap).forEach((category, index) => {
            data.labels.push(category);
            data.datasets[0].data.push(incomeMap[category]);
            data.datasets[0].backgroundColor.push(backgroundColors[index % backgroundColors.length]);
            data.datasets[0].borderColor.push(borderColors[index % borderColors.length]);
        });

        console.log(data)

        const myBarChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount of Money'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Categories'
                        }
                    }
                }
            }
        });


        const ctx2 = document.getElementById('incomeLineChart').getContext('2d');

        const now = new Date();
        const day = now.getDate()
        const month = now.getMonth();
        const year = now.getFullYear();

        const numberOfDays = getDaysInMonth(year, month);

        const dates = [];
        const dailyIncome = [];
        
        for (let i = 1; i < numberOfDays + 1; i++) {
            dates.push(`${i}`)
        }

        const map = {}

        incomes.forEach(item => {
            index = new Date(item.created_at).getDate();
            if (map[index]) {
                map[index] += item.amount;
            } else{
            map[index] = item.amount;
            }
        });

        console.log(map)
        amount = 0
        for (let i = 1; i < day + 1; i++) {
            if (map[i] != undefined) {
                amount += map[i]
            }
            dailyIncome.push(amount);
        }

        const totalIncome = document.getElementById('totalIncomeAmount');
        totalIncome.innerHTML = `$${amount.toFixed(2)}`;

        const data2 = {
            labels: dates,
            datasets: [{
                label: 'Total Income',
                data: dailyIncome,
                borderColor: 'rgba(75, 192, 192, 1)', // Line color
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color
                borderWidth: 2,
                tension: 0.1 // Smooth the line
            }]
        };

        const incomeLineChart = new Chart(ctx2, {
            type: 'line',
            data: data2,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `Income: $${tooltipItem.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: `Days in ${months[month]}`
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Income'
                        },
                        ticks: {
                            callback: function(value) {
                                return `$${value.toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        });


        const incomeGoalResponse = await fetch('/api/income-goal');
        
        if (!incomeGoalResponse.ok) {
            throw new Error(`HTTP error! Status: ${incomeGoalResponse.status}`);
        }

        const IncomeGoalData = await incomeGoalResponse.json();
        const incomeGoalH2 = document.getElementById('incomeGoalAmount');
        const incomeGoalAmount = IncomeGoalData.incomeGoal
        incomeGoalH2.innerHTML = `$${incomeGoalAmount} <span id="incomeGoalPercentage" class="income-goal-percentage">${(amount / incomeGoalAmount * 100).toFixed(2)}%</span>`
        incomeGoalPercentage = document.getElementById('incomeGoalPercentage')
        if ((amount / incomeGoalAmount * 100) < 40) {
            incomeGoalPercentage.setAttribute('style', 'color: red;')
        }
        else if ((amount / incomeGoalAmount * 100) < 70) {
            incomeGoalPercentage.setAttribute('style', 'color: orange;')
        } else {
            incomeGoalPercentage.setAttribute('style', 'color: green;')
        }

        
    } catch (error) {
        console.error('Error fetching income:', error);
    }

    function convertJSONToCSV(data) {
        const header = 'Category,Description,Amount\n';
        const csv = data.map(item => `${item.category},"${item.description}",${item.amount}`).join('\n');
        return header + csv;
    }

    const exportButton = document.getElementById('exportData')
    exportButton.onclick = function() {
        const csv = convertJSONToCSV(incomes);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'incomes.csv');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
});