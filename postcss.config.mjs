/**
 * PostCSS Configuration
 * 
 * Configuration for PostCSS processing pipeline.
 * Includes Tailwind CSS for utility-first styling.
 * 
 * @see https://tailwindcss.com/docs/installation#postcss
 */
const config = {
  plugins: [
    // Tailwind CSS PostCSS plugin for utility-first CSS
    "@tailwindcss/postcss",
  ],
};

export default config;
