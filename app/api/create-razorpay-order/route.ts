import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    if (
      !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      !process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET
    ) {
      throw new Error(
        "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be provided"
      );
    }
    const { amount, currency } = await req.json();
    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: currency,
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });
    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error) {
    console.log("Error while creating order", error);
    return NextResponse.json(
      { error: "Error while creating order" },
      { status: 500 }
    );
  }
}
