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
/* GET ALL CUSTOMERS (WITH STATS) */
/* ===================== */
export async function getCustomers() {
  const result = await pool.query(`
    SELECT 
      u.id,
      u.phone,
      u.first_name,
      u.last_name,
      u.role,
      u.created_at,

      COUNT(o.id) AS total_orders,
      COALESCE(SUM(o.amount), 0) AS total_spent

    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id
    GROUP BY u.id
    ORDER BY total_spent DESC;
  `);

  return result.rows;
}

/* ===================== */
/* GET SINGLE CUSTOMER */
/* ===================== */
export async function getCustomerById(id) {
  const result = await pool.query(
    `
    SELECT 
      u.id,
      u.phone,
      u.first_name,
      u.last_name,
      u.role,
      u.created_at,

      COUNT(o.id) AS total_orders,
      COALESCE(SUM(o.amount), 0) AS total_spent

    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id
    WHERE u.id = $1
    GROUP BY u.id;
    `,
    [id]
  );

  return result.rows[0];
}

/* ===================== */
/* GET CUSTOMER ORDERS */
/* ===================== */
export async function getCustomerOrders(id) {
  const result = await pool.query(
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

  return result.rows;
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