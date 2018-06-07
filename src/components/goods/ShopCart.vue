<template>
  <div class="shop-cart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount > 0}">
            <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
          </div>
          <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight': totalCount > 0}">&yen; {{totalPrice}}</div>
        <div class="desc">另需配送费 &yen; {{deliveryPrice}}元</div>
      </div>
      <div class="content-right" :class="payClass" @click.stop="pay">{{payDesc}}</div>
    </div>
    <transition name="fold">
      <div v-show="listShow" class="shopcart-list">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li v-for="(food, index) in selectFoods" :key="index" class="food">
              <span class="name">{{food.name}}</span>
              <span class="price">&yen; {{food.price * food.count}}</span>
              <div class="cart-control-wrapper">
                <CartControl :food="food"></CartControl>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import CartControl from './CartControl'
import BScroll from 'better-scroll'

export default {
  components: {
    CartControl
  },
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [{price: 0, count: 0}]
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      fold: true
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.selectFoods.forEach(food => {
        total += food.price * food.count
      })
      return total
    },
    totalCount() {
      let count = 0
      this.selectFoods.forEach(food => {
        count += food.count
      })
      return count
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`// 这里不是单引号，是点号，键盘左上角那个
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    listShow() {
      if (!this.totalCount) {
        return false
      }
      let show = !this.fold
      return show
    }
  },
  methods: {
    pay() {
      if (this.totalPrice < this.minPrice) {
        return
      }
      alert(`支付${this.totalPrice}元`)
    },
    empty() {
      this.selectFoods.forEach(food => {
        food.count = 0
        this.fold = true
      })
    },
    toggleList() {
      if (this.totalCount > 0) {
        this.fold = !this.fold
        if (!this.fold) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {click: true})
            } else {
              this.scroll.refresh()
            }
          })
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../../assets/scss/mixin';
.shop-cart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 48px;
  .content {
    display: flex;
    color: rgba(255, 255, 255, 0.4);
    .content-left {
      flex: 1;
      font-size: 0;
      background: #141d27;
      .logo-wrapper {
        display: inline-block;
        position: relative;
        top: -10px;
        vertical-align: top;
        margin: 0 12px;
        padding: 6px;
        border-radius: 50%;
        box-sizing: border-box;
        width: 56px;
        height: 56px;
        background: #141d27;
        .logo {
          border-radius: 50%;
          width: 100%;
          height: 100%;
          text-align: center;
          background: #2b343c;
          &.highlight {
            background: rgb(0, 160, 220);
          }
          .icon-shopping_cart {
            font-size: 24px;
            color: #80858a;
            line-height: 44px;
            &.highlight {
              color: #fff;
            }
          }
        }
        .num {
          position: absolute;
          top: 0;
          right: 0;
          border-radius: 16px;
          width: 24px;
          height: 16px;
          line-height: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          text-align: center;
          background: rgb(240, 20, 20);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }
      .price {
        display: inline-block;
        margin: 12px 0;
        padding-right: 12px;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
        &.highlight {
          color: #fff;
        }
      }
      .desc {
        display: inline-block;
        margin: 12px 0 0 12px;
        vertical-align: top;
        font-size: 10px;
        line-height: 24px;
      }
    }
    .content-right {
      flex: 0 0 105px;
      height: 48px;
      line-height: 48px;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      &.not-enough {
        background: #2b333b;
      }
      &.enough {
        color: #fff;
        background: #00b43c;
      }
    }
  }
  .shopcart-list {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    transform: translate(0, -100%);
    &.fold-enter-active, &.fold-leave-active {
      transition: all 0.5s;
    }
    &.fold-enter, &.fold-leave-to {
      transform: translate(0, 0);
    }
    .list-header {
      height: 40px;
      line-height: 40px;
      background: #f3f5f7;
      padding: 0 18px;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }
    .list-content {
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden;
      background: #fff;
      .food {
        position: relative;
        padding: 12px 0;
        @include border-1px(rgba(7, 17, 27, 0.1));
        .name {
          line-height: 24px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .price {
          position: absolute;
          right: 90px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(240, 20, 20);
        }
        .cart-control-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }
}
</style>
