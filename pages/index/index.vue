<template>
	<view class="content">
		<!-- <view class="search common" @click="Topath('/pages/index/search')">
			<input type="text" placeholder="请输入商品搜索">
			<u-icon name="search" size="24"></u-icon>
		</view> -->
		<view class="search" @click="Topath('/pages/index/search')" >
			<input class="inp" type="text" placeholder="搜索">
			<view class="search-icon">
				<u-icon name="search" size="16"></u-icon>
			</view>
		</view>
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item class="swiper-box" v-for="(item,index) in recommendedList" :key="index">
				<image class="swiper-img" :src="item.activityImgUrl" lazy-load="true" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="kefu common">
			<view class="category">
				<u-grid :border="false" col="4">
					<u-grid-item v-for="(item,index) in data1" :key="index" @click="gophone(item.mobile)">
							<image class="grid-img" :src="item.customer_images" mode="aspectFill"></image>
							<text class="grid-text2">{{item.customer_name}}</text>
					</u-grid-item>
				</u-grid>
			</view>
			<view class="category cates">
				<u-grid :border="false" col="3">
					<u-grid-item v-for="(item,index) in categoryList" @click="categoryItemTap(index,item.categoryName)" :key="index">
						<image class="grid-img" :src="item.icon" mode="aspectFill"></image>
						<text class="grid-text2">{{item.categoryName}}</text>
					</u-grid-item>
				</u-grid>
				<!-- <u-grid :border="false" col="3">
					<u-grid-item v-for="item in 7"  >
						<image class="grid-img" src="../../static/images/kefu.png" mode="aspectFill"></image>
						<text class="grid-text2">分类</text>
					</u-grid-item>
				</u-grid> -->
			</view>
		</view>
		<!-- 热销产品 -->
		<view class="recommend ">
			<view class="hot-title">
				<u-icon name="minus" color="#cdcdcd" size="28"></u-icon>
				<view class="hot-text">热销产品</view>
				<u-icon name="minus" color="#cdcdcd" size="28"></u-icon>
			</view>
			<view class="recommend-box">
				<view class="goods-block" v-for="(item,index) in data2" :key="index" @click.native="goodsItemClick"
					:data-index="index">
					<view class="goods-box">
						<image class="goods-img" :src="item.preview_url" mode=""></image>
						<view class="goods-name">
							{{item.goods_name}}
						</view>
						<view class="goods-price">
							<view class="price">
								<view class="price-left">
									<text>￥</text>
									<text class="price-text">{{item.goods_price}}</text>
								</view>
								<view class="price-right">
									<text>￥</text>
									<text>{{item.scribe_price}}</text>
								</view>
							</view>
										<u-icon name="shopping-cart" color="#ff4544" size="28"
								@click.native.stop="">
							</u-icon>
						</view>
						<!-- <view class="month_sales">
							销量:{{item.total_sales}}
						</view> -->
					</view>
				</view>
			</view>
		</view>
		<backtop ref="VT" :scrollTop="top"></backtop>
		<!-- <tabbar :current="0"></tabbar> -->
	</view>
</template>
<script>
	const app = getApp();
	import JSONBig from 'json-bigint'
	export default {
		data() {
			return {
				template: '',
				data1: [], //客服列表
				data2: [], //热销商品
				categoryList: [],
				recommendedList: [],
				businessId:'',
				top:0
			}
		},
		onShow() {
			let self = this;
			let token = uni.getStorageSync('__ddminiUserInfo').accessToken;
			// if(token==null){
			// 	uni.navigateTo({
			// 		url:'/pages/user/login'
			// 	})
			// }
			self.getbussinessId()
		},
		onPageScroll(e) {
			this.$refs.VT.topData(e.scrollTop)
		},
		onLoad(option) {
			console.log(option,'携带参数')
			let self = this;
			let template = {
				color: {
					temp_color: '#ff4544',
					none_color: '#8A8B9C'
				}
			}
			self.template = template;
			uni.setStorage({
				key: '__ddminiTemplateConfig',
				data: template
			});
			 if(option.q){
			            //微信扫描扫描二维码进来的
			            let url = decodeURIComponent(option.q)
			            let obj = this.getUrlParam(url)
			            console.log(option.q,'从微信扫码过来obj')
			            console.log(obj.aa)
			 }
			
		},
		onShareAppMessage() {
			let shop = uni.getStorageSync('__ddminiShopInfo');
			return {
				title: shop.shop_share_title || shop.shop_name,
				imageUrl: shop.shop_share_pic || shop.shop_logo,
				path: 'pages/index/index'
			}
		},
		methods: {
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			gophone(phone){
				uni.makePhoneCall({
					phoneNumber: phone //仅为示例
				});
			},
			getbussinessId(){
				let self=this;
				self.Get2('/api/plugs/getBusinessInfo').then(res => {
					if (res.code == 200) {
						let list = res.body;
						let listArr = [];
						list.forEach((item) => {
							listArr.push(JSONBig.parse(item.jsonData))
					    })
						self.BusinessList=listArr;
						self.businessId=self.BusinessList[0].businessId;
						this.initData();
					}
				})
			},
			initData() {
				let self = this;
				self.Get(`/api/plugs/getHomeDataInfo?businessId=${self.businessId}`).then(res => {
					if (res.code == 200) {
						let dict = res.body.jsonViewData;
						self.data1 = dict[0].data;
						self.data2 = dict[1].data;
						// console.log(self.data2,'kkkkkk')
					}
				})

				// let bussinessId = uni.getStorageSync('__shoplistInfo')[0].businessId || 0
				this.Get(`/api/plugs/getShopGoodCategoryList?businessId=${self.businessId}`).then(res => {
					if (res.code == 200) {
						this.categoryList = res.body.list
					}
				})

				self.Get(`/api/plugs/searchPlugsRecommendedList?businessId=${self.businessId}&userServiceToken=ax001`).then(res => {
					if (res.code == 200) {
						let list=res.body.list;
						self.recommendedList = list.filter(itm => itm.type === 'home_data');
						console.log(self.recommendedList,'轮播图99999999999');
					}
				})
			},
			categoryItemTap(index,name) {
				let dict = this.categoryList[index]
				uni.navigateTo({
					url: `/pages/index/category?id=${dict.id}&&name=${name}`
				})
			},

			goodsItemClick(e) {
				let index = e.currentTarget.dataset.index
				let id = this.data2[index].id
				uni.navigateTo({
					url: `/pages/index/detail?id=${id}`
				})
			},
			addToCart(index) {
				let dict = this.data2[index]
				// console.log(dict.categoryId)
				let postData = {
					goodsId: dict.id,
					goodsCategoryId: dict.categoryId,
					goodsNum: 1,
					goodsSpecificationIds: '0'
				};
				this.Post2('/api/plugs/insertPlugsShopCart', postData).then(res => {
					// console.log("insertPlugsShopCart", res)
					if (res.code == 200) {

					}
				})
			},
		}
	}
