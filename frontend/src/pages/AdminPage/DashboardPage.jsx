import React, { useEffect, useState } from "react";
import { DashboardAPI } from "../../services/api";
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
import LoadingPage from "../../components/LoadingPage";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    categories: 0,
    brands: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [revenueToday, setRevenueToday] = useState({todayRevenue: 0});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, chartRes, activitiesRes, revenueRes] = await Promise.all([
        DashboardAPI.getStats(),
        DashboardAPI.getRevenueChart(),
        DashboardAPI.getRecentActivities(),
        DashboardAPI.fetchTodayRevenue(),
      ]);
      setRevenueToday(revenueRes);      
      setStats(statsRes);

      // 🔥 Chuẩn hóa dữ liệu biểu đồ
      const formattedChart = chartRes.map((item) => ({
        month: item.month || `T${item._id}`,
        value: item.value || item.totalRevenue || 0,
      }));

      setChartData(formattedChart);
      setActivities(activitiesRes);
    } catch (err) {
      console.error("❌ Lỗi khi lấy dữ liệu dashboard:", err);
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

  if (loading) return <LoadingPage />
  

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="dashboard-header">
          <h2>
            <LayoutDashboard size={32} /> Dashboard
          </h2>
          <p>Tổng quan hệ thống quản trị</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-card-content">
                <div className="stat-info">
                  <p className="stat-title">{stat.title}</p>
                  <h3 className="stat-value">{stat.value?.toLocaleString()}</h3>
                  <div
                    className={`stat-trend ${
                      stat.isUp === null ? "neutral" : stat.isUp ? "up" : "down"
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
              {chartData.length > 0 ? (
                chartData.map((item, i) => (
                  <div key={i} className="bar-item">
                    <div className="bar-wrapper">
                      <div
                        className="bar-fill"
                        style={{
                          height: `${Math.max(item.value *0.03)}px`,
                        }}
                      >
                        <div className="bar-value">
                          {item.value.toLocaleString()}₫
                        </div>
                      </div>
                    </div>
                    <span className="bar-label">{item.month}</span>
                  </div>
                ))
              ) : (
                <p className="no-data">Không có dữ liệu doanh thu</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-card">
            <div className="activity-header">
              <h3>Hoạt động gần đây</h3>
            </div>
            <div className="activity-list">
              {activities.length > 0 ? (
                activities.map((activity, i) => (
                  <div key={i} className="activity-item">
                    <div className={`activity-dot ${activity.color}`}></div>
                    <div className="activity-content">
                      <p className="activity-action">{activity.action}</p>
                      <p className="activity-detail">{activity.detail}</p>
                      <p className="activity-time">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">Chưa có hoạt động nào gần đây</p>
              )}
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
            <p className="quick-stat-value">{revenueToday.todayRevenue.toLocaleString()}đ</p>
            <p className="quick-stat-description">+15.3% so với hôm qua</p>
          </div>

          <div className="quick-stat-card purple">
            <div className="quick-stat-header">
              <h4>Đơn hàng mới</h4>
              <ShoppingCart size={24} />
            </div>
            <p className="quick-stat-value">{stats.orders}</p>
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
