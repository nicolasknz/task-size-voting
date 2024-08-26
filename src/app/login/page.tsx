import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { stringify } from "querystring";

const CHANNEL = "estimatives";
const EVENT = "event";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
});

const Notifications = () => {
  const [notifications, setNotifications] = useState<any>();

  useEffect(() => {
    const channel = pusher.subscribe(CHANNEL);

    channel.bind(EVENT, (data: any) => {
      setNotifications([...notifications, data]);
    });

    return () => {
      pusher.unsubscribe(CHANNEL);
    };
  }, [notifications]);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications &&
          notifications.map((notification: any) => (
            <li key={notification.id}>{notification.message}</li>
          ))}
      </ul>
    </div>
  );
};

export default Notifications;
