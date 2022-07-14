export default {
    methods: {

        /**
         * Get Store State -> Local Storage
         * Please define the attribute in /store/index.js
         */
        getSettings(attribute, defaultValue = null){
            if (this.$store.state[attribute]) return this.$store.state[attribute];
            if (process.client){
                const value = localStorage.getItem(attribute);
                if (value){
                    this.$store.commit(attribute, value);
                    return value;
                }
            }
            return defaultValue;
        },
        getBearerToken(){
            return this.getSettings("bearer_token");
        },
        getFileToken(){
            return this.getSettings("file_token");
        },
        getLanguage(){
            return this.getSettings("language", "en");
        },
        getColorMode(){
            return this.getSettings("color_mode", "normal");
        },

        /**
         * Set Store State -> Local Storage
         * Please define the attribute in /store/index.js
         */
        setSettings(attribute, value){
            this.$store.commit(attribute, value);
            if (process.client){
                if (value !== null && value !== undefined){
                    localStorage.setItem(attribute, value);
                }else{
                    localStorage.removeItem(attribute);
                }
            }
        },
        setBearerToken(value){
            this.setSettings("bearer_token", value);
        },
        setFileToken(value){
            this.setSettings("file_token", value);
        },
        setLanguage(value){
            this.setSettings("language", value);
        },
        setColorMode(value){
            this.setSettings("color_mode", value);
        },

        /**
         * Get Language String
         */
        s$(string_id){
            const language = this.getLanguage();
            //Load the string from the corresponding string file if necessary
            string_id = string_id.split('/');
            const prefix = string_id.shift();
            string_id = string_id.join('/');
            if (!this.$store.state.strings_loaded[prefix]){
                const file_loaded = require('~/strings/' + prefix + '.js');
                this.$store.commit('strings_loaded', {prefix, value: file_loaded.strings});
            }
            //Use the string
            if (this.$store.state.strings_loaded[prefix]){
                let string_obj = this.$store.state.strings_loaded[prefix][string_id];
                if (!string_obj) return null;
                let string = string_obj[language];
                if (!string) return null;
                return string;
            }
            return null;
        },
        getLanguageString(string_id){
            return this.s$(string_id);
        },

        /**
         * Call API
         */
        async callAPI(APIMethod, APIRoute, data = {}, bearerTokenRequired = true){
            //Set Base URL
            this.$axios.setBaseURL(process.env.API_BASE_URL);
            //Handle Bearer Token
            if (bearerTokenRequired){
                this.$axios.setToken(this.getBearerToken() || "", "Bearer");
            }else{
                this.$axios.setToken(false);
            }
            //Make API Call
            APIMethod = APIMethod.toUpperCase();
            let response;
            try{
                if (APIMethod === 'GET'){
                    response = await this.$axios.$get(APIRoute, data);
                }else if (APIMethod === 'POST'){
                    response = await this.$axios.$post(APIRoute, data);
                }else if (APIMethod === 'PATCH'){
                    response = await this.$axios.$patch(APIRoute, data);
                }else if (APIMethod === 'PUT'){
                    response = await this.$axios.$put(APIRoute, data);
                }else if (APIMethod === 'DELETE'){
                    response = await this.$axios.$delete(APIRoute, data);
                }else{
                    return null;
                }
            }
            //Handle Errors
            catch (error){
                if (error.response){
                    const data = error.response.data || {};
                    const _error = error.response.status;
                    return {_error, ...data};
                }else{
                    //No Response Error
                    return { _status: null };
                }
            }
            //No Errors
            return {_error: false, ...response};
        },

    },
}