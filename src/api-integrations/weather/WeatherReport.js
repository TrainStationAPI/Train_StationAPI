import rp from 'request-promise';
import moment from 'moment';

// getTripDetails
// args  OriginCode, DestinationCode, DateTime
// returns trip details, with weather adn eventful


// using start, end and date:  search silverrail.  make a JourneyPlan request
// use TripUID to make a TRIP request tp get all the stops
// Search all the stops in the journey in the eventful API



// Runtime code
// Test Data
export default function(){
	let StationLat = 39.896462;
	let StationLon = -83.44825;
	let DateTime = "2015-11-22T12:00";

	let weatherKey = "70995712a2988f5b60a0c0d00ae2f42c";
	getWeather(StationLon, StationLat, DateTime, weatherKey);
}

function getWeather(stationLon, stationLat, dateTime, weatherKey) {

	let weatherURL = "http://api.openweathermap.org/data/2.5/forecast?lon=" + stationLon + "&lat=" + stationLat + "&mode=json&APPID=" + weatherKey;
	rp(weatherURL).then(function(body) {
		let weatherJSON = body;
		let weatherObj = JSON.parse(weatherJSON);
		let now = Math.floor((new Date()).getTime()/1000);
		let dateTimeUnix = moment(dateTime).unix();
		let i=0;
		let delta=dateTimeUnix-now;
		let deltaround = 0;
		if(delta<0){
			console.log("error");
		}else{
			if(delta>3600*24*5){
				console.log("No data");
			}else{
				deltaround=Math.floor(delta/(3600*3));
				console.log(weatherObj.list[deltaround].weather[0].main);
			}
		}
	});
}





