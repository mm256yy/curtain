<template>
	<view class="contentSub">
		<!-- 规格选择弹窗 start -->
		<u-popup :show="shows" mode="bottom" @close="close" @open="open" closeable="true" closeIconPos="top-right">
			<view class="Specifications">
				<view class="Specifications-mask"></view>
				<view class="Specifications-popup">
					<view class="Specifications-popup-colse cuIcon-roundclose" @click="shows=false">
						<u-icon name="close-circle" size="28"></u-icon>
					</view>
					<view class="Specifications-popup-head">
						<view class="Specifications-popup-head-img">
							<image mode="aspectFill" :src="sepcInfo.specificationImages"></image>
						</view>
						<view class="Specifications-popup-head-text">
							<view class="Specifications-popup-head-text-price"><label
									for="">¥</label><text>{{sepcInfo.dealPrice}}</text>
							</view>
							<view class="Specifications-popup-head-text-spec">
								已选:{{nowspecInfo}}
							</view>
							<view class="Specifications-popup-head-text-parameter">
								<text>库存:{{sepcInfo.stockNum}}</text>
							</view>
						</view>
					</view>
					<scroll-view scroll-y class="Specifications-huadong">
						<view class="Specifications-popup-sele" v-for="(item,index) in specifications" :key="index">
							<view class="Specifications-popup-sele-name">{{item.name}}</view>
							<view class="Specifications-popup-sele-list">
								<text :class=" item.start == index2 ?'rmoiu':'' " @click="morloe(index,index2)"
									v-for="(item2,index2) in item.children"
									:key="index2">{{item2.attributeValue}}</text>
							</view>
						</view>
					</scroll-view>
					<view class="Specifications-popup-munbar">
						<view class="Specifications-popup-munbar-name">购买数量</view>
						<view class="redmunber">
							<wm-numberBox model="2"></wm-numberBox>
							<u-number-box v-model="value" :min="1" :max="goodsDict.limitNum">
								<view slot="minus" class="minus">
									<u-icon name="minus-circle" size="20"></u-icon>
								</view>
								<text slot="input" style="width: 50rpx;text-align: center;"
									class="input">{{value}}</text>
								<view slot="plus" class="plus">
									<u-icon name="plus-circle" color="#ff5d32" size="20"></u-icon>
								</view>
							</u-number-box>
						</view>
					</view>
					<view class="Specifications-popup-but">
						<label class="label2 buy1" @click="Jumpgwc">加入购物车</label>
						<label class="label2 addcart2" @click="lijiGoumai">立即购买</label>
					</view>
				</view>
			</view>
		</u-popup>
		<!-- 规格选择弹窗 end -->
	</view>

</template>

