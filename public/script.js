document.addEventListener("DOMContentLoaded", async () => {
    const imageElement = document.getElementById("user-image");
    const urlParams = new URLSearchParams(window.location.search);
    const nfcId = urlParams.get("nfc");

    if (nfcId) {
        try {
            const response = await fetch(`/uploads/${nfcId}.json`);
            if (!response.ok) throw new Error("Data not found");

            const data = await response.json();
            imageElement.src = data.imageUrl;
            document.querySelector(".date").innerText = formatDate(new Date(data.date));
            document.getElementById("message").innerText = data.message;

            const duration = calculateDuration(new Date(data.date), new Date());
            document.getElementById("duration").innerText = `${duration.years} Jahren, ${duration.months} Monaten und ${duration.days} Tagen`;
            document.getElementById("conversion-list").innerHTML = `
                <li>${duration.totalMonths} Monaten</li>
                <li>oder ${duration.totalWeeks} Wochen</li>
                <li>oder ${duration.totalDays} Tagen</li>
            `;
        } catch (error) {
            console.error("Error fetching user data:", error);
            imageElement.src = "default.png";
            document.querySelector(".date").innerText = "Kein Datum angegeben!";
            document.getElementById("message").innerText = "Keine Nachricht angegeben.";
            document.getElementById("duration").innerText = "Kein Datum angegeben!";
            document.getElementById("conversion-list").innerHTML = "";
        }
    } else {
        imageElement.src = "default.png";
        document.querySelector(".date").innerText = "Kein Datum angegeben!";
        document.getElementById("message").innerText = "Keine Nachricht angegeben.";
        document.getElementById("duration").innerText = "Kein Datum angegeben!";
        document.getElementById("conversion-list").innerHTML = "";
    }
});

/**
 * Function to calculate the duration between two dates
 */
/**
 * Function to calculate the duration between two dates
 */
function calculateDuration(startDate, endDate) {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth() + years * 12;
    let days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    let weeks = Math.floor(days / 7);

    // Ensure no negative values
    years = Math.max(0, years);
    months = Math.max(0, months);
    days = Math.max(0, days);
    weeks = Math.max(0, weeks);

    let remainingMonths = months % 12;
    let remainingYears = Math.floor(months / 12);
    let remainingDays = days - (remainingYears * 365 + remainingMonths * 30);

    // Ensure no negative remaining values
    remainingYears = Math.max(0, remainingYears);
    remainingMonths = Math.max(0, remainingMonths);
    remainingDays = Math.max(0, remainingDays);

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
