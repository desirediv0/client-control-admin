import { PaymentDetails } from "@/types/type";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (details: PaymentDetails) => {
  const {
    amount,
    currency = "INR",
    name,
    description,
    email,
    phone,
    themeColor = "#3399cc",
  } = details;

  // Load Razorpay script if not already loaded
  if (typeof window.Razorpay === "undefined") {
    await loadRazorpayScript();
  }

  try {
    // Create an order
    const response = await fetch("/api/create-razorpay-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, currency }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create order");
    }

    // Initialize Razorpay
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100, // amount in paise
      currency: currency,
      name: name,
      description: description,
      order_id: data.orderId,
      handler: function (response: any) {
        console.log("Payment successful", response);
        // Handle successful payment (e.g., update UI, send to server)
      },
      prefill: {
        name: name,
        email: email,
        contact: phone,
      },
      theme: {
        color: themeColor,
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Error while initiating payment", error);
    alert("Error while initiating payment");
  }
};

// const handlePayment = () => {
//     initiateRazorpayPayment({
//       amount: 100,
//       name: "Your Store Name",
//       description: "Payment for your order",
//       email: "customer@example.com",
//       phone: "9876543210", // optional
//     });
//   };
