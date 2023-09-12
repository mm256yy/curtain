<template>
	<view class="content">
		<!-- 	<view class="login-top"
			:style="{backgroundImage: 'url('+imageURL+')', 'background-repeat':'no-repeat', backgroundSize:'100% 100%'}"> -->
		<view class="login-top">
			<view class="login">
				<template v-if="ddminiUserInfo.accessToken == null">
					<view class="login-left">
						<image class="avatar" src="../../static/images/avatar.png" mode=""></image>
						<view class="login-now" @tap="Topath('/pages/user/login')">
							立即登录
						</view>
					</view>
				</template>
				<template v-else>
					<view class="login-left">
						<image class="avatar" :src="userInfo.headImg" mode=""></image>
						<view >
							<view style="font-weight:500;">昵称</view>
							<view>{{userInfo.userName}}</view>
							
						</view>
					</view>
				</template>
				<view class="login-right" @click="Topath('/pages/user/addressList')">
					<u-icon name="map" color="#fff" size="18"></u-icon>
					<view>
						收货地址
					</view>
				</view>
			</view>
			<view class="collect">
				<view class="my-collect">
					<!-- <view class="collect-num">
						0
					</view> -->
					<view class="collect-text" @click="Topath('/pages/user/collect')">
						<u-icon name="star-fill" color="#fff" size="21"></u-icon>
						<text>我的收藏</text>
					</view>
				</view>
				<view class="line"></view>
				<view class="my-collect">
					<!-- <view class="collect-num">
						0
					</view> -->
					<view class="collect-text" @click="Topath('/pages/user/footmark')">
						<image style="width: 60rpx;height: 60rpx;" src="../../static/images/zuji.png" mode=""></image>
						<text>我的足迹</text>
					</view>
				</view>
			</view>
		</view>
		<view class="order common">
			<view class="order-title">
				<view class="my-order">我的订单</view>
				<view class="more" @click="Topath('/pages/order/order')" >
					查看更多
					<u-icon name="arrow-right" size="14"></u-icon>
				</view>
			</view>
			<u-grid :border="false" col="5">
				<u-grid-item v-for="(item,index) in orderIcon" :key="index" @click="Topath(`/pages/order/order?id=${index}`)">
					<image class="grid-img" style="width: 60rpx;height: 60rpx;" :src="item.img" lazy-load="true"
						mode=""></image>
					<text class="grid-text">{{item.title}}</text>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="menu common">
			<view class="menu-title">
				菜单栏
			</view>
			<view class="removeStorge" @click="ClearStorget()">
				<view class="removeStorge-left">
					<image class="remove-img" src="../../static/images/remove.png" mode=""></image>
					<view class="remove-text">清除缓存</view>
				</view>
				<view>
					<u-icon name="arrow-right" size="14"></u-icon>
				</view>
			</view>
		</view>
		<!-- <tabbar :current="3"></tabbar> -->
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				orderIcon: [
				{
					img: '../../static/images/oderIcon/fukuan.png',
					title: '待付款'
				}, {
					img: '../../static/images/oderIcon/fahuo.png',
					title: '待发货'
				}, {
					img: '../../static/images/oderIcon/shouhuo.png',
					title: '待收货'
				}, {
					img: '../../static/images/oderIcon/wan.png',
					title: '已完成'
				},{img: '../../static/images/oderIcon/shouhou.png',
					title: '售后/退款'
				}],
				wxCode: '',
				ddminiUserInfo:'',
				userInfo:'',
			}
		},
		onLoad() {
			// console.log("__ddminiUserInfo", JSON.stringify(this.ddminiUserInfo))
		},
		
		onShow() {
			let self=this;
			self.ddminiUserInfo = uni.getStorageSync('__ddminiUserInfo');
			if(self.ddminiUserInfo.accessToken!=null){
				self.getInfo();
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
			ClearStorget() {
				let self=this;
				uni.showModal({
					title: '提示',
					content: '确定要清除缓存吗?',
					success: function(res) {
						if (res.confirm) {
							uni.removeStorage({
								key: '__ddminiUserInfo',
								// success: () => {
								// 		setTimeout(() => {
								// 			this.$router.go(0)
								// 		}, 500)
								// }
							});
							uni.navigateTo({
								url:'/pages/user/login'
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
			getInfo(){
				let self=this;
				let id=self.ddminiUserInfo.id
				self.Get('/api/user/searchUserInfoById',{userId:id}).then(res=>{
					if(res.code==200){
						self.userInfo=res.body;
						// console.log(res,'用户信息')
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
		flex-direction: column;
		align-items: center;
		position: relative;

		.common {
			width: 96%;
			border-radius: 16rpx;
			background-color: #fff;
			box-shadow: 0px 0px 16rpx 0px rgba(207, 207, 207, 0.5);
		}

		.login-top {
			color: #fff;
			width: 100%;
			height: 500rpx;
			background-image: linear-gradient(#ff5e31, #ff4a31, #faa390, #f7e5df);

			// border-bottom: 3rpx dashed #000;
			.login {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 50rpx;
				padding-left: 20rpx;
				box-sizing: border-box;
				color: #fff;

				.login-left {
					display: flex;
					align-items: center;

					.avatar {
						width: 120rpx;
						height: 120rpx;
						margin-right: 20rpx;
						border-radius: 50%;
					}

					.login-now {
						height: 60rpx;
						width: 160rpx;
						text-align: center;
						line-height: 60rpx;
						border: 3rpx solid #fff;
						border-radius: 30rpx;
					}
				}

				.login-right {
					display: flex;
					align-items: center;
					height: 60rpx;
					width: 160rpx;
					border: 3rpx solid #fff;
					border-right: none;
					padding-left: 6rpx;
					border-radius: 30rpx 0 0 30rpx;
				}
			}

			.collect {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 30rpx;
				padding: 0 60rpx;
				box-sizing: border-box;
				font-size: 32rpx;

				.collect-text {
					display: flex;
					align-items: center;
				}

				.collect-num {
					text-align: center;
					margin-bottom: 30rpx;
				}

				.line {
					width: 3rpx;
					height: 80rpx;
					background-color: #fff;
				}
			}
		}

		.order {
			height: 210rpx;
			padding: 18rpx;
			box-sizing: border-box;
			margin-top: -110rpx;

			.order-title {
				display: flex;
				justify-content: space-between;
				margin-bottom: 30rpx;

				.my-order {
					font-size: 32rpx;
					font-weight: 600;
					font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
				}

				.more {
					display: flex;
					align-items: center;
					color: #9a9a9a;
				}
			}

			.grid-text {
				margin-top: 10rpx;
				font-size: 26rpx;
				color: #9a9a9a;
			}
		}

		.score {
			display: flex;
			justify-content: space-around;
			padding: 20rpx 10rpx;
			box-sizing: border-box;
			margin: 30rpx auto;

			.cardNum {
				text-align: center;
				font-size: 36rpx;
				font-weight: 600;
				margin-bottom: 20rpx;
			}

			.card-img {
				display: flex;
				align-items: center;
				color: #9a9a9a;
				font-size: 26rpx;

				image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 4rpx;
				}
			}
		}

		.menu {
			padding: 18rpx;
			box-sizing: border-box;
			margin: 30rpx auto;

			.menu-title {
				margin-bottom: 26rpx;
				font-size: 32rpx;
				font-weight: 600;
				font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
			}

			.removeStorge {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.removeStorge-left {
					width: 200rpx;
					display: flex;
					align-items: center;

					.remove-img {
						width: 60rpx;
						height: 60rpx;
						margin-right: 16rpx;
					}

					.remove-text {
						white-space: nowrap;
						font-size: 32rpx;
						color: #9a9a9a;
					}
				}
			}
		}
	}
</style>
