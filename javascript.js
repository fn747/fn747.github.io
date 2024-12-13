document.addEventListener('DOMContentLoaded', () => {
    // Extract the date from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const dateString = urlParams.get('date');

    if (dateString) {
        const inputDate = new Date(dateString);
        const currentDate = new Date();

        // Calculate the difference in milliseconds
        const diffTime = currentDate - inputDate;

        // Convert milliseconds to days
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Display the result
        document.getElementById('result').textContent = `The number of days between ${inputDate.toDateString()} and today is ${diffDays} days.`;
    } else {
        document.getElementById('result').textContent = 'No date provided.';
    }
});
