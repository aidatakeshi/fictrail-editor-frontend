<script>
import common from '../mixins/common.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import TopNav from '../components/home_page/TopNav';
import Modal from '../components/general/Modal';

export default {
    name: 'PageMain',
    mixins: [common],
    components: { FontAwesomeIcon, TopNav, Modal },

    data: () => ({
        test: true,
    }),
}

</script>

<template>
    <div :class="getColorMode()">
        <div class="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100">

            <TopNav />

            <!-- Main Body -->
            <div class="max-w-4xl mx-auto p-2">
                
                {{$store.state.bearer_token}}
                <hr/>
                {{$store.state.myself}}

            </div>
        </div>
    </div>
</template>