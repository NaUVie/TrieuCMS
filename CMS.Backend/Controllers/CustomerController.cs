using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using CMS.Data.Security;

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

        // GET: Index
        public IActionResult Index()
        {
            var list = _context.Customers.ToList();
            return View(list);
        }

        // GET: Create
        [HttpGet]
        public IActionResult Create()
        {
            return View(new Customer());
        }

        // POST: Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Customer model)
        {
            if (string.IsNullOrEmpty(model.Email))
            {
                ModelState.AddModelError("Email", "Email không được để trống.");
                return View(model);
            }

            var exists = _context.Customers.Any(c => c.Email.ToLower() == model.Email.ToLower());
            if (exists)
            {
                ModelState.AddModelError("Email", "Email này đã tồn tại.");
                return View(model);
            }

            if (string.IsNullOrEmpty(model.Password))
            {
                ModelState.AddModelError("Password", "Mật khẩu không được để trống.");
                return View(model);
            }

            model.Password = PasswordHasher.HashPassword(model.Password);

            _context.Customers.Add(model);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // GET: Edit
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();
            return View(customer);
        }

        // POST: Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Customer model, string NewPassword)
        {
            var dbCustomer = _context.Customers.Find(model.Id);
            if (dbCustomer == null) return NotFound();

            dbCustomer.FullName = model.FullName;
            dbCustomer.Phone = model.Phone;
            dbCustomer.Address = model.Address;

            if (!string.IsNullOrEmpty(NewPassword))
            {
                dbCustomer.Password = PasswordHasher.HashPassword(NewPassword);
            }

            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // GET: Delete
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
