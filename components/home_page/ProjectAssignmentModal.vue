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
import ToastManager from '../general/ToastManager'
import RightsBadge from './RightsBadge'

export default {
    name: 'ProjectAssignmentModal',
    mixins: [common],
    components: {
        FontAwesomeIcon,
        Modal, Alert, Spinner, Pagination, RightsBadge, ToastManager,
    },

    data: () => ({
        project: {
            id: null,
            name: null,
            is_public: null,
        },
        pages: null,
        page: null,
        data: [],
        //
        isNew: false,
        user_id: null,
        rights: null,
        error: null,
        isLoading: false,
    }),

    methods: {
        async show(project){
            //Copy project data into this component
            for (let f in this.project) this.project[f] = project[f];
            //Open modal
            this.$refs._modal.show();
            //Load Data
            await this.loadData();
        },
        //Load Assignment Data
        async loadData(_page = 1){
            this.$refs.toasts.setLoading(true);
            const url = `project/${encodeURIComponent(this.project.id)}/assignment`;
            const response = await this.callAPI('GET', url, {_page});
            this.$refs.toasts.setLoading(false);
            if (response._error){
                return false;
            }
            //Proceed
            this.pages = response.pages;
            this.page = response.page;
            this.data = response.data;
        },
        //New Assignment Modal
        newAssignmentModal(){
            this.isNew = true;
            this.user_id = null;
            this.rights = null;
            this.error = null;
            this.isLoading = false;
            this.$refs.assignment_modal.show();
        },
        //Edit Assignment Modal
        editAssignmentModal(user){
            this.isNew = false;
            this.user_id = user.id;
            this.rights = user.my_rights;
            this.error = null;
            this.isLoading = false;
            this.$refs.assignment_modal.show();
        },
        //Submit Assignment
        async submitAssignment(){
            const _project_id = encodeURIComponent(this.project.id);
            const _user_id = encodeURIComponent(this.user_id);
            const _rights = encodeURIComponent(this.rights);
            const url = `project/${_project_id}/assign?user_id=${_user_id}&rights=${_rights}`;
            const response = await this.callAPI('PUT', url);
            //If Error
            if (response._error){
                if (response.error == 'user_not_found'){
                    this.error = this.s$('project_list/user_not_found');
                }else{
                    this.$refs.toasts.make(this.s$('project_list/toasts/submit_error'), 'error');
                }
                return false;
            }
            //If No Error
            this.$refs.assignment_modal.hide();
            if (this.isNew){
                this.$refs.toasts.make(this.s$('project_list/toasts/user_assign_new'), 'success');
            }else{
                this.$refs.toasts.make(this.s$('project_list/toasts/user_assign_edit'), 'success');
            }
            await this.loadData(this.page);
        },
        //Remove Assignment
        async removeAssignment(){
            const _project_id = encodeURIComponent(this.project.id);
            const _user_id = encodeURIComponent(this.user_id);
            const url = `project/${_project_id}/unassign?user_id=${_user_id}`;
            const response = await this.callAPI('PUT', url);
            //If Error
            if (response._error){
                this.$refs.toasts.make(this.s$('project_list/toasts/submit_error'), 'error');
            }
            //If No Error
            this.$refs.assignment_modal.hide();
            this.$refs.toasts.make(this.s$('project_list/toasts/user_assign_remove'), 'success');
            await this.loadData(this.page);
        },
    },
}
</script>

<template>
    <div>
        <Modal wide ref="_modal" close-at-bg>
            <div slot="header">
                <span>{{project.name}}</span>
                <span class="my-id">{{project.id}}</span>
            </div>

            <!-- Public Project Info -->
            <Alert type="info" :content="s$('project_list/project_assign/info_public')" v-if="project.is_public" />

            <!-- Pagination -->
            <div class="flex flex-wrap items-center">
                <button @click="newAssignmentModal()"
                class="btn btn-secondary btn-sm -my-btn my-2">
                    <font-awesome-icon icon="fa-solid fa-plus" />
                    <span class="ml-2">{{s$('project_list/project_assign/assign_user')}}</span>
                </button>
                <Pagination class="ml-auto my-2" :page="page" :pages="pages" @page="loadData" />
            </div>

            <!-- Table-->
            <div class="overflow-x-auto">
                <table class="my-table">
                    <thead>
                        <tr>
                            <th>{{s$('project_list/project_assign/user')}}</th>
                            <th>{{s$('project_list/project_assign/name')}}</th>
                            <th>{{s$('project_list/project_assign/rights')}}</th>
                            <th>{{s$('project_list/project_assign/assigned_by')}}</th>
                            <th>{{s$('project_list/project_assign/change')}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="my-table-hover" v-for="(user, i) in data" :key="user.id"
                        @click="editAssignmentModal(user)">
                            <!-- User -->
                            <td class="text-center">
                                <span class="font-semibold">{{user.id}}</span>
                            </td>
                            <!-- Name -->
                            <td class="text-center">
                                <span class="font-semibold">{{user.name}}</span>
                            </td>
                            <!-- My Rights -->
                            <td class="text-center">
                                <RightsBadge :rights="user.my_rights" />
                            </td>
                            <!-- Assigned By -->
                            <td class="text-center">
                               {{(user.my_assignment||{}).created_by}}
                            </td>
                            <!-- Change -->
                            <td class="text-center w-6">
                                <button @click="editAssignmentModal(user)"
                                :disabled="($store.state.myself||{}).id == user.id"
                                class="btn btn-sm btn-secondary -my-btn -my-1">
                                    <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination (Copy) -->
            <div class="flex flex-wrap items-center">
                <Pagination class="ml-auto my-2" :page="page" :pages="pages" @page="loadData" />
            </div>

        </Modal>
        
        <!-- Edit Assignment Modal -->
        <Modal narrow ref="assignment_modal"
        :title="isNew ? s$('project_list/project_assign/assign_user') : user_id">

            <div class="mb-2" v-if="isNew">
                <label class="label py-0" for="id">
                    {{s$('project_list/project_assign/user_id')}}
                </label>
                <input type="text" id="user_id" v-model="user_id"
                :placeholder="s$('project_list/project_assign/user_id')"
                @focus="error = null" class="my-input w-full" />
            </div>

            <div>
                <label class="label py-0">
                    {{s$('project_list/project_assign/rights')}}
                </label>
                <div class="my-box">
                    <div class="flex items-center"
                    v-for="v in ['owner', 'editor', 'viewer']" :key="v">
                        <input type="radio" :id="`rights_${v}`" @focus="error = null"
                            class="radio" v-model="rights" :value="v"
                        />
                        <label class="label ml-2" :for="`rights_${v}`">
                            <RightsBadge class="badge-md" :rights="v" />
                        </label>
                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <button class="btn btn-primary btn-block -my-btn"
            :disabled="isLoading || !user_id || !rights" @click="submitAssignment">
                <span v-if="!isLoading">{{s$('general/submit')}}</span>
                <span v-else><Spinner /></span>
            </button>

            <!-- Remove Button -->
            <div class="text-center mt-2" v-if="!isNew">
                <button class="btn btn-neutral btn-sm -my-btn" :disabled="isLoading" @click="removeAssignment">
                    <span v-if="!isLoading">
                        <font-awesome-icon icon="fa-solid fa-trash" />
                        <span class="ml-2">{{s$('project_list/remove')}}</span>
                    </span>
                    <span v-else><Spinner /></span>
                </button>
            </div>

            <!-- Error -->
            <label class="label text-error">
                {{error}}
            </label>

        </Modal>

        <!-- Toast Manager -->
        <ToastManager ref="toasts" />
    </div>
</template>