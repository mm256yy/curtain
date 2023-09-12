<template>
	<view class="content">
		<!-- <view class="cart-num">
			共<text>{{Cartnumbers}}</text>个商品
		</view> -->
		<view class="card_goods_list">
			<u-swipe-action>
				<u-swipe-action-item ref="action" :options="options" v-for="(item, index) in cartList"
					@click="delGoodsArray(item.id)" :key="item.id">
					<view class="goods" @click="selectGoodsTap(index)">
						<view class="left">
							<aicon v-if="item.sltState===1" type="roundcheckfill" color="#F54319" size="25"></aicon>
							<aicon v-else type="round" color="#eee" size="25"></aicon>
						</view>
						<view class="center">
							<image v-if="item.goodsSpecification.length!=0" :src="item.goodsSpecification[0].specificationImages" lazy-load="true" mode="aspectFill"></image>
							<image v-else :src="item.plugsGoods.previewUrl" lazy-load="true" mode="aspectFill"></image>
						</view>
						<view class="right">
							<view class="name_box">
								<view class="title">{{item.plugsGoods.goodsName}}</view>
								<view class="goodsSpec"  v-if="item.goodsSpecification.length!=0" >
									<view  v-for="(value,key) in JSON.parse(item.goodsSpecification[0].specificationName)" :key="key">
										{{key+':'+value}}
									</view>
								</view>
								<!-- <view class="">{{item.specifications}}</view> -->
							</view>
							<view class="box">
								<view class="">
									<view class="price" v-if="item.goodsSpecification.length!=0" ><span>¥</span>{{item.goodsSpecification[0].dealPrice}}</view>
									<view class="price" v-else ><span>¥</span>{{item.plugsGoods.goodsPrice}}</view>

								</view>
								
								<view class="numbox">
									<view v-if="item.goodsSpecification[0].stockNum>0" class="buy">
										<view class="btn" @click.stop="editGoods(index, 'jian')">
											<aicon type="indeterminate-circle-fill" size="25"
												:color="item.num<=1?'#eee':'#F54319'"></aicon>
										</view>
										<view class="input">
											<input type="number" disabled :value="item.goodsNum" />
										</view>
										<view class="btn" @click.stop="editGoods(index, 'jia')">
											<aicon type="add-circle-fill" size="25" color="#F54319"></aicon>
										</view>
									</view>
									<view v-else class="none">库存不足</view>
								</view>
							</view>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
			<view class="none_list_box" v-if="cartList.length===0" style="height: 40vh;">
				<image src="../../static/images/none_data_icon_01.png" lazy-load="true" mode="widthFix"></image>
				<span>购物车空空的</span>
			</view>
		</view>
		<view v-if="cartList.length>0" class="card_footer">
			<view class="label">
				<view class="left" @click="selectAllTap()">
					<aicon v-if="cartSelectAll" type="roundcheckfill" color="#F54319" size="25"></aicon>
					<aicon v-else type="round" color="#eee" size="25"></aicon>
					<span>全选</span>
				</view>
				<view class="right">
					<view class="price">
						合计：<span>¥{{cartTotalMoney}}</span>
					</view>
					<view v-if="cartSelectList.length===0" class="btn_box" style="opacity: .5;">立即下单</view>
					<view v-else class="btn_box" @click="toPaypalTap()">立即下单</view>
				</view>
			</view>
			<!-- <view class="hover_label"></view> -->
		</view>
		<view class="hot-goods" v-if="cartList.length==0" >
			<view class="hot-goods-title">
				<u-icon name="minus" color="#cdcdcd" size="28"></u-icon>
				<view class="hot-text">
					<u-icon name="heart-fill" color="#ff5d32" size="20"></u-icon>猜你会喜欢
				</view>
				<u-icon name="minus" color="#cdcdcd" size="28"></u-icon>
			</view>
			<view class="hot-goods-box"  >
				<view class="goods-block" v-for="(item,index) in tuijianArray" :key="index"
					@click="Topath(`/pages/index/detail?id=${item.id}`)">
					<view class="goods-box">
						<image class="goods-img" :src="item.preview_url" lazy-load="true" mode=""></image>
						<view class="goods-name">
							{{item.goods_name}}
						</view>
						<view class="goods-price">
							<view class="price">
								<text>￥</text>
								<text class="price-text">{{item.goods_price}}</text>
							</view>
							<view class="price-right">
								<text>￥</text>
								<text>{{item.scribe_price}}</text>
							</view>
							<!-- <view>
								<u-icon name="shopping-cart" color="#ff4544" size="28"></u-icon>
							</view> -->
						</view>
						<view class="month_sales">
							销量:{{item.total_sales}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<backtop ref="VT" :scrollTop="top"></backtop>
		<!-- <tabbar :current="2" :cart="Cartnumbers"></tabbar> -->
		<view v-if="cartList.length>0" class="card_footer">
			<view class="label">
				<view class="left" @click="selectAllTap()">
					<!-- <aicon v-if="cartSelectAll" type="roundcheckfill" color="#F54319" size="25"></aicon>
					<aicon v-else type="round" color="#eee" size="25"></aicon>
					<span>全选</span> -->
				</view>
				<view class="right">
					<view class="price">
						合计：<span>¥{{cartTotalMoney}}</span>
					</view>
					<view v-if="cartSelectList.length===0" class="btn_box" style="opacity: .5;">立即下单</view>
					<view v-else class="btn_box" @click="toPaypalTap()">立即下单</view>
				</view>
			</view>
			<!-- <view class="hover_label"></view> -->
		</view>
		<!-- <tabbar :current="2"></tabbar> -->

	</view>
</template>

<script>
	const app = getApp();
	import JSONBig from 'json-bigint'
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				options: [{
					text: '删除'
				}],
				cartList: [],
				top: 0,
				cartTotalMoney: 0,
				cartSelectAll: false,
				cartSelect: '',
				cartSelectList: [],
				hotGoodsList: [],
				userInfoData: '',
				Cartnumbers: 0,
				cartNums: 0,
				// 新加
				tuijianArray: [],
				businessId: '',
				ddminiUserInfo: uni.getStorageSync('__ddminiUserInfo') || {},
			}
		},
		onPageScroll(e) {
			this.$refs.VT.topData(e.scrollTop)
		},
		onShow() {
			let self = this;
			let id = this.ddminiUserInfo.id
			if (id != null) {
				self.getbussinessId()
			}
			// self.getCartList();
		},
		onLoad() {
			let self = this;
			// self.getUserInfo();
		},
		methods: {
			getbussinessId() {
				let self = this;
				self.Get2('/api/plugs/getBusinessInfo').then(res => {
					if (res.code == 200) {
						let list = res.body;
						let listArr = [];
						list.forEach((item) => {
							listArr.push(JSONBig.parse(item.jsonData))
						})
						self.BusinessList = listArr;
						self.businessId = self.BusinessList[0].businessId
						// this.getCartList(id)
						let id = this.ddminiUserInfo.id
						this.getCartList(id)
					}
				})
			},
			// 获取购物车商品列表
			getCartList(id) {
				let self = this;
				// let businessId = uni.getStorageSync('__shoplistInfo')[0].businessId || 0
				this.Get(`/api/plugs/getPlugsShopCartByUserId?page=1&businessId=${self.businessId}`).then(res => {
					// console.log("getPlugsShopCartByUserId", res)
					if (res.code === 200) {
						let list = res.body.list;
						let num = 0;
						list.forEach((value, index) => {
							value.sltState = 0;
						})
						self.cartList = list;
						// console.log(self.cartList,'购物车列表')
						let nums = 0;
						self.cartList.forEach(item => {
							nums += item.goodsNum;
						})
						self.Cartnumbers = nums;
						self.getCheckCartNumber();
					}
				})
				this.Get('/api/plugs/searchPlugsMockDataByType?dataType=shop_car_data').then(res => {
					if (res.code == 200) {
						this.tuijianArray = res.body.jsonViewData.data
						// console.log(this.tuijianArray,'猜你会喜欢')
					}
				})
			},
			editGoods(index, type) {
				let self = this;
				let nums = self.cartList[index].goodsNum;
				let stok = self.cartList[index].goodsSpecification[0].stockNum;
				if (type === 'jian') {
					if (nums > 1) {
						self.cartList[index].goodsNum--;
					}
				} else if (type === 'jia') {
					if (nums < stok) {
						self.cartList[index].goodsNum++;
					} else {
						uni.showToast({
							title: '已超过最大库存数量',
							icon: 'none'
						});
					}
				}
				self.getCheckCartNumber();

				let list2 = [{
					businessId: self.cartList[index].businessId,
					goodsCategoryId: self.cartList[index].goodsCategoryId,
					goodsNum: self.cartList[index].goodsNum,
					goodsId: self.cartList[index].goodsId,
					// sltState: self.cartList[index].cartSelect
				}]
				self.getCartEdit(list2);


				let postData = {
					'goodsId': self.cartList[index].id,
					'goodsNum': self.cartList[index].number
				}
				self.getCartEdit(postData)

			},
			selectGoodsTap(index) {
				let self = this;
				let data = self.cartList[index]
				let select = self.cartList[index].sltState;
				if (data.goodsSpecification[0].stockNum > 0) {
					if (select == 0) {
						self.cartList[index].sltState = 1;
					} else {
						self.cartList[index].sltState = 0;
					}
					// let list2 = [{
					// 	id: self.cartList[index].id,
					// 	number: self.cartList[index].number,
					// 	sltState: self.cartSelect
					// }]
					// self.getCartEdit(list2);
				} else {
					uni.showToast({
						title: '库存不足',
						duration: 800
					});
				}
				self.getCheckCartNumber();
			},
			getCheckCartNumber() {
				let self = this;
				let cart = self.cartList;
				let total = 0;
				let status = false;
				let aum = 0;
				let bum = 0;
				let list = [];
				cart.forEach(itm => {
					if (itm.goodsSpecification.length > 0) {
						if (itm.goodsSpecification[0].stockNum > 0) {
							aum++;
						}
						if (itm.sltState == 1) {
							bum++;
							total += itm.goodsNum * itm.goodsSpecification[0].dealPrice;
							list.push(itm);
						}
					}
				})
				self.cartTotalMoney = total.toFixed(2);
				self.cartSelectList = list;
				// console.log(self.cartSelectList, '选中')
				self.cartSelectAll = aum === bum;
			},

			getCartEdit(data) {
				let self = this;
				let postData = data;
				self.Post2('/api/plugs/updatePlugsShopCart', postData).then(res => {
					if (res.code === 200) {
						self.getCartList();
					}
				})
			},
			toPaypalTap() {
				let self = this;
				let token = uni.getStorageSync('__ddminiUserInfo').accessToken;
				if (self.cartSelectList.length === 0) {
					return uni.showToast({
						title: '请选择要下单的商品',
						icon: 'none'
					});
				}
				if (token) {
					uni.setStorage({
						key: '__ddminiShopCart',
						data: self.cartSelectList
					});
					uni.navigateTo({
						url: '/pages/order/paypal'
					});
				} else {
					uni.navigateTo({
						url: '/pages/user/login'
					});
				}
			},
			delGoodsArray(i) {
				let self = this;
				let postData = `ids=${i}`
				uni.showModal({
					title: '提示',
					content: '确定要删除吗?',
					success: function(res) {
						if (res.confirm) {
							self.Post('/api/plugs/delPlugsShopCart', postData).then(res => {
								if (res.code == 200) {
									self.getCartList()
								}
							})
						} else if (res.cancel) {}
					}
				});
			},
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},



			addToCart(index) {
				let dict = this.tuijianArray[index]

				let postData = {
					goodsId: dict.id,
					goodsCategoryId: dict.categoryId,
					goodsNum: 1,
					goodsSpecificationIds: '0'
				};

				// console.log(postData)
				this.Post2('/api/plugs/insertPlugsShopCart', postData).then(res => {
					console.log("insertPlugsShopCart", res)
					if (res.code == 200) {
						this.getGoodsArray()
					}
				})
			},

			getCartEdit(data) {
				let self = this;
				let postData = data;
				self.Post2('/api/plugs/updatePlugsShopCart', postData).then(res => {
					if (res.code === 200) {
						let id = self.ddminiUserInfo.id
						if (id != null) {
							self.getCartList(id)
						}
					}
				})
			},

			qujiesuanTap() {
				// this.request1()//创建订单
				// this.request2()//订单列表
				// this.request3()//订单详情
				// this.request4()
			},


		}
	}
