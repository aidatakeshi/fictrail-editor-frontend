<script>
/*
    Editor - Display Settings Modal
*/
import common from '../../mixins/common.js';
import _strings from '../../strings/_strings.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faMoon, faSun, faEye, faLock } from '@fortawesome/free-solid-svg-icons'
library.add( faMoon, faSun, faEye, faLock );

import Modal from '../general/Modal';

export default {
    name: 'EditorDisplaySettingsModal',
    mixins: [common],
    components: {
        FontAwesomeIcon, Modal,
    },

    data: () => ({
        displayParams: [
            'show_map_ref_images', 'show_lat_long_lines', 'show_region_borders', 'show_region_sub_borders',
            'show_stations', 'show_stations_minor', 'show_stations_not_in_use', 'show_stations_signal_only',
            'rail_line_color',
        ],
        displayParamOptions: {
            'rail_line_color': [
                'rail_line_type', 'rail_line', 'rail_operator_type', 'rail_operator',
            ],
        },
        lockParams: [
            'map_ref_image', 'map_land', 'map_water', 'region', 'region_sub',
        ],
        showParams: [
            'map_ref_image', 'line_type', 'operator_type',
        ],
        languages: _strings.languages,
    }),

    mounted(){
    },

    methods: {
        async show(){
            this.$refs.display_settings_modal.show();
        },
        async hide(){
            this.$refs.display_settings_modal.hide();
        },
        getDisplayParam(param){
            return this.$store.state.p_display.display[param];
        },
        saveDisplayParam(param, value){
            this.$store.commit(`p_display/${param}`, value);
            this.$store.dispatch(`p_display/save_display`);
        },
        isDisplayParamDisabled(param){
            if (param === 'show_region_sub_borders'){
                return !this.$store.state.p_display.display['show_region_borders'];
            }
            if (['show_stations_minor', 'show_stations_not_in_use', 'show_stations_signal_only'].includes(param)){
                return !this.$store.state.p_display.display['show_stations'];
            }
            return false;
        },
        displayLockAll(param){
            this.$store.commit(`p_display/unlocked`, {[param]: []});
            this.$store.dispatch(`p_display/save_display`);
        },
        displayShowAll(param){
            this.$store.commit(`p_display/hidden`, {[param]: []});
            this.$store.dispatch(`p_display/save_display`);
        },
        displayHasHiddenItems(param){
            return (this.$store.state.p_display.display.hidden[param] || []).length > 0;
        },
        displayHasUnlockedItems(param){
            return (this.$store.state.p_display.display.unlocked[param] || []).length > 0;
        },
    },

    computed: {
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
    <Modal ref="display_settings_modal" close-at-bg :title="s$('display_settings/title')">

        <!-- Basic Settings -->
        <div class="form-box py-1 mb-2">
            <!-- Color Mode -->
            <label class="label py-1 flex-wrap cursor-pointer">
                <span class="label-text">
                    {{s$(`display_settings/color_mode`)}}
                </span>
                <button class="btn btn-sm btn-toggle" v-if="color_mode !== 'dark'"
                @click="$store.commit('color_mode', 'dark');">
                    <font-awesome-icon size="xl" icon="fa-solid fa-sun" />
                    <span class="ml-1">
                        {{s$(`display_settings/color_mode/normal`)}}
                    </span>
                </button>
                <button class="btn btn-sm btn-toggle" v-else
                @click="$store.commit('color_mode', 'normal')">
                    <font-awesome-icon size="xl" icon="fa-solid fa-moon" />
                    <span class="ml-1">
                        {{s$(`display_settings/color_mode/dark`)}}
                    </span>
                </button>
            </label>
            <!-- Language -->
            <label class="label py-1 flex-wrap cursor-pointer">
                <span class="label-text">
                    {{s$(`display_settings/language`)}}
                </span>
                <select class="select select-sm" :selected="$store.state.language"
                @input="$store.commit('language', $event.target.value)">
                    <option v-for="(language, id) in languages" :key="id" :value="id">
                        {{language.name}}
                    </option>
                </select>
            </label>
        </div>

        <!-- Other Display Settings -->
        <div class="form-box py-1 mb-2">
            <div v-for="param in displayParams" :key="param">
                <!-- Checkbox Mode -->
                <label class="label py-1 cursor-pointer" v-if="!displayParamOptions[param]">
                    <span class="label-text" :class="isDisplayParamDisabled(param) ? 'text-gray-500' : null">
                        {{s$(`display_settings/${param}`)}}
                    </span>
                    <input type="checkbox" class="checkbox" :checked="getDisplayParam(param)"
                    :disabled="isDisplayParamDisabled(param)"
                    @input="saveDisplayParam(param, $event.target.checked)" />
                </label>
                <!-- Select Mode -->
                <label class="label py-1 flex-wrap cursor-pointer" v-else>
                    <span class="label-text" :class="isDisplayParamDisabled(param) ? 'text-gray-500' : null">
                        {{s$(`display_settings/${param}`)}}
                    </span>
                    <select class="select select-sm" :selected="getDisplayParam(param)"
                    :disabled="isDisplayParamDisabled(param)"
                    @input="saveDisplayParam(param, $event.target.value)">
                        <option v-for="(item, i) in displayParamOptions[param]" :key="i" :value="item">
                            {{s$(`display_settings/${param}/${item}`)}}
                        </option>
                    </select>
                </label>
            </div>
        </div>

        <!-- Show All Items -->
        <div class="form-box py-1 mb-2">

            <label class="label pt-1">
                <div class="label-text">
                    <font-awesome-icon icon="fa-solid fa-eye" />
                    <span class="ml-1">{{s$('display_settings/show')}}</span>
                </div>
            </label>

            <div class="mb-2 flex flex-wrap gap-2">
                <button class="btn btn-sm" v-for="param in showParams" :key="param"
                @click="displayShowAll(param)" :disabled="!displayHasHiddenItems(param)">
                    {{s$(`display_settings/type/${param}`)}}
                </button>
            </div>

        </div>

        <!-- Lock All Items -->
        <div class="form-box py-1 mb-2">

            <label class="label pt-1">
                <div class="label-text">
                    <font-awesome-icon icon="fa-solid fa-lock" />
                    <span class="ml-1">{{s$('display_settings/lock')}}</span>
                </div>
            </label>

            <div class="mb-2 flex flex-wrap gap-2">
                <button class="btn btn-sm" v-for="param in lockParams" :key="param"
                @click="displayLockAll(param)" :disabled="!displayHasUnlockedItems(param)">
                    {{s$(`display_settings/type/${param}`)}}
                </button>
            </div>

        </div>

    </Modal>
</template>