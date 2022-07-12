<script>
import common from '../../mixins/common.js';
import _languages from '../../strings/_languages.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faMoon, faSun, faLanguage, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
library.add(faMoon, faSun, faLanguage, faArrowRightToBracket);

import TopNavDropdown from './TopNavDropdown';
import TopNavDropdownItem from './TopNavDropdownItem';
import TopNavButton from './TopNavButton';

export default {
    name: 'HomePageTopNav',
    mixins: [common],
    components: {
        FontAwesomeIcon, TopNavDropdown, TopNavDropdownItem, TopNavButton,
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
            <TopNavButton v-if="getColorMode() !== 'dark'" @click="setColorMode('dark')">
                <font-awesome-icon size="xl" icon="fa-solid fa-sun" />
            </TopNavButton>
            <TopNavButton v-if="getColorMode() === 'dark'" @click="setColorMode('normal')">
                <font-awesome-icon size="xl" icon="fa-solid fa-moon" />
            </TopNavButton>
            
            <!-- Language -->
            <TopNavDropdown>
                <font-awesome-icon slot="label" size="xl" icon="fa-solid fa-language" />
                <span slot="label" class="ml-2">
                    {{(languages[getLanguage()]||{}).name_short}}
                </span>
                <TopNavDropdownItem v-for="(language, id) in languages" :key="id"
                :selected="getLanguage() === id" @click="setLanguage(id)">
                    {{language.name}}
                </TopNavDropdownItem>
            </TopNavDropdown>

            <!-- Login Button -->
            <TopNavButton>
                <font-awesome-icon size="xl" icon="fa-solid fa-arrow-right-to-bracket" />
                <span class="ml-2">
                    {{s$('general/login')}}
                </span>
            </TopNavButton>

        </div>

        <!-- Pulldown Menu (Mobile) -->
        <div class="flex md:hidden">
            114514
        </div>

    </div>
</template>