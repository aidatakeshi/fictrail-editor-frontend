<script>
/**
 * Emits: 
 */

import common from '../../mixins/common.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
    faPenToSquare, faUserGear, faPlus, faTrash, faPeopleGroup
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faPenToSquare, faUserGear, faPlus, faTrash, faPeopleGroup
);

import Spinner from '../general/Spinner'
import Pagination from '../general/Pagination'
import RightsBadge from './RightsBadge'
import Modal from '../general/Modal'
import ToastManager from '../general/ToastManager'
import ProjectAssignmentModal from './ProjectAssignmentModal'
import ManageUsersModal from './ManageUsersModal'

export default {
    name: 'HomePageProjectList',
    mixins: [common],
    components: {
        FontAwesomeIcon,
        Spinner, Pagination, RightsBadge, Modal, ToastManager,
        ProjectAssignmentModal, ManageUsersModal,
    },

    data: () => ({
        pages: null,
        page: null,
        limit: null,
        from: null,
        to: null,
        count: null,
        data: [],
        can_create_new_project: false,
        is_root_user: false,
        //New / Editing Project
        edit_project: {
            isNew: false,
            isLoading: false,
            data: {
                id: null, name: null, is_public: null, my_rights: null,
            },
            default: {
                id: "", name: "", is_public: false,
            },
            error: {
                id: null, name: null, is_public: null,
            },
        },
    }),

    methods: {
        async loadData(_page = 1){
            const myself = this.$store.state.myself;
            this.can_create_new_project = ((myself || {}).can_create_new_project == true);
            this.is_root_user = ((myself || {}).is_root_user == true);
            this.$refs.toasts.setLoading(true);
            //Get Project List
            let response;
            if (myself){
                response = await this.callAPI('GET', 'project', {_page});
            }else{
                response = await this.callAPI('GET', 'project-public', {_page}, false);
            }
            this.$refs.toasts.setLoading(false);
            //If errors
            if (response._error){
                return false;
            }
            //If no errors
            for (let f in response) this[f] = response[f];
        },
        editProjectModal(project){
            this.edit_project.isNew = false;
            for (let f in this.edit_project.data) this.edit_project.data[f] = project[f];
            this.resetProjectModalErrors();
            this.$refs.edit_project_modal.show();
        },
        newProjectModal(){
            this.edit_project.isNew = true;
            for (let f in this.edit_project.data) this.edit_project.data[f] = this.edit_project.default[f];
            this.resetProjectModalErrors();
            this.$refs.edit_project_modal.show();
        },
        resetProjectModalErrors(){
            for (let f in this.edit_project.error) this.edit_project.error[f] = null;
        },
        async submitProjectModal(){
            //Call API
            const isNew = this.edit_project.isNew;
            const method = isNew ? 'POST' : 'PUT';
            const url = isNew ? 'project' : `project_list/${encodeURIComponent(this.edit_project.data.id)}`;
            this.edit_project.isLoading = true;
            const response = await this.callAPI(method, url, this.edit_project.data);
            this.edit_project.isLoading = false;
            //If Error
            if (response._error){
                if (response.error == 'validation_error'){
                    for (let {field, type} of response.details){
                        console.log({field, type});
                        if (this.edit_project.error[field] === null){
                            this.edit_project.error[field] = this.s$(`validation/${type}`) || this.s$(`validation/_default`);
                        }
                    }
                }else{
                    this.$refs.toasts.make(this.s$('project_list/toasts/submit_error'), 'error');
                }
                return false;
            }
            //If No Error
            this.$refs.edit_project_modal.hide();
            if (isNew){
                this.$refs.toasts.make(this.s$('project_list/toasts/new_success'), 'success');
            }else{
                this.$refs.toasts.make(this.s$('project_list/toasts/edit_success'), 'success');
            }
            await this.loadData(this.page);
        },
        async removeProjectModal(){
            const p = prompt(this.s$('project_list/remove/confirm'));
            if (p !== this.edit_project.data.id){
                this.$refs.toasts.make(this.s$('project_list/toasts/confirmation_failed'), 'error');
                return false;
            }
            //Proceed Removal
            this.edit_project.isLoading = true;
            const response = await this.callAPI('DELETE', `project_list/${encodeURIComponent(this.edit_project.data.id)}`);
            this.edit_project.isLoading = false;
            //If Error
            if (response._error){
                this.$refs.toasts.make(this.s$('project_list/toasts/submit_error'), 'error');
                return false;
            }
            //If No Error
            this.$refs.edit_project_modal.hide();
            this.$refs.toasts.make(this.s$('project_list/toasts/remove_success'), 'success');
            await this.loadData(this.page);
        },
    },
}
</script>

