using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var list = _context.CategoriesProducts.ToList();
            return View(list);
        }
    }
}
