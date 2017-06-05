<template lang='pug'>
  div
    .tabs(v-if='tabs.length > 1 || !hideOneTab')
      ul.is-marginless
        li.is-marginless(v-for='(tab, index) in tabs',
          :key='tab.title',
          :class="{'is-active': index === selected}",
          @click='selectTab(index)')
          a {{tab.title}}
    slot
</template>

<script>
export default {
  name: 'vulma-tabs',
  props: {
    hideOneTab: [Boolean, String]
  },
  data() {
    return {
      selected: 0,
      tabs: []
    }
  },
  mounted() {
    this.$children.forEach(child => {
      this.tabs.push(child)
    })
    if (this.tabs.length)
      this.tabs[0].active = true
  },
  methods: {
    selectTab: function (index) {
      this.tabs[this.selected].active = false
      this.tabs[index].active = true
      this.selected = index
      this.$emit('tab-selected', index)
    }
  }
}
</script>
