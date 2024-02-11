// Modify the addMedication function to send data to the server
async function addMedication() {
    // Get values from the form

    const medicine = document.getElementById("medicine").value;
    const time = document.getElementById("time").value;
    const daysCheckboxes = document.querySelectorAll('#days input[type="checkbox"]:checked');
    const days = Array.from(daysCheckboxes).map(checkbox => checkbox.value).join(', ');

    // Validate inputs
    if (!medicine || !time || daysCheckboxes.length === 0) {
        alert("Please fill in all fields and select at least one day.");
        return;
    }

    // Send the medication data to the server
    try {
        await fetch('/addMedication', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ medicine, time, days }),
        });
scheduleNotification(time);
        // Refresh the medication table
        fetchUserMedications();
    } catch (error) {
        console.error(error);
        alert("Failed to add medication. Please try again.");
    }

    // Clear the form
    document.getElementById("medicine").value = "";
    document.getElementById("time").value = "";
    daysCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    function scheduleNotification(time) {
        const now = new Date();
        const reminderDate = new Date(time);
    
        // Calculate time difference in milliseconds
        const timeDifference = reminderDate.getTime() - now.getTime();
    
        if (timeDifference > 0) {
            // Schedule the notification with the calculated time difference
            setTimeout(() => {
                showNotification();
            }, timeDifference);
        }
    }
    
}

// Function to show a notification
function showNotification() {
    // Check if the browser supports notifications
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Medication Reminder', {
                    body: 'It\'s time to take your medication.',
                });
            }
        });
    }
}


// Fetch user medications from the server and update the table
// Fetch user medications from the server and update the table
async function fetchUserMedications() {
    try {
        const response = await fetch('/getUserMedications');
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const medications = await response.json();

        // Update the medication table
        const table = document.getElementById("userMedicationTable").getElementsByTagName('tbody')[0];
        table.innerHTML = ""; // Clear existing rows

        medications.forEach(medication => {
            const newRow = table.insertRow(table.rows.length);
            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(2);

            cell1.innerHTML = medication.medicine;
            cell2.innerHTML = medication.time;
            cell3.innerHTML = medication.days;
        });
    } catch (error) {
        console.error(error);
        alert("Failed to fetch user medications. Please try again.");
    }
}


// Fetch user medications when the page loads
document.addEventListener("DOMContentLoaded", fetchUserMedications);

// Placeholder function for searching medicine information
function searchMedicineInfo() {
    // Implement your logic to fetch and display medicine information here
    var searchMedicine = document.getElementById('searchMedicine').value;

    // Placeholder: Displaying a message
    var medicineInfoContainer = document.getElementById('medicineInfo');
    medicineInfoContainer.innerHTML = "<p>Medicine information for '" + searchMedicine + "' will be displayed here.</p>";
}
// med1.js

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
}
