
# 剑指 Offer 系列


## [剑指 Offer 04. 二维数组中的查找](https://leetcode-cn.com/problems/er-wei-shu-zu-zhong-de-cha-zhao-lcof/)

```js
const findNumberIn2DArray = function (matrix, target) {
    // 容易遗忘的点
    if(matrix.length <= 0 || matrix[0].length <= 0) { return false }
    let m = matrix.length, n = matrix[0].length

    // 时间复杂度为O(nlogn)
    for (let i = 0; i < m; i++) {
        if (matrix[i][0] > target) { break }
        else {
            let left = 0, right = n - 1
            // 二分查找的过程
            while (left <= right) {
                let mid = Math.floor((right - left) / 2 + left)
                if (matrix[i][mid] === target) {
                    return true
                } else if (matrix[i][mid] < target) {
                    left = mid + 1
                } else {
                    right = mid - 1
                }
            }
        }
    }
    return false
}
```

## [剑指 Offer 05. 替换空格](https://leetcode-cn.com/problems/ti-huan-kong-ge-lcof/)  

```js
// 正则表达式
var replaceSpace = function(s) {
    const reg = new RegExp(/\s/g)
    return s.replace(reg, '%20')
}; 

// 遍历字符串
let res = ''
for(let i=0; i<s.length; i++) {
    res = res + s[i] === ' ' ? '%20' : s[i] 
}
return res
```


## [剑指 Offer 06. 从尾到头打印链表](https://leetcode-cn.com/problems/cong-wei-dao-tou-da-yin-lian-biao-lcof/)

```js
    const arr = [];
    // 遍历链表
    while (head) {
        arr.push(head.val);
        head = head.next;
    }
    return arr.reverse();
}
```

## [剑指 Offer 09. 用两个栈实现队列](https://leetcode-cn.com/problems/yong-liang-ge-zhan-shi-xian-dui-lie-lcof/)

```js
var CQueue = function() {
    this.stack1 = [];
    this.stack2 = [];
};

CQueue.prototype.appendTail = function(value) {
    this.stack1.push(value);
};

CQueue.prototype.deleteHead = function() {
    let deleteItem = this.stack2.pop(); // 判断有没有元素可以 pop
    if (deleteItem) {
        return deleteItem;
    } else {// 将stack1 的所有元素搬到 stack2
        let popItem = this.stack1.pop();
        while(popItem) {
            this.stack2.push(popItem);
            popItem = this.stack1.pop();
        }
        deleteItem = this.stack2.pop();
        return deleteItem || -1;
    }
};
```

## [剑指 Offer 11. 旋转数组的最小数字](https://leetcode-cn.com/problems/xuan-zhuan-shu-zu-de-zui-xiao-shu-zi-lcof/)

```js
// 最简单粗暴的方式就是直接遍历找最小的元素
var minArray = function(numbers) {
    let res = numbers[0]
    for(let i=1; i<numbers.length; i++) {
        if(res >= numbers[i]) {
            res = numbers[i]
        }
    }
    return res
};

// 但实际上其实题目要求的不是这样子，是根据旋转以及原数组升序的特性来解题
const n = numbers.length
let left = 0, right = n - 1, mid

while (left < right) { // 最后只剩下一个元素
    mid = Math.floor(left + (right - left) / 2)
    if (numbers[mid] < numbers[n - 1]) {//向左查找
        right = mid // 当前这个可能是最小值
    } else if (numbers[mid] > numbers[n - 1]) {// 向右查找
        left = mid + 1
    } else { // 关键步骤；此时不知道往左走还是往右走
        let min = numbers[left]
        // 直接遍历
        for (let i = left + 1; i <= right; i++) {
            if (numbers[i] < min) {
                min = numbers[i]
            }
        }
        return min
    }
}

return numbers[left]
```

## [剑指 Offer 12. 矩阵中的路径](https://leetcode-cn.com/problems/ju-zhen-zhong-de-lu-jing-lcof/)

> 基本的思路是和之前深度优先搜索或者广度优先搜索的矩阵题目是类似的，可以去回看一下之前的代码


## [剑指 Offer 18. 删除链表的节点](https://leetcode-cn.com/problems/shan-chu-lian-biao-de-jie-dian-lcof/)

```js
var deleteNode = function(head, val) {
    if(head == null) { return head }

    // 增加多一个头引用解决删除头结点的情况
    let preHead = new ListNode(0)
    preHead.next = head
    tmp = preHead

    while(head) {
        if(head.val === val) {
            let next = head.next
            tmp.next = next
            return preHead.next // 最后返回头引用的 next
        }
        head = head.next
        tmp = tmp.next
    }
};
```


