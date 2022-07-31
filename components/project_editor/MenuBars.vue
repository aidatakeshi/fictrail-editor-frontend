<script>
/*
    Editor - Menus
*/
import common from '../../mixins/common.js';
import _strings from '../../strings/_strings.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
    faDisplay, faArrowRightFromBracket, faArrowRightToBracket, faBars, faUser, faPerson, faHouse
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faDisplay, faArrowRightFromBracket, faArrowRightToBracket, faBars, faUser, faPerson, faHouse
);

import EditorMainMenuIcon from '../icons/EditorMainMenuIcon';
import EditorEditModeIcon from '../icons/EditorEditModeIcon';
import DisplaySettingsModal from './DisplaySettingsModal';
import Drawer from '../general/Drawer';

export default {
    name: 'EditorMenuBars',
    mixins: [common],
    components: {
        FontAwesomeIcon, Drawer,
        EditorMainMenuIcon, EditorEditModeIcon,
        DisplaySettingsModal,
    },

    data: () => ({
        main_menu_items: [
            { id: 'project_settings', click: () => {} },
            { id: 'rail_operators', click: () => {} },
            { id: 'regions', click: () => {} },
            { id: 'lines_stations', click: () => {} },
            { id: 'trains', click: () => {} },
            { id: 'schedule', click: () => {} },
            { id: 'stats', click: () => {} },
        ],
        edit_modes: [
            'ref_images', 'lands_waters', 'regions', 'lines_stations',
        ],
        languages: _strings.languages,
    }),

    mounted(){
    },

    methods: {
        changeEditMode(editMode){
            this.$store.commit('p_display/edit_mode', editMode);
            this.$store.dispatch('p_display/save_edit_mode');
        },
    },

    computed: {
        editAllowed(){
            return this.$store.getters['p_data/editAllowed'];
        },
        edit_mode(){
            return this.$store.state.p_display.edit_mode;
        },
        lang: function(){
            return this.$store.getters.language;
        },
        color_mode: function(){
            return this.$store.getters.color_mode;
        }
    },
}

</script>

