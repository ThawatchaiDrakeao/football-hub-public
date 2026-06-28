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
    dns.setServers(dnsServers);
  }
};

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("[ENV ERROR] MONGO_URI is missing");
      process.exit(1);
    }

    configureDnsForAtlas();

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;