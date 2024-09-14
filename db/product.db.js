const pool = require("../config");

const getAllProductsDb = async ({ limit, offset }) => {
  const { rows } = await pool.query(
    `select products.*, trunc(avg(reviews.rating)) as avg_rating, count(reviews.*) from products
        LEFT JOIN reviews
        ON products.product_id = reviews.product_id
        group by products.product_id limit $1 offset $2 `,
    [limit, offset]
  );
  const products = [...rows].sort(() => Math.random() - 0.5);
  return products;
};

const getFilesForProduct = async (productId) => {
  const query = `
    SELECT
      file_id,
      file_url,
      file_type,
      ismain
    FROM product_files
    WHERE product_id = $1;
  `;

  const { rows } = await pool.query(query, [productId]);
  return rows;
};


const createProductDb = async ({ name, slug, price, description, image_url,video_url,self_price, files }) => {
  console.log('createProductDb',files);
  const { rows: product } = await pool.query(
    "INSERT INTO products(name, slug, price, description, image_url, video_url, self_price) VALUES($1, $2, $3, $4, $5, $6, $7) returning *",
    [name, slug, price, description, image_url, video_url, self_price]
  );
  const productId = product[0].product_id;

  for (const file of files) {
      await pool.query(
        "INSERT INTO product_files(product_id, file_url, file_type, ismain) VALUES($1, $2, $3, $4)",
        [productId, file.name, file.type, file.isMain]
      );
    }

  return product[0];
};


const getProductDb = async (id) => {
  console.log('getProductDb',id);
  const { rows: product } = await pool.query(
    `select products.*, trunc(avg(reviews.rating),1) as avg_rating, count(reviews.*) from products
        LEFT JOIN reviews
        ON products.product_id = reviews.product_id
        where products.product_id = $1
        group by products.product_id`,
    [id]
  );
  return product[0];
};

const getProductBySlugDb = async ({ slug }) => {
  const { rows: product } = await pool.query(
    `select products.*, trunc(avg(reviews.rating),1) as avg_rating, count(reviews.*) from products
        LEFT JOIN reviews
        ON products.product_id = reviews.product_id
        where products.slug = $1
        group by products.product_id`,
    [slug]
  );
  return product[0];
};

const getProductByNameDb = async ({ name }) => {
  const { rows: product } = await pool.query(
    `select products.*, trunc(avg(reviews.rating),1) as avg_rating, count(reviews.*) from products
        LEFT JOIN reviews
        ON products.product_id = reviews.product_id
        where products.name = $1
        group by products.product_id`,
    [name]
  );
  return product[0];
};

const updateProductDb = async ({ name, price, description, image_url, id }) => {
  const { rows: product } = await pool.query(
    "UPDATE products set name = $1, price = $2, description = $3 image_url = $4 where product_id = $5 returning *",
    [name, price, description, image_url, id]
  );
  return product[0];
};

const deleteProductDb = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM products where product_id = $1 returning *",
    [id]
  );
  return rows[0];
};

module.exports = {
  getProductDb,
  getProductByNameDb,
  createProductDb,
  updateProductDb,
  deleteProductDb,
  getAllProductsDb,
  getProductBySlugDb,
  getFilesForProduct
};
