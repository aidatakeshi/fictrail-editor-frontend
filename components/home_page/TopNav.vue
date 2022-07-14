<script>
import common from '../../mixins/common.js';
import _languages from '../../strings/_languages.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
    faMoon, faSun, faLanguage, faArrowRightFromBracket, faArrowRightToBracket, faBars, faUser
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faMoon, faSun, faLanguage, faArrowRightFromBracket, faArrowRightToBracket, faBars, faUser
);

import TopNavDropdown from './TopNavDropdown';
import TopNavDropdownButton from './TopNavDropdownButton';
import AuthHandler from './../general/AuthHandler';

export default {
    name: 'HomePageTopNav',
    mixins: [common],
    components: {
        FontAwesomeIcon,
        TopNavDropdown, TopNavDropdownButton,
        AuthHandler,
    },

    data: () => ({
        languages: _languages.languages,
    }),
}
</script>

<template>
    <div class="bg-jackson text-slate-100 flex items-center px-2 md:pl-8 md:pr-4">

        <!-- Title -->
        <div class="mr-auto text-xl py-2 lg:text-2xl">
            {{s$('general/top_title')}}
        </div>

        <!-- Buttons (Desktop) -->
        <div class="hidden md:flex">

            <!-- Color Mode -->
            <button class="top-nav-button" v-if="getColorMode() !== 'dark'"
            @click="setColorMode('dark');">
                <font-awesome-icon size="xl" icon="fa-solid fa-sun" />
            </button>
            <button class="top-nav-button" v-else
            @click="setColorMode('normal')">
                <font-awesome-icon size="xl" icon="fa-solid fa-moon" />
            </button>
            
            <!-- Language -->
            <div class="dropdown dropdown-end">
                <label tabindex="0" class="top-nav-dropdown">
                    <font-awesome-icon size="xl" icon="fa-solid fa-language" />
                    <span class="ml-2">{{(languages[getLanguage()]||{}).name_short}}</span>
                </label>
                <ul tabindex="0" class="top-nav-dropdown-content">
                    <li v-for="(language, id) in languages" :key="id" @click="setLanguage(id)">
                        <a class="top-nav-dropdown-item" :class="(getLanguage() === id) ? 'selected' : ''">
                            {{language.name}}
                        </a>
                    </li>
                </ul>
            </div>

            <!-- Login Button -->
            <template v-if="!$store.state.myself">
                <button class="top-nav-button" @click="$refs.auth_handler.showLoginModal()">
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
                    <li @click="$refs.auth_handler.handleLogout()">
                        <a class="top-nav-dropdown-item">
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
                        <button class="top-nav-dropdown-button btn-block" @click="$refs.auth_handler.showLoginModal()">
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

                        <button class="top-nav-dropdown-button btn-block" @click="$refs.auth_handler.handleLogout()">
                            <font-awesome-icon size="xl" icon="fa-solid fa-arrow-right-to-bracket" />
                            <span class="ml-2">{{s$('general/logout')}}</span>
                        </button>
                    </template>

                    <hr class="my-1" />

                    <!-- Display Mode -->
                    <div class="flex flex-wrap justify-center">
                        <button class="top-nav-dropdown-button w-12" @click="setColorMode('normal')"
                        :class="(getColorMode() !== 'dark') ? 'selected' : ''">
                            <font-awesome-icon size="xl" icon="fa-solid fa-sun" />
                        </button>
                        <button class="top-nav-dropdown-button w-12" @click="setColorMode('dark')"
                        :class="(getColorMode() === 'dark') ? 'selected' : ''">
                            <font-awesome-icon size="xl" icon="fa-solid fa-moon" />
                        </button>
                    </div>

                    <hr class="my-1" />

                    <!-- Language -->
                    <div class="flex flex-wrap justify-center">
                        <button class="top-nav-dropdown-button w-12" @click="setLanguage(id)"
                        v-for="(language, id) in languages" :key="id"
                        :class="(getLanguage() === id) ? 'selected' : ''">
                            {{language.name_short}}
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <!-- AuthHandler -->
        <AuthHandler ref="auth_handler" />

    </div>
</template>