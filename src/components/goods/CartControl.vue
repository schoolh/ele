<template>
  <div class="cart-control">
    <transition name="move">
      <div v-show="food.count > 0" class="cart-decrease" @click.stop="decreaseCart">
        <!-- 这里加一个inner是为了添加rotate动效，因为使用vue的进入/离开过渡时，
        同时过渡translate和rotate，只会生效一个，所以这里只使用vue的transition来过渡translate效果，
        inner的rotate效果相当于是使用css3的transition。 -->
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div v-show="food.count > 0" class="cart-count">{{food.count}}</div>
    <div class="cart-increase icon-add_circle" @click.stop="increaseCart"></div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    increaseCart(event) {
      // 下面这个是判断是原生的点击事件还是better scroll的点击事件，
      // 原生的不带有_constructed，Bscroll有, 有时候Bscroll阻止原生事件失败，
      // 所以点击一次可能会产生两次点击事件.
      // if (!event._constructed) {
      //   return
      // }
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      this.$emit('add', event.target)
    },
    decreaseCart() {
      this.food.count--
    }
  }
}
</script>

<style lang='scss' scoped>
.cart-control {
  font-size: 0;
  .cart-decrease {
    display: inline-block;
    padding: 6px;
    .inner {
      display: inline-block; //这样设置后对应的span元素宽高就是24*24，如果不设置，就会是24*25，受到::before的影响
      font-size: 24px;
      color: rgb(0, 160, 220);
      line-height: 24px;
      transition: all 0.4s linear;
      transform: rotate(0);
      /* 这里加一个inner是为了添加rotate动效，因为使用vue的进入/离开过渡时，
      同时过渡translate和rotate，只会生效一个，所以这里只使用vue的transition来过渡translate效果，
      inner的rotate效果相当于是使用css3的transition。 */
    }
    &.move-enter-active, &.move-leave-active {
      transition: all 0.4s linear;
    }
    &.move-enter, &.move-leave-to {
      opacity: 0;
      transform: translate(24px);
      .inner {
        transform: rotate(180deg);
      }
    }
  }
  .cart-count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    line-height: 24px;
    padding: 6px 0;
    font-size: 10px;
    color: rgb(147, 153, 159);
    text-align: center;
  }
  .cart-increase {
    display: inline-block;
    padding: 6px;
    font-size: 24px;
    line-height: 24px;
    color: rgb(0, 160, 220);
  }
}
</style>
