const categories = ['Salary', 'Side Hustle', 'Passive Income', 'Investments', 'Pension']
const backgroundColors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)']
const borderColors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)']
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

        const getDaysInMonth = (year, month) => {
            const date = new Date(year, month, 1);
            const days = [];
            while (date.getMonth() === month) {
                days.push(new Date(date).getDate().toString().padStart(2, '0'));
                date.setDate(date.getDate() + 1);
            }
            return days;
        };

        const incomesDummy = [
            { created_at: '2024-07-01T10:00:00Z', category: 'Salary', amount: 5000 },
            { created_at: '2024-07-01T12:00:00Z', category: 'Side Hustle', amount: 200 },
            { created_at: '2024-07-02T10:00:00Z', category: 'Salary', amount: 5000 },
            { created_at: '2024-07-02T12:00:00Z', category: 'Side Hustle', amount: 150 },
            // Add more data as needed
        ];

        year = 2024
        month = 7;
        
        const categories = ['Salary', 'Side Hustle'];
        const labelsReference = getDaysInMonth(year, month); // Function to get all days of the month
        
        // Initialize data structure
        const incomeByDateAndCategory = {};
        categories.forEach(category => {
            incomeByDateAndCategory[category] = {};
            labelsReference.forEach(day => {
                incomeByDateAndCategory[category][day] = 0; // Initialize with zero
            });
        });
        
        // Populate data
        incomesDummy.forEach(item => {
            const date = new Date(item.created_at);
            const day = date.getDate().toString().padStart(2, '0');
            const category = item.category;
            const amount = item.amount;
        
            if (!incomeByDateAndCategory[category]) {
                incomeByDateAndCategory[category] = {};
            }
            
            incomeByDateAndCategory[category][day] = (incomeByDateAndCategory[category][day] || 0) + amount;
        });

        const backgroundColors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)']; // One for each category
        const borderColors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)']; // One for each category

        const datasets = categories.map((category, index) => {
            const data = labelsReference.map(day => incomeByDateAndCategory[category][day] || 0);

            return {
                label: category,
                data: data,
                backgroundColor: backgroundColors[index],
                borderColor: borderColors[index],
                borderWidth: 1
            };
        });

        const ctx = document.getElementById('income-bar-chart').getContext('2d');
        const myBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labelsReference,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allow resizing the chart without maintaining aspect ratio
                indexAxis: 'x',
                scales: {
                    x: {
                        stacked: false,
                        barPercentage: 0.8,
                        categoryPercentage: 0.7
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        myBarChart.update()

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