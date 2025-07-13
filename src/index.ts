import app from "./app";
import os from "os";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  const nets = os.networkInterfaces();
  let localIp = "localhost";
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        localIp = net.address;
        break;
      }
    }
  }
  console.log(`Server running on http://${localIp}:${PORT}`);
});
