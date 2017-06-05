const iconMixin = {
  props: {
    icon: String
  },
  computed: {
    iconClass: function () {
      return [
        this.icon,
        { 'fa': this.icon && this.icon.startsWith('fa-') }
      ]
    }
  }
}

const iconLeftRightMixin = {
  props: {
    iconLeft: String,
    iconRight: String
  },
  computed: {
    iconLeftClass: function () {
      return [
        this.iconLeft,
        { 'fa': this.iconLeft && this.iconLeft.startsWith('fa-') }
      ]
    },
    iconRightClass: function () {
      return [
        this.iconRight,
        { 'fa': this.iconRight && this.iconRight.startsWith('fa-') }
      ]
    }
  }
}

export default iconMixin
export { iconLeftRightMixin }
