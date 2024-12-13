document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dateString = urlParams.get('date');
    const message = urlParams.get('message'); // Retrieve the message parameter

    if (message) {
        // Decode and display the personalized message
        const decodedMessage = decodeURIComponent(message);
        document.getElementById('personalMessage').innerText = decodedMessage;
    }

    if (dateString) {
        const inputDate = new Date(dateString);
        if (!isNaN(inputDate)) {
            const currentDate = new Date();
            const timeDiff = currentDate - inputDate;
            const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            document.getElementById('result').innerText = `Today, we are ${dayDiff} days together!`;
        } else {
            document.getElementById('result').innerText = 'Invalid date format provided.';
        }
    } else {
        document.getElementById('result').innerText = 'No date provided.';
    }
});

function calculateDays() {
    const inputDateValue = document.getElementById('inputDate').value;
    if (inputDateValue) {
        const inputDate = new Date(inputDateValue);
        if (!isNaN(inputDate)) {
            const currentDate = new Date();
            const timeDiff = currentDate - inputDate;
            const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            document.getElementById('result').innerText = `Today, we are ${dayDiff} days together!`;
        } else {
            document.getElementById('result').innerText = 'Invalid date format provided.';
        }
    } else {
        document.getElementById('result').innerText = 'Please select a date.';
    }
}
