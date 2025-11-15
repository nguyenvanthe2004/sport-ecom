import React from "react";
import "../styles/NewSection.css";
import { FRONTEND_URL } from "../constants";

const sportsNewsData = [
  {
    id: 1,
    title: "Chung kết Cúp Quốc Gia đầy kịch tính",
    sport: "Bóng đá",
    description:
      "Trận cầu thảm hại giữa Manchester United để bại trận trước sân nhà Anfield của Liverpool với tỉ số 1 chiều 7-0. ",
    image:
      "news_1.jpg",
  },
  {
    id: 2,
    title: "Ngôi sao NBA bùng nổ với 45 điểm",
    sport: "Bóng rổ",
    description:
      "Trong trận đấu gần đây, vận động viên ngôi sao đã góp phần đưa đội nhà giành chiến thắng áp đảo.",
    image:
      "news_2.jpeg",
  },
  {
    id: 3,
    title: "Tuyển bóng chuyền giành quyền vào chung kết",
    sport: "Bóng chuyền",
    description:
      "Những pha chắn bóng và phòng thủ chắc chắn đã giúp đội tuyển vượt qua đối thủ mạnh để tiến vào trận đấu cuối.",
    image:
      "news_3.jpg",
  },
  {
    id: 4,
    title: "Giải cầu lông quốc tế ghi nhận nhà vô địch mới",
    sport: "Cầu lông",
    description:
      "Tay vợt trẻ đã xuất sắc vượt qua nhiều đối thủ mạnh để giành chức vô địch ấn tượng tại giải đấu năm nay.",
    image:
      "news_4.jpg",
  },
];

const SportsNews = () => {
  return (
    <section className="sports-news">
      <h2>Tin tức thể thao</h2>
      <div className="news-grid">
        {sportsNewsData.map((news) => (
          <div className="news-card" key={news.id}>
            <img src={`${FRONTEND_URL}${news.image}`} alt={news.title} />
            <div className="news-content">
              <span className="tag">{news.sport}</span>
              <h3>{news.title}</h3>
              <p>{news.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SportsNews;
