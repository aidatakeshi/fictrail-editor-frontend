/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [],
    theme: {
        extend: {
        },
    },
    variants: {
        extend: {
        },
    },
    plugins: [
        '~plugins/vue-tailwind',
        require('@tailwindcss/forms'),
    ],
}
