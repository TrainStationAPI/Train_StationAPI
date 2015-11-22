using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TrainAPI.Models
{
    public class TrainGuard
    {
        public List<Controllers.Eventt> concerts { get; set; }
        public List<Controllers.Eventt> sports { get; set; }

        public string station { get; set; }
    }


}