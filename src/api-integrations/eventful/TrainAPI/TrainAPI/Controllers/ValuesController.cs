using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;



namespace TrainAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*", exposedHeaders: "X-Custom-Header")]
    public class ValuesController : ApiController
    {
        // GET api/values
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public IEnumerable<Models.TrainGuard> Post(string stationCodeString, string date)
        {
            var stationCodes = stationCodeString.Split(',');
            var dt = DateTime.ParseExact(date, "yyyy-MM-ddTHH:mm", null);
            var dtString = dt.ToString("yyyy-MM-dd") + "00";
            dtString = dtString + "-" + dtString;
            var list = new List<Models.TrainGuard>();
            var jsonString = Properties.Resources.JsonTrains;
            var jsonn = JObject.Parse(jsonString)["stations"].Children().AsJEnumerable();
 
            var wc = new WebClient();
            foreach (var sc in stationCodes)
            {
                var outputConcert = new List<Eventt>();
                var outputSports = new List<Eventt>();
                var coord = (from x in jsonn where x["stationCode"].Value<string>() == sc select x["stationLocation"]).FirstOrDefault();
                var latt = coord["latitude"].Value<string>();
                var longg = coord["longitude"].Value<string>();
                var downString = "http://api.eventful.com/json/events/search?" + "app_key=tcKhLfJDwcpKWPrn&" + "where=" + latt + "," + longg + "&within=1&category=sports&date=" + dtString;

                var sportsResult = wc.DownloadString(downString);
                downString = "http://api.eventful.com/json/events/search?" + "app_key=tcKhLfJDwcpKWPrn&" + "where=" + latt + "," + longg + "&within=1&category=music&date=" + dtString;
                var musicResult = wc.DownloadString(downString);

                var jsonParse = JObject.Parse(sportsResult)["events"];
                if (jsonParse.HasValues)
                {
                    jsonParse = jsonParse["event"];
                    if (jsonParse is JArray)
                    {
                        foreach (var sr in jsonParse.Children())
                        {
                            var eventt = new Eventt();
                            eventt.title = sr["title"].Value<string>();
                            eventt.location = sr["venue_name"].Value<string>();
                            outputSports.Add(eventt);
                        }
                    }
                    else if (jsonParse is JObject)
                    {
                        var eventt = new Eventt();
                        eventt.title = jsonParse["title"].Value<string>();
                        eventt.location = jsonParse["venue_name"].Value<string>();
                        outputSports.Add(eventt);
                    }
                }


                jsonParse = JObject.Parse(musicResult)["events"];
                if(jsonParse.HasValues)
                {
                    jsonParse = jsonParse["event"];

                    if (jsonParse is JArray)
                    {
                        foreach (var mr in jsonParse.Children())
                        {
                            var eventt = new Eventt();
                            eventt.title = mr["title"].Value<string>();
                            eventt.location = mr["venue_name"].Value<string>();
                            outputConcert.Add(eventt);

                        }
                    }
                    else if (jsonParse is JObject)
                    {
                        var eventt = new Eventt();
                        eventt.title = jsonParse["title"].Value<string>();
                        eventt.location = jsonParse["venue_name"].Value<string>();
                        outputConcert.Add(eventt);
                    }


                }


                list.Add(new Models.TrainGuard() { station = sc, concerts = outputConcert, sports = outputSports });

            }
            return list;
        }
        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
