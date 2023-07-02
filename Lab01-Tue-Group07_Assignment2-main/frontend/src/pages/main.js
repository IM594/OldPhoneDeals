import "../App.css";
import Header from "../components/header";
import Account from "../pages/login";

import Counter from "../container";
import Home from "./home";
import SearchResult from "./search";
import ItemPage from "./item";
import UserPage from "./user";
import CartView from "./cart";

function Main() {
    let a = Counter.useContainer(); //获取全局状态
    var searchItems = a.searchItems;
    var brandsList = Array.from(new Set(searchItems.map((phone) => (
        phone.brand
    ))));
    return (
        <div className="main">
            <Counter.Provider>
                {a.loginPage ? (//如果 loginPage 为 true，则显示登录页面，否则显示主页面。
                    <Account stat={a}/>//把状态变量和函数作为参数传递给子组件，子组件就可以使用这些状态变量和函数了。
                ) : (
                    <div className="container">
                        <Header stat={a} brandsList={brandsList}/>
                        <div className="page-body">
                            {a.cartPage ? <CartView stat={a}/> :
                                a.userPage ? (//如果 userPage 为 true，则显示个人资料页面，否则显示主页面。
                                    <UserPage stat={a}></UserPage>
                                ) : a.itemPage ? (//如果 itemPage 为 true，则显示商品页面，否则显示主页面。
                                    <ItemPage stat={a}></ItemPage>
                                ) : a.searchPage ? (//如果 searchPage 为 true，则显示搜索页面，否则显示主页面。
                                    <SearchResult stat={a}/>
                                ) : (//如果 searchPage 为 false，则显示主页面。
                                    <Home stat={a}/>
                                )}
                        </div>

                    </div>
                )}
            </Counter.Provider>
        </div>
    );
}

export default Main;
