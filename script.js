document.addEventListener('DOMContentLoaded', () => {
    // Set the initial start date
    const startDate = new Date('2018-10-19'); // Replace with your relationship start date
    const today = new Date();
    const duration = calculateDuration(startDate, today);

    // Update the DOM with the calculated data
    document.querySelector('.date').innerText = formatDate(startDate);
    document.querySelector('.duration p').innerText = `${duration.years} Jahren, ${duration.months} Monaten und ${duration.days} Tagen`;
    document.querySelector('.conversion ul').innerHTML = `
        <li>${duration.totalMonths} Monaten</li>
        <li>oder ${duration.totalWeeks} Wochen</li>
        <li>oder ${duration.totalDays} Tagen</li>
    `;
});

/**
 * Calculate the duration between two dates
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date (usually today)
 * @returns {Object} - An object with the years, months, weeks, days, and totals
 */
function calculateDuration(startDate, endDate) {
    const years = endDate.getFullYear() - startDate.getFullYear();
    const months = endDate.getMonth() - startDate.getMonth() + (years * 12);
    const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    // Calculate precise years, months, and days
    let remainingMonths = months % 12;
    let remainingYears = Math.floor(months / 12);
    let remainingDays = days - (remainingYears * 365 + remainingMonths * 30);

    return {
        years: remainingYears,
        months: remainingMonths,
        days: remainingDays,
        totalMonths: months,
        totalWeeks: weeks,
        totalDays: days
    };
}

/**
 * Format a date into DD. Monat YYYY
 * @param {Date} date
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    const months = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}
