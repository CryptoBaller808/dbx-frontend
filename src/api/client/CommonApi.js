const API_BASE_URL = process.env.REACT_APP_API_URL;

const client = async ({
    body,
    url,
    method,
    headers = {},
    withCredentials = false,
}) => { 
    const token = localStorage.getItem("access_token");

    // Merge default headers with any provided headers
    const requestHeaders = {
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...headers,
    };

    // Add authorization token if available
    if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
    }

    // Conditionally set Content-Type for POST method
    if (
        (method === "POST" || method === "PATCH" || method === "DELETE") &&
        body &&
        !(body instanceof FormData)
    ) {
        requestHeaders["Content-Type"] = "application/json";
    }

    // Fetch configuration
    const fetchConfig = {
        method,
        headers: requestHeaders,
        mode: 'cors', // Explicitly set CORS mode
        credentials: withCredentials ? 'include' : 'same-origin', // Handle credentials
        body: body
            ? body instanceof FormData
                ? body
                : JSON.stringify(body)
            : undefined,
    };

    try {
        const response = await fetch(API_BASE_URL + url, fetchConfig);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (parseError) {
                // If response is not JSON, create a generic error
                errorData = { 
                    msg: `HTTP ${response.status}: ${response.statusText}`,
                    status: response.status 
                };
            }
            throw new Error(errorData.msg || errorData.message || "An error occurred");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        
        // Handle specific CORS errors
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            throw new Error('Network error: Please check your connection and try again');
        }
        
        throw error;
    }
};

export const httpClient = {
    get: async (url, body, headers = {}, withCredentials = false) => 
        client({ url, method: "GET", body, headers, withCredentials }),
    post: async (url, body, headers = {}, withCredentials = false) => 
        client({ url, method: "POST", body, headers, withCredentials }),
    patch: async (url, body, headers = {}, withCredentials = false) => 
        client({ url, method: "PATCH", body, headers, withCredentials }),
    delete: async (url, body, headers = {}, withCredentials = false) => 
        client({ url, method: "DELETE", body, headers, withCredentials }),
};
