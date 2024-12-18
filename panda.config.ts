import { defineConfig } from "@pandacss/dev";

export default defineConfig({
    // Whether to use css reset
    preflight: true,

    // Where to look for your css declarations
    include: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./pages/**/*.{js,jsx,ts,tsx}",
        "./src/components/**/*.{ts,tsx,js,jsx}",
        "./src/app/**/*.{ts,tsx,js,jsx}"
    ],

    // Files to exclude
    exclude: [],

    // Useful for theme customization
    theme: {
        extend: {
            breakpoints: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
                "2xl": "1536px"
            },
            tokens: {
                colors: {
                    primary: { value: "#7829cc" },
                    grey: { value: "#00000073" }
                }
            }
        }
    },

    // The output directory for your css system
    outdir: "styled-system",

    jsxFramework: "react"
});
