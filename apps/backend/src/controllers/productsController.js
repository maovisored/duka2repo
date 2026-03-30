import db from "../config/db.js";

// ==============================
// GET FULL PRODUCT TREE
// ==============================
export const getFullProducts = async (req, res) => {
  try {
    const products = await db.query(`SELECT * FROM products ORDER BY id ASC`);

    const result = [];

    for (const p of products.rows) {
      const variations = await db.query(
        `SELECT * FROM product_variations WHERE product_id = $1`,
        [p.id]
      );

      const varList = [];

      for (const v of variations.rows) {
        const weights = await db.query(
          `SELECT * FROM product_weights WHERE variation_id = $1`,
          [v.id]
        );

        varList.push({
          ...v,
          weights: weights.rows
        });
      }

      result.push({
        ...p,
        variations: varList
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// ==============================
// CREATE PRODUCT
// ==============================
export const createProduct = async (req, res) => {
  try {
    const { name, category } = req.body;

    const newProduct = await db.query(
      `INSERT INTO products (name, category)
       VALUES ($1, $2)
       RETURNING *`,
      [name, category]
    );

    res.json(newProduct.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

// ==============================
// UPDATE PRODUCT
// ==============================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, active } = req.body;

    const updated = await db.query(
      `UPDATE products
       SET name = $1, active = $2
       WHERE id = $3
       RETURNING *`,
      [name, active, id]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};