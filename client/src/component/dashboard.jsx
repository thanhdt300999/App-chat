import React, { useState, useEffect, useRef } from "react";
import "./dashboard.css";
import { AiOutlineDown } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { MdOutlineNotifications } from "react-icons/md";
import socketIOClient from "socket.io-client";
const DashBoard = () => {
  const host = "http://localhost:8080";
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState("");
  const [id, setId] = useState();
  const socketRef = useRef();
  const renderMess = mess.map((m, index) => (
    <div
      key={index}
      className={`${m.id === id ? "your-message" : "other-people"} chat-item`}
    >
      {m.content}
    </div>
  ));
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      sendMessage();
    }
  };
  const sendMessage = () => {
    if (message !== null) {
      const msg = {
        content: message,
        id: id,
      };
      socketRef.current.emit("sendDataClient", msg);

      /*Khi emit('sendDataClient') bên phía server sẽ nhận được sự kiện có tên 'sendDataClient' và handle như câu lệnh trong file index.js
           socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
             socketIo.emit("sendDataServer", { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
           })
     */
      setMessage("");
    }
  };

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on("getId", (data) => {
      setId(data);
    }); // phần này đơn giản để gán id cho mỗi phiên kết nối vào page. Mục đích chính là để phân biệt đoạn nào là của mình đang chat.

    socketRef.current.on("sendDataServer", (dataGot) => {
      setMess((oldMsgs) => [...oldMsgs, dataGot.data]);
    }); // mỗi khi có tin nhắn thì mess sẽ được render thêm

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

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
                WebChat
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
        <div className="chatContent">
          <div class="box-chat">
            <div class="box-chat_message"> {renderMess}</div>

            <div class="send-box">
              <textarea
                value={message}
                onKeyDown={onEnterPress}
                onChange={handleChange}
                placeholder="Nhập tin nhắn ..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
        <div className="infoUser">info User</div>
      </div>
      <div className="footer"></div>
    </div>
  );
};

export default DashBoard;
