import PusherClient from "pusher-js";

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY || "d9c0b055e27749ccc350",
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "sa1",
    authEndpoint: "/api/pusher/auth",
  }
);
