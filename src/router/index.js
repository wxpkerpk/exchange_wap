import Vue from 'vue'
import Router from 'vue-router'
import routes from "./routers"
Vue.use(Router)
const router = new Router({
	routes,
	scrollBehavior (to, from, savedPosition) {
		return { x: 0, y: 0 }
	}
});
router.beforeEach((to, from, next) => {
	// console.log(to);
	if (router.app.$options.store.state.isLogin && to.name === 'signin') {
		return next('/home');
	};
    next();
});
router.afterEach(to => {
	window.document.title = to.meta.title;

    // window.scrollTo(0, 0)
});
export default router
