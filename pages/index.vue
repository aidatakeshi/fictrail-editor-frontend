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
                
                <button class="btn" @click="$refs.test_modal.show()">Show</button>
                <Modal ref="test_modal" title="Test 114514" wide close-at-bg>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                    <div>24-years old student</div>
                </Modal>

            </div>
        </div>
    </div>
</template>