import rp from 'request-promise';
import weatherReport from './../weather/WeatherReport';

// getTripDetails
// args  OriginCode, DestinationCode, DateTime
// returns trip details, with weather adn eventful


// using start, end and date:  search silverrail.  make a JourneyPlan request
// use TripUID to make a TRIP request tp get all the stops
// Search all the stops in the journey in the eventful API



// Runtime code
// Test Data
export default function() {
	let OriginCode = "MAN";
	let DestinationCode = "EUS";
	let DateTime = "2015-11-23T12:00";

	let silverRailKey = "1333ecbd-2a86-08a5-7168-d325c905a731";
	let dataSet = "UKNational";
	getTripDetails(OriginCode, DestinationCode, DateTime, dataSet, silverRailKey);
}

class TripDetails{
	constructor(silverRail, trainGuard)	{
		this.SilverRail = silverRail;
		this.TrainGuard = trainGuard;
	}
}

class TrainGuard{
	constructor(weather, concert, sports, disruption){
		this.weather = weather;
		this.concert = concert;
		this.sports = sports;
		this.disruption = disruption;
	}
}

function getTripDetails(OriginCode, DestinationCode, DateTime, dataSet, silverRailKey) {

	let journeyPlanObj;
	let weather = null;
	let concert = null;
	let sports = null;

	// Get Journey Plan info from Silver Rail API.  Uses Start and end location to get a TripUid
	let journeyPlanRequestURL = "http://journeyplanner.silverrailtech.com/journeyplannerservice/v2/REST/DataSets/" + dataSet + "/JourneyPlan?from=" + OriginCode + "&to=" + DestinationCode + "&date=" + DateTime + "&ApiKey=" + silverRailKey + "&format=json";
	rp(journeyPlanRequestURL).then(function(body) {
		let journeyPlanJSON = body;
		journeyPlanObj = JSON.parse(journeyPlanJSON);

		let tripUid = journeyPlanObj.Journeys[0].Legs[0].TripUid;
		console.log(tripUid);


		// Use destinationLocation to create WeatherAPI request
		let destinationLocation = journeyPlanObj.Locations[1].Location.Position;
		console.log("Destination Coordinates:  " + destinationLocation);

		// Using TripUid, get the array of station Codes for stations that the trip passes through
		let tripRequestURL = "http://journeyplanner.silverrailtech.com/journeyplannerservice/v2/REST/DataSets/" + dataSet + "/Trip?ApiKey=" + silverRailKey + "&TripUid=" + tripUid + "&TripDate=" + DateTime + "&format=json";
		console.log(`Gonna get ${tripRequestURL}`);

		rp(tripRequestURL).then(function(body) {
			let tripJSON = body;

			let tripObj = JSON.parse(tripJSON);
			let tripStops = tripObj.TripStops;

			let stopCodeArray = [];
			for(let i = 0; i < tripStops.length; i++){
				stopCodeArray.push(tripStops[i].TransitStop.Code);
			}

			console.log("%j", stopCodeArray);


			//let eventfulRequestURL = "http://api.eventful.com/rest/events/search?app_key=" + appKey+ "&where=" + location + "&within=5";

			// Run event queries here using stopCodeArray.  This array contains the 3 char code for each stop.  

			var stopCodeString = stopCodeArray[0];
			for(var i = 1; i < stopCodeArray.length; i++){
				stopCodeString += ", " + stopCodeArray[i];
			}

			console.log(stopCodeString);

			// Get Weather Data
			console.log(destinationLocation);

			let longLat = destinationLocation.split(", ");

			console.log(longLat[0]);
			console.log(longLat[1]);
			weather = weatherReport(longLat[0], longLat[1], DateTime);



			// hit events API with the all stop code string.  

			// store returned value into TrainGuard object

			// create TripDetails object and return 


			/*
			// get station postcode using station codes
			let promises = [];
			for(let i = 0; i< stopCodeArray.length; i++) {
				let stopCode = stopCodeArray[i];
				let stationInfoRequestURL = "http://ojp.nationalrail.co.uk/find/stationsInformation?stationCrsList=" + stopCode;
				promises.push(rp(stationInfoRequestURL));
			}

			Promise.all(promises).then(function(data) {
				data.forEach(function(stationInfoJSON) {
					let stationInfoObj = JSON.parse(stationInfoJSON);
					stationPostCodeArray.push(stationInfoObj[0].stationInformatio.stationBasic.postalAddress.addressPostcode);
					console.log(stationInfoObj[0].stationInformatio.stationBasic.postalAddress.addressPostcode);
				});
			});

			*/
		});
	});

	
	let returnData = new TripDetails(journeyPlanObj, new TrainGuard(weather, null, null, null));

	return returnData;
}



/*
			let jsonTrainsFileName = "JsonTrains.txt";
			jsonTrainsFile = fopen(jsonTrainsFileName, 0); // Open the file for reading 
			if(fh!=-1) // If the file has been successfully opened 
			{ 
			    length = flength(fh);         // Get the length of the file     
			    str = fread(jsonTrainsFile, length);     // Read in the entire file 
			    fclose(fh);                    // Close the file 
			     
			// Display the contents of the file     
			    write(str);     
			}
			let jsonTrainsString = str;
			let trainsJsonObj = JSON.parse(jsonTrainsString);

*/

