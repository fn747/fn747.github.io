document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const urlParams = new URLSearchParams(window.location.search);
    const dateString = urlParams.get('date');
    console.log('Date parameter:', dateString);

    
    // Extract the 'date' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const dateString = urlParams.get('date');

    if (dateString) {
        // Parse the date string into a Date object
        const inputDate = new Date(dateString);
        if (!isNaN(inputDate)) {
            const currentDate = new Date();

            // Calculate the difference in milliseconds
            const timeDiff = currentDate - inputDate;

            // Convert milliseconds to days
            const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            // Display the result
            document.getElementById('result').innerText = `Today, we are ${dayDiff} days together!`;
        } else {
            document.getElementById('result').innerText = 'Invalid date format provided.';
        }
    } else {
        document.getElementById('result').innerText = 'No date provided.';
    }
});
