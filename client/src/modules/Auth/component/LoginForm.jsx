import React from "react";
import "./Login.css";
import { AiOutlineMail, AiFillLock, AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
const LoginForm = ({handleLogin}) => {
  return (
    <div className="form-contain">
      <div className="login_title">
        <span>Login</span>
      </div>
      <div className="login_body">
        <form className="login_form_body">
          <div class="form-group">
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1">
                <AiOutlineMail />
              </span>
              <input
                type="text"
                class="form-control input_login shadow-none "
                placeholder="Email"
                aria-label="Email"
              />
            </div>
          </div>
          <div class="form-group">
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1">
                <AiFillLock />
              </span>
              <input
                type="password"
                class="form-control input_login shadow-none"
                placeholder="Password"
                aria-label="Password"
              />
            </div>
          </div>
          <div class="checkbox">
            <label>
              <input type="checkbox" />
              <span className="remember"> &nbsp;Remember me</span>
            </label>
          </div>
        </form>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <button
            type="button"
            onClick={handleLogin}
            class="btn btn-success btn-login"
          >
            <span style={{ fontSize: "20px" }}>Login</span>
          </button>
        </div>
        <div className="another_Login">
          <span style={{ color: "#808080" }}>Or login with</span>
          <div className="func_Login">
            <button type="button" class="btn btn-light facebook">
              <AiFillFacebook size="2em" />
              <span>Facebook</span>
            </button>{" "}
            <button type="button" class="btn btn-light google">
              <FcGoogle size="2em" />
              <span>Google</span>
            </button>
          </div>
        </div>
      </div>
      <div className="login_footer">
        <span>Not a member ?</span> &nbsp;
        <Link to="/auth/signup" style={{ textDecoration: "underline" }}>
          Sign up now
        </Link>
      </div>
    </div>
  );
};

export default LoginForm