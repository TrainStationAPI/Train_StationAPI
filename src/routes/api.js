export default function(router) {
  const apiBaseUrl = "/api/v1";

  router.get(apiBaseUrl + '/', (req, res) => {
    res.send("Welcome to TrainAPI");
  });
}
