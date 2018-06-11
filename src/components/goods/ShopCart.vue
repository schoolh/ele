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
        <!-- 使用better-scroll需要给要滑动的元素添加一个容器，因为BScroll只对容器元素的第一个子元素生效 -->
          <ul>
            <li v-for="(food, index) in selectFoods" :key="index" class="food">
              <span class="name">{{food.name}}</span>
              <span class="price">&yen; {{food.price * food.count}}</span>
              <div class="cart-control-wrapper">
                <CartControl :food="food" @add="addFood"></CartControl>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-show="listShow" class="list-mask" @click="hideList"></div>
    </transition>
    <div class="ball-container">
      <div v-for="(ball, index) in balls" :key="index">
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <div v-show="ball.show" class="ball">
            <div class="inner"></div>
          </div>
        </transition>
      </div>
    </div>
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
      fold: true,
      balls: [
        // 以下设置五个就差不多够用了，如果只设置一个，如果点击+键很快的话，
        // 在.ball的css中的transition中设置的时间内连续点击的话，会只有一个小球的效果。
        // 另外，就算设置五个，如果transition中的过渡时间设置比较长，如10s，
        // 那么在10s内如果点击+键超过五次，也不会再有小球出现。
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: []
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
    },
    hideList() {
      this.fold = true
    },
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el // ？？？？这里不需要用Vue.set来设置吗？
          this.dropBalls.push(ball)
          return
        }
      }
    },
    addFood(target) {
      this.drop(target)
    },
    beforeDrop(el) {
      let count = this.dropBalls.length
      let ball = this.dropBalls[count - 1]
      let rect = ball.el.getBoundingClientRect()
      let x = rect.left - 32
      let y = -(window.innerHeight - rect.top - 22)
      el.style.display = ''
      el.style.transform = `translate(0,${y}px)`
      let inner = el.getElementsByClassName('inner')[0]
      inner.style.transform = `translate(${x}px, 0)`
    },
    dropping(el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight// 这是一个手动触发浏览器重绘的方法，没有这一步就动画就不会出现，
      // 我认为应该是由于before-enter和enter两个状态之间时间间隔特别短，在before-enter的
      // 钩子函数中将小球位置平移，然后在enter的钩子函数中取消平移，但是由于时间非常短，
      // 浏览器还未来得及重绘，小球的平移就被取消了，所以直接出现小球没有过渡动画。
      this.$nextTick(() => {
        // 使用nextTick，让上面重绘之后再进行下面的操作
        el.style.transform = 'translate(0, 0)'
        let inner = el.getElementsByClassName('inner')[0]
        inner.style.transform = `translate(0, 0)`
        el.addEventListener('transitionend', done)
        // transitionend是是一个原生DOM事件，vue过渡的enter、leave钩子函数都需要回调函数done()
      })
    },
    afterDrop(el) {
      let ball = this.dropBalls.shift()
      ball.show = false
      el.style.display = 'none' // 因为设置了transition过渡，所以当上一步ball.show=false时，小球不会马上消失，
      // 会等transition中设置的过渡时间之后消失，所以手动让小球display:none
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
    position: relative;
    z-index: inherit;
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
    z-index: 40;
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
  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 30;
    background: rgba(7, 17, 27, 0.6);
    opacity: 1;
    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.5s;
    }
    &.fade-enter, &.fade-leave-to {
      opacity: 0;
      background: rgba(7, 17, 27, 0);
    }
  }
  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: rgb(0, 160, 220);
        transition: all 0.4s linear
      }
    }
  }
}
</style>
