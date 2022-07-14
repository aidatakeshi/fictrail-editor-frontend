/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [],
    theme: {
        extend: {
            colors: {
                'parsley': {
                    DEFAULT: '#114514',
                    '50': '#A0E8A4',
                    '100': '#90E495',
                    '200': '#6FDC75',
                    '300': '#4ED456',
                    '400': '#31C83A',
                    '500': '#29A730',
                    '600': '#218627',
                    '700': '#19661D',
                    '800': '#114514',
                    '900': '#061807'
                },
                'jackson': {
                    DEFAULT: '#191980',
                    '50': '#D4D4F7',
                    '100': '#C3C3F3',
                    '200': '#A1A1ED',
                    '300': '#7F7FE6',
                    '400': '#5D5DDF',
                    '500': '#3B3BD9',
                    '600': '#2626C4',
                    '700': '#2020A2',
                    '800': '#191980',
                    '900': '#101051'
                },
            },
        },
    },
    daisyui: {
        themes: [{
            mytheme: {
                "primary": "#2626C4",
                "secondary": "#218627",
                "accent": "#DAA520",
                "neutral": "#6C7993",
                "base-100": "#FFFFFF",
                "info": "#3ABFF8",
                "success": "#36D399",
                "warning": "#FBBD23",
                "error": "#F87272",
            },
        }],
    },
    variants: {
        extend: {
        },
    },
    plugins: [
        '~plugins/vue-tailwind',
        require("daisyui"),
        require('@tailwindcss/forms'),
    ],
}
