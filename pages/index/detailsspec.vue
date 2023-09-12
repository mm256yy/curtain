<template>
  <view>
		<!-- 循环 -->
    <view class="sku-list" v-for="(item,index) in userChooseSkuList" :key="index">
			kfjdklgjeisg
		</view>
  </view>
</template>

<script>
export default {
  data () {
    return {
    	
      }
			
  },
  onLoad () {
    this.initData()
  },
  methods: {
    // 页面初始化加载方法
    initData () {
		let self=this;
	self.Get('/api/plugs/searchPlugsGoodsSpecificationByGoodsId',{goodsId:120}).then(res => {
		if (res.code == 200) {
			self.SpecList=res.body.plugsGoodsSpecificationList;
			console.log(self.SpecList,'ppppppppppppp')
			}
	})
      // this.getShopInfo()
    },
	
	


		
  }
}
</script>

<style>
		.sku-list{
			margin-bottom: 20rpx;
		}
	.sku-title{
		font-weight: bold;
	}
	.sku-label-list{
		display: flex;
		justify-content: left;
	}
	.label{
		padding: 10rpx 20rpx;
		margin-right: 20rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: #f5f5f5;
		border-radius: 4rpx;
	}
	.label.active{
		background: #2f8eed;
		color: #FFFFFF;
	}
</style>

