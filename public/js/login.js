
addEventListener("load", (event) => {
    const params = new URLSearchParams(window.location.search);
    registration = params.get('registration')
    login = params.get('login')
    forgotPassword = params.get('forgot-password')
    passwordReset = params.get('password-reset')

    if (registration === 'success') {
        console.log("SUWI")
        const messageBox = document.getElementById('message-box');
        const message = document.getElementById('message');
        
        message.textContent = "Registered Successfully!";
        messageBox.style.backgroundColor = '#5CB85C'
        messageBox.style.color = '#FFFFFF'
        messageBox.style.display = 'inline-block';

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 8000);
    }

    if (login === 'client-failure') {
        const messageBox = document.getElementById('message-box');
        const message = document.getElementById('message');
        
        message.textContent = "Invalid credentials";
        messageBox.style.display = 'inline-block';

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 8000);
    }

    if (login === 'server-failure') {
        const messageBox = document.getElementById('message-box');
        const message = document.getElementById('message');
        
        message.textContent = "Server failure. Try again later.";
        messageBox.style.display = 'inline-block';

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 8000);
    }

    if (forgotPassword === 'true') {
        const messageBox = document.getElementById('message-box');
        const message = document.getElementById('message');
        
        message.textContent = "Password reset email has been sent if the account exists.";
        messageBox.style.display = 'inline-block';
        messageBox.style.backgroundColor = '#5CB85C'
        messageBox.style.color = '#FFFFFF'

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 8000);
    }

    if (passwordReset === 'true') {
        const messageBox = document.getElementById('message-box');
        const message = document.getElementById('message');
        
        message.textContent = "Password has been reset.";
        messageBox.style.display = 'inline-block';
        messageBox.style.backgroundColor = '#5CB85C'
        messageBox.style.color = '#FFFFFF'

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 8000);
    }
});