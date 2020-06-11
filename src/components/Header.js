import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";

//Images
import logoutimage from "../images/icons/logout.png";
import logoImage from "../images/logo-Medi-Fusion.png";
import switchPracticeImage from "../images/icons/practice-change.png";
import dashboardHIcon from "../images/icons/dashboardh.png";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import dashboardIcon from "../images/icons/scheduler.png";
import schedulerIcon from "../images/icons/scheduler.png";
import patientIcon from "../images/icons/patient.png";
import chargesIcon from "../images/icons/charges.png";
import submissionIcon from "../images/icons/submission.png";
import paymentIcon from "../images/icons/payment.png";
import followupIcon from "../images/icons/scheduler.png";
import reportsIcon from "../images/icons/reports.png";
import setupIcon from "../images/icons/scheduler.png";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { userInfo } from "../actions/userInfo";
import { setVisitGridData } from "../actions/SetVisitGridDataAction";
import { setPatientGridData } from "../actions/SetPatientGridDataAction";
import { selectPatient } from "../actions/selectPatient";

class Header extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/account/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.userPracticeModel = {
      userPracticeID: 0,
    };

    this.state = {
      userPractices: [],
      userPracticeModel: this.userPracticeModel,
      loading: false,
      image: "",
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handleUserPracticeChange = this.handleUserPracticeChange.bind(this);
  }

  componentWillMount() {
    if (this.props.loginObject.isLogin == false) {
      this.props.history.push("/");
    }
  }

  mouseEnter = (img) => {
    this.setState({ image: dashboardHIcon });
  };

  mouseLeave = (img) => {
    this.setState({ image: dashboardIcon });
  };

  async setUserPractices() {
    await this.setState({ loading: true });
    try {
      await axios
        .get(this.url + "getUserInfo", this.config)
        .then((response) => {
          this.setState({ userPractices: response.data.userPractices });
          this.props.userInfo(response.data);
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
        });
    } catch {
      this.setState({ loading: false });
    }

    this.setState({ loading: false });
  }
  //Selected TAB
  selectTab(tab) {
    this.setState({ selectedTab: tab });
  }

  // Handle Logout
  handleLogout() {
    Swal.fire({
      title: "Are you sure, you want to Logout?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.value) {
        this.setState({ loading: true });
        if (result.value == true) {
          this.props.userInfo(null);
          this.props.loginAction("", false);
          this.props.history.push("/");
        }
        window.location.reload(true);
      }
    });
  }

  //Handle User Practice Change
  async handleUserPracticeChange(event) {
    event.preventDefault();
    var practiceID = event.target.value;
    if (practiceID === "Please Select") {
      await this.setState({
        userPracticeModel: {
          ...this.state.userPracticeModel,
          userPracticeID: event.target.value,
        },
      });
      return;
    } else {
      Swal.fire({
        title: "Are you sure, you want to Change this Practice?",
        text: "",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Change it!",
      }).then((result) => {
        if (result.value) {
          this.setState({ loading: true });
          // Get User Info
          axios
            .get(this.url + "switchPractice/" + practiceID, this.config)
            .then((response) => {
              this.props.loginAction(response.data.token, true);
              this.props.userInfo(response.data);
              this.props.setPatientGridData([]);
              this.props.setVisitGridData([]);
              this.props.selectPatient({ ID: null, accNum: null });
              this.props.history.push("/Dashboard");
              this.setState({
                loading: false,
              });
            })
            .catch((error) => {
              this.setState({ loading: false });
              if (error.response) {
                if (error.response.status) {
                  Swal.fire("Error", "Please Try Again", "error");
                }
              } else if (error.request) {
                console.log(error.request);
              } else {
                console.log("Error", error.message);
              }
              console.log(JSON.stringify(error));
            });
        }
      });
    }
  }

  //Handle Route change clinek
  handleRouteChangeClick = (event, to) => {
    event.preventDefault();
    this.props.history.push(`/${to}`);
    this.props.selectTabAction(to);
  };

  componentWillReceiveProps = async(newProps)=>{
    if(this.props !== newProps){
      let userPractices = await this.props.userInfo1.userPractices.filter(practice => practice.id !== null)
      var userPractice = await this.props.userInfo1.userPractices.filter(
        (option) => option.id ==  this.props.userInfo1.practiceID
      );
      console.log("User Practice Props : " , userPractice , userPractices)
      this.setState({userPractice : userPractice[0] ,  userPractices: userPractices });
    }
  }

  handlePracticeChangeNew = (event) =>{
    console.log("User Practice : " , event)

   
    if(event){
      var practiceID = event.id;
      if (practiceID) {
        Swal.fire({
          title: "Are you sure, you want to Change this Practice?",
          text: "",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Change it!",
        }).then((result) => {
          if (result.value) {
            this.setState({ loading: true });
            // Get User Info
            axios
              .get(this.url + "switchPractice/" + practiceID, this.config)
              .then((response) => {
                this.props.loginAction(response.data.token, true);
                this.props.userInfo(response.data);
                this.props.setPatientGridData([]);
                this.props.setVisitGridData([]);
                this.props.selectPatient({ ID: null, accNum: null });
                this.props.history.push("/Dashboard");
                this.props.selectTabAction("Dashboard")
                this.setState({
                  loading: false,
                  userPractice:event
                });
              })
              .catch((error) => {
                this.setState({ loading: false });
                if (error.response) {
                  if (error.response.status) {
                    Swal.fire("Error", "Please Try Again", "error");
                  }
                } else if (error.request) {
                  console.log(error.request);
                } else {
                  console.log("Error", error.message);
                }
                console.log(JSON.stringify(error));
              });
          }
        });
      }
    }else{
      this.setState({
        userPractice:null
      });
    }

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

    console.log("Selected Tab Action : ", this.state.userPractice);
    return (
      <React.Fragment>
        {spiner}

        <div className="row" style={{ backgroundColor: "#fff" }}>
          <div className="col-md-4 bg-white">
            {/* <!-- Sidebar - Brand --> */}
            <span>
              <a href="index.html">
                <img className="logo img-fluid" src={logoImage} alt="" />
              </a>
            </span>
          </div>

          {/* <!-- Login Message --> */}
          <div className="col-md-8">
            <ul className="login float-right pt-0">
              <li className="fa fa-user pt-3">
                <span className="user" title={this.props.userInfo1.name}>
                  {this.props.userInfo1.name
                    ? "Welcome  " + this.props.userInfo1.name
                    : "Welcome"}
                </span>
              </li>

              <li className="topbar-divider mt-2 d-none d-sm-block"></li>

              <li className="pt-2">

              <Select
                 value={this.state.userPractice}
                onChange={
                  this.handlePracticeChangeNew
                }
                options={this.state.userPractices}
                getOptionLabel={option => option["description"]}
                getOptionValue={option => option["id"]}

                // onKeyDown={(e)=>this.filterOption(e)}
                // filterOption={this.filterOption}
                placeholder=""
                isClearable={false}
                isSearchable={true}
                // menuPosition="static"
                openMenuOnClick={true}
                escapeClearsValue={false}
                styles={{
                  control: (defaultStyles) => ({
                    ...defaultStyles,                   
                    boxShadow: "none",
                    borderColor: "#eb788f",
                    "&:hover": {
                      borderColor: "#eb788f",
                    },
                  }),
                  container: (defaultStyles) => ({
                    ...defaultStyles,
                    width: "200px",
                  }),
                  clearIndicator: (defaultStyles) => ({
                    ...defaultStyles,
                    color: "#286881",
                  }),                 
                }}
              />
                {/* <select
                  style={{
                    borderRadius: "3px",
                    border: "1px solid rgb(250, 194, 205)",
                    boxSizing: "border-box",
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "500",
                    height: "36px",
                    lineHeight: "auto",
                    outline: "none",
                    position: "relative",
                    width: "180px",
                    paddingLeft: "2px",
                    color: "rgb(67, 75, 93",
                  }}
                  name="userPracticeID"
                  id="userPracticeID"
                  value={
                    this.state.userPracticeModel.userPracticeID > 1 ||
                    this.state.userPracticeModel.userPracticeID ==
                      "Please Select"
                      ? this.state.userPracticeModel.userPracticeID
                      : this.props.userInfo1.practiceID
                  }
                  onChange={this.handleUserPracticeChange}
                >
                  {this.state.userPractices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.description}
                    </option>
                  ))}
                </select> */}
              </li>

              <li className="topbar-divider mt-2 d-none d-sm-block"></li>
              <li className="nav-item pt-3">
                <a href="#" title="Refresh">
                  <img
                    src={switchPracticeImage}
                    alt="SwitchPractice"
                    onClick={this.setUserPractices.bind(this)}
                  />
                </a>
              </li>
              <li className="topbar-divider mt-2 d-none d-sm-block"></li>
              <li className="nav-item pt-3">
                <a href="#" title="Logout">
                  <img
                    src={logoutimage}
                    alt="Logo"
                    onClick={this.handleLogout}
                  />
                </a>
              </li>
              <li className="topbar-divider mt-2 d-none d-sm-block"></li>
            </ul>
          </div>
          <div className="clearfix"></div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="topnav">
              <label for="show-menu" className="show-menu">
                Show Menu
              </label>
              <input type="checkbox" id="show-menu" role="button" />
              <ul id="menu">
                <li>
                  <a
                    className={
                      this.props.selectedTab === "Dashboard" ? "activeTab" : ""
                    }
                    href=""
                    onClick={(event) =>
                      this.handleRouteChangeClick(event, "Dashboard")
                    }
                  >
                    <span>
                      <img
                        src={dashboardIcon}
                        alt=""
                        style={{ width: "32px" }}
                      />
                    </span>
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    className={
                      this.props.selectedTab === "Scheduler" ? "activeTab" : ""
                    }
                    href=""
                    onClick={(event) =>
                      this.handleRouteChangeClick(event, "Scheduler")
                    }
                  >
                    <span>
                      <img
                        src={schedulerIcon}
                        alt=""
                        style={{ width: "32px" }}
                      />
                    </span>
                    Scheduler
                  </a>
                </li>
                <li>
                  <a
                    className={
                      this.props.selectedTab === "Patient" ||
                      this.props.selectedTab === "NewPatient"
                        ? "activeTab"
                        : ""
                    }
                    href=""
                    onClick={(event) =>
                      this.handleRouteChangeClick(event, "Patient")
                    }
                  >
                    <span>
                      <img src={patientIcon} alt="" style={{ width: "32px" }} />
                    </span>
                    Patient
                  </a>
                </li>
                <li>
                  <a
                    className={
                      this.props.selectedTab === "Charges" ||
                      this.props.selectedTab === "NewCharge"
                        ? "activeTab"
                        : ""
                    }
                    href=""
                    onClick={(event) =>
                      this.handleRouteChangeClick(event, "Charges")
                    }
                  >
                    <span>
                      <img src={chargesIcon} alt="" style={{ width: "32px" }} />
                    </span>
                    Charges
                  </a>
                </li>
                <li>
                  <a
                    className={
                      this.props.selectedTab === "BATCHDOCUMENT" ||
                      this.props.selectedTab === "NEWBATCHDOCUMENT"
                        ? "activeTab"
                        : ""
                    }
                    href=""
                    onClick={(event) =>
                      this.handleRouteChangeClick(event, "BATCHDOCUMENT")
                    }
                  >
                    <span>
                      <img src={chargesIcon} alt="" style={{ width: "32px" }} />
                    </span>
                    Documents
                  </a>
                </li>
                <li>
                  <a
                    className={
                      this.props.selectedTab === "Submissions"
                        ? "activeTab"
                        : ""
                    }
                    href=""
                    onClick={(event) =>
                      this.handleRouteChangeClick(event, "Submissions")
                    }
                  >
                    <span>
                      <img
                        src={submissionIcon}
                        alt=""
                        style={{ width: "32px" }}
                      />
                    </span>
                    Submissions
                  </a>
                </li>
                <li>
                  <a
                    className={
                      this.props.selectedTab === "Payments" ||
                      this.props.selectedTab === "ManualPosting"
                        ? "activeTab"
                        : ""
                    }
                    href=""
                    onClick={(event) =>
                      this.handleRouteChangeClick(event, "Payments")
                    }
                  >
                    <span>
                      <img src={paymentIcon} alt="" style={{ width: "32px" }} />
                    </span>
                    Payments
                  </a>
                </li>
                <li>
                  <a
                    className={
                      this.props.selectedTab === "Followup" ? "activeTab" : ""
                    }
                    href=""
                    onClick={(event) =>
                      this.handleRouteChangeClick(event, "Followup")
                    }
                  >
                    <span>
                      <img
                        src={followupIcon}
                        alt=""
                        style={{ width: "32px" }}
                      />
                    </span>
                    Followup
                  </a>
                </li>
                <li>
                  <a
                    className={
                      this.props.selectedTab === "Reports" ? "activeTab" : ""
                    }
                    href=""
                    onClick={(event) =>
                      this.handleRouteChangeClick(event, "Reports")
                    }
                  >
                    <span>
                      <img src={reportsIcon} alt="" style={{ width: "32px" }} />
                    </span>
                    Reports
                  </a>
                </li>
                <li>
                  <a
                    className={
                      this.props.selectedTab === "Setup" ? "activeTab" : ""
                    }
                    href=""
                    onClick={(event) =>
                      this.handleRouteChangeClick(event, "Setup")
                    }
                  >
                    <span>
                      <img src={setupIcon} alt="" style={{ width: "32px" }} />
                    </span>
                    Setup
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo1:
      state.loginInfo != null
        ? state.loginInfo
        : { userPractices: [], name: "", practiceID: null },
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectTabPageAction: selectTabPageAction,
      loginAction: loginAction,
      selectTabAction: selectTabAction,
      userInfo: userInfo,
      setPatientGridData: setPatientGridData,
      setVisitGridData: setVisitGridData,
      selectPatient: selectPatient,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(Header)
);
