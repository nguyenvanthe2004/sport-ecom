import { useNavigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <header class="header">
      <NavLink to="/home" class="logo">
        <img src="logo.jpg" alt="" />
      </NavLink>
      <div class="search-bar">
        <i class="fa fa-search"></i>
        <input type="text" placeholder="Tìm sản phẩm..." />
      </div>
      <div class="header-right">
        <div class="consult">
          <i class="fa fa-paper-plane"></i>
          <span>
            Tư vấn mua hàng<b>0387873303</b>
          </span>
        </div>
        <div class="icons">
          <div class="icon">
            <i class="fa fa-store"></i>
          </div>
          <h3>{currentUser.fullname}</h3>
          <div class="icon" onClick={handleSubmit}>
            <i class="fa fa-user"></i>
          </div>
          <div class="icon">
            <i class="fa fa-shopping-bag"></i>
            <span class="badge">0</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
