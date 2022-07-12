export const state = () => ({
    bearer_token: null,
    language: null, //Default: "en"
    color_mode: null, //Default: "normal"

    //
    strings_loaded: {},
})

export const mutations = {
    bearer_token(state, value) {
        state.bearer_token = value;
    },
    language(state, value) {
        state.language = value;
    },
    color_mode(state, value) {
        state.color_mode = value;
    },

    //
    strings_loaded(state, {prefix, value}) {
        state.strings_loaded[prefix] = value;
    },
}