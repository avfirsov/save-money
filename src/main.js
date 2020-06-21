import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { Form, FormItem, Input, Radio, RadioGroup, Tooltip } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Tooltip);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
