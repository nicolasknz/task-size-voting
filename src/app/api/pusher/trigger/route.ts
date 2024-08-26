import { NextResponse } from "next/server";
import { getPusherInstance } from "@/libs/pusher/server";

const pusherServer = getPusherInstance();

const CHANNEL = "estimatives";
const EVENT = "event";

export async function POST(req: Request) {
  try {
    // Parse the request body to get the message and user parameters
    const { message, user } = await req.json();

    // Validate the input
    if (typeof message !== "string" || typeof user !== "string") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // Trigger the event
    await pusherServer.trigger(CHANNEL, EVENT, {
      message,
      user,
      date: new Date().toISOString(), // Format the date as a string
    });

    return NextResponse.json({ message: "Sockets tested" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to test sockets", error: error },
      { status: 500 }
    );
  }
}
