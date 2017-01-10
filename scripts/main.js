console.log(`Test from main.js`);

const applicationServerPublicKey = 'BJ9fT63NgZwfBYW_wnkFtCt8MFAcRy8Bu_Hl_C6I3sKljY3pQctRSth3e-NCbjn6WaGtI_eXfSpiWoQzqDOj1ZA';

let isSubscribed = false;
let swRegistration = null;

const urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const initialiseUI = () => {
    console.log(Notification.permission);
    subscribeUser();

    // Set the initial subscription value
    swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            isSubscribed = !(subscription === null);

            // updateSubscriptionOnServer(subscription);

            if (isSubscribed) {
                console.log('User IS subscribed.');
            } else {
                console.log('User is NOT subscribed.');
            }

            // updateBtn();
        });
};

const subscribeUser = () => {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

    // Alert allow notification
    swRegistration.pushManager.subscribe({
            userVisibleOnly: true
        })
        .then(function(subscription) {
            console.log('User is subscribed:', subscription);
            // updateSubscriptionOnServer(subscription);

            isSubscribed = true;

            // updateBtn();
        })
        .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
            // updateBtn();
        });
};


if('serviceWorker' in navigator && 'PushManager' in window){
    navigator.serviceWorker.register(`./service-worker.js`)
        .then((reg) => {
            console.log('Service Worker Registered', reg);
            swRegistration = reg;
            initialiseUI();
        })
        .catch((err) => {
            console.log('Error registering Service Worker', err);
        })
}