<script>
	export default {
		name: "specpopup",
		props: {
			goodsDict: {},
			specifications: {},
			shows:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				shows: false,
				value: 1,
				goodsImage: "",
				dealPrice: 0,
				stockNum: 0
			}
		},
		mounted() {
			let price1 = 0
			let stockNum1 = 0
			let count = 0
			for (let key in this.specifications) {
				let dict = this.specifications[key]['children'][0]
				this.goodsImage = dict.specificationImages;
				let dict2 = this.specifications[key];
				let start = dict2.start;
				let children = dict2.children;
				price1 += children[start].dealPrice;
				stockNum1 += children[start].stockNum;
				count++
			}
			this.dealPrice = price1
			this.stockNum = Math.ceil(stockNum1 / count)
		},
		methods: {

			morloe(key, index2) {
				let dict = this.specifications[key].children[index2]
				this.specifications[key]['start'] = index2
				this.goodsImage = dict.specificationImages
				let price1 = 0
				let stockNum1 = 0
				let count = 0
				for (let key in this.specifications) {
					// console.log(this.specifications[key])
					let dict2 = this.specifications[key]
					let start = dict2.start
					let children = dict2.children
					price1 += children[start].dealPrice
					stockNum1 += children[start].stockNum
					count++
				}

				this.dealPrice = price1
				this.stockNum = Math.ceil(stockNum1 / count)

				console.log(dict, key, index2)
			},
			open() {},
			close() {
				this.shows = false
			},
			Jumpgwc() {
				this.shows = false

				let goodsSpecificationIds = []
				for (let key in this.specifications) {
					let dict2 = this.specifications[key]

					let start = dict2.start
					let children = dict2.children

					goodsSpecificationIds.push(children[start].id)
				}

				let postData = {
					goodsId: this.goodsDict.id,
					goodsCategoryId: this.goodsDict.categoryId,
					goodsNum: this.value,
					goodsSpecificationIds: goodsSpecificationIds.toString()
				};

				// console.log(postData)

				this.Post2('/api/plugs/insertPlugsShopCart', postData).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: '加入成功',
							duration: 1000,
							icon: 'success'
						})
					} else {
						uni.showToast({
							title: '加入失败',
							duration: 1000,
							icon: 'error'
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.Specifications {
		width: 100%;
		position: fixed;
		background-color: #fff;
		bottom: 0px;
		left: 0px;
		z-index: 999;
	}
	
	.Specifications-mask {
		width: 100%;
		height: auto;
		position: fixed;
		top: 0rpx;
		bottom: 0rpx;
		left: 0rpx;
		right: 0rpx;
		margin: 0rpx auto;
		background: rgba(0, 0, 0, 0.4);
		z-index: 1000;
	}
	
	.Specifications-popup {
		width: 100%;
		height: auto;
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		right: 0rpx;
		z-index: 1001;
		background: #fff;
		border-radius: 10rpx 10rpx 0rpx 0rpx;
	}
	
	.Specifications-popup-colse {
		position: absolute;
		top: 12rpx;
		right: 14rpx;
		font-size: 30rpx;
		color: #999;
		z-index: 1002;
	}
	
	.Specifications-popup-head {
		width: 94%;
		height: auto;
		margin: 0rpx auto;
		border-bottom: 3rpx #eee solid;
		display: flex;
		flex-direction: row;
		padding: 20rpx 0rpx;
	}
	
	.Specifications-popup-head-img {
		width: 25%;
	}
	
	.Specifications-popup-head-img image {
		width: 100%;
		height: 200rpx;
		border: 3rpx #eee solid;
		display: block;
	}
	
	.Specifications-popup-head-text {
		width: 75%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding-left: 3%;
		justify-content: space-around;
	}
	.Specifications-popup-head-text-spec{
		color: #000;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.Specifications-popup-head-text-name {
		font-size: 32rpx;
		font-weight: bold;
		width: 90%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #444;
	}
	
	.Specifications-popup-head-text-price {
		display: flex;
		flex-direction: row;
		color: #ff5d32;
		font-weight: 600;
		display: table-cell;
		vertical-align: bottom;
	}
	
	.Specifications-popup-head-text-price label {
		font-size: 24rpx;
		font-weight: bold;
		margin-right: 2%;
	}
	
	.Specifications-popup-head-text-price text {
		font-size: 36rpx;
	}
	
	.Specifications-popup-head-text-parameter {
		font-size: 26rpx;
		color: #888;
	}
	
	.Specifications-popup-head-text-parameter text {
		margin-right: 3%;
	}
	
	.Specifications-huadong {
		width: 100%;
		max-height: 600rpx;
		padding-top: 20rpx;
	}
	
	.Specifications-popup-sele {
		width: 100%;
		height: auto;
		box-sizing: border-box;
		padding: 0rpx 3%;
	}
	
	.Specifications-popup-sele-name {
		width: 100%;
		height: auto;
		font-size: 30rpx;
		color: #333;
		margin-bottom: 30rpx;
		margin-top: 30rpx;
	}
	
	.Specifications-popup-sele-list {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	
	.Specifications-popup-sele-list text {
		color: #131315;
		margin: 0rpx 0%;
		border-radius: 16rpx;
		text-align: center;
		box-sizing: border-box;
		min-width: 20%;
		// border: 3rpx #cdcdcd solid;
		background-color: #f2f2f4;
		margin-bottom: 30rpx;
		font-size: 24rpx;
		line-height: 50rpx;
		padding: 6rpx 2%;
		margin-right: 3%;
	}
	
	.Specifications-popup-munbar {
		width: 100%;
		height: auto;
		box-sizing: border-box;
		padding:0 5%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 100rpx;
		margin-top: 30rpx;
	}
	
	.Specifications-popup-but {
		width: 100%;
		height: auto;
		display: flex;
		justify-content: space-between;
		padding: 20rpx 3%;
		box-sizing: border-box;
		border-top: 3rpx #eee solid;
	
		.addcart {
			background-color: #ff5d32;
		}
	
		.buy {
			background-color: #ff5d32;
		}
	}
	
	.Specifications-popup-but{
		.label{
			text-align: center;
			border-radius: 80rpx;
			color: #fff;
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
		}
		.label2{
			text-align: center;
			color: #fff;
			width:50%;
			height: 80rpx;
			line-height: 80rpx;
		}
		.buy1{
			// background-color: #f49b08;
			border: 3rpx solid #ff5d32;
			border-radius: 80rpx 0 0 80rpx;
			color: #ff5d32  !important;
		}
		.addcart2{
			height: 86rpx !important;
			background-color:#ff5d32;
			border-radius: 0 80rpx 80rpx 0;
		}
	}
	
	.none {
		bottom: -100%;
	}
	
	.none .Specifications-popup {
		bottom: -100%;
		transition: all 0.5s;
	}
	
	.none .Specifications-mask {
		display: none;
		transition: all 0.5s;
	}
	
	
	.show {
		bottom: 0px;
	}
	
	.show .Specifications-popup {
		bottom: 0%;
		transition: all 0.5s;
	}
	
	.show .Specifications-mask {
		display: block;
		transition: all 0.5s;
	}
	
	.rmoiu {
		// background: #f49e0e;
		// border: 3rpx solid #f49e0e !important;
		// color: #fff !important;
		// background: #ff5251;
		background-color:#f6d8d0 !important;
		color: #ff4f37 !important;
		border: 3rpx solid #ff5d32;
		// border: 3rpx solid #ff5251;
	}
	
	
	/* 规格选择弹窗 end */
</style>
