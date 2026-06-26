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

        // GET: api/Products
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
                    p.StockQuantity,
                    p.CategoryProductId,
                    p.IsOnSale,
                    p.SalePrice,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToListAsync();

            return Ok(products);
        }

        // GET: api/Products/sale
        [HttpGet("sale")]
        public async Task<IActionResult> GetSaleProducts()
        {
            var products = await _context.Products
                .Where(p => p.IsOnSale)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    p.CategoryProductId,
                    p.IsOnSale,
                    p.SalePrice,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToListAsync();

            return Ok(products);
        }

        // GET: api/Products/latest
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestProducts()
        {
            var products = await _context.Products
                .OrderByDescending(p => p.Id)
                .Take(6)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    p.CategoryProductId,
                    p.IsOnSale,
                    p.SalePrice,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToListAsync();

            return Ok(products);
        }

        // GET: api/Products/category/5
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
                    p.StockQuantity,
                    p.CategoryProductId,
                    p.IsOnSale,
                    p.SalePrice,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToListAsync();

            return Ok(products);
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId,
                    p.IsOnSale,
                    p.SalePrice,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });
            }

            return Ok(product);
        }

        // POST: api/Products
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductInputDto input)
        {
            if (input == null || string.IsNullOrEmpty(input.Name))
            {
                return BadRequest(new { message = "Tên sản phẩm không được để trống." });
            }

            var categoryExists = await _context.CategoriesProducts.AnyAsync(c => c.Id == input.CategoryProductId);
            if (!categoryExists)
            {
                return BadRequest(new { message = "Danh mục sản phẩm không tồn tại trong hệ thống." });
            }

            var product = new Product
            {
                Name = input.Name,
                Description = input.Description,
                Price = input.Price,
                StockQuantity = input.StockQuantity,
                ImageUrl = input.ImageUrl,
                CategoryProductId = input.CategoryProductId,
                IsOnSale = input.IsOnSale,
                SalePrice = input.SalePrice
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDetail), new { id = product.Id }, new {
                message = "Tạo sản phẩm thành công!",
                product
            });
        }

        // PUT: api/Products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductInputDto input)
        {
            if (input == null || string.IsNullOrEmpty(input.Name))
            {
                return BadRequest(new { message = "Tên sản phẩm không được để trống." });
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này." });
            }

            var categoryExists = await _context.CategoriesProducts.AnyAsync(c => c.Id == input.CategoryProductId);
            if (!categoryExists)
            {
                return BadRequest(new { message = "Danh mục sản phẩm không tồn tại." });
            }

            product.Name = input.Name;
            product.Description = input.Description;
            product.Price = input.Price;
            product.StockQuantity = input.StockQuantity;
            product.ImageUrl = input.ImageUrl;
            product.CategoryProductId = input.CategoryProductId;
            product.IsOnSale = input.IsOnSale;
            product.SalePrice = input.SalePrice;

            await _context.SaveChangesAsync();

            return Ok(new {
                message = "Cập nhật sản phẩm thành công!",
                product
            });
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này." });
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa sản phẩm thành công." });
        }
    }

    public class ProductInputDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string? ImageUrl { get; set; }
        public int CategoryProductId { get; set; }
        public bool IsOnSale { get; set; }
        public decimal SalePrice { get; set; }
    }
}
