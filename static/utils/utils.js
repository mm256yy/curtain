export function diaplayTime(dateTimeStamp) {
	let newT = dateTimeStamp.replace(/-/g, '/'); //ios时间格式转换时
	let result;
	let minute = 1000 * 60;
	let hour = minute * 60;
	let day = hour * 24;
	let halfamonth = day * 15;
	let month = day * 30;
	let now = new Date().getTime();
	let curTime = new Date(newT);
	let diffValue = now - curTime;
	if (diffValue < 0) {
		return;
	}
	let monthC = diffValue / month;
	let weekC = diffValue / (7 * day);
	let dayC = diffValue / day;
	let hourC = diffValue / hour;
	let minC = diffValue / minute;
	if (monthC >= 1) {
		if (monthC <= 12)
			result = "" + parseInt(monthC) + "个月前";
		else {
			result = "" + parseInt(monthC / 12) + "年前";
		}
	} else if (weekC >= 1) {
		result = "" + parseInt(weekC) + "周前";
	} else if (dayC >= 1) {
		result = "" + parseInt(dayC) + "天前";
	} else if (hourC >= 1) {
		result = "" + parseInt(hourC) + "小时前";
	} else if (minC >= 1) {
		result = "" + parseInt(minC) + "分钟前";
	} else {
		result = "刚刚";
	}
	return result;
}
export function changeText(item) { 
	let test =item // json字符串
	let test2 = test.slice(1, test.length - 1)
	let test3 = []
	for (let i = 0; i < test2.length; i++) {
		test3.push(test2[i].replace('"', ''))
	}
	for (let j = 0; j < test3.length; j++) {
		if (test3[j] === '') {
			test3.splice(j, 1)
		}
	}
	return test3.join('')
}