
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // כתובת השרת שלך
  withCredentials: true, // שולח קוקיז אוטומטית
});

// אפשר להוסיף interceptor אם רוצים טיפול בשגיאות גלובליות
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("401 Unauthorized – המשתמש לא מחובר");
      // ניתן לטפל כאן ב־logout או navigation אם צריך
    }
    return Promise.reject(error);
  }
);

export default api; // חייב להיות default export




