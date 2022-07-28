<script>
/*
    Project List Page
*/
import common from '../mixins/common.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import AuthHandler from '../components/AuthHandler';
import EditPersonalInfo from '../components/EditPersonalInfo';
import TopNavHomePage from '../components/home_page/TopNavHomePage';
import ProjectList from '../components/home_page/ProjectList';

export default {
    name: 'PageProjectList',
    mixins: [common],
    components: {
        FontAwesomeIcon,
        AuthHandler, EditPersonalInfo, TopNavHomePage, ProjectList,
    },

    data: () => ({
        test: true,
    }),

    methods: {
        async onAuthHandlerResponse(){
            await this.$refs.project_list.loadData();
        },
    },
}

</script>

<template>
    <div :class="$store.getters.color_mode">
    <div class="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100">

        <!-- Top Navigation Bar -->
        <TopNavHomePage
            @login-button="$refs.auth_handler.showLoginModal()"
            @logout-button="$refs.auth_handler.handleLogout()"
            @personal-info-button="$refs.edit_personal_info.show()"
        />

        <!-- Auth Handler -->
        <AuthHandler ref="auth_handler" @myself="onAuthHandlerResponse" />

        <!-- Edit Personal Info -->
        <EditPersonalInfo ref="edit_personal_info" />

        <!-- Main Body -->
        <div class="max-w-4xl mx-auto p-2">

            <!-- Project List -->
            <ProjectList ref="project_list" />
            
            <!-------------------------------------------------------------------------------------------->

        </div>

    </div>
    </div>
</template>