



const ctx = document.getElementById('expensesChart').getContext('2d');
const expensesChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Others'],
        datasets: [{
            label: 'Monthly Expenses',
            data: [800, 200, 100, 150, 50], // Replace with your actual expense data
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
            ],
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
});