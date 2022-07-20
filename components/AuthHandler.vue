<script>
/**
 * Login Modal + Logout Handler + Bearer Token Session Handler
 * Emits: @myself(data), @logged-in, @login-failed, @logged-out, @logout-failed
 */

import common from '../mixins/common.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faXmark } from '@fortawesome/free-solid-svg-icons'
library.add(faXmark);

import Modal from './general/Modal'
import Spinner from './general/Spinner';

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
        async getMyself(){ //Emits: myself(data)
            this.$store.dispatch('init');
            //Get Tokens
            const { bearer_token } = this.$store.getters;
            if (!bearer_token){
                this.$store.commit('myself', null);
                return this.$emit('myself', null);
            }
            //Get Myself
            const response = await this.callAPI('GET', 'myself');
            //If Error 401 -> Clear Tokens
            if (response._error == 401){
                this.$store.commit('bearer_token', null);
                this.$store.commit('file_token', null);
                return this.$emit('myself', null);
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
            this.$store.commit('bearer_token', response.bearer_token);
            this.$store.commit('file_token', response.file_token);
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
            this.$store.commit('bearer_token', null);
            this.$store.commit('file_token', null);
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

            <div class="mb-2">
                <label class="label py-0" for="username">
                    {{s$('login/username')}}
                </label>
                <input type="text" id="username" v-model="username" :placeholder="s$('login/username')"
                @focus="error = null" class="my-input w-full" />
            </div>

            <div class="mb-2">
                <label class="label py-0" for="password">
                    {{s$('login/password')}}
                </label>
                <input type="password" id="password" v-model="password" :placeholder="s$('login/password')"
                @focus="error = null" class="my-input w-full" />
            </div>

            <button class="btn btn-primary btn-block -my-btn"
            :disabled="!username || !password || isLoading" @click="submitLogin">
                <span v-if="!isLoading">{{s$('general/submit')}}</span>
                <span v-else><Spinner /></span>
            </button>

            <label class="label text-error" v-if="error">
                {{error}}
            </label>

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