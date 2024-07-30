const categories = ['Salary', 'Side Hustle', 'Passive Income', 'Investments', 'Pension']
const backgroundColors = ['rgba(102, 204, 102, 0.2)', 'rgba(255, 99, 132, 0.2)']
const borderColors = ['rgba(102, 204, 102, 1)', 'rgba(255, 99, 132, 1)']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

        const incomeResponse = await fetch('/api/income');

        if (!incomeResponse.ok) {
            throw new Error(`HTTP error! Status: ${incomeResponse.status}`);
        }

        const incomes = await incomeResponse.json();

        const expensesResponse = await fetch('/api/expenses');
        
        if (!expensesResponse.ok) {
            throw new Error(`HTTP error! Status: ${expensesResponse.status}`);
        }

        const expenses = await expensesResponse.json();

        function getDaysInMonth(year, month) {
            const date = new Date(year, month + 1, 0);
            return date.getDate();
        }

        let incomeAmount = 0;
        let expenseAmount = 0;

        incomes.forEach(item => {
            incomeAmount += item.amount;
        });

        expenses.forEach(item => {
            expenseAmount += item.amount;
        });

        const currentCurrency = document.getElementById('currentCurrency').innerHTML;

        const incomeNumber = document.getElementById('incomeNumber');
        const expensesNumber = document.getElementById('expensesNumber')
        if (currentCurrency == 'USD' || currentCurrency == 'AUD') {
            incomeNumber.innerHTML = `$${incomeAmount.toFixed(2)}`;
            expensesNumber.innerHTML = `$${expenseAmount.toFixed(2)}`
        } 
        else if (currentCurrency == 'EUR') {
            incomeNumber.innerHTML = `€${incomeAmount.toFixed(2)}`;
            expensesNumber.innerHTML = `€${expenseAmount.toFixed(2)}`
        }
        else if (currentCurrency == 'GBP') {
            incomeNumber.innerHTML = `£${incomeAmount.toFixed(2)}`;
            expensesNumber.innerHTML = `£${expenseAmount.toFixed(2)}`
        }
        else {
            incomeNumber.innerHTML = `₹${incomeAmount.toFixed(2)}`;
            expensesNumber.innerHTML = `₹${expenseAmount.toFixed(2)}`
        }


        const ctx = document.getElementById('incomeVsExpensesBarChart').getContext('2d');

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

        
        data.labels.push('Income');
        data.labels.push('Expenses');
        data.datasets[0].data.push(incomeAmount);
        data.datasets[0].data.push(expenseAmount);
        data.datasets[0].backgroundColor.push(backgroundColors[0]);
        data.datasets[0].backgroundColor.push(backgroundColors[1]);
        data.datasets[0].borderColor.push(borderColors[0]);
        data.datasets[0].borderColor.push(borderColors[1]);
        

        const myBarChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                maintainAspectRatio: false,
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
                            display: false
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
        const dailyExpenses = [];
        
        for (let i = 1; i < numberOfDays + 1; i++) {
            dates.push(`${i}`)
        }

        const incomeMap = {}
        const expenseMap = {}

        incomes.forEach(item => {
            index = new Date(item.created_at).getDate();
            if (incomeMap[index]) {
                incomeMap[index] += item.amount;
            } else{
                incomeMap[index] = item.amount;
            }
        });

        expenses.forEach(item => {
            index = new Date(item.created_at).getDate();
            if (expenseMap[index]) {
                expenseMap[index] += item.amount;
            } else{
                expenseMap[index] = item.amount;
            }
        });

        amount = 0
        for (let i = 1; i < day + 1; i++) {
            if (incomeMap[i] != undefined) {
                amount += incomeMap[i]
            }
            dailyIncome.push(amount);
        }

        amount = 0
        for (let i = 1; i < day + 1; i++) {
            if (expenseMap[i] != undefined) {
                amount += expenseMap[i]
            }
            dailyExpenses.push(amount);
        }

        const data2 = {
            labels: dates,
            datasets: [{
                label: 'Total Income',
                data: dailyIncome,
                borderColor: 'rgba(102, 204, 102, 1)', // Line color
                backgroundColor: 'rgba(102, 204, 102, 0.2)', // Fill color
                borderWidth: 2,
                tension: 0.1 // Smooth the line
            },
            {
                label: 'Total Expenses',
                data: dailyExpenses,
                borderColor: 'rgba(255, 99, 132, 1)', // Line color
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Fill color
                borderWidth: 2,
                tension: 0.1 // Smooth the line
            }]
        };

        const incomeLineChart = new Chart(ctx2, {
            type: 'line',
            data: data2,
            options: {
                maintainAspectRatio: false,
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
        const incomeGoalAmount = IncomeGoalData.incomeGoal

        
        const incomeGoalBarAmount = document.getElementById('incomeGoalBarAmount');
        if (currentCurrency == 'USD' || currentCurrency == 'AUD') {
            incomeGoalBarAmount.innerHTML = `$${incomeAmount.toFixed(2)} / $${incomeGoalAmount}`
        }
        if (currentCurrency == 'EUR') {
            incomeGoalBarAmount.innerHTML = `€${incomeAmount.toFixed(2)} / €${incomeGoalAmount}`
        }
        if (currentCurrency == 'GBP') {
            incomeGoalBarAmount.innerHTML = `£${incomeAmount.toFixed(2)} / £${incomeGoalAmount}`
        }
        if (currentCurrency == 'INR') {
            incomeGoalBarAmount.innerHTML = `₹${incomeAmount.toFixed(2)} / ₹${incomeGoalAmount}`
        }
        const widthToSet = (incomeAmount / incomeGoalAmount * 100);
        const incomeGoalProgress = document.getElementById('incomeGoalProgress');
        incomeGoalProgress.setAttribute('style', `width: ${widthToSet}%`)

        const incomeExpenseRatioNumber = (incomeAmount / expenseAmount) * 100;
        if (incomeExpenseRatioNumber == NaN) {
            incomeExpenseRatioNumber = 0;
        }
        let color;
        if (parseFloat(incomeExpenseRatioNumber) >= 100) {
            color = 'green'
        }
        else {
            color = 'red';
        }

        const incomeExpenseRatio = document.getElementById('incomeExpenseRatio')

        incomeExpenseRatio.setAttribute('style', `color: ${color}`);
        incomeExpenseRatio.innerHTML = `${incomeExpenseRatioNumber.toFixed(2)}%`
        
    } catch (error) {
        console.error('Error fetching income:', error);
    }
});