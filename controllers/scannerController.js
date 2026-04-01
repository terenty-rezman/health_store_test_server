import { handleServerError } from "../utils/utils.js";

const EXCLUDED_DATA = "-__v -date -createdAt -updatedAt";

const scanProduct = async (req, res) => {
  console.log("scanProduct - start:");
  try {
    const { scannerData } = req.body;
    const telegramUserId = req.telegramUserId;

    console.log("scannerData - received:", scannerData);

    // Add to the database logic here, e.g., using Mongoose:
    // const newScan = new ScanModel(scannerData);
    // await newScan.save();

    console.log(
      "Scanner data saved to database (mocked) - logic to be implemented",
    );

    res.json({ success: true, message: "Scanner data delivered" });
  } catch (error) {
    handleServerError(res, error);
  }
};

export { scanProduct };
