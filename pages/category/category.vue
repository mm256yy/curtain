<template>
	<view class="content">
		<view class="search" @click="Topath('/pages/index/search')" >
			<input class="inp" type="text" placeholder="搜索">
			<view class="search-icon">
				<u-icon name="search" size="16"></u-icon>
			</view>
		</view>
		<view class="classify">
			<!-- 分类部分 -->
			<view class="cate-left">
				<view :class="['cate-item',activeIndex==index?'active':'']" v-for="(item,index) in categoryList"
					:key="index" @click="changeActive(index)">{{item.categoryName}}</view>
				<!-- <view :class="['cate-item',activeIndex==index?'active':'']" v-for="(item,index) in 14"
					:key="index" @click="changeActive(index)">窗帘</view> -->
			</view>
			<view class="cate-right">
				<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
					<swiper-item class="swiper-box" v-for="(item,index) in recommendedList" :key="index">
						<image class="swiper-img" :src="item.activityImgUrl" lazy-load="true" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				<view class="cate-content" v-for="(item,index) in goodsArray" :key="index" @click="goodsItemClick"
					:data-index="index">
					<image class="cateImg" :src="item.previewUrl" mode=""></image>
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
							<view class="" @click.stop="getSpec(item.id)" style="width: 50rpx;height: 50rpx;border-radius: 100%;border: 3rpx solid #ff5d32;display: flex;justify-content: center;align-items: center;">
								<u-icon name="shopping-cart-fill" color="#ff4544" size="28" ></u-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="bottom-box"></view>
			</view>
			<!-- <tabbar :current="1"></tabbar> -->
		</view>
	</view>
</template>

