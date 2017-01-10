const applicationServerPublicKey = 'BJ9fT63NgZwfBYW_wnkFtCt8MFAcRy8Bu_Hl_C6I3sKljY3pQctRSth3e-NCbjn6WaGtI_eXfSpiWoQzqDOj1ZA';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
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
}

function initialiseUI() {
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
}

// function updateBtn() {
//     console.log(Notification.permission);
//     if (Notification.permission === 'denied') {
//         pushButton.textContent = 'Push Messaging Blocked.';
//         pushButton.disabled = true;
//         // updateSubscriptionOnServer(null);
//         return;
//     }
//
//     if (isSubscribed) {
//         pushButton.textContent = 'Disable Push Messaging';
//     } else {
//         pushButton.textContent = 'Enable Push Messaging';
//     }
//
//     pushButton.disabled = false;
// }

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

    // Alert allow notification
    swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
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
}

// function updateSubscriptionOnServer(subscription) {
//     // TODO: Send subscription to application server
//
//     const subscriptionJson = document.querySelector('.js-subscription-json');
//     const subscriptionDetails =
//         document.querySelector('.js-subscription-details');
//
//     if (subscription) {
//         subscriptionJson.textContent = JSON.stringify(subscription);
//         subscriptionDetails.classList.remove('is-invisible');
//     } else {
//         subscriptionDetails.classList.add('is-invisible');
//     }
// }


// if ('serviceWorker' in navigator && 'PushManager' in window){
//     console.log('Service Worker and Push is supported');
//     navigator.serviceWorker.register('./service-worker.js')
//         .then(function(reg){
//             console.log('Service Worker Registered', reg);
//
//             swRegistration = reg;
//             initialiseUI();
//         })
//         .catch(function(err){
//             console.log('Error registering Service Worker', err);
//         })
// } else {
//     console.warn('Push messaging is not supported');
//     pushButton.textContent = 'Push Not Supported';
// }

if('serviceWorker' in navigator){
    navigator.serviceWorker.register(`./service-worker.js`)
        .then((reg) => {
            console.log('Service Worker Registered', reg);
        })
        .catch((err) => {
            console.log('Error registering Service Worker', err);
        })
}