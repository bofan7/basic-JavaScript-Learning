/**
 * JS 函数通关秘籍 (JS Function Mastery Guide for Java/C Developers)

 * 
 * 运行方式：
 * 在终端运行：node function_mastery.js
 * 或者直接在浏览器开发者工具 (F12 Console) 中粘贴运行。
 */

console.log("==================================================");
console.log("          🚀 欢迎来到 JavaScript 函数通关秘籍 🚀          ");
console.log("==================================================\n");

/* ==================================================
   1. 声明方式：提升(Hoisting) 与 暂时性死区(TDZ)
   ================================================== */
console.log("------ 1. 声明方式与提升 ------");

// 【对比 C/Java】：
// 在 C 中，如果你在 main 下面写函数，必须在上面写“前置声明”。
// 在 Java 中，类中方法的声明顺序无所谓。
// 在 JS 中，标准的“函数声明”会被“提升”到当前作用域的最顶端。

// 演示：函数提升（可以在声明前调用）
try {
    console.log("调用 hoistedAdd(5, 5):", hoistedAdd(5, 5)); // 正常运行！
} catch (e) {
    console.error("hoistedAdd 调用失败:", e.message);
}

function hoistedAdd(a, b) {
    return a + b;
}


// 如果要调用函数,并把结果复制给变量,则不能在声明函数之前去调用
try {
    // 此时 expressionMultiply 变量虽然声明了，但还没赋值，或者说 const 存在暂时性死区
    console.log("调用 expressionMultiply(5, 5):", expressionMultiply(5, 5)); 
} catch (e) {
    console.log("❌ 无法在声明前调用函数表达式，报错信息:", e.message); // 会报错：Cannot access 'expressionMultiply' before initialization
}

const expressionMultiply = function(a, b) {
    return a * b;
};

// 演示：箭头函数 (Arrow Function) - 语法糖与 lexical this
// 如果只有一个参数，可省略括号；如果只有一行 return，可省略花括号和 return 关键字
const square = x => x * x;
console.log("箭头函数 square(6) 结果:", square(6));


/* ==================================================
   2. 参数特性：极其放飞自我（无重载、多传、少传）
   ================================================== */
console.log("\n------ 2. 参数特性（没有重载 & 参数不匹配） ------");

// 2.1 没有重载！后面的同名函数会直接覆盖前面的。
// 【对比 Java】：Java 支持重载，靠参数列表（类型、个数）区分。
// 【JS 为什么没有？】：因为 JS 中函数名其实就是一个“变量指针”，重名相当于对变量重新赋值。
function printValue(a) {
    console.log("单一参数版:", a);
}
function printValue(a, b) {
    console.log("双参数版:", a, b);
}
printValue("你好"); // 输出: 双参数版: 你好 undefined (前者已被彻底覆盖)

// 2.2 形参和实参个数不匹配
// 传少了：没有接收到值的形参为 undefined
function greet(name, age) {
    console.log(`Hello, 我是 ${name}，我今年 ${age} 岁了`);
}
greet("张三"); // Hello, 我是 张三，我今年 undefined 岁了

// 传多了：多余的参数被忽略，但其实偷偷存在于 arguments (旧) 或剩余参数 (新) 里
greet("李四", 18, "男", "北京"); // 后两个参数没形参接，但不会报错

// 2.3 现代化救场方案：默认参数 & 剩余参数(Rest Parameters)
// 【对比 Java】：剩余参数类似 Java 的可变参数 (String... args)
function sumAll(title, ...numbers) {
    // numbers 会被自动打包成一个真正的数组，可以使用数组的所有方法（如 reduce, map）
    const total = numbers.reduce((acc, curr) => acc + curr, 0);
    console.log(`${title}: ${total}`);
}
sumAll("累加结果", 10, 20, 30, 40); // 累加结果: 100


/* ==================================================
   3. 核心大招：一等公民 (First-Class Citizens) 与闭包
   ================================================== */
console.log("\n------ 3. 一等公民与闭包 ------");

// JS 中，函数是一种特殊的对象（可以加属性，可以传参，可以返回）
// 3.1 函数作为参数（回调函数 Callback）
function processInput(function_param) {
    const data = "来自服务器的数据";
    function_param(data);
}
processInput(data => console.log("收到回调数据:", data));
//所以这里function_param就是一个函数等价于data => console.log("收到回调数据:", data)



// 3.2 函数作为返回值与闭包 (Closure)
// 【闭包定义】：函数能记住并访问它被创建时所在的作用域，即使它是在那个作用域之外被调用的。
// 【对比 Java】：Java 的局部变量在方法执行完后就会在栈上销毁。JS 的闭包让变量留在内存中！
function createWallet(initialMoney) {
    let balance = initialMoney; // 这是一个“私有变量”，外界无法直接修改

    return {//返回一个内部函数对象，这个对象可以访问外部函数的变量（闭包）
        save: function(amount) {
            balance += amount;
            return balance;
        },
        spend: function(amount) {
            if (balance >= amount) {
                balance -= amount;
                return balance;
            }
            console.log("余额不足！");
            return balance;
        },
        getBalance: function() {
            return balance;
        }
    };
}

