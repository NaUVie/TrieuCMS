using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data; 
using CMS.Data.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using CMS.Backend.Services;

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

        // GET: api/Orders
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var orders = await _context.Orders
                    .Include(o => o.Customer)
                    .OrderByDescending(o => o.OrderDate)
                    .Select(o => new {
                        o.Id,
                        o.OrderDate,
                        o.Status,
                        o.Notes,
                        o.CustomerId,
                        CustomerName = o.Customer != null ? o.Customer.FullName : "Khách vãng lai",
                        CustomerEmail = o.Customer != null ? o.Customer.Email : "",
                        TotalAmount = o.OrderDetails.Sum(d => d.Quantity * d.UnitPrice)
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách đơn hàng", detail = ex.Message });
            }
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.Customer)
                    .Include(o => o.OrderDetails)
                        .ThenInclude(d => d.Product)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    return NotFound(new { message = $"Không tìm thấy đơn hàng mã ID {id}." });
                }

                var result = new {
                    order.Id,
                    order.OrderDate,
                    order.Status,
                    order.Notes,
                    order.CustomerId,
                    CustomerName = order.Customer != null ? order.Customer.FullName : "",
                    CustomerEmail = order.Customer != null ? order.Customer.Email : "",
                    CustomerPhone = order.Customer != null ? order.Customer.Phone : "",
                    CustomerAddress = order.Customer != null ? order.Customer.Address : "",
                    OrderDetails = order.OrderDetails.Select(d => new {
                        d.Id,
                        d.ProductId,
                        ProductName = d.Product != null ? d.Product.Name : "Sản phẩm đã bị xóa",
                        ProductImageUrl = d.Product != null ? d.Product.ImageUrl : "",
                        d.Quantity,
                        d.UnitPrice,
                        TotalPrice = d.Quantity * d.UnitPrice
                    }).ToList(),
                    TotalAmount = order.OrderDetails.Sum(d => d.Quantity * d.UnitPrice)
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin đơn hàng", detail = ex.Message });
            }
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDTO input, [FromServices] IEmailService emailService)
        {
            if (input == null || input.CustomerId <= 0 || input.CartItems == null || !input.CartItems.Any())
            {
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ. Giỏ hàng không được để trống." });
            }

            var customerExists = await _context.Customers.AnyAsync(c => c.Id == input.CustomerId);
            if (!customerExists)
            {
                return BadRequest(new { message = $"Khách hàng với mã ID {input.CustomerId} không tồn tại trên hệ thống." });
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var newOrder = new Order
                    {
                        OrderDate = DateTime.Now,
                        CustomerId = input.CustomerId,
                        Status = 0, // Chờ duyệt
                        Notes = input.Notes
                    };

                    _context.Orders.Add(newOrder);
                    await _context.SaveChangesAsync();

                    foreach (var item in input.CartItems)
                    {
                        if (item.Quantity <= 0)
                        {
                            return BadRequest(new { message = "Số lượng sản phẩm đặt hàng phải lớn hơn 0." });
                        }

                        var product = await _context.Products.FindAsync(item.ProductId);
                        if (product == null)
                        {
                            return BadRequest(new { message = $"Sản phẩm có ID {item.ProductId} không tồn tại trên hệ thống." });
                        }

                        if (product.StockQuantity < item.Quantity)
                        {
                            return BadRequest(new { message = $"Sản phẩm '{product.Name}' không đủ hàng tồn kho. Số lượng hiện tại: {product.StockQuantity}." });
                        }

                        product.StockQuantity -= item.Quantity;

                        var orderDetail = new OrderDetail
                        {
                            OrderId = newOrder.Id,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            UnitPrice = product.IsOnSale ? product.SalePrice : product.Price,
                            Product = product
                        };

                        _context.OrderDetails.Add(orderDetail);
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    // Send order confirmation email
                    var customer = await _context.Customers.FindAsync(input.CustomerId);
                    if (customer != null && !string.IsNullOrEmpty(customer.Email))
                    {
                        try
                        {
                            var subject = $"Xác nhận đơn hàng #{newOrder.Id} - TrieuCMS Store";
                            var itemsHtml = "";
                            decimal totalSum = 0;

                            foreach (var detail in newOrder.OrderDetails)
                            {
                                var prodName = detail.Product?.Name ?? "Sản phẩm";
                                var price = detail.UnitPrice;
                                var qty = detail.Quantity;
                                var rowTotal = price * qty;
                                totalSum += rowTotal;

                                itemsHtml += $@"
                                    <tr>
                                        <td style='padding: 8px; border: 1px solid #e2e8f0;'>{prodName}</td>
                                        <td style='padding: 8px; border: 1px solid #e2e8f0; text-align: center;'>{qty}</td>
                                        <td style='padding: 8px; border: 1px solid #e2e8f0; text-align: right;'>{price:N0}đ</td>
                                        <td style='padding: 8px; border: 1px solid #e2e8f0; text-align: right;'>{rowTotal:N0}đ</td>
                                    </tr>";
                            }

                            var body = $@"
                                <h3>Cảm ơn {customer.FullName} đã đặt hàng tại TrieuCMS Store!</h3>
                                <p>Đơn hàng của bạn đã được tiếp nhận thành công và đang chờ ban quản trị duyệt.</p>
                                <p><strong>Mã đơn hàng:</strong> #{newOrder.Id}</p>
                                <p><strong>Ngày đặt:</strong> {newOrder.OrderDate:dd/MM/yyyy HH:mm}</p>
                                <p><strong>Địa chỉ giao hàng:</strong> {customer.Address ?? "Chưa cung cấp"}</p>
                                <p><strong>Số điện thoại:</strong> {customer.Phone ?? "Chưa cung cấp"}</p>
                                
                                <h4>Chi tiết đơn hàng:</h4>
                                <table style='width: 100%; border-collapse: collapse; margin-top: 10px;'>
                                    <thead>
                                        <tr style='background-color: #f1f5f9;'>
                                            <th style='padding: 8px; border: 1px solid #e2e8f0; text-align: left;'>Sản phẩm</th>
                                            <th style='padding: 8px; border: 1px solid #e2e8f0; text-align: center;'>Số lượng</th>
                                            <th style='padding: 8px; border: 1px solid #e2e8f0; text-align: right;'>Đơn giá</th>
                                            <th style='padding: 8px; border: 1px solid #e2e8f0; text-align: right;'>Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemsHtml}
                                        <tr style='font-weight: bold;'>
                                            <td colspan='3' style='padding: 8px; border: 1px solid #e2e8f0; text-align: right;'>Tổng cộng:</td>
                                            <td style='padding: 8px; border: 1px solid #e2e8f0; text-align: right; color: #2563eb;'>{totalSum:N0}đ</td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <p>Chúng tôi sẽ sớm liên hệ lại với bạn để giao hàng.</p>
                                <br/>
                                <p>Trân trọng,<br/>TrieuCMS Store</p>";

                            // Send email asynchronously without blocking the client response
                            _ = emailService.SendEmailAsync(customer.Email, subject, body);
                        }
                        catch (Exception ex)
                        {
                            // Silent catch to prevent order failures due to email sending issues
                        }
                    }

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

        // PUT: api/Orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] OrderStatusUpdateDto input)
        {
            if (input == null)
            {
                return BadRequest(new { message = "Dữ liệu trạng thái không hợp lệ." });
            }

            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng." });
            }

            order.Status = input.Status;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật trạng thái đơn hàng thành công!", orderId = order.Id, status = order.Status });
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng." });
            }

            // Hoàn lại số lượng tồn kho cho các sản phẩm trong đơn hàng
            foreach (var detail in order.OrderDetails)
            {
                var product = await _context.Products.FindAsync(detail.ProductId);
                if (product != null)
                {
                    product.StockQuantity += detail.Quantity;
                }
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa đơn hàng và hoàn trả hàng tồn kho thành công." });
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

    public class OrderStatusUpdateDto
    {
        public int Status { get; set; }
    }
}
