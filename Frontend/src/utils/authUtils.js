export function isLogin(){
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        return user
    }else{
        return false
    }
}