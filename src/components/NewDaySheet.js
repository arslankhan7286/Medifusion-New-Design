import React, { Component } from "react";
import $ from "jquery";
import Label from "./Label";
import Swal from "sweetalert2";
import axios from "axios";
import Input from "./Input";
import moment from "moment";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import RescheduleModal from "./RescheduleModal";
import CancelAppointment from "./CancelAppointment";

import NewLocation from "./NewLocation";
import NewProvider from "./NewProvider";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class NewDaySheet extends Component {
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
      patientID: "",
      accountNum: "",
      locationID: "",
      providerID: "",
      appointmentDate: "",
      time: "",

      visitInterval: "15",
      reasonID: "",
      status: "",
      notes: "",
      cell: ""
    };

    this.patInfo = {
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
      daySheet: this.daySheet,
      validationModel: this.validationModel,
      patInfo: this.patInfo,
      editId: this.props.id,
      isActive: true,
      data: [],
      daySheetdata: [],
      resData: [],
      staData: [],
      locData: [],
      patData: [],
      patientData: [],
      providerData: [],
      locationData: [],
      maxHeight: "361",
      appTime: [],
      resObject: {},

      popupName: "",

      // newDrop: [],

      showRePopup: false,
      showCanRePopup: false,
      loading: false
    };
    this.saveDaysheet = this.saveDaysheet.bind(this);
    this.handlePatientChange = this.handlePatientChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openReschedulePopup = this.openReschedulePopup.bind(this);
    this.openCancelReschedulePopup = this.openCancelReschedulePopup.bind(this);
    this.closeSheProSchedPopup = this.closeSheProSchedPopup.bind(this);
    this.closeSheCanProSchedPopup = this.closeSheCanProSchedPopup.bind(this);

    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

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

  async componentWillMount() {
    console.log("Edit ID : " , this.props)
    try {
      await this.setState({ loading: true });

      await this.setModalMaxHeight($(".modal"));
      var zIndex = 1040 + 10 * $(".modal:visible").length;
      $(this).css("z-Index", zIndex);
      setTimeout(function() {
        $(".modal-backdrop")
          .not(".modal-stack")
          .css("z-Index", zIndex - 1)
          .addClass("modal-stack");
      }, 0);

      if (this.state.editId > 0) {
        await axios
          .get(
            this.url + "FindPatientAppointment/" + this.state.editId,
            this.config
          )
          .then(response => {

            console.log("Patient Appoiintment : " , response.data)

            axios
              .get(
                this.url + "FindPatientInfo/" + response.data.patientID,
                this.config
              )
              .then(isresponse => {
                console.log("Patient Appointment Response : ", response.data);

                var time = response.data.time.slice(11, 16);
                if(time.slice(11,13) >= 12 ){
                  time = time + " " + "PM"
                }else{
                 time = time + " " + "AM"
                }

                this.setState({
                  patInfo: isresponse.data,
                  daySheet: response.data,
                  timeInterval: response.data.time,
                  resObject: response.data,
                  appTime: [
                    { id: null, fromTime: response.data.time ? time : "" }
                  ]
                });

                // var time = response.data.time.slice(11, 16);
                // this.setState({
                //   appTime: [
                //     { id: null, fromTime: response.data.time ? time : "" }
                //   ]

                  // appTime: [{ id: null, fromTime: response.data.time ? response.data.time.slice(11, 16) : "" }]
                // });
                // console.log(time);

                // console.log(
                //   "this is day sheet patient appointment",
                //   this.state.daySheet.timeInterval.moment().format("LT")
                // );
              })
              .catch(error => {
                console.log(error);
              });

            // console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      }

      await axios
        .get(this.url + "GetPatientAppointments", this.config)
        .then(response => {
          console.log("patient Appointments Response : " , response.data);
          this.setState({
            patData: response.data,
            daySheet : {
              ...this.state.daySheet , 
              status:"A"
            }
          });         
        })
        .catch(error => {
          console.log(error);
        });

      await axios
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

     
      

      try{
         //Schedule Screen Props
       console.log("Calender Scheduler Props : ", this.props.meetingSlotObj);
       if(this.props.meetingSlotObj.id == 0 ){
        var time = moment(this.props.meetingSlotObj.start).format();       
         if(time.slice(11,13) >= 12 ){
           time = time.slice(11,16) + " " + "PM"
         }else{
          time = time.slice(11,16) + " " + "AM"
         }

         console.log("Meeting Time : " , time);

        await this.setState({
          apointmentTime : time,
        daySheet: {
          ...this.state.daySheet,
          providerID: this.props.providerID,
          appointmentDate: moment(this.props.meetingSlotObj.start).format(),
          appTime: [
            { id: null, fromTime: time }
          ]
        }
      });
       }
      }catch{}
    } catch {
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  }

  //Handle Patient Change
  handlePatientChange = event => {
    this.setState({
      patInfo: {
        ...this.state.patInfo,
        [event.target.name]:
          event.target.value == "Please Select" ? null : event.target.value
      },
      daySheet: {
        ...this.state.daySheet,
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

  //Handle Change
  async handleChange(event) {

    console.log("Event Value : " , event.target.value)
    await this.setState({
      daySheet: {
        ...this.state.daySheet,
        [event.target.name]:event.target.name == "providerSlotID" ? event.target.value :  event.target.value.toUpperCase()
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
          console.log("Vacent Slot Response : ", response.data);
          this.setState({
            appTime: response.data
          });

          if (response.data.providerSlotID === null) {
            Swal.fire("Error", "No Appointment Slot is available ", "error");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  //set Model Max Height
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

  openCancelReschedulePopup = id => {
    console.log("Canceling the reschedule", id);
    this.setState({ showCanRePopup: true, id: id });
  };

  openReschedulePopup = id => {
    console.log("Rescheduling the reschedule", id);
    this.setState({ showRePopup: true, id: id });
  };

  async closeSheProSchedPopup(id) {
    console.log("Log ID :  " , id)
    $("#proReschModal").hide();
    await this.setState({
      showRePopup: false, editId: id,
      daySheet: {
        ...this.state.daySheet,
        id: id
      }
    });
    this.componentWillMount();
  }

  openPopup = (name, id) => {
    this.setState({ popupName: name, id: id });
  };

  closePopup = () => {
    $("#providerModal").hide();
    $("#locationModal").hide();
    this.setState({ popupName: "" });
  };

  closeSheCanProSchedPopup() {
    $("#procanReschModal").hide();
    this.setState({ showCanRePopup: false });
  }

  saveDaysheet = e => {
    this.setState({ loading: true });
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
      this.setState({ loading: false });
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
          editId: response.data.id,
          loading: false
        });

        Swal.fire("Record Saved Successfully", "", "success");
        this.componentWillMount();
      })
      .catch(error => {
        this.setState({ loading: false });
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

  render() {
    var providerFromDate = this.state.daySheet.appointmentDate
      ? this.state.daySheet.appointmentDate.slice(0,10)
      : "";

      console.log("Meeting Time :  : " , this.state.appTime)
    var appT = this.state.daySheet.time;

    let epopup = "";

    if (this.state.popupName === "location") {
      epopup = (
        <NewLocation
          onClose={() => this.closePopup}
          id={this.state.id}
        ></NewLocation>
      );
    } else if (this.state.popupName === "provider") {
      epopup = (
        <NewProvider
          onClose={() => this.closePopup}
          id={this.state.id}
        ></NewProvider>
      );
    } else epopup = <React.Fragment></React.Fragment>;

    // replace("T00:00:00", "") : "";
    // .slice(0, 10) : "";
    let popup = "";
    let canpopup = "";

    if (this.state.showRePopup) {
      popup = (
        <RescheduleModal
          onClose={this.closeSheProSchedPopup}
          id={this.state.id}
        ></RescheduleModal>
      );
    } else popup = <React.Fragment></React.Fragment>;

    if (this.state.showCanRePopup) {
      canpopup = (
        <CancelAppointment
          onClose={() => this.closeSheCanProSchedPopup}
          id={this.state.id}
        ></CancelAppointment>
      );
    } else canpopup = <React.Fragment></React.Fragment>;

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
      { value: "A", display: "Available" },
      { value: "S", display: "Scheduled" },
      { value: "R", display: "Re-Scheduled" },
      { value: "C", display: "Canceled" },
      { value: "N", display: "No Show" }
    ];

    let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="spiner">
          <GifLoader
            loading={true}
            imageSrc={Eclips}
            // imageStyle={imageStyle}
            overlayBackground="rgba(0,0,0,0.5)"
          />
        </div>
      );
    }

    return (
      <React.Fragment>
        <div
          id="myModal"
          className="modal fade bs-example-modal-new show"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myLargeModalLabel"
          style={{ display: "block", paddingRight: "17px" }}
        >
          <div className="modal-dialog modal-lg">
            {spiner}
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
                          : "NEW DAY SHEET"}
                      </h1>
                    </div>

                    {this.state.editId > 0 ? (

                      <div className="mf-6 popupHeadingRight" style={{ visibility: "visible" }}>
                        <Input
                          type="button"
                          value="Reschedule"

                          disabled={this.state.editId > 0 ? false : true}
                          className="btn-blue"
                          onClick={() =>
                            this.openReschedulePopup(this.state.editId)
                          }
                        >
                          Reschedule
                         </Input>

                        <Input
                          type="button"
                          value="Cancel Schedule"
                          disabled={this.state.editId > 0 ? false : true}
                          className="btn-blue"
                          onClick={() =>
                            this.openCancelReschedulePopup(this.state.editId)
                          }
                        >
                          Cancel Reschedule
                         </Input>
                      </div>
                    ) : ("")
                    }

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
                    {/* <div className="mf-4">
                                            {/* <Label name="Name"></Label>
                                            <Input
                                                type="text"
                                                name="patientName"
                                                id="patientName"
                                                value={this.state.patInfo.patientName}
                                                onChange={() => this.handleChange}
                                            ></Input> 
                                    </div>  */}

                    <div className="mf-4">
                      <Label name="DOB"></Label>
                      <Input
                        type="text"
                        name="dob"
                        id="dob"
                        value={this.state.patInfo.dob}
                        onChange={() => this.handleChange}
                      ></Input>
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
                  </div>

                  <div className="row-form">
                    <div className="mf-4">
                      <Label name="Cell# "></Label>
                      <Input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={this.state.patInfo.phoneNumber}
                        onChange={() => this.handleChange}
                      ></Input>
                    </div>

                    <div className="mf-4">
                      <Label name="Subscriber ID"></Label>
                      <Input
                        type="text"
                        name="subscriberID"
                        id="subscriberID"
                        value={this.state.patInfo.subscriberID}
                        onChange={() => this.handleChange}
                      ></Input>
                    </div>

                    <div className="mf-4">
                      {/* <Label name="Plan"></Label>
                      <Input
                        type="text"
                        name="planName"
                        id="planName"
                        value={this.state.patInfo.planName}
                        onChange={() => this.handleChange}
                      ></Input> */}
                    </div>
                  </div>
                  <div className="mf-12 headingOne mt-25">
                    <p>Appointment Information</p>
                  </div>
                  <div className="row-form">
                    <div className="mf-6">
                      <label
                        className={
                          this.state.daySheet.providerID ? "txtUnderline" : ""
                        }
                        onClick={
                          this.state.daySheet.providerID
                            ? () =>
                                this.openPopup(
                                  "provider",
                                  this.state.daySheet.providerID
                                )
                            : undefined
                        }
                      >
                        Provider<span className="redlbl"> *</span>
                      </label>

                      <div className="selectBoxValidate">
                        <select
                          className={
                            this.state.validationModel.valprovider
                              ? this.errorField
                              : ""
                          }
                          disabled={this.state.editId > 0 ? true : false}
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
                      <label
                        className={
                          this.state.daySheet.locationID ? "txtUnderline" : ""
                        }
                        onClick={
                          this.state.daySheet.locationID
                            ? () =>
                                this.openPopup(
                                  "location",
                                  this.state.daySheet.locationID
                                )
                            : undefined
                        }
                      >
                        Location
                      </label>

                      <select
                        disabled={this.state.editId > 0 ? true : false}
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
                        Appointment Date<span className="redlbl"> *</span>
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
                          disabled={this.state.editId > 0 ? true : false}
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

                      <select
                        name="providerSlotID"
                        id="providerSlotID"
                        disabled={this.state.editId > 0 ? true : false}
                        // value={this.state.daySheet.providerSlotID}
                        //value={((this.state.editId > 0) || (this.props.meetingSlotObj.id == 0)) ? this.state.appTime : this.state.daySheet.providerSlotID}
                        value={((this.state.editId > 0)) ? this.state.appTime : this.state.daySheet.providerSlotID}
                        onChange={this.handleChange}
                      >
                        {this.state.appTime.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.fromTime}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row-form">
                    <div className="mf-6">
                      <Label name="Time Interval "></Label>
                      <Input
                        type="text"
                        name="visitInterval"
                        id="visitInterval"
                        // disabled="disabled"
                        value={this.state.daySheet.visitInterval}
                        onChange={() => this.handleChange}
                      ></Input>
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
                    <div className="mf-6">
                      <label>Status</label>

                      <div className="selectBoxValidate">
                        <select
                          name="status"
                          id="status"
                          disabled={this.state.editId > 0 ? true : false}
                          value={this.state.daySheet.status}
                          onChange={this.handleChange}
                        >
                          {statusData.map(s => (
                            <option key={s.value} value={s.value}>
                              {s.display}
                            </option>
                          ))}
                        </select>
                        {/* {this.state.validationModel.valvisitreason} */}
                      </div>
                    </div>
                    <div className="mf-6"></div>
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
                          onClick={this.saveDaysheet}
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

        {popup}

        {canpopup}
        {epopup}
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

export default connect(mapStateToProps, matchDispatchToProps)(NewDaySheet);
