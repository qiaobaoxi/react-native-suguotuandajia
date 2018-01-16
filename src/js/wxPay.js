import {
  Alert,
  DeviceEventEmitter
} from 'react-native';
import Toast from '@remobile/react-native-toast';
import Fetch from './fetch'
function wxPay(params,WeChat,navigate ,uri) { 
    Fetch(global.url+uri,'post',params,async (responseData)=>{
        if (!responseData.success) {
          Toast.showLongCenter(responseData.message)
          return
        }
        if(responseData.data.wxAmount==0){
          navigate('PaymentSuccess',{payAmount:responseData.data.wxAmount,totalCardPayment:responseData.data.totalCardPayment})
          return
      }
      DeviceEventEmitter.emit('num', 0);
        const result = await WeChat.pay(
          {
            partnerId: responseData.data.wxOrderModel.Partnerid,  // 商家向财付通申请的商家id
            prepayId: responseData.data.wxOrderModel.Prepayid,   // 预支付订单
            nonceStr: responseData.data.wxOrderModel.NonceStr,   // 随机串，防重发
            timeStamp:responseData.data.wxOrderModel.TimeStamp,  // 时间戳，防重发
            package: responseData.data.wxOrderModel.Package,    // 商家根据财付通文档填写的数据和签名
            sign: responseData.data.wxOrderModel.Sign        // 商家根据微信开放平台文档对数据做的签名
          }
      );
      if (result.errCode == 0) {
            navigate('PaymentSuccess',{payAmount:responseData.data.wxAmount,totalCardPayment:responseData.data.totalCardPayment})
          }else if(result.errCode==-1){
              Alert.alert('签名错误、未注册APPID、项目设置APPID不正确、注册的APPID与设置的不匹配、其他异常等。')
          }else if(result.errCode==-2){
              Alert.alert('用户取消')
          }else{
             Alert.alert('未知错误')
             console.error(result)
          }
      },(error)=>{
         Alert.alert(JSON.stringify(error))
        }) 
}
module.exports=wxPay