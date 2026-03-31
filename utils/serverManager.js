let isShuttingDown = false;

const startServer = async (app, PORT, ngrok, handleNodemonRestart) => {
  await ngrok.kill();
  await new Promise((r) => setTimeout(r, 1000));

  const server = app.listen(PORT, async () => {
    try {
      console.log("Server is running on port:", PORT);
    } catch (err) {
      console.error("Ngrok ERROR:", err);
    }
  });

  const shutdown = async () => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log("Shutting down server and ngrok tunnel...");

    try {
      await ngrok.kill();
      console.log("Ngrok stopped.");
    } catch (err) {
      console.error("Error stopping ngrok:", err);
    }

    server.close(() => {
      console.log("Server stopped.");
      console.log("COMPLETED - Server and ngrok fully stopped.");
      process.exit(0);
    });

    setTimeout(() => {
      console.log("Force shutdown.");
      process.exit(1);
    }, 3000);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  process.once("SIGUSR2", () => handleNodemonRestart(shutdown));
};

export { startServer };
