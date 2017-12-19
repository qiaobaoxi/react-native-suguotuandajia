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
  TouchableOpacity
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import fetch from '../js/fetch'
const deviceWidthDp = Dimensions.get('window').width;

const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class NineBox extends React.Component{
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        this.state = {modalVisible: false};
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
            }
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
              })
       
      
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <ScrollView >
                <ImageBackground style={styles.header}  source={require('../images/headerBg.png')}>
                    <View style={{paddingLeft:pxToDp(60),width:"100%"}}>
                        <View style={{width:pxToDp(120),height:pxToDp(120),borderRadius:100,overflow: "hidden"}}>
                            <Image  style={{width:pxToDp(120),height:pxToDp(120),}} source={{uri:this.state.dataSource.user.headerImg}}></Image>
                        </View>
                        <View style={styles.headerNameJifen}>
                            <Text style={styles.headerName}>{this.state.dataSource.user.nickName}{'\n'}</Text>
                            <Text style={styles.headerJifen}>积分：{this.state.dataSource.user.consumption}</Text>
                        </View>
                        <View style={styles.vip}>
                            <Text style={{color:"#0000ee"}}>VIP{this.state.dataSource.user.vip}</Text>
                        </View>
                    </View>
                </ImageBackground>
                  <View style={styles.order}>
                      <View style={styles.myOrder}>
                          <Image style={styles.myOrderImg} source={require('../images/myOrder.png')}></Image>
                          <Text style={styles.myOrderText} onPress={()=>{
                        navigate("MyAllOrder")
                    }}>我的订单</Text>
                          <Text style={styles.allOrderText} onPress={()=>{
                        navigate("MyAllOrder")
                    }}>查看全部订单</Text>
                          <Image  style={styles.allOrderImg} source={require('../images/dir.png')}></Image>
                      </View>
                  </View>
                <View style={styles.goods}>
                    <TouchableOpacity style={styles.goodsWrap} onPress={()=>{
                        navigate("MyAllOrder",{num:0})
                    }}>
                        <Image style={styles.goodsWrapImg} source={require('../images/goods1.png')}></Image>
                        <Text  style={styles.goodsWrapText}>待付款</Text>
                        {this.state.paymentDt==0?'':<View style={styles.goodsWrapSpanWrap}><Text style={styles.goodsWrapSpan}>{this.state.paymentDt}</Text></View>}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.goodsWrap}  onPress={()=>{
                        navigate("MyAllOrder",{num:1})
                    }}>
                        <Image style={styles.goodsWrapImg} source={require('../images/goods2.png')}></Image>
                        <Text  style={styles.goodsWrapText}>待发货</Text>
                        <View style={styles.goodsWrapSpanWrap}><Text  style={styles.goodsWrapSpan}>{this.state.shipmentDt}</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.goodsWrap}  onPress={()=>{
                        navigate("MyAllOrder",{num:2})
                    }}>
                        <Image style={styles.goodsWrapImg} source={require('../images/goods3.png')}></Image>
                        <Text  style={styles.goodsWrapText}>待收货</Text>
                        {this.state.goodsReceiptDt==0?null:<View style={styles.goodsWrapSpanWrap}><Text  style={styles.goodsWrapSpan}>{this.state.goodsReceiptDt}</Text></View>}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.goodsWrap}  onPress={()=>{
                        navigate("MyAllOrder",{num:3})
                    }}>
                        <Image style={styles.goodsWrapImg} source={require('../images/goods4.png')}></Image>
                        <Text  style={styles.goodsWrapText}>待评价</Text>
                        <View style={styles.goodsWrapSpanWrap}><Text  style={styles.goodsWrapSpan}>{this.state.commentDt}</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.goodsWrap}  onPress={()=>{
                        navigate("MyAllOrder",{num:4})
                    }}>
                        <Image style={styles.goodsWrapImg} source={require('../images/goods5.png')}></Image>
                        <Text  style={styles.goodsWrapText}>申请退货</Text>
                        <View style={styles.goodsWrapSpanWrap}><Text  style={styles.goodsWrapSpan}>{this.state.returnReject}</Text></View>
                    </TouchableOpacity>
                </View>
                <View style={styles.line}></View>
                <View></View>
                <View style={styles.discount}>
                    <TouchableOpacity style={styles.discountWrap} onPress={() => navigate('MyCard')}>
                        <View style={styles.discountWrap}>
                            <Text style={styles.discountWrapText}>{this.state.happyCart}</Text>
                            <Text>我的happy卡</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableHighlight style={styles.discountWrap} onPress={() => {
              navigate('MyCoupon')
            }}>
                        <View style={styles.discountWrap}>
                            <Text style={styles.discountWrapText}>{this.state.coupon}</Text>
                            <Text>优惠券</Text>
                        </View>
                    </TouchableHighlight>
                    <View style={styles.verticalLine}>
                    </View>
                </View>
                <View style={styles.line}></View>
                <TouchableOpacity style={styles.evaluationSheet} onPress={() => navigate('MyComment')}>
                    <Image style={styles.evaluationSheetImg1} source={require('../images/camera.png')}></Image>
                    <Text style={styles.evaluationSheetText}>我的评价晒单</Text>
                    <Image style={styles.evaluationSheetImg2} source={require('../images/dir.png')}></Image>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <TouchableOpacity style={styles.evaluationSheet} onPress={() => navigate('AddressManage')}>
                    <Image style={styles.evaluationSheetImg3} source={require('../images/address.png')}></Image>
                    <Text style={styles.evaluationSheetText}>地址管理</Text>
                    <Image style={styles.evaluationSheetImg2} source={require('../images/dir.png')}></Image>
                </TouchableOpacity>
                <View style={styles.line1px}></View>
                <TouchableOpacity style={styles.evaluationSheet} onPress={()=>navigate('MyCollection')}>
                    <Image style={styles.evaluationSheetImg1} source={require('../images/star.png')}></Image>
                    <Text style={styles.evaluationSheetText}>我的收藏</Text>
                    <Image style={styles.evaluationSheetImg2} source={require('../images/dir.png')}></Image>
                </TouchableOpacity>
                <View style={styles.line1px}></View>
                <TouchableOpacity style={styles.evaluationSheet} onPress={()=>navigate('MyInfo')}>
                    <Image style={styles.evaluationSheetImg1} source={require('../images/person.png')}></Image>
                    <Text style={styles.evaluationSheetText}>个人资料</Text>
                    <Image style={styles.evaluationSheetImg2} source={require('../images/dir.png')}></Image>
                </TouchableOpacity>
                <View style={styles.line1px}></View>
                <TouchableOpacity style={styles.evaluationSheet} >
                    <Image style={styles.evaluationSheetImg1} source={require('../images/person.png')}></Image>
                    <Text style={styles.evaluationSheetText}>分享给好友</Text>
                    <Image style={styles.evaluationSheetImg2} source={require('../images/dir.png')}></Image>
                </TouchableOpacity>
                <View style={styles.line}></View>
                <Modal
                  animationType={"fade"}
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {alert("Modal has been closed.")}}
                  >
                 <View style={styles.opacity}>
                  <View style={{backgroundColor:'rgba(255, 255, 255, 1)',position:"absolute",bottom:0,width:'100%'}}>
                    <Text>Hello World!</Text>
                    <TouchableHighlight onPress={() => {
                      this.setModalVisible(!this.state.modalVisible)
                    }}>
                      <Text>Hide Modal</Text>
                    </TouchableHighlight>
                  </View>
                 </View>
                </Modal>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    page0: {
        flex: 1,
        backgroundColor: 'yellow'
    },
    header: {
          height: pxToDp(270),
        width: "100%",
        justifyContent: 'center',  
    },
    headerNameJifen: {
        position: "absolute",
        left: pxToDp(200),
        fontSize: pxToDp(14),
        width: pxToDp(140),
        height: pxToDp(120),
        backgroundColor: 'rgba(0,0,0,0)'
    },
    headerName: {
        fontSize: pxToDp(40)
    },
    headerJifen: {
        fontSize: pxToDp(28),
        color: "#8e8e8e"
    },
    vip: {
        position: "absolute",
        left: pxToDp(320),
        marginTop: pxToDp(10),
        backgroundColor: 'rgba(0,0,0,0)'
    },
    order: {
        width: "100%",
        height: pxToDp(86),
        borderBottomWidth: 1,
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
        marginLeft: pxToDp(20),
        marginRight: pxToDp(10)
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
        paddingTop: pxToDp(40),
        paddingRight: pxToDp(20),
        paddingBottom: pxToDp(40),
        paddingLeft: pxToDp(20),
        backgroundColor: 'white'
    },
    goodsWrap: {
        position:"relative",
        alignItems: 'center',
        width: pxToDp(140),
    },
    goodsWrapImg: {
        width: pxToDp(60),
        height: pxToDp(60),
    },
    goodsWrapText: {
        fontSize: pxToDp(24),
        color: "#666666",
        marginTop: pxToDp(20)
    },
    goodsWrapSpanWrap: {
        position: "absolute",
        top: pxToDp(-10),
        right:0,
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
        width: pxToDp(48),
        height: pxToDp(48),
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
        marginLeft:pxToDp(20),
        height: pxToDp(2),
        width: pxToDp(730),
        backgroundColor:"#e5e5e5",
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
       position:"relative"
    }
});
module.exports=NineBox
