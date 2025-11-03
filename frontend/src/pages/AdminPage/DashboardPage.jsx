import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  ProductAPI,
  OrderAPI,
  CategoryAPI,
  BrandAPI,
} from "../../services/api";
import {
  Users,
  Package,
  ShoppingCart,
  Layers,
  Store,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  LayoutDashboard,
} from "lucide-react";
import "../../styles/DashboardPage.css";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    categories: 0,
    brands: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [userRes, productRes, orderRes, categoryRes, brandRes] =
        await Promise.all([
          getAllUsers(),
          ProductAPI.getAll(),
          OrderAPI.getAll(),
          CategoryAPI.getAll(),
          BrandAPI.getAll(),
        ]);

      setStats({
        users: userRes.users?.length || userRes.length || 0,
        products: productRes.products?.length || productRes.length || 0,
        orders: orderRes.orders?.length || orderRes.length || 0,
        categories: categoryRes.categories?.length || categoryRes.length || 0,
        brands: brandRes.brands?.length || brandRes.length || 0,
      });
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statCards = [
    {
      title: "Tổng người dùng",
      value: stats.users,
      icon: Users,
      color: "blue",
      trend: "+12.5%",
      isUp: true,
    },
    {
      title: "Sản phẩm",
      value: stats.products,
      icon: Package,
      color: "purple",
      trend: "+8.2%",
      isUp: true,
    },
    {
      title: "Đơn hàng",
      value: stats.orders,
      icon: ShoppingCart,
      color: "green",
      trend: "+23.1%",
      isUp: true,
    },
    {
      title: "Danh mục",
      value: stats.categories,
      icon: Layers,
      color: "orange",
      trend: "0%",
      isUp: null,
    },
    {
      title: "Thương hiệu",
      value: stats.brands,
      icon: Store,
      color: "pink",
      trend: "+5.4%",
      isUp: true,
    },
  ];

  const chartData = [
    { month: "T7", value: 65 },
    { month: "T8", value: 78 },
    { month: "T9", value: 82 },
    { month: "T10", value: 90 },
    { month: "T11", value: 85 },
    { month: "T12", value: 95 },
  ];

  const activities = [
    {
      action: "Đơn hàng mới",
      detail: "#ORD-1234",
      time: "5 phút trước",
      color: "green",
    },
    {
      action: "Sản phẩm cập nhật",
      detail: "iPhone 15 Pro",
      time: "12 phút trước",
      color: "blue",
    },
    {
      action: "Người dùng mới",
      detail: "Nguyễn Văn A",
      time: "23 phút trước",
      color: "purple",
    },
    {
      action: "Đơn hàng hoàn thành",
      detail: "#ORD-1230",
      time: "1 giờ trước",
      color: "green",
    },
    {
      action: "Đánh giá mới",
      detail: "5 sao",
      time: "2 giờ trước",
      color: "orange",
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="dashboard-header">
          <h2><LayoutDashboard size={32}/>  Dashboard</h2>
          <p>Tổng quan hệ thống quản trị</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-card-content">
                <div className="stat-info">
                  <p className="stat-title">{stat.title}</p>
                  <h3 className="stat-value">
                    {stat.value.toLocaleString()}
                  </h3>
                  <div
                    className={`stat-trend ${
                      stat.isUp === null
                        ? "neutral"
                        : stat.isUp
                        ? "up"
                        : "down"
                    }`}
                  >
                    {stat.isUp !== null && (
                      <>
                        {stat.isUp ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )}
                      </>
                    )}
                    <span>{stat.trend}</span>
                  </div>
                </div>
                <div className={`stat-icon ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          {/* Main Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title">
                <h3>Doanh thu theo tháng</h3>
                <p>Thống kê 6 tháng gần nhất</p>
              </div>
              <div className="chart-badge">
                <TrendingUp size={16} />
                <span>+24.5%</span>
              </div>
            </div>
            <div className="bar-chart">
              {chartData.map((item, i) => (
                <div key={i} className="bar-item">
                  <div className="bar-wrapper">
                    <div
                      className="bar-fill"
                      style={{ height: `${item.value * 2.5}px` }}
                    >
                      <div className="bar-value">{item.value}M</div>
                    </div>
                  </div>
                  <span className="bar-label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-card">
            <div className="activity-header">
              <h3>Hoạt động gần đây</h3>
            </div>
            <div className="activity-list">
              {activities.map((activity, i) => (
                <div key={i} className="activity-item">
                  <div className={`activity-dot ${activity.color}`}></div>
                  <div className="activity-content">
                    <p className="activity-action">{activity.action}</p>
                    <p className="activity-detail">{activity.detail}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="quick-stat-card blue">
            <div className="quick-stat-header">
              <h4>Doanh thu hôm nay</h4>
              <TrendingUp size={24} />
            </div>
            <p className="quick-stat-value">12.5M ₫</p>
            <p className="quick-stat-description">+15.3% so với hôm qua</p>
          </div>

          <div className="quick-stat-card purple">
            <div className="quick-stat-header">
              <h4>Đơn hàng mới</h4>
              <ShoppingCart size={24} />
            </div>
            <p className="quick-stat-value">28</p>
            <p className="quick-stat-description">Cần xử lý</p>
          </div>

          <div className="quick-stat-card green">
            <div className="quick-stat-header">
              <h4>Tỷ lệ chuyển đổi</h4>
              <TrendingUp size={24} />
            </div>
            <p className="quick-stat-value">3.2%</p>
            <p className="quick-stat-description">+0.5% so với tuần trước</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;