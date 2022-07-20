export const state = () => ({
    bearer_token: null,
    file_token: null,
    language: null, //Default: "en"
    color_mode: null, //Default: "normal"
    //
    myself: null,
    strings: {},
});

export const getters = {
    bearer_token: (state) => state.bearer_token,
    file_token: (state) => state.file_token,
    language: (state) => (state.language !== null) ? state.language : 'en',
    color_mode: (state) => (state.color_mode !== null) ? state.color_mode : 'normal',
    //
    myself: (state) => state.myself,
};

export const mutations = {
    //
    bearer_token(state, value) {
        state.bearer_token = value;
    },
    file_token(state, value) {
        state.file_token = value;
    },
    language(state, value) {
        state.language = value;
    },
    color_mode(state, value) {
        state.color_mode = value;
    },
    //
    myself(state, value){
        state.myself = value;
    },
    strings(state, {prefix, value}) {
        state.strings[prefix] = value;
    },
};

export const actions = {
    init({commit}){
        //Load from local storage
        if (process.client){
            for (let attr of ['bearer_token', 'file_token', 'language', 'color_mode']){
                commit(attr, localStorage.getItem(attr));
            }
        }
    },
};