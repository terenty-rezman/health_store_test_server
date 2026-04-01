import adminModel from "../models/adminModel.js";
import managerModel from "../models/managerModel.js";
import { admins, managers, sellers } from "../data/data.js";
import sellerModel from "../models/sellerModel.js";

const admins_populate = async () => {
  try {
    const preparedAdmins = admins.map((admin, index) => ({
      ...admin,
      admin_id: index + 1,
    }));
    await adminModel.insertMany(preparedAdmins);

    console.log("Admins populated successfully");
  } catch (error) {
    console.error("ERROR - admins populating:", error);
  }
};

const managers_populate = async () => {
  try {
    const preparedManagers = managers.map((manager, index) => ({
      ...manager,
      telegram_id: manager.telegram_id || index + 1,
    }));
    await managerModel.insertMany(preparedManagers);

    console.log("Managers populated successfully");
  } catch (error) {
    console.error("ERROR - managers populating:", error);
  }
};

const sellers_populate = async () => {
  try {
    const preparedSellers = sellers.map((seller, index) => ({
      ...seller,
      telegram_id: seller.telegram_id || index + 1,
    }));
    await sellerModel.insertMany(preparedSellers);

    console.log("Sellers populated successfully");
  } catch (error) {
    console.error("ERROR - sellers populating:", error);
  }
};

export { admins_populate, managers_populate, sellers_populate };
