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
        
        setLanguage(value){
            this.setSettings("language", value);
        },
        
        setColorMode(value){
            this.setSettings("color_mode", value);
        },

        /**
         * Let Language String
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

    },
}