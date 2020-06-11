import React, { Component } from "react";
import $ from "jquery";
import Input from "./Input";
import axios from "axios";
import Label from "./Label";
import Swal from "sweetalert2";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
// import Grid from '@material-ui/core/Grid';
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { TimePicker } from "@material-ui/pickers";
import { KeyboardTimePicker } from "@material-ui/pickers";
import moment from "moment";

import NewLocation from "./NewLocation";
import NewProvider from "./NewProvider";

//Reducer Imports
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { taxonomyCodeAction } from "../actions/TaxonomyAction";

export class NewProviderScheduler extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/ProviderSchedule/";
    this.commonUrl = process.env.REACT_APP_URL + "/Common/";
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.ProviderSchedularModel = {
      locationID: "",
      providerID: "",
      fromDate: "",
      toDate: "",
      fromTime: null,
      toTime: null,
      timeInterval: 15,
      overBookAllowed: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    };

    this.validationModel = {
      valprovider: null,
      effectiveEndDateValField: null,
      effectiveEndTimeValField: null,
      checkDayValField: null,
      fromDate: "",
      toDate: ""
    };

    this.state = {
      ProviderSchedularModel: this.ProviderSchedularModel,
      validationModel: this.validationModel,
      editId: this.props.id,

      data: [],

      praData: [],
      visitData: [],

      matchDate: new Date(),

      locData: [],
      // editId: this.props.id,
      providerData: [],

      popupName: "",

      locationData: [],

      currentDate: ""
    };
    this.handleoverBookAllowed = this.handleoverBookAllowed.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveProviderSchedule = this.saveProviderSchedule.bind(this);
    this.delete = this.delete.bind(this);
    this.handleNumericCheck = this.handleNumericCheck.bind(this);

    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

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

  async componentDidMount() {
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


     

     


    try {
      if (this.state.editId > 0) {
        await axios
          .get(
            this.url + "FindProviderSchedule/" + this.state.editId,
            this.config
          )
          .then(response => {
            console.log(response.data);
            this.setState({
              ProviderSchedularModel: response.data
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    } catch {
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  }

  async handleCheckbox(event) {
    await this.setState({
      ProviderSchedularModel: {
        ...this.state.ProviderSchedularModel,
        [event.target.name]: !this.state.ProviderSchedularModel[
          event.target.name
        ]
      }
    });
  }

  async handleoverBookAllowed() {
    await this.setState({
      ProviderSchedularModel: {
        ...this.state.ProviderSchedularModel,
        overBookAllowed: !this.state.ProviderSchedularModel.overBookAllowed
      }
    });
  }
  openPopup = (name, id) => {
    this.setState({ popupName: name, id: id });
  };
  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  async handleChange(event) {
    event.preventDefault();
    var name = event.target.name;
    await this.setState({
      ProviderSchedularModel: {
        ...this.state.ProviderSchedularModel,
        [event.target.name]: event.target.value
      }
    });

    if (name == "fromDate") {
      await this.handleTimeChange(
        this.state.ProviderSchedularModel.fromTime,
        "fromTime"
      );
    } else if (name == "toDate") {
      await this.handleTimeChange(
        this.state.ProviderSchedularModel.toTime,
        "toTime"
      );
    }
  }

  //Handle Time Change
  async handleTimeChange(time, fieldName) {
    console.log("From Date : ", this.state.ProviderSchedularModel.fromDate);

    var dummyDate = "2019-11-11";
    if (fieldName == "fromTime") {
      dummyDate =
        this.state.ProviderSchedularModel.fromDate != ""
          ? moment(this.state.ProviderSchedularModel.fromDate)
              .format()
              .slice(0, 10)
          : "2019-11-11";
      console.log("dummyDate", dummyDate);
    } else if (fieldName == "toTime") {
      dummyDate =
        this.state.ProviderSchedularModel.toDate != ""
          ? moment(this.state.ProviderSchedularModel.toDate)
              .format()
              .slice(0, 10)
          : "2019-11-11";
      console.log("dummyDate", dummyDate);
    }

    var a = moment(time);
    var newTime = dummyDate + a.format().slice(10, 19);
    console.log("newTime : ", newTime);
    this.setState({
      ProviderSchedularModel: {
        ...this.state.ProviderSchedularModel,
        [fieldName]: newTime
      }
    });
  }

  // http://192.168.110.44/Database/api/ProviderSchedule/DeleteProviderSchedule

  delete = e => {
    var config = {
      headers: { Authorization: "Bearer  " + this.props.loginObject.token }
    };

    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        this.setState({ loading: true });
        axios
          .delete(
            this.url + "DeleteProviderSchedule/" + this.state.editId,
            config
          )
          .then(response => {
            this.setState({ loading: false });
            console.log("Delete Response :", response);
            Swal.fire("Record Deleted Successfully", "", "success");
          })
          .catch(error => {
            this.setState({ loading: false });
            Swal.fire(
              "Record Not Deleted!",
              "Record can not be delete, as it is being referenced in other screens.",
              "error"
            );
            if (error.response) {
              if (error.response.status) {
                Swal.fire("Unauthorized Access", "", "error");
              }
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log("Error", error.message);
            }
            console.log(JSON.stringify(error));
          });

        $("#btnCancel").click();
      }
    });
  };

  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  saveProviderSchedule = e => {
    this.setState({ loading: true });
    var myVal = this.validationModel;
    myVal.validation = false;
    if (this.isNull(this.state.ProviderSchedularModel.providerID)) {
      myVal.valprovider = (
        <span className="validationMsg">Select Provider</span>
      );
      myVal.validation = true;
    } else {
      myVal.valprovider = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    // End Date Validation
    if (this.isNull(this.state.ProviderSchedularModel.fromDate)) {
      myVal.fromDate = <span className="validationMsg">Enter Date</span>;
      myVal.validation = true;
    } else {
      myVal.fromDate = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.ProviderSchedularModel.toDate)) {
      myVal.toDate = <span className="validationMsg">Enter Date</span>;
      myVal.validation = true;
    } else {
      myVal.toDate = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      !this.isNull(this.state.ProviderSchedularModel.fromDate) &&
      !this.isNull(this.state.ProviderSchedularModel.toDate) &&
      this.state.ProviderSchedularModel.toDate <
        this.state.ProviderSchedularModel.fromDate
    ) {
      myVal.effectiveEndDateValField = (
        <span className="validationMsg">
          To Date Must Be Greater Than Or Equals To From Date
        </span>
      );
      myVal.validation = true;
    } else {
      myVal.effectiveEndDateValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      !this.isNull(this.state.ProviderSchedularModel.fromTime) &&
      !this.isNull(this.state.ProviderSchedularModel.toTime) &&
      this.state.ProviderSchedularModel.toTime <
        this.state.ProviderSchedularModel.fromTime
    ) {
      myVal.effectiveEndTimeValField = (
        <span className="validationMsg">
          To Time Must Be Greater Than Or Equals To From Time
        </span>
      );
      myVal.validation = true;
    } else {
      myVal.effectiveEndTimeValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      (this.state.ProviderSchedularModel.monday ||
        this.state.ProviderSchedularModel.tuesday ||
        this.state.ProviderSchedularModel.wednesday ||
        this.state.ProviderSchedularModel.thursday ||
        this.state.ProviderSchedularModel.friday ||
        this.state.ProviderSchedularModel.saturday ||
        this.state.ProviderSchedularModel.sunday) === false
    ) {
      myVal.checkDayValField = (
        <span className="validationMsg">Selct a day for appoinment</span>
      );
      myVal.validation = true;
    } else {
      myVal.checkDayValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    this.setState({
      validationModel: myVal
    });

    if (myVal.validation === true) {
      return;
    }

    console.log(this.state.ProviderSchedularModel);
    e.preventDefault();
    //http://192.168.110.44/Database/api/ProviderSchedule/SaveProviderSchedule

    axios
      .post(
        this.url + "SaveProviderSchedule",
        this.state.ProviderSchedularModel,
        this.config
      )
      .then(response => {
        console.log(response);

        this.setState({ data: response.data, loading: false });

        Swal.fire("Record Saved Successfully", "", "success");

        console.log(response.data);
        console.log(response);
        console.log(this.state.ProviderSchedularModel);
      })
      .catch(error => {
        this.setState({ loading: false });
        let errorList = [];
        if (error.response !== null && error !== null) {
          errorList = error.response;
          console.log(errorList);
        } else console.log(error);
      });

    e.preventDefault();
  };

  isNull(value) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select" ||
      value === "false"
    )
      return true;
    else return false;
  }

  render() {
    if (this.props.userInfo.userProviders.length > 0) {
      if (this.state.providerData.length == 0) {
        if (this.state.editId == 0) {
          this.setState({
            ProviderSchedularModel: {
              ...this.state.ProviderSchedularModel,
              providerID: this.props.userInfo.providerID
            },
            providerData: this.props.userInfo.userProviders
          });
        } else {
          this.setState({
            ProviderSchedularModel: {
              ...this.state.ProviderSchedularModel,
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
            ProviderSchedularModel: {
              ...this.state.ProviderSchedularModel,
              locationID: this.props.userInfo.locationID
            },
            locationData: this.props.userInfo.userLocations
          });
        } else {
          this.setState({
            ProviderSchedularModel: {
              ...this.state.ProviderSchedularModel,
              locationID: this.props.userInfo.locationID
            },
            locationData: this.props.userInfo.userLocations
          });
        }
      }
    }

    console.log("From Time : ", this.state.ProviderSchedularModel.fromTime);

    const yourDate = new Date();
    const NewDate = moment(yourDate, "DD-MM-YYYY");
    console.log("my text", NewDate);

    var proFromDate = this.state.ProviderSchedularModel.fromDate
      ? this.state.ProviderSchedularModel.fromDate.replace("T00:00:00", "")
      : "";
    var proToDate = this.state.ProviderSchedularModel.toDate
      ? this.state.ProviderSchedularModel.toDate.replace("T00:00:00", "")
      : "";

    let popup = "";
    if (this.state.popupName === "location") {
      popup = (
        <NewLocation
          onClose={() => this.closePopup}
          id={this.state.id}
        ></NewLocation>
      );
    } else if (this.state.popupName === "provider") {
      popup = (
        <NewProvider
          onClose={() => this.closePopup}
          id={this.state.id}
        ></NewProvider>
      );
    } else popup = <React.Fragment></React.Fragment>;

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
          id="proschModal"
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
                          ? this.state.ProviderSchedularModel.providerID +
                            " - " +
                            this.state.ProviderSchedularModel.fromDate.replace(
                              "T00:00:00",
                              ""
                            ) +
                            " - " +
                            this.state.ProviderSchedularModel.toDate.replace(
                              "T00:00:00",
                              ""
                            )
                          : "NEW PROVIDER SCHEDULER"}
                      </h1>
                    </div>
                    <div className="mf-6 popupHeadingRight">
                      {/* <div className="lblChkBox" onClick={this.handleCheck}>
                                                <input type="checkbox" checked={!this.state.isActive} id="isActive" name="isActive" />
                                                <label htmlFor="markInactive">
                                                    <span>Mark Inactive</span>
                                                </label>
                                            </div> */}
                      <Input
                        type="button"
                        value="Delete"
                        className="btn-blue"
                        onClick={this.delete}
                      >
                        Delete
                      </Input>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="modal-body"
                style={{ maxHeight: this.state.maxHeight }}
              >
                <div className="mainTable">
                  {/* <div className="mf-12 headingOne mt-25">
                                    <p>EDI Payer Information</p>
                                </div> */}
                  <div className="row-form">
                    <div className="mf-6">
                      <label
                        className={
                          this.state.ProviderSchedularModel.providerID
                            ? "txtUnderline"
                            : ""
                        }
                        onClick={
                          this.state.ProviderSchedularModel.providerID
                            ? () =>
                                this.openPopup(
                                  "provider",
                                  this.state.ProviderSchedularModel.providerID
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
                          name="providerID"
                          id="providerID"
                          value={this.state.ProviderSchedularModel.providerID}
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
                          this.state.ProviderSchedularModel.locationID
                            ? "txtUnderline"
                            : ""
                        }
                        onClick={
                          this.state.ProviderSchedularModel.locationID
                            ? () =>
                                this.openPopup(
                                  "location",
                                  this.state.ProviderSchedularModel.locationID
                                )
                            : undefined
                        }
                      >
                        Location
                      </label>

                      <select
                        name="locationID"
                        id="locationID"
                        value={this.state.ProviderSchedularModel.locationID}
                        onChange={this.handleChange}
                      >
                        {this.state.locationData.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row-form">
                    <div className="mf-6">
                      <label>
                        From Date<span className="redlbl"> *</span>
                      </label>
                      <div className="textBoxValidate">
                        <input
                          style={{
                            width: "215px",
                            marginLeft: "0px"
                          }}
                          className="myInput"
                          type="date"
                          name="fromDate"
                          id="fromDate"
                          value={proFromDate}
                          onChange={this.handleChange}
                        ></input>
                        {this.state.validationModel.fromDate}
                      </div>
                    </div>
                    <div className="mf-6">
                      <label>
                        To Date<span className="redlbl"> *</span>
                      </label>
                      <div className="textBoxValidate">
                        <input
                          style={{
                            width: "215px",
                            marginLeft: "0px"
                          }}
                          className="myInput"
                          type="date"
                          name="toDate"
                          id="toDate"
                          value={proToDate}
                          onChange={this.handleChange}
                        ></input>
                        {this.state.validationModel.toDate}
                        {this.state.validationModel.effectiveEndDateValField}
                      </div>
                    </div>
                  </div>

                  <div className="row-form">
                    <div className="mf-6">
                      <label>From Time</label>
                      <div className="textBoxTwoField">
                        <div style={{ width: "250px" }}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardTimePicker
                              margin="none"
                              label=""
                              // ampm={false}
                              format="hh:mm:ss a"
                              placeholder="08:00:00 AM"
                              mask="__:__:__ _M"
                              views={["hours", "minutes", "seconds"]}
                              value={this.state.ProviderSchedularModel.fromTime}
                              name="fromTime"
                              id="fromTime"
                              onChange={time => {
                                this.handleTimeChange(time, "fromTime");
                              }}
                              // keyboardIcon={false}
                              // KeyboardButtonProps={false}
                            />
                          </MuiPickersUtilsProvider>
                        </div>
                      </div>
                    </div>
                    <div className="mf-6">
                      <label>To Time</label>
                      <div className="textBoxTwoField">
                        <div style={{ width: "250px" }}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardTimePicker
                              margin="none"
                              label=""
                              // ampm={false}
                              format="hh:mm:ss a"
                              placeholder="08:00:00 AM"
                              mask="__:__:__ _M"
                              views={["hours", "minutes", "seconds"]}
                              value={this.state.ProviderSchedularModel.toTime}
                              name="toTime"
                              id="toTime"
                              onChange={time => {
                                this.handleTimeChange(time, "toTime");
                              }}
                              // keyboardIcon={false}
                              // KeyboardButtonProps={false}
                            />
                          </MuiPickersUtilsProvider>
                        </div>
                        {this.state.validationModel.effectiveEndTimeValField}
                      </div>
                    </div>
                  </div>
                  <div className="row-form">
                    <div className="mf-6">
                      <Label name="Time Interval"></Label>
                      <Input
                        max="5"
                        type="text"
                        name="timeInterval"
                        id="timeInterval"
                        value={this.state.ProviderSchedularModel.timeInterval}
                        onChange={() => this.handleChange}
                        onKeyPress={event => this.handleNumericCheck(event)}
                      />
                    </div>
                    <div className="mf-6">
                      <label>
                        <span>&nbsp;</span>
                      </label>
                      <div className="textBoxValidate">
                        <div className="lblChkBox">
                          <input
                            type="checkbox"
                            id="overBookAllowed"
                            name="overBookAllowed"
                            onClick={this.handleoverBookAllowed}
                            checked={
                              this.state.ProviderSchedularModel.overBookAllowed
                            }
                          />
                          <label htmlFor="overBookAllowed">
                            <span>  Overbook Allowed</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="row-form">
                      <div className="mf-6">
                        <label>&nbsp;</label>
                        <div className="textBoxValidate">
                          <div className="lblChkBox">
                            <input
                              type="checkbox"
                              id="daySheetMonday"
                              name="monday"
                              onClick={this.handleCheckbox}
                              checked={this.state.ProviderSchedularModel.monday}
                            />
                            <label htmlFor="daySheetMonday">
                              <span>  Monday</span>
                            </label>
                            {this.state.validationModel.checkDayValField}
                          </div>
                          <div className="lblChkBox" style={{ float: "right" }}>
                            <input
                              type="checkbox"
                              id="daySheetTuesday"
                              name="tuesday"
                              onClick={this.handleCheckbox}
                              checked={
                                this.state.ProviderSchedularModel.tuesday
                              }
                            />
                            <label htmlFor="daySheetTuesday">
                              <span>  Tuesday</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mf-6">
                        <label>&nbsp;</label>

                        <div className="textBoxValidate">
                          <div className="lblChkBox">
                            <input
                              type="checkbox"
                              id="daySheetWednesday"
                              name="wednesday"
                              onClick={this.handleCheckbox}
                              checked={
                                this.state.ProviderSchedularModel.wednesday
                              }
                            />
                            <label htmlFor="daySheetWednesday">
                              <span>  Wednesday</span>
                            </label>
                          </div>
                          <div
                            className="lblChkBox"
                            style={{ float: "right", marginRight: "70px" }}
                          >
                            <input
                              type="checkbox"
                              id="daySheetThursday"
                              name="thursday"
                              onClick={this.handleCheckbox}
                              checked={
                                this.state.ProviderSchedularModel.thursday
                              }
                            />
                            <label htmlFor="daySheetThursday">
                              <span>  Thursday</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row-form">
                      <div className="mf-6">
                        <label>&nbsp;</label>
                        <div className="textBoxValidate">
                          <div className="lblChkBox">
                            <input
                              type="checkbox"
                              id="daySheetFriday"
                              name="friday"
                              onClick={this.handleCheckbox}
                              checked={this.state.ProviderSchedularModel.friday}
                            />
                            <label htmlFor="daySheetFriday">
                              <span>  Friday</span>
                            </label>
                          </div>
                          <div className="lblChkBox" style={{ float: "right" }}>
                            <input
                              type="checkbox"
                              id="daySheetSaturday"
                              name="saturday"
                              onClick={this.handleCheckbox}
                              checked={
                                this.state.ProviderSchedularModel.saturday
                              }
                            />
                            <label htmlFor="daySheetSaturday">
                              <span>  Saturday</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="mf-6">
                        <label>&nbsp;</label>

                        <div className="textBoxValidate">
                          {/* <div className="selectBoxValidate"> */}
                          <div className="lblChkBox">
                            <input
                              type="checkbox"
                              id="daySheetSunday"
                              name="sunday"
                              onClick={this.handleCheckbox}
                              checked={this.state.ProviderSchedularModel.sunday}
                            />
                            <label htmlFor="daySheetSunday">
                              <span>  Sunday</span>
                            </label>
                          </div>
                          {/* {this.state.validationModel.checkDayValField} */}
                        </div>
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="mainTable">
                    <div className="row-form row-btn">
                      <div className="mf-12">
                      {/* <input
                      type="button"
                      value="Save"
                         id="btnSave"
                          className="btn-blue"
                          onClick={this.saveProviderSchedule}
                        >
                          Save{" "}
                        </input>
                        <input
                        type="button"
                        value="Cancel"
                          id="btnCancel"
                          className="btn-grey"
                          data-dismiss="modal"
                          onClick={this.props.onClose()}
                        >
                          Cancel{" "}
                        </input> */}
                        <button
                         id="btnSave"
                          className="btn-blue"
                          onClick={this.saveProviderSchedule}
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
      selectTabAction: selectTabAction,
      taxonomyCodeAction:taxonomyCodeAction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(NewProviderScheduler);
