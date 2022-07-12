<script>
//import common from '../../mixins/common.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faXmark } from '@fortawesome/free-solid-svg-icons'
library.add(faXmark);

export default {
    name: 'Modal',
    //mixins: [common],
    components: { FontAwesomeIcon },

    props: {
        title: String,
        trigger: null,
        wide: Boolean,
        hideClose: Boolean,
        closeAtBg: Boolean,
    },

    data: () => ({
        toggle: false,
    }),

    methods: {
        show(){
            this.toggle = true;
        },
        hide(){
            this.toggle = false;
        },
    },

    watch: {
        trigger(value){
            this.toggle = !!value;
        }
    }
}
</script>

<template>
    <div>
        <input type="checkbox" id="_modal" class="modal-toggle" v-model="toggle" />

        <label :for="closeAtBg ? '_modal' : ''"
        class="modal" :class="closeAtBg ? 'cursor-pointer' : null">

            <label for="" class="
                modal-box relative p-0 m-2 w-full flex flex-col
                bg-white dark:bg-black rounded-none sm:rounded-xl
            " :class="wide ? 'max-w-6xl' : null">

                <!-- Header -->
                <div class="flex items-center bg-slate-600 text-white">
                    <h3 class="text-lg font-bold px-2 sm:px-4 py-3">
                        <slot name="header">
                            {{title}}
                        </slot>
                    </h3>
                    <button class="btn btn-ghost ml-auto" v-if="!hideClose" @click="toggle = false">
                        <font-awesome-icon size="xl" icon="fa-solid fa-xmark" />
                    </button>
                </div>

                <!-- Main Content -->
                <div class="overflow-y-auto">
                    <div class="p-2 sm:px-4">
                        <slot />
                    </div>
                </div>

                <!-- Footer -->
                <div v-if="$slots.footer"
                class="bg-slate-300 dark:bg-slate-700 px-2 sm:px-4 py-2">
                    <slot name="footer" />
                </div>

                <!---------------------------->
            </label>
        </label>

    </div>
</template>