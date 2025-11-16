import React, { useEffect, useState } from "react";
import { BrandAPI, CartAPI, CategoryAPI, ProductAPI } from "../../services/api";
import "../../styles/ProductsPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import ProductFilterSection from "../../components/ProductFilterSection";
import { showErrorToast, showToast } from "../../../libs/utils";

const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [priceFilter, setPriceFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  // ✅ Lấy danh mục sản phẩm
  const fetchProducts = async (page) => {
    try {
      const data = await ProductAPI.getAll(page, limit);
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, bRes] = await Promise.all([
          CategoryAPI.getAll(),
          BrandAPI.getAll(),
        ]);
        setCategories(catRes.categories || catRes);
        setBrands(bRes.brands || bRes);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh mục:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
  const fetchFiltered = async () => {
    try {
      const hasCategory = !!selectedCat;
      const hasBrand = !!selectedBrand;
      const hasPrice = !!priceFilter;

      // Nếu không có bộ lọc nào => quay lại API phân trang mặc định
      if (!hasCategory && !hasBrand && !hasPrice) {
        fetchProducts(page);
        return;
      }

      const params = {};

      if (hasCategory) {
        const selectedCategory = categories.find(c => c.name === selectedCat);
        if (selectedCategory) params.categoryId = selectedCategory._id;
      }

      if (hasBrand) {
        const selectedB = brands.find(b => b.name === selectedBrand);
        if (selectedB) params.brandId = selectedB._id;
      }

      if (hasPrice) {
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
      }

      const res = await ProductAPI.getFiltered(params);
      setProducts(res.products || []);
      setTotalPages(1);
    } catch (error) {
      console.error("❌ Lỗi khi lọc sản phẩm:", error);
    }
  };

  fetchFiltered();
}, [selectedCat, selectedBrand, priceFilter, categories, brands, page]);


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

          <h3>Thương hiệu sản phẩm</h3>
          <ul>
            {brands.map((b) => (
              <li key={b._id}>
                <label>
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === b.name}
                    onChange={() => setSelectedBrand(b.name)}
                  />
                  {b.name}
                </label>
              </li>
            ))}
            <li>
              <button
                className="clear-btn"
                onClick={() => setSelectedBrand(null)}
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
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductsPage;