## [剑指 Offer 21. 调整数组顺序使奇数位于偶数前面](https://leetcode-cn.com/problems/diao-zheng-shu-zu-shun-xu-shi-qi-shu-wei-yu-ou-shu-qian-mian-lcof/)

```js
// 最容易想到的解决方案
var exchange = function(nums) {
    const ji = [], ou = []
    for(let i=0; i<nums.length; i++) {
        if(nums[i] % 2 !== 0) {//奇数
            ji.push(nums[i])
        } else {
            ou.push(nums[i])
        }
    }
    return [...ji, ...ou]
};
```



## [剑指 Offer 22. 链表中倒数第k个节点](https://leetcode-cn.com/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/)

```js
// slow 和 fast 的初值一样
// 如果要删除第 k 个节点的话 slow 就要从虚拟头指针开始了
var getKthFromEnd = function(head, k) {
    let slow = head, fast = head
    
    for(let i=0; i<k && fast; i++) {
        fast = fast.next
    }

    while(fast) {
        fast = fast.next
        slow = slow.next
    }
    return slow
};
```

## [剑指 Offer 24. 反转链表](https://leetcode-cn.com/problems/fan-zhuan-lian-biao-lcof/)

```js
var reverseList = function(head) {
    let pre = null // 指向翻转链表后的头结点
    while(head) {
        let next = head.next
        head.next = pre
        pre = head
        head = next
    }
    return pre
};
```


## [剑指 Offer 25. 合并两个排序的链表](https://leetcode-cn.com/problems/he-bing-liang-ge-pai-xu-de-lian-biao-lcof/)

```js
var mergeTwoLists = function(l1, l2) {
    // 可以避免重复的拷贝
    if(!l1) { return l2 }
    if(!l2) { return l1 }
    
    let l3 = pre = new ListNode(0)
    while(l1 && l2) {
        l3.next = new ListNode(0)
        if(l1.val < l2.val) {
            l3.next.val = l1.val
            l1 = l1.next
        } else {
            l3.next.val = l2.val
            l2 = l2.next
        }
        l3 = l3.next
    }

    // 判断最后链表的有余性
    l1 && (l3.next = l1)
    l2 && (l3.next = l2)

    return pre.next
};
```

## [剑指 Offer 26. 树的子结构](https://leetcode-cn.com/problems/shu-de-zi-jie-gou-lcof/)


---

## [剑指 Offer 32 - I. 从上到下打印二叉树](https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-lcof/)

```js
// 树的广度优先搜索
var levelOrder = function(root) {
    if(root == null) { return [] }
    const queue = [root], res = []

    while(queue.length > 0) {
        const node = queue.shift()
        res.push(node.val)
        node.left && queue.push(node.left)
        node.right && queue.push(node.right)        
    }
    return res
};
```

## [剑指 Offer 32 - II. 从上到下打印二叉树 II](https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-ii-lcof/)

> 本质上和上面的遍历没有差异，只是每一次都将一层的数据遍历出来，是广度优先搜索的特殊情况，称为**层次遍历**。

```js
var levelOrder = function(root) {
    if(root == null) { return [] }
    const queue = [root], res = []
    let j = 0

    while(queue.length > 0) {
        const n = queue.length
        res.push([])
        for(let i=0; i<n; i++) {
            const node = queue.shift()
            res[j].push(node.val)
            node.left && queue.push(node.left)
            node.right && queue.push(node.right)  
        }
        j++
    }
    return res
};
```

## [剑指 Offer 32 - III. 从上到下打印二叉树 III](https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-iii-lcof/)

> 在上面的基础上增加一个奇偶判断层，如果是偶数那么就 push元素，如果是奇数那么就 unshift 元素。又或者说偶数的时候 push，奇数的时候同样 push 只不过最后在 reverse 一下。

```js
var levelOrder = function(root) {
    if(root == null) { return [] }
    const queue = [root], res = []
    let j = 0, tmp = true

    while(queue.length > 0) {
        const n = queue.length
        res.push([])
        for(let i=0; i<n; i++) {
            const node = queue.shift()
            if(tmp) {
                res[j].push(node.val)
            } else {
                res[j].unshift(node.val)
            }
            node.left && queue.push(node.left)
            node.right && queue.push(node.right)  
        }
        j++
        tmp = !tmp
    }
    return res
};
```

<br>

---

