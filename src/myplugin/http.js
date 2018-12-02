import axios from 'axios'
const MyPlugin = {};
MyPlugin.install = function (Vue, options) {
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
    //添加实例方法
    Vue.prototype.$http = axios
}
export default MyPlugin