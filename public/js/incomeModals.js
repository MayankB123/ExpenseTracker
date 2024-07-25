document.addEventListener('DOMContentLoaded', function() {
    let incomesModal = document.getElementById('incomesModal');
    
    let openIncomesModalButton = document.getElementById('openIncomesModalButton')
    
    let closeIncomesModalButton = document.getElementById('closeIncomesModal');
    
    let incomesForm = document.getElementById('incomesForm');

    openIncomesModalButton.onclick = function() {
        incomesModal.style.display = 'block';
    }

    closeIncomesModalButton.onclick = function () {
        incomesModal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == incomesModal) {
            incomesModal.style.display = 'none';
        }
    }

    incomesForm.onsubmit = async function(event) {
        event.preventDefault(); 
        let category = document.getElementById('category').value;
        let description = document.getElementById('description').value;
        let amount = document.getElementById('amount').value;
        
        try {
            const response = await fetch('/api/income', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ category: category, description: description, amount: amount}),
            });

            if (response.ok) {
                incomesModal.style.display = 'none';
                showNotification('Income successfully added! Refresh to see changes.', 'success');
            } else {
                incomesModal.style.display = 'none'
                console.error('Error adding expense: ', response.statusText);
                showNotification('Adding income failed.', 'fail')
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }

        incomesModal.style.display = 'none';
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