## [剑指 Offer 33. 二叉搜索树的后序遍历序列](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-hou-xu-bian-li-xu-lie-lcof/)

   - 二叉搜索树(性质不熟悉)
   - 后序遍历的递归写法

二叉搜索树的性质  
1、若它的左子树不为空，那么左子树上的所有值均小于它的根节点  
2、若它的右子树不为空，那么右子树上所有值均大于它的根节点  
3、它的左子树和右子树也都是二叉搜索树  

```js
var isHouNumbers = function(list, i, j) {
    // 很多时候都会忘记写递归结束条件
    if(i >= j)  return true
    const root = list[j] // 根节点
    let left = i, right = j - 1
    // 二分方法找到大于根节点的一个元素的索引
    while(left <= right) {
        let mid = Math.floor((right - left) / 2 + left)
        if(list[mid] > root) {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }

    // 判断左子树是否满足全部小于 root 的条件
    for(let q=i; q<left; q++) {
        if(list[q] > root) { return false }
    }
    // 判断右子树是否满足全部大于 root 的条件
    for(let p=left; p<j; p++) {
        if(list[p] < root) { return false }
    }
    
    return isHouNumbers(list, i, left-1) && isHouNumbers(list, left, j-1)
}

var verifyPostorder = function(postorder) {
    return isHouNumbers(postorder, 0, postorder.length - 1)
};
```

## [剑指 Offer 36. 二叉搜索树与双向链表](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-yu-shuang-xiang-lian-biao-lcof/)

```js
var treeToDoublyList = function(root) {
    // 排序 & 循环双向链表
    if(root === null) { return root }
    // pre 指向的是当前节点的上一个节点
    // head 指向的是当前正在访问的节点
    let pre = null, head = null

    const dfs = (cur) => {
        if(cur === null) { return cur }

        // 前序位置
        dfs(cur.left)

        // 中序位置(关键代码)
        if(pre) {
            pre.right = cur
        } else {
            head = cur
        }
        cur.left = pre
        pre = cur

        // 后续位置
        dfs(cur.right)
    }

    dfs(root)

    // 更新头结点的 left 和尾结点的right
    pre.right = head
    head.left = pre

    return head
};
```


<br>

---

## [剑指 Offer 35. 复杂链表的复制](https://leetcode-cn.com/problems/fu-za-lian-biao-de-fu-zhi-lcof/)

> 好像是每次做每次都会忘记解题思路o(╥﹏╥)o，其实就是很简单哈希表存储节点列表，实现一个一一对应的关系，下次一定要画图，不然总是这样冥想还是很容易出问题的。

```js
/**
 * Definition for a Node.
 * function Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */

/**
 * @param {Node} head
 * @return {Node}
 */
var copyRandomList = function(head) {
    const randomList = new Map(), newNodes = []
    while(head) {
        randomList.set(head, newNodes.length)
        const current = new Node(head.val, null, head.random)
        if(newNodes.length > 0) {
            newNodes[newNodes.length - 1].next = current 
        }
        newNodes.push(current)
        head = head.next
    }

    newNodes.forEach((item) => {
        item.random = newNodes[randomList.get(item.random)]
    })

    return newNodes[0]
};
```

```js
// 解法上更加容易去理解 
var copyRandomList = function(head) {
    if(head == null) { return null }

    let tmp = head
    const map = new Map()

    // 哈希表建立一对一映射的过程
    while(tmp) {
        const node = new Node(tmp.val)
        map.set(tmp, node)
        tmp = tmp.next
    }
    
    tmp = head
    while(tmp) {
        const newNode = map.get(tmp)
        
        const keyNext = tmp.next
        const next = map.get(keyNext)
        newNode.next = next || null // 防止出现 undefined 的情况

        const keyRandom = tmp.random
        const _random = map.get(keyRandom)
        newNode.random = _random || null // 防止出现 undefined 的情况

        tmp = tmp.next
    }

    return map.get(head)
};
```

---

