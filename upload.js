document.addEventListener("DOMContentLoaded", () => {
    const imageUploadInput = document.getElementById("image-upload");
    const uploadStatus = document.getElementById("upload-status");
    const uploadButton = document.getElementById("upload-btn");

    uploadButton.addEventListener("click", async () => {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const date = document.getElementById("date").value;
        const message = document.getElementById("message").value.trim();
        const files = imageUploadInput.files;

        if (!name || !email || !date || !message) {
            alert("Please enter your name, email, date, and message.");
            return;
        }

        if (files.length === 0) {
            alert("Please upload at least one image.");
            return;
        }

        if (files.length > 3) {
            alert("You can only upload up to 3 images.");
            return;
        }

        // Generate Unique NFC ID
        const uniqueId = "NFC" + Date.now();

        // Create FormData to send files & user data
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("date", date);
        formData.append("message", message);
        formData.append("nfcId", uniqueId);

        for (let i = 0; i < files.length; i++) {
            formData.append("image", files[i]);
        }

        try {
            uploadStatus.innerText = "Uploading...";
            const response = await fetch("http://localhost:8080/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();
            uploadStatus.innerText = result.message;
        } catch (error) {
            uploadStatus.innerText = "Upload failed. Please try again.";
            console.error("Upload error:", error);
        }
    });
});
