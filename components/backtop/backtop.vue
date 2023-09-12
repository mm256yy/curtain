<template>
	<view class="content">
		<view class="cart" v-if="isShow"  @click="Totop()">
			<u-icon name="arrow-upward" color="#434343" size="28"></u-icon>
		</view>
	</view>
	
</template>

<script>
	export default {
		name: "backtop",
		props:{
			scrollTop:{
				type:Number,
				default:0
			}
		},
		data() {
			return {
				isShow: false
			};
		},
		methods: {
			topData(e){
				this.isShow=e>200
			},
			Totop() {
				uni.pageScrollTo({
					scrollTop: this.scrollTop,
					duration: 300
				});
			}
		}
	}
</script>

<style lang="less">
	.cart {
		width: 70rpx;
		height: 70rpx;
		position: fixed;
		bottom: 300rpx;
		right: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100%;
		border: 3rpx solid #d0d0d0;
		margin-bottom: 20rpx;
		background-color: rgba(255, 255, 255, 0.4);
	}
</style>
