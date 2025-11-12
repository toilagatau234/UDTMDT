exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, sale } = req.body;
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const doc = await Product.create({
      title,
      slug,
      description,
      price,
      sale,
      imageUrl,
      createdBy: req.user?._id || req.user?.id
    });
    res.status(201).json(doc);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, sale } = req.body;
    const patch = { title, description, price, sale };
    if (req.file) patch.imageUrl = `/uploads/${req.file.filename}`;

    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, createdBy: req.user?._id || req.user?.id };

    const doc = await Product.findOneAndUpdate(filter, patch, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

module.exports = {
  getDashboard,
  listMyProducts,
  createProduct,
  updateProduct,
  deleteProduct
};

