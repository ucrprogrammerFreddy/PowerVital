using Microsoft.AspNetCore.Mvc;

namespace appWeb.Controllers
{
    public class AdministradorController : Controller
    {
        public IActionResult Index()
        {
            return View();
        } 
        public IActionResult Empleados()
        {
            return View();
        } 
        public IActionResult Ejercicios()
        {
            return View();
        }
    }
}
