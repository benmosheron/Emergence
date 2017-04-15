using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Emergence.Controllers
{
    public class EmergenceController : Controller
    {
        // GET: Emergence
        public ActionResult Index()
        {
            return View();
        }

        // GET: Colours
        public ActionResult Colours()
        {
            return View();
        }
    }
}