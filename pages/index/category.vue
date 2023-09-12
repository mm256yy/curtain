<template>
	<view class="content">
		<view class="search" @click="Topath('/pages/index/search')" >
			<input class="inp" type="text" placeholder="搜索">
			<view class="search-icon">
				<u-icon name="search" size="16"></u-icon>
			</view>
		</view>
		<view class="cate-right">
			<view class="cate-content" v-for="(item,index) in dataArray" :key="index" @tap="goodsItemClick"
				:data-index="index">
				<image :src="item.previewUrl" mode=""></image>
				<view class="conten-right">
					<view class="goodsname">
						<view class="name">{{item.goodsName}}</view>
						<!-- <view class="paynum">销量:{{item.totalSales}}</view> -->
					</view>
					<view class="goodsprice">
						<view class="price">
							<view>
								<text>￥</text>
								<text class="price-text">{{item.goodsPrice}}</text>
							</view>
							<view class="old-price">
								￥{{item.scribePrice}}
							</view>
						</view>
						<!-- <u-icon name="shopping-cart" color="#ff4544" size="28"></u-icon> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				id: '',
				template: '',
				dataArray: [],
				orderPage: {
					page: 1,
					sizes: 10,
					total: 0
				},
			}
		},
		onLoad(options) {
			// console.log(options,'ggggggggggg')
			let self = this;
			let name=options.name
			uni.setNavigationBarTitle({
				title:name
			})
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

			if (options.id != null) {
				this.id = options.id
			}
			self.orderPage.page = 1;
			self.dataArray=[];
			this.initData()
		},
		onShareAppMessage() {
			let shop = uni.getStorageSync('__ddminiShopInfo');
			return {
				title: shop.shop_share_title || shop.shop_name,
				imageUrl: shop.shop_share_pic || shop.shop_logo,
				path: 'pages/index/index'
			}
		},
		onReachBottom() {
			let self = this;
			if(self.orderPage.total>self.orderPage.page){
				self.orderPage.page++;
				self.initData();
			}
		},
		methods: {
			Todetail() {
				uni.navigateTo({
					url: '/pages/index/detail'
				})
			},
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			goodsItemClick(e) {
				let index = e.currentTarget.dataset.index
				let id = this.dataArray[index].id
				uni.navigateTo({
					url: `/pages/index/detail?id=${id}`
				})
			},

			initData() {
				let self = this;

				self.Get(`/api/plugs/searchPlugsGoodsByCategoryId?page=1&categoryId=${this.id}`).then(res => {

					if (res.code == 200) {
						self.orderPage.total = res.body.pages;
						let data = res.body.list;
						if(self.dataArray.length>0){
							let list = self.dataArray.concat(data);
							self.dataArray = list;
						}else{
							self.dataArray = data;
						}
					}
				})
			},
		}
	}
</script>

<style lang="less">
	page {
		background-color: #FFFFFF;
	}

	.content {
		width: 100%;
		position: relative;
		padding-bottom: 30rpx;

		.search {
			width: 100%;
			height: 90rpx;
			background-color: #ff5d32;
			display: flex;
			align-items: center;
			position: fixed;
			top: 0;
			left: 0;

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

		.cate-right {
			margin-top: 100rpx;
			width: 100%;
			box-sizing: border-box;
			padding: 0rpx 20rpx;
			overflow: auto;

			.cate-content {
				width: 100%;
				height: 220rpx;
				margin-top: 30rpx;
				display: flex;
				border-bottom: 3rpx solid #e9e9e9;
				justify-content: space-between;

				.conten-right {
					height: 100%;
					display: flex;
					width: 72%;
					box-sizing: border-box;
					flex-direction: column;
					justify-content: space-between;
					padding-bottom: 10rpx;
					background-color: #FFFFFF;
				}

				.goodsname {
					width: 100%;
					padding: 6rpx 16rpx;

					.name {
						width: 90%;
						font-size: 30rpx;
						// white-space: nowrap;
						// overflow: hidden;
						// text-overflow: ellipsis;
						display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
						-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
						-webkit-line-clamp: 2; //一个块元素显示的文本的行数
						overflow: hidden; //溢出隐藏
						margin-bottom: 20rpx;
					}

					.paynum {
						color: #93a1a1;
						font-size: 24rpx;
						margin-bottom: 18rpx;
						
					}
				}

				.goodsprice {
					width: 100%;
					box-sizing: border-box;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 6rpx 16rpx;

					.price {
						color: #ff4544;
						display: flex;
						align-items: center;
						.price-text {
							font-size: 34rpx;
							font-weight: 600;
						}

						.old-price {
							color: #93a1a1;
							font-size: 24rpx;
							margin-left: 16rpx;
							text-decoration: line-through;
						}
					}

					image {
						width: 40rpx;
						height: 40rpx;
					}
				}

				image {
					width: 200rpx;
					height: 200rpx;
					box-sizing: border-box;
					border-radius: 16rpx;
					// border-radius: 8rpx 8rpx 0 0;
				}
			}
		}
	}
</style>
