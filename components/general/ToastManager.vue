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
            this.toasts.push(toast);
            //Set toast life
            setTimeout(this.hideToast, this.hideToastAfter);
            setTimeout(this.destroyToast, this.destroyToastAfter);
        },
        hideToast(){
            for (let i in this.toasts){
                if (!this.toasts[i].hidden){
                    return this.toasts[i].hidden = true;
                }
            }
        },
        destroyToast(){
            this.toasts.shift();
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
            <div class="alert shadow-lg bg-slate-200 dark:bg-slate-800">
                <div>
                    <Spinner />
                    <span>{{s$('general/loading')}}</span>
                </div>
            </div>
        </div>
        <!-- Toasts -->
        <div class="toast">
            <template v-for="(toast, i) in toasts">
                <transition name="fade">
                    <div :id="toast.id" v-if="!toast.hidden">
                        <div v-if="toast.type == 'info'" class="alert shadow-lg alert-info">
                            <div>
                                <font-awesome-icon size="xl" icon="fa-solid fa-circle-info" />
                                <span>{{toast.content}}</span>
                            </div>
                        </div>
                        <div v-else-if="toast.type == 'success'" class="alert shadow-lg alert-success">
                            <div>
                                <font-awesome-icon size="xl" icon="fa-solid fa-circle-check" />
                                <span>{{toast.content}}</span>
                            </div>
                        </div>
                        <div v-else-if="toast.type == 'warning'" class="alert shadow-lg alert-warning">
                            <div>
                                <font-awesome-icon size="xl" icon="fa-solid fa-circle-exclamation" />
                                <span>{{toast.content}}</span>
                            </div>
                        </div>
                        <div v-else-if="toast.type == 'error'" class="alert shadow-lg alert-error">
                            <div>
                                <font-awesome-icon size="xl" icon="fa-solid fa-triangle-exclamation" />
                                <span>{{toast.content}}</span>
                            </div>
                        </div>
                        <div v-else class="alert shadow-lg bg-slate-200 dark:bg-slate-800">
                            <span>{{toast.content}}</span>
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