import React, { Component } from "react";
// import image from "../../NewPages/assets/user.png";
// import image2 from "../../NewPages/assets/alert.svg";
// import print from "../../NewPages/assets/print.png";
// import fax from "../../NewPages/assets/fax.png";
// import Schedule from "../Schedual/SchedualAppointment/SchedualAppointment";
import axios from "axios";
import "./TopForm.css";
import alertIcon from "../../images/alert-icon.png"
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loginAction } from "../../actions/LoginAction";
import $ from "jquery";
import Swal from "sweetalert2";
import { show } from "react-tooltip";
// import patientPic from "../images/profile-pic.png";
import patientPic from "../../images/patient-img.png";

class TopForm extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/Patient/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.state = {
      show: false,
      formData: [],
    };
  }

  dataHandler = () => {
    this.setState({ show: !this.state.show });
  };
  componentDidMount() {
    try {
      let patientid = this.props.patientID;
      axios
        .get(this.url + `PatientSummary/${patientid}`, this.config)
        .then((response) => {
          console.log("TopForm Response", response.data);
          this.setState({ formData: response.data });
        })
        .catch((error) => error);
    } catch (error) {}
  }
  render() {
    return (
      <div class="row">
        <div class="col-md-12 float-left provider-form">
          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="col-md-6 col-sm-6 m-0 p-0 float-left">
                {" "}
                <strong class="pname"><span>{this.state.formData.patientName}</span></strong>{" "}
                <strong class="ml-2 blue-titles mr-1">Age:</strong>{" "}
                <span class="gray-text f14 span">
                <span>{this.state.formData.age}</span> years old
                </span>{" "}
                <span class=" ml-2 blue-titles mr-1">DOB:</span>{" "}
                <span className="span">{this.state.formData.dob}</span>
              </div>
              <div class="col-md-0 col-sm-0 float-right">
                {" "}
                <strong class="blue-titles f13">Patient ID:</strong>{" "}
                  <span class="gray-text f13 pl-2">{this.props.patientID}</span>{" "}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-0 col-sm-0 mr-2 float-left mt-2 m-0 p-0 text-left"
            style={{width:"7%"}}>
              {" "}
              <img src={
                    this.state.formData.profilePic
                      ? this.state.formData.profilePic
                      : patientPic
                  } alt="" style={{borderRadius:"50%"}} />{" "}
            </div>
            <div class="col-lg-6 col-md-6 pt-4 col-sm-6">
              <div class="col-md-0 col-sm-0 p-0 m-0 float-left">
                <p class="blue-titles p-0 m-0 pb-1 f13">
                  <strong>Email:</strong>
                </p>
                <p class="blue-titles p-0 m-0 f13">
                  <strong>Primary Provider:</strong>
                </p>
                <p class="blue-titles p-0 m-0 f13">
                  <strong>Phone:</strong>
                </p>
                <p class="blue-titles  p-0 m-0 f13">
                  <strong>Address:</strong>
                </p>
              </div>
              <div class="col-md-4 col-sm-4 pl-2 p-0 m-0 float-left">
                <p class="gray-text f12   m-0" style={{height:"22px"}}>{this.state.formData.email}</p>
                <p class="gray-text f12   m-0" style={{height:"20px" , paddingTop:"2px"}}>{this.state.formData.provider}</p>
                <p class="gray-text f12   m-0" style={{height:"20px" , paddingTop:"2px"}}>{this.state.formData.phoneNumber}</p>
                <p class="gray-text f12   m-0" style={{height:"20px" , paddingTop:"2px"}}>
                {this.state.formData.address}
                </p>
              </div>
              <div class="col-md-0 col-sm-0 p-0 m-0 float-left">
                <p class="blue-titles p-0 m-0 pb-1 f14">
                  <strong>Added Date:</strong>
                </p>
                <p class="blue-titles p-0 m-0 f14">
                  <strong>Added by:</strong>
                </p>
                <p class="blue-titles p-0 m-0 f14">
                  <strong>Modify Date:</strong>
                </p>
                <p class="blue-titles  p-0 m-0 f14">
                  <strong>Modify by:</strong>
                </p>
              </div>
              <div class="col-md-0 col-sm-0 p-0 m-0 pl-1 float-left">
                <p class="gray-text f12 m-0" style={{height:"23px"}}> {this.state.formData.addedDate}</p>
                <p class="gray-text f12 m-0" style={{height:"20px"}}>{this.state.formData.addedBy}</p>
                <p class="gray-text f12 m-0" style={{height:"20px"}}>{this.state.formData.updatedDate}</p>
                <p class="gray-text f12 m-0" style={{height:"20px"}}>{this.state.formData.updatedBy}</p>
              </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4 mt-4 p-0 m-0 float-right">
              {/* <div class="col-md-0 img-rounded col-sm-0 p-2 m-0 float-left alert-danger">
                {" "}
                <span class="float-left col-md-2 block p-0 m-0 mr-1">
                  <img src={alertIcon} alt="" />
                </span>
                <p class="f12 block col-md-12 blue pl-5 block pt-1 p-0 m-0">
                  <a href="#">
                    Management screening for all women aged 40-74 ,Adult
                    immunization Schedule Age 27-49
                  </a>
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loginAction: loginAction,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(TopForm);
