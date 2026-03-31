import { handleServerError } from "../utils/utils.js";

const EXCLUDED_DATA = "-__v -date -createdAt -updatedAt";

const scanProduct = async (req, res) => {
  console.log("scanProduct - start:");
  try {
    const { scannerData } = req.body;

    console.log("scannerData - received:", scannerData);

    res.json({ success: true, message: "Scanner data delivered" });
  } catch (error) {
    handleServerError(res, error);
  }
};

export { scanProduct };
