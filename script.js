document.addEventListener("DOMContentLoaded", () => {
    const imageElement = document.getElementById("user-image");
    const urlParams = new URLSearchParams(window.location.search);
    const nfcId = urlParams.get("nfc");
    const dateParam = urlParams.get("date");
    const messageParam = urlParams.get("message");

    /**
     * Function to update the image dynamically
     */
    function updateImage(nfcId) {
        if (!nfcId) {
            // Use default image when no NFC ID is provided
            imageElement.src = "https://fn747.github.io/images/default.png";
            return;
        }

        const imagePath = `https://fn747.github.io/images/${nfcId}.png`;

        imageElement.src = imagePath;
        imageElement.style.display = "block";

        // Handle missing image
        imageElement.onerror = () => {
            imageElement.src = "https://fn747.github.io/images/default.png"; // Fallback image
        };
    }

    /**
     * Function to handle the date parameter
     */
    if (dateParam) {
        const startDate = new Date(dateParam);
        const today = new Date();

        if (!isNaN(startDate)) {
            const duration = calculateDuration(startDate, today);
            document.querySelector(".date").innerText = formatDate(startDate);
            document.querySelector(".duration p").innerText = `${duration.years} Jahren, ${duration.months} Monaten und ${duration.days} Tagen`;
            document.querySelector(".conversion ul").innerHTML = `
                <li>${duration.totalMonths} Monaten</li>
                <li>oder ${duration.totalWeeks} Wochen</li>
                <li>oder ${duration.totalDays} Tagen</li>
            `;
        } else {
            document.querySelector(".date").innerText = "Ungültiges Datum!";
        }
    } else {
        document.querySelector(".date").innerText = "Kein Datum angegeben!";
    }

    /**
     * Function to handle the message parameter
     */
    if (messageParam) {
        const decodedMessage = decodeURIComponent(messageParam.replace(/\+/g, " ")); // Fix spaces
        document.getElementById("message").innerText = decodedMessage;
    } else {
        document.getElementById("message").innerText = "Keine Nachricht angegeben.";
    }

    // Call function to update image
    updateImage(nfcId);
});

/**
 * Function to calculate the duration between two dates
 */
function calculateDuration(startDate, endDate) {
    const years = endDate.getFullYear() - startDate.getFullYear();
    const months = endDate.getMonth() - startDate.getMonth() + years * 12;
    const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    let remainingMonths = months % 12;
    let remainingYears = Math.floor(months / 12);
    let remainingDays = days - (remainingYears * 365 + remainingMonths * 30);

    return {
        years: remainingYears,
        months: remainingMonths,
        days: remainingDays,
        totalMonths: months,
        totalWeeks: weeks,
        totalDays: days,
    };
}

/**
 * Function to format a date into DD. Monat YYYY
 */
function formatDate(date) {
    const months = [
        "Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}
