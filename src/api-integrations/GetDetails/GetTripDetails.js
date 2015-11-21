// getTripDetails
// args  OriginCode, DestinationCode, DateTime
// returns trip details, with weather adn eventful


// using start, end and date:  search silverrail.  make a JourneyPlan request
// use TripUID to make a TRIP request tp get all the stops
// Search all the stops in the journey in the eventful API



// Runtime code
// Test Data
var OriginCode = "MAN";
var DestinationCode = "EUS";
var DateTime = "2015-12-06T12:00";

setSilverRailKey("1333ecbd-2a86-08a5-7168-d325c905a731");
setDataSet("UKNational");
getTripDetails(OriginCode, DestinationCode, DateTime);
//


var silverRailKey;
var dataSet;

function setSilverRailKey(key){
	if(key){
		silverRailKey = key;
	}
	else{
		console.log("Please provide key. ");
	}
}

function setDataSet(dataSetInput){
	if(dataSetInput){
		dataset = dataSetInput;
	}
	else{
		console.log("Please provide data set.");
	}
}

function getTripDetails(OriginCode, DestinationCode, DateTime) {

	// Get Journey Plan info from Silver Rail API.  Uses Start and end location to get a TripUid
	var journeyPlanRequestURL = "http://journeyplanner.silverrailtech.com/journeyplannerservice/v2/REST/DataSets/" + dataSet + "/JourneyPlan?from=" + OriginCode + "&to=" + DestinationCode + "&date=" + DateTime + "&ApiKey=" + silverRailKey + "&format=json";
	var journeyPlanJSON = httpGet(journeyPlanRequestURL);
	var journeyPlanObj = JSON.parse(journeyPlanJSON);

	var tripUid = journeyPlanObj.Journeys[0].Legs[0].TripUid;

	// Using TripUid, get the array of station Codes for stations that the trip passes through
	var tripRequestURL = "http://journeyplanner.silverrailtech.com/journeyplannerservice/v2/REST/DataSets/" + dataSet + "/Trip?ApiKey=" + silverRailKey + "&TripUid=" + tripUid + "&TripDate=" + DateTime + "&format=json";
	var tripJSON = httpGet(tripRequestURL);
	var tripObj = JSON.parse(tripJSON);
	var tripStops = tripObj.TripStops;

	var stopCodeArray = [];
	for(var i = 0; i < tripStops.length; i++){
		stopCodeArray.push(tripStops[i].Code);
	}

	// get station postcode using station codes

	var stationPostCodeArray = [];
	for(var i = 0; i< stopCodeArray.length; i++){
		var stopCode = stopCodeArray[i];
		var stationInfoRequestURL = "http://ojp.nationalrail.co.uk/find/stationsInformation?stationCrsList=" + stopCode;
		var stationInfoJSON = httpGet(stationInfoRequestURL);
		var stationInfoObj = JSON.parse(stationInfoJSON);

		stationPostCodeArray.push(stationInfoObj[0].stationInformatio.stationBasic.postalAddress.addressPostcode);

		console.log(stationInfoObj[0].stationInformatio.stationBasic.postalAddress.addressPostcode);
	}

	// call Event API with these postcodes in stationPostCodeArray




}


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}







