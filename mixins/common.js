export default {
    methods: {

        /**
         * Get Language String
         */
        s$(string_id){
            const lang = this.$store.getters.language;
            //Load the string from the corresponding string file if necessary
            string_id = string_id.split('/');
            const prefix = string_id.shift();
            string_id = string_id.join('/');
            if (!this.$store.state.strings[prefix]){
                const file_loaded = require('~/strings/' + prefix + '.js');
                this.$store.commit('strings', {prefix, value: file_loaded.strings});
            }
            //Use the string
            if (this.$store.state.strings[prefix]){
                let string_obj = this.$store.state.strings[prefix][string_id];
                if (!string_obj) return null;
                let string = string_obj[lang];
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
            const bearer_token = this.$store.getters.bearer_token;
            if (bearerTokenRequired && bearer_token){
                this.$axios.setToken(bearer_token, "Bearer");
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