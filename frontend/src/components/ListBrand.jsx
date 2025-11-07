import React from "react"
import "../styles/ListBrand.css"

const ListBrand = () => {
   return (
    <div className="logo-list">
        <div className="logo-item">
          <img src="/public/logo_1.png" alt="" />
        </div>
        <div className="logo-item">
          <img src="/public/logo_2.png" alt="" />
        </div>
        <div className="logo-item">
          <img src="/public/logo_3.png" alt="" />
        </div>
        <div className="logo-item">
          <img src="/public/logo_4.png" alt="" />
        </div>
        <div className="logo-item">
          <img src="/public/logo_5.jpg" alt="" />
        </div>
      </div>
   )
}
export default ListBrand;