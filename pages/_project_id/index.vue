<script>
/*
    Project Edit Page
    This Page contains only the authorization and "project not found" logic.
    For the core logic of the editor, it is in components/project_editor/MainEditor
*/
import common from '../../mixins/common.js';
import editor_load_data from '../../mixins/editor_load_data.js';
import editor_listeners from '../../mixins/editor_listeners.js';
import AuthHandler from '../../components/AuthHandler';
import EditPersonalInfo from '../../components/EditPersonalInfo';
import MainEditor from '../../components/project_editor/MainEditor';
import Spinner from '../../components/general/Spinner';

export default {
    name: 'PageProjectEditor',
    layout: "no_scroll",
    mixins: [
        common,
        editor_load_data, editor_listeners,
    ],
    components: {
        AuthHandler, EditPersonalInfo, MainEditor,
        Spinner,
    },

    data: () => ({
        is_loading: true,
        loading_item: null,
        error: null,
    }),

    mounted(){

    },

    methods: {
        async onAuthHandlerLoading(){
            this.loading_item = 'user_auth';
        },
        async onAuthHandlerResponse(){
            //Initialize Project...
            const project_id = this.$route.params.project_id;
            this.projectLoaded = false;
            //Load Project Data (from api)
            this.loading_item = 'project_data';
            await this.loadProjectDataFromAPI((error, data) => {
                if (error){
                    this.error = error;
                }
            });
            if (this.error) return false;
            //Load Project Settings (from api)
            this.loading_item = 'project_settings';
            await this.loadProjectSettingsFromAPI((error, data) => {
                if (error){
                    this.error = '#';
                }
            });
            if (this.error) return false;
            //Load Display Settings (from local storage)
            this.loading_item = 'display_settings';
            this.$store.dispatch('p_display/init', project_id);
            //Start Listening To Screen Size
            this.listenToScreenResize();
            //Load Display Data
            this.loading_item = 'map_display';
            await this.loadDisplayData((error, data) => {
                if (error){
                    this.error = '#';
                }
            });
            if (this.error) return false;
            //Finish Loading
            this.is_loading = false;
        },
    },
}

</script>

<template>
    <div :class="$store.getters.color_mode">
    <div class="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100">

        <!-- Loading / Error Box -->
        <div class="grid place-items-center h-screen p-2" v-if="is_loading || error">
            <div class="bg-slate-100 dark:bg-slate-900 rounded-2xl w-full max-w-lg px-2 py-8">
                <!-- Error -->
                <div v-if="error">
                    <div class="text-center text-xl">
                        {{s$(`project_loading/error/${error}`) || s$(`project_loading/error/default`)}}
                    </div>
                    <div class="text-center mt-4">
                        <nuxt-link to="/">
                            <button class="btn">
                                {{s$('general/return')}}
                            </button>
                        </nuxt-link>
                    </div>
                </div>
                <!-- Loading -->
                <div v-else-if="is_loading" class="text-center">
                    <Spinner size="2rem" />
                    <div class="mt-2 text-xl" v-if="loading_item">
                        {{s$(`project_loading/is_loading/${loading_item}`)}}
                    </div>
                </div>
                <!------------------------------------------------------------>
            </div>
        </div>

        <!-- Finish Loading -->
        <MainEditor v-else
            @login-button="$refs.auth_handler.showLoginModal()"
            @logout-button="$refs.auth_handler.handleLogout()"
            @personal-info-button="$refs.edit_personal_info.show()"
        />

        <!-- Edit Personal Info -->
        <EditPersonalInfo ref="edit_personal_info" />

        <!-- Auth Handler -->
        <AuthHandler ref="auth_handler"
            @myself-loading="onAuthHandlerLoading" @myself="onAuthHandlerResponse"
        />

    </div>
    </div>
</template>