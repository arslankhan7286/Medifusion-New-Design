import React, { Component } from "react";
import {
  withRouter
} from "react-router-dom";
import loginLogo from "../images/logo-Medi-Fusion.png";
import axios from "axios";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import medifusionLoginLogo from "../images/logo-Medi-Fusion.png";
import userLoginIcon from "../images/user-login-ico.png";
import medicalIcon from "../images/medical-icon.png"

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { userInfo } from "../actions/userInfo";
import { selectTabAction } from "../actions/selectTabAction";
import { setICDAction } from '../actions/SetICDAction'

import Swal from "sweetalert2";

class Login extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/account/";
    this.commonUrl = process.env.REACT_APP_URL + "/Common/";

    this.loginModel = {
      email: "",
      password: ""
    };

    this.state = {
      loginModel: this.loginModel,
      loading: false
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.enterKeyLogin = this.enterKeyLogin.bind(this);
  }

  componentWillMount() {
    if (this.props.loginObject.isLogin == false) {
      this.props.history.push('/')
    }




  }


  enterKeyLogin(event) {
    if (event.charCode == 13) {
      this.handleLogin(event);
    }
  }

  async handleLogin(event) {
    event.preventDefault();
    // this.props.history.push("/Patient");
    // this.props.loginAction({}, true);
    // return
    var loginFailed = 0;
    try {
      this.setState({ loading: true });
      var token = "";
      await axios
        .post(this.url + "login", this.state.loginModel)
        .then(response => {
          token = response.data;
        })
        .catch(error => {
          console.log("Error in Login : ", error);
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 404) {
                Swal.fire("LOGIN FAILED", "No User Found", "error").then(
                  sres => {
                    this.props.history.push("/");
                  }
                );
                loginFailed = -1;
                return
              } else if (error.response.status == 400) {
                if (error.response.data) {
                  Swal.fire("LOGIN FAILED", error.response.data + "", "error").then(
                    sres => {
                      this.props.history.push("/");
                    }
                  );
                }
                loginFailed = -1;
                return
              } else if (error.response.status == 401) {
                Swal.fire("LOGIN FAILED", "UnAuthorized Access", "error").then(
                  sres => {
                    this.props.history.push("/");
                  }
                );
                return
              } else {
                Swal.fire("LOGIN FAILED", "Please Try Again", "error").then(
                  sres => {
                    this.props.history.push("/");
                  }
                );
                loginFailed = -1;
                return
              }
            }

          }
          loginFailed = 1;
        });

      if (loginFailed == 1) {
        await this.setState({ loading: false });
        Swal.fire("LOGIN FAILED", "Internal Server Error", "error")
        return
      } else if (loginFailed == -1) {
        this.setState({ loading: false })
        return
      }
      // Get User Info
      await axios({
        url: this.url + "getUserInfo",
        method: "get",
        headers: {
          Authorization: "Bearer  " + token
        }
      })
        .then(response => {
          this.props.loginAction(token, true);
          this.props.userInfo(response.data);
          this.setState({ loading: false });
          this.props.history.push("/Dashboard");
          this.props.selectTabAction("Dashboard")
        })
        .catch(error => {
          this.props.history.push("/");
          this.setState({ loading: false });
          Swal.fire("ERROR", "No Practice Found", "error")
        });



    } catch { this.setState({ loading: false }) }
    this.setState({ loading: false })
    // window.location.reload(true) ;
  }

  handleChange(event) {
    this.setState({
      loginModel: {
        ...this.state.loginModel,
        [event.target.name]: event.target.value
      }
    });
  }


  render() {
    let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="spiner">
          <GifLoader
            loading={true}
            imageSrc={Eclips}
            imageStyle={{ marginTop: "20%", width: "100px", height: "100px" }}
            overlayBackground="rgba(0,0,0,0.5)"
          />
        </div>
      );
    }

    return (

      <div className="login-bg" style={{ height: "780px" }}>
        <div className="container">
          {spiner}
          <div className="row opcity justify-content-center" style={{ marginTop: "12%" }}>
            <div className="col-xl-10 col-lg-12 col-md-9">
              <div className="card o-hidden border-0 shadow-lg my-5">
                <div className="card-body p-0">
                  <div className="row">
                    <div className="col-lg-6">
                      <img
                        className="float-right p-5"
                        src={medifusionLoginLogo}
                        style={{ width: "460px", height: "190px" }}
                        alt=""
                      />
                      <img
                        className="text-center pl-5"
                        src={userLoginIcon}
                        style={{ width: "210px", height: "207px" }}
                        alt=""
                      />
                    </div>
                    <div className="col-lg-6">
                      <div>
                        <img
                          className="float-right p-5"
                          src={medicalIcon}
                          style={{ width: "190px", height: "190px" }}
                          alt=""
                        />
                        <form className="user p-4">
                          <div className="form-group">
                            <input
                              style={{ borderRadius: "5px" }}
                              type="email"
                              className="form-control form-control-user"
                              aria-describedby="emailHelp"
                              placeholder="Enter Email Address..."
                              value={this.state.loginModel.email}
                              name="email"
                              id="email"
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="form-group">
                            <input
                              style={{ borderRadius: "5px" }}
                              type="password"
                              className="form-control form-control-user"
                              placeholder="Password"
                              value={this.state.loginModel.password}
                              name="password"
                              id="password"
                              onChange={this.handleChange}
                              onKeyPress={(event) => this.enterKeyLogin(event)}
                            />
                          </div>
                          <div className="form-group">
                            <div
                              className="custom-control custom-checkbox float-left small"
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="rememberme"
                              />
                              <label className="custom-control-label" for="rememberme"
                              >Remember Me</label
                              >
                            </div>

                            <div
                              className="custom-control custom-checkbox float-right small"
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="forgotpass"
                              />
                              <label className="custom-control-label" for="forgotpass"
                              >Forgot Password</label
                              >
                            </div>
                          </div>
                          <div className="clearfix"></div>
                          <br ></br>
                          <button
                            style={{ marginTop: "-6px" }}
                            class="btn btn-primary mr-2"
                            type="submit"
                            onClick={event => this.handleLogin(event)}
                          >
                            Login
                        </button>
                        </form>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>






    );
  }
}

