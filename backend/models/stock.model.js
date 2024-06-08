import moment from 'moment';

class Stock {
  constructor(stockData) {
    this.股票代號 = stockData.c;
    this.公司簡稱 = stockData.n;
    this.成交價 = stockData.z;
    this.成交量 = stockData.tv;
    this.累積成交量 = stockData.v;
    this.開盤價 = stockData.o;
    this.最高價 = stockData.h;
    this.最低價 = stockData.l;
    this.昨收價 = stockData.y;
    this.漲跌百分比 = 0.0;
    this.資料更新時間 = stockData.tlong;
  }

  calculatePriceChangePercentage() {
    const { 成交價, 昨收價 } = this;
    const percentageChange = this.calculatePercentageChange(成交價, 昨收價);
    this.漲跌百分比 = this.formatPercentage(percentageChange);
  }

  calculatePercentageChange(currentPrice, previousPrice) {
    const percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100;
    return Number.isFinite(percentageChange) ? percentageChange : NaN;
  }

  formatPercentage(percentage) {
    return Number.isNaN(percentage) || !Number.isFinite(percentage) ? '-' : percentage;
  }

  formatUpdateTime() {
    const utcOffset = 8 * 60 * 60; // 8小時的UTC偏移量
    const unixTime = this.資料更新時間 / 1000 + utcOffset;
    this.資料更新時間 = moment.unix(unixTime).format('YYYY-MM-DD HH:mm:ss');
  }
}

export default Stock;
