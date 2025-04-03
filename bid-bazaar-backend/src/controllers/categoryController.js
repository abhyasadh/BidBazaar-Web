const db = require("../database/database.js");
const { Specifications } = require("../models/models.js");

const getCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      `SELECT id, name, color, image FROM category`
    );
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
  const rows = await Specifications.query(
    `
        SELECT 
            specifications.id AS specificationId, 
            specifications.name, 
            specifications.hintText, 
            specifications.required, 
            specifications.type, 
            options.id AS optionId, 
            options.name AS optionName
        FROM specifications 
        LEFT JOIN options ON specifications.id = options.specificationID
        WHERE specifications.categoryId = ?;`,
    [categoryId]
  );

  const specificationsMap = new Map();

  rows.forEach((row) => {
    if (!specificationsMap.has(row.specificationId)) {
      specificationsMap.set(row.specificationId, {
        id: row.specificationId,
        name: row.name,
        hintText: row.hintText,
        required: row.required,
        type: row.type,
        options: [],
      });
    }

    if (row.optionId) {
      specificationsMap.get(row.specificationId).options.push({
        value: row.optionName,
        label: row.optionName,
      });
    }
  });

  const specifications = Array.from(specificationsMap.values());

  return specifications;
};

module.exports = { getCategories, getSpecifications, specificationList };
