const dns = require("dns");
const mongoose = require("mongoose");

const configureDnsForAtlas = () => {
  const mongoUri = process.env.MONGO_URI || "";
  const configuredDnsServers = process.env.DNS_SERVERS;

  if (!mongoUri.startsWith("mongodb+srv://") || !configuredDnsServers) {
    return;
  }

  const dnsServers = configuredDnsServers
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    // Atlas SRV records need DNS lookup. Override only when the local network needs it.
    dns.setServers(dnsServers);
  }
};

const showAtlasNetworkAccessHelp = (errorMessage) => {
  const looksLikeAtlasNetworkBlock =
    errorMessage.includes("IP whitelist") ||
    errorMessage.includes("Could not connect to any servers");

  if (!looksLikeAtlasNetworkBlock) {
    return;
  }

  console.error(
    "Atlas Network Access may be blocking this computer. In MongoDB Atlas, open Network Access, add your current IP address, wait a few minutes, then restart the server."
  );
  console.error(
    "See backend/MONGODB_ATLAS_TROUBLESHOOTING.md for the safe step-by-step setup."
  );
};

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    configureDnsForAtlas();

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    showAtlasNetworkAccessHelp(error.message);

    if (error.message.includes("querySrv ECONNREFUSED")) {
      console.error(
        "DNS SRV lookup was refused. Try changing DNS_SERVERS in .env, disabling VPN, or using another network."
      );
    }

    process.exit(1);
  }
};

module.exports = connectDB;
