import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  WebView,
  Button,
  Modal,
  TouchableHighlight,
  Alert,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Cookie from 'react-native-cookie';
import CookieManager from 'react-native-cookies';
import fetch from '../js/fetch'
const deviceWidthDp = Dimensions.get('window').width;

const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class NineBox extends React.Component{
    constructor(props) {
        super(props);
        // console.disableYellowBox = true;
        this.state = {modalVisible: false,btn:true};
        this.state.dataSource={
            user:{
                birthday: "",
                consumption: 0,
                headerImg: "",
                id: 0,
                name: "",
                nickName: "",
                openid:"",
                phone:"",
                sex:0,
                subscribe:true,
                type:"",
                vip:0
            },
            isRefreshing:false
        }
        fetch(global.url+'/API/user/getUserCard?openid=','GET','',(responseData)=>{
                 this.setState({happyCart:responseData.data.length});
              })
          fetch(global.url+'/API/user/getUserCouponNum?openid=','get','',(responseData)=>{
                 this.setState({coupon:responseData.data[0].count});
              })
           fetch(global.url+'/API/user/getStateNum','get','',(responseData)=>{
               if(responseData.success){
                    this.setState({
                        paymentDt:responseData.data.paymentDt,
                        shipmentDt:responseData.data.shipmentDt,
                        goodsReceiptDt:responseData.data.goodsReceiptDt,
                        commentDt:responseData.data.commentDt,
                        returnReject:responseData.data.returnReject
                    })
               }else{
                   console.error(responseData.message)
               }
              })
              fetch(global.url+'/api/home/getInitData','GET','',(responseData)=>{
                  this.setState({dataSource:responseData});
              },(error)=>{
              })
      this.getCookie()
      Cookie.get(global.url).then((cookie) => {
          let IsLogin=0
            if(cookie||cookie.userId){
                IsLogin=1
            }
            this.setState({IsLogin})
        }
       )
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    componentDidUpdate(){
        // const { navigate } = this.props.navigation;
        // Cookie.get(global.url).then((cookie) => {
        //     console.log(cookie)
        //     if(!cookie||!cookie.userId){
        //         navigate("Login")
        //     }
        // })
    }
    goLogin(go,parems){
        const { navigate } = this.props.navigation;
        Cookie.get(global.url).then((cookie) => {
            if(!cookie||!cookie.userId){
                navigate("Login")
            }else{
                navigate(go,parems)
            }
        })
    }
    getCookie () {
        Cookie.get(global.url).then((cookie) => {
            if(!cookie||!cookie.userId){
                this.setState({btn:false})
            }else{
                this.setState({btn:true})
            }
        })
    }
    _onRefresh() {
        this.setState({isRefreshing: true});
        setTimeout(() => {
          // prepend 10 items
          fetch(global.url+'/API/user/getStateNum','get','',(responseData)=>{
            if(responseData.success){
                 this.setState({
                     paymentDt:responseData.data.paymentDt,
                     shipmentDt:responseData.data.shipmentDt,
                     goodsReceiptDt:responseData.data.goodsReceiptDt,
                     commentDt:responseData.data.commentDt,
                     returnReject:responseData.data.returnReject
                 })
            }else{
                console.error(responseData.message)
            }
           })
            fetch(global.url+'/API/user/getUserCard?openid=','GET','',(responseData)=>{
                    this.setState({happyCart:responseData.data.length});
                })
            fetch(global.url+'/API/user/getUserCouponNum?openid=','get','',(responseData)=>{
                    this.setState({coupon:responseData.data[0].count});
                })
          this.setState({
            isRefreshing: false,
          });
        }, 1000);
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <ScrollView contentContainerStyle={{paddingBottom:10}} refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._onRefresh.bind(this)}
                  tintColor="#ff0000"
                  title="Loading..."
                  titleColor="#00ff00"
                  colors={['#ff0000', '#00ff00', '#0000ff']}
                  progressBackgroundColor="#ffff00"
                />
              } >
                <ImageBackground style={styles.header}  source={require('../images/headerBg.jpg')}>
                    <View style={{paddingLeft:pxToDp(60),width:"100%"}}>
                        <TouchableOpacity onPress={()=>{
                            Cookie.get(global.url).then((cookie) => {
                                if(!cookie||!cookie.userId){
                                  navigate('Login')
                                }
                              }
                               )
                        }} style={{width:pxToDp(120),height:pxToDp(120),borderRadius:100,overflow: "hidden"}}>
                            {this.state.dataSource.user.headerImg?<Image  style={{width:pxToDp(120),height:pxToDp(120),}} source={{uri:this.state.dataSource.user.headerImg}}></Image>:<Image  style={{width:pxToDp(120),height:pxToDp(120),}} source={require('../images/headPonter.png')}></Image>}
                        </TouchableOpacity>
                        <View style={styles.headerNameJifen}>
                            {this.state.IsLogin?<Text style={styles.headerName}>{this.state.dataSource.user.nickName}</Text>:<Text onPress={()=>navigate('Login')} style={styles.headerName}>请点击登录</Text>}
                            {this.state.dataSource.user.companyName?<Text style={styles.headerJifen}>{this.state.dataSource.user.companyName}</Text>:null}
                        </View>
                        {/* <View style={styles.vip}>
                            <Text style={{color:"#0000ee"}}>VIP{this.state.dataSource.user.vip}</Text>
                        </View> */}
                    </View>
                </ImageBackground>
                  <View style={styles.order}>
                      <View style={styles.myOrder}>
                          <Image style={styles.myOrderImg} source={require('../images/myOrder.png')}></Image>
                          <Text style={styles.myOrderText} onPress={()=>{
                                this.goLogin("MyAllOrder")
                    }}>在线订单</Text>
                          <Text style={styles.allOrderText} onPress={()=>{
                              this.goLogin("MyAllOrder")
                    }}>查看全部订单</Text>
                          <Image  style={styles.allOrderImg} source={require('../images/dir.png')}></Image>
                      </View>
                  </View>
                <View style={styles.goods}>
                    <TouchableOpacity style={styles.goodsWrap} onPress={()=>{
                        this.goLogin("MyAllOrder",{num:0})
                    }}>
                        <Image style={styles.goodsWrapImg1} source={require('../images/goods1.png')}></Image>
                        <Text  style={styles.goodsWrapText}>待付款</Text>
                        {this.state.paymentDt==0||this.state.paymentDt==null?null:<View style={this.state.paymentDt>=100?styles.goodsWrapSpanWrap1:styles.goodsWrapSpanWrap}><Text style={styles.goodsWrapSpan}>{this.state.paymentDt}</Text></View>}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.goodsWrap}  onPress={()=>{
                        this.goLogin("MyAllOrder",{num:1})
                    }}>
                        <Image style={styles.goodsWrapImg2} source={require('../images/goods2.png')}></Image>
                        <Text  style={styles.goodsWrapText}>待发货</Text>
                        {this.state.shipmentDt==0||this.state.shipmentDt==null?null:<View style={this.state.shipmentDt>=100?styles.goodsWrapSpanWrap1:styles.goodsWrapSpanWrap}><Text  style={styles.goodsWrapSpan}>{this.state.shipmentDt}</Text></View>}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.goodsWrap}  onPress={()=>{
                        this.goLogin("MyAllOrder",{num:2})
                    }}>
                        <Image style={styles.goodsWrapImg3} source={require('../images/goods3.png')}></Image>
                        <Text  style={styles.goodsWrapText}>待收货</Text>
                        {this.state.goodsReceiptDt==0||this.state.goodsReceiptDt==null?null:<View style={this.state.goodsReceiptDt>=100?styles.goodsWrapSpanWrap1:styles.goodsWrapSpanWrap}><Text  style={styles.goodsWrapSpan}>{this.state.goodsReceiptDt}</Text></View>}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.goodsWrap}  onPress={()=>{
                        this.goLogin("MyAllOrder",{num:3})
                    }}>
                        <Image style={styles.goodsWrapImg4} source={require('../images/goods4.png')}></Image>
                        <Text  style={styles.goodsWrapText}>待评价</Text>
                        {this.state.commentDt==0||this.state.commentDt==null?null:<View style={this.state.commentDt>=100?styles.goodsWrapSpanWrap1:styles.goodsWrapSpanWrap}><Text  style={styles.goodsWrapSpan}>{this.state.commentDt}</Text></View>}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.goodsWrap}  onPress={()=>{
                        this.goLogin("MyAllOrder",{num:4})
                    }}>
                        <Image style={styles.goodsWrapImg5} source={require('../images/goods5.png')}></Image>
                        <Text  style={styles.goodsWrapText}>申请退货</Text>
                        {this.state.returnReject==0||this.state.returnReject==null?null:<View style={this.state.returnReject>=100?styles.goodsWrapSpanWrap1:styles.goodsWrapSpanWrap}><Text  style={styles.goodsWrapSpan}>{this.state.returnReject}</Text></View>}
                    </TouchableOpacity>
                </View>
                <View style={styles.line}></View>
                <View style={styles.order}>
                      <View style={styles.myOrder}>
                          <Image style={styles.myOrderImg} source={require('../images/myOrder.png')}></Image>
                          <Text style={styles.myOrderText} onPress={()=>{
                        this.goLogin("OfflineOrder")
                    }}>线下订单</Text>
                          <Text style={styles.allOrderText} onPress={()=>{
                       this.goLogin("OfflineOrder")
                    }}>查看全部订单</Text>
                          <Image  style={styles.allOrderImg} source={require('../images/dir.png')}></Image>
                      </View>
                  </View>
                  <View style={styles.line}></View>
                <View style={styles.discount}>
                    <TouchableOpacity style={styles.discountWrap} onPress={() => 
                    this.goLogin("MyCard")
                     }>
                        <View style={styles.discountWrap}>
                            <Text style={styles.discountWrapText}>{this.state.happyCart}</Text>
                            <Text>团到家卡</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.discountWrap} onPress={() => {
                            this.goLogin("EnterpriseAccount")
                      }}>
                        <View style={styles.discountWrap}>
                            <Text style={styles.discountWrapText}></Text>
                            <Text>企业账户</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.verticalLine}>
                    </View>
                </View>
                {/* <View style={styles.line}></View>
                <TouchableOpacity style={styles.evaluationSheet} onPress={() => this.goLogin("MyComment") }>
                    <Image style={styles.evaluationSheetImg1} source={require('../images/camera.png')}></Image>
                    <Text style={styles.evaluationSheetText}>我的评价晒单</Text>
                    <Image style={styles.evaluationSheetImg2} source={require('../images/dir.png')}></Image>
                </TouchableOpacity> */}
                <View style={styles.line}></View>
                <TouchableOpacity style={styles.evaluationSheet} onPress={() =>  this.goLogin("AddressManage")  }>
                    <Image style={styles.evaluationSheetImg1} source={require('../images/address.png')}></Image>
                    <Text style={styles.evaluationSheetText}>地址管理</Text>
                    <Image style={styles.evaluationSheetImg2} source={require('../images/dir.png')}></Image>
                </TouchableOpacity>
                {/* <View style={styles.line1px}></View>
                <TouchableOpacity style={styles.evaluationSheet} onPress={()=> this.goLogin("MyCollection") }>
                    <Image style={styles.evaluationSheetImg1} source={require('../images/star.png')}></Image>
                    <Text style={styles.evaluationSheetText}>我的收藏</Text>
                    <Image style={styles.evaluationSheetImg2} source={require('../images/dir.png')}></Image>
                </TouchableOpacity> */}
                <View style={styles.line1px}></View>
                <TouchableOpacity style={styles.evaluationSheet} onPress={()=>  this.goLogin("MyInfo")}>
                    <Image style={styles.evaluationSheetImg1} source={require('../images/person.png')}></Image>
                    <Text style={styles.evaluationSheetText}>个人资料</Text>
                    <Image style={styles.evaluationSheetImg2} source={require('../images/dir.png')}></Image>
                </TouchableOpacity>
                {/* <View style={styles.line1px}></View> */}
                {/* <TouchableOpacity style={styles.evaluationSheet} >
                    <Image style={styles.evaluationSheetImg1} source={require('../images/person.png')}></Image>
                    <Text style={styles.evaluationSheetText}>分享给好友</Text>
                    <Image style={styles.evaluationSheetImg2} source={require('../images/dir.png')}></Image>
                </TouchableOpacity> */}
                {this.state.btn?<View style={styles.signUpWrap}>
                    <TouchableOpacity style={styles.signUp} onPress={()=>{
                        this.setModalVisible(!this.state.modalVisible)
                    }}>
                        <Text style={styles.signUpText}>退出登录</Text>
                    </TouchableOpacity>
                </View>:null}
                <Modal
                  animationType={"fade"}
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {alert("Modal has been closed.")}}
                  >
                 <View style={styles.opacity}>
                  <View style={{backgroundColor:'rgba(255, 255, 255, 1)',width:pxToDp(632),height: pxToDp(316),borderRadius: 10,overflow:"hidden"}}>
                    <View style={styles.hint}><Text>确定要退出登录吗？</Text></View>
                    <View style={styles.btnsWrap}>
                        <TouchableOpacity  style={styles.btn} onPress={() => {
                        this.setModalVisible(!this.state.modalVisible)
                        }}>
                          <Text style={styles.cancel}>取消</Text>
                        </TouchableOpacity>
                                <TouchableOpacity style={styles.btn} onPress={() => {
                        CookieManager.clearAll().then((res) => {
                              console.log('CookieManager.clearAll =>', res);
                              this.setState({btn:false})
                              this.setModalVisible(!this.state.modalVisible)
                              global.storage.remove({
                                key: 'Cookie'
                              });
                              navigate('Home')
                            });
                        }}>
                          <Text style={styles.ok}>确定</Text>
                        </TouchableOpacity>
                    </View>
                  </View>
                 </View>
                </Modal>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        height: Platform.OS==='android'?pxToDp(298):pxToDp(328),
        width: "100%",
        paddingTop: pxToDp(110)
    },
    headerNameJifen: {
        position: "absolute",
        left: pxToDp(200),
        fontSize: pxToDp(14),
        width: pxToDp(500),
        height: pxToDp(120),
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    headerName: {
        fontSize: pxToDp(40),
        color: 'white'
    },
    headerJifen: {
        fontSize: pxToDp(28),
        color: "white",
        marginTop: pxToDp(20)
    },
    vip: {
        position: "absolute",
        left: pxToDp(320),
        marginTop: pxToDp(10),
        backgroundColor: 'rgba(0,0,0,0)'
    },
    order: {
        width: "100%",
        height: pxToDp(92),
        borderBottomWidth: 2,
        borderBottomColor: "#dcdcdc",
        backgroundColor: 'white'
    },
    myOrder: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: pxToDp(28),
        color: "#8e8e8e"
    },
    myOrderImg: {
        width: pxToDp(44),
        height: pxToDp(44),
        marginLeft: pxToDp(40),
        marginRight: pxToDp(14)
    },
    myOrderText: {
        fontSize: pxToDp(28),
        color: "#8e8e8e"
    },
    allOrderText: {
        fontSize: pxToDp(28),
        color: "#8e8e8e",
        marginLeft: pxToDp(300)
    },
    allOrderImg: {
        width: pxToDp(44),
        height: pxToDp(44), 
    },
    goods: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: Platform.OS==='android'?pxToDp(20):pxToDp(40),
        paddingRight: pxToDp(20),
        paddingBottom: pxToDp(40),
        paddingLeft: pxToDp(20),
        backgroundColor: 'white'
    },
    goodsWrap: {
        paddingTop:Platform.OS==='android'?pxToDp(20):pxToDp(40),
        position:"relative",
        alignItems: 'center',
        width: pxToDp(140),
    },
    goodsWrapImg1: {
        width: pxToDp(50),
        height: pxToDp(44),
    },
    goodsWrapImg2: {
        width: pxToDp(50),
        height: pxToDp(44),
    },
    goodsWrapImg3: {
        width: pxToDp(50),
        height: pxToDp(48),
    },
    goodsWrapImg4: {
        width: pxToDp(46),
        height: pxToDp(46),
    },
    goodsWrapImg5: {
        width: pxToDp(39),
        height: pxToDp(45),
    },
    goodsWrapText: {
        fontSize: pxToDp(24),
        color: "#666666",
        marginTop: pxToDp(20)
    },
    goodsWrapSpanWrap: {
        position: "absolute",
        top: pxToDp(0),
        right:0,
        zIndex:100,
        width: pxToDp(36),
        height: pxToDp(36),
        borderWidth: pxToDp(2),
        borderColor: "#f50739",
        borderRadius: 100,
        color: "#f50739",
        textAlign: 'center',
        fontSize: pxToDp(24),
        lineHeight: pxToDp(36),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    goodsWrapSpanWrap1: {
        position: "absolute",
        top: pxToDp(0),
        right:0,
        zIndex:100,
        width: pxToDp(54),
        height: pxToDp(36),
        borderWidth: pxToDp(2),
        borderColor: "#f50739",
        borderRadius: 100,
        color: "#f50739",
        textAlign: 'center',
        fontSize: pxToDp(24),
        lineHeight: pxToDp(36),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    goodsWrapSpan: {
        fontSize: pxToDp(24),
        color: "#f50739",
    },
    line: {
        height: pxToDp(20),
        backgroundColor: "#e2e4e5",
    },
    discount: {
        position: "relative",
        flexDirection: "row",
        backgroundColor: 'white'
    },
    discountWrap: {
        width: "50%",
        alignItems: 'center',
        fontSize: pxToDp(28),
        paddingTop: pxToDp(30),
        paddingBottom: pxToDp(30)
    },
    verticalLine: {
        position: "absolute",
        left: "49.8%",
        width: pxToDp(2),
        height: "100%",
        backgroundColor: "#dcdcdc",
    },
    discountWrapText: {
      color: "#e70000"
    },
    evaluationSheet: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: pxToDp(20),
        paddingRight: pxToDp(30),
        paddingBottom: pxToDp(20),
        paddingLeft: pxToDp(30),
        backgroundColor: 'white'
    },
    evaluationSheetImg1: {
        width: pxToDp(44),
        height: pxToDp(44),
        marginRight:pxToDp(10)
    },
    evaluationSheetImg3: {
        width: pxToDp(40),
        height: pxToDp(48),
        marginRight:pxToDp(10)
    },
    evaluationSheetText: {
        fontSize: pxToDp(28),
        width: pxToDp(600)
    },
    evaluationSheetImg2: {
        width: pxToDp(24),
        height: pxToDp(24)
    },
    line1px: {
        marginLeft:pxToDp(40),
        height: pxToDp(2),
        backgroundColor:"#e5e5e5",
    },
    signUpWrap: {
      height: pxToDp(154),
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
      justifyContent: 'center'
    },
    signUp: {
        width: pxToDp(298),
        height: pxToDp(80),
        borderWidth: 2,
        borderColor: '#909090',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    signUpText: {
        fontSize: pxToDp(32)
    },
    menu: {
        flex: 1,
        flexDirection: "row",
        paddingLeft:pxToDp(20),
        paddingRight:pxToDp(20)
    },
    menuWrap: {
        flex: 1,
        alignItems:"center",
    },
    menuImg: {
        marginTop:pxToDp(10),
        width:pxToDp(54),
        height:pxToDp(54)
    },
    menuText:{
      textAlign: 'center',
      fontSize: pxToDp(20),
      height: pxToDp(24),
      lineHeight:pxToDp(24)
    },
    opacity: {
       backgroundColor: 'rgba(0, 0, 0, 0.3)',
       height:"100%",
       justifyContent: 'center',
       alignItems: 'center',
    },
    hint: {
        height: pxToDp(226),
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnsWrap: {
        flexDirection: 'row'
    },
    btn: {
        flex: 1,
        height: pxToDp(90),
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancel: {
        fontSize: pxToDp(32),
        color: '#999999'
    },
    ok: {
        fontSize: pxToDp(32),
        color: "#fe8d00"
    }
});
module.exports=NineBox
