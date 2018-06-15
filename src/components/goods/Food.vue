<template>
  <transition name="slide">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide()">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">&yen;{{food.price}}</span>
            <span v-if="food.oldPrice" class="old">&yen;{{food.oldPrice}}</span>
          </div>
          <div class="cart-control-wrapper">
            <CartControl :food="food" @add="addFood"></CartControl>
          </div>
          <transition name="fade">
            <div v-show="!food.count || food.count === 0" class="buy" @click.stop="addFirst">
              加入购物车
            </div>
          </transition>
        </div>
        <div v-if="food.info" class="info-wrapper">
          <div class="info">
            <h1 class="title">商品信息</h1>
            <p class="text">
              {{food.info}}
            </p>
          </div>
        </div>
        <div class="rating-wrapper">
          <div class="header">
            <h1 class="title">商品评价</h1>
            <RatingSelect :ratings="food.ratings" :desc="desc" :selectType="selectType" :onlyContent="onlyContent"
            @select="selectRating" @toggle="toggleContent"></RatingSelect>
          </div>
          <ul class="ratings">
            <li  v-show="needShow(rating.text, rating.rateType)" v-for="(rating, index) in food.ratings" class="rating-item border-1px" :key="index">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img class="avatar" :src="rating.avatar">
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
              <p class="text">
                <i :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></i>{{rating.text}}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
import CartControl from './CartControl'
import RatingSelect from './RatingSelect'
import {formatDate} from '../common/date'

const ALL = 2

export default {
  components: {
    CartControl,
    RatingSelect
  },
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      },
      selectType: ALL,
      onlyContent: true
    }
  },
  methods: {
    show() {
      this.showFlag = true
      this.selectType = ALL
      this.onlyContent = true
      // 使用better-scroll需要给要滑动的元素添加一个容器，
      // 因为BScroll只对容器元素的第一个子元素生效
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {click: true})
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide() {
      this.showFlag = false
    },
    addFirst(event) {
      this.$emit('add', event.target)
      Vue.set(this.food, 'count', 1)
      // 这里要给《加入购物车》这个元素一个离开过渡，如果没有过渡，那么点击后，
      // 触发add事件，出现小球drop的效果，但是会有问题，小球是从左上角掉落，
      // 原因是点击事件后，马上把this.food的count设为1，那么这个“加入购物车”元素
      // 就会马上消失，消失了的话，实现小球drop效果的代码中el.getBoundingClientRect()
      // 就出错，因为找不到这个元素的位置了，（所以默认位置就变为0 0 ？）
      // 或者也可以用setTimeout来延迟让“加入购物车”这个元素display:none， 就可以获取到位置
      // setTimeout(this.set, 20)
    },
    // set() {
    //   Vue.set(this.food, 'count', 1)
    // },
    addFood(target) {
      this.$emit('add', target)
    },
    selectRating(type) {
      this.selectType = type
    },
    toggleContent() {
      this.onlyContent = !this.onlyContent
    },
    // 本来needShow应该是计算属性，放在computed里，但是计算属性不能传参数，所以要用methods
    needShow(text, type) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>

<style lang='scss' scoped>
@import "../../assets/scss/mixin";

.food {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 48px;
  z-index: 30;
  width: 100%;
  background: #fff;
  transform: translateX(0);
  &.slide-enter-active, &.slide-leave-active{
    transition: all 0.2s linear;
  }
  &.slide-enter, &.slide-leave-to{
    transform: translateX(100%);
  }
  .image-header {
    img {
      width: 100vw;
      height: 100vw;
    }
    .back {
      position: absolute;
      top: 10px;
      left: 0;
      padding: 10px;
      .icon-arrow_lift {
        font-size: 20px;
        color: #fff;
      }
    }
  }
  .content {
    position: relative;
    padding: 18px;
    .title {
      margin-bottom: 8px;
      line-height: 14px;
      font-size: 14px;
      font-weight: 700;
      color: rgb(7, 17, 27);
    }
    .detail {
      margin-bottom: 18px;
      height: 10px;
      line-height: 10px;
      font-size: 0;
      color: rgb(147, 153, 159);
      .sell-count {
        font-size: 10px;
        margin-right: 12px;
      }
      .rating {
        font-size: 10px;
      }
    }
    .price {
      font-weight: 700;
      line-height: 24px;
      .now {
        margin-right: 8px;
        font-size: 14px;
        color: rgb(240, 20, 20);
      }
      .old {
        font-size: 10px;
        color: rgb(147, 153, 159);
        text-decoration: line-through;
      }
    }
    .cart-control-wrapper {
      position: absolute;
      right: 12px;
      bottom: 12px;
    }
    .buy {
      position: absolute;
      right: 18px;
      bottom: 18px;
      box-sizing: border-box;
      height: 24px;
      line-height: 24px;
      padding: 0 12px;
      border-radius: 12px;
      font-size: 10px;
      color: #fff;
      background: rgb(0, 160, 220);
      // opacity: 1;
      // &.fade-enter-active, &fade-leave-active {
      //   transition: all 0.2s;
      // }
      // &.fade-enter, &fade-leave-to {
      //   opacity: 0;
      // }
    }
  }
  .info-wrapper {
    padding-top: 16px;
    border-top: 1px solid rgba(7, 17, 27, 0.1);
    background: #f3f5f7;
    .info {
      border-top: 1px solid rgba(7, 17, 27, 0.1);
      padding: 18px;
      background: #fff;
      .title {
        margin-bottom: 6px;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .text {
        padding: 0 8px;
        line-height: 24px;
        font-size: 12px;
        color: rgb(77, 85, 93);
      }
    }
  }
  .rating-wrapper {
    padding-top: 16px;
    border-top: 1px solid rgba(7, 17, 27, 0.1);
    background: #f3f5f7;
    .header {
      padding: 18px 18px 0;
      border-top: 1px solid rgba(7, 17, 27, 0.1);
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      background: #fff;
      .title {
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
    }
    .ratings {
      padding: 0 18px;
      background: #fff;
      .rating-item {
        position: relative;
        padding: 16px 0;
        @include border-1px(rgba(7, 17, 27, 0.1));
        .user {
          position: absolute;
          top: 16px;
          right: 0;
          line-height: 12px;
          font-size: 0;
          .name {
            margin-right: 6px;
            vertical-align: top;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .avatar {
            border-radius: 50%;
            width: 12px;
            height: 12px;
          }
        }
        .time {
          margin-bottom: 6px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
        .text {
          line-height: 16px;
          font-size: 12px;
          color: rgb(7, 17, 27);
          .icon-thumb_up, .icon-thumb_down {
            margin-right: 4px;
            line-height: 16px;
            font-size: 12px;
          }
          .icon-thumb_up {
            color: rgb(0, 160, 220);
          }
          .icon-thumb_down {
            color: rgb(147, 153, 159);
          }
        }
      }
    }
  }
}
</style>
