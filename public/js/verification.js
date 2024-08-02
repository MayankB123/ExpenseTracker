document.addEventListener('DOMContentLoaded', async () => {
    
    const params = new URLSearchParams(window.location.search);
    emailParam = params.get('email')
    success = params.get('success')
    document.getElementById('email-holder').value = emailParam;

    if (success === 'false') {
        const messageBox = document.getElementById('message-box');
        const message = document.getElementById('message');
        
        // Set the error message and display the box
        message.textContent = "Code is incorrect!";
        messageBox.style.backgroundColor = '#721c24;'
        messageBox.style.color = '#FFFFFF'
        messageBox.style.display = 'inline-block';

        // Hide the box after 3 seconds
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 8000); // 3000 milliseconds = 3 seconds
    }

    document.getElementById('resendCode').onclick = async function() {
        const url = `/api/resend-code/${emailParam}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            console.log('Success');
            // Handle the response data as needed
        } catch (error) {
            console.error('Error:', error);
        }
    };

});