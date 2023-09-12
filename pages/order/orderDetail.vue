<template>
	<view class="content" :style="{backgroundColor: template.color.back_color}">
		<view class="details_box" v-if="orderDetail">

			<view v-if="orderDetail.orderStatus==7" class="order_head_box">
				<view class="status">
					<aicon type="roundclosefill" :color="template.color.price_color" size="35"></aicon>
					<span>已失效</span>
				</view>
				<view class="text">
					<span v-if="orderDetail.orderExpireRemainTime<=0">订单已关闭，如有退款将会原路退回</span>
					<span v-else>订单因超时未支付，已被自动取消</span>
				</view>
			</view>
			<view v-if="orderDetail.orderStatus==0" class="order_head_box">
				<view class="status">
					<aicon type="timefill" :color="template.color.price_color" size="35"></aicon>
					<span>待付款</span>
				</view>
				<view class="text">
					<span>请在</span>
					<u-count-down :time="orderDetail.orderExpireRemainTime*1000" format="mm:ss"></u-count-down>
					<span>内完成支付，否则订单将自动取消</span>
				</view>
			</view>
			<view v-else-if="orderDetail.orderStatus==3" class="order_head_box">
				<view class="status">
					<aicon type="deliver_fill" :color="template.color.price_color" size="35"></aicon>
					<span>待收货</span>
				</view>
				<view class="text">
					<!-- <span>订单正在备货中，请耐心等待发货</span> -->
					<span>订单已发货，请注意接听快递来电</span>
				</view>
			</view>
			<view v-else-if="orderDetail.orderStatus==2" class="order_head_box">
				<view class="status">
					<aicon type="deliver_fill" :color="template.color.price_color" size="35"></aicon>
					<span>待发货</span>
				</view>
				<view class="text">
					<span>订单正在备货中，请耐心等待发货</span>
					<!-- <span>订单已发货，请注意接听快递来电</span> -->
				</view>
			</view>
			<view v-else-if="orderDetail.orderStatus==1" class="order_head_box">
				<view class="status">
					<aicon type="roundcheckfill" :color="template.color.price_color" size="35"></aicon>
					<span>已付款</span>
				</view>
				<view class="text">
					<span>付款完毕，等待发货</span>
				</view>
			</view>
			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>商品信息</span>
					</view>
					<view class="right"></view>
				</view>
				<view class="goods_box">
					<view class="goods" v-for="(item, index) in orderDetail.orderItemList" :key="item.id">
						<view class="left">
							<image :src="item.goodsSpecification.specificationImages" lazy-load="true"
								mode="aspectFill"></image>
						</view>
						<view class="right">
							<view class="title">{{item.goodName}}</view>
							<view class="goodsSpecification">
								<view class="text"
									v-for="(value,key) in JSON.parse(item.goodsSpecification.specificationName)"
									:key="key">{{key+':'+value}}</view>
							</view>
							<view class="price">
								<view class="num">{{item.goodsSpecification.dealPrice}}<span>元</span></view>
								<view class="buy">x{{item.goodsNum}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>收件信息</span>
					</view>
					<view class="right"></view>
				</view>
				<view class="info_box">
					<view class="label">
						<view class="tit">姓名</view>
						<view class="txt">{{addessData.name}}</view>
					</view>
					<view class="label">
						<view class="tit">电话</view>
						<view class="txt">{{addessData.mobile}}</view>
					</view>
					<view class="label">
						<view class="tit">地址</view>
						<view class="txt">
							{{addessData.province}}{{addessData.city}}{{addessData.district}}{{addessData.address}}
						</view>
					</view>
				</view>
			</view>

			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>支付信息</span>
					</view>
					<view class="right"></view>
				</view>
				<view class="info_box" style="padding-bottom: 0;">
					<view class="label">
						<view class="tit">商品合计</view>
						<view class="txt">¥{{orderDetail.payMoney}}</view>
					</view>
					<view class="order_foot">
						<view class="label">
							<view class="tit">实际应付</view>
							<view class="txt">¥{{orderDetail.payMoney}}</view>
						</view>
					</view>
				</view>
			</view>

			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>订单信息</span>
					</view>
					<view class="right"></view>
				</view>
				<view class="info_box">
					<view class="label">
						<view class="tit">订单状态</view>
						<view class="txt">
							<span v-if="orderDetail.orderStatus==0 ">待付款</span>
							<span v-else-if="orderDetail.orderStatus==2">待发货</span>
							<span v-else-if="orderDetail.orderStatus==1">已付款</span>
							<span v-else-if="orderDetail.orderStatus==3">待收货</span>
							<span v-else-if="orderDetail.orderStatus==5">已完成</span>
							<span v-else-if="orderDetail.orderStatus==7">已失效</span>
							<span v-else-if="orderDetail.orderStatus==9">已退款</span>
						</view>
					</view>
					<view class="label" v-if="orderDetail.payTime">
						<view class="tit">支付时间</view>
						<view class="txt">{{timestampToTime2(orderDetail.payTime)}}</view>
					</view>
					<view class="label">
						<view class="tit">下单时间</view>
						<view class="txt">{{timestampToTime2(orderDetail.createTime)}}</view>
					</view>
					<view class="label">
						<view class="tit">订单编号</view>
						<view class="txt">{{orderDetail.orderNo}}</view>
					</view>
					<view class="label" style="text-align: center;"
						v-if="orderDetail.orderStatus==1 || orderDetail.orderStatus==2"
						@click="Torefund(orderDetail.orderNo)">
						<view class="refund-text">申请退款</view>
						<!-- <view class="txt">{{orderDetail.orderNo}}</view> -->
					</view>
				</view>
			</view>
		</view>

		<view class="seat_box">
			<view class="seat"></view>
		</view>
		<view class="footer box_shadow">
			<view class="label">
				<view v-if="orderDetail.orderStatus==0" class="button" @click="getPaypalOrder()"
					:style="{backgroundColor: template.color.temp_color}">立即支付</view>
				<view v-else-if="orderDetail.orderStatus==7 " class="button" style="color: #da5000;">订单失效</view>
				<view v-else-if="orderDetail.orderStatus==2" class="button" style="color: #da5000;">待发货</view>
				<view v-else-if="orderDetail.orderStatus==3" class="button" style="color: #da5000;">待收货</view>
				<view v-else-if="orderDetail.orderStatus==1" class="button" style="color: #da5000;">已付款</view>
				<view v-else-if="orderDetail.orderStatus==5" class="button" style="color: #da5000;">已完成</view>
				<view v-else-if="orderDetail.orderStatus==9" class="button" style="color: #da5000;">已退款</view>
			</view>
		</view>
	</view>
</template>

<script>
	import md5 from "../../static/utils/md5.js"
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				openId: uni.getStorageSync('__ddminiUserOpenid'),
				id: '',
				orderDetail: '',
				paypalShow: '',
				userData: '',
				start: '',
				end: '',
				payList: '',
				day: '',
				limitData: '',
				addessData: '',
				totaldata: '',
				creatOrderTime: ''
			}
		},
		onLoad(e) {
			let self = this;
			self.id = e.id;
			self.getOrderDetail();
			// self.getUserInfo();
		},
		onShow() {
			let self = this;
		},
		methods: {
			timestampToTime2(timestamp) {
				let self = this;
				let date = new Date(timestamp)
				let Y = date.getFullYear() + '-'
				let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
				let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
				let H = date.getHours() + ':'
				let M2 = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
				let S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
				return Y + M + D + H + M2 + S
				// self.creatOrderTime=Y + M + D + H + M2 + S
			},
			Torefund(i) {
				uni.navigateTo({
					url: `/pages/order/refund?id=${i}`
				})
			},
			getData() {
				let self = this;
				let DateList = uni.getStorageSync('dateList');
				self.start = DateList.slice(0, 1);
				self.end = DateList.slice(DateList.length - 1);
				self.day = DateList.length - 1;
			},
			provinceText(text) {
				if (text) {
					let str = text.replace(/,/g, '');
					return str
				}
			},
			specNameText(data) {
				let list = Object.keys(data);
				let str = '';
				list.forEach((itm, idx) => {
					str += `${data[itm]}${(idx+1)===list.length?'':','}`
				})
				return str
			},
			getOrderDetail() {
				let self = this;
				uni.showLoading({
					title: '订单加载中',
					mask: true
				});
				self.Get2(`/api/order/getOrderInfoById?id=${self.id}`).then(res => {
					if (res.code === 200) {
						uni.hideLoading();
						let list = res.body;
						console.log(res, '订单详情')
						self.orderDetail = list;
						self.addessData = JSON.parse(list.orderLogistics.receiverMobile);
						let timestamp = list.createTime
						let payTime = list.payTime
					} else {
						uni.hideLoading();
					}
				})
			},
			getPaypalOrder() {
				let self = this;
				let postData = {
					"client": "小程序",
					"openId": self.openId,
					"orderId": self.orderDetail.id,
					"orderNo": self.orderDetail.orderNo,
					"payMoney": self.orderDetail.payMoney,
					"payWay": 1
				}
				uni.showLoading({
					title: '支付准备中',
					mask: true
				});
				self.Post2('/api/pay/appletsWechatOrderPay', postData).then(res => {
					if (res.code === 200) {
						self.payList = res.body;
						uni.hideLoading();
						self.time = Date.now();
						wx.requestPayment({
							'appId': self.payList.appid,
							'nonceStr': self.payList.noncestr,
							'package': self.payList.package,
							'signType': 'MD5',
							'timeStamp': self.payList.timestamp,
							'paySign': self.payList.sign,
							success: function(res) {
								uni.showToast({
									title: '微信支付成功'
								});
								setTimeout(function() {
									uni.navigateTo({
										url: `/pages/order/paysuccess?money=${self.orderDetail.payMoney}`
									});
								}, 600);
							},
							fail: function(err) {
								uni.showModal({
									title: '支付失败',
									content: '订单支付失败，请重新进行支付。如对订单金额有疑问请联系客服人员',
									showCancel: false
								})
								return
							}
						});
					} else {
						uni.hideLoading();
						uni.showModal({
							title: '支付失败',
							content: res.msg,
							showCancel: false
						})
					}
				})
			},
			// confirmOrder() {
			// 	let self = this;
			// 	let id = self.orderDetail.id;
			// 	uni.showLoading({title: '确认收货中', mask: true});
			// 	self.Get(self.Url.orderConfirm, {id: id}).then(res => {
			// 		if(res.code === 0){
			// 			uni.hideLoading();
			// 			uni.showToast({title: '确认收货成功'});
			// 			self.getOrderDetail();
			// 		}else{
			// 			uni.hideLoading();
			// 			uni.showModal({
			// 				title: '确认收货失败',
			// 				content: res.msg,
			// 				showCancel: false
			// 			})
			// 		}
			// 	});
			// },
			// getOrderDel(){
			// 	let self = this;
			// 	uni.showModal({
			// 		title: '订单删除确认',
			// 		content: '订单删除后不可恢复，是否继续删除？',
			// 		success(ces){
			// 			if(ces.confirm){
			// 				let id = self.orderDetail.id;
			// 				uni.showLoading({title: '准备删除中', mask: true});
			// 				self.Get(self.Url.orderDel, {id: id}).then(res => {
			// 					if(res.code === 0){
			// 						uni.hideLoading();
			// 						uni.showToast({title: '订单删除成功'});
			// 						self.$nextTick(function(){
			// 							uni.navigateBack();
			// 						})
			// 					}else{
			// 						uni.hideLoading();
			// 						uni.showModal({
			// 							title: '订单删除失败',
			// 							content: res.msg,
			// 							showCancel: false
			// 						})
			// 					}
			// 				})
			// 			}
			// 		}
			// 	})
			// }
		}
	}
