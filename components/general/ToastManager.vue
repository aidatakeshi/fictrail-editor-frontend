<script>
import common from '../../mixins/common.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
    faCircleInfo, faCircleCheck, faCircleExclamation, faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faCircleInfo, faCircleCheck, faCircleExclamation, faTriangleExclamation
);

import Spinner from './Spinner'

export default {
    name: 'ToastManager',
    mixins: [common],
    components: { FontAwesomeIcon, Spinner },

    props: {
    },

    data: () => ({
        nextID: 0,
        toasts: [],
        hideToastAfter: 3000, //In milliseconds
        destroyToastAfter: 6000, //In milliseconds
        isLoading: false,
    }),

    methods: {
        make(content, type = null){ //type: info, success, warning, error
            const toast = {content, type, id: this.nextID++, hidden: false};
            //Push to toasts
            this.toasts.unshift(toast);
            //Set toast life
            setTimeout(this.hideToast, this.hideToastAfter);
            setTimeout(this.destroyToast, this.destroyToastAfter);
        },
        hideToast(){
            for (let i = this.toasts.length - 1; i >= 0; i--){
                if (!this.toasts[i].hidden){
                    return this.toasts[i].hidden = true;
                }
            }
        },
        destroyToast(){
            this.toasts.pop();
        },
        setLoading(isLoading){
            this.isLoading = isLoading;
        },
    },

    computed: {
    },

    watch: {
    }
}
</script>

<template>
    <div>
        <!-- Loading -->
        <div class="toast" v-if="isLoading">
            <div class="alert bg-slate-200 dark:bg-slate-800">
                <Spinner />
                <div class="mt-2">{{s$('general/loading')}}</div>
            </div>
        </div>
        <!-- Toasts -->
        <div class="toast toast-top toast-end">
            <template v-for="(toast, i) in toasts">
                <transition name="fade">
                    <div :id="toast.id" v-if="!toast.hidden">
                        <div v-if="toast.type == 'info'"
                        class="alert gap-2 alert-info">
                            <font-awesome-icon size="xl" icon="fa-solid fa-circle-info" />
                            {{toast.content}}
                        </div>
                        <div v-else-if="toast.type == 'success'"
                        class="alert gap-2 alert-success">
                            <font-awesome-icon size="xl" icon="fa-solid fa-circle-check" />
                            {{toast.content}}
                        </div>
                        <div v-else-if="toast.type == 'warning'"
                        class="alert gap-2 alert-warning">
                            <font-awesome-icon size="xl" icon="fa-solid fa-circle-exclamation" />
                            {{toast.content}}
                        </div>
                        <div v-else-if="toast.type == 'error'"
                        class="alert gap-2 alert-error">
                            <font-awesome-icon size="xl" icon="fa-solid fa-triangle-exclamation" />
                            {{toast.content}}
                        </div>
                        <div v-else
                        class="alert gap-2 bg-slate-200 dark:bg-slate-800">
                            {{toast.content}}
                        </div>
                    </div>
                </transition>
            </template>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>