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
        full: Boolean,
        wide: Boolean,
        narrow: Boolean,
        hideClose: Boolean,
        closeAtBg: Boolean,
        bodyClass: null,
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

    computed: {
        modalBoxClass(){
            if (this.full){
                return ['max-w-full', 'max-h-full', 'rounded-none'];
            }else if (this.narrow){
                return ['max-w-sm', 'rounded-xl', 'm-2'];
            }else if (this.wide){
                return ['max-w-6xl', 'rounded-none', 'sm:rounded-xl', 'm-2'];
            }else{
                return ['rounded-none', 'sm:rounded-xl', 'm-2'];
            }
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
                modal-box relative p-0 w-full flex flex-col
                bg-white dark:bg-black text-black dark:text-white
            " :class="modalBoxClass">

                <div :class="bodyClass">

                    <!-- Header -->
                    <div class="flex items-center bg-slate-600 text-white"
                    v-if="title || $slots.title">
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

                </div>

                <!---------------------------->
            </label>
        </label>

    </div>
</template>