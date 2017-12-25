/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  AsyncStorage,
  Alert,
  DeviceEventEmitter
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import { StackNavigator } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen'
import Index from './src/components/Index';
import About from './src/components/About';
import EnterpriseAccount from './src/components/EnterpriseAccount';
import Cart from './src/components/Cart';
import Addresses from './src/components/Addresses';
import Qrcode from './src/components/Qrcode';
import Goods from './src/components/Goods';
import Person from './src/components/Person';
import ShoppingCart from './src/components/ShoppingCart';
import StorePayment from './src/components/StorePayment';
import OfflineOrder from './src/components/OfflineOrder';
import Store from './src/components/Store';
import Order from './src/components/Order';
import Login from './src/components/Login';
import GroupArrivesHome from './src/components/GroupArrivesHome';
import PaymentSuccess from './src/components/PaymentSuccess';
import MyAllOrder from './src/components/MyAllOrder';
import MyCardCoupons from './src/components/MyCardCoupons';
import MyCollection from './src/components/MyCollection';
import MyComment from './src/components/MyComment';
import MyCoupon from './src/components/MyCoupon';
import MyInfo from './src/components/MyInfo';
import AddressManage from './src/components/AddressManage';
import OrderDetail from './src/components/OrderDetail';
import CookieManager from 'react-native-cookies';
import fetch from './src/js/fetch'
import Storage from 'react-native-storage';
import Cookie from 'react-native-cookie';
var storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,
    
  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: 1000 * 3600 * 300,
    
  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,
})  
global.storage = storage;
const deviceWidthDp = Dimensions.get('window').width;
const uiWidthPx = 750;
global.url='http://wx.haipibaobao.com'
// global.storage.remove({
//   key: 'goods'
// });
// CookieManager.clearAll()
// .then((res) => {
//   console.log('CookieManager.clearAll =>', res);
// });
function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class HomeScreen extends Component<{}> {
  componentDidMount() {
      SplashScreen.hide();
      this.subscription = DeviceEventEmitter.addListener('num', (num)=>{
           this.setState({num:num})
      })
  }
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
    const { params } = this.props.navigation.state;
    if(!!params&&!!params.page){
      this.state = {
        selectedTab: params.page
      }
    }else{
      this.state = {
          selectedTab: 'index'
      }
    }
    let num = 0
    // AsyncStorage.getItem('goods',(error,result)=>{
    //     if(result){
    //       let goods=JSON.parse(result)
    //       for(let i=0;i<goods.length;i++){
    //          num+=goods[i].num
    //       }
    //       this.setState({num:num})
    //     }
    // })
    global.storage.load({
      key: 'Cookie',
      // syncInBackground(默认为true)意味着如果数据过期，
      // 在调用sync方法的同时先返回已经过期的数据。
      // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
      syncInBackground: true,
      
      // 你还可以给sync方法传递额外的参数
      syncParams: {
      extraFetchOptions: {
      // 各种参数
      },
    someFlag: true,
      },
    }).then(ret => {
      let parems={
        userId:ret
      }
      Cookie.set(global.url, 'userId', ret).then(() => console.log('success'));
        fetch(global.url+'/api/User/ReLogin','post',parems,(responseData)=>{
          Alert.alert(0)
          Cookie.get(global.url).then((cookie) => {
            global.storage.save({
              key: 'Cookie',  // 注意:请不要在key中使用_下划线符号!
              data: cookie
            });
        });
      },(error)=>{
        Alert.alert('2')
         console.log(error)
      })
    }).catch(err => {
      console.warn(err.message);
      switch (err.name) {
          case 'NotFoundError':
              // TODO;
              break;
            case 'ExpiredError':
                // TODO
                break;
      }
    })
    Cookie.get(global.url).then((cookie) => {
      if(!!cookie&&!!cookie.userId){
        fetch(global.url+'/api/home/getInitData','GET','',(responseData)=>{
          this.setState({num:responseData.cartNum})
        })
      }else{
        global.storage.load({
          key: 'goods',
          // syncInBackground(默认为true)意味着如果数据过期，
          // 在调用sync方法的同时先返回已经过期的数据。
          // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
          syncInBackground: true,
          
          // 你还可以给sync方法传递额外的参数
          syncParams: {
          extraFetchOptions: {
          // 各种参数
          },
        someFlag: true,
          },
        }).then(ret => {
          let num=0
          for(let i=0;i<ret.length;i++){
            num+=Number(ret[i].count)
          }
          this.setState({num})
        }).catch(err => {
        console.warn(err.message);
        switch (err.name) {
            case 'NotFoundError':
                // TODO;
                break;
              case 'ExpiredError':
                  // TODO
                  break;
        }
        })
      }
    });
  }
  static navigationOptions = {
    header:null
  };
  render() {
    return (
      <TabNavigator tabBarStyle={{backgroundColor:'white',height: pxToDp(114),alignItems: 'center'}}>
              <TabNavigator.Item
                  selected={this.state.selectedTab === 'index'}
                  title="首页"
                  tabStyle={{color:'white'}}
                  titleStyle={{color:'#999'}}
                  selectedTitleStyle={{color:'#999'}}
                  renderIcon={() => <Image style={styles.menuImg1} source={require('./src/images/shouye.png')} />}
                  renderSelectedIcon={() => <Image style={styles.menuImg1} source={require('./src/images/shouye-1.png')} />}
                  onPress={() => this.setState({ selectedTab: 'index' })}>
                  <Index  navigation={this.props.navigation}/>
              </TabNavigator.Item>
              <TabNavigator.Item
                  selected={this.state.selectedTab === 'payment'}
                  title="门店付款"
                  titleStyle={{color:'#999',fontSize:pxToDp(20)}}
                  selectedTitleStyle={{color:'#999'}}
                  renderIcon={() => <Image style={styles.menuImg2} source={require('./src/images/payCode-1.png')} />}
                  renderSelectedIcon={() => <Image style={styles.menuImg2} source={require('./src/images/payCode.png')} />}
                  onPress={() => {
                    const navigation=this.props.navigation
                    Cookie.get(global.url).then((cookie) => {
                      if(!cookie||!cookie.userId){
                        navigation.navigate("Login")
                      }else{
                        this.setState({ selectedTab: 'payment' })}
                      }
                     )
                  }}>
                  
                  <StorePayment navigation={this.props.navigation} />
              </TabNavigator.Item>
              <TabNavigator.Item
                  selected={this.state.selectedTab === 'shoppingCart'}
                  title="购物车"
                  selectedTitleStyle={{color:'#999'}}
                  titleStyle={{color:'#999'}}
                  renderBadge={()=>{
                      if(this.state.num>0){
                         return <View style={this.state.num<100?styles.badgeWrap:styles.badgeWrap1}><Text style={this.state.num<100?styles.badge:styles.badge1}>{this.state.num}</Text></View>
                      }
                  }}
                  renderIcon={() => <Image style={styles.menuImg3} source={require('./src/images/gouwuche.png')} />}
                  renderSelectedIcon={() => <Image style={styles.menuImg3} source={require('./src/images/gouwuche-1.png')} />}
                  onPress={() => this.setState({ selectedTab: 'shoppingCart' })}>
                  <ShoppingCart navigation={this.props.navigation} />
              </TabNavigator.Item>
            <TabNavigator.Item
                selected={this.state.selectedTab === 'my'}
                title="我的"
                selectedTitleStyle={{color:'#999'}}
                titleStyle={{color:'#999'}}
                renderIcon={() => <Image style={styles.menuImg4} source={require('./src/images/wode.png')} />}
                renderSelectedIcon={() => <Image style={styles.menuImg4} source={require('./src/images/wode-1.png')} />}
                onPress={() => this.setState({ selectedTab: 'my' })}>
                <Person  navigation={this.props.navigation} />
            </TabNavigator.Item>
         </TabNavigator>
    );
  }
}
class MyAllOrderScreen extends React.Component {
  static navigationOptions = {
    header:null
  };
  render() {
    return (
      <MyAllOrder navigation={this.props.navigation} />
    );
  }
}
class QRcodeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <Qrcode navigation={this.props.navigation} />
    );
  }
}
class OfflineOrderScreen extends React.Component {
  static navigationOptions = {
    title: '线下订单列表',
    headerTintColor: 'white',
    headerStyle: {backgroundColor:'#393a3f'},
    headerBackTitle:null
  };
  render() {
    return (
      <OfflineOrder navigation={this.props.navigation} />
    );
  }
}
class EnterpriseAccountScreen extends React.Component {
  static navigationOptions = {
    title: '企业账户',
    headerTintColor: 'white',
    headerStyle: {backgroundColor:'#393a3f'},
    headerBackTitle:null
  };
  render() {
    return (
      <EnterpriseAccount navigation={this.props.navigation} />
    );
  }
}
class AboutScreen extends React.Component {
  static navigationOptions = {
    header:null
  };
  render() {
    return (
      <About navigation={this.props.navigation} />
    );
  }
}
class CartScreen extends React.Component {
  static navigationOptions = {
    header:null
  };
  render() {
    return (
      <Cart navigation={this.props.navigation} />
    );
  }
}
class AddressScreen extends React.Component {
  static navigationOptions = {
    headerTintColor: 'black',
    headerStyle: {backgroundColor:'white'},
    headerTitle:'请选择送货地址',
    headerBackTitle:null,
  };
  render() {
    return (
      <Addresses navigation={this.props.navigation} />
    );
  }
}
class GoodsScreen extends React.Component {
  static navigationOptions = {
    header:null
  };
  render() {
    return (
      <Goods  navigation={this.props.navigation} />
    );
  }
}
class LoginScreen extends React.Component {
  static navigationOptions = {
    header:null
  };
  render() {
    return (
      <Login  navigation={this.props.navigation} />
    );
  }
}
class StoreScreen extends React.Component {
  static navigationOptions = {
    header:null
  };
  render() {
    return (
      <Store navigation={this.props.navigation} />
    );
  }
}
class OrderScreen extends React.Component {
  static navigationOptions = {
    header:null
  };
  render() {
    return (
      <Order navigation={this.props.navigation} />
    );
  }
}
class PaymentSuccessScreen extends React.Component {
  static navigationOptions = {
    header:null
  };
  render() {
    return (
      <PaymentSuccess navigation={this.props.navigation} />
    );
  }
}
class MyAllOrderSuccessScreen extends React.Component {
  static navigationOptions = {
    headerTitle: '线上订单列表',
    headerStyle: {backgroundColor:'white'},
    headerBackTitle:null,
  };
  render() {
    return (
      <MyAllOrder navigation={this.props.navigation} />
    );
  }
}
class GroupArrivesHomeSuccessScreen extends React.Component {
  static navigationOptions = {
    headerTitle: '企业采购',
    headerStyle: {backgroundColor:'white'},
    headerBackTitle:null,
  };
  render() {
    return (
      <GroupArrivesHome navigation={this.props.navigation} />
    );
  }
}
class MyCardCouponsSuccessScreen extends React.Component {
  static navigationOptions = {
    headerTitle: '我的卡券',
    headerStyle: {backgroundColor:'white'},
    headerBackTitle:null,
  };
  render() {
    return (
      <MyCardCoupons navigation={this.props.navigation} />
    );
  }
}
class MyCollectionSuccessScreen extends React.Component {
  static navigationOptions = {
    title: '我的收藏',
    headerStyle: {backgroundColor:'white'},
    headerBackTitle:null,
  };
  render() {
    return (
      <MyCollection navigation={this.props.navigation} />
    );
  }
}
class MyCommentSuccessScreen extends React.Component {
  static navigationOptions = {
    title: '评价',
    headerStyle: {backgroundColor:'white'},
    headerBackTitle:null,
  };
  render() {
    return (
      <MyComment navigation={this.props.navigation} />
    );
  }
}
class MyCouponSuccessScreen extends React.Component {
  static navigationOptions = {
    title: '优惠券',
    headerStyle: {backgroundColor:'white'},
    headerBackTitle:null,
  };
  render() {
    return (
      <MyCoupon navigation={this.props.navigation} />
    );
  }
}
class MyInfoSuccessScreen extends React.Component {
  static navigationOptions = {
    title: '个人资料',
    headerStyle: {backgroundColor:'white'},
    headerBackTitle:null,
  };
  render() {
    return (
      <MyInfo navigation={this.props.navigation} />
    );
  }
}
class AddressManageSuccessScreen extends React.Component {
  static navigationOptions = {
    title: '地址管理',
    headerStyle: {backgroundColor:'white'},
    headerBackTitle:null,
  };
  render() {
    return (
      <AddressManage navigation={this.props.navigation} />
    );
  }
}
class OrderDetailSuccessScreen extends React.Component {
  static navigationOptions = {
    title: '订单详情',
    headerStyle: {backgroundColor:'white'},
    headerBackTitle:null,
  };
  render() {
    return (
      <OrderDetail navigation={this.props.navigation} />
    );
  }
}
const styles = StyleSheet.create({
  menu:{
      alignItems:"center",
      position:'relative'
    },
    menuList:{
      position:'absolute',
      zIndex:1000
    },
    menuImg1: {
        marginTop:pxToDp(10),
        width:pxToDp(46),
        height:pxToDp(44)
    },
    menuImg2: {
        marginTop:pxToDp(10),
        width:pxToDp(41),
        height:pxToDp(41)
    },
    menuImg3: {
        marginTop:pxToDp(10),
        width:pxToDp(54),
        height:pxToDp(50)
    },
    menuImg4: {
        marginTop:pxToDp(10),
        width:pxToDp(44),
        height:pxToDp(48)
    },
    menuText:{
      textAlign: 'center',
      fontSize: pxToDp(20),
      height: pxToDp(24),
      lineHeight:pxToDp(24)
    },
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingBottom:pxToDp(106)
  },
  selected: {
    color:'#f68900'
  },
  badgeWrap:{
    marginTop: pxToDp(15),
    width: pxToDp(34),
    height: pxToDp(34),
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: pxToDp(20),
    color: 'white',
    backgroundColor: '#ff5a00',
    borderWidth: pxToDp(1),
    borderColor: 'white',
    borderRadius: 100,
    overflow: 'hidden',
  },
  badgeWrap1:{
    marginTop: pxToDp(15),
    width: pxToDp(50),
    height: pxToDp(34),
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: pxToDp(20),
    color: 'white',
    backgroundColor: '#ff5a00',
    borderWidth: pxToDp(1),
    borderColor: 'white',
    borderRadius: 100,
    overflow: 'hidden',
  },
  badge: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: pxToDp(20),
    color: 'white',
    backgroundColor: '#ff5a00',
    borderWidth: pxToDp(1),
    borderColor: 'white',
    borderRadius: 100,
  },
  badge1: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: pxToDp(20),
    color: 'white',
    backgroundColor: '#ff5a00',
    borderWidth: pxToDp(1),
    borderColor: 'white',
    borderRadius: 100,
  }
});
const RootNavigator = StackNavigator({
  // Login: { screen: LoginScreen },
  Home: {
    screen: HomeScreen,
  },
  About: {
    screen: AboutScreen,
  },
  Order: {
    screen: OrderScreen,
  },
  PaymentSuccess:{
    screen: PaymentSuccessScreen,
  },
  Login: { screen: LoginScreen },
  Cart: { screen: CartScreen },
  GroupArrivesHome: { screen: GroupArrivesHomeSuccessScreen },
  Store: { screen: StoreScreen },
  Goods: { screen: GoodsScreen },
  OfflineOrder: { screen: OfflineOrderScreen },
  QRcode: { screen: QRcodeScreen },
  Address: { screen: AddressScreen},
  MyAllOrder: { screen: MyAllOrderSuccessScreen },
  MyCard: { screen: MyCardCouponsSuccessScreen },
  MyCollection: { screen: MyCollectionSuccessScreen },
  MyComment: { screen: MyCommentSuccessScreen },
  MyCoupon: { screen: MyCouponSuccessScreen },
  MyInfo: { screen: MyInfoSuccessScreen },
  AddressManage: { screen: AddressManageSuccessScreen },
  EnterpriseAccount: { screen: EnterpriseAccountScreen },
});
export default class App extends React.Component {
  render() {
    return <RootNavigator />;
  }
}