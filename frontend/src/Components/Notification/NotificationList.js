import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: token },
        });
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div>
      <h2>Your Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>
            {notification.message} - {new Date(notification.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
