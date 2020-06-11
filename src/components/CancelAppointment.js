import React, { Component } from "react";

import $ from "jquery";

import axios from "axios";

import Input from "./Input";

import Label from "./Label";

import Swal from "sweetalert2";

import moment from "moment";

//Reducer Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

export class CancelAppointment extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/patientappointment/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.daySheet = {
      patient: "",
      patientName: "",
      accountNum: "",
      locationID: "",
      providerID: "",
      appointmentDate: "",
      time: "",
      timeInterval: 15,
      reasonID: "",
      status: "",
      notes: "",
      cell: ""
    };
    this.patInfo = {
      patientName: "",
      patientID: "",
      patientName: "",
      dob: "",
      phoneNumber: "",
      planName: "",
      subscriberID: ""
    };

    this.validationModel = {
      valpatient: null,
      valprovider: null,
      valappointdate: null,
      valfromTime: null,
      valvisitreason: null
    };

    this.state = {
      editId: this.props.id,

      resData: [],
      staData: [],
      locData: [],
      patData: [],
      patientData: [],
      daySheet: this.daySheet,
      patInfo: this.patInfo,
      validationModel: this.validationModel,
      providerData: [],
      locationData: [],
      maxHeight: "361",
      appTime: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.saveResDaysheet = this.saveResDaysheet.bind(this);
    this.handlePatientChange = this.handlePatientChange.bind(this);
  }

  saveResDaysheet = e => {
    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.patInfo.patientID)) {
      myVal.valpatient = <span className="validationMsg">Select Patient</span>;
      myVal.validation = true;
    } else {
      myVal.valpatient = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.daySheet.providerID)) {
      myVal.valprovider = (
        <span className="validationMsg">Select Provider</span>
      );
      myVal.validation = true;
    } else {
      myVal.valprovider = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.daySheet.appointmentDate)) {
      myVal.valappointdate = (
        <span className="validationMsg">Select Appointment Date</span>
      );
      myVal.validation = true;
    } else {
      myVal.valappointdate = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.daySheet.visitReasonID)) {
      myVal.valvisitreason = (
        <span className="validationMsg">Select Visit Reason</span>
      );
      myVal.validation = true;
    } else {
      myVal.valvisitreason = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    this.setState({
      validationModel: myVal
    });

    if (myVal.validation === true) {
      return;
    }

    console.log(this.state.daySheet);
    axios
      .post(
        this.url + "SavePatientAppointment",
        this.state.daySheet,
        this.config
      )
      .then(response => {
        this.setState({
          daySheet: response.data,
          patInfo: response.data,
          editId: response.data.id
        });

        Swal.fire("Record Saved Successfully", "", "success");
        this.componentWillMount();
      })
      .catch(error => {
        let errorList = [];
        if (error.response !== null && error !== null) {
          errorList = error.response;
          console.log(errorList);

          Swal.fire({
            type: "error",
            text: "Please Select valid value"
          });
        } else console.log(error);
      });

    e.preventDefault();
  };

  setModalMaxHeight(element) {
    this.$element = $(element);
    this.$content = this.$element.find(".modal-content");
    var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
    var dialogMargin = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight = this.$element.find(".modal-header").outerHeight() || 0;
    var footerHeight = this.$element.find(".modal-footer").outerHeight() || 0;
    var maxHeight = contentHeight - (headerHeight + footerHeight);

    this.setState({ maxHeight: maxHeight });
  }

  //Handle Patient Change
  handlePatientChange = event => {
    this.setState({
      daySheet: {
        ...this.state.patInfo,
        [event.target.name]:
          event.target.value == "Please Select" ? null : event.target.value
      }
    });

    axios
      .get(this.url + "FindPatientInfo/" + event.target.value, this.config)
      .then(response => {
        this.setState({
          patInfo: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  isNull(value) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select"
    )
      return true;
    else return false;
  }

  componentWillMount() {
    axios
      .get(this.url + "GetPatientAppointments", this.config)
      .then(response => {
        this.setState({
          patData: response.data
        });

        console.log("patient data", this.state.patData);
      })
      .catch(error => {
        console.log(error);
      });

    axios
      .get(this.url + "GetProfiles", this.config)
      .then(response => {
        this.setState({
          patientData: response.data.patient,
          resData: response.data.visitReason
        });

        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });

    //Schedule Screen Props
    try {
      console.log("Schedulwe Props : ", this.props.meetingSlotObj.start);
      console.log(
        "Schedule Date And Time : ",
        moment(this.props.meetingSlotObj.start)
          .format()
          .slice(11, 19)
      );
      this.setState({
        daySheet: {
          ...this.state.daySheet,
          providerID: this.props.providerID,
          appointmentDate: moment(this.props.meetingSlotObj.start)
            .format()
            .slice(0, 19)
        }
      });
    } catch {}
  }

  async handleChange(event) {
    await this.setState({
      daySheet: {
        ...this.state.daySheet,
        [event.target.name]: event.target.value
      }
    });

    if (
      this.state.daySheet.providerID != null &&
      this.state.daySheet.locationID != null &&
      this.state.daySheet.appointmentDate != null
    ) {
      var object = {
        providerID: this.state.daySheet.providerID,
        locationID: this.state.daySheet.locationID,
        appointmentDate: this.state.daySheet.appointmentDate
      };

      console.log("Vacent Slot Object : ", object);
      axios
        .post(this.url + "VacantSlots", object, this.config)
        .then(response => {
          console.log("Vacent Slot Response API : ", response.data);
          this.setState({
            appTime: response.data
          });
          if (response.data.providerSlotID === null) {
            Swal.fire("Error", "No Appointment Slot is available ", "error");
          }

          console.log("data is", this.state.appTime);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  componentDidMount() {
    this.setModalMaxHeight($(".modal"));
    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function() {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);

    if (this.state.editId > 0) {
      axios
        .get(
          this.url + "FindPatientAppointment/" + this.state.editId,
          this.config
        )
        .then(response => {
          var object = {
            providerID: response.data.providerID,
            locationID: response.data.locationID,
            appointmentDate: response.data.appointmentDate
          };
          console.log("data :: object", object);

          // console.log("this is we sending in props", this.state.resObject)

          // axios
          //     .post(this.url + "VacantSlots", object, this.config)
          //     .then(vsresponse => {
          //         this.setState({
          //             appTime: vsresponse.data
          //         });
          //         if (vsresponse.data.providerSlotID === null) {
          //             Swal.fire(
          //                 "Error",
          //                 "No Appointment Slot is available ",
          //                 "error"
          //             );
          //         }

          //         console.log("data is", this.state.appTime);
          //     })
          //     .catch(error => {
          //         console.log(error);
          //     });

          axios
            .get(
              this.url + "FindPatientInfo/" + response.data.patientID,
              this.config
            )
            .then(isresponse => {
              this.setState({
                patInfo: isresponse.data,
                daySheet: response.data,
                resObject: response.data
              });

              var time = response.data.time;
              this.setState({
                appTime: [
                  {
                    id: null,
                    fromTime: response.data.time
                      ? response.data.time.slice(11, 16)
                      : ""
                  }
                ]
              });
              console.log(time);

              console.log(isresponse.data);
              console.log(isresponse);
            })
            .catch(error => {
              console.log(error);
            });

          console.log("Sending to schedule ", this.state.resObject);
          console.log(response.data);
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  render() {
    var providerFromDate = this.state.daySheet.appointmentDate
      ? this.state.daySheet.appointmentDate.replace("T00:00:00", "")
      : "";

    var appT = this.state.daySheet.time
      ? this.state.daySheet.time.slice(11, 16)
      : "";

    console.log("Time ; ", this.state.appTime);

    console.log(appT);

    if (this.props.userInfo.userProviders.length > 0) {
      if (this.state.providerData.length == 0) {
        if (this.state.editId == 0) {
          this.setState({
            daySheet: {
              ...this.state.daySheet,
              providerID: this.props.userInfo.providerID
            },
            providerData: this.props.userInfo.userProviders
          });
        } else {
          this.setState({
            daySheet: {
              ...this.state.daySheet,
              providerID: this.props.userInfo.providerID
            },
            providerData: this.props.userInfo.userProviders
          });
        }
      }
    }

    if (this.props.userInfo.userLocations.length > 0) {
      if (this.state.locationData.length == 0) {
        if (this.state.editId == 0) {
          this.setState({
            daySheet: {
              ...this.state.daySheet,
              locationID: this.props.userInfo.locationID
            },
            locationData: this.props.userInfo.userLocations
          });
        } else {
          this.setState({
            daySheet: {
              ...this.state.daySheet,
              locationID: this.props.userInfo.locationID
            },
            locationData: this.props.userInfo.userLocations
          });
        }
      }
    }

    const statusData = [
      { value: "", display: "Select Type" },
      { value: "C", display: "Canceled" },
      { value: "N", display: "No Show" }
    ];

    return (
      <React.Fragment>
        <div
          id="procanReschModal"
          className="modal fade bs-example-modal-new show"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myLargeModalLabel"
          style={{ display: "block", paddingRight: "17px" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ overflow: "hidden" }}>
              <button
                onClick={this.props.onClose()}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true"></span>
              </button>
              <div className="modal-header">
                <div className="mf-12">
                  <div className="row">
                    <div className="mf-6 popupHeading">
                      <h1 className="modal-title">
                        {this.state.editId > 0
                          ? this.state.patInfo.patientName +
                            " - " +
                            this.state.daySheet.appointmentDate.replace(
                              "T00:00:00",
                              ""
                            )
                          : "CANCEL APPOINTMENT"}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="modal-body"
                style={{ maxHeight: this.state.maxHeight }}
              >
                <div className="mainTable">
                  <div className="mf-12 headingOne mt-25">
                    <p>Patient Information</p>
                  </div>
                  <div className="row-form">
                    <div className="mf-4">
                      <label>
                        Patient<span className="redlbl"> *</span>
                      </label>
                      <div className="selectBoxValidate">
                        <select
                          className={
                            this.state.validationModel.valpatient
                              ? this.errorField
                              : ""
                          }
                          name="patientID"
                          id="patientID"
                          value={this.state.patInfo.patientID}
                          onChange={this.handlePatientChange}
                        >
                          {this.state.patientData.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.description}
                            </option>
                          ))}
                        </select>
                        {this.state.validationModel.valpatient}
                      </div>
                    </div>

                    <div className="mf-4">
                      <Label name="Plan"></Label>
                      <Input
                        type="text"
                        name="planName"
                        id="planName"
                        value={this.state.patInfo.planName}
                        onChange={() => this.handleChange}
                      ></Input>
                    </div>

                    <div className="mf-4"></div>
                  </div>

                  <div className="mf-12 headingOne mt-25">
                    <p>Cancel Appointment Details</p>
                  </div>
                  <div className="row-form">
                    <div className="mf-6">
                      <label>
                        Provider<span className="redlbl"> *</span>
                      </label>

                      <div className="selectBoxValidate">
                        <select
                          className={
                            this.state.validationModel.valprovider
                              ? this.errorField
                              : ""
                          }
                          // disabled={this.state.editId > 0 ? true : false}
                          name="providerID"
                          id="providerID"
                          value={this.state.daySheet.providerID}
                          onChange={this.handleChange}
                        >
                          {this.state.providerData.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.description}
                            </option>
                          ))}
                        </select>
                        {this.state.validationModel.valprovider}
                      </div>
                    </div>

                    <div className="mf-6">
                      <label>Location</label>

                      <select
                        // disabled={this.state.editId > 0 ? true : false}
                        name="locationID"
                        id="locationID"
                        value={this.state.daySheet.locationID}
                        onChange={this.handleChange}
                      >
                        {this.state.locationData.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.description}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* <div className="mf-4">&nbsp;</div> */}
                  </div>

                  <div className="row-form">
                    <div className="mf-6">
                      <label>
                        Appointment DATE<span className="redlbl"> *</span>
                      </label>
                      <div className="textBoxValidate">
                        <input
                          className={
                            this.state.validationModel.valappointdate
                              ? this.errorField
                              : ""
                          }
                          style={{
                            width: "215px",
                            marginLeft: "0px"
                          }}
                          // disabled={this.state.editId > 0 ? true : false}
                          className="myInput"
                          type="date"
                          name="appointmentDate"
                          id="appointmentDate"
                          value={providerFromDate}
                          onChange={this.handleChange}
                          // onClick={this.handleChange}
                        ></input>
                        {this.state.validationModel.valappointdate}
                      </div>
                    </div>

                    <div className="mf-6">
                      <label>Appointment Slots</label>
                      <div className="textBoxTwoField">
                        <select
                          name="providerSlotID"
                          id="providerSlotID"
                          disabled={this.state.editId > 0 ? true : false}
                          value={this.state.daySheet.providerSlotID}
                          onChange={this.handleChange}
                        >
                          {this.state.appTime.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.fromTime}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* <div className="textBoxTwoField">
                                                <select
                                                    name="providerSlotID"
                                                    id="providerSlotID"
                                                    // disabled={this.state.editId > 0 ? true : false}
                                                    value={this.state.editId > 0 ? null : this.state.daySheet.providerSlotID}
                                                    onChange={this.handleChange}
                                                >
                                                    {this.state.appTime.map(s => (
                                                        <option key={s.id} value={s.id}>
                                                            {s.fromTime}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div> */}
                    </div>
                  </div>

                  <div className="row-form">
                    <div className="mf-6">
                      <label>Cancel Type</label>
                      <div className="selectBoxValidate">
                        <select
                          name="status"
                          id="status"
                          // disabled="disabled"
                          value={this.state.daySheet.status}
                          onChange={this.handleChange}
                        >
                          {statusData.map(s => (
                            <option key={s.value} value={s.value}>
                              {s.display}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mf-6">
                      <label>
                        Visit Reason<span className="redlbl"> *</span>
                      </label>

                      <div className="selectBoxValidate">
                        <select
                          className={
                            this.state.validationModel.valvisitreason
                              ? this.errorField
                              : ""
                          }
                          name="visitReasonID"
                          id="visitReasonID"
                          value={this.state.daySheet.visitReasonID}
                          onChange={this.handleChange}
                        >
                          {this.state.resData.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.description}
                            </option>
                          ))}
                        </select>
                        {this.state.validationModel.valvisitreason}
                      </div>
                    </div>
                  </div>

                  <div className="row-form">
                    <div className="mf-12 field_full-8">
                      <label>Notes:</label>
                      <textarea
                        name="notes"
                        id="notes"
                        cols="30"
                        rows="10"
                        value={this.state.daySheet.notes}
                        onChange={this.handleChange}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="mainTable">
                    <div className="row-form row-btn">
                      <div className="mf-12">
                        <button
                          className="btn-blue"
                          onClick={this.saveResDaysheet}
                        >
                          Save{" "}
                        </button>
                        <button
                          id="btnCancel"
                          className="btn-grey"
                          data-dismiss="modal"
                          onClick={this.props.onClose()}
                        >
                          Cancel{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  console.log("state from Header Page", state);
  return {
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    // id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null }
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectTabPageAction: selectTabPageAction,
      loginAction: loginAction,
      selectTabAction: selectTabAction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(CancelAppointment);
