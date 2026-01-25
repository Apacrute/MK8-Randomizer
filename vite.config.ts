import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
        plugins: [
            react(),
            VitePWA({
                registerType: "autoUpdate",
                manifest: {
                    name: "Mario Kart Randomizer",
                    short_name: "MK Randomizer",
                    display: "standalone",
                    start_url: "/",
                    icons: [
                        {
                            src: "/src/Images/MarioKart8-logo.png",
                            sizes: "192x192",
                            type: "image/png"
                        }
                    ]
                }
            })
        ]
    })
