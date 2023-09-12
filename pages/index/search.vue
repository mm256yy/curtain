<template>
	<view class="content">
		<view class="header">
			<view class="search">
				<view class="aicon">
					<u-icon name="search" color="#999" size="20"></u-icon>
				</view>
				<input type="text" v-model="keywords" placeholder="搜索您想要的商品" placeholder-style="color:#999;" confirm-type="search" @confirm="searchHotKeywords(keywords)" />
				<!-- <aicon class="close" v-if="keywords" @click="closeSearchTap()" type="roundclosefill" size="26" :color="template.color.temp_color"></aicon> -->
				<view class="close">
						<u-icon v-if="keywords" @click="closeSearchTap()" name="close-circle-fill" color="#e65600" size="24"></u-icon>
				</view>
			</view>
		</view>
		<view class="hishory" v-if="hishoryList.length>0 || hotKeywordsList.length>0">
			<view v-if="hishoryList.length>0" class="label" style="margin-bottom: 10rpx;">
				<view class="title">最近搜索 <icon class="shanchu" type="shanchu" size="16" color="#999" @click="delHishoryTap()"></icon></view>
				<view class="list">
					<view class="text" v-for="(item, index) in hishoryList" :key="index" @click="searchHotKeywords(item)">{{item}}</view>
				</view>
			</view>
			<view v-if="hotKeywordsList.length>0" class="label">
				<view class="title">热门搜索</view>
				<view class="list">
					<view class="text" :style="keywords==item?'background-color:'+template.color.temp_color+';color:#fff':''" v-for="(item, index) in hotKeywordsList" :key="index" @click="searchHotKeywords(item)">{{item}}</view>
				</view>
			</view>
		</view>
		<!-- <view class="goods_list">
			<view class="goods" v-for="(item, index) in goodsList" :key="index" @click="getPathTap('/pages/index/details?id='+item.id)">
				<view class="image">
					<image :src="item.productDetailsImg" mode="aspectFill"></image>
				</view>
			</view>
		</view> -->
		
		<view class="recommend-box">
			<view class="goods-block" v-for="(item,index) in goodsList" :key="index"
				@click="Topath(`/pages/index/detail?id=${item.id}`)">
				<view class="goods-box">
					<image class="goods-img" :src="item.previewUrl" mode=""></image>
					<!-- <image class="goods-img" :src="item.preview_url" mode=""></image> -->
					<view class="goods-name">
						{{item.goodsName}}
					</view>
					<view class="goods-price">
						<view class="price">
							<text>￥</text>
							<text class="price-text">{{item.goodsPrice}}</text>
						</view>
						<view class="price-right">
							<text>￥</text>
							<text>{{item.scribePrice}}</text>
						</view>
						<!-- <u-icon name="shopping-cart" color="#ff4544" size="28"></u-icon> -->
					</view>
					<view class="month_sales">
						月销量:{{item.monthSales}}
					</view>
				</view>
			</view>
		</view>
		<view class="none_list_box" v-if="goodsList.length===0">
			<image src="../../static/images/none_data_icon_01.png" mode="widthFix"></image>
			<span>商品正在上新中</span>
		</view>
		<backtop ref="VT" :scrollTop="top"></backtop>
	</view>
</template>
<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				openStoreStatus: true,
				keywords: '',
				goodsList: [],
				hishoryList: [],
				top:0,
				hotKeywordsList: [],
			}
		},
		onLoad(e) {
			let self = this;
			let hishory = uni.getStorageSync('__ddminiHishoryList');
			if(hishory){
				self.hishoryList = hishory;
			}
		},
		onPageScroll(e) {
			this.$refs.VT.topData(e.scrollTop)
		},
		methods: {
			closeSearchTap() {
				this.keywords = '';
				this.getGoodsList();
			},
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			delHishoryTap() {
				this.hishoryList = [];
				uni.removeStorageSync('__ddminiHishoryList');
			},
			searchHotKeywords(key) {
				let self = this;
				let data = self.hishoryList;
				let number = 0;
				data.forEach(res => {
					if(res == key){
						number = 1;
					}
				})
				if(number===0){
					self.hishoryList.push(key);
					uni.setStorage({key: '__ddminiHishoryList',data: self.hishoryList});
				}
				self.keywords = key;
				self.getGoodsList();
			},
			getGoodsList() {
				let self = this;
				let postData = {
					page: 1,
					size: 50,
					userServiceToken:'ax001'
				};
				if(self.keywords){
					postData.keyword = self.keywords;
				}
				self.Get('/api/plugs/goodSearch', postData).then(res => {
					
					if(res.code === 200){
						
						self.goodsList = res.body.list;
						console.log(self.goodsList,'商品列表')
					}
				})
			},
			getMemberPriceTap(data){
				let self = this;
				let user = self.userInfoData;
				if(user.level_id){
					let money = data.vip_price.find(itm => itm.id === user.level_id);
					return money.price;
				}else{
					let array = data.vip_price.map(itm => {return itm.price});
					let money = Math.max(...array);
					return money;
				}
			},
			getPathTap(path){
				app.globalData.getPathTap(path);
			},
			getAddCartTap(data){
				let self = this;
				if(data.specs_status){
					self.getPathTap('/pages/index/details?id='+data.id);
					return
				}else{
					if(data.pintuan_id || data.ctype==='score'){
						self.getPathTap('/pages/index/details?id='+data.id);
						return
					}
					let postData = {
						id: data.id,
						number: 1
					}
					self.Get(self.Url.cartAdd, postData).then(res => {
						if(res.code === 0){
							uni.showToast({title: '已加入购物车'});
						}
					})
				}
			}
		}
	}
