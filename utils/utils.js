export const handleNodemonRestart = async (shutdown) => {
  console.log("Nodemon restart detected...");
  await shutdown();
  process.kill(process.pid, "SIGUSR2");
};

export const handleServerError = (
  res,
  error,
  defaultMessage = "Something went wrong",
) => {
  console.error("ERROR:", error);

  res.status(500).json({
    success: false,
    message: error?.message || defaultMessage,
  });
};

export const normalizeAPIKey = (str) =>
  String(str || "").replace(/[\r\n\s\u00A0]/g, "");