<script>
	import JSONBig from 'json-bigint'
	export default {
		data() {
			return {
				scrollTop: 0,
				// 当前点击项的索引号
				activeIndex: 0,
				// 分类下的商品信息
				// goodList: [],
				categoryList: [],
				goodsArray: [],
				BusinessList:'',
				businessId:'',
				recommendedList:[],
				orderPage: {
					page: 1,
					sizes: 10,
					total: 0
				},
			};
		},
		onShow() {
			// this.getbussinessId()
		},
		onLoad() {
			this.getbussinessId()
		},
		onReachBottom() {
			let self = this;
			if(self.orderPage.total>self.orderPage.page){
				self.orderPage.page++;
				self.getGoodsArray();
			}
		},
		methods: {
			getSpec(id){
				let self=this;
				self.Get('/api/plugs/searchPlugsGoodsSpecificationByGoodsId',{goodsId:id}).then(res => {
					if (res.code == 200) {
						let datas=res.body;
						self.spectionList=datas.plugsGoodsSpecificationList;
						self.SpecList=datas.plugsGoodsSpecificationList;
						let list6=JSON.parse(JSON.stringify(self.SpecList))
						self.SpecList2=list6
						let specifications1 = []
						let tempSpecifications = datas.specificationInfo;
						for (let item of tempSpecifications) {
							let obj1 = {
								start:0,
								name:Object.keys(item)[0],
								children: Object.values(item)[0]
							}
							specifications1.push(obj1)
						}
						this.specifications = specifications1;
						let arr=[]
						let arr2=[]
						this.specifications.forEach(item=>{
							arr.push(item.name)
							arr2.push(item.children[0].attributeValue)
						})
						let obj6={}
						for (let i=0;i<arr.length;i++){
							obj6[arr[i]]=arr2[i]
						}
						self.selectSpec=obj6;
						let j2=JSON.stringify(obj6)
						self.sepcInfo=self.SpecList2.find(item=> item.specificationName===j2+'')
						self.nowspecInfo=self.changeText(self.sepcInfo.specificationName)
						let price1 = 0
						let stockNum1 = 0
						let count = 0
						for (let key in this.specifications) {
							let dict = this.specifications[key]['children'][0]
							this.goodsImage = dict.specificationImages
							let dict2 = this.specifications[key]
							let start = dict2.start
							let children = dict2.children
							price1 += children[start].dealPrice
							stockNum1 += children[start].stockNum
							count++
						}
						this.dealPrice = price1
						this.stockNum = Math.ceil(stockNum1 / count)
					}
				})
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
						self.businessId=self.BusinessList[0].businessId
						this.initData();
						self.goodsArray=[]
						self.getGoodsArray();
					}
				})
			},
			initData() {
				let self=this;
				// console.log(self.businessId)
				let bussinessId = self.businessId
				this.Get(`/api/plugs/getShopGoodCategoryList?businessId=${bussinessId}`).then(res => {
					// console.log("getShopGoodCategoryList", res)
					if (res.code == 200) {
						this.categoryList = res.body.list
						if (this.categoryList.length > 0) {
							let id = this.categoryList[0].id
							// this.getGoodsArray(id)
							self.changeActive(0)
						}
					} else {
						uni.showToast({
							title: '加载数据失败',
							duration: 1000,
							icon: 'none'
						})
					}
				})
				self.Get(`/api/plugs/searchPlugsRecommendedList?businessId=${bussinessId}&userServiceToken=ax001`).then(res => {
					if (res.code == 200) {
						let list=res.body.list;
						self.recommendedList = list.filter(itm => itm.type === 'cateOne');
						// console.log(self.recommendedList,'分类列表')
					}
				})
			},
			
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			//更改点击项的索引号
			changeActive(i) {
				let self=this;
				self.activeIndex = i
				self.goodsArray=[]
				self.getGoodsArray()
			},
			getGoodsArray() {
				let self=this;
				let index=self.activeIndex;
				let list=self.categoryList;
				let postdata={
					page:self.orderPage.page,
					size:10,
					categoryId:0
				}
				postdata.categoryId=list[index].id;
				self.Get('/api/plugs/searchPlugsGoodsByCategoryId',postdata).then(res => {
					if (res.code == 200) {
						let data=res.body;
						self.orderPage.total = data.pages;
						let data2 = res.body.list;
						if(data.pages>1){
							let list2 = self.goodsArray.concat(data2);
							self.goodsArray = list2;
						}else{
							self.goodsArray = data2;
						}
					}
				})
			},
			goodsItemClick(e) {
				let index = e.currentTarget.dataset.index
				let id = this.goodsArray[index].id

				uni.navigateTo({
					url: `/pages/index/detail?id=${id}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.swiper {
		margin-top: 10rpx;
		width: 100%;
		height: 220rpx;
		border-radius: 16rpx;
		margin-bottom: 18rpx;
	
		.swiper-box {
			width: 100%;
			height: 220rpx;
		}
	
		.swiper-img {
			border-radius: 16rpx;
			height: 220rpx;
		}
	}
	.content {
		position: relative;

		.search {
			width: 100%;
			height: 90rpx;
			background-color: #ff5d32;
			display: flex;
			align-items: center;
			position: relative;

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
	}

	.classify {
		background-color: #fff;
		// margin-top: 80rpx;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-between;

		.cate-left {
			width: 240rpx;
			height: 93vh;
			overflow: auto;
			background-color: #F6F6F6;

			.cate-item {
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				padding-left: 30rpx;
				box-sizing: border-box;
				// border-bottom: 5rpx solid #fff;
			}

			.active {
				background-color: #FFFFFF;
				position: relative;
				padding-left: 30rpx;
				color: #ff5d32;
				box-sizing: border-box;

				&::before {
					content: '';
					display: block;
					width: 5rpx;
					border-radius: 6rpx;
					height: 50rpx;
					background-color: #ff5d32;
					position: absolute;
					left: 5rpx;
					top: 30rpx;
				}
			}
		}

		.cate-right {
			width: 80%;
			height: 90vh;
			box-sizing: border-box;
			padding: 0rpx 20rpx;
			overflow: auto;

			// display: flex;
			// justify-content: space-between;
			// flex-wrap: wrap;
			.bottom-box {
				width: 100%;
				height: 130rpx;
			}

			.cate-content {
				width: 100%;
				height: 160rpx;
				
				margin-top: 30rpx;
				// border-radius: 8rpx;
				display: flex;
				// border-bottom: 3rpx solid #e9e9e9;
				justify-content: space-between;
				.cateImg{
					border-radius: 16rpx;
				}
				// box-shadow:0 0 10rpx rgba(0, 0, 0, 0.2);
				.conten-right {
					width: 60%;
					height: 100%;
					display: flex;
					box-sizing: border-box;
					flex-direction: column;
					justify-content: space-between;
					// padding-bottom: 10rpx;
				}

				.goodsname {
					width: 100%;
					padding: 6rpx 16rpx;

					.name {
						width: 86%;
						font-size: 30rpx;
						// white-space: nowrap;
						// overflow: hidden;
						// text-overflow: ellipsis;
						display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
						-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
						-webkit-line-clamp: 2; //一个块元素显示的文本的行数
						overflow: hidden; //溢出隐藏
					}

					.paynum {
						color: #93a1a1;
						font-size: 24rpx;
						margin-top: 20rpx;
						margin-bottom: 0rpx;
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
					width: 160rpx;
					height: 160rpx;
					box-sizing: border-box;
					// border-radius: 8rpx 8rpx 0 0;
				}
			}
		}
	}
</style>