</script>

<style lang="less">
	page{
		background-color: #fff;
	}
	.recommend-box {
		width: 96%;
		margin: auto;
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
			box-shadow: 0px 0px 8px 0px rgba(207, 207, 207, 0.5);
	
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
				// justify-content: space-between;
	
				.price {
					color: #ff4544;
	
					.price-text {
						font-size: 34rpx;
						font-weight: 600;
					}
					
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
			.month_sales{
				width: 94%;
				margin: auto;
				font-size: 22rpx;
				color: #aaa;
			}
		}
	}
	.header{
		position: sticky;
		top: 0;
		width: 100%;
		height: 90rpx;
		background-color: #ff5d32;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		z-index: 100;
		border-bottom: 1px solid #f5f5f5;
		.search{
			display: flex;
			align-items: center;
			width: 90%;
			margin: 0 auto;
			background-color: #f2f2f2;
			height: 70rpx;
			border-radius: 100rpx;
			position: relative;
			.aicon{
				margin-left: 20rpx;
			}
			input{
				width: 80%;
				height: 100%;
				padding-left: 16rpx;
				color: #333;
				font-size: 28rpx;
			}
			.close{
				position: absolute;
				right: 20rpx;
			}
		}
	}
	.hishory{
		width: 90%;
		margin: 0 auto;
		padding: 40rpx 0;
		.label{
			position: relative;
			.shanchu{
				position: absolute;
				right: 0;
			}
			.title{
				color: #999;
				font-size: 24rpx;
			}
			.list{
				display: flex;
				flex-wrap: wrap;
				.text{
					background-color: #e2e2e2;
					color: #666;
					padding: 6rpx 24rpx;
					font-size: 24rpx;
					border-radius: 100rpx;
					margin: 20rpx 0;
					margin-right: 20rpx;
				}
			}
		}
	}
	.goods_list{
		width: 92%;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.goods{
			flex-basis: 48%;
			margin-bottom: 30rpx;
			.image{
				image{
					width: 100%;
					height: 280rpx;
					border-top-left-radius: 20rpx;
					border-top-right-radius: 20rpx;
				}
			}
			.info{
				border: 1px solid #efefef;
				border-top: none;
				border-bottom-left-radius: 20rpx;
				border-bottom-right-radius: 20rpx;
				padding: 20rpx 0;
				min-width: 0;
				.title{
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color: #1f1f1f;
					font-size: 28rpx;
					width: 90%;
					margin: 0 auto;
					max-width: 300rpx;
					span{
						background-color: #F54319;
						color: #fff;
						padding: 0 6rpx;
						border-radius: 6rpx;
						font-size: 24rpx;
						margin-right: 10rpx;
					}
				}
				.box{
					width: 90%;
					margin: 0 auto;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-top: 10rpx;
					.left{
						flex: 1;
						min-width: 0;
						min-height: 82rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						.price{
							color: #F54319;
							font-size: 30rpx;
							span{
								color: #999;
								font-size: 26rpx;
								text-decoration: line-through;
								margin-left: 10rpx;
							}
						}
						.vip{
							color: #1f1f1f;
							font-size: 28rpx;
							display: flex;
							align-items: center;
							padding-top: 6rpx;
							span{
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
						.tuan{
							span{
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
					.right{
						aicon{
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
</style>
