<script>

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
    faCheck, faXmark
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faCheck, faXmark
);

export default {
    name: 'TickCross',
    components: { FontAwesomeIcon },

    props: {
        value: null,
    },
}
</script>

<template>
    <span>
        <span v-if="value === true" class="text-success">
            <font-awesome-icon size="xl" icon="fa-solid fa-check" />
        </span>
        <span v-else-if="value === false" class="text-error">
            <font-awesome-icon size="xl" icon="fa-solid fa-xmark" />
        </span>
    </span>
</template>