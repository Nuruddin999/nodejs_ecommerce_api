const pool = require("../config");
const uploadFile = require("../middleware/upload");
const productService = require("../services/product.service");
const { getFilesForProduct } = require("../db/product.db");
const { ErrorHandler } = require("../helpers/error");

const getAllProducts = async (page) => {
  const products = await productService.getAllProducts(page);
  return await Promise.all(products.map(async (product) => {
    const files = await getFilesForProduct(product.product_id);
    return {
      ...product,
      files,
    };
  }));
};

const getAllProductsAdmin = async (req,res) => {
  const { page = 1 } = req.query;
  const productsWithFiles = await getAllProducts(page);
  return res.status(200).json(productsWithFiles);
};

const createProduct = async (req, res) => {
  try {
    const files = await uploadFile(req, res)
    const isMainArray = req.body.isMain === 'true' ? [req.body.isMain] : req.body.isMain;
    const processedFiles = files.map((file, index) => {
      return {
        ...file,
        isMain: isMainArray[index] === 'true',
      };
    });
   await productService.addProduct({ ...req.body, files: processedFiles });
    res.status(200).json({ newPr: 'ok' });
  } catch (e) {
    res.status(e.statusCode || 500).json({ status: 'error', message: e.message });
  }
};

const getProduct = async (req, res) => {
  const product = await productService.getProductById(req.params);
  res.status(200).json(product);
};

const getProductBySlug = async (req, res) => {
  const product = await productService.getProductBySlug(req.params);
  res.status(200).json(product);
};

const getProductByName = async (req, res) => {
  const product = await productService.getProductByName(req.params);
  res.status(200).json(product);
};
const updateProduct = async (req, res) => {
  const { name, price, description } = req.body;
  const { id } = req.params;

  const updatedProduct = await productService.updateProduct({
    name,
    price,
    description,
    id,
  });
  res.status(200).json(updatedProduct);
};

const deleteProduct = async (req, res) => {
  console.log('deleteProduct');
  const { id } = req.params;
  console.log('deleteProduct',id);
  const deletedProduct = await productService.removeProduct(id);
  res.status(200).json(deletedProduct);
};

// TODO create a service for reviews

const getProductReviews = async (req, res) => {
  const { product_id, user_id } = req.query;
  try {
    // check if current logged user review exist for the product
    const reviewExist = await pool.query(
      "SELECT EXISTS (SELECT * FROM reviews where product_id = $1 and user_id = $2)",
      [product_id, user_id]
    );

    // get reviews associated with the product
    const reviews = await pool.query(
      `SELECT users.fullname as name, reviews.* FROM reviews
        join users 
        on users.user_id = reviews.user_id
        WHERE product_id = $1`,
      [product_id]
    );
    res.status(200).json({
      reviewExist: reviewExist.rows[0].exists,
      reviews: reviews.rows,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const createProductReview = async (req, res) => {
  const { product_id, content, rating } = req.body;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO reviews(user_id, product_id, content, rating) 
       VALUES($1, $2, $3, $4) returning *
      `,
      [user_id, product_id, content, rating]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.detail);
  }
};

const updateProductReview = async (req, res) => {
  const { content, rating, id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE reviews set content = $1, rating = $2 where id = $3 returning *
      `,
      [content, rating, id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  getProductByName,
  getProductBySlug,
  getProductReviews,
  updateProductReview,
  createProductReview,
};
