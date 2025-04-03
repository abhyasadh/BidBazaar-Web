const methodNotAllowed = (req, res) => {
    res.status(405).json({ status: false, message: "Method Not Allowed" });
}

module.exports = { methodNotAllowed }