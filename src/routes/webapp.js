export default function(router) {
  router.get('/', (req, res) => {
    res.render('index', {
      title: "Welcome!"
    });
  });

  router.get('/:originStationCode/:destinationStationCode/:dateTime', (req, res) => {
    res.render('index', {
      title: "Your Journey"
    });
  });
}
