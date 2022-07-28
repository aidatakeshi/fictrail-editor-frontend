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
    language: (state) => state.language || 'en',
    color_mode: (state) => state.color_mode || 'normal',
};

export const mutations = {
    //
    bearer_token(state, value) {
        saveParam(state, 'bearer_token', value);
    },
    file_token(state, value) {
        saveParam(state, 'file_token', value);
    },
    language(state, value) {
        saveParam(state, 'language', value);
    },
    color_mode(state, value) {
        saveParam(state, 'color_mode', value);
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

/**
 * Shared Functions
 */
const saveParam = (state, field, value) => {
    state[field] = value;
    if (process.client){
        if (value){
            localStorage.setItem(field, value);
        }else{
            localStorage.removeItem(field);
        }
    }
};