function mapStateToProps(state) {
  return {
    patientInfo: state.selectPatient ? state.selectPatient : null,
    cptCodes: state.CPTReducer ? state.CPTReducer : [],
    icdCodes: state.ICDReducer ? state.ICDReducer : [],
    posCodes: state.POSReducer ? state.POSReducer : [],
    modifiers: state.ModifierReducer ? state.ModifierReducer : [],
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo1: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null, clientID: null },
    rights: state.loginInfo
      ? {
        search: state.loginInfo.rights.chargesSearch,
        add: state.loginInfo.rights.chargesCreate,
        update: state.loginInfo.rights.chargesEdit,
        delete: state.loginInfo.rights.chargesDelete,
        export: state.loginInfo.rights.chargesExport,
        import: state.loginInfo.rights.chargesImport,
        resubmit: state.loginInfo.rights.resubmitCharges
      }
      : []
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectTabPageAction: selectTabPageAction,
      loginAction: loginAction,
      selectTabAction: selectTabAction,
      setICDAction: setICDAction,
      userInfo: userInfo
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(Login)
);








{/* <div className="login-bg-img">

        <div className="container login-form" style={{ marginTop: "0px" }}>
          <div className="row">
            <div className="mf-6" style={{ marginRight: "0px" }}>
              <div>
                <div className="mf-12 text-center">
                  <img src={loginLogo} alt="" />
                </div>
                <div className="mf-12 pL-75">
                  <p>User Name </p>
                  <input
                    type="text"
                    value={this.state.loginModel.email}
                    name="email"
                    id="email"
                    onChange={this.handleChange}
                  ></input>
                </div>
                <div className="mf-12 pL-75">
                  <p>Password </p>
                  <input
                    type="password"
                    value={this.state.loginModel.password}
                    name="password"
                    id="password"
                    onChange={this.handleChange}
                    onKeyPress={this.enterKeyLogin}
                  ></input>
                </div>
                <div className="mf-12 pL-75">
                  <a href="#">Forgot Password?</a>
                </div>
                <div className="mf-12 pL-75">
                  <a
                    href="#"
                    className="login-btn"
                    onClick={this.handleLogin}
                  >
                    Login
                  </a>
                  {spiner}
                </div>
              </div>
            </div>
            <div
              className="mf-6 login-formBg-img"
              style={{ marginLeft: "0px" }}
            ></div>
          </div>
        </div>
      </div> */}
