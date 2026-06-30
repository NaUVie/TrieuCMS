using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Index
        public IActionResult Index(string? searchTerm, int? status)
        {
            var query = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(d => d.Product)
                .AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                var term = searchTerm.Trim().ToLower();
                if (int.TryParse(term, out int orderId))
                {
                    query = query.Where(o => o.Id == orderId ||
                                             (o.Customer != null && o.Customer.FullName.ToLower().Contains(term)));
                }
                else
                {
                    query = query.Where(o => (o.Customer != null && (o.Customer.FullName.ToLower().Contains(term) || o.Customer.Email.ToLower().Contains(term))) ||
                                             (o.Notes != null && o.Notes.ToLower().Contains(term)));
                }
            }

            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }

            var list = query
                .OrderByDescending(o => o.OrderDate)
                .ToList();

            ViewBag.SearchTerm = searchTerm;
            ViewBag.Status = status;

            return View(list);
        }

        // GET: Details/5
        public IActionResult Details(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(d => d.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound();

            return View(order);
        }

        // GET: Edit/5
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();
            return View(order);
        }

        // POST: Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Order model)
        {
            var dbOrder = _context.Orders.Find(model.Id);
            if (dbOrder == null) return NotFound();

            dbOrder.Status = model.Status;
            dbOrder.Notes = model.Notes;

            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // GET: Delete/5
        public IActionResult Delete(int id)
        {
            var order = _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefault(o => o.Id == id);

            if (order != null)
            {
                // Revert stock quantity
                foreach (var detail in order.OrderDetails)
                {
                    var product = _context.Products.Find(detail.ProductId);
                    if (product != null)
                    {
                        product.StockQuantity += detail.Quantity;
                    }
                }

                _context.Orders.Remove(order);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
