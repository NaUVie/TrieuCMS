using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .OrderByDescending(p => p.Id) 
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity
                })
                .ToListAsync();

            return Ok(products);
        }

        [HttpGet("category/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId)
        {
            var products = await _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity
                })
                .ToListAsync();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });
            }

            return Ok(product);
        }
    }
}
