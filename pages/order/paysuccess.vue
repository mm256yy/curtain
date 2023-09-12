<template>
	<view class="content">
		<view class="paysuccess">
			<view class="paysuccess-left">
				<u-icon name="checkmark-circle-fill" color="#ff5d32" size="50"></u-icon>
				<text>恭喜您,支付成功啦!</text>
			</view>
			<view class="pay-money">
				支付金额:<text class="pay-text">￥{{paytotalmoney}}元</text>
			</view>
			<view class="payBtn">
				<view class="backIndex index" @click="Tohome()" >返回首页</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import JSONBig from 'json-bigint'
	export default{
		data(){
			return{
				paytotalmoney:'',
				id:''
			}
		},
		onLoad(e) {
			let self=this;
			self.paytotalmoney=e.money;
			// self.id=JSONBig.stringify(JSON.stringify(e.id));
			// console.log(e,'订单成功')
		},
		onShow() {
			
		},
		methods:{
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			Tohome(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="less">
	page{
		background-color: #fff;
	}
	.content{
		width: 100%;
	}
	.paysuccess{
		width: 60%;
		// margin-top: 300rpx;
		margin:200rpx auto;
		.paysuccess-left{
			display: flex;
			align-items: center;
			font-size: 36rpx;
			font-weight: 700;
		}
	}
	.pay-money{
		text-align: center;
		font-size: 30rpx;
		font-weight: 600;
		margin: 80rpx 0;
		.pay-text{
			font-weight: 500;
			color: #ff5d32;
			font-weight: 600;
		}
	}
	.payBtn{
		display: flex;
		justify-content: center;
		align-items: center;
		.backIndex{
			width: 200rpx;
			height:80rpx;
			background-color: #ff5d32;
			text-align: center;
			line-height: 80rpx;
			border-radius: 16rpx;
			color: #fff;
			margin-right: 24rpx;
		}
		.index{
			background-color: #c3c3c3;
		}
	}
</style>