import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TeachLens",
    short_name: "TeachLens",
    description: "Animated visual lessons and worked examples for clear study.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f9ff",
    theme_color: "#06214a",
    icons: [
      {
        src: "/brand/teachlens-icon.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
