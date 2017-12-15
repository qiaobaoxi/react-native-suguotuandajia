/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
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
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  TextInput ,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  ListView,
  Modal,
  AsyncStorage,
  RefreshControl,
  SectionList,
  FlatList
} from 'react-native';

import fetch from '../js/fetch'
const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height;


const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
function scrrollHeight(uiElementHeight) {
  return deviceHeightDp-uiElementHeight;
}
global.back='Goods'
class Goods extends Component{
    constructor(props) {
        super(props);
        Alert.alert(''+this.props.num)
        let url = global.url+"/API/home/getGoodsList"
        const { params } = this.props.navigation.state;
        if (typeof params != 'object') {
            return
        }
        let params1 = {addressLabel:"00060001",categoryId:71,keyword:"",loadAll:false,pageIndex:0}
        this.state={dataSource:[],modalVisible: false,
          num: 1,
          url,params1,
          goods : [
          ],
          isLoad:false
        }
        this.getGoodsList()
        // AsyncStorage.getItem('goods',(error,result)=>{
        //   this.setState({alrGoods:JSON.parse(result)})
        //   this.getGoodsList()
        // })
    }
    getGoodsList(){
      fetch(this.state.url,'post',this.state.params1,(responseData)=>{
        if(responseData.data.goods.length==0){
          this.setState({isLoad:false})
          return
        }
        for(var i=0;i<responseData.data.goods.length;i++){
          var good=responseData.data.goods[i]
          let specs=''
          if (good.specs.length>1) {
              specs = '多规格'
          } else {
              specs = good.specs[0].spec
          }
          let specsId = ''
          if (good.specs.length==1) {
            specsId = good.specs[0].id
          } 
          let num=0
          if(this.state.alrGoods){
            for(let i=0;i<this.state.alrGoods.length;i++){
              if(good.id==this.state.alrGoods[i].id){
                num=this.state.alrGoods[i]
              }
            }
          }
          this.state.goods.push({id: good.id,
            img: good.goodImg,
            name: good.goodName,
            price: good.price,
            specs: specs,
            specsId: specsId,
            num: num})
        }
        this.setState({dataSource:this.state.goods,isLoad:false,isNextSuccess:1});
        clearTimeout(this.state.timer)
      })
      fetch(global.url+'/API/MyCart/getShopCartList','post','',(responseData)=>{
        if(responseData.success){
          let totalPrice = 0
          let cartNum = 0
          global.goods = []
          for(let i = 0;i < responseData.data.shopCartListDt.length;i++){
            totalPrice += responseData.data.shopCartListDt[i].price*responseData.data.shopCartListDt[i].count
            cartNum += responseData.data.shopCartListDt[i].count
            global.goods.push({goodSpecId:responseData.data.shopCartListDt[i].goodSpecId,count:responseData.data.shopCartListDt[i].count})
          }
          totalPrice = totalPrice.toFixed(2)
          this.setState({cartNum,totalPrice});
        }else{
          Alert.alert(responseData.message)
        }
      })
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    _renderRow(data,index) {
        return (
          <View style={styles.goods}>
                   <Image style={styles.goodsImg} resizeMode={'stretch'} source={{uri:data.img}}></Image>
                   <View><Text style={styles.goodsName} numberOfLines={1}>{data.name}</Text></View>
                   <View><Text style={styles.goodsSpecifications}>规格：{data.specs}</Text></View>
                   <View style={styles.goodsPriceWrap}>
                     <Text style={styles.goodsPriceSymbol}>¥</Text><Text style={styles.goodsPriceNumber}>{data.price}</Text>
                     <TouchableOpacity onPress={()=>{
                         for (i=0;i<this.state.dataSource.length;i++) {
                            if (i==index) {
                                let good=this.state.dataSource[i]
                                let params={
                                  id: good.id,
                                  count: '1',
                                  goodImg: good.img,
                                  goodName: good.name,
                                  goodspecifications: good.specsId,
                                  price: good.price
                                }
                                    fetch(global.url+'/API/ProductDetail/joinCart','post',params,(responseData)=>{
                                      this.getGoodsList()
                                        // this.setState({num:responseData.cartNum})
                                        // Alert.alert(JSON.stringify(responseData))
                                    })
                                    this.state.dataSource[i].num++ 
                                    // AsyncStorage.getItem('goods',(error,result)=>{
                                    // if (error!=null){  
                                    //    console.log("error message:"+error.message);  
                                    //    return;  
                                    // } 
                                    // let goods=[] 
                                    // if(result){
                                    //   let index=-1
                                    //   let res=JSON.parse(result)
                                    //   for (let i=0;i<res.length;i++)  {
                                    //       if (res[i].id==good.id) {
                                    //         index=i   
                                    //       }
                                    //   }
                                    //   if (index!=-1) {
                                    //     res[index].num++
                                    //     goods = res
                                    //   } else {
                                    //     res.push(good)
                                    //     Alert.alert(JSON.stringify(res))
                                    //     goods = res
                                    //   }
                                    //    AsyncStorage.setItem("goods",JSON.stringify(goods)).then(  
                                    //    ()=>{  
                                    //         Alert.alert("write one success ");  
                                    //      }).catch(  
                                    //         (error)=>{  
                                    //          Alert.alert("write one error");  
                                    //         }  
                                    //   ); 
                                    // }else{
                                      // if(result==null){
                                      //   goods.push(good)
                                      //   AsyncStorage.setItem("goods",JSON.stringify(goods)).then(  
                                      //    ()=>{  
                                      //         Alert.alert("write one success");  
                                      //      }).catch(  
                                      //         (error)=>{  
                                      //          Alert.alert("write one error");  
                                      //         }  
                                      //   );
                                      // } 
                                    // }
                                // })
                            }
                         }
                         var newData = JSON.parse(JSON.stringify(this.state.dataSource));
                         this.setState({dataSource:newData})
                     }} style={data.num===0?styles.goodsPriceAdd:styles.goodsPriceAddActive}><Image style={styles.goodsPriceAddImg} resizeMode={'stretch'} source={data.num===0?require('../images/add.png'):require('../images/add1.png')}></Image></TouchableOpacity>
                   </View>
          </View>
        );
    }
    _contentViewScroll(e:Object){
      if(this.state.dataSource.length>0&&this.state.isNextSuccess!=0){
        
        clearTimeout(this.state.timer)
        this.setState({isLoad:true})
          this.state.timer=setTimeout(()=>{
              this.state.params1.pageIndex++
              this.setState({params1:this.state.params1,isNextSuccess:0})
              this.getGoodsList()
          },1000)
      }
      
    
     }
    render(){
      const { navigate,goBack } = this.props.navigation;
        return(
            <View>
              <View style={styles.search}>
                <TouchableOpacity style={{height:'100%',justifyContent:"center"}} onPress={() => goBack()}>
                  <Image style={styles.searchBack} source={require('../images/back.png')}></Image>
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    underlineColorAndroid={'transparent'}
                    placeholder={'输入关键字直接搜索'}
                    placeholderTextColor={'#a6a6a6'}
                 />
                 <Image style={styles.searchImg} source={require('../images/search.png')}></Image>
              </View>
              {/* <SectionList
                  // stickySectionHeadersEnabled={true}
                  onEndReached={()=>{this._contentViewScroll()}}
                  // refreshing={true}
                  onEndReachedThreshold={0}
                  contentContainerStyle={styles.listWrap}
                  renderItem={({item}) => this._renderRow(item)}
                  ListFooterComponent={()=><View style={this.state.isLoad?styles.more:styles.hidden}><Text style={styles.moreText}>加载更多</Text><Image source={require('../images/load.gif')}></Image></View>}
                  sections={this.state.dataSource}
                /> */}
                <FlatList
                  contentContainerStyle={styles.listWrap}
                  horizontal={false}
                  numColumns={2}
                  data={this.state.dataSource}
                  extraData={this.state}
                  renderItem={({item,index}) => this._renderRow(item,index)}
                  ListFooterComponent={()=><View style={this.state.isLoad?styles.more:styles.hidden}><Text style={styles.moreText}>加载更多</Text><Image source={require('../images/load.gif')}></Image></View>}
                  onEndReached={this._contentViewScroll.bind(this)}
                  onEndReachedThreshold={0}
                  getItemLayout={(data, index) => ( {length: pxToDp(550), offset: pxToDp(550) * index, index} )}
              />
               <View style={styles.settlementColumn}>
                  <Image style={styles.shoppingCart} source={require('../images/goodsIncart.png')}></Image>
                  <View style={this.state.cartNum<100?styles.badgeWrap:styles.badgeWrap1}><Text style={styles.badge}>{this.state.cartNum}</Text></View>
                  <View style={styles.goPayWrap}>
                    <Text style={styles.goPayTotalPrice}>合计：</Text><Text style={styles.goPayTotalPriceSymbol}>¥</Text><Text style={styles.totalPrice}>{this.state.totalPrice}</Text><TouchableHighlight style={styles.settlement} onPress={() => navigate('Order')}><Text style={{color: 'white',}}>去结算</Text></TouchableHighlight>
                  </View>
               </View>
               <Modal
                  animationType={"fade"}
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {alert("Modal has been closed.")}}
                  >
                 <View style={styles.opacity}>
                  <View style={{paddingTop: pxToDp(50),position: "absolute",bottom:0,width:'100%'}}>
                    <View style={styles.modelImgWrap}>
                          <Image style={styles.modelImg} source={require('../images/modelGood.jpg')}></Image> 
                    </View> 
                    <View style={{backgroundColor:'rgba(255, 255, 255, 1)'}}>
                       <View style={styles.modelHeader}>
                           <View style={styles.priceWrap} >
                              <Text style={styles.price}>¥ 49.00</Text>
                              <Text style={styles.specifications}>已选：S码</Text>
                           </View>
                           <TouchableOpacity style={styles.modelClose}>
                             <Image style={styles.modelCloseImg} source={require('../images/close.png')}></Image>
                           </TouchableOpacity>
                       </View>
                       <View style={styles.selectionSpecification}>
                            <View ><Text style={styles.selectionSpecificationText}>规格</Text></View>
                            <ListView
                                contentContainerStyle={styles.selectionSpecificationList}
                                dataSource={this.state.specification}
                                renderRow={(rowData,index,selected) => <TouchableOpacity onPress={
                                  ()=>{
                                    for(let i=0;i<this.state.specification._dataBlob.s1.length;i++){
                                        if(i==selected){
                                            this.state.specification._dataBlob.s1[i].selected=true
                                        }else{
                                            this.state.specification._dataBlob.s1[i].selected=false
                                        }
                                    }
                                    let newSpecification=JSON.parse(JSON.stringify(this.state.specification._dataBlob.s1))
                                    this.setState({specification:this.state.dataSource.cloneWithRows(newSpecification)})
                                  }
                                }><Text style={rowData.selected?styles.selectionSpecificationListTextActive:styles.selectionSpecificationListText}>{rowData.code}</Text></TouchableOpacity>}
                            />
                       </View>
                       <View style={styles.specificationNumber}>
                         <Text style={styles.specificationNumberTitle}>数量</Text>
                         <View style={styles.specificationNumberFunction}>
                          <TouchableOpacity style={styles.specificationNumberFunctionMinusSign} onPress={
                            ()=>{
                               if(this.state.num > 1){
                                  let newNum=this.state.num-1
                                  this.setState({num:newNum})
                               }
                            }
                          }>
                           <View style={styles.specificationNumberMinusSignWrap}>
                            <Image style={styles.specificationMinusSign} source={require('../images/minusSign.png')}></Image>
                           </View> 
                          </TouchableOpacity>
                          <Text style={styles.specificationNumberText}>{this.state.num}</Text>
                          <TouchableOpacity style={styles.specificationNumberFunctionAdd} onPress={
                            ()=>{
                               let newNum=this.state.num+1
                               this.setState({num:newNum})
                            }
                          }>
                           <View style={styles.specificationNumberAddWrap}>
                            <Image style={styles.specificationNumberAdd} source={require('../images/add1.png')}></Image>
                           </View> 
                          </TouchableOpacity>
                         </View>
                       </View>
                       <TouchableOpacity >
                         <View><Text style={styles.modelBtn}>加入购物车</Text></View>
                       </TouchableOpacity>
                    </View>
                   </View>
                 </View>
                </Modal>
            </View> 
        );
    }
}
const styles = StyleSheet.create({
    search: {
      flexDirection :'row',
      alignItems: "center",
      height: pxToDp(153),
      paddingTop: pxToDp(40),
      borderWidth: pxToDp(1),
      borderBottomColor: '#daddde',
      backgroundColor: 'white',
      position:'relative'
    },
    searchBack: {
      marginLeft: pxToDp(26),
      marginRight: pxToDp(26),
      width: pxToDp(23),
      height: pxToDp(40),
    },
    searchInput: {
      padding: 0,
      paddingLeft: pxToDp(38),
      width: pxToDp(652),
      height: pxToDp(54),
      backgroundColor:"#eeeeee",
      borderRadius:pxToDp(38)
    },
    searchImg: {
      position:'absolute',
      top: pxToDp(80),
      right: pxToDp(46),
      width: pxToDp(34),
      height: pxToDp(34),
    },
    listWrap:{
      // flexDirection:'row',
      // flexWrap:'wrap',
      paddingBottom: pxToDp(294),
    },
    goods:{
      marginTop: pxToDp(10),
      width: pxToDp(355),
      backgroundColor: 'white',
      height: pxToDp(540),
      marginLeft: pxToDp(9),
      marginRight: pxToDp(9)
    },
    goodsImg:{
      width: '100%',
      height: pxToDp(386)
    },
    goodsName: {
       marginLeft: pxToDp(20),
       marginRight: pxToDp(20),
       marginBottom:pxToDp(18)
    },
    goodsSpecifications: {
       fontSize:pxToDp(24),
       marginLeft:pxToDp(24),
       color:'#a2a2a2'
    },
    goodsPriceWrap: {
      position:'relative',
      marginBottom: pxToDp(22),
      marginRight: pxToDp(5),
      flexDirection: 'row',
      alignItems:"center"
    },
    goodsPriceSymbol: {
      marginLeft: pxToDp(20),
      marginTop: pxToDp(5),
      fontSize: pxToDp(26),
      color:'#ff3f00',
    },
    goodsPriceNumber: {
      fontSize: pxToDp(36),
      color: "#ff3f00"
    },
    goodsPriceAdd: {
      position: 'absolute',
      right: pxToDp(20),
      width: pxToDp(40),
      height: pxToDp(40),
      textAlignVertical:'center',
      textAlign: 'center',
      borderRadius: 36,
      borderWidth: pxToDp(1),
      borderColor: '#dadbde',
      color: '#ff8e00',
      justifyContent: 'center',
      alignItems: 'center'
    },
    goodsPriceAddImg:{
      width: pxToDp(20),
      height: pxToDp(20)
    },
    goodsPriceAddActive: {
      position: 'absolute',
      right: pxToDp(20),
      width: pxToDp(40),
      height: pxToDp(40),
      textAlignVertical:'center',
      textAlign: 'center',
      borderRadius: 36,
      borderWidth: pxToDp(1),
      borderColor: '#ff8e00',
      backgroundColor:'#ff8e00',
      color:'white',
      justifyContent: 'center',
      alignItems: 'center'
    },
    hidden:{
      opacity:0   
    },
    goodsPriceSub: {
      position: 'absolute',
      right: pxToDp(130),
      width: pxToDp(50),
      height: pxToDp(50),
      textAlignVertical:'center',
      textAlign: 'center',
      borderRadius: 36,
      borderWidth: pxToDp(1),
      borderColor: '#dadbde',
      color: '#b0b0b0', 
    },
    goodsNum:{
      position: 'absolute',
      right: pxToDp(70),
      width: pxToDp(60),
      textAlign:'center',
      fontSize: pxToDp(36),
    },
    opacity: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      height:"100%",
      position:"relative",

    },
    modelHeader: {
      position:'relative',
      borderBottomWidth: pxToDp(1),
      borderBottomColor: '#daddde',
    },
    modelImgWrap: {
      position:'absolute',
      top: pxToDp(0),
      zIndex: 1000,
      left: pxToDp(26),
      width: pxToDp(216),
      height: pxToDp(216),
      borderWidth: pxToDp(1),
      borderColor: '#daddde',
      borderRadius: 2,
      overflow:'hidden'
    },
    modelImg: {
      width: pxToDp(216),
      height: pxToDp(216),
    },
    priceWrap: {
      marginLeft: pxToDp(268)
    },
    price: {
       marginTop: pxToDp(70),
       fontSize: pxToDp(36),
       color:'#ff3f00',
    },
    specifications: {
      marginTop: pxToDp(28),
      marginBottom: pxToDp(30),
      fontSize: pxToDp(24),
      color: '#a2a2a2'
    },
    modelClose: {
      position: 'absolute',
      right: pxToDp(20),
      top: pxToDp(30),
      width: pxToDp(26),
      height: pxToDp(26)
    },
    modelCloseImg: {
      width: '100%',
      height: '100%'
    },
    selectionSpecification: {
      paddingLeft: pxToDp(26),
      paddingBottom: pxToDp(30),
      borderBottomWidth: pxToDp(1),
      borderBottomColor:'#daddde'
    },
    selectionSpecificationText: {
      marginTop: pxToDp(34)
    },
    selectionSpecificationList: {
      flexDirection: 'row',
      flexWrap:'wrap',
    },
    selectionSpecificationListText: {
      marginTop: pxToDp(20),
      marginRight: pxToDp(20), 
      width: pxToDp(160),
      height: pxToDp(64),
      borderWidth: pxToDp(1),
      borderColor: '#daddde',
      borderRadius: 5,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: pxToDp(28),
      color:'#a2a2a2'
    },
    badgeWrap:{
      position:'absolute',
      left: pxToDp(94),
      width: pxToDp(34),
      height: pxToDp(34),
      textAlign: 'center',
      textAlignVertical: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: pxToDp(20),
      color: 'white',
      backgroundColor: '#f43530',
      borderWidth: pxToDp(1),
      borderColor: 'white',
      borderRadius: 100,
      borderTopLeftRadius: 100,
      zIndex: 2000,
      overflow: "hidden",
    },
    badgeWrap1:{
      position:'absolute',
      left: pxToDp(94),
      width: pxToDp(54),
      height: pxToDp(34),
      textAlign: 'center',
      textAlignVertical: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: pxToDp(20),
      color: 'white',
      backgroundColor: '#f43530',
      borderWidth: pxToDp(1),
      borderColor: 'white',
      borderRadius: 100,
      borderTopLeftRadius: 100,
      zIndex: 2000,
      overflow: "hidden",
    },
    badge:{
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: pxToDp(20),
      color: 'white',
      backgroundColor: '#f43530',
      borderWidth: pxToDp(1),
      borderColor: 'white',
      borderRadius: 100,
      borderTopLeftRadius: 100,
      zIndex:2000
    },
    selectionSpecificationListTextActive: {
      marginTop: pxToDp(20),
      marginRight: pxToDp(20), 
      width: pxToDp(160),
      height: pxToDp(64),
      borderWidth: pxToDp(1),
      borderColor: '#ff8e00',
      borderRadius: 5,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: pxToDp(28),
      color:'white',
      backgroundColor:'#ff8e00'
    },
    specificationNumber: {
      position:'relative',
      height: pxToDp(140),
    },
    specificationNumberTitle: {
      marginTop: pxToDp(30),
      marginLeft: pxToDp(26),
      fontSize: pxToDp(28),
      color:'#a2a2a2'
    },
    specificationNumberFunction:{
      position: 'absolute',
      right: pxToDp(24),
      top: pxToDp(30),
      flexDirection: 'row'
    },
    specificationNumberFunctionMinusSign: {
      width: pxToDp(60),
      height: pxToDp(60),
    },
    specificationNumberMinusSignWrap: {
      marginLeft: pxToDp(20),
      width: pxToDp(40),
      height: pxToDp(40),
      borderWidth: pxToDp(1),
      borderColor: '#dadbde',
      borderRadius: 100,
      textAlign: 'center',
      justifyContent:'center',
      alignItems:"center",
    },
    specificationMinusSign: {
      width: pxToDp(21),
      height: pxToDp(6),
    },
    specificationNumberFunctionAdd: {
       width: pxToDp(60),
       height: pxToDp(60),
    },
    specificationNumberAddWrap: {
      width: pxToDp(40),
      height: pxToDp(40),
      borderWidth: pxToDp(1),
      borderColor: '#ff8e00',
      borderRadius: 100,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: "center",
      backgroundColor: '#ff8e00'
    },
    specificationNumberAdd: {
      width: pxToDp(21),
      height: pxToDp(21)
    },
    specificationNumberText: {
      width: pxToDp(60),
      height: pxToDp(40),
      fontSize: pxToDp(28),
      color: '#2b2b2b',
      textAlign: 'center',
    },
    more: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: pxToDp(750),
      marginTop: pxToDp(20),
      height: pxToDp(60),
      backgroundColor: 'white',
      opacity:1
    },
    moreText: {
      textAlign: 'center'
    },
    settlementColumn: {
       height: pxToDp(140),
       backgroundColor: 'rgba(0,0,0,0)',
       paddingTop: pxToDp(34),
       position: 'absolute',
       bottom:82,
       left: 0,
       right: 0,
      //  backgroundColor: 'blue',
    },
    shoppingCart: {
      position: 'absolute',
      left: pxToDp(20),
      zIndex:1000,
      width: pxToDp(120),
      height: pxToDp(120),
    },
    goPayWrap: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      height: pxToDp(120),
      backgroundColor:'white',
      position:'relative',
      paddingLeft: pxToDp(158),
    },
    goPayTotalPrice: {
      fontSize: pxToDp(28),
      color: '#a2a2a2'
    },
    goPayTotalPriceSymbol: {
      fontSize: pxToDp(28),
      color: '#ff3f00'
    },
    totalPrice: {
      fontSize: pxToDp(36),
      color: '#ff3f00',
    },
    settlement: {
      position:'absolute',
      right: 0,
      height: "100%",
      width: pxToDp(214),
      backgroundColor: '#ff8e00',
      textAlign: 'center',
      textAlignVertical: 'center',
      color: 'white',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modelBtn: {
      height: pxToDp(105),
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      backgroundColor:'#ff8e00'
    }
});
module.exports=Goods 