</script>

<style lang="less">
	page{
		background-color: #fff;
	}
	.card_footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 1000;
		background-color: #fff;
		border-bottom: 3rpx solid #f5f5f5;
		padding-bottom: env(safe-area-inset-bottom);

		.label {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 90%;
			margin: 0 auto;
			height: 100rpx;

			.left {
				display: flex;
				align-items: center;
				color: #999;

				span {
					padding-left: 10rpx;
				}
			}

			.right {
				display: flex;
				align-items: center;
				
				.price {
					color: #1c1c1c;
					font-size: 28rpx;
					margin-right: 50rpx;

					span {
						color: #F54319;
						font-weight: bold;
						font-size: 30rpx;
					}
				}

				.btn_box {
					background-color: #F54319;
					color: #fff;
					width: 200rpx;
					height: 70rpx;
					border-radius: 10rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 30rpx;
				}
			}
		}

		.hover_label {
			height: 120rpx;
			width: 100%;
			border-top: 1px solid #f5f5f5;
		}
	}

	.hot-goods {
		width: 96%;
		margin-left: 2%;

		.hot-goods-title {
			width: 100%;
			display: flex;
			justify-content: space-around;
			margin: 30rpx 0rpx;
			box-sizing: border-box;
			padding: 30rpx 80rpx;
			text-align: center;
			font-size: 26rpx;
			color: #909399;

			.hot-text {
				margin: 0rpx 26rpx;
				display: flex;
				align-items: center;
			}
		}

		.hot-goods-box {
			width: 100%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.goods-block {
				width: 48%;
			}

			.goods-box {
				// display: flex;
				width: 100%;
				height: 480rpx;
				border-radius: 16rpx;
				box-sizing: border-box;
				background-color: #fff;
				margin-bottom: 26rpx;
				box-shadow: 0px 0px 16rpx 0px rgba(207, 207, 207, 0.5);

				.goods-img {
					width: 100%;
					height: 310rpx;
					border-radius: 16rpx 16rpx 0 0;
				}

				.goods-name {
					width: 94%;
					margin: 10rpx auto;
					font-size: 28rpx;
					/**适用范围：因使用了WebKit的CSS扩展属性，该方法适用于WebKit浏览器及移动端；**/
					display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
					-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
					-webkit-line-clamp: 2; //一个块元素显示的文本的行数
					overflow: hidden; //溢出隐藏
				}

				.goods-price {
					width: 94%;
					margin: auto;
					display: flex;
					align-items: center;
					// justify-content: space-between;
					.price-right{
						margin-left: 12rpx;
						font-size: 26rpx !important;
						font-weight: 400 !important;
						color: #aaa;
						margin-left: 18rpx;
						text-decoration: line-through;
					}
					.price {
						color: #ff4544;

						.price-text {
							font-size: 34rpx;
							font-weight: 600;
						}
					}
				}
				.month_sales{
					width: 94%;
					margin: auto;
					font-size: 22rpx;
					color: #aaa;
				}
			}
		}
	}

	.content {
		padding-bottom: 100rpx;
		width: 100%;
		overflow-x: hidden;

		.cart-num {
			width: 100%;
			height: 80rpx;
			// margin: auto;
			padding-left: 20rpx;
			line-height: 80rpx;
			background-color: #fff;
			margin-bottom: 5rpx;
			border-bottom: 3rpx solid #f5f5f5;
			text {
				color: #f64319 !important;
			}
		}
	}

	.card_goods_list {
		width: 750rpx;
		overflow-x: hidden;

		.goods {
			display: flex;
			justify-content: space-between;
			align-items: center;
			min-width: 0;
			border-bottom: 3rpx solid #f5f5f5;
			.left {
				width: 120rpx;
				height: 200rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.center {
				width: 200rpx;
				height: 240rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 20rpx;
				}
			}

			.right {
				flex: 1;
				min-width: 0;
				padding-left: 30rpx;
				height: 190rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.name_box {
					width: 95%;
					.goodsSpec{
						font-size: 26rpx;
						color: #999;
						display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
						-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
						-webkit-line-clamp: 3;  //一个块元素显示的文本的行数
						overflow: hidden; //溢出隐藏
					}
					.title {
						font-size: 30rpx;
						color: #1c1c1c;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						// margin-bottom: 30rpx;
					}

					.intro {
						color: #999;
						font-size: 26rpx;
						padding-top: 12rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.box {
					width: 95%;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.price {
						flex: 1;
						display: flex;
						align-items: center;
						font-size: 32rpx;
						font-weight: bold;
						color: #F54319;

						span {
							font-weight: normal;
							font-size: 26rpx;
							padding-right: 4rpx;
						}
					}

					.numbox {
						.none {
							color: #999;
							font-size: 26rpx;
						}

						.buy {
							display: flex;
							align-items: center;

							.btn {
								width: 50rpx;
								height: 50rpx;
								display: flex;
								align-items: center;
								justify-content: center;

								aicon {
									width: 100%;
									height: 100%;
									display: flex;
									align-items: center;
									justify-content: center;
								}
							}

							.input {
								width: 100rpx;
								height: 50rpx;
								background-color: #eee;
								margin: 0 6rpx;
								border-radius: 100rpx;

								input {
									width: 100%;
									height: 100%;
									text-align: center;
									font-size: 30rpx;
									color: #1c1c1c;
								}
							}
						}
					}
				}
			}
		}
	}

	.card_footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 1000;
		background-color: #fff;
		border-bottom: 3rpx solid #f5f5f5;
		padding-bottom: env(safe-area-inset-bottom);

		.label {
			.cart-bottom {
				width: 100%;
				background-color: #fff;
				border-top: 3rpx solid #e2e2e2;
				border-bottom: 3rpx solid #e2e2e2;
				box-shadow: 0px 0px 16rpx 0px rgba(207, 207, 207, 0.5);
				position: fixed;
				left: 0;
				// bottom: 110rpx;
				bottom: 0;
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 90%;
				margin: 0 auto;
				height: 100rpx;

				.left {
					display: flex;
					align-items: center;
					color: #999;

					span {
						padding-left: 10rpx;
					}
				}

				.right {
					display: flex;
					align-items: center;

					.price {
						color: #1c1c1c;
						font-size: 28rpx;
						margin-right: 50rpx;

						span {
							color: #F54319;
							font-weight: bold;
							font-size: 30rpx;
						}
					}

					.btn_box {
						background-color: #F54319;
						color: #fff;
						width: 200rpx;
						height: 70rpx;
						border-radius: 10rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 30rpx;
					}
				}
			}

			.hover_label {
				height: 120rpx;
				width: 100%;
				border-top: 1px solid #f5f5f5;
			}
		}

		.hot_goods_list {
			padding-top: 50rpx;
			padding-bottom: 110rpx;

			.hot_head {
				width: 80%;
				margin: 0 auto;
				padding: 20rpx 0;
			}

			.goods_list {
				width: 92%;
				padding-top: 40rpx;
				margin: 0 auto;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.goods {
					flex-basis: 48%;
					margin-bottom: 30rpx;

					.image {
						image {
							width: 100%;
							height: 280rpx;
							border-top-left-radius: 20rpx;
							border-top-right-radius: 20rpx;
						}
					}

					.info {
						border: 1px solid #efefef;
						border-top: none;
						border-bottom-left-radius: 20rpx;
						border-bottom-right-radius: 20rpx;
						padding: 20rpx 0;
						min-width: 0;

						.title {
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							color: #1f1f1f;
							font-size: 28rpx;
							width: 90%;
							margin: 0 auto;
							max-width: 300rpx;

							span {
								background-color: #F54319;
								color: #fff;
								padding: 0 6rpx;
								border-radius: 6rpx;
								font-size: 24rpx;
								margin-right: 10rpx;
							}
						}

						.box {
							width: 90%;
							margin: 0 auto;
							display: flex;
							align-items: center;
							justify-content: space-between;
							padding-top: 10rpx;

							.left {
								flex: 1;
								min-width: 0;
								min-height: 82rpx;
								display: flex;
								flex-direction: column;
								justify-content: center;

								.price {
									color: #F54319;
									font-size: 30rpx;

									span {
										color: #999;
										font-size: 26rpx;
										text-decoration: line-through;
										margin-left: 10rpx;
									}
								}

								.vip {
									color: #1f1f1f;
									font-size: 28rpx;
									display: flex;
									align-items: center;
									padding-top: 6rpx;

									span {
										background-color: #1f1f1f;
										color: gold;
										font-size: 20rpx;
										padding: 0 6rpx;
										border-top-left-radius: 10rpx;
										border-top-right-radius: 10rpx;
										border-bottom-right-radius: 10rpx;
										margin-left: 10rpx;
									}
								}

								.tuan {
									span {
										margin-left: 0;
										border-top-left-radius: 0;
										border-top-right-radius: 0;
										border-bottom-right-radius: 0;
										padding: 2rpx 10rpx;
										border-radius: 6rpx;
										background-color: gold;
										color: #1f1f1f;
									}
								}
							}

							.right {
								aicon {
									width: 56rpx;
									height: 56rpx;
									display: flex;
									align-items: center;
									justify-content: center;
									border: 1px solid #F54319;
									border-radius: 100%;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
