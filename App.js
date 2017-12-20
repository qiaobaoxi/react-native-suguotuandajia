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
import Addresses from './src/components/Addresses';
import Qrcode from './src/components/Qrcode';
import Goods from './src/components/Goods';
import Person from './src/components/Person';
import ShoppingCart from './src/components/ShoppingCart';
import StorePayment from './src/components/StorePayment';
import Store from './src/components/Store';
import Order from './src/components/Order';
import Login from './src/components/Login';
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
const deviceWidthDp = Dimensions.get('window').width;
const uiWidthPx = 750;
global.url='http://dalv.ipet66.com'
CookieManager.clearAll()
.then(res => {
  console.log('CookieManager.clearAll =>', res);
});
function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class HomeScreen extends Component<{}> {
  componentDidMount() {
      SplashScreen.hide();
  }
   constructor(props) {
        super(props);
        console.disableYellowBox = true;
        this.state = {
            selectedTab: 'index'
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
        fetch(global.url+'/api/home/getInitData','GET','',(responseData)=>{
            this.setState({num:responseData.cartNum})
        })
    
         DeviceEventEmitter.addListener('num', (num)=>{
             this.setState({num:num})
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
                  titleStyle={{color:'#999'}}
                  selectedTitleStyle={{color:'#999'}}
                  renderIcon={() => <Image style={styles.menuImg1} source={require('./src/images/shouye.png')} />}
                  renderSelectedIcon={() => <Image style={styles.menuImg1} source={require('./src/images/shouye-1.png')} />}
                  onPress={() => this.setState({ selectedTab: 'index' })}>
                  <Index  navigation={this.props.navigation}/>
              </TabNavigator.Item>
              <TabNavigator.Item
                  selected={this.state.selectedTab === 'payment'}
                  title="门店付款码"
                  titleStyle={{color:'#999',fontSize:pxToDp(20)}}
                  selectedTitleStyle={{color:'#999'}}
                  renderIcon={() => <Image style={styles.menuImg2} source={require('./src/images/payCode-1.png')} />}
                  renderSelectedIcon={() => <Image style={styles.menuImg2} source={require('./src/images/payCode.png')} />}
                  onPress={() => this.setState({ selectedTab: 'payment' })}>
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
    title: '请扫描二维码',
    headerTintColor: 'white',
    headerStyle: {backgroundColor:'#393a3f'},
    headerBackTitle:null
  };
  render() {
    return (
      <Qrcode navigation={this.props.navigation} />
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
    headerTitle: '确认订单',
    headerTintColor: 'black',
    headerStyle: {backgroundColor:'white',height: pxToDp(113),},
    headerTitleStyle: { fontSize: pxToDp(36),fontWeight:'normal'},
    headerBackTitle:null,
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
    headerTitle: '订单',
    headerStyle: {backgroundColor:'white'},
    headerBackTitle:null,
  };
  render() {
    return (
      <MyAllOrder navigation={this.props.navigation} />
    );
  }
}
class MyCardCouponsSuccessScreen extends React.Component {
  static navigationOptions = {
    headerTitle: '我的卡',
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
  Login: { screen: LoginScreen },
  // PaymentSuccess:{
  //   screen: PaymentSuccessScreen,
  // },
  Home: {
    screen: HomeScreen,
  },
  Order: {
    screen: OrderScreen,
  },
   
  Store: { screen: StoreScreen },
  Goods: { screen: GoodsScreen },
  QRcode: { screen: QRcodeScreen },
  Address: { screen: AddressScreen},
  MyAllOrder: { screen: MyAllOrderSuccessScreen },
  MyCard: { screen: MyCardCouponsSuccessScreen },
  MyCollection: { screen: MyCollectionSuccessScreen },
  MyComment: { screen: MyCommentSuccessScreen },
  MyCoupon: { screen: MyCouponSuccessScreen },
  MyInfo: { screen: MyInfoSuccessScreen },
  AddressManage: { screen: AddressManageSuccessScreen },
});
export default class App extends React.Component {
  render() {
    return <RootNavigator />;
  }
}