import { useState } from "react";
import { createContainer } from "unstated-next";

//这个是用来存储用户状态的，比如是否登录，购物车数量等等，可以在任何地方调用
function useUserState(loginIni = false, cartCounter = [], ...initialState) {
  console.log('useUserState', loginIni, cartCounter)
  //useState 是 React 自带的一个 Hook 函数，它的作用是用来声明状态变量。useState(initialState) 接收的参数是状态的初始值，该函数返回一个数组 [state, setState]，第一个元素 state 是状态的值，第二个元素 setState 是一个函数，用来更新状态。

  //loginState 是一个状态变量，初始值为 false，表示用户未登录。如果用户登录了，则把 loginState 设为 true。loginIni 是 useState 的参数，表示 loginState 的初始值为 false。
  let [loginState, setLoginState] = useState(loginIni);
  //cartState 是一个状态变量，初始值为 0，表示购物车中没有商品。如果用户添加了商品到购物车，则把 cartState 设为商品数量。cartCounter 是 useState 的参数，表示 cartState 的初始值为 0。
  let [cartState, setCartState] = useState(cartCounter);
  //loginPage 是一个状态变量，初始值为 false，表示登录页面不显示。如果用户点击了登录按钮，则把 loginPage 设为 true。
  let [loginPage, setLoginPage] = useState(false);
  //registerPage 是一个状态变量，初始值为 false，表示注册页面不显示。如果用户点击了注册按钮，则把 registerPage 设为 true。
  let [registerPage, setRegisterPage] = useState(false);
  //searchPage 是一个状态变量，初始值为 false，表示搜索页面不显示。如果用户点击了搜索按钮，则把 searchPage 设为 true。
  let [searchPage, setSearchPage] = useState(false);
  //itemPage 是一个状态变量，初始值为 false，表示商品页面不显示。如果用户点击了商品，则把 itemPage 设为 true。
  let [itemPage, setItemPage] = useState(false);
  //forgetPage 是一个状态变量，初始值为 false，表示忘记密码页面不显示。如果用户点击了忘记密码按钮，则把 forgetPage 设为 true。
  let [forgetPage, setForgetPage] = useState(false);
  //itemInfo 是一个状态变量，初始值为 false，表示商品信息页面不显示。如果用户点击了商品信息按钮，则把 itemInfo 设为 true。
  let [itemInfo, setItemInfo] = useState(false);
  //userPage 是一个状态变量，初始值为 false，表示用户页面不显示。如果用户点击了用户按钮，则把 userPage 设为 true。
  let [userPage, setUserPage] = useState(false);
  //userPage 是一个状态变量，初始值为 false，表示用户页面不显示。如果用户点击了用户按钮，则把 userPage 设为 true。
  let [cartPage, setCartPage] = useState(false);
  //searchItems 是一个列表变量，初始值为空，表示搜索内容为空。
  let [searchItems, setSearchItems] = useState([]);
  //priceFilter 是一个列表变量，初始值为[0,500]，表示搜索的价格区间为0到500。
  let [priceFilter, setPriceFilter] = useState([0,500]);
  //brandList 是一个列表变量，初始值为空，表示搜索内容的品牌为空。
  let [brandList, setBrandList] = useState([]);
    //brandList 是一个列表变量，初始值为空，表示搜索内容的品牌为空。
  let [brandFilter, setBrandFilter] = useState('');
  //下面的函数用来改变状态变量的值，比如用户点击了登录按钮，则把 loginPage 设为 true，表示登录页面显示。exitLogin 函数则相反，表示用户点击了登录页面的关闭按钮，则把 loginPage 设为 false，表示登录页面不显示。
  let toLogin = () => setLoginPage(true);
  let exitLogin = () => setLoginPage(false);

  

  //下面的函数用来改变状态变量的值，比如用户点击了商品，则把 itemPage 设为 true，表示商品页面显示。exitItem 函数则相反，表示用户点击了商品页面的关闭按钮，则把 itemPage 设为 false，表示商品页面不显示。
  let toItem = () => setItemPage(true);
  let exitItem = () => setItemPage(false);
  //下面的函数用来改变状态变量的值，比如用户点击了商品，则把 itemPage 设为 true，表示商品页面显示。exitItem 函数则相反，表示用户点击了商品页面的关闭按钮，则把 itemPage 设为 false，表示商品页面不显示。
  let toCart = () => setCartPage(true);
  let exitCart = () => setCartPage(false);
  //下面的函数用来改变状态变量的值，比如用户点击了忘记密码按钮，则把 forgetPage 设为 true，表示忘记密码页面显示。exitForget 函数则相反，表示用户点击了忘记密码页面的关闭按钮，则把 forgetPage 设为 false，表示忘记密码页面不显示。
  let toForget = () => setForgetPage(true);
  let exitForget = () => setForgetPage(false);

  //下面的函数用来改变状态变量的值，比如用户点击了个人资料按钮，则把 userPage 设为 true，表示个人资料页面显示。exitUser 函数则相反，表示用户点击了个人资料页面的关闭按钮，则把 userPage 设为 false，表示个人资料页面不显示。
  let toUser = () => setUserPage(true);
  let exitUser = () => setUserPage(false);

  //下面的函数用来改变状态变量的值，比如用户点击了注册按钮，则把 registerPage 设为 true，表示注册页面显示。exitRegister 函数则相反，表示用户点击了注册页面的关闭按钮，则把 registerPage 设为 false，表示注册页面不显示。
  let toRegister = () => setRegisterPage(true);
  let exitRegister = () => setRegisterPage(false);

  //下面的函数用来改变状态变量的值，比如用户点击了搜索按钮，则把 searchPage 设为 true，表示搜索页面显示。exitSearch 函数则相反，表示用户点击了搜索页面的关闭按钮，则把 searchPage 设为 false，表示搜索页面不显示。
  let toSearch = () => setSearchPage(true);
  let exitSearch = () => setSearchPage(false);

  //下面的函数用来改变状态变量的值，比如用户登录了，则把 loginState 设为 true。logout 函数则相反，表示用户登出了，则把 loginState 设为 false。
  let login = () => setLoginState(true);
  let logout = () => setLoginState(false);

  //下面的函数用来改变状态变量的值，比如用户添加了商品到购物车，则把 cartState+value 设为商品数量。removeCart 函数则相反，表示用户从购物车删除了商品，则把 cartState-value 设为商品数量。
  let addCart = (value) => setCartState([...cartState, ...value]);
  let removeCart = (value) => {
    var t = cartState;
    console.log('removeCart',t, value)
    t.splice(t.indexOf(value), 1);

    return setCartState(t);
  };

  let clearCart = (value) => {
    var t = cartState.filter(item=>item!==value);
    return setCartState(t);
  }

  return {
    forgetPage,
    toForget,
    exitForget,
    itemInfo,
    setItemInfo,
    userPage,
    itemPage,
    toItem,
    toUser,
    exitItem,
    exitUser,
    loginPage,
    registerPage,
    searchPage,
    loginState,
    login,
    logout,
    cartState,
    addCart,
    removeCart,
    clearCart,
    toLogin,
    exitLogin,
    toRegister,
    exitRegister,
    toSearch,
    exitSearch,
    searchItems,
    setSearchItems,
    brandList,
    setBrandList,
    priceFilter,
    setPriceFilter,
    brandFilter,
    setBrandFilter,
    cartPage,
    toCart,
    exitCart,
    // cleanCart
  };
}
//这个函数的作用是把上面的状态变量和函数作为参数传递给子组件，子组件就可以使用这些状态变量和函数了。
var Counter = createContainer(useUserState);
export default Counter;
