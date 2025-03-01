import { defineConfig } from 'vite';

// Export the Vite configuration with the necessary changes
export default defineConfig({
    // Define where Vite should look for content to scan for class names
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    // Add any extensions needed for Tailwind (if applicable)
    theme: {
        extend: {},
    },

    // Vite plugins for any custom processing
    plugins: [],

    // Vite build options
    build: {
        rollupOptions: {
            external: ['gsap'], // Externalize GSAP for the build process
            output: {
                globals: {
                    gsap: 'gsap', // Set global variable for GSAP (in case it's externalized)
                },
            },
        },
    },

});