</script>

<style lang="less">
	.content {
		padding-bottom: 140rpx;
	}

	.details_box,
	.content {
		min-height: 100vh;
	}

	.order_head_box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx 0;

		.status {
			display: flex;
			align-items: center;
			color: #1c1c1c;
			font-size: 42rpx;
			font-weight: bold;
			line-height: 70rpx;

			aicon {
				width: 70rpx;
				height: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			span {
				padding-left: 10rpx;
			}
		}

		.text {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			color: #666;
			padding-top: 20rpx;

			/deep/.u-count-down__text {
				font-size: 26rpx;
				color: #666;
				padding: 0 4rpx;
			}
		}
	}

	.menu_box {
		width: 100%;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 30rpx;

		.head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 100rpx;
			width: 90%;
			margin: 0 auto;

			.left {
				color: #1c1c1c;
				font-size: 30rpx;
				font-weight: bold;
				line-height: 30rpx;
				display: flex;
				align-items: center;
			}

			.right {
				color: #999;
				display: flex;
				align-items: center;
				font-size: 26rpx;
				line-height: 26rpx;
			}
		}

		.data {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 60rpx;
			margin: 0 auto;
			width: 90%;
			color: #404040;
		}

		.goods_box {
			padding-bottom: 30rpx;

			.goods {
				width: 90%;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					width: 180rpx;

					image {
						width: 160rpx;
						height: 160rpx;
						border-radius: 20rpx;
					}
				}

				.right {
					flex: 1;
					min-width: 0;
					height: 150rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.goodsSpecification {
						position: relative;
						display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
						-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
						-webkit-line-clamp: 2; //一个块元素显示的文本的行数
						overflow: hidden; //溢出隐藏

						.num {
							// position: absolute;
							// bottom: -70rpx;
							// left: 0;
						}
					}

					.title {
						color: #1c1c1c;
						font-size: 30rpx;
						height: 52rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.text {
						color: #999;
						font-size: 26rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.price {
						display: flex;
						align-items: center;
						justify-content: space-between;
						// padding-bottom: 10rpx;

						.num {
							color: #1c1c1c;
							font-size: 30rpx;
							display: flex;
							align-items: center;

							span {
								font-size: 28rpx;
								padding-left: 2rpx;
							}
						}

						.buy {
							color: #1c1c1c;
							font-size: 28rpx;
						}
					}
				}
			}
		}

		.info_box {
			padding: 10rpx 0 20rpx;

			.label {
				width: 90%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 30rpx;
				margin-bottom: 30rpx;
				color: #666;

				.refund-text {
					width: 100%;
					text-align: center;
					color: #666;
				}

				.tit {
					width: 130rpx;
					color: #666;
				}

				.txt {
					flex: 1;
					min-width: 0;
					text-align: right;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color: #1c1c1c;
				}
			}

			.order_foot {
				border-top: 1px solid #f5f5f5;

				.label {
					display: flex;
					align-items: center;
					width: 90%;
					margin: 0 auto;
					justify-content: space-between;
					height: 100rpx;
					font-weight: bold;
					font-size: 30rpx;
					margin-bottom: 0;

					.tit {
						color: #1c1c1c;
					}
				}
			}
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 100;
		background-color: #fff;
		padding-bottom: env(safe-area-inset-bottom);
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;

		.label {
			display: flex;
			align-items: center;
			// justify-content: center;
			height: 120rpx;
			width: 100%;

			.button {
				width: 92%;
				margin: 0 auto;
				height: 80rpx;
				border-radius: 100rpx;
				text-align: center;
				line-height: 80rpx;
				color: #fff;
				font-size: 32rpx;
				position: relative;

			}
		}
	}
</style>