## [剑指 Offer 39. 数组中出现次数超过一半的数字

](https://leetcode-cn.com/problems/shu-zu-zhong-chu-xian-ci-shu-chao-guo-yi-ban-de-shu-zi-lcof/)

```js
// 第一种解决方法哈希表存储 + 一次遍历
// 第二种解决方法快排 + 一次遍历
// 第三种解法简称为“擂台法”(基于当前数字的个数大于数组长度的一半)


const n = nums.length
// 维护着当前的擂台
let item = { num: 1, key: nums[0] }
for (let i = 1; i < n; i++) {
    if (item.num <= 0) { item.key = nums[i] }
    // 模拟有人打擂台的情况
    if (nums[i] !== item.key) {
        item.num--
    } else {
        item.num++
    }
}

return item.key
```

<br>

以上为 2022/3/25 日刷题

---

<br>

## [剑指 Offer 40. 最小的k个数](https://leetcode-cn.com/problems/zui-xiao-de-kge-shu-lcof/)

> 利用快速排序在排序的过程中不断缩小排序空间来减少时间复杂度（因为题目没有说结果要按照某个定序返回）

<br>

## [剑指 Offer 41. 数据流中的中位数](https://leetcode-cn.com/problems/shu-ju-liu-zhong-de-zhong-wei-shu-lcof/)

> 力扣中困难等级的题目

<br>

## [剑指 Offer 42. 连续子数组的最大和](https://leetcode-cn.com/problems/lian-xu-zi-shu-zu-de-zui-da-he-lcof/)

> 前缀和 / 动态规划的思想

```js
var maxSubArray = function(nums) {
    const dp = [nums[0]]
    let max = dp[0]

    for(let i=1; i<nums.length; i++) {
        if(dp[i-1] > 0) {
            dp[i] = dp[i-1] + nums[i]
        } else {
            dp[i] = nums[i]
        }
        max = dp[i] > max ? dp[i] : max
    }

    return max
}
```

## [剑指 Offer 45. 把数组排成最小的数](https://leetcode-cn.com/problems/ba-shu-zu-pai-cheng-zui-xiao-de-shu-lcof/)

> [题目解析](https://blog.algomooc.com/045.html#%E4%BA%8C%E3%80%81%E9%A2%98%E7%9B%AE%E8%A7%A3%E6%9E%90) 难点在于根本想不到使用三个区域来对数组进行划分。这道题的规律在于存在一个基准点 mid, 在 [left, mid-1] 中随便选择一个元素，都满足排列值 leftmid < midleft，在 [mid+1, right] 中随便选择一个元素都满足排列值 midright < rightmid，因此可以使用快速排序的思想做区间划分处理

```js
var QuickSort = function(nums, left, right) {

    if(left >= right) { return }

    const tmp = nums[left]
    let i = left, j = right

    while(i < j) {
        while(i < j) { // 找 mid 左边的元素
            let r1 = tmp + nums[j], r2 = nums[j] + tmp
            if(+r1 > +r2) { break } // 此时满足 leftmid < midleft
            j-- 
        }
        nums[i] = nums[j];
        
        while(i < j) { // 找到 mid 右边的元素
            let r1 = tmp + nums[i], r2 = nums[i] + tmp
            if(+r1 < +r2) { break }  // 此时满足 midright < rightmid
            i++ 
        }
        nums[j] = nums[i];  
    }
    nums[j] = tmp
    QuickSort(nums, left, j-1)
    QuickSort(nums, j+1, right)
}

var minNumber = function(nums) {
    nums = nums.map(item => String(item))

    QuickSort(nums, 0, nums.length-1)

    return nums.join('')
};
```

<br>

## [剑指 Offer 46. 把数字翻译成字符串](https://leetcode-cn.com/problems/ba-shu-zi-fan-yi-cheng-zi-fu-chuan-lcof/) 

[题解](https://blog.algomooc.com/046.html#%E4%B8%89%E3%80%81%E5%8F%82%E8%80%83%E4%BB%A3%E7%A0%81)   

> 难点在于如何找到对应的状态转移方程

```js
var translateNum = function(num) {
    const list = String(num).split('')
    const dp = [1]
    for(let i=1; i<list.length; i++) {
        if(list[i-1] === '1' || list[i-1] === '2' && list[i] <= '5') {
            if(i === 1) {
                dp[i] = 2
            } else {
                dp[i] = dp[i-1] + dp[i-2]
            }
        } else {
                dp[i] = dp[i - 1];
        }
    }        
    return dp[list.length - 1];
};
```


## [剑指 Offer 47. 礼物的最大价值](https://leetcode-cn.com/problems/li-wu-de-zui-da-jie-zhi-lcof/)


---

<br>

## [剑指 Offer 52. 两个链表的第一个公共节点](https://leetcode-cn.com/problems/liang-ge-lian-biao-de-di-yi-ge-gong-gong-jie-dian-lcof/)

```js
var getIntersectionNode = function(headA, headB) {
    if(headA == null || headB == null) {
        return null
    }
    let pointA = headA, pointB = headB
    /*
        退出有两种情况
        1. pointA = null pointB = null(两者同时到尾部)
        2. pointA = pointB = c1 (到达指定的相交点)
    */
    while(pointA != pointB) {
        if(pointA == null) {
            pointA = headB
        } else {
            pointA = pointA.next
        }

        if(pointB == null) {
            pointB = headA
        } else {
            pointB = pointB.next
        }
    }
    return pointA
};
```

<br>

---

## [剑指 Offer 53 - I. 在排序数组中查找数字 I](https://leetcode-cn.com/problems/zai-pai-xu-shu-zu-zhong-cha-zhao-shu-zi-lcof/)

```js
// 基于当前的数组是有序数组，否则使用哈希表
var search = function(nums, target) {
    let i = 0, j = nums.length - 1
    while(nums[i] < target) { i++ }
    while(nums[j] > target) { j-- }
    
    return j - i + 1
};
```

## [剑指 Offer 53 - II. 0～n-1中缺失的数字](https://leetcode-cn.com/problems/que-shi-de-shu-zi-lcof/)

```js
var missingNumber = function(nums) {
    const n = nums.length
    for(let i=0; i<n; i++) {
        if(i !== nums[i]) {
            return nums[i] - 1
        }
    }
    // 处理末尾缺失
    return nums[n-1] + 1 
};
```

```js
// 使用二分查找
var missingNumber = function(nums) {
    let left = 0, right = nums.length - 1
    while(left <= right) {
        let mid = Math.floor((left + right) / 2)
        if(nums[mid] === mid) {
            left = mid + 1
        } else if(nums[mid] !== mid) {
            right = mid - 1
        }
    }

    // 指向最小且大于当前元素的下标
    return left
};
```

---

<br>

## [剑指 Offer 54. 二叉搜索树的第k大节点](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-di-kda-jie-dian-lcof/)

> 利用了二叉搜索树结构的性质

```js
var kthLargest = function(root, k) {
    let count = 0, res
    const helper = (cur, k) => {
        if(cur == null) { return }
        helper(cur.right, k)
        
        // 中序位置
        if(count === k) { return }  
        count++
        if(count === k) { res = cur.val }
        
        helper(cur.left, k)
    }

    helper(root, k)
    return res
};
```


## [剑指 Offer 55 - I. 二叉树的深度](https://leetcode-cn.com/problems/er-cha-shu-de-shen-du-lcof/)

```js
var maxDepth = function(root) {
    // 基于 bfs
    let depth = 0
    if(root == null) { return depth }
    const queue = [root]
    while(queue.length > 0) {
        let n = queue.length
        for(let i=0; i<n; i++) {
            const node = queue.shift()
            node.left && queue.push(node.left)
            node.right && queue.push(node.right)
        }
        depth++
    }
    return depth

    // 基于 dfs
    if(root == null) { return 0}
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))
};
```

## [剑指 Offer 55 - II. 平衡二叉树](https://leetcode-cn.com/problems/ping-heng-er-cha-shu-lcof/)

```js
var isBalanced = function(root) {
    const dfs = ( root ) => {
        if(root == null) { return 0 }

        let left = dfs(root.left)
        if(left === -1)  return -1

        let right = dfs(root.right)
        if(right === -1) return -1

        // 难点在于设置后序遍历的逻辑
        return Math.abs(left - right) < 2 ? Math.max(left, right) + 1 : -1;
    }

    return dfs(root) !== -1
};
```

---

[300. 最长递增子序列](https://leetcode-cn.com/problems/longest-increasing-subsequence/)

> 网易雷火 2022年暑期实习笔试原题

```js
var lengthOfLIS = function(nums) {
    if(nums.length <= 1) { return 1 }
    const dp = [1]
    let res = 0
    for(let i=1; i<nums.length; i++) {
        let j = i-1, max = -1
        while(j >=0 ) {
            if(nums[j] < nums[i]) {
                max = max < dp[j] + 1 ? dp[j] + 1 : max
            }
            j--
        }
        // 关键步骤
        dp[i] = max === -1 ? 1 : max
        res = res < dp[i] ? dp[i] : res
    }
    return res
};
```

<br>



> 飞书文档面试宝典中涉及的算法题目

## 	[141. 环形链表](https://leetcode-cn.com/problems/linked-list-cycle/)

```js
var hasCycle = function(head) {
    if(head == null) { return false }
    let low = head, fast = head.next
    
    while(fast) {
        if(fast == low) { return true }
        low = low.next
        fast = fast.next ? fast.next.next : null
    }
    return false
};
```

## [678. 有效的括号字符串](https://leetcode-cn.com/problems/valid-parenthesis-string/)

> 有这么一种情况 *(() 和 (()\* ，第一个其实是不合法的，第二个是合法的，根本的区别在于剩余的 * 和 ( 的 出现顺序不一样，所以我们才需要 leftstack 和 xingstack 两个表来记录对应的索引

```js
var checkValidString = function(s) {
    let leftstack = [], xingstack = []
    let n = s.length

    for (let i = 0; i < n; i++) {
        if (s[i] === '(') {
            leftstack.push(i)
        } else if (s[i] === '*') {
            xingstack.push(i)
        } else {
            if (leftstack.length) {
                leftstack.pop()
            } else if (xingstack.length) {
                xingstack.pop()
            } else {
                return false
            }
        }
    }

    while(leftstack.length && xingstack.length) {
        // 栈的性质 - 后进先出
        const leftIndex = leftstack.pop();
        const xingIndex = xingstack.pop();
        if (leftIndex > xingIndex) {
            return false;
        }
    }

    return leftstack.length === 0
};
```

## [215. 数组中的第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

> 题解：https://mp.weixin.qq.com/s/8ZTMhvHJK_He48PpSt_AmQ
>
> 题目的解法有两种，第一种是快速排序，第二种是建立二叉堆



## [1663. 具有给定数值的最小字符串](https://leetcode-cn.com/problems/smallest-string-with-a-given-numeric-value/)

```js
var getSmallestString = function(n, k) {
    // 使用 a 填满所有的位置
    k -= n

    let res = ''
    let curr = 0, i = n - 1
    while(i >= 0) {
        // 如果当前的 k 比 25还大，就直接用 z 去填充
        // 如果当前的 k 比 25还小，就用 97 + k 去填充
        // 相当于是不同策略的选择
        curr = Math.min(25, k)
        // 将值转换成字符再拼接到输出字符串中
        res = String.fromCharCode(97 + curr) + res
        k -= curr // 更新当前的 k
        i--
    }
    return res
}
```



## [36. 有效的数独](https://leetcode-cn.com/problems/valid-sudoku/)

> 难点有两个
>
> 1. 建立合适的索引表来判断一行、一列、一个单元格内的元素是否有重复
> 2. 给定一个 board[i][j\] 判断它属于哪一个方格，计算的公式是 (j/3) + (i/3)*3画图应该就能很快得出

```js
var isValidSudoku = function(board) {
    const line = Array.from(Array(9), () => new Array(10).fill(false)),
      column = Array.from(Array(9), () => new Array(10).fill(false)),
      box = Array.from(Array(9), () => new Array(10).fill(false))

    for(let i=0; i<9; i++) {
        for(let j=0; j<9; j++) {
            if(board[i][j] === '.') continue
            let index = Math.floor(j / 3) + Math.floor(i / 3) * 3
            let curr = board[i][j] - '0'
            if(line[i][curr]) { return false }
            else if(column[j][curr]) { return false }
            else if(box[index][curr]) { return false }

            line[i][curr] = true
            column[j][curr] = true
            box[index][curr] = true
        }
    }
    return true
};
```

## [69. x 的平方根 ](https://leetcode-cn.com/problems/sqrtx/)

> 第一种方法相当于是给定一个范围去找符合条件的数，瓶颈在于这个范围的选择

```js
var mySqrt = function(x) {
    if(x === 0 || x === 1) { return x }
    // 相当于要找一个范围
    let i
    for(i=1; i<=Math.floor(x / 2); i++) {
        let t = i * i
        if(t < x) {
            continue
        } else if(t === x) {
            return i
        } else if(t > x) {
            return i - 1
        }
    }
    return i - 1
}
```

> 可以使用二分查找的方式对上面的方法进行优化

```js
var mySqrt = function(x) {
    if(x === 0 || x === 1) { return x }
    // 相当于要找一个范围
    let left = 1, right = Math.floor(x / 2)
    while(left <= right) {
        let mid = Math.floor((right - left) / 2 + left)
        let t = mid * mid
        if(t < x) {
            left = mid + 1
        } else if(t > x) {
            right = mid - 1
        } else {
            return mid
        }
    }
    // 最后没有找到
    // 说明这个值肯定是位于 [x, y] 之间，由于我们需要的是向下取整
    // 所以返回的应该是 x 而不是 y
    return right
}
```

## [70. 爬楼梯](https://leetcode-cn.com/problems/climbing-stairs/)

> 空间复杂度比较高

```js
var climbStairs = function(n) {
    // n >= 3 dp[n] = dp[n-1] + dp[n-2]
    // n == 1 dp[1] = 1
    // n == 2 dp[2] = 2
    if(n <= 2) { return n }
    let dp = [0, 1, 2]
    for(let i=3; i<=n; i++) {
        dp[i] = dp[i-1] + dp[i-2]
    }
    return dp[n]
}
```

> 使用常数量级的空间复杂度，但是时间上好像又慢了，主要是每个循环都需要运算三次

```js
var climbStairs = function(n) {
    // n >= 3 dp[n] = dp[n-1] + dp[n-2]
    // n == 1 dp[1] = 1
    // n == 2 dp[2] = 2
    if(n <= 2) { return n }
    let p = 1, q = 2, t = 0
    for(let i=3; i<=n; i++) {
        t = p + q
        p = q
        q = t
    }
    return t
}
```

## [821. 字符的最短距离](https://leetcode-cn.com/problems/shortest-distance-to-a-character/)

```js
/**
 * @param {string} s
 * @param {character} c
 * @return {number[]}
 */
var shortestToChar = function(s, c) {
  // 先把所有的位置找出来
  const prev = [], distance = []
  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i) === c) {
      prev.push(i)
    }
  }

  for (let i = 0, j = 1; j < prev.length; i++, j++) {
    // 控制在两个 c 之间双向进行匹配得到距离最小
    let [i1, i2] = [prev[i], prev[j]]
    for (let p = i1, q = i2; p <= q; p++, q--) {
      distance[p] = p - i1
      distance[q] = i2 - q
    }
  }

  for(let i=0; i<=prev[0]; i++) {
    distance[i] = prev[0] - i
  }
  for(let i=prev[prev.length-1]; i<s.length; i++) {
    distance[i] = i - prev[prev.length-1]
  }

  return distance
};
```

> 第二种思路是遍历两次，取每次遍历的最小值更新数组
>
> 可以这么去理解
>
> 第一次遍历：[0, 第一个出现的位置] (非常大的数)  .... 中间更新数据
>
> 第二次遍历：[s.length - 1, 最后一个出现的位置]\(非常大的数) ...  中间更新数据

```js
var shortestToChar = function(s, c) {
    // 双向遍历两次
    const ans = []
    let len = s.length

    let prev = Number.MIN_SAFE_INTEGER / 2  // 防溢出
    for(let i=0; i<len; i++) {
        if(s.charAt(i) === c) { prev = i }
        ans[i] = i - prev
    }

    prev = Number.MAX_SAFE_INTEGER / 2   // 防溢出
    for(let i=len-1; i>=0; i--) {
        if(s.charAt(i) === c) { prev = i }
        ans[i] = Math.min(prev - i, ans[i])
    }

    return ans
}
```

## [226. 翻转二叉树](https://leetcode-cn.com/problems/invert-binary-tree/)

```js
// 从遍历的角度去思考(先解决当前为题再分解)
var invertTree = function(root) {
    if(root == null) { return null }

    // 前序位置
    let tmp = root.left
    root.left = root.right
    root.right = tmp

    invertTree(root.left)
    invertTree(root.right) 
    return root
}

// 从分解的角度去思考(先解决子问题再合并)
var invertTree = function(root) {
    if(root == null) { return null }

    let left = invertTree(root.left)
    let right = invertTree(root.right)
    root.left = right
    root.right = left

    return root
}
```



## LRU 缓存

> 最近最少使用算法，是面试中常考常问的算法

```js
/*
    LRU 的基本思想如果数据最近被访问过，那么将来被访问的几率也更高
    具体的步骤是：
    1. 新数据插入到链表头部
    2. 每当缓存命中，则将数据移到链表头部
    3. 当链表满的时候，将链表尾部的数据丢弃
*/

class Node {
    next = prev = null
    constructor(key, val) {
        this.key = key
        this.val = val
    }
}

class DoubleList {
    head = tail = null
    constructor() {
        this.head = new Node(0, 0)
        this.tail = new Node(0, 0)
        this.head.prev = this.tail // 头部前缀指针指向尾结点
        this.tail.next = this.head // 尾部后缀指针指向头结点
        this.size = 0 // 链表的元素个数
    }

    // 在链表的尾部添加结点
    addLast(X) {
        X.prev = this.tail.prev
        X.next = this.tail
        this.tail.prev.next = X
        this.tail.prev = X
        this.size++
    }


    // 删除链表中的 X 节点（一定存在所以不用进行 null 判断）
    remove(X) {
        X.prev.next = X.next
        X.next.prev = X.prev
        this.size--
    }

    // 删除链表中的第一个节点并返回该节点
    removeFirst() {
        if(this.head.next == this.tail) {
            return null // 当前没有元素
        }
        let first = this.head.next
        this.remove(first)
        return first
    }

}

class LRUCache {
    // 使用函数式编程 => 抽象成一层 api 使得逻辑更加清晰

    constructor(capacity) {
        this.map = new Map()
        this.cache = new DoubleList()
        this.capacity = capacity // 容积
    }

    // 将某个 key 提升为最近使用的
    makeRecently(key) {
        let x = this.map.get(key) // 拿到节点
        this.cache.remove(x)
        this.cache.addLast(x)
    }

    // 添加最近使用的元素
    addRecently(key, val) {
        let x = new Node(key, val)
        this.cache.addLast(x)  // 添加到队尾标记为最新访问的元素
        this.map.set(key, val) // 添加到哈希映射表中
    }

    // 删除某一个 key
    deleteKey(key) {
        let x = this.map.get(key)
        this.cache.remove(x)
        this.map.delete(key)
    }   


    // 删除最久未使用的元素
    removeLastRecently() {
        let x = this.cache.removeFirst() // 删除最不常使用的节点
        let deletedKey = x.key
        this.map.delete(deletedKey)
    }

    get(key) {
        let x = this.map.get(key)
        if(!x) {
            return -1
        }
        // 将数据提升为最近使用的
        this.makeRecently(key)
        return x.val
    }

    put(key, val) {
        let x = this.map.get(key)
        if(x) {// 更新数据&提升节点到队尾
            this.deleteKey(key)
            this.addRecently(key, val)
        } else {// size是否大于等于capacity
            if(this.cache.size >= this.capacity) {
                this.removeFirst()
            }
            this.cache.addLast(x)
        }
    }
}
```





## 哈夫曼树

> 设置节点的层次使得整棵树的叶子节点的权值和对应的深度的乘积之和最小（Min((val * depth)求和)）

```js
/*
    哈夫曼树 —— 最优二叉树
*/

/**
 * @param {*} val 
 * @param {*} left 
 * @param {*} right 
 */

function TreeNode(val, char, left, right) {
    this.val = val || 0  // 字符出现的次数
    this.char = char || '' // 待编码的字符（当前节点是叶子节点才给char赋值）
    this.left = left || null    
    this.right = right || null
}


function HuffmanTree(str) {
    if(str === '') { return null }

    //1. 统计字符出现的频率
    let hash = {}

    for(let i=0; i<str.length; i++) {
        hash[str[i]] ??= 0 // 前者为 null / undefined 才赋值
        hash[str[i]] = hash[str[i]] + 1
    }

    //2. 构造哈夫曼树
    const huffmanTree = this.getHuffmanTree(hash)
    console.log('===哈夫曼树===', huffmanTree)

    //3. 遍历哈夫曼树得到编码表
    const map = this.getHuffmanCode(huffmanTree)
    console.log('===哈夫曼编码表===', map)

    //4. 根据编码对照表，返回最终的二进制代码
    let res = ''
    for(let item in hash) {
        res += map.get(item)
    }
    console.log('===哈夫曼总编码===', res)
}

HuffmanTree.prototype.getHuffmanTree = function(hash) {
    // 构建叶子节点
    let forest = []
    for(let char in hash) {
        const node = new TreeNode(hash[char], char)
        forest.push(node)
    }
    
    let allNodes = []
    while(forest.length != 1) {
        forest.sort((a, b) => a.val - b.val)
        let node = new TreeNode(forest[0].val + forest[1].val)
        allNodes.push(forest[0])
        allNodes.push(forest[1])
        node.left = allNodes[allNodes.length - 2] // 左子树放置词频低的
        node.right = allNodes[allNodes.length - 1] // 右子树放置词频高的

        forest = forest.slice(2)
        forest.push(node) // 将新生成的节点放入森林中
    }

    return forest[0] // 整棵树的根节点
}

// 树的遍历(只统计子结点)
HuffmanTree.prototype.getHuffmanCode = function(huffmanTree) {
    let map = new Map()

    // 层数大于二才有路径
    const search = (node, curPath) => {
        if(!node) { return }
        
        // 先序遍历
        if(!node.left && !node.right) {
            map.set(node.char, curPath)
        }

        if(node.left) {
            search(node.left, curPath + '0')
        }
        if(node.right) {
            search(node.right, curPath + '1')
        }
    }

    search(huffmanTree, '')
    return map
}

const huff = new HuffmanTree('ABBCCCDDDDEEEEE')
```

