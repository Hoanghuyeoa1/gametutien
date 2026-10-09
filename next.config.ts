import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.35",
    "192.168.1.35:3000",
    "192.168.1.34", // Giữ lại nếu bạn có dùng thêm thiết bị/máy này
  ],
};

export default nextConfig;