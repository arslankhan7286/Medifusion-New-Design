import React, { Component } from "react";

import $ from "jquery";

import Label from "./Label";
import Input from "./Input";

import axios from "axios";
import { MDBDataTable } from "mdbreact";
import Swal from "sweetalert2";
import { Tabs, Tab } from "react-tab-view";
import samll_doc_icon from "../images/dob-small-icon.png";
import arrowBlue from "../images/select-arrow-blue1.svg";
import Select, { components } from "react-select";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { KeyboardTimePicker } from "@material-ui/pickers";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import NewPractice from "./NewPractice";
import NewLocation from "./NewLocation";
import NewProvider from "./NewProvider";
import NewRefferingProvider from "./NewRefferingProvider";
import { NewCharge } from "./NewCharge";
import GPopup from "./GPopup";

import NewGroup from "./NewGroup";
import NewReason from "./NewReason";
import NewAction from "./NewAction";

export class NewPlanFollowupModal extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/PlanFollowup/";
    this.Notesurl = process.env.REACT_APP_URL + "/Notes/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.planFollowupModel = {
      id: this.props.id,

      chargeID: 0,
      reasonID: "",
      actionID: "",
      groupID: "",
      username: "",
      datePicker: "",

      adjustmentCodeID: null,
      claimStatusCode: "",
      tickleDate: "",
      addedDate: "",
      age: "",
      payerName: "",

      insuredID: 0,
      totalAmount: "",
      planFollowupCharge: [],
      note: []
    };

    this.chargeModel = {
      //SAQIB
      chargeID: 0,
      groupID: null,
      actionID: null,
      adjusmentCode: null,
      reasonID: null,
      tickleDate: null,

      visitID: 0,
      clientID: this.props.userInfo.clientID,
      validation: false
    };

    this.notesModel = {
      id: 0,
      practiceID: null,
      planFollowupID: null,
      notesDate: null,
      note: null,
      addedBy: null,
      addedDate: null,
      updatedBy: null,
      updatedDate: null
    };

    this.state = {
      note: this.note,
      chargeModel: this.chargeModel,
      visitModel: this.visitModel,
      planFollowupModel: this.planFollowupModel,
      editId: this.props.id,
      planFollowUpID: this.props.planFollowUpID,
      followPopupId: 0,
      validationModel: this.validationModel,
      note: [],
      planFollowupCharge: [],
      AddedBy: [],
      data: [],
      id: 0,
      popupName: "",
      resData: [],
      remCodeData: [],
      grData: [],
      acData: [],
      adjData: [],
      locData: [],
      proData: [],
      refproData: [],
      supproData: [],
      pracData: [],
      patientInfoData: "",
      submissionData: "",

      isActive: true,
      notesArray: ""
    };

    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.savePlanFollowupModel = this.savePlanFollowupModel.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.addCPTRowIncharge = this.addCPTRowIncharge.bind(this);
    this.addCPTRow = this.addCPTRow.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.closepopPopup = this.closepopPopup.bind(this);
    this.handleChargeChange = this.handleChargeChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.closeVisitPopup = this.closeVisitPopup.bind(this);
  }

  async componentDidMount() {
    this.setModalMaxHeight($(".modal"));

    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function() {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);

    await axios
      .get(this.url + "GetProfiles/" + this.state.editId, this.config)

      .then(response => {
        this.setState({
          resData: response.data.reason == null ? [] : response.data.reason,
          grData: response.data.group == null ? [] : response.data.group,
          acData: response.data.action == null ? [] : response.data.action,
          remCodeData:
            response.data.adjusmentCode == null
              ? []
              : response.data.adjusmentCode,

          pracData:
            response.data.practice == null ? [] : response.data.practice,

          locData: response.data.location == null ? [] : response.data.location,
          proData: response.data.provider == null ? [] : response.data.provider,
          refproData:
            response.data.refProvider == null ? [] : response.data.refProvider,
          supproData:
            response.data.supProvider == null ? [] : response.data.supProvider,

          patientInfoData:
            response.data.patientInfo == null ? [] : response.data.patientInfo,
          submissionData:
            response.data.submissionInfo == null
              ? []
              : response.data.submissionInfo
        });
      })
      .catch(error => {});

    if (this.state.editId > 0) {
      await axios
        .get(this.url + "FindPlanFollowUp/" + this.state.editId, this.config)
        .then(response => {
          this.setState({ planFollowupModel: response.data });
        })

        .catch(error => {
          console.log(error);
        });
    }
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

  componentWillMount() {}

  isNull(value) {
    if (value === "" || value === null || value === undefined) return true;
    else return false;
  }

  async handleNoteChange(event) {
    let newNotesList = this.state.planFollowupModel.note;

    const index = event.target.id;
    const name = event.target.name;
    newNotesList[index][name] = event.target.value;

    await this.setState({
      planFollowupModel: {
        ...this.state.planFollowupModel,
        note: newNotesList
      }
    });
  }

  async handleChargeChange(event) {
    let newChargeList = this.state.planFollowupModel.planFollowupCharge;

    const index = event.target.id;
    const name = event.target.name;
    newChargeList[index][name] = event.target.value;

    await this.setState({
      planFollowupModel: {
        ...this.state.planFollowupModel,
        planFollowupCharge: newChargeList
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

  closeVisitPopup() {
    this.setState({ popupName: "", visitPopup: false });
  }

  savePlanFollowupModel = e => {
    if (this.state.planFollowupModel.reasonID === "Please Select") {
      Swal.fire({
        type: "error",
        text: "Please Select the Reason"
      });
      return;
    } else {
      axios
        .post(
          this.url + "SavePlanFollowup",
          this.state.planFollowupModel,
          this.config
        )
        .then(response => {
          this.setState({
            planFollowupModel: response.data,
            editId: response.data.id
          });
          Swal.fire("Record Saved Successfully", "", "success");
          this.componentWillMount();
        })
        .catch(error => {
          let errorsList = [];
        })

        .catch(error => {});

      e.preventDefault();
    }
  };

  handleChange = event => {
    event.preventDefault();

    this.setState({
      planFollowupModel: {
        ...this.state.planFollowupModel,
        [event.target.name]: event.target.value
      }
    });
  };

  async deleteCPTRow(event, index, chargeId) {
    const chargeID = chargeId;
    const id = event.target.id;
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
        if (chargeID) {
          axios
            .delete(this.chargeUrl + "DeleteCharge/" + chargeId, this.config)
            .then(response => {
              Swal.fire("Record Deleted Successfully", "", "success");
            })
            .catch(error => {
              Swal.fire(
                "Record Not Deleted!",
                "Record can not be delete, as it is being referenced in other screens.",
                "error"
              );
            });
        }

        let note = [...this.state.planFollowupModel.note];
        var amount = this.state.planFollowupModel.note[id].totalAmount;
        note.splice(id, 1);

        this.setState({
          planFollowupModel: {
            ...this.state.planFollowupModel,
            totalAmount: (
              this.state.planFollowupModel.totalAmount - amount
            ).toFixed(2),
            note: note
          }
        });
      }
    });
  }

  closepopPopup = () => {
    $("#locationModal").hide();
    $("#practiceModal").hide();

    $("#providerModal").hide();
    $("#groupModal").hide();
    $("#reasonModal").hide();
    $("#refModal").hide();
    this.setState({ popupName: "" });
  };

  closePopup = () => {
    $("#planModal").hide();
    this.setState({ popupName: "" });
  };
  closeVisitPopUp() {
    this.setState({ popupName: "", visitPopup: false });
  }

  handleCheck() {
    this.setState({
      planFollowupModel: {
        ...this.state.planFollowupModel,
        isActive: !this.state.planFollowupModels.isActive
      }
    });
  }
  async addCPTRow() {
    const note = { ...this.note };
    await this.setState({
      planFollowupModel: {
        ...this.state.planFollowupModel,
        note: this.state.planFollowupModel.note.concat(note)
      }
    });
  }

  async addCPTRowIncharge() {
    const planFollowupCharge = { ...this.chargeModel };

    await this.setState({
      planFollowupModel: {
        ...this.state.planFollowupModel,
        planFollowupCharge: this.state.planFollowupModel.planFollowupCharge.concat(
          planFollowupCharge
        )
      }
    });
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  render() {
    let newList = [];
    var tableData = {};

    this.state.planFollowupModel.note.map((row, index) => {
      var notesDate = this.isNull(row.notesDate)
        ? ""
        : row.notesDate.slice(0, 10);

      newList.push({
        id: row.id,

        notesDate: (
          <div>
            <input
              style={{
                background: "url(" + samll_doc_icon + ") no-repeat right"
              }}
              className="smallCalendarIcon"
              type="date"
              name="notesDate"
              id={index}
              value={notesDate}
              onChange={this.handleNoteChange}
            ></input>
          </div>
        ),

        note: (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <input
              // style={{
              //   width: " 350px",
              //   marginRight: "0px",
              //   padding: "7px 5px"
              // }}
              type="text"
              value={this.state.planFollowupModel.note[index].note}
              name="note"
              id={index}
              onChange={this.handleNoteChange}
            ></input>
          </div>
        ),

        addedBy: (
          <div style={{ marginTop: "10px" }}>
            <span>{this.state.planFollowupModel.note[index].addedBy}</span>
          </div>
        ),

        remove: (
          <button
            className="removeBtn"
            name="deleteCPTBtn"
            id={index}
            onClick={(event, index) => this.deleteCPTRow(event, index, row.id)}
          >
            X
          </button>

          // <button
          //   style={{ width: "50px", backgroundColor: "red" }}
          //   name="deleteCPTBtn"
          //   id={index}
          //   onClick={(event, index) => this.deleteCPTRow(event, index, row.id)}
          // >
          //   X
          // </button>
        )
      });
    });
    // })
    tableData = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc"
          // width: 50
        },
        {
          label: "DATE",
          field: "notesDate",
          sort: "asc"
          // width: 68
        },
        {
          label: "NOTES",
          field: "note",
          sort: "asc"
          // width: 250
        },
        {
          label: "ADDED BY",
          field: "addedBy",
          sort: "asc"
          // width: 150
        },

        {
          label: "REMOVE",
          field: "remove",
          sort: "asc"
          // width: 150
        }
      ],
      rows: newList
    };

    const type = [
      { value: "", display: "Select Type" },
      { value: "SP", display: "Solo Practice" },
      { value: "GP", display: "Group Practice" }
    ];

    // CHARGE TABLE
    let pushTocharges = [];
    var ChargeTable = {};

    this.state.planFollowupModel.planFollowupCharge.map((row, index) => {
      var tickleDate = this.isNull(row.tickleDate)
        ? ""
        : row.tickleDate.slice(0, 10);
      pushTocharges.push({
        id: row.id,

        chargeID: (
          <div>
            <input
              style={{
                width: " 105px",
                marginRight: "0px",
                padding: "7px 5px"
              }}
              id={index}
              name="chargeID"
              type="text"
              value={
                this.state.planFollowupModel.planFollowupCharge[index].chargeID
              }
              readOnly
              onChange={this.handleChargeChange}
            ></input>
          </div>
        ),

        groupID: (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "150px"
            }}
          >
            <select
              name="groupID"
              id={index}
              value={
                this.state.planFollowupModel.planFollowupCharge[index].groupID
              }
              onChange={this.handleChargeChange}
            >
              {this.state.grData.map(s => (
                <option key={s.value} value={s.id}>
                  {s.description}
                </option>
              ))}
            </select>
          </div>
        ),

        reasonID: (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "150px"
            }}
          >
            <select
              name="reasonID"
              id={index}
              value={
                this.state.planFollowupModel.planFollowupCharge[index].reasonID
              }
              onChange={this.handleChargeChange}
            >
              {this.state.resData.map(s => (
                <option key={s.value} value={s.id}>
                  {s.description}
                </option>
              ))}
            </select>
          </div>
        ),
        actionID: (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "150px"
            }}
          >
            <select
              name="actionID"
              id={index}
              value={
                this.state.planFollowupModel.planFollowupCharge[index].actionID
              }
              onChange={this.handleChargeChange}
            >
              {this.state.acData.map(s => (
                <option key={s.value} value={s.id}>
                  {s.description}
                </option>
              ))}
            </select>
          </div>
        ),
        adjusmentCode: (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "150px"
            }}
          >
            <select
              name="adjusmentCode"
              id={index}
              value={
                this.state.planFollowupModel.planFollowupCharge[index]
                  .adjusmentCode
              }
              onChange={this.handleChargeChange}
            >
              {this.state.remCodeData.map(s => (
                <option key={s.value} value={s.id}>
                  {s.description}
                </option>
              ))}
            </select>
          </div>
        ),
        tickleDate: (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "250px"
            }}
          >
            <input
              style={{
                background: "url(" + samll_doc_icon + ") no-repeat right",
                width: "250px"
              }}
              className="smallCalendarIcon"
              type="date"
              name="tickleDate"
              id={index}
              value={tickleDate}
              onChange={this.handleChargeChange}
            ></input>
          </div>
        )
      });
    });
    ChargeTable = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
          width: 30
        },
        {
          label: "CHARGE",
          field: "chargeID",
          sort: "asc",
          width: 150
        },
        {
          label: "GROUP",
          field: "groupID",
          sort: "asc",
          width: 270
        },
        {
          label: "REASON",
          field: "reasonID",
          sort: "asc",
          width: 100
        },
        {
          label: "ACTION",
          field: "actionID",
          sort: "asc",
          width: 150
        },
        {
          label: "ADJUSTMENT CODE ",
          field: "adjusmentCode",
          sort: "asc",
          width: 150
        },

        {
          label: " TICKLEDATE",
          field: "tickleDate",
          sort: "asc",
          width: 150
        }
      ],
      rows: pushTocharges
    };

    const isActive = this.state.planFollowupModel.isActive;
    const headers = ["Details", "Other 1", "Other 2"];

    var addtickleDate = this.state.planFollowupModel.tickleDate
      ? this.state.planFollowupModel.tickleDate.slice(0, 10)
      : "";
    var statFY = this.state.planFollowupModel.addedDate
      ? this.state.planFollowupModel.addedDate.slice(0, 4)
      : "";
    var statFM = this.state.planFollowupModel.addedDate
      ? this.state.planFollowupModel.addedDate.slice(5, 7)
      : "";
    var statFD = this.state.planFollowupModel.addedDate
      ? this.state.planFollowupModel.addedDate.slice(8, 10)
      : "";

    let popup = "";
    if (this.state.popupName === "practice") {
      popup = (
        <NewPractice
          onClose={() => this.closepopPopup}
          practiceID={this.state.id}
        ></NewPractice>
      );
    } else if (this.state.popupName === "location") {
      popup = (
        <NewLocation
          onClose={() => this.closepopPopup}
          id={this.state.id}
        ></NewLocation>
      );
    } else if (this.state.popupName === "provider") {
      popup = (
        <NewProvider
          onClose={() => this.closepopPopup}
          id={this.state.id}
        ></NewProvider>
      );
    } else if (this.state.popupName === "reason") {
      popup = (
        <NewReason
          onClose={() => this.closepopPopup}
          id={this.state.id}
        ></NewReason>
      );
    } else if (this.state.popupName === "group") {
      popup = (
        <NewGroup
          onClose={() => this.closepopPopup}
          id={this.state.id}
        ></NewGroup>
      );
    } else if (this.state.popupName === "action") {
      popup = (
        <NewAction
          onClose={() => this.closepopPopup}
          id={this.state.id}
        ></NewAction>
      );
    } else if (this.state.popupName === "visit") {
      popup = (
        <GPopup
          onClose={() => this.closeVisitPopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.popupName === "refprovider") {
      popup = (
        <NewRefferingProvider
          onClose={() => this.closepopPopup}
          id={this.state.id}
        ></NewRefferingProvider>
      );
    } else popup = <React.Fragment></React.Fragment>;

    return (
      <React.Fragment>
        <div
          id="planModal"
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

              <div
                className="modal-body"
                style={{ maxHeight: this.state.maxHeight }}
              >
                <div className="mainTable fullWidthTable">
                  <div className="row-form">
                    <div className="mf-12">
                      <Tabs headers={headers} style={{ cursor: "default" }}>
                        <Tab>
                          <div style={{ marginTop: "20px" }}>
                            <div
                              className="mainTable fullWidthTable wSpace"
                              style={{ maxWidth: "100%" }}
                            >
                              <div className="row-form">
                                <div className="mf-4">
                                  <label
                                    className={
                                      this.state.planFollowupModel.reasonID
                                        ? "txtUnderline"
                                        : ""
                                    }
                                    onClick={
                                      this.state.planFollowupModel.reasonID
                                        ? () =>
                                            this.openPopup(
                                              "reason",
                                              this.state.planFollowupModel
                                                .reasonID
                                            )
                                        : undefined
                                    }
                                  >
                                    Reason{" "}
                                  </label>

                                  <div className="selectBoxValidate">
                                    <select
                                      name="reasonID"
                                      id="reasonID"
                                      value={
                                        this.state.planFollowupModel.reasonID
                                      }
                                      onChange={this.handleChange}
                                    >
                                      {this.state.resData.map(s => (
                                        <option key={s.id} value={s.id}>
                                          {s.description}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="mf-4">
                                  <label
                                    className={
                                      this.state.planFollowupModel.actionID
                                        ? "txtUnderline"
                                        : ""
                                    }
                                    onClick={
                                      this.state.planFollowupModel.actionID
                                        ? () =>
                                            this.openPopup(
                                              "action",
                                              this.state.planFollowupModel
                                                .actionID
                                            )
                                        : undefined
                                    }
                                  >
                                    Action{" "}
                                  </label>

                                  <div className="selectBoxValidate">
                                    <select
                                      name="actionID"
                                      id="actionID"
                                      value={
                                        this.state.planFollowupModel.actionID
                                      }
                                      onChange={this.handleChange}
                                    >
                                      {this.state.acData.map(s => (
                                        <option key={s.id} value={s.id}>
                                          {s.description}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="mf-4">
                                  <label
                                    className={
                                      this.state.planFollowupModel.groupID
                                        ? "txtUnderline"
                                        : ""
                                    }
                                    onClick={
                                      this.state.planFollowupModel.groupID
                                        ? () =>
                                            this.openPopup(
                                              "group",
                                              this.state.planFollowupModel
                                                .groupID
                                            )
                                        : undefined
                                    }
                                  >
                                    Group <span className="redlbl"> *</span>
                                  </label>

                                  <div className="selectBoxValidate">
                                    <select
                                      name="groupID"
                                      id="groupID"
                                      value={
                                        this.state.planFollowupModel.groupID
                                      }
                                      onChange={this.handleChange}
                                    >
                                      {this.state.grData.map(s => (
                                        <option key={s.id} value={s.id}>
                                          {s.description}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="row-form">
                                <div className="mf-4">
                                  <Label name="Adjusment Code"></Label>

                                  <div className="selectBoxValidate">
                                    <select
                                      name="adjustmentCodeID"
                                      id="adjustmentCodeID"
                                      value={
                                        this.state.planFollowupModel
                                          .adjustmentCodeID
                                      }
                                      onChange={this.handleChange}
                                    >
                                      {this.state.remCodeData.map(s => (
                                        <option key={s.id} value={s.id}>
                                          {s.description}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="mf-4">
                                  <Label name="Claim Status Code"></Label>

                                  <Input
                                    type="text"
                                    value={
                                      this.state.planFollowupModel
                                        .claimStatusCode
                                    }
                                    name="claimStatusCode"
                                    id="claimStatusCode"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">
                                  <Label name="Tickle Date"></Label>

                                  <div className="textBoxValidate">
                                    <input
                                      style={{
                                        width: "215px",
                                        marginLeft: "0px"
                                      }}
                                      className="myInput"
                                      type="date"
                                      name="tickleDate"
                                      id="tickleDate"
                                      value={addtickleDate}
                                      onChange={this.handleChange}
                                    ></input>
                                  </div>
                                </div>
                              </div>

                              <div className="row-form">
                                <div className="mf-4">
                                  <Label name="Follow up Date"></Label>

                                  <div className="textBoxValidate">
                                    <Input
                                      type="text"
                                      disabled="disabled"
                                      value={
                                        statFM + "/" + statFD + "/" + statFY
                                      }
                                      name="addedDate"
                                      id="addedDate"
                                      onChange={() => this.handleChange}
                                    ></Input>
                                  </div>
                                </div>
                                <div className="mf-4">
                                  <Label name="Follow up Age "></Label>

                                  <Input
                                    readOnly
                                    type="text"
                                    value={this.state.planFollowupModel.age}
                                    name="age"
                                    id="age"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">
                                  {/* <Label name="Visit #"></Label> */}

                                  <label
                                    className={
                                      this.state.planFollowupModel.visitID
                                        ? "txtUnderline"
                                        : ""
                                    }
                                    onClick={
                                      this.state.planFollowupModel.visitID
                                        ? () =>
                                            this.openPopup(
                                              "visit",
                                              this.state.planFollowupModel
                                                .visitID
                                            )
                                        : undefined
                                    }
                                  >
                                    Visit <span className="redlbl"> *</span>
                                  </label>

                                  <Input
                                    type="text"
                                    value={this.state.planFollowupModel.visitID}
                                    name="visitID"
                                    id="visitID"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                              </div>

                              <div class="mainTable fullWidthTable">
                                <div class="mf-12 table-grid mt-15">
                                  <div class="row headingTable">
                                    <div class="mf-6">
                                      <h1>NOTES</h1>
                                    </div>
                                    <div class="mf-6 headingRightTable">
                                      <button
                                        class="btn-blue"
                                        onClick={this.addCPTRow}
                                      >
                                        Add CPT{" "}
                                      </button>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="tableGridContainer">
                                      <MDBDataTable
                                        striped
                                        bordered
                                        searching={false}
                                        data={tableData}
                                        displayEntries={false}
                                        //sortable={true}
                                        scrollX={false}
                                        scrollY={false}
                                        responsive
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div class="mainTable fullWidthTable">
                                <div class="mf-12 table-grid mt-15">
                                  <div class="row headingTable">
                                    <div class="mf-6">
                                      <h1>CHARGES</h1>
                                    </div>
                                    {/* <div class="mf-6 headingRightTable">
                                                                         
                                                                            <button class="btn-blue" onClick={this.addCPTRowIncharge}>

                                                                                Add CPT{" "}
                                                                            </button>
                                                                            </div> */}
                                  </div>

                                  <div>
                                    <div className="tableGridContainer">
                                      <MDBDataTable
                                        striped
                                        bordered
                                        searching={false}
                                        data={ChargeTable}
                                        displayEntries={false}
                                        //sortable={true}
                                        scrollX={false}
                                        scrollY={false}
                                        responsive
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="headingOne mt-25">
                                <p>Submission Info</p>
                              </div>

                              <div className="row-form">
                                <div className="mf-4">
                                  <Label name="Payer Name"></Label>

                                  <Input
                                    disabled
                                    type="text"
                                    value={this.state.submissionData.payerName}
                                    name="payerName"
                                    id="payerName"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">
                                  <Label name="Payer ID"></Label>

                                  <Input
                                    disabled="disabled"
                                    type="text"
                                    value={this.state.submissionData.payerID}
                                    name="payerID"
                                    id="payerID"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">
                                  <Label name="Receiver"></Label>

                                  <Input
                                    disabled="disabled"
                                    type="text"
                                    value={this.state.submissionData.receiver}
                                    name="receiver"
                                    id="receiver"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                              </div>
                              <div className="row-form">
                                <div className="mf-4">
                                  <Label name="Telephone#"></Label>

                                  <Input
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.submissionData.telePhoneNumber
                                    }
                                    name="telePhoneNumber"
                                    id="telePhoneNumber"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">
                                  <Label name="PR. Telephone#"></Label>

                                  <Input
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.submissionData
                                        .prTelephoneNumber
                                    }
                                    name="prTelephoneNumber"
                                    id="prTelephoneNumber"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">
                                  <Label name="Submit Date"></Label>

                                  <div className="textBoxValidate">
                                    <Input
                                      disabled="disabled"
                                      type="text"
                                      value={
                                        this.state.submissionData.submitDate
                                      }
                                      name="submitDate"
                                      id="submitDate"
                                      onChange={() => this.handleChange}
                                    ></Input>
                                  </div>
                                </div>
                              </div>
                              <div className="row-form">
                                <div className="mf-4">
                                  <Label name="DOS"></Label>

                                  <div className="textBoxValidate">
                                    <Input
                                      disabled="disabled"
                                      type="text"
                                      value={this.state.submissionData.dos}
                                      name="dos"
                                      id="dos"
                                      onChange={() => this.handleChange}
                                    ></Input>
                                  </div>
                                </div>
                                <div className="mf-4">
                                  <Label name="Billed Amount "></Label>

                                  <Input
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.submissionData.billedAmount
                                    }
                                    name="billedAmount"
                                    id="billedAmount"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">
                                  <Label name="Plan Balance"></Label>

                                  <Input
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.submissionData.planBalance
                                    }
                                    name="planBalance"
                                    id="planBalance"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                              </div>
                              <div className="headingOne mt-25">
                                <p>Legal Entities</p>
                              </div>

                              <div className="row-form">
                                <div className="mf-4">
                                  <label
                                    className={
                                      this.state.patientInfoData.practiceID
                                        ? "txtUnderline"
                                        : ""
                                    }
                                    onClick={
                                      this.state.patientInfoData.practiceID
                                        ? () =>
                                            this.openPopup(
                                              "practice",
                                              this.state.patientInfoData
                                                .practiceID
                                            )
                                        : undefined
                                    }
                                  >
                                    Practice{" "}
                                  </label>
                                  <Input
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.patientInfoData.practiceName
                                    }
                                    name=""
                                    id=""
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">
                                  <label
                                    className={
                                      this.state.patientInfoData.locationID
                                        ? "txtUnderline"
                                        : ""
                                    }
                                    onClick={
                                      this.state.patientInfoData.locationID
                                        ? () =>
                                            this.openPopup(
                                              "location",
                                              this.state.patientInfoData
                                                .locationID
                                            )
                                        : undefined
                                    }
                                  >
                                    Location{" "}
                                  </label>

                                  <Input
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.patientInfoData.locationName
                                    }
                                    name=""
                                    id=""
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">
                                  <label
                                    className={
                                      this.state.patientInfoData.providerID
                                        ? "txtUnderline"
                                        : ""
                                    }
                                    onClick={
                                      this.state.patientInfoData.providerID
                                        ? () =>
                                            this.openPopup(
                                              "provider",
                                              this.state.patientInfoData
                                                .providerID
                                            )
                                        : undefined
                                    }
                                  >
                                    Provider{" "}
                                  </label>

                                  <Input
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.patientInfoData.providerName
                                    }
                                    name=""
                                    id=""
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                              </div>
                              <div className="row-form">
                                <div className="mf-4">
                                  <label
                                    className={
                                      this.state.patientInfoData.refProviderID
                                        ? "txtUnderline"
                                        : ""
                                    }
                                    onClick={
                                      this.state.patientInfoData.refProviderID
                                        ? () =>
                                            this.openPopup(
                                              "refprovider",
                                              this.state.patientInfoData
                                                .refProviderID
                                            )
                                        : undefined
                                    }
                                  >
                                    Ref Provider{" "}
                                  </label>

                                  <Input
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.patientInfoData.refProviderName
                                    }
                                    name=""
                                    id=""
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">
                                  <label
                                    className={
                                      this.state.patientInfoData.supProviderID
                                        ? "txtUnderline"
                                        : ""
                                    }
                                    onClick={
                                      this.state.patientInfoData.supProviderID
                                        ? () =>
                                            this.openPopup(
                                              "supProviderID",
                                              this.state.patientInfoData
                                                .supProviderID
                                            )
                                        : undefined
                                    }
                                  >
                                    Sup Provider{" "}
                                  </label>

                                  <Input
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.patientInfoData.supProviderName
                                    }
                                    name=""
                                    id=""
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">&nbsp;</div>
                              </div>
                              <div className="headingOne mt-25">
                                <p>Patient Detail</p>
                              </div>

                              <div className="row-form">
                                <div className="mf-4">
                                  <Label name="Account #"></Label>

                                  <Input
                                    type="text"
                                    disabled="disabled"
                                    value={
                                      this.state.patientInfoData.accountNumber
                                    }
                                    name="accountNumber"
                                    id="accountNumber"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">
                                  <Label name="Patient name"></Label>

                                  <Input
                                    type="text"
                                    disabled="disabled"
                                    value={
                                      this.state.patientInfoData.patientName
                                    }
                                    name="patientName"
                                    id="patientName"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">
                                  <Label name="DOB"></Label>

                                  <div className="textBoxValidate">
                                    <Input
                                      type="text"
                                      disabled="disabled"
                                      value={this.state.patientInfoData.dob}
                                      name="dob"
                                      id="dob"
                                      onChange={() => this.handleChange}
                                    ></Input>
                                  </div>
                                </div>
                              </div>
                              <div className="row-form">
                                <div className="mf-4">
                                  <Label name="Plan Name"></Label>

                                  <Input
                                    type="text"
                                    disabled="disabled"
                                    value={this.state.patientInfoData.planName}
                                    name="planName"
                                    id="planName"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">
                                  <Label name="Insured Name"></Label>

                                  <Input
                                    type="text"
                                    disabled="disabled"
                                    value={
                                      this.state.patientInfoData.insuredName
                                    }
                                    name="insuredName"
                                    id="insuredName"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                                <div className="mf-4">
                                  <Label name="Insured ID "></Label>

                                  <Input
                                    type="text"
                                    disabled="disabled"
                                    value={this.state.patientInfoData.insuredID}
                                    name="insuredID"
                                    id="insuredID"
                                    onChange={() => this.handleChange}
                                  ></Input>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Tab>
                        <Tab></Tab>
                        <Tab></Tab>
                      </Tabs>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="mainTable">
                    <div className="row-form row-btn">
                      <div className="mf-12">
                        <Input
                          type="button"
                          value="Save"
                          className="btn-blue"
                          onClick={this.savePlanFollowupModel}
                          disabled={this.isDisabled(
                            this.state.editId > 0
                              ? this.props.rights.update
                              : this.props.rights.add
                          )}
                        ></Input>
                        <button
                          id="btnCancel"
                          className="btn-grey"
                          data-dismiss="modal"
                          onClick={this.props.onClose()}

                          // onClick={this.state.followPopupId > 0 ? this.props.onClose() : this.cancelBtn}
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
  return {
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    reduxID: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.planFollowupSearch,
          add: state.loginInfo.rights.planFollowupCreate,
          update: state.loginInfo.rights.planFollowupUpdate,
          delete: state.loginInfo.rights.planFollowupDelete,
          export: state.loginInfo.rights.planFollowupImport,
          import: state.loginInfo.rights.planFollowupExport
        }
      : []
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
)(NewPlanFollowupModal);
