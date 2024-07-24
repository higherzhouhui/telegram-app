import moment from "moment";

export function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function formatNumber(num: any) {
  if (isNaN(num)) {
    return num
  }
  // 小于千直接返回  
  if (num < 1000) {
    return num;
  }

  // 超过千  
  if (num < 1000000) {
    return (num / 1000).toFixed(2) + 'K';
  } else if (num < 1000000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else {
    return (num / 1000000000).toFixed(2) + 'B';
  }
}


export function judgeIsCheckIn(time: any) {
  let flag = false
  try {
    if (time) {
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const day = currentDate.getDate()
      const currentArr = [year, month, day]
      const timeymd = moment(time).format('YYYY-MM-DD').split('-')
      flag = timeymd.every((item: any, index: number) => {
        return parseInt(item) == currentArr[index]
      })
    }
  } catch (error) {
    console.error(error)
    flag = false
  }
  return flag
}


export function formatWalletAddress(address: any) {
  let str = address
  try {
    if (address) {
      str = address.substring(0, 5) + '...' + address.substring(address.length - 5)
    }
  } catch (error) {

  }

  return str
}