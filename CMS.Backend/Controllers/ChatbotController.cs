using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Linq;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ApplicationDbContext _context;

        public ChatbotController(IConfiguration configuration, IHttpClientFactory httpClientFactory, ApplicationDbContext context)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _context = context;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatQuery input)
        {
            if (input == null || string.IsNullOrWhiteSpace(input.Message))
            {
                return BadRequest(new { reply = "Vui lòng nhập tin nhắn." });
            }

            var apiKey = _configuration["Gemini:ApiKey"];
            string replyText = "";
            bool isFallback = false;

            if (string.IsNullOrWhiteSpace(apiKey) || apiKey.Contains("YOUR_GEMINI_API_KEY"))
            {
                replyText = GetFallbackResponse(input.Message);
                isFallback = true;
            }
            else
            {
                try
                {
                    var client = _httpClientFactory.CreateClient();
                    var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";

                    var contentsList = new List<object>();

                    if (input.History != null)
                    {
                        foreach (var h in input.History)
                        {
                            contentsList.Add(new
                            {
                                role = h.IsBot ? "model" : "user",
                                parts = new[] { new { text = h.Text } }
                            });
                        }
                    }

                    contentsList.Add(new
                    {
                        role = "user",
                        parts = new[] { new { text = input.Message } }
                    });

                    var payload = new
                    {
                        contents = contentsList,
                        systemInstruction = new
                        {
                            parts = new[] {
                                new {
                                    text = "Bạn là trợ lý ảo AI tên 'NaUCMS.TechGear AI' của Website bán Đồ Công Nghệ & Gaming Gear (NaUCMS.TechGear) tại địa chỉ 63/6 đường 2, Phường Tăng Nhơn Phú B, TP Thủ Đức, TP. Hồ Chí Minh. Hãy trả lời ngắn gọn (tối đa 3 câu), thân thiện, tư vấn nhiệt tình. Dưới đây là thông tin cửa hàng:\n" +
                                           "- Các sản phẩm hot: Tay cầm Flydigi Apex 5 (Nearlink), Flydigi Vader 5 Pro, iPhone 15 Pro Max, MacBook Pro M3, Asus ROG Strix G16.\n" +
                                           "- Chính sách bảo hành: 12-18 tháng, 1 đổi 1 trong 30 ngày.\n" +
                                           "- Giao hàng: nội thành HCM trong 24h, tỉnh từ 2-4 ngày.\n" +
                                           "- Thanh toán: COD, Chuyển khoản QR, Ví điện tử.\n" +
                                           "Hãy trả lời bằng Tiếng Việt."
                                }
                            }
                        },
                        generationConfig = new
                        {
                            temperature = 0.7,
                            maxOutputTokens = 300
                        }
                    };

                    var jsonPayload = JsonSerializer.Serialize(payload);
                    var requestContent = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                    var response = await client.PostAsync(url, requestContent);
                    if (response.IsSuccessStatusCode)
                    {
                        var responseString = await response.Content.ReadAsStringAsync();
                        using var doc = JsonDocument.Parse(responseString);
                        var root = doc.RootElement;

                        if (root.TryGetProperty("candidates", out var candidates) &&
                            candidates.GetArrayLength() > 0 &&
                            candidates[0].TryGetProperty("content", out var content) &&
                            content.TryGetProperty("parts", out var parts) &&
                            parts.GetArrayLength() > 0)
                        {
                            replyText = parts[0].GetProperty("text").GetString() ?? "";
                        }
                    }
                    
                    if (string.IsNullOrEmpty(replyText))
                    {
                        replyText = GetFallbackResponse(input.Message);
                        isFallback = true;
                    }
                }
                catch (Exception)
                {
                    replyText = GetFallbackResponse(input.Message);
                    isFallback = true;
                }
            }

            // Scan and match products from database based on the reply text or user query
            var matchedProducts = ScanAndMatchProducts(input.Message, replyText);

            return Ok(new
            {
                reply = replyText.Trim(),
                isFallback = isFallback,
                products = matchedProducts
            });
        }

        private List<ProductDTO> ScanAndMatchProducts(string userQuery, string replyText)
        {
            var matched = new List<ProductDTO>();
            try
            {
                var allProducts = _context.Products
                    .Select(p => new ProductDTO
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Price = p.Price,
                        ImageUrl = p.ImageUrl,
                        Description = p.Description,
                        IsOnSale = p.IsOnSale,
                        SalePrice = p.SalePrice,
                        StockQuantity = p.StockQuantity
                    })
                    .ToList();

                var userLower = userQuery.ToLower();
                var replyLower = replyText.ToLower();

                // Specific check for pronoun references like "xem nó", "xem sản phẩm", "xem tay cầm"
                bool wantsToSeeIt = userLower.Contains("xem nó") || userLower.Contains("xem sản phẩm") || userLower.Contains("hiển thị") || userLower.Contains("xem thử");

                foreach (var p in allProducts)
                {
                    var nameLower = p.Name.ToLower();

                    // Extract core keywords from product name to allow loose matching
                    // e.g. "Flydigi Apex 5" -> match if text contains "apex 5"
                    bool isMatch = false;

                    if (replyLower.Contains(nameLower) || userLower.Contains(nameLower))
                    {
                        isMatch = true;
                    }
                    else if (nameLower.Contains("apex 5") && (replyLower.Contains("apex 5") || (wantsToSeeIt && userLower.Contains("nó"))))
                    {
                        isMatch = true;
                    }
                    else if (nameLower.Contains("vader 5 pro") && replyLower.Contains("vader 5"))
                    {
                        isMatch = true;
                    }
                    else if (nameLower.Contains("g7 pro") && replyLower.Contains("g7 pro"))
                    {
                        isMatch = true;
                    }
                    else if (nameLower.Contains("apex 4") && replyLower.Contains("apex 4"))
                    {
                        isMatch = true;
                    }
                    else if (nameLower.Contains("iphone 15 pro max") && (replyLower.Contains("iphone 15") || userLower.Contains("iphone 15")))
                    {
                        isMatch = true;
                    }
                    else if (nameLower.Contains("macbook pro m3") && (replyLower.Contains("macbook pro") || userLower.Contains("macbook pro")))
                    {
                        isMatch = true;
                    }
                    else if (nameLower.Contains("samsung galaxy s24") && (replyLower.Contains("s24") || userLower.Contains("s24")))
                    {
                        isMatch = true;
                    }

                    if (isMatch)
                    {
                        matched.Add(p);
                    }
                }

                // If nothing was matched directly but the user was asking generic questions about gamepads or phones, return top items of that category
                if (matched.Count == 0)
                {
                    if (userLower.Contains("tay cầm") || userLower.Contains("gamepad") || userLower.Contains("chơi game"))
                    {
                        // Take top 2 popular gamepads
                        matched = allProducts.Where(p => p.Name.Contains("Flydigi Apex 5") || p.Name.Contains("Flydigi Vader 5 Pro")).Take(2).ToList();
                    }
                    else if (userLower.Contains("điện thoại") || userLower.Contains("smartphone"))
                    {
                        matched = allProducts.Where(p => p.Name.Contains("iPhone 15") || p.Name.Contains("Samsung Galaxy S24")).Take(2).ToList();
                    }
                }
            }
            catch (Exception)
            {
                // Protect against database failures
            }

            return matched.DistinctBy(p => p.Id).Take(3).ToList();
        }

        private string GetFallbackResponse(string message)
        {
            var text = message.ToLower();
            if (text.Contains("tay cầm") || text.Contains("gamepad") || text.Contains("flydigi") || text.Contains("gamesir") || text.Contains("8bitdo"))
            {
                return "NaUCMS.TechGear có sẵn rất nhiều mẫu tay cầm chơi game cao cấp như: Flydigi Apex 5 (Nearlink siêu tốc), Flydigi Vader 5 Pro, Flydigi Apex 4, Gamesir G7 Pro Wuchang, và dòng 8BitDo Ultimate. Bạn có thể xem chi tiết các sản phẩm bên dưới nhé!";
            }
            if (text.Contains("giao hàng") || text.Contains("vận chuyển") || text.Contains("ship"))
            {
                return "NaUCMS.TechGear hỗ trợ giao hàng toàn quốc! Nội thành TP.HCM giao siêu tốc trong vòng 24 giờ. Các tỉnh thành khác nhận hàng từ 2 đến 4 ngày làm việc. Quý khách có thể kiểm tra trạng thái vận chuyển trong mục 'Đơn Hàng Của Tôi'.";
            }
            if (text.Contains("bảo hành") || text.Contains("đổi trả"))
            {
                return "Mọi sản phẩm tại NaUCMS.TechGear đều được bảo hành chính hãng từ 12 đến 18 tháng. Hỗ trợ 1 đổi 1 trong vòng 30 ngày đầu tiên nếu sản phẩm phát sinh lỗi từ nhà sản xuất. Quý khách vui lòng giữ hộp và phụ kiện đi kèm để được hỗ trợ nhanh nhất.";
            }
            if (text.Contains("địa chỉ") || text.Contains("cửa hàng") || text.Contains("ở đâu") || text.Contains("liên hệ"))
            {
                return "Cửa hàng NaUCMS.TechGear đặt tại: 63/6 đường 2, Phường Tăng Nhơn Phú B, TP Thủ Đức, TP. Hồ Chí Minh. Mở cửa hoạt động từ 8:00 đến 22:00 tất cả các ngày trong tuần (kể cả Chủ Nhật). Hotline hỗ trợ nhanh: 0973 651 140.";
            }
            if (text.Contains("thanh toán") || text.Contains("cod") || text.Contains("chuyển khoản"))
            {
                return "Chúng tôi chấp nhận nhiều phương thức thanh toán an toàn: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng qua mã QR 24/7, và thanh toán qua ví điện tử MoMo hoặc ZaloPay.";
            }
            if (text.Contains("chào") || text.Contains("hello") || text.Contains("hi") || text.Contains("hey"))
            {
                return "Xin chào! Tôi là trợ lý ảo của NaUCMS.TechGear. Tôi có thể giúp gì cho bạn? Hãy hỏi tôi về sản phẩm, giá bán, chính sách giao nhận hay bảo hành nhé!";
            }
            if (text.Contains("cảm ơn") || text.Contains("thanks") || text.Contains("thank you"))
            {
                return "Rất vui được hỗ trợ bạn! Chúc bạn có một trải nghiệm mua sắm tuyệt vời tại NaUCMS.TechGear. Cần trợ giúp gì thêm cứ nhắn tôi nhé! 😊";
            }

            return "Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi ngắn gọn về các chủ đề như: 'tay cầm chơi game', 'địa chỉ cửa hàng', 'chính sách bảo hành', hoặc 'thời gian giao hàng' không?";
        }
    }

    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public string Description { get; set; }
        public bool IsOnSale { get; set; }
        public decimal? SalePrice { get; set; }
        public int StockQuantity { get; set; }
    }

    public class ChatQuery
    {
        public string Message { get; set; }
        public List<ChatMessageDTO>? History { get; set; }
    }

    public class ChatMessageDTO
    {
        public string Text { get; set; }
        public bool IsBot { get; set; }
    }
}
