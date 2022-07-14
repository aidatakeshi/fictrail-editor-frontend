<script>
/**
 * Login Modal + Logout Handler + Bearer Token Session Handler
 */

import common from '../../mixins/common.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faXmark } from '@fortawesome/free-solid-svg-icons'
library.add(faXmark);

import Modal from './Modal'
import Spinner from './Spinner';

export default {
    name: 'AuthHandler',
    mixins: [common],
    components: { FontAwesomeIcon, Modal, Spinner },

    props: {
    },

    data: () => ({
        username: null,
        password: null,
        error: null,
        isLoading: false,
    }),

    async mounted(){
        await this.getMyself();
    },

    methods: {
        async getMyself(){ //Emits: myself(data), not-logged-in
            //Get Tokens
            const bearer_token = this.getBearerToken();
            const file_token = this.getFileToken();
            if (!bearer_token){
                this.$store.commit('myself', null);
                return this.$emit('not-logged-in');
            }
            //Get Myself
            const response = await this.callAPI('GET', 'myself');
            //If Error 401 -> Clear Tokens
            if (response._error == 401){
                this.setBearerToken(null);
                this.setFileToken(null);
                return this.$emit('not-logged-in');
            }
            //Store myself to state
            this.$store.commit('myself', response);
            return this.$emit('myself', response);
        },
        showLoginModal(){
            this.username = "";
            this.password = "";
            this.error = null;
            this.isLoading = false;
            this.$refs.login_modal.show();
        },
        hideLoginModal(){
            this.$refs.login_modal.hide();
        },
        async submitLogin(){ //Emits: logged-in / login-failed
            //Call Login API
            this.isLoading = true;
            const response = await this.callAPI('POST', 'login', {
                id: this.username,
                password: this.password,
            }, false);
            this.isLoading = false;
            //If Error
            if (response._error){
                this.error = this.s$(`login/error/${response.error}`);
                return this.$emit('login-failed');
            }
            //If Successful
            this.setBearerToken(response.bearer_token);
            this.setFileToken(response.file_token);
            //Close Modal
            this.hideLoginModal();
            //Get Myself
            this.getMyself();
            return this.$emit('logged-in');
        },
        async handleLogout(){ //Emits: logged-out / logout-failed
            //Call Logout API
            this.$refs.logout_modal.show();
            const response = await this.callAPI('POST', 'logout');
            this.$refs.logout_modal.hide();
            //If Error
            if (response._error){
                return this.$emit('logout-failed');
            }
            //If Successful
            this.setBearerToken(null);
            this.setFileToken(null);
            //Get Myself
            this.getMyself();
            return this.$emit('logged-out');
        },
    },

    computed: {
    },

    watch: {
    }
}
</script>

<template>
    <div>
        <!-- Login Modal -->
        <Modal narrow ref="login_modal" :title="s$('general/login')">

            <input type="text" v-model="username" :placeholder="s$('login/username')"
            @focus="error = null" class="my-input w-full mb-2" />

            <input type="password" v-model="password" :placeholder="s$('login/password')"
            @focus="error = null" class="my-input w-full mb-2" />

            <button class="my-btn btn-block"
            :disabled="!username || !password || isLoading" @click="submitLogin">
                <span v-if="!isLoading">{{s$('general/submit')}}</span>
                <span v-else><Spinner /></span>
            </button>

            <div class="text-center text-error mt-2" v-if="error">{{error}}</div>

        </Modal>

        <Modal narrow ref="logout_modal" hide-close>
            <div class="my-8 text-center">
                <Spinner />
                <div class="mt-2 text-xl">
                    {{s$('login/logging_out')}}
                </div>
            </div>
        </Modal>
    </div>
</template>