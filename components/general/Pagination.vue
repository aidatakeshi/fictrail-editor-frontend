<script>
/**
 * Emits: page(page_no)
 */
import common from '../../mixins/common.js';

export default {
    name: 'Pagination',
    mixins: [common],
    components: {  },

    props: {
        forceShow: Boolean,
        page: Number,
        pages: Number,
    },

    data: () => ({
    }),

    methods: {
        goPagePrompt(){
            let page = prompt(this.s$('general/pagination/goto'));
            page = parseInt(page);
            if (!page) return false;
            if (page < 1) page = 1;
            if (page > this.pages) page = this.pages;
            this.goPage(page);
        },
        goPage(page){
            this.$emit('page', page);
        },
    },

    computed: {
    },

    watch: {
    }
}
</script>

<template>
    <div v-if="pages > 1 || forceShow">
        <div class="btn-group">
            <button class="btn btn-sm" v-if="page > 1"
            @click="goPage(1)">
                1
            </button>
            <button class="btn btn-sm" v-if="page > 2"
            @click="goPage(page - 1)">
                <template v-if="page == 3">2</template>
                <template v-else>«</template>
            </button>
            <!------------------------------------------------------>
            <button class="btn btn-sm" v-if="page + 2 > pages && pages >= 3"
            @click="goPage(pages - 2)">
                {{pages - 2}}
            </button>
            <button class="btn btn-sm" v-if="page + 1 > pages && pages >= 2"
            @click="goPage(pages - 1)">
                {{pages - 1}}
            </button>
            <!------------------------------------------------------>
            <button class="btn btn-sm btn-active" @click="goPagePrompt">
                {{page}}
            </button>
            <!------------------------------------------------------>
            <button class="btn btn-sm" v-if="page < 2 && pages >= 2"
            @click="goPage(2)">
                2
            </button>
            <button class="btn btn-sm" v-if="page < 3 && pages >= 3"
            @click="goPage(3)">
                3
            </button>
            <!------------------------------------------------------>
            <button class="btn btn-sm" v-if="page + 1 < pages"
            @click="goPage(page + 1)">
                <template v-if="page == pages - 2">{{pages - 1}}</template>
                <template v-else>»</template>
            </button>
            <button class="btn btn-sm" v-if="page < pages"
            @click="goPage(pages)">
                {{pages}}
            </button>
        </div>
    </div>
</template>