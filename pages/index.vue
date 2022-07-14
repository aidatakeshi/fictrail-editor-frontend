<script>
import common from '../mixins/common.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import AuthHandler from '../components/AuthHandler';
import TopNavHomePage from '../components/home_page/TopNavHomePage';
import ProjectList from '../components/home_page/ProjectList';

export default {
    name: 'PageMain',
    mixins: [common],
    components: {
        FontAwesomeIcon, AuthHandler, TopNavHomePage, ProjectList,
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
    <div :class="getColorMode()">
    <div class="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100">

        <!-- Top Navigation Bar -->
        <TopNavHomePage
            @login-button="$refs.auth_handler.showLoginModal()"
            @logout-button="$refs.auth_handler.handleLogout()"
        />

        <!-- AuthHandler -->
        <AuthHandler ref="auth_handler" @myself="onAuthHandlerResponse" />

        <!-- Main Body -->
        <div class="max-w-4xl mx-auto p-2">

            <!-- Project List -->
            <ProjectList ref="project_list" />
            
            <!-------------------------------------------------------------------------------------------->

        </div>

    </div>
    </div>
</template>