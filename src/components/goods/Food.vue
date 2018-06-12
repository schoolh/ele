<template>
  <transition>
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
            <CartControl :food="food"></CartControl>
          </div>
          <div v-show="!food.count || food.count === 0" class="buy">
            加入购物车
          </div>
        </div>
        <div v-if="food.info" class="info-wrapper">
          <div class="info">
            <h1 class="title">商品信息</h1>
            <p class="text">
              {{food.info}}
            </p>
          </div>
        </div>
        <div class="ratings">
          <div class="header">
            <h1 class="title">商品评价</h1>
            <RatingSelect :ratings="food.ratings" :desc="desc" :selectType="selectType" :onlyContent="onlyContent"
            @select="selectRating" @toggle="toggleContent"></RatingSelect>
          </div>
          <div>
            <ul>
              <li v-for="(rating, index) in food.ratings" :key="index">
                <div class="user">
                  <span>{{rating.username}}</span>
                  <img :src="rating.avatar">
                </div>
                <div class="time"></div>
                <p class="text">
                  <i :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></i>
                  {{rating.text}}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from 'better-scroll'
import CartControl from './CartControl'
import RatingSelect from './RatingSelect'

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
    selectRating(type) {
      this.selectType = type
    },
    toggleContent() {
      this.onlyContent = !this.onlyContent
    }
  }
}
</script>

<style lang='scss' scoped>
.food {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 48px;
  z-index: 30;
  width: 100%;
  background: #fff;
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
  .ratings {
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
  }
}
</style>
