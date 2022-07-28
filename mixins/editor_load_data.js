/**
 * Mixin for Project Editor Page
 */
export default {
    methods: {
        /**
         * Load Project Data from API to Store (GET /project/:project_id)
         * responseFunction(error, data)
         */
        async loadProjectDataFromAPI(responseFunction){
            const project_id = this.$route.params.project_id;
            const response = await this.callAPI('GET', `project/${encodeURIComponent(project_id)}`);
            console.log(`[${project_id}] Loading Project Data`);
            //Has Error...
            if (response._error){
                //Call Custom Function
                if (typeof responseFunction === 'function'){
                    responseFunction(response.error, response);
                }
            }
            //No Error...
            else{
                //Commit to Store
                this.$store.commit('p_data/project', response);
                //Call Custom Function
                if (typeof successFunction === 'function'){
                    responseFunction(false, response);
                }
            }
        },

        /**
         * Load Project Settings from API to Store (GET /project/:project_id/settings)
         * responseFunction(error, data)
         */
        async loadProjectSettingsFromAPI(responseFunction){
            const project_id = this.$route.params.project_id;
            const response = await this.callAPI('GET', `project/${encodeURIComponent(project_id)}/settings`);
            console.log(`[${project_id}] Loading Project Settings`);
            //Has Error...
            if (response._error){
                //Call Custom Function
                if (typeof responseFunction === 'function'){
                    responseFunction(response.error, response);
                }
            }
            //No Error...
            else{
                //Commit to Store
                this.$store.commit('p_data/settings', response);
                this.$store.commit('p_display/settings', response);
                //Call Custom Function
                if (typeof successFunction === 'function'){
                    responseFunction(false, response);
                }
            }
        },

        /**
         * Load Display Data from API to Store (GET /project/:project_id/map-display)
         * Note: Only works if x, y, logzoom, screen_width, screen_height are set
         * responseFunction(error, data)
         */
        async loadDisplayData(responseFunction){
            const project_id = this.$route.params.project_id;
            const params = {
                x_min: this.$store.getters['p_display/x_min'],
                x_max: this.$store.getters['p_display/x_max'],
                y_min: this.$store.getters['p_display/y_min'],
                y_max: this.$store.getters['p_display/y_max'],
                logzoom: this.$store.getters['p_display/logzoom'],
            };
            //Check if params missing
            for (let f in params){
                if (f === null || f === undefined || isNaN(f)){
                    if (typeof successFunction === 'function'){
                        responseFunction(false, null);
                        return false;
                    }
                }
            }
            //Call API
            const url = `p/${encodeURIComponent(project_id)}/map-display`
            + `?x_min=${params.x_min}&x_max=${params.x_max}`
            + `&y_min=${params.y_min}&y_max=${params.y_max}`
            + `&logzoom=${params.logzoom}`;
            const response = await this.callAPI('GET', url, params);
            console.log(`[${project_id}] Loading Map Display Data`);
            //Has Error...
            if (response._error){
                //Call Custom Function
                if (typeof responseFunction === 'function'){
                    responseFunction(response.error, response);
                }
            }
            //No Error...
            else{
                //Commit to Store
                this.$store.commit('p_data/display', response.data);
                //Call Custom Function
                if (typeof successFunction === 'function'){
                    responseFunction(false, response.data);
                }
            }
        },

    },
}