// service-worker.js

self.addEventListener('push', event => {
    const data = event.data.json();
    
    self.registration.showNotification('Medication Reminder', {
        body: `It's time to take your medication: ${data.medicine}`,
    });
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    // You can add custom logic for notification click event if needed.
});
