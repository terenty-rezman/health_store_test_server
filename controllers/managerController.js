const getAllProducts = (req, res) => {
  res.json({ success: true, products: [] });
};

const getProductById = (req, res) => {
  const { id } = req.params;
};

const getAllPharmacies = (req, res) => {};

const getPharmacyById = (req, res) => {
  const { id } = req.params;
};

const getAllSellers = (req, res) => {};

const getSellerById = (req, res) => {
  const { id } = req.params;
};

const addSeller = (req, res) => {
  const { name, telegram_user_id } = req.body;
};

const updateSeller = (req, res) => {
  const { id } = req.params;
  const { name, telegram_user_id } = req.body;
};

const deleteSeller = (req, res) => {
  const { id } = req.params;
};

export {
  getAllProducts,
  getProductById,
  getAllPharmacies,
  getPharmacyById,
  getAllSellers,
  getSellerById,
  addSeller,
  updateSeller,
  deleteSeller,
};
