import rp from 'request-promise';

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
	let DateTime = "2015-12-06T12:00";

	let silverRailKey = "1333ecbd-2a86-08a5-7168-d325c905a731";
	let dataSet = "UKNational";
	getTripDetails(OriginCode, DestinationCode, DateTime, dataSet, silverRailKey);
}

function getTripDetails(OriginCode, DestinationCode, DateTime, dataSet, silverRailKey) {

	// Get Journey Plan info from Silver Rail API.  Uses Start and end location to get a TripUid
	let journeyPlanRequestURL = "http://journeyplanner.silverrailtech.com/journeyplannerservice/v2/REST/DataSets/" + dataSet + "/JourneyPlan?from=" + OriginCode + "&to=" + DestinationCode + "&date=" + DateTime + "&ApiKey=" + silverRailKey + "&format=json";
	rp(journeyPlanRequestURL).then(function(body) {
		let journeyPlanJSON = body;
		let journeyPlanObj = JSON.parse(journeyPlanJSON);

		let tripUid = journeyPlanObj.Journeys[0].Legs[0].TripUid;
		console.log(tripUid);

		// Using TripUid, get the array of station Codes for stations that the trip passes through
		let tripRequestURL = "http://journeyplanner.silverrailtech.com/journeyplannerservice/v2/REST/DataSets/" + dataSet + "/Trip?ApiKey=" + silverRailKey + "&TripUid=" + tripUid + "&TripDate=" + DateTime + "&format=json";
		console.log(`Gonna get ${tripRequestURL}`);

		rp(tripRequestURL).then(function(body) {
			let tripJSON = body;

			let tripObj = JSON.parse(tripJSON);
			let tripStops = tripObj.TripStops;

			let stopCodeArray = [];
			for(let i = 0; i < tripStops.length; i++){
				stopCodeArray.push(tripStops[i].Code);
			}

			console.log("%j", stopCodeArray);

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
		});
	});
}
