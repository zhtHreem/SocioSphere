import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: token },
        });
        const unread = response.data.filter((notification) => !notification.isRead);
        setUnreadCount(unread.length);
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    };

    fetchUnreadCount();
  }, []);

  return (
    <button>
      <i className="fa fa-bell"></i>
      {unreadCount > 0 && <span>{unreadCount}</span>}
    </button>
  );
};

export default NotificationBell;
