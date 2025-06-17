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
                    lightPrimary: { value: "#c59cf2" },
                    grey: { value: "#00000073" },
                    lightGrey: { value: "#c0c0c0" },
                    darkGrey: { value: "#757575" },
                    lightPurple: { value: "#ffeeff" },
                    loginPageBackground: {
                        value: "linear-gradient(135deg, rgba(220, 198, 224, 0.8), rgba(165, 180, 252, 0.8))"
                    }
                }
            }
        }
    },

    // The output directory for your css system
    outdir: "styled-system",

    jsxFramework: "react"
});
