
addEventListener("load", (event) => {
    const params = new URLSearchParams(window.location.search);
    error = params.get('error')
    email = params.get('email')

    if (email) {
        const emailBox = document.getElementById('emailBox')
        emailBox.value = email;
    }

    if (error === 'invalid-email') {
        const messageBox = document.getElementById('message-box');
        const message = document.getElementById('message');
        
        message.textContent = "Please enter a valid email";
        messageBox.style.display = 'inline-block';

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000); 
    }

    if (error === 'email-taken') {
        const messageBox = document.getElementById('message-box');
        const message = document.getElementById('message');
        
        message.textContent = "That email is taken. Please try another one.";
        messageBox.style.display = 'inline-block';

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000);
    }

    if (error === 'invalid-password') {
        const messageBox = document.getElementById('message-box');
        const message = document.getElementById('message');
        
        message.textContent = "Password must be greater than 8 characters and contain at least: 1 upper case character, 1 lower case character and one number.";
        messageBox.style.display = 'inline-block';

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000); // 3000 milliseconds = 3 seconds
    }
});