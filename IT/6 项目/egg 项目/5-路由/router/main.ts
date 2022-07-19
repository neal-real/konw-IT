module.exports = app => {
  const { controller, router } = app;
  router.get('/', controller.main.index);
  router.get('/main', controller.main.index);
};
