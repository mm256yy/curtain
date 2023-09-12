<template>
	<view class="content">
		<view class="refund">
			<view class="orderNo">
				订单编号:{{orderInfo.orderNo}}
			</view>
			<view class="refund-cause">
				<view class="refund-cause-title">退款原因:</view>
				<textarea class="textarea" v-model="orderInfo.applyRemark" placeholder="请输入退款原因"  maxlength="300" ></textarea>
			</view>
		</view>
		<button class="submit-btn" @click="Submitrefund()" >提交</button>
	</view>
</template>
<script>
	export default{
		data(){
			return{
				orderInfo:{
					orderNo:'',
					applyRemark:''
				}
			}
		},
		onLoad(e) {
			let self=this;
			console.log(e.id)
			self.orderInfo.orderNo=e.id;
			// console.log(self.orderInfo.orderNo)
		},
		methods:{
			Submitrefund(){
				let self=this;
				let data=self.orderInfo;
				if(! data.applyRemark){
					uni.showModal({
						title: '提示',
						content: '请输入退款原因',
						showCancel: false
					});
					return
				}else{
					self.Post('/api/order/userApplyOrderRefund',data).then(res=>{
						if(res.code==200){
							uni.showToast({
								title: '提交成功',
								duration: 800
							});
							setTimeout(function() {
								uni.switchTab({
									url:'/pages/order/applysucc'
								})
							}, 500)
						}
					})
				}
				
			}
		}
	}
</script>

<style lang="less">
	.content{
		width: 100%;
		position: relative;
	}
	.refund{
		width: 94%;
		padding: 30rpx 18rpx ;
		box-sizing: border-box;
		background-color: #fff;
		margin:30rpx auto;
		border-radius: 16rpx;
		box-shadow: 0px 0px 8px 0px rgba(207, 207, 207, 0.5);
		.orderNo{
			margin-bottom: 16rpx;
		}
		.refund-cause-title{
			margin-bottom: 20rpx;
		}
		.textarea{
			margin: auto;
			border: 3rpx solid #a7b1ae;
			border-radius: 16rpx;
			padding: 18rpx;
			box-sizing: border-box;
		}
	}
	.submit-btn{
		width: 80%;
		background-color: #e84033;
		color: #fff;
		position: fixed;
		left: 10%;
		bottom: 140rpx;
	}
</style>