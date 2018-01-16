
let handleMessage = ( e,navigate) => {
    if (e.nativeEvent.data === 'goHome') {
        navigate('Home')
    }
}
module.exports=handleMessage