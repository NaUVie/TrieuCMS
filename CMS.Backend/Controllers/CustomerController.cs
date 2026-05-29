using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var list = _context.Customers.ToList();
            return View(list);
        }
    }
}
