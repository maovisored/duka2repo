import express from "express";
import fetch from "node-fetch";
import { updateOrder } from "../orders/orderService.js";

const router = express.Router();

async function logToServer(level, message, data) {
  try {
    await fetch("http://localhost:5001/log", {
      method: "POST",
headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("duka2_token")}`
},
      body: JSON.stringify({ level, message, data }),
    });
  } catch (err) {
    console.error("[WARN] Failed to log to logger server:", err);
  }
}

// STK Push callback
router.post("/payments/callback", async (req, res) => {
  const receivedAt = new Date().toISOString();
  try {
    const callbackData = req.body;
    console.log(`[CALLBACK][${receivedAt}] Received STK callback`, callbackData);
    await logToServer("INFO", "STK CALLBACK RECEIVED", { callbackData, receivedAt });

    const stkCallback = callbackData?.Body?.stkCallback;
    if (!stkCallback) return res.status(400).json({ message: "Invalid callback payload" });

    const { ResultCode, CheckoutRequestID, ResultDesc, CallbackMetadata } = stkCallback;

    const meta = {};
    if (CallbackMetadata?.Item) {
      CallbackMetadata.Item.forEach(item => meta[item.Name] = item.Value);
    }

    const status = ResultCode === 0 ? "SUCCESS" : "FAILED";
    const message = ResultCode === 0 ? "ASANTE! Your order has been confirmed." : "Payment failed. Please try again.";

    await updateOrder(CheckoutRequestID, {
      status,
      resultDesc: ResultDesc,
      callbackMeta: meta,
      message,
      updatedAt: receivedAt,
      mpesaResponse: callbackData
    });

    res.status(200).json({ message: "Callback processed successfully" });
  } catch (err) {
    console.error(`[CALLBACK] Error:`, err);
    await logToServer("ERROR", "Callback processing error", { message: err.message, stack: err.stack });
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get orders for user (new API)
router.get("/orders", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId required" });
  try {
    const { getOrdersByUser } = await import("./orderService.js");
    const orders = await getOrdersByUser(userId);
    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch orders", err);
    res.status(500).json({ error: err.message });
  }
});

export async function mpesaCallback(req, res) {
  const data = req.body;

  const checkoutId = data.CheckoutRequestID;

  const status = data.ResultCode === 0 ? "SUCCESS" : "FAILED";

  await pool.query(
    `UPDATE orders
     SET status = $1,
         mpesa_response = $2,
         callback_meta = $3,
         message = $4
     WHERE checkout_request_id = $5`,
    [status, data, data, data.ResultDesc, checkoutId]
  );

  res.sendStatus(200);
}

export default router;