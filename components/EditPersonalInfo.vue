<script>
/**
 * Emits: @myself(data)
 */

import common from '../mixins/common.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons'
library.add( faPenToSquare, faXmark );

import Modal from './general/Modal'
import Spinner from './general/Spinner';
import ToastManager from './general/ToastManager';

export default {
    name: 'EditPersonalInfo',
    mixins: [common],
    components: { FontAwesomeIcon, Modal, Spinner, ToastManager },

    props: {
    },

    data: () => ({
        data: {
            id: null,
            name: null,
            email: null,
        },
        isEditing: {
            name: false,
            email: false,
            password: false,
        },
        editing: {
            name: false,
            email: false,
            old_password: null,
            new_password: null,
            new_password2: null,
        },
        isLoading: {
            name: false,
            email: false,
            password: false,
        },
        error: {
            name: null,
            email: null,
            password: null,
        },
    }),

    methods: {
        async show(){
            for (let f in this.data){
                this.data[f] = (this.$store.state.myself || {})[f] ?? null;
            }
            for (let f in this.isEditing){
                this.isEditing[f] = false;
            }
            for (let f in this.isLoading){
                this.isEditing[f] = false;
            }
            for (let f in this.error){
                this.error[f] = false;
            }
            this.$refs.personal_info_modal.show();
        },
        async hide(){
            this.$refs.personal_info_modal.hide();
        },
        editName(){
            this.editing.name = this.data.name;
            this.isEditing.name = true;
            return false;
        },
        async submitName(){
            this.isLoading.name = true;
            const response = await this.callAPI('PUT', 'myself', {name: this.editing.name});
            this.isLoading.name = false;
            //If Error
            if (response._error){
                if (response.error == 'validation_error'){
                    const type = (response.details[0]||{}).type;
                    this.error.name = this.s$(`validation/${type}`) || this.s$(`validation/_default`);
                }else{
                    this.error.name = this.s$(`validation/_default`);
                }
                return false;
            }
            //If No Error
            this.$refs.toasts.make(this.s$('user/toasts/name_changed'), 'success');
            this.$store.commit('myself', response);
            this.data.name = this.editing.name;
            this.isEditing.name = false;
        },
        editEmail(){
            this.editing.email = this.data.email;
            this.isEditing.email = true;
            return false;
        },
        async submitEmail(){
            this.isLoading.email = true;
            const response = await this.callAPI('PUT', 'myself', {email: this.editing.email});
            this.isLoading.email = false;
            //If Error
            if (response._error){
                if (response.error == 'validation_error'){
                    const type = (response.details[0]||{}).type;
                    this.error.email = this.s$(`validation/${type}`) || this.s$(`validation/_default`);
                }else{
                    this.error.email = this.s$(`validation/_default`);
                }
                return false;
            }
            //If No Error
            this.$refs.toasts.make(this.s$('user/toasts/email_changed'), 'success');
            this.$store.commit('myself', response);
            this.data.email = this.editing.email;
            this.isEditing.email = false;
        },
        editPassword(){
            this.editing.old_password = null;
            this.editing.new_password = null;
            this.editing.new_password2 = null;
            this.isEditing.password = true;
            return false;
        },
        async submitPassword(){
            this.isLoading.password = true;
            const response = await this.callAPI('PUT', 'my-password', {
                old_password: this.editing.old_password,
                new_password: this.editing.new_password,
                new_password2: this.editing.new_password2,
            });
            this.isLoading.password = false;
            //If Error
            if (response._error){
                console.log(response.error);
                this.error.password = this.s$(`user/password/error/${response.error}`) || this.s$(`validation/_default`);
                return false;
            }
            //If No Error
            this.$refs.toasts.make(this.s$('user/toasts/password_changed'), 'success');
            this.isEditing.password = false;
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
        <Modal wide ref="personal_info_modal" close-at-bg :title="s$('user/personal_info')">

            <!-- User ID: Display Only -->
            <div class="md:grid md:grid-cols-3 mb-2">
                <div>
                    {{s$('user/column/id')}}
                </div>
                <div class="md:col-span-2">
                    <div class="my-box font-semibold">{{data.id}}</div>
                </div>
            </div>

            <!-- Name -->
            <div class="md:grid md:grid-cols-3 mb-2">
                <div>
                    {{s$('user/column/name')}}
                </div>
                <div class="md:col-span-2">
                    <!-- Not Editing -->
                    <div class="flex" v-if="!isEditing.name">
                        <div class="my-box grow font-semibold">{{data.name}}</div>
                        <button @click="editName" class="btn btn-secondary -my-btn">
                            <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                        </button>
                    </div>
                    <!-- Editing -->
                    <template v-else>
                        <div class="flex">
                            <input type="text" id="name" v-model="editing.name"
                            :placeholder="s$('user/column/name')"
                            @focus="error.name = null" class="my-input grow" />
                            <button @click="submitName" :disabled="isLoading.name"
                            class="btn btn-secondary -my-btn">
                                <span v-if="!isLoading.name">{{s$('general/submit')}}</span>
                                <span v-else><Spinner /></span>
                            </button>
                        </div>
                        <div class="text-error" v-if="error.name">
                            {{error.name}}
                        </div>
                    </template>
                </div>
            </div>

            <!-- Email -->
            <div class="md:grid md:grid-cols-3 mb-2">
                <div>
                    {{s$('user/column/email')}}
                </div>
                <div class="md:col-span-2">
                    <!-- Not Editing -->
                    <div class="flex" v-if="!isEditing.email">
                        <div class="my-box grow font-semibold">{{data.email}}</div>
                        <button @click="editEmail" class="btn btn-secondary -my-btn">
                            <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                        </button>
                    </div>
                    <!-- Editing -->
                    <template v-else>
                        <div class="flex">
                            <input type="text" id="email" v-model="editing.email"
                            :placeholder="s$('user/column/email')"
                            @focus="error.email = null" class="my-input grow" />
                            <button @click="submitEmail" :disabled="isLoading.email"
                            class="btn btn-secondary -my-btn">
                                <span v-if="!isLoading.email">{{s$('general/submit')}}</span>
                                <span v-else><Spinner /></span>
                            </button>
                        </div>
                        <div class="text-error" v-if="error.email">
                            {{error.email}}
                        </div>
                    </template>
                </div>
            </div>

            <!-- Password -->
            <div class="md:grid md:grid-cols-3 mb-2">
                <div class="md:col-span-1">
                    {{s$('user/password')}}
                </div>
                <div class="md:col-span-2">
                    <!-- Not Editing -->
                    <div class="my-box" v-if="!isEditing.password">
                        <button @click="editPassword" class="btn btn-secondary btn-password -my-btn">
                            {{s$('user/password_change')}}
                        </button>
                    </div>
                    <!-- Editing -->
                    <div class="my-box grid grid-cols-2 mb-2" v-else>
                        <div>
                            {{s$('user/password/old')}}
                        </div>
                        <div>
                            <input type="password" id="old_password" v-model="editing.old_password"
                            :placeholder="s$('user/password/old')"
                            @focus="error.password = null" class="my-input-sm w-full mb-2" />
                        </div>
                        <div>
                            {{s$('user/password/new')}}
                        </div>
                        <div>
                            <input type="password" id="new_password" v-model="editing.new_password"
                            :placeholder="s$('user/password/new')"
                            @focus="error.password = null" class="my-input-sm w-full mb-2" />
                        </div>
                        <div>
                            {{s$('user/password/new2')}}
                        </div>
                        <div>
                            <input type="password" id="new_password2" v-model="editing.new_password2"
                            :placeholder="s$('user/password/new2')"
                            @focus="error.password = null" class="my-input-sm w-full mb-2" />
                        </div>
                        <div class="col-span-2">
                            <button @click="submitPassword" class="btn btn-secondary btn-password -my-btn"
                            :disabled="isLoading.password || !editing.old_password || !editing.new_password || !editing.new_password2">
                                <span v-if="!isLoading.password">{{s$('general/submit')}}</span>
                                <span v-else><Spinner /></span>
                            </button>
                            <button @click="isEditing.password = false" class="btn btn-neutral -my-btn">
                                {{s$('general/cancel')}}
                            </button>
                        </div>
                        <div class="col-span-2 text-error" v-if="error.password">
                            {{error.password}}
                        </div>
                    </div>
                </div>
            </div>

        </Modal>

        <!-- Toast Manager -->
        <ToastManager ref="toasts" />
    </div>
</template>

<style scoped>
.btn-password {
    width: 100%;
    max-width: 10rem;
}
</style>