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
        public IActionResult Index(string? searchTerm)
        {
            var query = _context.Customers.AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                var term = searchTerm.Trim().ToLower();
                query = query.Where(c => c.FullName.ToLower().Contains(term) || 
                                         c.Email.ToLower().Contains(term) || 
                                         (c.Phone != null && c.Phone.Contains(term)));
            }

            ViewBag.SearchTerm = searchTerm;
            var list = query.ToList();
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
                // Find all orders of this customer and set CustomerId to null
                var orders = _context.Orders.Where(o => o.CustomerId == id).ToList();
                foreach (var order in orders)
                {
                    order.CustomerId = null;
                }

                _context.Customers.Remove(customer);
                _context.SaveChanges();
                TempData["Success"] = "Đã xóa tài khoản khách hàng thành công! Các đơn hàng cũ của khách hàng này hiện được lưu dưới dạng Khách vãng lai.";
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