</script>

<style lang="less">
	.content {
		width: 100%;
		display: flex;
		overflow-x: hidden;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		.common {
			width: 96%;
			border-radius: 16rpx;
			background-color: #fff;
			// box-shadow: 0px 0px 8px 0px rgba(207, 207, 207, 0.5);
		}
		.search {
			width: 100%;
			height: 90rpx;
			background-color: #ff5d32;
			display: flex;
			align-items: center;
			position: relative;
			margin-bottom: 10rpx;
			.inp {
				width: 96%;
				// position: absolute;
				// left: 58%;
				// top: 40rpx;
				text-align: center;
				height: 60rpx;
				margin: auto;
				border-radius: 30rpx;
				background-color: #FFFFFF;
			}
		
			.search-icon {
				position: absolute;
				left: 54%;
				top: 30rpx;
			}
		}
		// .search {
		// 	height: 80rpx;
		// 	background-color: ;
		// 	box-sizing: border-box;
		// 	padding: 10rpx;
		// 	margin: 18rpx auto;
		// 	display: flex;
		// 	align-items: center;
		// 	justify-content: space-between;
		// }

		.swiper {
			width: 96%;
			height: 400rpx;
			border-radius: 16rpx;
			margin-bottom: 18rpx;

			.swiper-box {
				width: 100%;
				height: 400rpx;
			}

			.swiper-img {
				border-radius: 16rpx;
				height: 400rpx;
			}
		}

		.kefu {
			padding: 20rpx;
			box-sizing: border-box;
			.cates{
				height: 352rpx;
				box-sizing: border-box;
				overflow: hidden;
			}
			.category {
				margin-top: 40rpx;
				
				.grid-img {
					margin-top: 20rpx;
				}

				.grid-text2 {
					margin-top: 12rpx;
					font-size: 26rpx;
				}
			}

			// button::after {
			// 	border: 0;
			// }

			// .contactbtn {
			// 	height: 140rpx;
			// 	padding: 0 !important;
			// 	margin: 0 !important;
			// 	position: relative;
			// 	background-color: #fff;
			// }

			.grid-img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 16rpx;
			}

			.grid-text {
				position: absolute;
				padding: 0 !important;
				left: 15rpx;
				bottom: -16rpx;
				display: inline-block;
				width: 70rpx;
				text-align: center;
				// background-color: aqua;
				font-size: 26rpx;
			}
		}

		.recommend {
			width: 96%;
			.hot-title {
				width: 100%;
				display: flex;
				justify-content: space-around;
				margin: 30rpx 0rpx;
				box-sizing: border-box;
				padding: 30rpx;
				text-align: center;
				font-size: 36rpx;
				font-weight: 700;
				.hot-text {
					margin: 0rpx 26rpx;
				}
			}
			.recommend-box {
				width: 100%;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				.goods-block {
					width: 48%;
				}

				.goods-box {
					width: 100%;
					height: 480rpx;
					border-radius: 16rpx;
					box-sizing: border-box;
					background-color: #fff;
					margin-bottom: 26rpx;
					// box-shadow: 0px 0px 8px 0px rgba(207, 207, 207, 0.5);

					.goods-img {
						width: 100%;
						height: 310rpx;
						border-radius: 16rpx 16rpx 0 0;
					}

					.goods-name {
						width: 94%;
						margin: 10rpx auto;
						font-size: 28rpx;
						display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
						-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
						-webkit-line-clamp: 2;  //一个块元素显示的文本的行数
						overflow: hidden; //溢出隐藏
					}

					.goods-price {
						width: 94%;
						margin: auto;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.price {
							color: #ff4544;
							display: flex;
							align-items: center;
							.price-text {
								font-size: 34rpx;
								font-weight: 600;
							}
							.price-right{
								margin-left: 12rpx;
								font-size: 26rpx !important;
								font-weight: 400 !important;
								color: #aaa;
								margin-left: 18rpx;
								text-decoration: line-through;
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
	}
</style>
