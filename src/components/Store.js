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
  Picker
} from 'react-native';
import citysWrap from '../json/citys.json'
const deviceWidthDp = Dimensions.get('window').width;

const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}

class Store extends Component{
    provinces(citysWrap){
      if(!citysWrap){
        Alert.alert('请传入地区数据')
      }
      let provinces=[]
      for(let i=0;i<citysWrap.provinces.length;i++){
          provinces.push(citysWrap.provinces[i].provinceName)
      }
      return provinces
    }
    citys(citysWrap,provinces){
       if(!citysWrap){
        Alert.alert('请传入地区数据')
      }
      if(!provinces){
        Alert.alert('请传入显示的省份')
      }
      let citys=[]
        for(let i=0;i<citysWrap.provinces.length;i++){
          if(citysWrap.provinces[i].provinceName==provinces){
            for(let j=0;j<citysWrap.provinces[i].citys.length;j++){
                citys.push(citysWrap.provinces[i].citys[j].citysName)
            }
          }
        }
        return citys
    }
    area(citysWrap,provinces,citys){
        if(!citysWrap){
          Alert.alert('请传入地区数据')
        }
        if(!provinces){
          Alert.alert('请传入显示的省份')
        }
        if(!citys){
          Alert.alert('请传入显示的城市')
        }
       let area=[]
        for(let i=0;i<citysWrap.provinces.length;i++){
          if(citysWrap.provinces[i].provinceName==provinces){
            for(let j=0;j<citysWrap.provinces[i].citys.length;j++){
                if(citysWrap.provinces[i].citys[j].citysName==citys){
                   for(let k=0;k<citysWrap.provinces[i].citys[j].area.length;k++){
                       area.push(citysWrap.provinces[i].citys[j].area[k])    
                   }
                }
            }
          }
        }
        return area
    }
     os() {
      if(Platform.OS==='android'){ 
        return (
          <View style={styles.PickerWrap}>
            <Picker
              style={styles.Picker}
              itemStyle={styles.itempicker} 
              selectedValue={this.state.selectedProvinces}
              onValueChange={(lang) => this.setState({selectedProvinces: lang,citys:this.citys(citysWrap,lang),area:this.area(citysWrap,lang,this.citys(citysWrap,lang)[0])})}>
              {
                this.state.provinces.map((item)=>  <Picker.Item label={item} value={item} />)
              }
            </Picker>
            <Picker
              style={styles.Picker}
              selectedValue={this.state.selectedCitys}
              itemStyle={styles.itempicker} 
              onValueChange={(lang) => this.setState({selectedCitys: lang,area:this.area(citysWrap,this.state.selectedProvinces,lang)})}>
              {
                this.state.citys.map((item)=>  <Picker.Item label={item} value={item} />)
              }
            </Picker>
            <Picker
              style={styles.Picker}
              selectedValue={this.state.selectedArea}
              itemStyle={styles.itempicker}
              onValueChange={(lang) => this.setState({selectedArea: lang})}>
              {
                this.state.area.map((item)=>  <Picker.Item label={item}   value={item} />)
            }
            </Picker>
            <Image style={styles.down1} source={require('../images/down.png')}></Image>
            <Image style={styles.down2} source={require('../images/down.png')}></Image>
            <Image style={styles.down3} source={require('../images/down.png')}></Image>
          </View>
        
        )
        //如果是android平台
      }else{
        return (
          <View style={styles.PickerWrap}>
            <Picker
              style={styles.Picker}
              itemStyle={styles.itempicker} 
              selectedValue={this.state.selectedProvinces}
              onValueChange={(lang) => this.setState({selectedProvinces: lang,citys:this.citys(citysWrap,lang),area:this.area(citysWrap,lang,this.citys(citysWrap,lang)[0])})}>
              {
                this.state.provinces.map((item)=>  <Picker.Item label={item} value={item} />)
              }
            </Picker>
            <Picker
              style={styles.Picker}
              selectedValue={this.state.selectedCitys}
              itemStyle={styles.itempicker} 
              onValueChange={(lang) => this.setState({selectedCitys: lang,area:this.area(citysWrap,this.state.selectedProvinces,lang)})}>
              {
                this.state.citys.map((item)=>  <Picker.Item label={item} value={item} />)
              }
            </Picker>
            <Picker
              style={styles.Picker}
              selectedValue={this.state.selectedArea}
              itemStyle={styles.itempicker}
              onValueChange={(lang) => this.setState({selectedArea: lang})}>
              {
                this.state.area.map((item)=>  <Picker.Item label={item}   value={item} />)
            }
            </Picker>
          </View>
        
        )
      }
    }
    constructor(props) {
        super(props);
        // console.disableYellowBox = true;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // Alert.alert(JSON.stringify(this.provinces(citysWrap)))
        this.state = {
          dataSource: ds.cloneWithRows([{
            logo: require('../images/logo.png'),
            name: '苏果生活超市-中央路店',
            address: '江苏省南京市玄武区中央路385-1号',
            distance: '500m',
          },{
            logo: require('../images/logo.png'),
            name: '苏果生活超市-中央路店asdfasdf',
            address: '江苏省南京市玄武区中央路385-1号',
            distance: '700m',
          },{
            logo: require('../images/logo.png'),
            name: '苏果生活超市-中央路店asdfasdf',
            address: '江苏省南京市玄武区中央路385-1号',
            distance: '700m',
          },{
            logo: require('../images/logo.png'),
            name: '苏果生活超市-中央路店asdfasdf',
            address: '江苏省南京市玄武区中央路385-1号',
            distance: '700m',
          }]),
          provinces: this.provinces(citysWrap),
          citys: this.citys(citysWrap,this.provinces(citysWrap)[0]),
          area: this.area(citysWrap,this.provinces(citysWrap)[0],this.citys(citysWrap,this.provinces(citysWrap)[0])[0]),
          selectedProvinces: this.provinces(citysWrap)[0],
          selectedCitys: this.citys(citysWrap,this.provinces(citysWrap)[0])[0],
          selectedArea: this.area(citysWrap,this.provinces(citysWrap)[0],this.citys(citysWrap,this.provinces(citysWrap)[0])[0])[0]
        };
        
    }
    hidden(selected){
        if(selected!=0){
            return null
        }
         return (
                  <View style={styles.location}>
                    <Image style={styles.locationImg} source={require('../images/address-1.png')}></Image>
                    <Text style={styles.locationText}>当前定位</Text>
                  </View>
                )
    }
    render(){
      const { navigate,goBack } = this.props.navigation;
        return(
          <View style={{}}>
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
            {this.os()}
            <ScrollView contentContainerStyle={styles.scrollView}>
                <ListView
                  dataSource={this.state.dataSource}
                  renderRow={(rowData,index,selected) => 
                    <View style={styles.list}>
                     <View style={styles.listWrap}>
                       <Image style={styles.listLogo} source={rowData.logo}></Image>
                     </View>
                     <View style={styles.addressWrap}>
                       <View style={styles.name}><Text>{rowData.name}</Text>{this.hidden(selected)}</View>
                       <View><Text style={styles.address}>{rowData.address}</Text></View>
                       <View style={styles.distanceWrap}><Image style={styles.distanceImg} source={require('../images/address.png')}></Image><Text style={styles.distance}>{rowData.distance}</Text></View>
                     </View>
                     <View style={styles.dir}>
                       <Image style={styles.dirImg} source={require('../images/dir.png')}></Image>
                     </View>
                    </View>
                  }
                />
            </ScrollView>
          </View> 
        );
    }
}
const styles = StyleSheet.create({
     search: {
      flexDirection :'row',
      alignItems: "center",
      paddingTop: pxToDp(30),
      height: pxToDp(94),
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
      top: pxToDp(45),
      right: pxToDp(46),
      width: pxToDp(34),
      height: pxToDp(34),
    },
    scrollView: {
       paddingBottom: pxToDp(222)
    },
    PickerWrap:{
      borderTopWidth: pxToDp(1),
      borderTopColor: '#daddde',
      flexDirection: 'row',
      backgroundColor: 'white',
      position: 'relative',
      textAlign: 'center'
    },
    Picker: {
      flex: 1,
      height: pxToDp(96),
      backgroundColor:'white'
    },
    itempicker: {
      flex: 1,
      backgroundColor:'white'
    },
    opacity:{
      opacity:0
    },
    down1: {
      width: pxToDp(12),
      height: pxToDp(7),
      position:'absolute',
      left: pxToDp(130),
      top: pxToDp(44)
    },
    down2: {
      width: pxToDp(12),
      height: pxToDp(7),
      position:'absolute',
      left: pxToDp(376),
      top: pxToDp(44)
    },
    down3: {
      width: pxToDp(12),
      height: pxToDp(7),
      position:'absolute',
      left: pxToDp(626),
      top: pxToDp(44)
    },
    list: {
      flexDirection: 'row',
      marginTop: pxToDp(10),
      marginLeft: pxToDp(4),
      marginRight: pxToDp(4),
      paddingTop: pxToDp(26),
      paddingBottom: pxToDp(26),
      backgroundColor: 'white',
      alignItems: 'center'
    },
    listWrap: {
      borderWidth: pxToDp(1),
      borderColor: '#daddde',
      width: pxToDp(128),
      height: pxToDp(128),
      marginLeft: pxToDp(22),
      marginRight: pxToDp(18)
    },
    listLogo: {
      width: '100%',
      height: '100%'
    },
    name: {
      marginTop: pxToDp(16),
      color: '#010101',
      fontSize: pxToDp(28),
      position: 'relative'
    },
    addressWrap: {
      width: pxToDp(500)
    },
    address: {
      color: '#818181',
      fontSize: pxToDp(24),
      marginTop: pxToDp(10),
    },
    location: {
      position:'absolute',
      right:0,
      flexDirection: 'row',
      alignItems:'center'
    },
    locationImg: {
      width: pxToDp(24),
      height: pxToDp(28),
      position: 'relative',
      zIndex: 100
    },
    locationText: {
      color: '#f68900',
      fontSize: pxToDp(20),
      borderWidth: pxToDp(1),
      borderColor: '#f68900',
      borderRadius: 6,
      paddingLeft: pxToDp(22),
      paddingRight: pxToDp(10),
      position:'relative',
      left:pxToDp(-17)
    },
    distanceWrap: {
      marginTop: pxToDp(10),
      flexDirection: 'row',
      alignItems:'center'
    },
    distanceImg: {
      width: pxToDp(16),
      height: pxToDp(18),
      marginRight: pxToDp(10)
    },
    distance: {
      fontSize: pxToDp(24),
      color: '#818181'
    },
    dir: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    dirImg: {
      width: pxToDp(24),
      height: pxToDp(36)
    }
});
module.exports=Store