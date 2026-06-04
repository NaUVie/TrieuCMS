using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data; 
using CMS.Data.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDTO input)
        {
            if (input == null || input.CustomerId <= 0 || input.CartItems == null || !input.CartItems.Any())
            {
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ. Giỏ hàng không được để trống." });
            }

            // Kiểm tra sự tồn tại của Khách hàng
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == input.CustomerId);
            if (!customerExists)
            {
                return BadRequest(new { message = $"Khách hàng với mã ID {input.CustomerId} không tồn tại trên hệ thống." });
            }

            // Bắt đầu Transaction để đảm bảo tính nhất quán dữ liệu (ACID)
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // 1. Tạo một bản ghi mới vào bảng Order
                    var newOrder = new Order
                    {
                        OrderDate = DateTime.Now,
                        CustomerId = input.CustomerId,
                        Status = 0, // Chờ duyệt
                        Notes = input.Notes
                    };

                    _context.Orders.Add(newOrder);
                    await _context.SaveChangesAsync(); // Lưu để sinh ra newOrder.Id

                    // 2. Chạy vòng lặp qua danh sách giỏ hàng gửi lên
                    foreach (var item in input.CartItems)
                    {
                        if (item.Quantity <= 0)
                        {
                            return BadRequest(new { message = "Số lượng sản phẩm đặt hàng phải lớn hơn 0." });
                        }

                        // Lấy thông tin sản phẩm từ DB
                        var product = await _context.Products.FindAsync(item.ProductId);
                        if (product == null)
                        {
                            return BadRequest(new { message = $"Sản phẩm có ID {item.ProductId} không tồn tại trên hệ thống." });
                        }

                        // Kiểm tra số lượng tồn kho
                        if (product.StockQuantity < item.Quantity)
                        {
                            return BadRequest(new { message = $"Sản phẩm '{product.Name}' không đủ hàng tồn kho. Số lượng hiện tại: {product.StockQuantity}." });
                        }

                        // Khấu trừ số lượng tồn kho
                        product.StockQuantity -= item.Quantity;

                        // Nạp sản phẩm vào bảng OrderDetail
                        var orderDetail = new OrderDetail
                        {
                            OrderId = newOrder.Id,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            UnitPrice = product.Price // Lấy đúng giá của sản phẩm gán vào UnitPrice
                        };

                        _context.OrderDetails.Add(orderDetail);
                    }

                    // Lưu toàn bộ thay đổi (OrderDetails và Product StockQuantity)
                    await _context.SaveChangesAsync();

                    // Commit Transaction
                    await transaction.CommitAsync();

                    return StatusCode(201, new {
                        message = "Đặt hàng thành công!",
                        orderId = newOrder.Id
                    });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, new { message = "Lỗi xử lý tạo đơn hàng", detail = ex.Message });
                }
            }
        }

        // GET: api/Orders/customer/{customerId}
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetCustomerOrders(int customerId)
        {
            try
            {
                var customerExists = await _context.Customers.AnyAsync(c => c.Id == customerId);
                if (!customerExists)
                {
                    return NotFound(new { message = $"Khách hàng với mã ID {customerId} không tồn tại." });
                }

                var orders = await _context.Orders
                    .Where(o => o.CustomerId == customerId)
                    .OrderByDescending(o => o.OrderDate)
                    .Select(o => new {
                        o.Id,
                        o.OrderDate,
                        o.Status,
                        o.Notes,
                        OrderDetails = o.OrderDetails.Select(d => new {
                            d.Id,
                            d.ProductId,
                            ProductName = d.Product != null ? d.Product.Name : "Sản phẩm đã bị xóa",
                            ProductImageUrl = d.Product != null ? d.Product.ImageUrl : "",
                            d.Quantity,
                            d.UnitPrice,
                            TotalPrice = d.Quantity * d.UnitPrice
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi truy xuất lịch sử mua hàng", detail = ex.Message });
            }
        }
    }

    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string? Notes { get; set; }
        public List<CartItemDTO> CartItems { get; set; }
    }

    public class CartItemDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
