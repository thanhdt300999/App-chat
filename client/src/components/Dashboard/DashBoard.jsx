import React from "react";
import "./dashboard.css";
import { AiOutlineDown } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { MdOutlineNotifications } from "react-icons/md";
const DashBoard = () => {
  return (
    <div className="container-fluid">
      <div className="header row">
        <div className="logoApp col-md-2">
          <div style={{ display: "flex" }}>
            <img
              className="logo"
              src={
                "https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg"
              }
              width={45}
              height={45}
            />
            <div className="contact">
              <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                MTrang
              </span>
              <span
                style={{
                  color: "#8e8e8e",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                thanh.dt@sis.hust.edu.vn
              </span>
            </div>
          </div>
          <div>
            <button className="btn btn-dropdown shadow-none">
              <AiOutlineDown />
            </button>
          </div>
        </div>
        <div className="searchBox col-md-8">
          <div class="input-group">
            <div style={{ display: "flex", alignItems: "center" }}>
              <BiSearch color={"#6cb7f0"} size={"30"} />
            </div>
            <input
                id="inputSearch"
              type="text"
              class="form-control shadow-none"
              aria-label="Text input with checkbox"
              placeholder="Search for people, document, goods..."
            />
          </div>
        </div>
        <div className="userAccount col-md-2">
          <div style={{ marginRight: "20px" }}>
            <MdOutlineNotifications
              size={"25"}
              style={{ marginRight: "30px" }}
              color={"blue"}
            />
            <img
              src={require("./ny.jpg")}
              width={"46px"}

              height={"46px"}
              style={{ borderRadius: "23px" }}
            />
          </div>
          <div>
            <button className="btn btn-dropdown shadow-none">
              <AiOutlineDown />
            </button>
          </div>
        </div>
      </div>
      <div className="body">
        <div className="menuBar">Menu Bar</div>
        <div className="chatList">Chat List</div>
        <div className="chatContent">Chat Content</div>
        <div className="infoUser">info User</div>
      </div>
      <div className="footer"></div>
    </div>
  );
};

export default DashBoard;
