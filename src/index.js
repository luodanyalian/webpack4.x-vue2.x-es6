import Vue from 'vue'
import App from './pages/app.vue'
const root = document.createElement('div')
document.body.appendChild(root)

new Vue({
  render: (h) => h(App)
}).$mount(root)