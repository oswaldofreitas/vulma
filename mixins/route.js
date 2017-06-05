export default {
  props: {
    route: [String, Object],
    href: String,
    openNewTab: [Boolean, String]
  },
  computed: {
    isRouteActive: function () {
      return this.$route && this.$route.path === this.route
    },
    routeClass: function () {
      return { 'is-active': this.isRouteActive }
    }
  },
  methods: {
    redirect: function () {
      if (this.route && !this.openNewTab)
        this.$router.push(this.route)
      else {
        let href = this.href || (this.route ? this.$router.resolve(this.route).href : null)
        if (href)
          window.open(href, this.openNewTab ? '_blank' : null)
      }
    }
  }
}
