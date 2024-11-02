const {
  Product, ProductFile
} = require("../models");
const uploadFile = require("../middlewares/upload");

class ProductController {
  async create(req, res, next) {
    try {
      await uploadFile(req, res);
      const {
        name,
        description,
        selfPrice,
        price,
        type,
        category,
        mainThumbUrl,
        mainThumbType,
        isForStartPage
      } = req.body;
      const productData = await Product.create({
        name,
        description,
        selfPrice,
        price,
        type,
        category,
        mainThumbUrl,
        mainThumbType,
        isForStartPage: Boolean(isForStartPage)
      });
      for (const single_file of req.files) {
        await ProductFile.create({
          url: `/uploads/${single_file.originalname}`,
          productId: productData.id,
          type: single_file.mimetype
        });
      }
      return res.json({ success: "ok" });
    } catch (e) {
      next(e);
    }
  }

  getAll = async (page, limit) => {
    try {
      const offset = page * limit - limit;
      return await Product.findAndCountAll({
        limit, offset
      });
    } catch (e) {

    }
  };

  getAllFeatured = async (page, limit) => {
    try {
      const offset = page * limit - limit;
      const list = await Product.findAndCountAll({
        where: { isForStartPage: true },
        limit, offset
      });
      const { name, price, mainThumbUrl } = list
      return { name, price, mainThumbUrl }
    } catch (e) {

    }
  };

  fetchAll = async (req, res, next) => {
    try {
      const { page, limit } = req.query
      const data = await this.getAll(page, limit);
      console.log("data", data);
      return res.json(data);
    } catch (e) {
      next(e);
    }
  };

  fetchAllForStart = async (req, res, next) => {
    try {
      const { page, limit } = req.query
      const data = await this.getAllFeatured(page, limit);
      return res.json(data);
    } catch (e) {
      next(e);
    }
  };

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      await Product.destroy({ where: { id } })
      return res.json({ deleted: 'ok' });
    } catch (e) {
      next(e);
    }
  }

  getOne = async (id) => {
    try {
      return await Product.findOne({
        where: { id }, include: [
          {
            model: ProductFile,
            separate: true
          },
        ]
      })
    } catch (e) {
    }
  }

  getOneAdm = async (req, res, next) => {
    try {
      const { id } = req.params;
      const productData = await this.getOne(id)

      return res.json(productData);
    } catch (e) {
      next(e);
    }
  }


}


module.exports = new ProductController();
