import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
    base: "/mk8/",
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: [
                "icons/logo.png",
                "icons/icon-192.png",
                "icons/icon-512.png"
            ],
            manifest: {
                name: "Mario Kart 8 Deluxe Randomizer",
                short_name: "MK8 Randomizer",
                start_url: ".",
                scope: ".",
                display: "standalone",
                theme_color: "#000000",
                background_color: "#000000",
                icons: [
                    {
                        src: "/icons/icon-192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "/icons/icon-512.png",
                        sizes: "512x512",
                        type: "image/png"
                    }
                ]
            }
        })
    ]
})
