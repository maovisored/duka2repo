import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import { logger } from "../utils/logger.js";

/* ===================== */
/* GET USER BY PHONE */
/* ===================== */
export async function getUserByPhone(phone) {
  const result = await pool.query(
    "SELECT * FROM users WHERE phone = $1",
    [phone]
  );
  return result.rows[0];
}

/* ===================== */
/* GET ALL CUSTOMERS (FOR /users) */
/* ===================== */
export async function getAllUsers({ page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;

  const result = await pool.query(
    `
    SELECT 
      u.id,
      u.phone,
      u.first_name,
      u.last_name,

      COUNT(o.id) AS total_orders,
      COALESCE(SUM(o.amount), 0) AS total_spent

    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id
    GROUP BY u.id
    ORDER BY total_spent DESC
    LIMIT $1 OFFSET $2;
    `,
    [limit, offset]
  );

  return result.rows;
}

/* ===================== */
/* GET CUSTOMER STATS (FOR /users/stats) */
/* ===================== */
export async function getUserStats() {
  const result = await pool.query(`
    SELECT 
      COUNT(*) AS total,
      COUNT(CASE WHEN t.total_orders > 0 THEN 1 END) AS active,
      COUNT(CASE WHEN u.created_at >= NOW() - INTERVAL '7 days' THEN 1 END) AS new,
      COALESCE(MAX(t.total_spent), 0) AS top_spender

    FROM users u
    LEFT JOIN (
      SELECT 
        user_id,
        COUNT(*) AS total_orders,
        SUM(amount) AS total_spent
      FROM orders
      GROUP BY user_id
    ) t ON t.user_id = u.id;
  `);

  return result.rows[0];
}

/* ===================== */
/* GET SINGLE CUSTOMER DETAILS */
/* ===================== */
export async function getUserDetails(id) {
  const userResult = await pool.query(
    `
    SELECT 
      u.id,
      u.phone,
      u.first_name,
      u.last_name,

      COALESCE(SUM(o.amount), 0) AS total_spent,
      COALESCE(AVG(o.amount), 0) AS avg_order,

      MAX(o.created_at) AS last_order

    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id
    WHERE u.id = $1
    GROUP BY u.id;
    `,
    [id]
  );

  const user = userResult.rows[0];

  if (!user) return null;

  const ordersResult = await pool.query(
    `
    SELECT 
      id,
      amount,
      status,
      created_at
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC;
    `,
    [id]
  );

  return {
    ...user,
    orders: ordersResult.rows,
  };
}

/* ===================== */
/* UPDATE USER PIN */
/* ===================== */
export async function updateUserPin(phone, pin) {
  const hashedPin = pin.startsWith("$2")
    ? pin
    : await bcrypt.hash(pin, 10);

  const result = await pool.query(
    `
    UPDATE users
    SET pin = $1
    WHERE phone = $2
    RETURNING *;
    `,
    [hashedPin, phone]
  );

  return result.rows[0];
}

/* ===================== */
/* UPDATE USER ROLE */
/* ===================== */
export async function updateUserRole(phone, role) {
  const result = await pool.query(
    `
    UPDATE users
    SET role = $1
    WHERE phone = $2
    RETURNING *;
    `,
    [role, phone]
  );

  return result.rows[0];
}

/* ===================== */
/* CREATE USER */
/* ===================== */
export async function createUser(user) {
  const {
    phone,
    pin,
    firstName,
    lastName,
    idNo,
    shopName,
    shopAddress,
    role = "user",
  } = user;

  const hashedPin = pin.startsWith("$2")
    ? pin
    : await bcrypt.hash(pin, 10);

  const result = await pool.query(
    `
    INSERT INTO users (
      phone,
      pin,
      first_name,
      last_name,
      id_no,
      shop_name,
      shop_address,
      role
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
    `,
    [
      phone,
      hashedPin,
      firstName,
      lastName || null,
      idNo || null,
      shopName || null,
      shopAddress || null,
      role,
    ]
  );

  return result.rows[0];
}