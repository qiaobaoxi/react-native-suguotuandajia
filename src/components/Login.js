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
  Alert,
  ListView,
  TextInput,
  Button,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import fetch from '../js/fetch'
import Cookie from 'react-native-cookie';
const deviceWidthDp = Dimensions.get('window').width;

const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class Login extends Component{
    constructor(props) {
        super(props);
        this.state={tel: '',code: '',disabled:true,codeDisabled:true,getCodeText:'获取验证码'}
    }
    submit(){
        const { navigate } = this.props.navigation;
        let params={
            mobileNo: this.state.tel,
            smsCode: this.state.code
        }
        fetch(global.url+'/api/user/UserLogin','post',params,(responseData)=>{
            console.log(responseData)
            if(responseData.result){
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
                    let data = ret
                    for(let i=0;i<data.length;i++){
                        fetch(global.url+'/API/ProductDetail/joinCart','post',data[i],(responseData)=>{
                            // this.setState({num:responseData.cartNum})
                            // Alert.alert(JSON.stringify(responseData))
                        })
                    }
                    global.storage.remove({
                        key: 'goods'
                    });
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
                    global.storage.save({
                      key: 'Cookie',  // 注意:请不要在key中使用_下划线符号!
                      data: cookie.userId
                    });
                  });
                  navigate('Home')
            }else{
                Alert.alert(responseData.errMsg)
            }
        },(error)=>{
          console.log(error)
        })
    }
    isDisabled(){
        if (this.state.tel.length == 11) {
          this.setState({codeDisabled: false})
        } else {
          this.setState({codeDisabled: true}) 
        }
        if (this.state.tel && this.state.code) {
            this.setState({disabled: false})
         }else{
            this.setState({disabled: true})
         }
    }
    render(){
        const { navigate,goBack } = this.props.navigation;
        return(
            <View style={{backgroundColor:'white',height: '100%'}}>
                <ImageBackground style={styles.header}  source={require('../images/headerBg.jpg')}>
                    <TouchableOpacity style={styles.headerBack} onPress={()=>{goBack()}}>
                        <Image style={styles.headerBackImg} source={require('../images/back1.png')}></Image>
                    </TouchableOpacity>
                    <Text style={styles.headerText}>登录</Text>
                </ImageBackground>    
                <View>
                    <View style={styles.logo}>
                      <Image style={styles.logoImg} source={require('../images/login-logo.png')}></Image>
                    </View>
                    <View style={styles.tel}>
                      <TextInput keyboardType="numeric" maxLength = {11} onChangeText={(text) => {
                          this.setState({tel:text},()=>{
                            this.isDisabled()
                          })
                        }} style={[styles.telInput,styles.input]} underlineColorAndroid={'transparent'} placeholder={'手机号'} placeholderTextColor={'#a2a2a2'}/>
                    </View>
                    <View style={[styles.code,styles.input]}>
                      <TextInput keyboardType="numeric"  onChangeText={(text) => {
                          this.setState({code:text},()=>{
                            this.isDisabled()
                          })
                          }} style={styles.codeInput} underlineColorAndroid={'transparent'} placeholder={'验证码'} placeholderTextColor={'#a2a2a2'}/>
                      <TouchableOpacity style={styles.button} onPress={()=>{
                          let num=60
                          let params = {
                            "mobileNo": this.state.tel,
                          }
                          fetch(global.url+'/api/user/GetSMScode','post',params,(responseData)=>{
                              if(!responseData.result){
                                Alert.alert(errMsg)
                              }
                          },(error)=>{
                            console.log(responseData)
                          })
                          let timer=setInterval(()=>{
                             num--
                             this.setState({getCodeText:num+'s重新获取',codeDisabled: true})
                             if(num==0){
                                
                                clearInterval(timer)
                                this.setState({getCodeText:'获取验证码',codeDisabled: false})
                             }
                          },1000)
                      }} disabled={this.state.codeDisabled}><Text style={styles.buttonText}>{this.state.getCodeText}</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity style={this.state.disabled?styles.submit:styles.submit1} disabled={this.state.disabled} onPress={this.submit.bind(this)}>
                        <Text style={styles.submitText}>登录</Text>
                    </TouchableOpacity>
                </View>
            </View>    
        );
    }
}
const styles = StyleSheet.create({
    header:{
       paddingTop: pxToDp(40),
       height: pxToDp(134),
       backgroundColor: 'white',
       alignItems: 'center',
       justifyContent: 'center',
       position: 'relative'
    },
    headerBack:{
       position: 'absolute',
       left: pxToDp(26),
       bottom: pxToDp(32),
       width: pxToDp(50),
       height: pxToDp(50)
    },
    headerBackImg: {
       marginTop: pxToDp(15), 
       width: pxToDp(40),
       height: pxToDp(40),
    },
    headerText: {
       fontSize: pxToDp(36),
       backgroundColor: 'rgba(0,0,0,0)',
       color: 'white'
    },
    logo: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoImg: {
        marginTop: pxToDp(108),
        marginBottom: pxToDp(52),
        width: pxToDp(247),
        height: pxToDp(148),
    },
    input: {
        height: pxToDp(94),
        backgroundColor: 'white',
        borderWidth: pxToDp(1),
        borderColor: '#daddde',
        borderRadius: 5,
    },
    tel: {
        marginBottom: pxToDp(19),
        justifyContent: 'center',
        alignItems: 'center',
    },
    telInput: {
        marginLeft: '7%',
        marginRight: '7%',
        paddingLeft: pxToDp(26),
        width: '86%',
    },
    code: {
        flexDirection: 'row',
        marginBottom: pxToDp(19),
        width: '86%',
        marginLeft: '7%',
        marginRight: '7%',
        alignItems: 'center'
    },
    codeInput: {
        width: pxToDp(402),
        paddingLeft: pxToDp(26),
        height: '100%'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: pxToDp(50),
        width: pxToDp(244),
        borderLeftColor: '#dfdfdf',
        borderLeftWidth: pxToDp(1)
    },
    buttonText: {
        // color: '#ff8e00',
        fontSize: pxToDp(32),
        
    },
    submit: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '86%',
        marginLeft: '7%',
        marginRight: '7%',
        height: pxToDp(94),
        backgroundColor: '#a2a2a2',
        borderRadius: 5,
        marginTop: pxToDp(30)
    },
    submit1:{
        alignItems: 'center',
        justifyContent: 'center',
        width: '86%',
        marginLeft: '7%',
        marginRight: '7%',
        height: pxToDp(94),
        backgroundColor: '#ff8e00',
        borderRadius: 5,
        marginTop: pxToDp(30)
    },
    submitText: {
        color: 'white',
        fontSize: pxToDp(32),
    }
});
module.exports=Login
