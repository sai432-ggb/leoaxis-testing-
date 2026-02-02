const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://leoaxis-backend.onrender.com/'; // We will get this real URL in Step 3

export default API_URL;