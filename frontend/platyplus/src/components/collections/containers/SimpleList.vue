<template lang="pug">
q-list(v-if="list.length" highlight class="col-12" separator)
    slot(name="before-item")
    template(v-for="item in list")
      slot(name="item" :item="item")
        h-list-item(:element="item" :tableClass="tableClass")
    slot(name="after-item")
div(v-else)
  slot(name="empty")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { CollectionContainerMixin } from 'src/mixins'
import ListItem from '../../elements/containers/ListItem.vue'

@Component({
  components: {
    'h-list-item': ListItem
  }
})
export default class SimpleList extends Mixins(CollectionContainerMixin) {}
</script>
