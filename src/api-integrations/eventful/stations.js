"use strict";
const App = require('../app')
const request = require('request');
const BestFareFinderServiceController = require("./bestfarefinderservice");
const Station = require('../models/station');
const Location = require('../models/location');
const config = require('../config/config');

/// <summary>
///   Controls the creation of Station model objects
/// </summary>
class StationController {
 static getAll() {
   return new Promise((resolve, reject) => {
     // Request stations from station list endpoint in JSON format
     let requestOptions = {
       url: config.stationListEndpoint,
       headers: {
         "Content-Type": "application/json"
       }
     }

     request(requestOptions, function(error, response, body) {
       if (error || response.statusCode != 200) {
         App.log.error({err: error || `Response Status Code: ${response.statusCode}`}, "Couldn't connect to station list endpoint");
         reject(error || `Response Status Code: ${response.statusCode}`);
       }
       else {
         try {
           let allStations = new Map();
           JSON.parse(body).forEach(station => {
             let location = (station.location? new Location(station.location.latitude, station.location.longitude) : null);
             let stn = new Station(station.name, station.code, location);
             if(stn.location != null) {
               //This stops us adding group stations for the moment
               //TODO: Enable adding group stations
               allStations.set(station.code, stn);
             }
           });
           resolve(allStations);
         }
         catch(exception) {
           App.log.error({err: exception}, "Couldn't convert station JSON to station instances");
           reject(exception);
         }
       }
     });
   });
 }

 static getBFFOriginStations() {
   return new Promise((resolve, reject) => {
     const bestFareFinderService = new BestFareFinderServiceController();
     bestFareFinderService.getOriginStationCodes().then(bffOriginStationCodes => {
       StationController.getAll().then(allStations => {
         const bffOriginStations = new Map();
         bffOriginStationCodes.forEach(code => {
           if(allStations.has(code)) {
             bffOriginStations.set(code, allStations.get(code));
           }
         });
         resolve(bffOriginStations);
       });
     });
   });
 }

 static getBFFDestinationStations(originStation) {
   return new Promise((resolve, reject) => {
     const bestFareFinderService = new BestFareFinderServiceController();
     bestFareFinderService.getDestinationStationCodes(originStation).then(bffDestinationStationCodes => {
       StationController.getAll().then(allStations => {
         const bffDestinationStations = new Map();
         bffDestinationStationCodes.forEach(code => {
           if(allStations.has(code)) {
             bffDestinationStations.set(code, allStations.get(code));
           }
         });
         resolve(bffDestinationStations);
       });
     });
   });
 }
}

module.exports = StationController;