<template>
    <div>
        <h3 class="text-2xl lg:text-3xl font-semibold my-2">
            {{s$('project_list/list_title')}}
        </h3>

        <!-- Results -->
        <div v-if="data.length">

            <!-- Pagination -->
            <div class="flex flex-wrap items-center gap-1">
                <button v-if="can_create_new_project" @click="newProjectModal()"
                class="btn btn-secondary btn-sm my-2">
                    <font-awesome-icon icon="fa-solid fa-plus" />
                    <span class="ml-2">{{s$('project_list/new_project')}}</span>
                </button>
                <button v-if="is_root_user" @click="$refs.manage_users_modal.show()"
                class="btn btn-neutral btn-sm my-2">
                    <font-awesome-icon icon="fa-solid fa-people-group" />
                    <span class="ml-2">{{s$('user/manage_users')}}</span>
                </button>
                <Pagination class="ml-auto my-2" :page="page" :pages="pages" @page="loadData" />
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
                <table class="my-table">
                    <thead>
                        <tr>
                            <th>{{s$('project_list/column/project')}}</th>
                            <th>{{s$('project_list/column/id')}}</th>
                            <th>{{s$('project_list/column/my_rights')}}</th>
                            <th>{{s$('project_list/column/created_by')}}</th>
                            <template v-if="$store.state.myself">
                                <th>{{s$('project_list/column/edit')}}</th>
                                <th>{{s$('project_list/column/users')}}</th>
                            </template>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="my-table-hover" v-for="(project, i) in data" :key="project.id">
                            <!-- Project -->
                            <td @click="$router.push(`/${project.id}`)">
                                <nuxt-link :to="`/${project.id}`">
                                    <span class="font-semibold">{{project.name}}</span>
                                    <div class="badge badge-accent text-white badge-sm md:badge-md" v-if="project.is_public">
                                        {{s$('project_list/public')}}
                                    </div>
                                </nuxt-link>
                            </td>
                            <!-- ID -->
                            <td @click="$router.push(`/${project.id}`)" class="text-center">
                                <nuxt-link :to="`/${project.id}`">
                                    <span class="id">{{project.id}}</span>
                                </nuxt-link>
                            </td>
                            <!-- My Rights -->
                            <td @click="$router.push(`/${project.id}`)" class="text-center">
                                <nuxt-link :to="`/${project.id}`">
                                    <RightsBadge :rights="project.my_rights" />
                                </nuxt-link>
                            </td>
                            <!-- Created -->
                            <td @click="$router.push(`/${project.id}`)" class="text-center">
                                <nuxt-link :to="`/${project.id}`">
                                    {{project.created_by}}
                                </nuxt-link>
                            </td>
                            <!-- Edit & Assign -->
                            <template v-if="$store.state.myself">
                                <td class="text-center w-6">
                                    <button @click="editProjectModal(project)"
                                    class="btn btn-sm btn-secondary -my-1"
                                    :disabled="!['root', 'owner', 'editor'].includes(project.my_rights)">
                                        <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                                    </button>
                                </td>
                                <td class="text-center w-6">
                                    <button @click="$refs.project_assignment_modal.show(project)"
                                    class="btn btn-sm btn-secondary -my-1"
                                    :disabled="!['root', 'owner'].includes(project.my_rights)">
                                        <font-awesome-icon icon="fa-solid fa-user-gear" />
                                    </button>
                                </td>
                            </template>
                            <!--------------------------->
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination (Copy) -->
            <div class="flex flex-wrap items-center gap-1">
                <Pagination class="ml-auto my-2" :page="page" :pages="pages" @page="loadData" />
            </div>

        </div>

        <!-- New / Edit Project Modal -->
        <Modal narrow ref="edit_project_modal" close-at-bg
        :title="s$(`project_list/${edit_project.isNew ? 'new_project' : 'edit_project'}`)">

            <div class="mb-2">
                <label class="label py-0" for="id">
                    <span class="label-text">{{s$('project_list/edit_project/id')}}</span>
                </label>
                <input type="text" id="id" v-model="edit_project.data.id"
                :placeholder="s$('project_list/edit_project/id')" :disabled="!edit_project.isNew"
                @focus="resetProjectModalErrors" class="input w-full" />
                <label class="label py-0 text-error">
                    {{edit_project.error.id}}
                </label>
            </div>

            <div class="mb-2">
                <label class="label py-0" for="name">
                    <span class="label-text">{{s$('project_list/edit_project/name')}}</span>
                </label>
                <input type="text" id="name" v-model="edit_project.data.name"
                :placeholder="s$('project_list/edit_project/name')"
                @focus="resetProjectModalErrors" class="input w-full" />
                <label class="label py-0 text-error">
                    {{edit_project.error.name}}
                </label>
            </div>

            <div class="mb-2">
                <label class="label cursor-pointer py-0">
                    <span class="label-text">{{s$('project_list/edit_project/is_public')}}</span>
                    <input type="checkbox" class="checkbox" v-model="edit_project.data.is_public" />
                </label>
            </div>

            <!-- Submit Button -->
            <button class="btn btn-primary btn-block"
            :disabled="edit_project.isLoading" @click="submitProjectModal">
                <span v-if="!edit_project.isLoading">{{s$('general/submit')}}</span>
                <span v-else><Spinner /></span>
            </button>

            <!-- Remove Button -->
            <div class="text-center mt-2"
            v-if="!edit_project.isNew && edit_project.data.my_rights != 'editor'">
                <button class="btn btn-neutral btn-sm"
                :disabled="edit_project.isLoading" @click="removeProjectModal">
                    <span v-if="!edit_project.isLoading">
                        <font-awesome-icon icon="fa-solid fa-trash" />
                        <span class="ml-2">{{s$('project_list/remove')}}</span>
                    </span>
                    <span v-else><Spinner /></span>
                </button>
            </div>

        </Modal>

        <!-- Toast Manager -->
        <ToastManager ref="toasts" />

        <!-- Project Assignment Modal -->
        <ProjectAssignmentModal ref="project_assignment_modal" />

        <!-- Manage Users Modal -->
        <ManageUsersModal v-if="is_root_user" ref="manage_users_modal" />

    </div>
</template>