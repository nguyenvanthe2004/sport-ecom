import React, { useEffect, useState } from "react";
import { CartAPI, CategoryAPI, ProductAPI } from "../../services/api";
import "../../styles/ProductsPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import ProductFilterSection from "../../components/ProductFilterSection";
import { showToast } from "../../../libs/utils";

const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [priceFilter, setPriceFilter] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  // ✅ Lấy danh mục sản phẩm
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await CategoryAPI.getAll();
        setCategories(catRes.categories || catRes);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const params = {};

        if (selectedCat) {
          const selectedCategory = categories.find(
            (c) => c.name === selectedCat
          );
          if (selectedCategory) params.categoryId = selectedCategory._id;
        }

        switch (priceFilter) {
          case "under500":
            params.maxPrice = 500000;
            break;
          case "500to1000":
            params.minPrice = 500000;
            params.maxPrice = 1000000;
            break;
          case "1000to2000":
            params.minPrice = 1000000;
            params.maxPrice = 2000000;
            break;
          case "over2000":
            params.minPrice = 2000000;
            break;
        }

        const res = await ProductAPI.getFiltered(params);
        setProducts(res.products || []);
      } catch (error) {
        console.error("❌ Lỗi khi lọc sản phẩm:", error);
      }
    };

    fetchFiltered();
  }, [selectedCat, priceFilter, categories]);

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();

    if (!currentUser || !currentUser.userId) {
      navigate("/login");
      return;
    }

    try {
      dispatch(addToCart(product, 1));
      showToast("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("❌ Thêm vào giỏ hàng thất bại:", error);
      showToast("Thêm vào giỏ hàng thất bại!");
    }
  };

  return (
    <>
      <Header />
      <div className="products-page">
        {/* Sidebar bên trái */}
        <aside className="sidebar">
          <h3>Danh mục sản phẩm</h3>
          <ul>
            {categories.map((cat) => (
              <li key={cat._id}>
                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCat === cat.name}
                    onChange={() => setSelectedCat(cat.name)}
                  />
                  {cat.name}
                </label>
              </li>
            ))}
            <li>
              <button
                className="clear-btn"
                onClick={() => setSelectedCat(null)}
              >
                Bỏ chọn
              </button>
            </li>
          </ul>

          <h3>Mức giá</h3>
          <ul>
            <li>
              <label>
                <input
                  type="radio"
                  name="price"
                  value="under500"
                  checked={priceFilter === "under500"}
                  onChange={(e) => setPriceFilter(e.target.value)}
                />
                Dưới 500.000đ
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="price"
                  value="500to1000"
                  checked={priceFilter === "500to1000"}
                  onChange={(e) => setPriceFilter(e.target.value)}
                />
                500.000đ - 1.000.000đ
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="price"
                  value="1000to2000"
                  checked={priceFilter === "1000to2000"}
                  onChange={(e) => setPriceFilter(e.target.value)}
                />
                1.000.000đ - 2.000.000đ
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="price"
                  value="over2000"
                  checked={priceFilter === "over2000"}
                  onChange={(e) => setPriceFilter(e.target.value)}
                />
                Trên 2.000.000đ
              </label>
            </li>
          </ul>

          <button className="clear-btn" onClick={() => setPriceFilter("")}>
            Xóa lọc giá
          </button>
        </aside>

        {/* Danh sách sản phẩm */}
        <div className="productList">
          <ProductFilterSection
            products={products}
            addToCart={handleAddToCart}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductsPage;
