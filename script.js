document.addEventListener("DOMContentLoaded", async () => {
    const imageElement = document.getElementById("user-image");
    const urlParams = new URLSearchParams(window.location.search);
    const nfcId = urlParams.get("nfc");
    const dateParam = urlParams.get("date");
    const messageParam = urlParams.get("message");

    /**
     * Function to update the image dynamically from NFC ID or latest upload
     */
    async function updateImage(nfcId) {
        if (nfcId) {
            // Load image from NFC ID
            const imagePath = `https://fn747.github.io/images/${nfcId}.png`;
            imageElement.src = imagePath;

            // Handle missing image
            imageElement.onerror = () => {
                imageElement.src = "https://fn747.github.io/images/default.png"; // Fallback image
            };
        } else {
            // Fetch latest uploaded image if no NFC ID is provided
            try {
                const response = await fetch("http://localhost:8080/latest-upload");
                const data = await response.json();

                if (data.imageUrl) {
                    imageElement.src = data.imageUrl;
                } else {
                    imageElement.src = "https://fn747.github.io/images/default.png";
                }

                imageElement.onerror = () => {
                    imageElement.src = "https://fn747.github.io/images/default.png";
                };

                // Update date and message from latest upload
                document.querySelector(".date").innerText = data.date || "Kein Datum angegeben!";
                document.getElementById("message").innerText = data.message || "Keine Nachricht angegeben.";

                // Calculate relationship duration
                if (data.date) updateRelationshipDuration(data.date);
            } catch (error) {
                console.error("Error fetching latest upload:", error);
            }
        }
    }

    /**
     * Function to handle the date parameter from URL
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
    }

    /**
     * Function to handle the message parameter from URL
     */
    if (messageParam) {
        const decodedMessage = decodeURIComponent(messageParam.replace(/\+/g, " "));
        document.getElementById("message").innerText = decodedMessage;
    }

    // Call function to update image (NFC-based or latest)
    await updateImage(nfcId);
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

/**
 * Function to update relationship duration
 */
function updateRelationshipDuration(startDate) {
    if (!startDate) return;

    const start = new Date(startDate);
    const today = new Date();

    if (isNaN(start)) {
        document.getElementById("duration").innerText = "Ungültiges Datum!";
        return;
    }

    const years = today.getFullYear() - start.getFullYear();
    const months = today.getMonth() - start.getMonth() + years * 12;
    const days = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    document.getElementById("duration").innerText = `${years} Jahren, ${months % 12} Monaten und ${days % 30} Tagen`;

    // Update conversion section
    document.getElementById("conversion-list").innerHTML = `
        <li>${months} Monaten</li>
        <li>oder ${weeks} Wochen</li>
        <li>oder ${days} Tagen</li>
    `;
}
