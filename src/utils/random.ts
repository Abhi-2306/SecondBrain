export function random(length:number) {
    let options = "qwertyuiopasdfghjklzxcvbnm123456789";
    let ans = "";
    for (let i = 0; i < length; i++) {
        ans += options[Math.floor((Math.random() * length))];
    }
    return ans;
}