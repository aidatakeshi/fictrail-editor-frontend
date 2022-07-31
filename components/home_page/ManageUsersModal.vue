<script>
/**
 * Emits: 
 */

import common from '../../mixins/common.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
    faCircleInfo, faPenToSquare, faTrash,
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faCircleInfo, faPenToSquare, faTrash,
);

import Modal from '../general/Modal'
import Alert from '../general/Alert'
import Spinner from '../general/Spinner'
import Pagination from '../general/Pagination'
import TickCross from '../general/TickCross'
import ToastManager from '../general/ToastManager' 

export default {
    name: 'ManageUsersModal',
    mixins: [common],
    components: {
        FontAwesomeIcon,
        Modal, Alert, Spinner, Pagination, ToastManager, TickCross,
    },

    data: () => ({
        pages: null,
        page: null,
        data: [],
        //New / Editing User
        edit_user: {
            isNew: false,
            isLoading: false,
            isMyself: null,
            data: {
                id: null, name: null, email: null, is_root_user: null,
                can_create_new_project: null, is_enabled: null,
                password: null,
            },
            default: {
                id: "", name: "", email: null, is_root_user: false,
                can_create_new_project: true, is_enabled: true,
                password: "",
            },
            error: {
                id: null, name: null, email: null, is_root_user: null,
                can_create_new_project: null, is_enabled: null,
                password: null,
            },
        },
    }),

    methods: {
        async show(){
            //Open modal
            this.$refs._modal.show();
            //Load Data
            await this.loadData();
        },
        //Load Assignment Data
        async loadData(_page = 1){
            this.$refs.toasts.setLoading(true);
            const response = await this.callAPI('GET', 'user', {_page});
            this.$refs.toasts.setLoading(false);
            if (response._error){
                return false;
            }
            //Proceed
            this.pages = response.pages;
            this.page = response.page;
            this.data = response.data;
        },
        //Edit User
        editUserModal(user){
            this.edit_user.isNew = false;
            this.edit_user.isMyself = this.edit_user.data.id == (this.$store.state.myself || {}).id;
            for (let f in this.edit_user.data) this.edit_user.data[f] = user[f];
            this.edit_user.data.password = null;
            this.resetUserModalErrors();
            this.$refs.edit_user_modal.show();
        },
        //New User
        newUserModal(){
            this.edit_user.isNew = true;
            this.edit_user.isMyself = null;
            for (let f in this.edit_user.data) this.edit_user.data[f] = this.edit_user.default[f];
            this.resetUserModalErrors();
            this.$refs.edit_user_modal.show();
        },
        resetUserModalErrors(){
            for (let f in this.edit_user.error) this.edit_user.error[f] = null;
        },
        //Submit New / Edit User
        async submitUser(){
            //Call API
            const isNew = this.edit_user.isNew;
            const method = isNew ? 'POST' : 'PUT';
            const url = isNew ? 'user' : `user/${encodeURIComponent(this.edit_user.data.id)}`;
            let data = this.edit_user.data;
            if (!data.password) delete data.password;
            this.edit_user.isLoading = true;
            const response = await this.callAPI(method, url, data);
            this.edit_user.isLoading = false;
            //If Error
            if (response._error){
                if (response.error == 'validation_error'){
                    for (let {field, type} of response.details){
                        console.log({field, type});
                        if (this.edit_user.error[field] === null){
                            this.edit_user.error[field] = this.s$(`validation/${type}`) || this.s$(`validation/_default`);
                        }
                    }
                }else{
                    this.$refs.toasts.make(this.s$('user/toasts/submit_error'), 'error');
                }
                return false;
            }
            //If No Error
            this.$refs.edit_user_modal.hide();
            if (isNew){
                this.$refs.toasts.make(this.s$('user/toasts/new_success'), 'success');
            }else{
                this.$refs.toasts.make(this.s$('user/toasts/edit_success'), 'success');
            }
            await this.loadData(this.page);
        },
        async removeUser(){
            const p = prompt(this.s$('user/remove/confirm'));
            if (p !== this.edit_user.data.id){
                this.$refs.toasts.make(this.s$('user/toasts/confirmation_failed'), 'error');
                return false;
            }
            //Proceed Removal
            this.edit_user.isLoading = true;
            const response = await this.callAPI('DELETE', `user/${encodeURIComponent(this.edit_user.data.id)}`);
            this.edit_user.isLoading = false;
            //If Error
            if (response._error){
                this.$refs.toasts.make(this.s$('user/toasts/submit_error'), 'error');
                return false;
            }
            //If No Error
            this.$refs.edit_user_modal.hide();
            this.$refs.toasts.make(this.s$('user/toasts/remove_success'), 'success');
            await this.loadData(this.page);
        },
    },
}
</script>

