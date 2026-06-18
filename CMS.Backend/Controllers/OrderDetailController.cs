using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Index
        public IActionResult Index()
        {
            var list = _context.OrderDetails
                .Include(d => d.Order)
                    .ThenInclude(o => o!.Customer)
                .Include(d => d.Product)
                .ToList();
            return View(list);
        }

        // GET: Edit/5
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var detail = _context.OrderDetails
                .Include(d => d.Order)
                .Include(d => d.Product)
                .FirstOrDefault(d => d.Id == id);

            if (detail == null) return NotFound();

            ViewBag.ProductList = new SelectList(_context.Products, "Id", "Name", detail.ProductId);
            return View(detail);
        }

        // POST: Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(OrderDetail model)
        {
            var dbDetail = _context.OrderDetails.Find(model.Id);
            if (dbDetail == null) return NotFound();

            var product = _context.Products.Find(model.ProductId);
            if (product == null) return BadRequest("Sản phẩm không hợp lệ.");

            // Calculate stock adjustments
            var difference = model.Quantity - dbDetail.Quantity;
            if (product.StockQuantity < difference)
            {
                ModelState.AddModelError("Quantity", $"Số lượng tồn kho không đủ. Số lượng hiện tại: {product.StockQuantity}");
                ViewBag.ProductList = new SelectList(_context.Products, "Id", "Name", model.ProductId);
                return View(model);
            }

            // Update stock
            product.StockQuantity -= difference;

            dbDetail.ProductId = model.ProductId;
            dbDetail.Quantity = model.Quantity;
            dbDetail.UnitPrice = product.Price;

            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // GET: Delete/5
        public IActionResult Delete(int id)
        {
            var detail = _context.OrderDetails.Find(id);
            if (detail != null)
            {
                // Return stock quantity
                var product = _context.Products.Find(detail.ProductId);
                if (product != null)
                {
                    product.StockQuantity += detail.Quantity;
                }

                _context.OrderDetails.Remove(detail);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
