<template>
	<view class="power" @click="getAboutTap()">
		<view v-if="brandInfo.mini_status" class="logo">
			<image :src="brandInfo.mini_logo"></image>
			<text>{{brandInfo.mini_title}}</text>
		</view>
		<view v-if="brandInfo.mini_status" class="text">提供技术与平台服务</view>
		<view class="text">v{{version}}</view>
	</view>
</template>

<script>
	export default {
		name: 'about',
		props: {},
		data() {
			return {
				brandInfo: '',
				version: uni.getAccountInfoSync().miniProgram.version ? uni.getAccountInfoSync().miniProgram.version :
					'1.0.0',
			}
		},
		onReady() {
			let self = this;
			self.Get(self.Url.brandInfo, {}).then(res => {
				if (res.code === 0) {
					self.brandInfo = res.data;
				}
			})
		},
		methods: {
			getAboutTap() {
				uni.navigateTo({
					url: '/pages/about'
				})
			}
		}
	}
</script>

<style lang="less">
	.power {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-bottom: 40rpx;

		.logo {
			display: flex;
			align-items: center;
			color: #ccc;

			image {
				width: 36rpx;
				height: 36rpx;
				filter: brightness(80%);
				opacity: .5;
			}

			text {
				padding-left: 6rpx;
			}
		}

		.text {
			color: #ccc;
			font-size: 24rpx;
		}
	}
</style>
