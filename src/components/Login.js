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
  TouchableOpacity
} from 'react-native';
import fetch from '../js/fetch'
const deviceWidthDp = Dimensions.get('window').width;

const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}
class Login extends Component{
    constructor(props) {
        super(props);
    }
    onButtonPress(){
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <View style={styles.header}>
                    <Text>登录</Text>
                </View>
                <View>
                    <View style={styles.logo}>
                      <Image style={styles.logoImg} source={require('../images/login-logo.png')}></Image>
                    </View>
                    <View>
                      <TextInput underlineColorAndroid={'transparent'} placeholder={'手机号'} placeholderTextColor={'#a2a2a2'}/>
                    </View>
                    <View>
                      <TextInput underlineColorAndroid={'transparent'} placeholder={'邀请码'} placeholderTextColor={'#a2a2a2'}/>
                      <Button
                            onPress={this.onButtonPress}
                            title="获得验证码"
                            accessibilityLabel="See an informative alert"
                        />
                    </View>
                    <View>
                        <Text>确认</Text>
                    </View>
                </View>
            </View>    
        );
    }
}
const styles = StyleSheet.create({
    header:{
       paddingTop: pxToDp(40),
       height: pxToDp(94),
       backgroundColor: 'white',
       alignItems: 'center',
       justifyContent: 'center'
    },
    logo: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoImg: {
        marginTop: pxToDp(64),
        marginBottom: pxToDp(52),
        width: pxToDp(247),
        height: pxToDp(148),
    }
});
module.exports=Login
