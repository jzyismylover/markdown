Array.prototype.splice = function (start, deleteCount) {
  let max = Math.max, // 函数定义
    min = Math.min,
    delta,
    element, // 代表每个单元元素
    insertCount = max(arguments.length - 2, 0), // 新增元素的个数
    k = 0,
    len = this.length,
    new_len,
    result = [], // 存储删除的数组
    shift_count;

  start = start || 0;
  if (start < 0) {
    start += len;
  }
  start = max(min(start, len), 0);
  deleteCount = max(
    min(typeof deleteCount === "number" ? deleteCount : len, len - start),
    0
  );
  delta = insertCount - deleteCount; // 变化的长度
  new_len = len + delta; // 新长度

  while (k < deleteCount) {
    element = this[start + k];
    if (element !== undefined) {
      result[k] = element;
    }
    k += 1;
  }

  // ### 关键：需要整体移动的次数 ###
  shift_count = len - start - deleteCount;

  if (delta < 0) {
    k = start + insertCount;
    // 向左平移填补 deleteCount > inserCount 的空缺
    while (shift_count) {
      this[k] = this[k - delta];
      k += 1;
      shift_count -= 1;
    }
    this.length = new_len;
  } else if (delta > 0) {
    // 末尾开始向右平移 n 次 保证能容纳下新增数组元素数量
    k = 1;
    while (shift_count) {
      this[new_len - k] = this[len - k];
      k += 1;
      shift_count -= 1;
    }
    this.length = new_len;
  }
  for (k = 0; k < insertCount; k += 1) {
    this[start + k] = arguments[k + 2];
  }
  return result;
};

const arr = [1, 2, 3, 4, 5];
arr.splice(1, 1, -1, -2);
console.log(arr);
