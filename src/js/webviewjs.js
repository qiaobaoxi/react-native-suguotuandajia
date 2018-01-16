let appobj = `{ window.app= { 
    goHome: function(){ window.postMessage('goHome')},
    orderPay:function(orderNo){
        window.postMessage(orderNo)
    }
 }}`;
 
module.exports=appobj