const myWallet = createWallet(100);
console.log("存入 50 元后余额:", myWallet.save(50));   // 150
console.log("消费 80 元后余额:", myWallet.spend(80)); // 70
console.log("直接访问 balance 变量:", myWallet.balance); // undefined (成功实现数据隐藏/私有化)


/* ==================================================
   4. 最大的坑：this 的四种指向与显式绑定
   ================================================== */
console.log("\n------ 4. this 指向的四大规则 ------");

// 【对比 C++/Java】：this 永远指向当前类的实例对象。
// 【JS 中的 this】：在普通函数中，this 是“运行时动态绑定”的，取决于“谁调用的它”；
//                   在箭头函数中，this 是“静态绑定”的，继承自外层词法作用域。

const cat = {//这个cat是一个对象,里面有变量和方法
    name: "喵喵",
    // 规则 1：普通方法函数：“谁调用我，‘我’就指谁”
    sayName() {
        console.log("猫的名字:", this.name);
    },

    /* 规则 2：箭头函数 () => {} 是一个“没有自我的复读机”。它内部根本没有自己的 this
    *它会向外看，看看自己是在哪个“房间（作用域）”被创建的，外面房间的 this 是谁，它就直接拿来用。

    【这里有一个超级巨大的坑】：
    你可能会觉得：“它不是在 cat 这个大括号 {} 里面创建的吗？那外层不就是 cat 吗？”

    不对！ 在 JavaScript 里面，只有函数的大括号才算一个“房间”（作用域），对象的 {} 只是一个普通的包裹。
    所以，sayNameArrow 在出生的时候向外看，发现 cat 的外面就是最顶层的全局环境（比如浏览器的 window 窗口）。
    */
    sayNameArrow: () => {
        console.log("箭头函数猫的名字:", this ? this.name : undefined);
    }
};

cat.sayName();      // 输出: 喵喵
cat.sayNameArrow(); // 输出: undefined (或在浏览器里输出 window.name)

// 规则 3：默认绑定（裸调用）。非严格模式下指向全局对象，严格模式下是 undefined。
const looseSay = cat.sayName;
try {
    looseSay(); // 相当于直接调用函数，此时 this 指向 global/window 或 undefined
} catch(e) {
    console.log("默认绑定调用报错:", e.message);
}

// 规则 4：显式绑定 (call / apply / bind) —— 强行修改 this 指向
const dog = { name: "汪汪" };

console.log("--- 使用 call / apply / bind 改命 ---");
// 4.1 call: 立即调用，参数一个一个传 ,例如 函数名.call(  dog1, 3, "白色","肉骨头" );
cat.sayName.call(dog); // 输出: 汪汪 (把 cat 的 sayName 方法借给 dog 用)

// 4.2 apply: 立即调用，参数以数组形式传
function introduce(hobby1, hobby2) {
    console.log(`我是 ${this.name}，我喜欢 ${hobby1} 和 ${hobby2}`);
}
introduce.apply(dog, ["啃骨头", "接飞盘"]); // 我是 汪汪，我喜欢 啃骨头 和 接飞盘

// 4.3 bind: 不会立即调用，而是返回一个“绑定了 this 和前置参数”的新函数
const dogIntroduce = introduce.bind(dog, "拆家"); // 预设了第一个参数为 "拆家"
dogIntroduce("睡觉"); // 我是 汪汪，我喜欢 拆家 和 睡觉


/* ==================================================
   5. 作用域与立即执行函数 (IIFE)
   ================================================== */
console.log("\n------ 5. 作用域与立即执行函数 (IIFE) ------");

// 在 ES6 (2015年) 之前，JS 只有全局作用域和函数作用域，没有块级作用域 {}！
// 也就是说，if (true) { var x = 5; } 里的 x 在外面是可以访问的。
// 为了防止变量污染全局，前辈们发明了 IIFE (Immediately Invoked Function Expression)。

// 经典 IIFE 写法 (把整个函数用括号包起来，后面再加个括号立即执行)
(function() {
    let privateModuleVar = "我是 IIFE 内部的机密";
    console.log("IIFE 正在自动执行，保护内部变量不受外界干扰。");
})();

try {
    console.log(privateModuleVar);
} catch (e) {
    console.log("❌ 外部无法访问 IIFE 内部变量:", e.message);
}

// 💡 现代 JS 启示：
// 现在有了 let 和 const，你可以直接用大括号 {} 创建块级作用域来替代部分 IIFE 场景：
{
    let blockScopeVar = "现代块级作用域变量";
}
// console.log(blockScopeVar); // 同样会报错，无法访问！

console.log("\n==================================================");
console.log("🎉 恭喜！你已完成 JS 函数的核心特性学习。");
console.log("你可以配合调试工具（如 VS Code 断点），逐行单步执行这五个板块，观察变量和 this 的变化！");
console.log("==================================================");
