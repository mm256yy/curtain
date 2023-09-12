<template>
	<view class="content" @click="close">
		<view class="paypal_box">
			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>收货地址</span>
					</view>
					<view class="right">
						<span v-if="addressData"
							@click="getPathTap('/pages/user/addressEdit?id='+addressData.id)">编辑地址</span>
						<span v-else @click="getPathTap('/pages/user/addressList?type=select')">请选择收货地址</span>
					</view>
				</view>
				<view class="address_box" @click="getPathTap('/pages/user/addressList?type=select')">
					<view v-if="addressData" class="address">
						<view class="left">
							<view class="tit">{{addressData.name}}<span>{{addressData.mobile}}</span>
							</view>
							<view class="txt">
								{{addressData.province}}{{addressData.city}}{{addressData.district}}{{addressData.address}}
							</view>
						</view>
						<view class="right">
							<aicon type="arrow-right-s-line" size="25" color="#999"></aicon>
						</view>
					</view>
					<view v-else class="none_address">
						<aicon type="location" size="25"></aicon>
						<span>选择地址</span>
					</view>
				</view>
			</view>

			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>商品信息</span>
					</view>
					<view class="right">
						<!-- 共{{cardNumTotal}}件商品 -->
					</view>
				</view>
				<view class="goods_box">
					<view class="goods" v-for="(item, index) in shopCartList" :key="index">
						<view class="left">
							<image :src="item.goodsSpecification[0].specificationImages" lazy-load="true"
								mode="aspectFill"></image>
						</view>
						<view class="right">
							<view v-if="item.goodsName" class="title">{{item.goodsName}}</view>
							<view v-else class="title">{{item.plugsGoods.goodsName}}</view>
							<view class="goodsSpec">
								<view  v-for="(value,key) in JSON.parse(item.goodsSpecification[0].specificationName)" :key="key">
									{{key+':'+value}}
								</view>
							</view>
							<view class="price">
								<view class="num">{{item.goodsSpecification[0].dealPrice}}<span>元</span></view>
								<view class="buy">x{{item.goodsNum}}</view>
							</view>
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
				<view class="order_info_box">
					<view class="order_head">
						<view class="label">
							<view class="tit">商品合计</view>
							<view class="txt">¥{{goodsTotal}}</view>
						</view>
					</view>
					<view class="order_foot">
						<view class="label">
							<view class="tit">实际应付</view>
							<view class="txt">¥{{goodsTotal}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- <paypalType :paypalShow="paypalShow" :money="userData.moneys" :countDownTime="orderData.count_down_time" @close="paypalShow=false" @paypal="getPaypalOrder"></paypalType> -->
		<u-popup :show="paypalShow" mode="bottom" :round="10" @close="close()">
			<view class="showBox">
				<view class="pheader">请选择支付方式</view>
				<view class="paypalList">
					<view class="paypal" @click="getPaypalOrder()">
						<view class="paypal-left">
							<view class="left">
								<aicon type="weixin1" size="30" color="#00c250"></aicon>
							</view>
							<view class="right">
								<view class="title">微信支付</view>
								<view class="info">简单快捷，推荐使用</view>
							</view>
						</view>
						<view class="icon">
							<aicon type="unfold-copy" size="18" color="#e2e2e2"></aicon>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		<view class="seat_box">
			<view class="seat"></view>
		</view>
		<view class="footer box_shadow">
			<view class="label">

				<view class="button" @click="paypalOrderTap('form')" style="backgroundColor: #F54319;">

					<span>确认下单并支付</span>
				</view>
				<!-- 	<button>确认下单并支付</button> -->
			</view>
		</view>
	</view>
</template>

<script>
	import md5 from "../../static/utils/md5.js"
	import JSONBig from 'json-bigint'
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				shopInfoData: uni.getStorageSync('__ddminiShopInfo'),
				shopCartList: uni.getStorageSync('__ddminiShopCart'),
				openId:uni.getStorageSync('__ddminiUserOpenid'),
				goodsTotal: -1,
				cardNumTotal: 0,
				couponsIndex: -1,
				couponsList: [],
				addressData: '',
				addressIndex: '', // 地址下标
				orderInfo: '',
				goodsOrderList: [],
				deliveryType: 1,
				userPhoneNumber: '',
				orderType: '',
				pintuanId: '',
				addCartInfo: [],
				list: [],
				payList: '',
				goodsScoreStatus: false,
				paypalShow: false,
				time: '',
				userData: '',
				addressList: [],
				businessId:'',
				cartListId: [], // 购物车ID列表
			}
		},
		onShow() {
			let self = this;
			this.openId = uni.getStorageSync('__ddminiUserOpenid')
			self.getAddressList();
			self.getbussinessId();
			console.log(self.shopCartList,'商品列表')
		},
		onLoad(e) {
			let self = this;
			let cart = self.shopCartList;
			let nums = 0;
			let mony = 0;
			let goods = [];
			if (e.type) {
				self.orderType = e.type;
			}
			if (e.pintuanId) {
				self.pintuanId = e.pintuanId;
			}
			let goods3 = []
			cart.forEach(itm => {
				nums += itm.goodsNum;
				mony += itm.goodsSpecification[0].dealPrice * itm.goodsNum;
				let goods2 = []
				let goods4=[]
				if (itm.id != null){
					goods3.push(itm.id)
				}
				
				itm.goodsSpecification.forEach(itm2 => {
					goods2.push(itm2.id);
					goods4.push(itm2.specificationName)
					if (itm.ctype === 'score') {
						self.goodsScoreStatus = true;
					}
				})

				goods.push({
					goodsId: itm.goodsId,
					goodsNum: itm.goodsNum,
					goodsName: !itm.plugsGoods ? itm.goodsName : itm.plugsGoods.goodsName,
					goodsSpecificationIds: goods2.toString(),
					goodsSpecificationNames:goods4.toString()
				});
			})
			self.cardNumTotal = nums;
			self.goodsTotal = mony;
			self.goodsOrderList = goods;
			self.cartListId = goods3;
			uni.$on('selectAddress', function(data) {
				if (data != null) {
					self.addressIndex = data;
					// console.log(self.addressIndex, 'pppppppppppppppp')
				} else {
					self.getAddressList(self.addressIndex);
				}
			})
			self.getAddressList();
		},
		methods: {
			getbussinessId(){
				let self=this;
				console.log("getBusinessInfo")
				self.Get2('/api/plugs/getBusinessInfo').then(res => {
					console.log("getBusinessInfo", res)
					if (res.code == 200) {
						let list = res.body;
						let listArr = [];
						list.forEach((item) => {
							listArr.push(JSONBig.parse(item.jsonData))
					    })
						self.BusinessList=listArr;
						self.businessId=self.BusinessList[0].businessId;
						// console.log(self.businessId,'self.businessIdself.businessId')
						// this.getCartList(id)
						// let id = this.ddminiUserInfo.id
						// this.getCartList(id)
					}
				})
			},
			close() {
				this.paypalShow = false;
			},
			// specNameText(data) {
			// 	let list = Object.keys(data);
			// 	let str = '';
			// 	list.forEach((itm, idx) => {
			// 		str += `${data[itm]}${(idx+1)===list.length?'':','}`
			// 	})
			// 	return str
			// },
			// getCouponsUserList() {
			// 	let self = this;
			// 	self.Get(self.Url.couponsUserList, {
			// 		status: 1,
			// 		goods: self.goodsListId
			// 	}).then(res => {
			// 		if (res.code === 0) {
			// 			let list = res.data.filter(itm => self.goodsTotal >= itm.min_money);
			// 			self.couponsList = list;
			// 			if (list.length > 0) {
			// 				self.couponsIndex = 0;
			// 			}
			// 			self.paypalOrderTap();
			// 		}
			// 	})
			// },
			getAddressList() {
				let self = this;
				let id = uni.getStorageSync('__ddminiUserInfo').id;
				self.Get('/api/user/searchUserInfoById', {
					"userId": id
				}).then(res => {
					if (res.code == 200) {
						let list = res.body.receiveAddressJson;
						if (list != '' || list != null) {
							self.addressList = JSON.parse(list);
							let i=self.addressIndex;
							if(self.addressList.length>0){
								self.addressData = self.addressList[i]
							}
						}
					}
				})
			},
			selectCouponsTap(index) {
				let self = this;
				if (index === self.couponsIndex) {
					self.couponsIndex = -1;
				} else {
					self.couponsIndex = index;
				}
				self.paypalOrderTap();
			},
			paypalOrderTap(e) {
				let self = this;
				uni.showLoading({
					title: '订单准备中',
					mask: true
				});
				if (!self.addressData) {
					uni.showModal({
						title: '订单提示',
						content: '还没有收货地址，请先选择或添加收货地址！',
						confirmText: '选择地址',
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/user/addressList?type=select'
								});
							}
						}
					})
					uni.hideLoading();
					return
				}
				let postData = {
					"latitude": 0,
					"logisticsType": 0,
					"longitude": 0,
					"payMoney":self.goodsTotal,
					"bussinessId": self.businessId,
					"orderGoodsDTOS": self.goodsOrderList,
					"receiverAddress": JSON.stringify(self.addressData),
					"shopCartIds": self.cartListId,
					
				}
				self.Post2('/api/order/createOrder', postData).then(res => {
					uni.hideLoading();
					if (res.code === 200) {
						self.orderInfo = res.body;
						let id=JSONBig.stringify(self.orderInfo.id)
						// console.log(id,'订单ID')
						if (!self.goodsScoreStatus) {
							self.paypalShow = true;
						}
					} else {
						uni.showModal({
							title: '订单提示',
							content: res.msg,
							showCancel: false
						});
						return
					}
				});
			},
			getPaypalOrder() {
				let self = this;
				
				let postData = {
					 "client": "小程序",
					  "openId": self.openId,
					  "orderId": self.orderInfo.id,
					  "orderNo": self.orderInfo.orderNo,
					  "payMoney": self.orderInfo.payMoney,
					  "payWay":1,
					  'extJson':"AX000000001"
				}
				// console.log(postData,'微信支付')
				uni.showLoading({
					title: '支付准备中',
					mask: true
				});
				self.Post2('/api/pay/appletsWechatOrderPay', postData).then(res => {
					if (res.code === 200) {
						// console.log(res,'支付')
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
									let id=JSON.parse(JSON.stringify(self.orderInfo.id)) ; 
									uni.navigateTo({
										url: `/pages/order/paysuccess?id=${id}&&money=${self.orderInfo.payMoney}`
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
			getBindWechatPhoneTap(e) {
				let self = this;
				uni.login({
					provider: "weixin",
					success(les) {
						let postData = {
							iv: e.detail.iv,
							code: les.code,
							encryptedData: e.detail.encryptedData,
						}
						self.Post(self.Url.userBindWechat, postData).then(res => {
							if (res.code === 0) {
								self.getUserInfo();
							} else {
								uni.showModal({
									title: '绑定失败',
									content: res.msg,
									showCancel: false
								})
							}
						})
					}
				})
			},
			getPathTap(path) {
				uni.navigateTo({
					url: path
				});
			}
		}
	}
</script>

<style lang="less">
	.showBox {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 40rpx;

		.pheader {}

		.paypalList {
			width: 94%;

			margin: 30rpx 0 260rpx 0;

			.paypal {
				width: 80%;
				margin: auto;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.paypal-left {
					display: flex;
					align-items: center;

					.right {
						margin-left: 26rpx;
					}
				}
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

		.delivery_box {
			width: 90%;
			margin: 0 auto;
			padding: 10rpx 0 50rpx;

			/deep/.u-radio {
				flex: 1;
			}
		}

		.phone_box {
			width: 90%;
			margin: 0 auto;
			padding: 10rpx 0 50rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;

			.input {
				flex: 1;
				height: 70rpx;
				border: 1px solid #eee;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				input {
					width: 92%;
					color: #1c1c1c;
					font-size: 30rpx;
					height: 100%;
				}
			}

			.btn {
				color: #F54319;
				border: 1px solid #F54319;
				height: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 20rpx;
				font-size: 28rpx;
				border-radius: 10rpx;
				margin-left: 20rpx;
				position: relative;

				button {
					position: absolute;
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					opacity: 0;
				}
			}
		}

		.address_box {
			width: 90%;
			margin: 0 auto;
			padding-bottom: 30rpx;

			.address {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.left {
					flex: 1;
					min-width: 0;

					.tit {
						color: #1c1c1c;
						font-size: 32rpx;

						span {
							color: #666;
							padding-left: 20rpx;
							font-size: 28rpx;
						}
					}

					.txt {
						font-size: 28rpx;
						color: #666;
						padding-top: 10rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.right {
					width: 80rpx;
					display: flex;
					align-items: center;
					justify-content: flex-end;
				}
			}

			.none_address {
				width: 100%;
				height: 150rpx;
				border: 1px dashed #e5e5e5;
				border-radius: 10rpx;
				color: #bbb;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				span {
					font-size: 26rpx;
				}
			}
		}

		.goods_box {
			padding-bottom: 2rpx;

			.goods {
				width: 90%;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 40rpx;

				.left {
					width: 200rpx;

					image {
						width: 180rpx;
						height: 180rpx;
						border-radius: 20rpx;
					}
				}

				.right {
					flex: 1;
					min-width: 0;
					height: 170rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.goodsSpec{
						font-size: 24rpx;
						color: #999;
						display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
						-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
						-webkit-line-clamp: 3;  //一个块元素显示的文本的行数
						overflow: hidden; //溢出隐藏
					}
					.title {
						color: #1c1c1c;
						font-size: 30rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.text {
						color: #999;
						font-size: 28rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.price {
						display: flex;
						align-items: center;
						justify-content: space-between;
						.num {
							color: #f14b5b;
							font-size: 32rpx;
							font-weight: bold;
							display: flex;
							align-items: center;

							span {
								font-size: 28rpx;
								padding-left: 2rpx;
							}
						}

						.buy {
							color: #F54319;
							// padding: 0 10rpx;
							border-radius: 10rpx;
							font-size: 28rpx;
							font-weight: bold;
						}
					}
				}
			}
		}

		.coupons_box {
			padding: 0 0 20rpx;

			.label {
				width: 90%;
				height: 120rpx;
				margin: 0 auto;
				border: 1px solid #f5f5f5;
				border-radius: 20rpx;
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;

				.price {
					width: 150rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #f14b5b;
					font-size: 38rpx;
					font-weight: bold;
					line-height: 38rpx;

					span {
						font-size: 24rpx;
						padding-left: 2rpx;
						margin-bottom: -4rpx;
					}
				}

				.info {
					flex: 1;
					min-width: 0;
					display: flex;
					flex-direction: column;
					justify-content: center;

					.title {
						color: #1c1c1c;
						font-size: 30rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.text {
						font-size: 26rpx;
						color: #999;
						padding-top: 4rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.button {
					width: 110rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}

		.order_info_box {
			.order_head {
				width: 90%;
				margin: 0 auto;

				.label {
					display: flex;
					align-items: center;
					padding-bottom: 30rpx;
					justify-content: space-between;
					font-size: 28rpx;
					color: #999;
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
				}
			}
		}
	}

	.pay_type_box {
		width: 92%;
		margin: 0 auto;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 20rpx;
		height: 100rpx;

		.icons {
			width: 100rpx;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.title {
			flex: 1;
			color: #1c1c1c;
			font-size: 28rpx;
		}

		.right {
			width: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
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
			justify-content: space-between;
			height: 120rpx;
			width: 100%;

			.button {
				width: 92%;
				margin: 0 auto;
				height: 80rpx;
				border-radius: 100rpx;
				color: #fff;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #F54319;

				/deep/.u-count-down__text {
					color: #fff;
					line-height: 30rpx;
					padding: 0 4rpx;
				}
			}
		}
	}
</style>
