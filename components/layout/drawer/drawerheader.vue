<template lang='pug'>
  .header(:class='bgColorClass')
    .simple(v-if='simple').bgcolor-primary
      .is-fullwidth {{title}}
    .profile(v-else)
      figure.image.is-64x64
        img(:src='avatar')
      .is-fullwidth {{name}}
      .is-fullwidth {{email}}
</template>

<style lang='sass' scoped>
  .header
    .simple
      height: 50px
      padding: 10px 16px
      font-weight: 600
      font-size: 20px
    .profile
      height: 150px
      padding: 16px
      font-weight: 700
      font-size: 14px
      figure
        margin-bottom: 12px
        img
          border-radius: 50%
</style>

<script>
import { colorDefaultPrimaryMixin } from '../../../mixins/color'

export default {
  name: 'vulma-drawerheader',
  mixins: [colorDefaultPrimaryMixin],
  props: {
    simple: [Boolean, String],
    title: String,
    avatar: String,
    name: String,
    email: String
  }
}
</script>
