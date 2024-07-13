
let isRefreshing = false;
let refreshSubscribers = [];

function onTokenRefreshed(token) {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
    refreshSubscribers.push(callback);
}

async function refreshToken() {
    if (isRefreshing) {
        return new Promise(resolve => addRefreshSubscriber(resolve));
    }

    isRefreshing = true;

    try {
        const response = await fetch('/api/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            onTokenRefreshed(data.accessToken);
            return data.accessToken;
        } else {
            throw new Error('Failed to refresh token');
        }
    } finally {
        isRefreshing = false;
    }
}

async function fetchData(url, options = {}) {
    const accessToken = localStorage.getItem('accessToken');

    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (response.status === 401) { // Access token expired
        const newAccessToken = await refreshToken();
        response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${newAccessToken}`
            }
        });
    }

    return response.json();
}