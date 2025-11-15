import React from "react"
import "../styles/ListBrand.css"
import { FRONTEND_URL } from "../constants";

const ListBrand = () => {
   return (
    <div className="logo-list">
        <div className="logo-item">
          <img src={`${FRONTEND_URL}logo_1.png`} alt="" />
        </div>
        <div className="logo-item">
          <img src={`${FRONTEND_URL}logo_2.png`} alt="" />
        </div>
        <div className="logo-item">
          <img src={`${FRONTEND_URL}logo_3.png`} alt="" />
        </div>
        <div className="logo-item">
          <img src={`${FRONTEND_URL}logo_4.png`} alt="" />
        </div>
        <div className="logo-item">
          <img src={`${FRONTEND_URL}logo_5.jpg`} alt="" />
        </div>
      </div>
   )
}
export default ListBrand;