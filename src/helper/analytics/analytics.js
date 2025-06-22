

// import axios from "axios";

// // Initialize Google Analytics
// const initializeAnalytics = async () => {
//   if (!window.dataLayer) {
//     window.dataLayer = [];
//   }

//   function gtag() {
//     window.dataLayer.push(arguments);
//   }

//   gtag("js", new Date());
//   gtag("config", "G-Y7JFCH1TE5", { debug_mode: true }); // Replace with your GA4 tracking ID

//   try {
//     // Wait for location data to resolve
//     const location = await getLocationData(); 
//     const pageViewData = {
//       pageUrl: window.location.pathname + window.location.search, // Current page URL
//       referrer: document.referrer || "unknown", // Referrer URL
//       timestamp: new Date().toISOString(), // Timestamp of the visit
//       location: `${location.city}, ${location.country}`, // Location as a string
//       userId: getUserId(), // User ID, if available
//       ip: location.ip, // IP address from location data
//     };

//     console.log("Page View Data:", pageViewData); // Debugging

//     // Track the page view in Google Analytics
//     gtag("event", "page_view", {
//       page_title: document.title,
//       page_location: window.location.href,
//       page_path: pageViewData.pageUrl,
//       user_id: pageViewData.userId,
//       referrer: pageViewData.referrer,
//       timestamp: pageViewData.timestamp,
//       location: pageViewData.location,
//       ip: pageViewData.ip, // IP may not be stored in GA due to privacy restrictions
//     });

//     // Optionally send additional events
//     gtag("event", "custom_data", {
//       category: "User Location",
//       action: "Page View",
//       label: `Location: ${pageViewData.location}`,
//     });
//   } catch (error) {
//     console.error("Error saving page view data:", error);
//   }
// };

// // Get location data (latitude, longitude, IP, country, city)
// const getLocationData = () => {
//   return new Promise((resolve, reject) => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           try {
//             const ipResponse = await axios.get("https://api.ipify.org?format=json");
//             const userIp = ipResponse.data.ip;

//             const locationResponse = await axios.get(`http://ip-api.com/json/${userIp}`);
//             console.log('locationResponse',locationResponse);
//             resolve({
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//               country: locationResponse.data.country|| "Unknown",
//               city: locationResponse.data.city || "Unknown",
//               ip: userIp,
//             });
//           } catch (error) {
//             console.error("Error fetching location data:", error);
//             resolve({
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//               country: "Unknown",
//               city: "Unknown",
//               ip: "Unknown",
//             });
//           }
//         },
//         (error) => {
//           console.error("Geolocation error:", error);
//           reject(new Error("Geolocation failed"));
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported.");
//       resolve({
//         latitude: null,
//         longitude: null,
//         country: "Unknown",
//         city: "Unknown",
//         ip: "Unknown",
//       });
//     }
//   });
// };

// // Get the user ID from localStorage or other source
// const getUserId = () => {
//   return localStorage.getItem("userId") || null;
// };

// export default initializeAnalytics;



const handleGoogleAnalytics = (trackingId) => {
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  script.async = true;
  document.head.appendChild(script);


  // Initialize Google Analytics
  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", trackingId, { debug_mode: true });
  };
};

export default handleGoogleAnalytics;
