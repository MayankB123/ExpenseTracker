document.addEventListener('DOMContentLoaded', function() {
    // Get the modal
    let budgetModal = document.getElementById('budgetModal');
    let expensesModal = document.getElementById('expensesModal');
    
    let openBudgetModalButton = document.getElementById('openBudgetModalButton');
    let openExpensesModalButton = document.getElementById('openExpensesModalButton')
    
    let closeBudgetModalButton = document.getElementById('closeBudgetModal');
    let closeExpensesModalButton = document.getElementById('closeExpensesModal');
    
    let budgetForm = document.getElementById('budgetForm');
    let expensesForm = document.getElementById('expensesForm');

    openBudgetModalButton.onclick = function() {
        budgetModal.style.display = 'block';
    }

    openExpensesModalButton.onclick = function() {
        expensesModal.style.display = 'block';
    }
    
    // When the user clicks on <span> (x), close the modal
    closeBudgetModalButton.onclick = function() {
        budgetModal.style.display = 'none';
    }

    closeExpensesModalButton.onclick = function () {
        expensesModal.style.display = 'none';
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == budgetModal) {
            budgetModal.style.display = 'none';
        }
        if (event.target == expensesModal) {
            expensesModal.style.display = 'none';
        }
    }
    
    // Handle form submission
    budgetForm.onsubmit = async function(event) {
        event.preventDefault(); // Prevent default form submission
        var newBudget = document.getElementById('budget').value;
        
        try {
            const response = await fetch('/api/monthly-budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ budget: newBudget }),
            });

            if (response.ok) {
                budgetModal.style.display = 'none';
                showNotification('Budget successfully updated! Refresh to see changes.', 'success');
            } else {
                budgetModal.style.display = 'none'
                console.error('Error updating budget: ', response.statusText);
                showNotification('Budget update failed.', 'fail')
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }

        budgetModal.style.display = 'none';
    }

    // Handle form submission
    expensesForm.onsubmit = async function(event) {
        event.preventDefault(); // Prevent default form submission
        let category = document.getElementById('category').value;
        let description = document.getElementById('description').value;
        let amount = document.getElementById('amount').value;
        
        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({  category: category, description: description, amount: amount}),
            });

            if (response.ok) {
                expensesModal.style.display = 'none';
                showNotification('Expense successfully updated! Refresh to see changes.', 'success');
            } else {
                expensesModal.style.display = 'none'
                console.error('Error adding expense: ', response.statusText);
                showNotification('Adding expense failed.', 'fail')
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }

        expensesModal.style.display = 'none';
    }

    function showNotification(message, type) {
        notification.querySelector('.notification-message').textContent = message;
        notification.classList.remove('hidden');
        if (type === 'success') {
            notification.classList.add('show-success');
        } else {
            notification.classList.add('show-fail');
        }

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (type === 'success') {
                    notification.classList.remove('show-success', 'fade-out');
                } else {
                    notification.classList.remove('show-fail', 'fade-out');
                }
                notification.classList.add('hidden');
            }, 1000); 
        }, 2000);       
    }
});