/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { useState } from "react";
import style from './loginPage.module.scss'
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../helper/authContext";
import Navbar from "../../components/Navbar/Navbar";
import swal from 'sweetalert2';
import { BASE_API_URL } from "../../utils/Constants";
function LoginPage() {

  const { setAuthState } = useContext(AuthContext);


  let history = useNavigate();
  const [usercode, setUsercode] = useState();
  const [code, setCode] = useState();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);


  function handleChange(e) {
    if (e.target.name == "email") setEmail(e.target.value);
    if (e.target.name == "password") setPassword(e.target.value);
    if (e.target.name == 'otp') setUsercode(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(email, password);
    const obj = {
      email: email,
      password: password
    }
    axios.post(`${BASE_API_URL}/loginPage`, obj)
      .then(res => {
        if (res.data.message) {
          swal.fire({
            title: res.data.message,
            icon: "info",
            button: "OK!",
          });
        }
        else {
          setAuthState(true);
          sessionStorage.setItem("accessToken", res.data);
          swal.fire({
            icon: 'success',
            title: 'Logged In',
            showConfirmButton: false,
            timer: 1000,
          });
          history("/");
        }
      })
      .catch(err => {
        swal.fire({
          icon: 'warning',
          title: err,
          // showConfirmButton: false,
          // timer: 1000,
        });
      });
  }

  function handleforgetpassword() {
    console.log("pop")
    if (email === null) {
      swal.fire({
        icon: 'info',
        title: 'Please Enter Email to reset your password',
      });
    }
    else {
      axios.post(`${BASE_API_URL}/forgot-password`, { email: email })
        .then(res => {
          if (res.data.message === "OTP") {
            setCode(res.data.otp);
            swal.fire({
              icon: 'success',
              title: 'OTP has been sent to your email',
            });
            document.getElementById("1").style.display = "none";
            document.getElementById("2").style.display = "block";
          }
          else {
            swal.fire({
              title: res.data.message,
              icon: "info",
              button: "OK!",
            });

          }
        })
        .catch(err => {
          swal.fire({
            icon: 'warning',
            title: err,
          });
        });
    }
  }

  function handleVerify(e) {
    // // console.log("handleVerify me hun: ",code,usercode, email , password);
    e.preventDefault();
    axios.post(`${BASE_API_URL}/login-otp`, { email: email, code: code, usercode: usercode })
      .then(res => {
        console.log(res.body);
        if (res.data.Isverify == true) {

          setAuthState(true);
          sessionStorage.setItem("accessToken", res.data.accessToken);
          // history('/')
          history("/my-account");
        }
        else {
          swal.fire({
            text: "Wrong OTP Try Again",
            icon: "warning",
          });
        }
      })
  }
  function handleCross() {
    document.getElementById("2").style.display = "none";
    // document.getElementsById("1").style.display="none";
    document.getElementById("1").style.display = "block";
    // console.log("Cross clicked ")
  }


  return (

    <>
      <Navbar />
      {sessionStorage.getItem("accessToken") != null ? <h1>Already Logged In</h1> : <>

        <div className={style.main_block} id="1">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <input className={style.forinput} type="email" name="email" placeholder="Email" onChange={handleChange} />
            <input className={style.forinput} type="password" name="password" placeholder="Password" onChange={handleChange} />



            <div className={style.btn_block}>
              <div href="" className={style.anc} onClick={() => { handleforgetpassword() }}>Forgot Password ?</div>
              <button className="btn btn-primary" type="submit">Login</button>
            </div>
            <div className={style.or}>
              Or
            </div>
            <div className={style.btn_block}>
              <Link to="/signupPage">
                <button type="button" className="btn btn-secondary">Register
                </button>
              </Link>
            </div>
          </form>
        </div>



        <div className={style.bg_modal} id="2">
          <div
            className={style.close}
            onClick={() => {
              handleCross();
            }}
          >
            +
          </div>
          <form onSubmit={handleVerify}>
          <input
            className={style.forinputotp}
            type="number"
            name="otp"
            id="otp"
            placeholder="Enter OTP"
            onChange={handleChange}
          />
          <div className={style.otp_btn_block}>
            <button type="submit">
              Verify
            </button>
          </div>
        </form>
        </div>





      </>}
    </>





  )

}

LoginPage.propTypes = {};

export default LoginPage;