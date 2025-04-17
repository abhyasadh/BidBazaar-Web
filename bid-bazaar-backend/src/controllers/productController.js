const fs = require("fs");
const { specificationList } = require("./categoryController");
const fileType = import("file-type");
const cloudinary = require("cloudinary");
const { Product } = require("../services/ProductServices");
const { Images } = require("../services/imageServices");
const {
  ProductSpecifications,
} = require("../services/productSpecificationServices");
const { Saved } = require("../services/savedServices");

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
  const { limit, offset } = req.query;
  try {
    const products = await Product.getProducts(
      req.url.startsWith("/all"),
      req.session.user.id,
      limit,
      offset
    );
    return res.status(200).json({ success: true, products: products });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
    return false;
  }
};

const getProductById = async (req, res) => {
  const productId = req.params.productId;

  if (!productId || !Number.isInteger(Number(productId))) {
    return res
      .status(400)
      .json({ success: false, message: "Product ID is required!" });
  }

  if (!req.session.viewedProducts?.includes(productId)) {
    req.session.viewedProducts = [
      ...(req.session.viewedProducts || []),
      productId,
    ];
    await Product.updateViewCount(productId);
  }

  try {
    const product = await Product.getProductById(productId);
    return res.status(200).json({ success: true, product: product });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
    return false;
  }
};

const filterProducts = async (req, res) => {
  const { categories, price, endsIn, sortBy, lowToHigh } = req.body;
  const { limit, offset } = req.query;
  try {
    const products = await Product.filterProducts(
      categories,
      price,
      endsIn,
      sortBy,
      lowToHigh,
      limit,
      offset,
    );
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

const save = async (req, res) => {
  const { itemId, save } = req.body;
  const userId = req.session.user.id;

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
  const { limit, offset } = req.query;

  try {
    const products = await Product.getSaved(userId);
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
