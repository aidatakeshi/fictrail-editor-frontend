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

export default {
    name: 'Alert',
    mixins: [common],
    components: { FontAwesomeIcon },

    props: {
        content: String,
        type: String,
    },

    data: () => ({
    }),

    methods: {
    },

    computed: {
    },

    watch: {
    }
}
</script>

<template>
    <div>
        <div v-if="type == 'info'" class="alert p-1 shadow-lg alert-info">
            <div>
                <font-awesome-icon size="xl" icon="fa-solid fa-circle-info" />
                <span>{{content}}</span>
            </div>
        </div>
        <div v-else-if="type == 'success'" class="alert p-1 shadow-lg alert-success">
            <div>
                <font-awesome-icon size="xl" icon="fa-solid fa-circle-check" />
                <span>{{content}}</span>
            </div>
        </div>
        <div v-else-if="type == 'warning'" class="alert p-1 shadow-lg alert-warning">
            <div>
                <font-awesome-icon size="xl" icon="fa-solid fa-circle-exclamation" />
                <span>{{content}}</span>
            </div>
        </div>
        <div v-else-if="type == 'error'" class="alert p-1 shadow-lg alert-error">
            <div>
                <font-awesome-icon size="xl" icon="fa-solid fa-triangle-exclamation" />
                <span>{{content}}</span>
            </div>
        </div>
        <div v-else class="alert p-1 shadow-lg bg-slate-200 dark:bg-slate-800">
            <span>{{content}}</span>
        </div>
    </div>
</template>