<template>
    <div>
        <Modal full ref="_modal" :title="s$('user/manage_users')" close-at-bg>

            <!-- Pagination -->
            <div class="flex flex-wrap items-center">
                <button @click="newUserModal()"
                class="btn btn-secondary btn-sm my-2">
                    <font-awesome-icon icon="fa-solid fa-plus" />
                    <span class="ml-2">{{s$('user/new_user')}}</span>
                </button>
                <Pagination class="ml-auto my-2" :page="page" :pages="pages" @page="loadData" />
            </div>

            <!-- Table-->
            <div class="overflow-x-auto">
                <table class="my-table">
                    <thead>
                        <tr>
                            <th>{{s$('user/column/id')}}</th>
                            <th>{{s$('user/column/name')}}</th>
                            <th>{{s$('user/column/email')}}</th>
                            <th>{{s$('user/column/is_enabled')}}</th>
                            <th>{{s$('user/column/new_project_s')}}</th>
                            <th>{{s$('user/column/is_root_user')}}</th>
                            <th>{{s$('user/column/created_by')}}</th>
                            <th>{{s$('user/column/edit')}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="my-table-hover" v-for="(user, i) in data" :key="user.id"
                        @click="editUserModal(user)">
                            <!-- ID -->
                            <td class="text-center">
                                <span class="font-semibold">{{user.id}}</span>
                            </td>
                            <!-- Name -->
                            <td class="text-center">
                                <span class="font-semibold">{{user.name}}</span>
                            </td>
                            <!-- Email -->
                            <td class="text-center">
                                {{user.email}}
                            </td>
                            <!-- Enabled -->
                            <td class="text-center">
                                <TickCross :value="user.is_enabled" />
                            </td>
                            <!-- Can Create New Project -->
                            <td class="text-center">
                                <TickCross :value="user.can_create_new_project" />
                            </td>
                            <!-- Root User -->
                            <td class="text-center">
                                <TickCross :value="user.is_root_user" />
                            </td>
                            <!-- Created By -->
                            <td class="text-center">
                                {{user.created_by}}
                            </td>
                            <!-- Edit -->
                            <td class="text-center w-6">
                                <button @click="editUserModal(user)"
                                class="btn btn-sm btn-secondary -my-1">
                                    <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination (Copy) -->
            <div class="flex flex-wrap items-center">
                <div class="h-4" />
                <Pagination class="ml-auto my-2" :page="page" :pages="pages" @page="loadData" />
            </div>

        </Modal>

        <!-- New / Edit User Modal -->
        <Modal narrow ref="edit_user_modal" close-at-bg
        :title="edit_user.isNew ? s$(`user/new_user`) : edit_user.data.id">

            <div class="mb-2">
                <label class="label py-0" for="id">
                    <span class="label-text">{{s$('user/column/id')}}</span>
                </label>
                <input type="text" id="id" v-model="edit_user.data.id"
                :placeholder="s$('user/column/id')" :disabled="!edit_user.isNew"
                @focus="resetUserModalErrors" class="input w-full" />
                <label class="label py-0 text-error">
                    {{edit_user.error.id}}
                </label>
            </div>

            <div class="mb-2">
                <label class="label py-0" for="name">
                    <span class="label-text">{{s$('user/column/name')}}</span>
                </label>
                <input type="text" id="name" v-model="edit_user.data.name"
                :placeholder="s$('user/column/name')"
                @focus="resetUserModalErrors" class="input w-full" />
                <label class="label py-0 text-error">
                    {{edit_user.error.name}}
                </label>
            </div>

            <div class="mb-2">
                <label class="label py-0" for="email">
                    <span class="label-text">{{s$('user/column/email')}}</span>
                </label>
                <input type="text" id="email" v-model="edit_user.data.email"
                :placeholder="s$('user/column/email')"
                @focus="resetUserModalErrors" class="input w-full" />
                <label class="label py-0 text-error">
                    {{edit_user.error.email}}
                </label>
            </div>

            <div class="mb-2">
                <label class="label py-0" for="password">
                    <span class="label-text">{{s$('user/password')}}</span>
                </label>
                <input type="password" id="password" v-model="edit_user.data.password"
                :placeholder="edit_user.isNew ? s$('user/password') : s$('user/password_change_needed')"
                @focus="resetUserModalErrors" class="input w-full" />
                <label class="label py-0 text-error">
                    {{edit_user.error.password}}
                </label>
            </div>

            <div class="mb-2">
                <label class="label cursor-pointer py-0">
                    <span class="label-text">{{s$('user/column/is_enabled')}}</span>
                    <input type="checkbox" class="checkbox"
                    :disabled="edit_user.isMyself" v-model="edit_user.data.is_enabled" />
                </label>
            </div>

            <div class="mb-2">
                <label class="label cursor-pointer py-0">
                    <span class="label-text">{{s$('user/column/is_root_user')}}</span>
                    <input type="checkbox" class="checkbox"
                    :disabled="edit_user.isMyself" v-model="edit_user.data.is_root_user" />
                </label>
            </div>

            <div class="mb-2">
                <label class="label cursor-pointer py-0">
                    <span class="label-text">{{s$('user/column/can_create_new_project')}}</span>
                    <input type="checkbox" class="checkbox"
                    :disabled="edit_user.isMyself" v-model="edit_user.data.can_create_new_project" />
                </label>
            </div>

            <!-- Submit Button -->
            <button class="btn btn-primary btn-block"
            :disabled="edit_user.isLoading" @click="submitUser">
                <span v-if="!edit_user.isLoading">{{s$('general/submit')}}</span>
                <span v-else><Spinner /></span>
            </button>

            <!-- Remove Button -->
            <div class="text-center mt-2"
            v-if="!edit_user.isNew && !edit_user.isMyself">
                <button class="btn btn-neutral btn-sm"
                :disabled="edit_user.isLoading" @click="removeUser">
                    <span v-if="!edit_user.isLoading">
                        <font-awesome-icon icon="fa-solid fa-trash" />
                        <span class="ml-2">{{s$('user/remove')}}</span>
                    </span>
                    <span v-else><Spinner /></span>
                </button>
            </div>

        </Modal>

        <!-- Toast Manager -->
        <ToastManager ref="toasts" />
    </div>
</template>