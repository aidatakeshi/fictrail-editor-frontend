<script>
/**
 * Emits: @login-button, @logout-button, @personal-info-button
 */

import common from '../../mixins/common.js';
import _languages from '../../strings/_languages.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
    faMoon, faSun, faLanguage, faArrowRightFromBracket, faArrowRightToBracket, faBars, faUser, faPerson
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faMoon, faSun, faLanguage, faArrowRightFromBracket, faArrowRightToBracket, faBars, faUser, faPerson
);

export default {
    name: 'HomePageTopNav',
    mixins: [common],
    components: { FontAwesomeIcon },

    data: () => ({
        languages: _languages.languages,
    }),

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
    <div class="bg-parsley text-slate-100 flex items-center px-2 md:pl-8 md:pr-4">

        <!-- Title -->
        <div class="mr-auto text-xl lg:text-2xl font-semibold py-2">
            {{s$('general/top_title')}}
        </div>

        <!-- Buttons (Desktop) -->
        <div class="hidden md:flex">

            <!-- Color Mode -->
            <button class="top-nav-button" v-if="color_mode !== 'dark'"
            @click="$store.commit('color_mode', 'dark');">
                <font-awesome-icon size="xl" icon="fa-solid fa-sun" />
            </button>
            <button class="top-nav-button" v-else
            @click="$store.commit('color_mode', 'normal')">
                <font-awesome-icon size="xl" icon="fa-solid fa-moon" />
            </button>
            
            <!-- Language -->
            <div class="dropdown dropdown-end">
                <label tabindex="0" class="top-nav-dropdown">
                    <font-awesome-icon size="xl" icon="fa-solid fa-language" />
                    <span class="ml-2">{{(languages[lang]||{}).name_short}}</span>
                </label>
                <ul tabindex="0" class="top-nav-dropdown-content">
                    <li v-for="(language, id) in languages" :key="id" @click="$store.commit('language', id)">
                        <a :class="(lang === id) ? 'selected' : ''">
                            {{language.name}}
                        </a>
                    </li>
                </ul>
            </div>

            <!-- Login Button -->
            <template v-if="!$store.state.myself">
                <button class="top-nav-button" @click="$emit('login-button')">
                    <font-awesome-icon size="xl" icon="fa-solid fa-arrow-right-to-bracket" />
                    <span class="ml-2">{{s$('general/login')}}</span>
                </button>
            </template>

            <!-- Logged In User Display -->
            <div class="dropdown dropdown-end" v-else>
                <label tabindex="0" class="top-nav-dropdown">
                    <font-awesome-icon size="xl" icon="fa-solid fa-user" />
                    <span class="ml-2">{{($store.state.myself||{}).name}}</span>
                </label>
                <ul tabindex="0" class="top-nav-dropdown-content">
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

        <!-- Pulldown Menu (Mobile) -->
        <div class="flex md:hidden">
            <div class="dropdown dropdown-end">
                <label tabindex="0" class="top-nav-dropdown">
                    <font-awesome-icon slot="label" size="xl" icon="fa-solid fa-bars" />
                </label>

                <div tabindex="0" class="top-nav-dropdown-card w-64">
                    <!-- Login Button -->
                    <div v-if="!$store.state.myself">
                        <button class="top-nav-dropdown-btn btn-block" @click="$emit('login-button')">
                            <font-awesome-icon size="xl" icon="fa-solid fa-arrow-right-to-bracket" />
                            <span class="ml-2">{{s$('general/login')}}</span>
                        </button>
                    </div>

                    <!-- Logged In User Display -->
                    <template v-else>
                        <div class="text-center font-semibold font-lg mb-2">
                            <font-awesome-icon slot="label" size="xl" icon="fa-solid fa-user" /><!---
                        ---><span slot="label" class="ml-2">
                                {{($store.state.myself||{}).name}}
                            </span>
                        </div>

                        <hr class="my-1" />

                        <button class="top-nav-dropdown-btn btn-block" @click="$emit('personal-info-button')">
                            <font-awesome-icon size="xl" icon="fa-solid fa-person" />
                            <span class="ml-2">{{s$('user/personal_info')}}</span>
                        </button>
                        <button class="top-nav-dropdown-btn btn-block" @click="$emit('logout-button')">
                            <font-awesome-icon size="xl" icon="fa-solid fa-arrow-right-to-bracket" />
                            <span class="ml-2">{{s$('general/logout')}}</span>
                        </button>
                    </template>

                    <hr class="my-1" />

                    <!-- Display Mode -->
                    <div class="flex flex-wrap justify-center">
                        <button class="top-nav-dropdown-btn w-12" @click="$store.commit('color_mode', 'normal')"
                        :class="(color_mode !== 'dark') ? 'selected' : ''">
                            <font-awesome-icon size="xl" icon="fa-solid fa-sun" />
                        </button>
                        <button class="top-nav-dropdown-btn w-12" @click="$store.commit('color_mode', 'dark')"
                        :class="(color_mode === 'dark') ? 'selected' : ''">
                            <font-awesome-icon size="xl" icon="fa-solid fa-moon" />
                        </button>
                    </div>

                    <hr class="my-1" />

                    <!-- Language -->
                    <div class="flex flex-wrap justify-center">
                        <button class="top-nav-dropdown-btn w-12" @click="$store.commit('language', id)"
                        v-for="(language, id) in languages" :key="id"
                        :class="(lang === id) ? 'selected' : ''">
                            {{language.name_short}}
                        </button>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>