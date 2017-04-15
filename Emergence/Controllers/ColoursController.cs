using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Emergence.Controllers
{
    public class ColoursController : Controller
    {
        public ActionResult Index()
        {
            return Colours();
        }

        // GET: Colours
        public ActionResult Colours()
        {
            return View();
        }
    }
}