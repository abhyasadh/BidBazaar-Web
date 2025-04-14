const { Category } = require("../services/categoryServices.js");
const { Specifications } = require("../services/specificationServices.js");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll(["id", "name", "color", "image"]);
    return res.status(200).json({ success: true, categories: categories });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
    return false;
  }
};

const getSpecifications = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const specifications = await specificationList(categoryId);
    return res.status(200).json({ success: true, specifications });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
};

const specificationList = async (categoryId) => {
  return await Specifications.getSpecifications(categoryId);
};

module.exports = { getCategories, getSpecifications, specificationList };
