using Microsoft.AspNetCore.Mvc;

namespace appWeb.Controllers
{
    public class UsuarioController : Controller
    {
        public IActionResult Login()
        {
            return View();
        }
    }
}