<template>
    <div>
        
        <!-- Editing Menu (Desktop, Top) -->
        <div class="editing-desktop-top-menu">

            <!-- Main Menu Items -->
            <template v-if="editAllowed">
                <button class="editing-menu-btn-main" v-for="(item, i) in main_menu_items" :key="i"
                @click="item.click">
                    <EditorMainMenuIcon :type="item.id" class="w-6 h-6" />
                    <span class="ml-1">
                        {{s$(`editor_menu/main_menu/${item.id}`)}}
                    </span>
                </button>
            </template>

            <!-- Login Button -->
            <template v-if="!$store.state.myself">
                <button class="editing-menu-btn-main" @click="$emit('login-button')">
                    <font-awesome-icon size="xl" icon="fa-solid fa-arrow-right-to-bracket" />
                    <span class="ml-2">{{s$('general/login')}}</span>
                </button>
                <button class="editing-menu-btn-main" @click="$router.push('/')">
                        <font-awesome-icon size="xl" icon="fa-solid fa-house" />
                </button>
            </template>

            <!-- Logged In User Display -->
            <div class="dropdown dropdown-end" v-else>
                <label tabindex="0" class="editing-menu-btn-main">
                    <font-awesome-icon size="xl" icon="fa-solid fa-user" />
                    <span class="ml-2">{{($store.state.myself||{}).name}}</span>
                </label>
                <ul tabindex="0" class="my-dropdown mt-2" ref="menu_user_d">
                    <li @click="$emit('personal-info-button'); $refs['menu_user_d'].blur();">
                        <a>
                            <font-awesome-icon size="xl" icon="fa-solid fa-person" />
                            <span>{{s$('user/personal_info')}}</span>
                        </a>
                    </li>
                    <li @click="$router.push('/')">
                        <a>
                            <font-awesome-icon size="xl" icon="fa-solid fa-house" />
                            <span>{{s$('editor_menu/return_home')}}</span>
                        </a>
                    </li>
                    <li @click="$emit('logout-button'); $refs['menu_user_d'].blur();">
                        <a>
                            <font-awesome-icon size="xl" icon="fa-solid fa-arrow-right-to-bracket" />
                            <span>{{s$('general/logout')}}</span>
                        </a>
                    </li>
                </ul>
            </div>

        </div>

        <!-- Editing Menu (Desktop, Bottom) -->
        <div class="editing-desktop-bottom-menu">
            <!-- Edit Mode Switcher-->
            <div class="dropdown dropdown-top" v-if="editAllowed">
                <label tabindex="0" class="editing-menu-btn-sub">
                    <EditorEditModeIcon :type="edit_mode" class="w-9 h-6" />
                </label>
                <ul tabindex="0" class="my-dropdown mb-2" ref="editor_mode_d">
                    <li class="mb-2 text-center font-bold">
                        {{s$('editor_menu/edit_mode')}}
                    </li>
                    <li v-for="(item, i) in edit_modes" :key="i"
                    @click="changeEditMode(item); $refs['editor_mode_d'].blur();">
                        <a :class="edit_mode === item ? 'selected' : null">
                            <EditorEditModeIcon :type="item" class="w-9 h-6" />
                            <span class="ml-1">
                                {{s$(`editor_menu/edit_mode/${item}`)}}
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- Display Settings -->
            <button class="editing-menu-btn-sub" @click="$refs.display_settings_modal.show()">
                <font-awesome-icon size="xl" icon="fa-solid fa-display" />
            </button>
            <!------------->
        </div>

        <!-- Editing Menu (Mobile) -->
        <div class="editing-mobile-menu">

            <!-- Display Settings -->
            <button class="editing-menu-btn-sub" @click="$refs.display_settings_modal.show()">
                <font-awesome-icon size="xl" icon="fa-solid fa-display" />
            </button>

            <!-- Edit Mode Switcher-->
            <div class="dropdown dropdown-end" v-if="editAllowed">
                <label tabindex="0" class="editing-menu-btn-sub">
                    <EditorEditModeIcon :type="edit_mode" class="w-9 h-6" />
                </label>
                <ul tabindex="0" class="my-dropdown mt-2" ref="editor_mode_d">
                    <li class="mb-2 text-center font-bold">
                        {{s$('editor_menu/edit_mode')}}
                    </li>
                    <li v-for="(item, i) in edit_modes" :key="i"
                    @click="changeEditMode(item); $refs['editor_mode_d'].blur();">
                        <a :class="edit_mode === item ? 'selected' : null">
                            <EditorEditModeIcon :type="item" class="w-9 h-6" />
                            <span class="ml-1">
                                {{s$(`editor_menu/edit_mode/${item}`)}}
                            </span>
                        </a>
                    </li>
                </ul>
            </div>

            <!-- Main Menu & User Name-->
            <button class="editing-menu-btn-mobile-toggle" @click="$refs.drawer_mobile.show()">
                <font-awesome-icon slot="label" size="xl" icon="fa-solid fa-bars" />
            </button>

        </div>

        <Drawer ref="drawer_mobile">

            <!-- User Name -->
            <template v-if="$store.state.myself">

                <div class="text-center font-semibold font-lg mb-2">
                    <font-awesome-icon slot="label" size="xl" icon="fa-solid fa-user" /><!---
                ---><span slot="label" class="ml-2">
                        {{($store.state.myself||{}).name}}
                    </span>
                </div>

                <hr class="my-1" />

            </template>

            <!-- Main Menu Items -->
            <template v-if="editAllowed">
                
                <button class="my-drawer-btn btn-block" v-for="(item, i) in main_menu_items" :key="i"
                @click="item.click(); $refs['menu_main_m'].blur();">
                    <EditorMainMenuIcon :type="item.id" class="w-6 h-6" />
                    <span class="ml-1">
                        {{s$(`editor_menu/main_menu/${item.id}`)}}
                    </span>
                </button>

                <hr class="my-1" />

            </template>
            
            <!-- Logged In User Display -->
            <template v-if="$store.state.myself">

                <button class="my-drawer-btn btn-block"
                @click="$emit('personal-info-button'); $event.target.blur();">
                    <font-awesome-icon size="xl" icon="fa-solid fa-person" />
                    <span class="ml-2">{{s$('user/personal_info')}}</span>
                </button>
                <button class="my-drawer-btn btn-block" @click="$router.push('/')">
                    <font-awesome-icon size="xl" icon="fa-solid fa-house" />
                    <span class="ml-2">{{s$('editor_menu/return_home')}}</span>
                </button>
                <button class="my-drawer-btn btn-block"
                @click="$emit('logout-button'); $event.target.blur();">
                    <font-awesome-icon size="xl" icon="fa-solid fa-arrow-right-to-bracket" />
                    <span class="ml-2">{{s$('general/logout')}}</span>
                </button>

                <hr class="my-1" />

            </template>

            <!-- Login Button (Not Logged In) -->
            <template v-else>

                <button class="my-drawer-btn btn-block"
                @click="$emit('login-button'); $event.target.blur();">
                    <font-awesome-icon size="xl" icon="fa-solid fa-arrow-right-to-bracket" />
                    <span class="ml-2">{{s$('general/login')}}</span>
                </button>
                <button class="my-drawer-btn btn-block" @click="$router.push('/')">
                    <font-awesome-icon size="xl" icon="fa-solid fa-house" />
                    <span class="ml-2">{{s$('editor_menu/return_home')}}</span>
                </button>

                <hr class="my-1" />

            </template>

        </Drawer>

        <!-- Display Settings Modal -->
        <DisplaySettingsModal ref="display_settings_modal" />

    </div>
</template>