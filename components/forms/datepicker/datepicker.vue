<template lang='pug'>
  .container
    vulma-input(v-if='!opened', v-model='formattedSelectedDateInput', :label='label', placeholder='Select a date', read-only, icon-right='fa-calendar', @focus='open')
    .box.is-paddingless(v-else)
      button.delete(v-if='showCloseButton', @click='close')
      .header.has-text-centered(:class='bgColorClass')
        span(v-if='label') {{label}}
        .current-date {{formattedSelectedDate}}
      .yearList(ref='yearList', key='yearList', v-if='selectingYear')
        .has-text-centered
          ul
            li(ref='years', v-for='year in years', :class='yearListClass(year)', @click='selectYear(year)') {{year}}
      .monthList(key='monthList', v-else-if='selectingMonth')
        .columns.is-multiline.is-mobile
          .column.is-one-third.has-text-centered(v-for='month in months', :class='monthListClass(month.index)', @click='selectMonth(month.index)')
            | {{month.text}}
      .calendar(v-else, key='calendar')
        .year.has-text-centered(@click='showYears', key='year')
          | {{year}}
        .month.level.is-marginless.is-mobile
          .level-left
            .icon(@click='goPrevMonth', v-show='canShowPrevMonth')
              i.fa.fa-caret-left
          .level-item.has-text-centered(@click='showMonths')
            | {{month.text}}
          .level-right
            .icon(@click='goNextMonth', v-show='canShowNextMonth')
              i.fa.fa-caret-right
        transition(mode='out-in', :duration='{ enter: 600, leave: 400 }', leave-active-class='animated zoomOut', enter-active-class='animated zoomIn')
          .columns.is-multiline.is-mobile(:key='month.index')
            .column.weekLabel(v-for='week in weekdays', :class='weekLabelClass(week)') {{week.label}}
            .column(v-for='i in gap')
            .column.day(v-for='day in days', :class='dayClass(day)', @click='selectDate(day.date)') {{day.day}}
        .has-text-centered(v-if='isTodayEnabled')
          a.button.is-small.is-link(@click='goToday') {{translate.today}}
</template>

<style lang='sass' scoped>
  @import '~bulma'

  .box
    width: 280px
    position: relative
    .delete
      position: absolute
      top: 5px
      right: 5px
    .header
      padding: 10px
      .field-label
      .current-date
        font-weight: $weight-bold
        font-size: $size-3
    .yearList
      height: 300px
      overflow: auto
      li
        list-style-type: none
        cursor: pointer
        &:hover
          font-size: $size-4
        &.selected
          font-weight: $weight-bold
          font-size: $size-4
          color: $primary
    .monthList
      margin-top: 10px
      .column
        cursor: pointer
        &:hover
          font-weight: $weight-bold
        &.selected
          font-weight: $weight-bold
          font-size: $size-5
          color: $primary
    .calendar
      .year
        padding: 5px
        font-weight: $weight-bold
        font-size: $size-4
        cursor: pointer
        &:hover
          color: $primary
      .month
        font-weight: $weight-bold
        cursor: pointer
        .icon
          margin: 0 10px
          &:hover
            color: $primary
          i:hover
            zoom: 1.4
        .level-left, .level-right
          width: 44px
        .level-item:hover
          color: $primary
      .columns
        margin: 14px
        .column
          flex: none
          height: 36px
          width: 36px
          padding: 0
          display: flex
          align-items: center
          justify-content: center
        .weekLabel
          opacity: .4
          &.weekend
            color: $red
        .day
          cursor: pointer
          &:hover:not(.disabled)
            border-radius: 50%
            background-color: $grey-light !important
            color: $white !important
          &.selected
            border-radius: 50%
          &.today
            font-weight: 900 !important
            font-size: $size-5
          &.weekend:not(.disabled)
            color: $red
            background-color: $white-ter
            font-weight: $weight-semibold
          &.disabled
            cursor: not-allowed
            color: $grey-lighter
</style>

<script>
import { colorDefaultPrimaryMixin } from '../../../mixins/color'
import modelMixin from '../../../mixins/model'
import { today, compareDates, addYears, addMonths, addDays, firstDayOfMonth, lastDayOfMonth } from '../../../utils/datetime'

