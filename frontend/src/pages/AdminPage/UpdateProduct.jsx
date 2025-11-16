import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  UploadAPI,
  ProductAPI,
  BrandAPI,
  CategoryAPI,
} from "../../services/api";
import "../../styles/CreateProduct.css"; // style dùng chung
import { showErrorToast, showToast } from "../../../libs/utils";
import { BASE_URL } from "../../constants";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userId = currentUser?._id || "";

  const [product, setProduct] = useState({
    name: "",
    description: "",
    slug: "",
    brandId: "",
    categoryId: "",
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Load Brands, Categories và Product
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandRes, categoryRes] = await Promise.all([
          BrandAPI.getAll(),
          CategoryAPI.getAll(),
        ]);
        setBrands(brandRes);
        setCategories(categoryRes);

        // Lấy product
        const p = await ProductAPI.getProductById(id);
        console.log(p);

        setProduct({
          name: p.name,
          description: p.description,
          slug: p.slug,
          brandId: p.brandId?._id || "",
          categoryId: p.categoryId?._id || "",
        });

        // variants
        setVariants(
          p.variants.map((v) => ({
            ...v,
            image: v.image,
            imageFile: null
            // để upload nếu user chọn
          }))
        );
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu:", err);
        alert(err.message);
      }
    };
    fetchData();
  }, [id]);

  // 🔹 Thay đổi thông tin product
  const handleProductChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // 🔹 Thay đổi thông tin variant
  const handleVariantChange = (index, e) => {
    const { name, value, files } = e.target;
    const newVariants = [...variants];

    if (name === "image" && files && files[0]) {
      const file = files[0];
      newVariants[index].image = URL.createObjectURL(file);
      newVariants[index].imageFile = file;
    } else {
      newVariants[index][name] = value;
    }

    setVariants(newVariants);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedVariants = [];
      for (const v of variants) {
        let imagePath = v.image;
        if (v.imageFile) {
          const uploadRes = await UploadAPI.uploadSingle(v.imageFile);
          imagePath = uploadRes.path;
        }

        uploadedVariants.push({
          id: v._id, // nếu có _id thì backend hiểu là update variant cũ
          nameDetail: v.nameDetail,
          price: v.price,
          stock: v.stock,
          image: imagePath,
        });
      }

      const payload = {
        ...product,
        userId,
        variants: uploadedVariants,
      };
      console.log(payload);

      await ProductAPI.update(id, payload);

      showToast("Cập nhật sản phẩm thành công");
      navigate("/admin/products");
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
      showErrorToast("Lỗi cập nhật sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product container mt-5">
      <h2 className="fw-bold mb-4">Cập nhật sản phẩm</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-sm border mt-3"
      >
        {/* --- Thông tin sản phẩm --- */}
        <div className="row mb-3">
          <div className="">
            <label className="form-label fw-semibold">Tên sản phẩm</label>
            <input
              name="name"
              className="form-control"
              value={product.name}
              onChange={handleProductChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Mô tả</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={product.description}
            onChange={handleProductChange}
          ></textarea>
        </div>

        {/* --- Dropdown chọn Brand & Category --- */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Thương hiệu (Brand)
            </label>
            <select
              name="brandId"
              className="form-select"
              value={product.brandId}
              onChange={handleProductChange}
              required
            >
              <option value="">-- Chọn thương hiệu --</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Danh mục (Category)
            </label>
            <select
              name="categoryId"
              className="form-select"
              value={product.categoryId}
              onChange={handleProductChange}
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr />

        {/* --- Biến thể --- */}
        <h5 className="fw-semibold mb-3 text-secondary">
          Danh sách biến thể (Variants)
        </h5>
        {variants.map((v, index) => (
          <div
            key={index}
            className="variant-box border rounded p-3 mb-3 bg-light"
          >
            <div className="row">
              <div className="col-md-3">
                <label className="form-label">Tên chi tiết</label>
                <input
                  name="nameDetail"
                  className="form-control"
                  value={v.nameDetail}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Giá</label>
                <input
                  name="price"
                  type="number"
                  className="form-control"
                  value={v.price}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Tồn kho</label>
                <input
                  name="stock"
                  type="number"
                  className="form-control"
                  value={v.stock}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Ảnh</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => handleVariantChange(index, e)}
                />
                {v.image && (
                  <img
                    src={
                      v.image.startsWith("blob:")
                        ? v.image
                        : `${BASE_URL}${v.image}`
                    }
                    alt="preview"
                    className="mt-2 rounded preview-img"
                    width="80"
                    height="80"
                  />
                )}
              </div>
            </div>

            <div className="text-end mt-2">
              {variants.length > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeVariant(index)}
                >
                  Xóa biến thể
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="text-end">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate("/admin/products")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
