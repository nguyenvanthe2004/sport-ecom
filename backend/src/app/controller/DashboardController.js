// controllers/DashboardController.js
const User = require("../models/Users");
const Product = require("../models/Products");
const Order = require("../models/Orders");
const Category = require("../models/Categories");
const Brand = require("../models/Brands");

/**
 * ⏱ Hàm phụ: hiển thị dạng “x phút trước”
 */
function formatTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return "vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

class DashboardController {
  /**
   * 📊 Lấy thống kê tổng quan dashboard
   * GET /dashboard/stats
   */
  async getDashboardStats(req, res) {
    try {
      const [userCount, productCount, orderCount, categoryCount, brandCount] =
        await Promise.all([
          User.countDocuments(),
          Product.countDocuments(),
          Order.countDocuments(),
          Category.countDocuments(),
          Brand.countDocuments(),
        ]);

      res.status(200).json({
        users: userCount,
        products: productCount,
        orders: orderCount,
        categories: categoryCount,
        brands: brandCount,
      });
    } catch (error) {
      console.error("❌ Lỗi lấy dashboard stats:", error);
      res.status(500).json({ message: "Lỗi khi lấy thống kê tổng quan" });
    }
  }

  /**
   * 💰 Lấy dữ liệu doanh thu theo tháng
   * GET /dashboard/chart
   */
  // 📊 DashboardController.js
  async getRevenueChart(req, res) {
    try {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 5, 1); // 6 tháng gần nhất

      const revenue = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: start },
            status: "delivered",
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // 🔧 Tạo mảng 6 tháng gần nhất, có thể chưa có dữ liệu
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = d.getMonth() + 1; // 1–12
        const found = revenue.find((r) => r._id === month);
        months.push({
          month: `T${month}`,
          value: found ? found.totalRevenue : 0,
        });
      }

      res.status(200).json(months);
    } catch (error) {
      console.error("❌ Lỗi lấy biểu đồ doanh thu:", error);
      res.status(500).json({ message: "Lỗi khi lấy dữ liệu doanh thu" });
    }
  }

  /**
   * 🕓 Lấy hoạt động gần đây
   * GET /dashboard/activities
   */
  async getRecentActivities(req, res) {
    try {
      const [latestOrders, latestProducts, latestUsers] = await Promise.all([
        Order.find().sort({ createdAt: -1 }).limit(2),
        Product.find().sort({ updatedAt: -1 }).limit(2),
        User.find().sort({ createdAt: -1 }).limit(1),
      ]);

      const activities = [];

      latestOrders.forEach((order) =>
        activities.push({
          action: "Đơn hàng mới",
          detail: `#${order._id.toString().slice(-6).toUpperCase()}`,
          time: order.createdAt,
          color: "green",
        })
      );

      latestProducts.forEach((product) =>
        activities.push({
          action: "Sản phẩm cập nhật",
          detail: product.name,
          time: product.updatedAt,
          color: "blue",
        })
      );

      latestUsers.forEach((user) =>
        activities.push({
          action: "Người dùng mới",
          detail: user.username || user.email,
          time: user.createdAt,
          color: "purple",
        })
      );

      // Sắp xếp theo thời gian mới nhất
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));

      // Gắn thêm thời gian dạng “x phút trước”
      const formatted = activities.map((a) => ({
        ...a,
        time: formatTimeAgo(a.time),
      }));

      res.status(200).json(formatted);
    } catch (error) {
      console.error("❌ Lỗi lấy hoạt động gần đây:", error);
      res.status(500).json({ message: "Lỗi khi lấy hoạt động gần đây" });
    }
  }

  async getTodayRevenue (req, res) {
  try {

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: "delivered", 
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" }, 
        },
      },
    ]);

    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

    res.status(200).json({ todayRevenue: totalRevenue });
  } catch (error) {
    console.error("Error fetching today's revenue:", error);
    res.status(500).json({ message: "Server error" });
  }
};

  
}

module.exports = new DashboardController();
