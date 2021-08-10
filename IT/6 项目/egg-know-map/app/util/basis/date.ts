
function  DateFormat (timeStamp, type) {
  var defaultData = DateFormat.fn.default;
  var timerNumber = 0;
  if (timeStamp * 1) {
    timerNumber = parseInt(timeStamp);
  } else {
    timerNumber = (new Date()).getTime()
  }
  DateFormat.fn.timeNumber = timerNumber;
  if (type) {
    if (typeof type == 'number') {
      defaultData.forEach(function (item) {
        if (item.type === type) {
          DateFormat.fn.dateType = item.type
        }
      })
    } else {
      defaultData.forEach(function (item) {
        if (item.typeStr === type) {
          DateFormat.fn.dateType = item.type
        }
      })
    }
  }
  return DateFormat.fn.init();
}

DateFormat.fn = DateFormat.prototype = {
  constructor: DateFormat,
  timeNumber: 0,
  dateType: 3,
  default: [
    {
      type: 1,
      typeStr: 'YYYY-MM-DD'
    },
    {
      type: 2,
      typeStr: 'YYYY/MM/DD'
    },
    {
      type: 3,
      typeStr: 'YYYY-MM-DD hh:mm:ss'
    },
    {
      type: 4,
      typeStr: 'YYYY-MM-DD hh-mm-ss'
    },
    {
      type: 5,
      typeStr: 'YYYY/MM/DD hh:mm:ss'
    },
    {
      type: 6,
      typeStr: 'YYYY/MM/DD hh-mm-ss'
    }
  ],
  forMatNumber: function (number) {
    return number >= 10 ? number : '0' + number
  },
  init: function () {
    let _this = this;
    let aDate = new Date(_this.timeNumber);
    let year = aDate.getFullYear();
    let month = _this.forMatNumber(aDate.getMonth() + 1);
    let day = _this.forMatNumber(aDate.getDate());
    let hour = _this.forMatNumber(aDate.getHours());
    let minute = _this.forMatNumber(aDate.getMinutes());
    let second = _this.forMatNumber(aDate.getSeconds());
    let type = _this.dateType;
    switch (type) {
      case 1:
        return year + '-' + month + '-' + day
        break;
      case 2:
        return year + '/' + month + '/' + day
        break;
      case 3:
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
        break;
      case 4:
        return year + '-' + month + '-' + day + ' ' + hour + '-' + minute + '-' + second
        break;
      case 5:
        return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second
        break;
      case 6:
        return year + '/' + month + '/' + day + ' ' + hour + '-' + minute + '-' + second
        break;
      default:
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
        break;
    }
  }
}

//兼容CommonJs规范
if (typeof module !== 'undefined' && module.exports) module.exports = DateFormat;
//兼容AMD/CMD规范
if (typeof define === 'function') define(function () {
  return DateFormat;
});

//DateFormat.fn.init.prototype = DateFormat.fn;
module.exports = DateFormat;