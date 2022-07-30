<script>
/*
    Editor - Menus
*/
import common from '../../mixins/common.js';
import _strings from '../../strings/_strings.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
    faDisplay, faArrowRightFromBracket, faArrowRightToBracket, faBars, faUser, faPerson
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faDisplay, faArrowRightFromBracket, faArrowRightToBracket, faBars, faUser, faPerson
);

import EditorMainMenuIcon from '../icons/EditorMainMenuIcon';
import EditorEditModeIcon from '../icons/EditorEditModeIcon';

export default {
    name: 'EditorMenuBars',
    mixins: [common],
    components: {
        FontAwesomeIcon, EditorMainMenuIcon, EditorEditModeIcon,
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
                <template v-for="(item, i) in main_menu_items">
                    <button class="editing-desktop-menu-btn-1" :key="i" @click="item.click">
                        <EditorMainMenuIcon :type="item.id" class="w-6 h-6" />
                        <span class="ml-1">
                            {{s$(`editor_menu/main_menu/${item.id}`)}}
                        </span>
                    </button>
                </template>
            </template>

            <!-- Login Button -->
            <template v-if="!$store.state.myself">
                <button class="editing-desktop-menu-btn-1" @click="$emit('login-button')">
                    <font-awesome-icon size="xl" icon="fa-solid fa-arrow-right-to-bracket" />
                    <span class="ml-2">{{s$('general/login')}}</span>
                </button>
            </template>

            <!-- Logged In User Display -->
            <div class="dropdown dropdown-end" v-else>
                <label tabindex="0" class="editing-desktop-menu-btn-1">
                    <font-awesome-icon size="xl" icon="fa-solid fa-user" />
                    <span class="ml-2">{{($store.state.myself||{}).name}}</span>
                </label>
                <ul tabindex="0" class="editing-desktop-menu-dropdown mt-1">
                    <li @click="$emit('personal-info-button')">
                        <a>
                            <font-awesome-icon size="xl" icon="fa-solid fa-person" />
                            <span>{{s$('user/personal_info')}}</span>
                        </a>
                    </li>
                    <li @click="$emit('logout-button')">
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
            <div class="dropdown dropdown-top" ref="edit_mode_switch_desktop" v-if="editAllowed">
                
                <label tabindex="0" class="editing-desktop-menu-btn-2">
                    <EditorEditModeIcon :type="edit_mode" class="w-9 h-6" />
                </label>
                <ul tabindex="0" class="editing-desktop-menu-dropdown mb-1">
                    <li class="mb-2 text-center font-bold">
                        {{s$('editor_menu/edit_mode')}}
                    </li>
                    <li v-for="(item, i) in edit_modes" :key="i" @click="changeEditMode(item)">
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
            <button class="editing-desktop-menu-btn-2">
                <font-awesome-icon size="xl" icon="fa-solid fa-display" />
            </button>
            <!------------->
        </div>

        <!-- Editing Menu (Mobile) -->
        <div class="editing-mobile-menu">

        </div>

    </div>
</template>