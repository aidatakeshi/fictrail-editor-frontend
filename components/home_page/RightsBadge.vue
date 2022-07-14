<script>
import common from '../../mixins/common.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
    faUserTie, faUser, faPen, faBinoculars,
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faUserTie, faUser, faPen, faBinoculars,
);

export default {
    name: 'RightsBadge',
    mixins: [common],
    components: { FontAwesomeIcon },

    props:{
        rights: String,
    },

    data: () => ({
    }),

    computed: {
        bg_class(){
            if (this.rights == 'root') return 'bg-purple-800';
            if (this.rights == 'owner') return 'bg-red-800';
            if (this.rights == 'editor') return 'bg-green-800';
            return 'bg-yellow-800';
        },
        icon(){
            if (this.rights == 'root') return 'fa-user-tie';
            if (this.rights == 'owner') return 'fa-user';
            if (this.rights == 'editor') return 'fa-pen';
            return 'fa-binoculars';
        },
        right_type(){
            if (this.rights == 'root') return 'root';
            if (this.rights == 'owner') return 'owner';
            if (this.rights == 'editor') return 'editor';
            return 'viewer';
        }
    },
}
</script>

<template>
    <div class="badge text-white whitespace-nowrap badge-sm md:badge-md"
    :class="bg_class">
        <font-awesome-icon :icon="`fa-solid ${icon}`" />
        {{s$(`project_list/my_rights/${right_type}`)}}
    </div>
</template>