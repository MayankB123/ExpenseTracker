
addEventListener("load", (event) => {
    const params = new URLSearchParams(window.location.search);
    registration = params.get('registration')

    if (registration === 'success') {
        console.log("SUWI")
        const messageBox = document.getElementById('message-box');
        const message = document.getElementById('message');
        
        // Set the error message and display the box
        message.textContent = "Registered Successfully!";
        messageBox.style.backgroundColor = '#5CB85C'
        messageBox.style.color = '#FFFFFF'
        messageBox.style.display = 'inline-block';

        // Hide the box after 3 seconds
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 8000); // 3000 milliseconds = 3 seconds
    }
});