export default function(router) {
  router.get('/', (req, res) => {
    res.send("Welcome to TrainAPI");
  });
}
