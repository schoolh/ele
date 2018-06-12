<template>
  <div class="rating-select">
    <div class="rating-type border-1px">
      <span class="block positive" :class="{'active': selectType === 2}" @click="select(2, $event)">{{desc.all}}<span
      class="count">{{ratings.length}}</span></span>
      <span class="block positive" :class="{'active': selectType === 0}" @click="select(0, $event)">{{desc.positive}}<span
      class="count">{{positives.length}}</span></span>
      <span class="block negative" :class="{'active': selectType === 1}" @click="select(1, $event)">{{desc.negative}}<span
      class="count">{{negatives.length}}</span></span>
    </div>
    <div class="switch" @click="toggleContent">
      <i class="icon-check_circle" :class="{'on': onlyContent}"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

export default {
  props: {
    ratings: {
      type: Array,
      default() {
        return []
      }
    },
    desc: {
      type: Object,
      default() {
        // 对象或数组一定要用一个工厂函数返回默认值
        return {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    positives() {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE
      })
    },
    negatives() {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
    }
  },
  methods: {
    select(type, event) {
      this.$emit('select', type)
    },
    toggleContent() {
      this.$emit('toggle')
    }
  }
}
</script>

<style lang='scss' scoped>
@import "../../assets/scss/mixin";

.rating-select {
  .rating-type {
    padding: 18px 0;
    font-size: 0;
    @include border-1px(rgba(7, 17, 27, 0.1));
    .block {
      display: inline-block;
      margin-right: 8px;
      padding: 8px 12px;
      border-radius: 1px;
      line-height: 16px;
      font-size: 12px;
      color: #4d555d;
      &.positive {
        background: rgba(0,160,220,0.2);
        &.active {
          background: #00a0dc;
          color: #fff;
        }
      }
      &.negative {
        background: rgba(77,85,93,0.2);
        &.active {
          background: #4d555d;
          color: #fff;
        }
      }
      .count {
        margin-left: 2px;
      }
    }
  }
  .switch {
    padding: 12px 0;
    height: 24px;
    line-height: 24px;
    font-size: 0;
    color: #93999f;
    .icon-check_circle {
      font-size: 24px;
      &.on {
        color: #00c850;
      }
    }
    .text {
      margin-left: 4px;
      font-size: 12px;
      vertical-align: top;
    }
  }
}
</style>