export default {
  name: 'vulma-datepicker',
  mixins: [colorDefaultPrimaryMixin, modelMixin],
  props: {
    value: {
      type: Date,
      default: today
    },
    label: String,
    locale: {
      type: String,
      default: function () {
        return navigator.language
      }
    },
    firstDayOfWeek: {
      type: Number,
      default: 0,
      validation: function (value) {
        return value < 7
      }
    },
    highlightWeekend: {
      type: [Boolean, String],
      default: true
    },
    min: {
      type: Date,
      default: function () {
        return addYears(today(), -50)
      }
    },
    max: {
      type: Date,
      default: function () {
        return addYears(today(), 50)
      }
    },
    autoSelectToday: {
      type: [Boolean, String],
      default: true
    },
    showCloseButton: {
      type: [Boolean, String],
      default: true
    },
    i18n: Object
  },
  data() {
    return {
      selectingYear: false,
      selectingMonth: false,
      opened: false,
      years: [],
      year: 0,
      months: [],
      month: {
        index: 0,
        text: ''
      },
      weekdays: [],
      days: [],
      gap: 0
    }
  },
  beforeMount() {
    this.initialize()
  },
  computed: {
    formattedSelectedDate: function () {
      return this.model.toLocaleDateString(this.locale, {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      })
    },
    formattedSelectedDateInput: function () {
      return this.model.toLocaleDateString(this.locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },
    canShowPrevMonth: function () {
      let date = addMonths(firstDayOfMonth(this.month.index, this.year), -1)
      return this.canShowMonth(date.getMonth(), date.getFullYear())
    },
    canShowNextMonth: function () {
      let date = addMonths(firstDayOfMonth(this.month.index, this.year), 1)
      return this.canShowMonth(date.getMonth(), date.getFullYear())
    },
    isTodayEnabled: function () {
      let isShowingToday = this.month.index === today().getMonth() && this.year === today().getFullYear()
      return this.isBetweenMinMax(today()) && (this.autoSelectToday || !isShowingToday)
    },
    translate: function () {
      return Object.assign({
        today: 'Today'
      }, this.i18n)
    }
  },
  watch: {
    opened: function (value) {
      if (value)
        this.initialize()
    },
    locale: function () {
      this.setCalendar()
    },
    min: function () {
      this.setYears()
    },
    max: function () {
      this.setYears()
    }
  },
  methods: {
    initialize: function () {
      this.setYears()
      this.setCalendar(this.model)
    },
    open: function () {
      this.opened = true
    },
    close: function () {
      this.opened = false
    },
    showYears: function () {
      if (this.years.length <= 1)
        return
      this.selectingYear = true
      this.$nextTick(function () {
        let selectedYear = this.$refs.years.find(year => year.className === 'selected')
        this.$refs.yearList.scrollTop = selectedYear.offsetTop - 190
      })
    },
    hideYears: function () {
      this.selectingYear = false
    },
    showMonths: function () {
      this.setMonths()
      if (this.months.length <= 1)
        return
      this.selectingMonth = true
    },
    hideMonths: function () {
      this.selectingMonth = false
    },
    setCalendar: function (targetDate) {
      if (targetDate) {
        let month = targetDate.getMonth()
        let year = targetDate.getFullYear()
        if (!this.canShowMonth(month, year)) {
          targetDate = this.max.getFullYear() === year ? this.max : this.min
          month = targetDate.getMonth()
          year = targetDate.getFullYear()
        }
        this.month.index = month
        this.year = year
      }
      this.weekdays = []
      for (let i = 0; i < 7; i++) {
        let weekday = i + this.firstDayOfWeek
        if (weekday > 6)
          weekday -= 7
        this.weekdays.push({ weekday })
      }
      this.days = []
      let date = firstDayOfMonth(this.month.index, this.year)
      this.month.text = date.toLocaleDateString(this.locale, { month: 'long' })
      while (date.getMonth() === this.month.index) {
        let day = date.getDate()
        let weekday = date.getDay()
        if (day <= 7) {
          let index = weekday - this.firstDayOfWeek
          if (index < 0)
            index += 7
          if (day === 1)
            this.gap = index
          this.weekdays[index].label = date.toLocaleDateString(this.locale, { weekday: 'narrow' })
        }
        this.days.push({ date: new Date(date), day, weekday })
        addDays(date, 1)
      }
    },
    setYears: function () {
      this.years = []
      for (let year = this.min.getFullYear(); year <= this.max.getFullYear(); year++) {
        this.years.push(year)
      }
    },
    setMonths: function () {
      this.months = []
      for (let i = 0; i < 12; i++) {
        if (this.canShowMonth(i, this.year))
          this.months.push({
            index: i,
            text: firstDayOfMonth(i, this.year).toLocaleDateString(this.locale, { month: 'short' })
          })
      }
    },
    selectYear: function (year) {
      this.hideYears()
      let date = firstDayOfMonth(this.month.index, year)
      this.setCalendar(date)
    },
    selectMonth: function (month) {
      this.hideMonths()
      let date = firstDayOfMonth(month, this.year)
      this.setCalendar(date)
    },
    selectDate: function (date) {
      date.setHours(0, 0, 0, 0)
      if (!this.isBetweenMinMax(date))
        return
      this.model = date
      this.close()
    },
    goNextMonth: function () {
      let date = addMonths(firstDayOfMonth(this.month.index, this.year), 1)
      this.setCalendar(date)
    },
    goPrevMonth: function () {
      let date = addMonths(firstDayOfMonth(this.month.index, this.year), -1)
      this.setCalendar(date)
    },
    goToday: function () {
      if (this.autoSelectToday)
        this.selectDate(today())
      else
        this.setCalendar(today())
    },
    isBetweenMinMax: function (date) {
      return date >= this.min && date <= this.max
    },
    canShowMonth: function (month, year) {
      let min = Math.min(lastDayOfMonth(month, year), this.max)
      let max = Math.max(firstDayOfMonth(month, year), this.min)
      return min - max >= 0
    },
    dayClass: function (day) {
      let isSelected = compareDates(day.date, this.model)
      return [
        isSelected ? this.bgColorClass : '',
        {
          'today': compareDates(day.date, today()),
          'weekend': this.highlightWeekend && (day.weekday === 0 || day.weekday === 6),
          'selected': isSelected,
          'disabled': !this.isBetweenMinMax(day.date)
        }
      ]
    },
    weekLabelClass: function (week) {
      return {
        'weekend': this.highlightWeekend && (week.weekday === 0 || week.weekday === 6)
      }
    },
    yearListClass: function (year) {
      return {
        'selected': year === this.year
      }
    },
    monthListClass: function (month) {
      return {
        'selected': month === this.month.index
      }
    }
  }
}
</script>
