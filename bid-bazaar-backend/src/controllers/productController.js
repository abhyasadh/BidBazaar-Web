const fs = require("fs");
const { specificationList } = require("./categoryController");
require("../models/models");
const fileType = import("file-type");
const cloudinary = require("cloudinary");
const {
  Product,
  Images,
  ProductSpecifications,
  Saved,
} = require("../models/models");

const productPost = async (req, res) => {
  const {
    title,
    category,
    condition,
    description,
    price,
    minimumRaise,
    specifications,
  } = req.body;
  const { images } = req.files;
  const imageFiles = Array.isArray(images) ? images : images ? [images] : [];
  let imagesUrl = [];
  let validationErrors = [];

  if (
    !title ||
    !category ||
    !condition ||
    !description ||
    !price ||
    !minimumRaise
  ) {
    validationErrors.push("All fields are required!");
    return res.json({ success: false, message: validationErrors.join("\n") });
  }
  const requiredSpecs = await specificationList(category);
  const jsonSpecifications = JSON.parse(specifications);
  const jsonSpecificationsArray = Object.entries(jsonSpecifications).map(
    ([id, value]) => ({
      id: parseInt(id),
      value: value.trim(),
    })
  );

  requiredSpecs.forEach((requiredSpec) => {
    const spec = jsonSpecificationsArray.find((s) => s.id === requiredSpec.id);

    if (requiredSpec.required && (!spec || !spec.value)) {
      validationErrors.push(`Please provide a value for ${requiredSpec.name}!`);
    }

    if (requiredSpec.type === "select" && spec) {
      const validOption = requiredSpec.options.some(
        (o) => o.value === spec.value
      );
      if (!validOption) {
        validationErrors.push(`Invalid value for ${requiredSpec.name}!`);
      }
    }
  });
  if (
    (category && !Number.isInteger(Number(category))) ||
    (condition !== "Brand New" &&
      condition !== "Like New" &&
      condition !== "Used" &&
      condition !== "Not Working")
  ) {
    validationErrors.push(
      "You know what you did. Don't try to cheat the system!"
    );
  }
  if (requiredSpecs.length !== jsonSpecificationsArray.length) {
    validationErrors.push("An error occured!");
  }
  if (!Number.isInteger(Number(price))) {
    validationErrors.push("Price must be a number!");
  }
  if (!Number.isInteger(Number(minimumRaise))) {
    validationErrors.push("Raise must be a number!");
  }
  if (images.length === 0) {
    validationErrors.push("At least one image is required!");
  }
  for (const image of imageFiles) {
    const fileBuffer = fs.readFileSync(image.path);
    const mimeInfo = await (await fileType).fileTypeFromBuffer(fileBuffer);

    if (!mimeInfo || !mimeInfo.mime.startsWith("image/")) {
      validationErrors.push("Invalid file format. Please upload an image!");
    }
  }
  if (validationErrors.length > 0)
    return res.json({ success: false, message: validationErrors.join("\n") });

  try {
    const uploadPromises = imageFiles.map(async (image) => {
      const uploadedImage = await cloudinary.v2.uploader.upload(image.path, {
        folder: "Products",
        crop: "scale",
      });
      return uploadedImage.secure_url;
    });

    imagesUrl = await Promise.all(uploadPromises);
  } catch (e) {
    return res.json({ success: false, message: "File upload error!" });
  }

  const newProduct = {
    userId: req.session.user.id,
    categoryId: category,
    name: title,
    description: description,
    condition: condition,
    price: price,
    raise: minimumRaise,
  };

  try {
    const productId = await Product.insert(newProduct);

    if (jsonSpecificationsArray.length > 0) {
      const productSpecs = jsonSpecificationsArray.map((spec) => ({
        productId: productId,
        specificationId: spec.id,
        value: spec.value,
      }));
      await ProductSpecifications.insertBulk(productSpecs);
    }

    const productImages = imagesUrl.map((url) => ({
      productId: productId,
      imageURL: url,
    }));
    await Images.insertBulk(productImages);

    res.status(200).json({
      success: true,
      message: "Your product is now live!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getProducts = async (req, res) => {
  try {
    const rows = await Product.query(
      `SELECT 
            product.id AS productId,
            product.name,
            product.price as initPrice,
            product.createdAt,
            (SELECT imageURL FROM images WHERE images.productId = product.id LIMIT 1) AS imageURL,
            bidStats.bidCount,
            highestBid.price AS highestBid,
            highestBid.updatedAt AS highestBidUpdatedAt
        FROM product
        LEFT JOIN (
            SELECT productId, COUNT(id) AS bidCount
            FROM bids
            GROUP BY productId
        ) AS bidStats ON product.id = bidStats.productId
        LEFT JOIN (
            SELECT b1.productId, b1.price, b1.updatedAt
            FROM bids b1
            WHERE b1.price = (
                SELECT MAX(b2.price) 
                FROM bids b2 
                WHERE b2.productId = b1.productId
            )
            LIMIT 1
        ) AS highestBid ON product.id = highestBid.productId;`
    );

    const products = rows.map((row) => ({
      id: row.productId,
      name: row.name,
      price: row.initPrice,
      createdAt: row.createdAt,
      image: row.imageURL,
      bidCount: row.bidCount,
      highestBid: row.highestBid,
      highestBidUpdatedAt: row.highestBidUpdatedAt,
    }));
    return res.status(200).json({ success: true, products: products });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
    return false;
  }
};

const getProductById = async (req, res) => {
  const productId = req.params.productId;

  if (!req.session.viewedProducts?.includes(productId)) {
    req.session.viewedProducts = [
      ...(req.session.viewedProducts || []),
      productId,
    ];
    await Product.query(
      `
        UPDATE product 
        SET views = views + 1 
        WHERE id = ?
      `,
      [productId]
    );
  }

  if (!productId || !Number.isInteger(Number(productId))) {
    return res
      .status(400)
      .json({ success: false, message: "Product ID is required!" });
  }

  try {
    const [product] = await Product.query(
      `SELECT 
            p.id AS productId,
            p.name,
            p.description,
            p.price AS initPrice,
            p.condition,
            p.views,
            p.raise,
            p.createdAt,

            u.firstName,
            u.lastName,
            u.profileImageUrl,
            u.phone,
            u.verified,

            COALESCE(img.imageURLs, '[]') AS images,
            COALESCE(specs.specifications, '{}') AS specifications,

            bidStats.bidCount,
            highestBid.price AS highestBid,
            highestBid.updatedAt AS highestBidUpdatedAt

        FROM product p

        LEFT JOIN user u ON p.userId = u.id

        LEFT JOIN (
            SELECT productId, JSON_ARRAYAGG(imageURL) AS imageURLs
            FROM images
            GROUP BY productId
        ) AS img ON p.id = img.productId

        LEFT JOIN (
            SELECT 
                s.categoryId, 
                ps.productId, 
                JSON_OBJECTAGG(s.name, COALESCE(ps.value, 'N/A')) AS specifications
            FROM specifications s
            LEFT JOIN productSpecifications ps 
                ON s.id = ps.specificationId
            GROUP BY ps.productId, s.categoryId
        ) AS specs ON p.id = specs.productId AND p.categoryId = specs.categoryId

        LEFT JOIN (
            SELECT productId, COUNT(id) AS bidCount
            FROM bids
            GROUP BY productId
        ) AS bidStats ON p.id = bidStats.productId

        LEFT JOIN (
            SELECT b1.productId, b1.price, b1.updatedAt
            FROM bids b1
            WHERE b1.price = (
                SELECT MAX(b2.price) FROM bids b2 WHERE b2.productId = b1.productId
            )
            ORDER BY b1.updatedAt DESC
            LIMIT 1
        ) AS highestBid ON p.id = highestBid.productId

        WHERE p.id = ${productId};`
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    const finalProduct = {
      id: product.productId,
      name: product.name,
      description: product.description,
      price: product.initPrice,
      condition: product.condition,
      views: product.views,
      raise: product.raise,
      images: JSON.parse(product.images),
      createdAt: product.createdAt,
      user: {
        firstName: product.firstName,
        lastName: product.lastName,
        profileImageUrl: product.profileImageUrl,
        phone: product.phone,
        verified: product.verified,
      },
      specifications: JSON.parse(product.specifications),
      bidCount: product.bidCount,
      highestBid: product.highestBid,
      highestBidUpdatedAt: product.highestBidUpdatedAt,
    };
    return res.status(200).json({ success: true, product: finalProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
    return false;
  }
};

const filterProducts = async (req, res) => {
  const { categories, price, endsIn, sortBy, lowToHigh } = req.body;

  console.log(req.body);

  let query = `
        SELECT 
            product.id AS productId,
            product.name,
            COALESCE(highestBid.price, product.price) AS effectivePrice, 
            product.createdAt,
            (SELECT imageURL FROM images WHERE images.productId = product.id LIMIT 1) AS imageURL,
            bidStats.bidCount,
            highestBid.price AS highestBid,
            highestBid.updatedAt AS highestBidUpdatedAt,
            category.name AS categoryName,
    
            CASE 
                WHEN highestBid.updatedAt IS NOT NULL 
                THEN TIMESTAMPDIFF(MINUTE, NOW(), DATE_ADD(highestBid.updatedAt, INTERVAL 6 HOUR))
                ELSE TIMESTAMPDIFF(MINUTE, NOW(), DATE_ADD(product.createdAt, INTERVAL 24 HOUR))
            END AS remainingTime
    
        FROM product
        LEFT JOIN category ON product.categoryId = category.id
        LEFT JOIN (
            SELECT productId, COUNT(id) AS bidCount
            FROM bids
            GROUP BY productId
        ) AS bidStats ON product.id = bidStats.productId
        LEFT JOIN (
            SELECT b1.productId, b1.price, b1.updatedAt
            FROM bids b1
            WHERE b1.price = (
                SELECT MAX(b2.price) 
                FROM bids b2 
                WHERE b2.productId = b1.productId
            )
            LIMIT 1
        ) AS highestBid ON product.id = highestBid.productId
        WHERE 1=1`;

  const queryParams = [];

  if (!categories.includes("All") && categories.length > 0) {
    query += ` AND category.name IN (?)`;
    queryParams.push(categories);
  }

  if (price.min) {
    query += ` AND COALESCE(highestBid.price, product.price) >= ?`;
    queryParams.push(price.min);
  }
  if (price.max) {
    query += ` AND COALESCE(highestBid.price, product.price) <= ?`;
    queryParams.push(price.max);
  }

  if (endsIn.min >= 0) {
    query += ` AND (GREATEST(0,
            CASE 
                WHEN highestBid.updatedAt IS NOT NULL 
                THEN TIMESTAMPDIFF(MINUTE, NOW(), DATE_ADD(highestBid.updatedAt, INTERVAL 6 HOUR))
                ELSE TIMESTAMPDIFF(MINUTE, NOW(), DATE_ADD(product.createdAt, INTERVAL 24 HOUR))
            END) >= ?
        )`;
    queryParams.push(endsIn.min * 60);
  }
  if (endsIn.max <= 24) {
    query += ` AND (GREATEST(0,
            CASE 
                WHEN highestBid.updatedAt IS NOT NULL 
                THEN TIMESTAMPDIFF(MINUTE, NOW(), DATE_ADD(highestBid.updatedAt, INTERVAL 6 HOUR))
                ELSE TIMESTAMPDIFF(MINUTE, NOW(), DATE_ADD(product.createdAt, INTERVAL 24 HOUR))
            END) <= ?
        )`;
    queryParams.push(endsIn.max * 60);
  }

  if (sortBy !== "None") {
    let orderByColumn = "product.createdAt";
    if (sortBy === "Price") {
      orderByColumn = "effectivePrice";
    } else if (sortBy === "Bids Placed") {
      orderByColumn = "bidStats.bidCount";
    } else if (sortBy === "Time Left") {
      orderByColumn = "remainingTime";
    }

    query += ` ORDER BY ${orderByColumn} ${lowToHigh ? "ASC" : "DESC"}`;
  } else {
    query += ` ORDER BY product.createdAt ASC`;
  }

  try {
    const rows = await Product.query(query, queryParams);
    const products = rows.map((row) => ({
      id: row.productId,
      name: row.name,
      price: row.effectivePrice,
      createdAt: row.createdAt,
      image: row.imageURL,
      bidCount: row.bidCount,
      highestBid: row.highestBid,
      highestBidUpdatedAt: row.highestBidUpdatedAt,
      remainingTime: row.remainingTime,
    }));
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

const save = async (req, res) => {
  const { itemId, save } = req.body;
  const userId = req.session.user.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  if (!itemId || !Number.isInteger(Number(itemId)) || save === undefined) {
    return res.status(400).json({ error: "Bad Request!" });
  }

  try {
    if (save) {
      await Saved.insert({ userId: userId, productId: itemId });
    } else {
      await Saved.query(
        "DELETE FROM saved WHERE userId = ? AND productId = ?",
        [userId, itemId]
      );
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to process request!" });
  }
};

const getSaved = async (req, res) => {
  const userId = req.session.user.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  try {
    const rows = await Product.query(
      `SELECT 
            product.id AS productId,
            product.name,
            product.price as initPrice,
            product.createdAt,
            (SELECT imageURL FROM images WHERE images.productId = product.id LIMIT 1) AS imageURL,
            bidStats.bidCount,
            highestBid.price AS highestBid,
            highestBid.updatedAt AS highestBidUpdatedAt
        FROM product
            RIGHT JOIN saved on product.id = saved.productId
        LEFT JOIN (
            SELECT productId, COUNT(id) AS bidCount
            FROM bids
            GROUP BY productId
        ) AS bidStats ON product.id = bidStats.productId
        LEFT JOIN (
            SELECT b1.productId, b1.price, b1.updatedAt
            FROM bids b1
            WHERE b1.price = (
                SELECT MAX(b2.price) 
                FROM bids b2 
                WHERE b2.productId = b1.productId
            )
            LIMIT 1
        ) AS highestBid ON product.id = highestBid.productId
        WHERE saved.userId = ?;`, [userId]
    );

    const products = rows.map((row) => ({
      id: row.productId,
      name: row.name,
      price: row.initPrice,
      createdAt: row.createdAt,
      image: row.imageURL,
      bidCount: row.bidCount,
      highestBid: row.highestBid,
      highestBidUpdatedAt: row.highestBidUpdatedAt,
    }));
    return res.status(200).json({ success: true, products: products });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
    return false;
  }
};

module.exports = {
  productPost,
  getProducts,
  getProductById,
  filterProducts,
  save,
  getSaved,
};
