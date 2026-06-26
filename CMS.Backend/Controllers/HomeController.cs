using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Backend.Models;
using CMS.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers;

[Authorize]
public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly ApplicationDbContext _context;

    public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public IActionResult Index()
    {
        // 1. Core Metric Counts
        ViewBag.TotalPosts = _context.Posts.Count();
        ViewBag.TotalProducts = _context.Products.Count();
        ViewBag.TotalCustomers = _context.Customers.Count();
        ViewBag.TotalOrders = _context.Orders.Count();

        // Total revenue (excluding canceled status = 4)
        ViewBag.TotalRevenue = _context.OrderDetails
            .Include(od => od.Order)
            .Where(od => od.Order != null && od.Order.Status != 4)
            .Sum(od => (decimal?)(od.Quantity * od.UnitPrice)) ?? 0;

        // 2. Revenue by Category Product
        var revenueByCategory = _context.OrderDetails
            .Include(od => od.Product)
            .ThenInclude(p => p!.CategoryProduct)
            .Include(od => od.Order)
            .Where(od => od.Order != null && od.Order.Status != 4 && od.Product != null && od.Product.CategoryProduct != null)
            .GroupBy(od => od.Product!.CategoryProduct!.Name)
            .Select(g => new {
                CategoryName = g.Key,
                Revenue = g.Sum(od => od.Quantity * od.UnitPrice)
            })
            .ToList();

        // 3. Monthly Revenue for Current Year
        var currentYear = DateTime.Now.Year;
        var monthlyRevenueData = _context.OrderDetails
            .Include(od => od.Order)
            .Where(od => od.Order != null && od.Order.OrderDate.Year == currentYear && od.Order.Status != 4)
            .GroupBy(od => od.Order!.OrderDate.Month)
            .Select(g => new {
                Month = g.Key,
                Revenue = g.Sum(od => od.Quantity * od.UnitPrice)
            })
            .OrderBy(g => g.Month)
            .ToList();

        // Ensure all 12 months are represented, even if revenue is 0
        var monthlyRevenue = Enumerable.Range(1, 12).Select(m => {
            var match = monthlyRevenueData.FirstOrDefault(d => d.Month == m);
            return new {
                Month = $"T{m}",
                Revenue = match != null ? match.Revenue : 0
            };
        }).ToList();

        // 4. Order Status Distribution
        var orderStatusData = _context.Orders
            .GroupBy(o => o.Status)
            .Select(g => new {
                Status = g.Key,
                Count = g.Count()
            })
            .ToList();

        var statusNames = new Dictionary<int, string> {
            { 0, "Đã tiếp nhận" },
            { 1, "Đang đóng gói" },
            { 2, "Đang vận chuyển" },
            { 3, "Đã hoàn thành" },
            { 4, "Đã hủy" }
        };

        var orderStatusDistribution = orderStatusData.Select(d => new {
            StatusName = statusNames.ContainsKey(d.Status) ? statusNames[d.Status] : "Đã hủy",
            Count = d.Count
        }).ToList();

        // Serialize to JSON for ChartJS consumption
        ViewBag.RevenueByCategoryJson = System.Text.Json.JsonSerializer.Serialize(revenueByCategory);
        ViewBag.MonthlyRevenueJson = System.Text.Json.JsonSerializer.Serialize(monthlyRevenue);
        ViewBag.OrderStatusDistributionJson = System.Text.Json.JsonSerializer.Serialize(orderStatusDistribution);

        // LINQ: Lấy 3 bài viết mới nhất từ Database kèm theo thông tin Danh mục
        var latestPosts = _context.Posts
                          .Include(p => p.Category)
                          .OrderByDescending(p => p.CreatedDate)
                          .Take(3)
                          .ToList();

        return View(latestPosts);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
