import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  withRouter,
} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Tabs, Tab } from "react-tab-view";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import $ from "jquery";
import Label from "./Label";
import Input from "./Input";
import NewPractice from "./NewPractice";
import NewLocation from "./NewLocation";
import NewProvider from "./NewProvider";
import NewRefferingProvider from "./NewRefferingProvider";
import { NewCharge } from "./NewCharge";
import GPopup from "./GPopup";
import NewGroup from "./NewGroup";
import NewReason from "./NewReason";
import NewAction from "./NewAction";

import { MDBBtn, MDBDataTable } from "mdbreact";
import samll_doc_icon from "../images/dob-small-icon.png";
//Reducers Inport
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import EditCharge from "./EditCharge";

export class CreateFollowup extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Visit/";
    this.planFollowupUrl = process.env.REACT_APP_URL + "/PlanFollowup/";
    this.Notesurl = process.env.REACT_APP_URL + "/Notes/";

    this.apiurl = process.env.REACT_APP_URL + "/PaymentCheck/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.visitID = this.props.visitID;

    //Plan Followup Model
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
      gFollowupCharge: [],
      note: [],
    };

    this.paymentCheckModel = {
      id: 0,
      receiverID: null,
      receiver: null,
      practiceID: null,
      facility: null,
      checkNumber: null,
      checkDate: null,
      checkAmount: null,
      transactionCode: null,
      creditDebitFlag: null,
      paymentMethod: null,
      payerName: null,
      status: null,
      appliedAmount: null,
      unAppliedAmount: null,
      postedAmount: null,
      payerID: null,
      payerAddress: null,
      payerCity: null,
      payerState: null,
      payerZipCode: null,
      reF_2U_ID: null,
      payerContactPerson: null,
      payerContactNumber: null,
      payeeName: null,
      payeeNPI: null,
      payeeAddress: null,
      payeeCity: null,
      payeeState: null,
      payeeZipCode: null,
      payeeTaxID: null,
      numberOfVisits: 0,
      numberOfPatients: 0,

      paymentVisit: [],
    };

    //Charge Model
    this.chargeModel = {
      chargeID: 0,
      groupID: null,
      actionID: null,
      adjusmentCode: null,
      reasonID: null,
      tickleDate: null,
      visitID: 0,
      clientID: this.props.userInfo.clientID,
      validation: false,
    };
    this.paymentChargeModel = {
      id: 0,
      paymentVisitID: null,
      chargeID: null,
      charge: null,
      cptCode: null,
      modifier1: null,
      modifier2: null,
      modifier3: null,
      modifier4: null,
      billedAmount: null,
      paidAmount: null,
      revenueCode: null,
      units: null,
      dosFrom: null,
      dosTo: null,
      chargeNumber: null,
      patientAmount: null,
      patientName: null,
      deductableAmount: null,
      coinsuranceAmount: null,
      chargeControlNumber: null,
      otherPatResp: null,
      coPay: null,
      writeoffAmount: null,
      allowedAmount: null,
      appliedToSec: true,

      adjustmentCodeID1: "",
      adjustmentCodeObj1: {},
      type1: "",
      adjustmentAmount1: "",
      groupCode1: "",
      groupCode1ValField1: "",

      adjustmentCodeID2: "",
      adjustmentCodeObj2: {},
      type2: "",
      adjustmentAmount2: "",
      groupCode2: "",
      groupCode1ValField2: "",

      adjustmentCodeID3: "",
      adjustmentCodeObj3: {},
      type3: "",
      adjustmentAmount3: "",
      groupCode3: "",
      groupCode1ValField3: "",

      adjustmentCodeID4: null,
      adjsutmentAmount4: null,
      groupCode4: null,

      adjustmentCodeID5: null,
      adjsutmentAmount5: null,
      groupCode5: null,
      remarkCodeID1: null,
      remarkCodeObj1: {},
      remarkCodeID2: null,
      remarkCodeObj2: {},
      remarkCodeID3: null,
      remarkCodeObj3: {},
      remarkCodeID4: 1,
      remarkCodeID5: 1,

      allowedAmountValField: "",
    };

    this.paymentVisitModel = {
      id: 0,
      paymentCheckID: null,
      visitID: null,
      visit: null,
      patientID: null,
      patient: null,
      batchDocumentID: null,
      pageNumber: "",
      claimNumber: null,
      statusCode: null,
      billedAmount: null,
      paidAmount: null,
      patientAmount: null,
      allowedAmount: "",
      writeOffAmount: "",
      payerICN: null,
      patientLastName: null,
      patientFIrstName: null,
      insuredLastName: null,
      insuredFirstName: null,
      insuredID: null,
      provLastName: null,
      provFirstName: null,
      provNPI: null,
      forwardedPayerName: null,
      forwardedPayerID: null,
      claimStatementFromDate: null,
      claimStatementToDate: null,
      payerReceivedDate: null,

      paymentCharge: [],
    };

    //Notes Model
    this.notesModel = {
      id: 0,
      practiceID: null,
      planFollowupID: null,
      notesDate: null,
      note: null,
      addedBy: null,
      addedDate: null,
      updatedBy: null,
      updatedDate: null,
      noteValField: null,
      validation: false,
    };

    //Valdation Model
    this.validationModel = {
      valreasonID: "",
      valactionID: "",
      valgroupID: "",
    };

    //State
    this.state = {
      //note: this.note,
      paymentCheckModel: this.paymentCheckModel,
      paymentVisitModel: [],
      paymentChargeModel: [],
      chargeModel: this.chargeModel,
      visitModel: this.visitModel,
      planFollowupModel: this.planFollowupModel,
      editId: this.props.id > 0 ? this.props.id : this.props.visitID,
      planFollowUpID: this.props.planFollowUpID,
      followPopupId: 0,
      validationModel: this.validationModel,
      //note: [],
      gFollowupCharge: [],
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
      loading: false,
      ChargeTable: [],
      isActive: true,
      notesArray: "",

      payVisitID: null,
      chargePopup: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.savePlanFollowupModel = this.savePlanFollowupModel.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.addCPTRowIncharge = this.addCPTRowIncharge.bind(this);
    this.addRowNotes = this.addRowNotes.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.closepopPopup = this.closepopPopup.bind(this);
    this.handleChargeChange = this.handleChargeChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.closeVisitPopup = this.closeVisitPopup.bind(this);
    this.tabcall = this.tabcall.bind(this);
    this.openChargePopup = this.openChargePopup.bind(this);
    this.closeChargePopup = this.closeChargePopup.bind(this);
  }

  componentDidMount() {
    //Adding custom className for CSS
    Array.from(document.querySelectorAll(".iMnhxj")).forEach((tab) => {
      tab.className += " userTab";
    });
  }

  openChargePopup(event, name, id) {
    event.preventDefault();
    this.setState({ popupName: name, chargePopup: true, id: id });
  }

  //Close Charge Popup
  closeChargePopup() {
    this.setState({ popupName: "", chargePopup: false });
  }

  tabcall() {
    console.log("this is tab calling ");

    //http://192.168.104.105/Staging/api/PlanFollowUp/GetEOB/2

    axios
      .get(
        this.planFollowupUrl + "GetEOB/" + this.state.paymentVisitID,
        this.config
      )
      .then((response) => {
        this.setState({ paymentCheckModel: response.data });
        console.log("EOB Response", this.paymentCheckModel);
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.status) {
            console.log(error.response.status);
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(JSON.stringify(error));
      });
  }

  async componentWillMount() {
    console.log("Plan Follow up ID", this.state.editId);
    console.log("Visit ID : ", this.props.visitID);
    console.log("Props ID : ", this.props.id);

    await this.setState({ loading: true });
    try {
      //Find Planfollowup By VisitID
      // if (this.props.visitID > 0) {
      //   await axios
      //     .get(
      //       this.url + "FindFollowUpByVisitID/" + this.props.visitID,
      //       this.config
      //     )
      //     .then(response => {
      //       console.log("Find FollowUp By VisitID Response111: ", response.data);
      //       this.setState({
      //         planFollowupModel: {
      //           ...this.state.planFollowupModel,
      //           id: response.data.id
      //         },
      //         editId: response.data.id
      //       });
      //     })
      //     .catch(error => {
      //       this.setState({
      //         planFollowupModel: {
      //           ...this.state.planFollowupModel,
      //           visitID: this.props.visitID
      //         }
      //       });
      //       Swal.fire("Please First Create Followup", "", "warning");
      //       console.log(error);
      //     });
      // }

      //Find Plan Followup
      if (this.props.id > 0) {
        await axios
          .get(
            this.planFollowupUrl + "FindPlanFollowUp/" + this.state.editId,
            this.config
          )
          .then(async (response) => {
            await this.setState({
              planFollowupModel: response.data,
              payVisitID: response.data.paymentVisitID,
            });

            await this.getProfiles(response.data.id);

            await axios
              .get(
                this.planFollowupUrl + "GetEOB/" + this.state.payVisitID,
                this.config
              )
              .then(async (response) => {
                await this.setState({ paymentCheckModel: response.data });
                console.log("EOB Response", this.paymentCheckModel);
              })
              .catch((error) => {
                console.log(JSON.stringify(error));
              });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        if (this.props.visitID > 0) {
          await axios
            .get(
              this.url + "FindFollowUpByVisitID/" + this.props.visitID,
              this.config
            )
            .then(async (response) => {
              await axios
                .get(
                  this.planFollowupUrl + "FindPlanFollowUp/" + response.data.id,
                  this.config
                )
                .then(async (followupResponse) => {
                  await this.setState({
                    planFollowupModel: followupResponse.data,
                  });
                  await this.getProfiles(followupResponse.data.id);
                })
                .catch((error) => {
                  console.log(error);
                });

              // this.setState({
              //   planFollowupModel: {
              //     ...this.state.planFollowupModel,
              //     id: response.data.id
              //   },
              //   editId: response.data.id
              // });
            })
            .catch(async (error) => {
              await this.setState({
                planFollowupModel: {
                  ...this.state.planFollowupModel,
                  visitID: this.props.visitID,
                },
              });
              await this.getProfiles(0);
              Swal.fire("Please First Create Followup", "", "warning");
              console.log(error);
            });
        }
      }
    } catch {
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  }

  //Plan Followup Get Profiles
  getProfiles = async (follwupID) => {
    //Plan Followup get Profiles
    await axios
      .get(this.planFollowupUrl + "GetProfiles/" + follwupID, this.config)
      .then((response) => {
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
              : response.data.submissionInfo,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  isNull(value) {
    if (value === "" || value === null || value === undefined) return true;
    else return false;
  }

  async handleNoteChange(event) {
    var value = event.target.value;
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    if (caret == 0 || caret <= 1) {
      value = value.trim();
    }
    let newNotesList = this.state.planFollowupModel.note;

    const index = event.target.id;
    const name = event.target.name;
    newNotesList[index][name] = value.toUpperCase();

    await this.setState({
      planFollowupModel: {
        ...this.state.planFollowupModel,
        note: newNotesList,
      },
    });
  }

  async handleChargeChange(event) {
    console.log("Pointer Event : ", event.target);

    let newChargeList = this.state.planFollowupModel.gFollowupCharge;

    const index = event.target.id;
    const name = event.target.name;
    newChargeList[index][name] = event.target.value;

    await this.setState({
      planFollowupModel: {
        ...this.state.planFollowupModel,
        gFollowupCharge: newChargeList,
      },
    });
  }

  openPopup = (event, name, id) => {
    event.preventDefault();
    this.setState({ popupName: name, id: id });
  };

  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  closeVisitPopup() {
    this.setState({ popupName: "", visitPopup: false });
  }

  savePlanFollowupModel = (e) => {
    this.setState({ loading: true });
    if (this.state.planFollowupModel.reasonID === "Please Select") {
      Swal.fire({
        type: "error",
        text: "Please Select the Reason",
      });
      return;
    } else {
      var note = [];
      var notesVal;
      var length = 0;
      if (this.isNull(this.state.planFollowupModel.note)) {
        note = [];
      } else {
        note = this.state.planFollowupModel.note;
        length = note.length - 1;
        note.validation = false;

        if (length > 0) {
          if (this.isNull(this.state.planFollowupModel.note[length].note)) {
            note[length].noteValField = (
              <span className="validationMsg">Enter Notes</span>
            );
            note[length].validation = true;
          } else {
            note[length].noteValField = "";
            note[length].validation = false;
          }

          if (note[length].validation == true) {
            this.setState({
              loading: false,
              planFollowupModel: {
                ...this.state.planFollowupModel,
                note: note,
              },
            });
            Swal.fire(
              "Something Wrong",
              "Please Check All Note Fields",
              "error"
            );
            return;
          }
        }
      }

      axios
        .post(
          this.planFollowupUrl + "SavePlanFollowup",
          this.state.planFollowupModel,
          this.config
        )
        .then((response) => {
          console.log("SavePlanFollowup API", response.data);
          this.setState({
            planFollowupModel: response.data,
            editId: response.data.id,
            loading: false,
          });
          Swal.fire("Record Saved Successfully", "", "success");
          // this.componentWillMount();
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
          let errorsList = [];
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == "404") {
                Swal.fire(
                  "Failed With Status Code 404",
                  "Please Enter Valid Data",
                  "error"
                );
              }
            }
          }
        });

      e.preventDefault();
    }
  };

  handleChange = (event) => {
    event.preventDefault();

    this.setState({
      planFollowupModel: {
        ...this.state.planFollowupModel,
        [event.target.name]: event.target.value,
      },
    });
  };
  /***********************************************************************************************************/
  /***********************************************************************************************************/
  /***********************************************************************************************************/
  /***********************************************************************************************************/
  async deleteRowNotes(event, index, NoteRowId) {
    console.log("charge ID : ", NoteRowId);
    const NoteRowID = NoteRowId;
    const id = event.target.id;
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        //KHIZER CODE-------------------------DeleteNote
        if (NoteRowID > 0) {
          axios
            .delete(this.Notesurl + "DeleteNotes/" + NoteRowID, this.config)
            .then((response) => {
              console.log("Delete Response :", response);
              Swal.fire("Record Deleted Successfully", "", "success");
              let note = [...this.state.planFollowupModel.note];
              note.splice(id, 1);
              this.setState({
                planFollowupModel: {
                  ...this.state.planFollowupModel,
                  note: note,
                },
              });
            })
            .catch((error) => {
              if (error.response) {
                if (error.response.status) {
                  if (error.response.status == 400) {
                    Swal.fire("Error", error.response.data, "error");
                  } else {
                    Swal.fire(
                      "Record Not Deleted!",
                      "Record can not be delete, as it is being referenced in other screens.",
                      "error"
                    );
                  }
                }
              } else {
                Swal.fire(
                  "Record Not Deleted!",
                  "Record can not be delete, as it is being referenced in other screens.",
                  "error"
                );
              }
            });
        } else {
          Swal.fire("Record Deleted Successfully", "", "success");
          let note = [...this.state.planFollowupModel.note];
          note.splice(id, 1);
          this.setState({
            planFollowupModel: {
              ...this.state.planFollowupModel,
              note: note,
            },
          });
        }
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

  cancelBtn = () => {
    this.props.selectTabAction("Charges");
    this.props.history.push("/Charges");
  };
  handleCheck() {
    console.log("handle check");
    this.setState({
      planFollowupModel: {
        ...this.state.planFollowupModel,
        isActive: !this.state.planFollowupModels.isActive,
      },
    });
  }

  async addRowNotes() {
    const note = { ...this.notesModel };
    var len = this.state.planFollowupModel.note
      ? this.state.planFollowupModel.note.length
      : 0;
    if (len == 0) {
      await this.setState({
        planFollowupModel: {
          ...this.state.planFollowupModel,
          note: this.state.planFollowupModel.note.concat(note),
        },
      });
      return;
    } else {
      len = len - 1;
      if (this.isNull(this.state.planFollowupModel.note[len].note)) {
        Swal.fire("First Enter Previous Notes", "", "error");
        return;
      } else {
        await this.setState({
          planFollowupModel: {
            ...this.state.planFollowupModel,
            note: this.state.planFollowupModel.note.concat(note),
          },
        });
      }
      // const Note = { ...this.notesModel };
      // console.log("dsfsd : ", this.state.planFollowupModel);
      // await this.setState({
      //   planFollowupModel: {
      //     ...this.state.planFollowupModel,
      //     note: this.state.planFollowupModel.note.concat(Note)
      //   }
      // });
    }
  }

  async addCPTRowIncharge() {
    const gFollowupCharge = { ...this.chargeModel };

    console.log("ADDCPTROWINCHARGEW");

    await this.setState({
      planFollowupModel: {
        ...this.state.planFollowupModel,
        gFollowupCharge: this.state.planFollowupModel.gFollowupCharge.concat(
          gFollowupCharge
        ),
      },
    });
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  render() {
    let newList = [];
    var tableData = {};
    // console.log("ya raha NOTE ka data",this.state.planFollowupModel.note);
    // console.log("ya raha newList ka data",newList);
    this.state.planFollowupModel.note.map((row, index) => {
      var notesDate = this.isNull(row.notesDate)
        ? ""
        : row.notesDate.slice(0, 10);

      if (notesDate != "") {
        var YY = notesDate.slice(0, 4);
        var DD = notesDate.slice(5, 7);
        var MM = notesDate.slice(8, 10);
      }

      newList.push({
        notesDate: (
          <div style={{ width: "86px" }}>
            <span>{notesDate != "" ? MM + "/" + DD + "/" + YY : ""}</span>
          </div>
        ),

        note: (
          <div style={{ width: "100%" }}>
            <textarea
             note
              style={{
                width: "100%",
                height: "100%",
                padding: "10px",
              }}
              rows="1"
              cols="60"
              name="note"
              value={this.state.planFollowupModel.note[index].note}
              id={index}
              onChange={this.handleNoteChange}
            ></textarea>
            {this.state.planFollowupModel.note[index].noteValField}
          </div>
        ),

        addedBy: (
          <div style={{ width: "150px" }}>
            <span>{this.state.planFollowupModel.note[index].addedBy}</span>
          </div>
        ),

        remove: (
          <div
            style={{
              width: "50px",
              paddingRight: "15px",
              marginLeft: "10px",
              // marginTop: "-10px",
            }}
          >
            <button
              class="close"
              type="button"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span
                aria-hidden="true"
                name="deleteCPTBtn"
                id={index}
                onClick={(event, index) =>
                  this.deleteRowNotes(event, index, row.id)
                }
              >
                ×
              </span>
            </button>
          </div>
        ),
      });
    });
    tableData = {
      columns: [
        {
          label: "DATE",
          field: "notesDate",
          sort: "asc",
          // width: 400
        },
        {
          label: "NOTES",
          field: "note",
          sort: "asc",
          // width: 200
        },
        {
          label: "ADDED BY",
          field: "addedBy",
          sort: "asc",
          // width: 50
        },

        {
          label: "",
          field: "remove",
          sort: "asc",
          // width: 0
        },
      ],
      rows: newList,
    };

    const type = [
      { value: "", display: "Select Type" },
      { value: "SP", display: "Solo Practice" },
      { value: "GP", display: "Group Practice" },
    ];

    // CHARGE TABLE
    let pushTocharges = [];
    var ChargeTable = {};
    let chargeList = [];

    this.state.planFollowupModel.gFollowupCharge.map((row, index) => {
      var tickleDate = this.isNull(row.tickleDate)
        ? ""
        : row.tickleDate.slice(0, 10);
      pushTocharges.push({
        chargeID: (
          <div>
            <input
              // style={{
              //   width: " 105px",
              //   marginRight: "0px",
              //   padding: "7px 5px"
              // }}
              id={index}
              name="chargeID"
              type="text"
              value={
                this.state.planFollowupModel.gFollowupCharge[index].chargeID
              }
              readOnly
              onChange={this.handleChargeChange}
            ></input>
          </div>
        ),

        groupID: (
          <div
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          //   width: "150px"
          // }}
          >
            <select
              name="groupID"
              id={index}
              value={
                this.state.planFollowupModel.gFollowupCharge[index].groupID
              }
              onChange={this.handleChargeChange}
            >
              {this.state.grData.map((s) => (
                <option key={s.value} value={s.id}>
                  {s.description}
                </option>
              ))}
            </select>
          </div>
        ),

        reasonID: (
          <div
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          //   width: "150px"
          // }}
          >
            <select
              name="reasonID"
              id={index}
              value={
                this.state.planFollowupModel.gFollowupCharge[index].reasonID
              }
              onChange={this.handleChargeChange}
            >
              {this.state.resData.map((s) => (
                <option key={s.value} value={s.id}>
                  {s.description}
                </option>
              ))}
            </select>
          </div>
        ),
        actionID: (
          <div
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          //   width: "150px"
          // }}
          >
            <select
              name="actionID"
              id={index}
              value={
                this.state.planFollowupModel.gFollowupCharge[index].actionID
              }
              onChange={this.handleChargeChange}
            >
              {this.state.acData.map((s) => (
                <option key={s.value} value={s.id}>
                  {s.description}
                </option>
              ))}
            </select>
          </div>
        ),
        adjusmentCode: (
          <div
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          //   width: "150px"
          // }}
          >
            <select
              name="adjusmentCode"
              id={index}
              value={
                this.state.planFollowupModel.gFollowupCharge[index]
                  .adjusmentCode
              }
              onChange={this.handleChargeChange}
            >
              {this.state.remCodeData.map((s) => (
                <option key={s.value} value={s.id}>
                  {s.description}
                </option>
              ))}
            </select>
          </div>
        ),
        tickleDate: (
          <div
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          //   width: "250px"
          // }}
          >
            <input
              // style={{
              //   background: "url(" + samll_doc_icon + ") no-repeat right",
              //   width: "250px"
              // }}
              className="smallCalendarIcon"
              type="date"
              name="tickleDate"
              id={index}
              value={tickleDate}
              onChange={this.handleChargeChange}
            ></input>
          </div>
        ),
      });
    });

    this.state.planFollowupModel.gFollowupCharge.map((row, index) => {
      chargeList.push({
        dos: row.dos,
        submitDate: row.submitDate,
        chargeID: (
          <a
            href=""
            onClick={(event) =>
              this.openChargePopup(event, "charge", row.chargeID)
            }
          >
            {row.chargeID}
          </a>
        ),
        cpt: row.cpt,
        billedAmount: row.billedAmount,
        planBalance: row.planBalance,
      });
    });
    ChargeTable = {
      columns: [
        {
          label: "DOS",
          field: "dos",
          sort: "asc",
          width: 150,
        },
        {
          label: "SUBMIT DATE",
          field: "submitDate",
          sort: "asc",
          width: 270,
        },
        // {
        //   label: "VISIT ID",
        //   field: "visitID",
        //   sort: "asc",
        //   width: 150
        // },
        {
          label: "CHARGE #",
          field: "chargeID",
          sort: "asc",
          width: 150,
        },

        {
          label: "CPT",
          field: "cpt",
          sort: "asc",
          width: 150,
        },
        {
          label: "BILLED AMOUNT",
          field: "billedAmount",
          sort: "asc",
          width: 150,
        },
        {
          label: "PLAN BALANCE",
          field: "planBalance",
          sort: "asc",
          width: 150,
        },
      ],
      //rows: pushTocharges
      rows: chargeList,
    };

    // const tabHeaders = ["Notes", "Charges"];
    const tabHeaders = ["Charges", "Notes"];

    const isActive = this.state.planFollowupModel.isActive;
    const headers = ["Details", "Preview EOB"];

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

    var eobDate = this.state.paymentCheckModel.checkDate
      ? this.state.paymentCheckModel.checkDate.slice(0, 10)
      : "";

    let popup = "";
    if (this.state.popupName === "practice") {
      popup = (
        <NewPractice
          onClose={this.closepopPopup}
          practiceID={this.state.id}
        ></NewPractice>
      );
    } else if (this.state.popupName === "location") {
      popup = (
        <NewLocation
          onClose={this.closepopPopup}
          id={this.state.id}
        ></NewLocation>
      );
    } else if (this.state.popupName === "provider") {
      popup = (
        <NewProvider
          onClose={this.closepopPopup}
          id={this.state.id}
        ></NewProvider>
      );
    } else if (this.state.popupName === "reason") {
      popup = (
        <NewReason onClose={this.closepopPopup} id={this.state.id}></NewReason>
      );
    } else if (this.state.popupName === "group") {
      popup = (
        <NewGroup onClose={this.closepopPopup} id={this.state.id}></NewGroup>
      );
    } else if (this.state.popupName === "action") {
      popup = (
        <NewAction onClose={this.closepopPopup} id={this.state.id}></NewAction>
      );
    } else if (this.state.popupName === "visit") {
      popup = (
        <GPopup
          onClose={this.closeVisitPopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.popupName === "refprovider") {
      popup = (
        <NewRefferingProvider
          onClose={this.closepopPopup}
          id={this.state.id}
        ></NewRefferingProvider>
      );
    } else if (this.state.chargePopup) {
      popup = (
        <EditCharge
          onClose={this.closeChargePopup}
          chargeId={this.state.id}
        ></EditCharge>
      );
    } else popup = <React.Fragment></React.Fragment>;

    //Spinner
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

    let rowData = [];

    this.state.paymentCheckModel.paymentVisit.map((paymentVisit, index) => {
      const data1 = paymentVisit.paymentCharge;

      console.log("insuredLastName", paymentVisit.insuredLastName);

      paymentVisit.paymentCharge.map((paymentCharge, i) => {
        console.log("Visit Index : ", paymentCharge.chargeControlNumber);
        rowData.push(
          <div style={{ width: "100%" }}>
            <div
              style={{
                width: "100%",
                float: "left",
                border: "1px solid #000",
                margintop: "10px",
              }}
            ></div>
            <div style={{ width: "100%", float: "left", margintop: "10px" }}>
              <p style={{ margintop: "0", marginbottom: "0" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "25%",
                    overflow: "hidden",
                  }}
                >
                  NAME:
                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .insuredLastName
                  }
                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .insuredFirstName
                  }
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "17%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  MID:
                  {this.state.paymentCheckModel.paymentVisit[index].insuredID}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "15%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  ACNT:
                  {this.state.paymentCheckModel.paymentVisit[index].claimNumber}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "18%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  ICN:
                  {this.state.paymentCheckModel.paymentVisit[index].payerICN}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "7%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  ASG: Y
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "16%",
                    padding: "0 5px",
                    overflow: "hidden",
                    float: "right",
                  }}
                >
                  MOA:{" "}
                </span>
              </p>
              <p style={{ margintop: "0", marginbottom: "0" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "17%",
                    overflow: "hidden",
                  }}
                >
                  {this.state.paymentCheckModel.payeeNPI}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "10%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {this.state.paymentCheckModel.paymentVisit[
                    index
                  ].paymentCharge[i].dosFrom.slice(0, 10)}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "10%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].dosTo
                  }
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "10%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].cptCode
                  }
                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].modifier1
                  }
                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].modifier2
                  }
                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].modifier3
                  }
                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].modifier4
                  }
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "10%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].billedAmount
                  }
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "10%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {this.state.paymentCheckModel.paymentVisit[index]
                    .paymentCharge[i].allowedAmount
                    ? this.state.paymentCheckModel.paymentVisit[index]
                        .paymentCharge[i].allowedAmount
                    : " 0.00"}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "10%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].deductableAmount
                      ? this.state.paymentCheckModel.paymentVisit[index]
                          .paymentCharge[i].deductableAmount
                      : "0.00"

                    //                 this.state.planFollowupModel.addedDate
                    // ? this.state.planFollowupModel.addedDate.slice(5, 7)
                    // : "";
                  }
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "10%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {
                    // this.state.paymentCheckModel.paymentVisit[index]
                    //   .paymentCharge[i].coinsuranceAmount

                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].coinsuranceAmount
                      ? this.state.paymentCheckModel.paymentVisit[index]
                          .paymentCharge[i].coinsuranceAmount
                      : "0.00"
                  }
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "10%",
                    float: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {this.state.paymentCheckModel.paymentVisit[index]
                    .paymentCharge[i].paidAmount
                    ? this.state.paymentCheckModel.paymentVisit[index]
                        .paymentCharge[i].paidAmount
                    : "0.00"}
                </span>
              </p>
            </div>
            <div style={{ width: "100%", float: "left", margintop: "10px" }}>
              <p style={{ margintop: "0", marginbottom: "0" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "10%",
                    overflow: "hidden",
                  }}
                >
                  CNTL #:
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "89%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].chargeControlNumber
                  }
                </span>
              </p>
              <p style={{ margintop: "0", marginbottom: "0" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "8%",
                    overflow: "hidden",
                  }}
                >
                  PT RESP
                </span>
                {/* <span
                  style={{
                    display: "inline-block",
                    width: "8%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden"
                  }}
                >
                  RESP
                </span> */}
                <span
                  style={{
                    display: "inline-block",
                    width: "8%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {/* 15.00 */}

                  {
                    // this.state.paymentCheckModel.paymentVisit[index]
                    //   .paymentCharge[i].otherPatResp

                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].otherPatResp
                      ? this.state.paymentCheckModel.paymentVisit[index]
                          .paymentVisit[i].otherPatResp
                      : "0.00"
                  }
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "8%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  CARC
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "8%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].groupCode1
                  }

                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].adjustmentCodeID1
                  }

                  {"\n"}

                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].groupCode2
                  }

                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].adjustmentCodeID2
                  }
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "16%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  CLAIM TOTALS
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "8%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {/* billedAmount */}
                  {/* 150.00 */}

                  {
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].billedAmount
                  }
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "8%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {/* 105.50 */}
                  {this.state.paymentCheckModel.paymentVisit[index]
                    .paymentCharge[i].allowedAmount
                    ? this.state.paymentCheckModel.paymentVisit[index]
                        .paymentCharge[i].allowedAmount
                    : " 0.00"}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "8%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {/* 0.00 */}
                  {this.state.paymentCheckModel.paymentVisit[index]
                    .paymentCharge[i].deductableAmount
                    ? this.state.paymentCheckModel.paymentVisit[index]
                        .paymentCharge[i].deductableAmount
                    : "0.00"}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "8%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {/* 15.00 */}
                  {this.state.paymentCheckModel.paymentVisit[index]
                    .paymentCharge[i].coinsuranceAmount
                    ? this.state.paymentCheckModel.paymentVisit[index]
                        .paymentCharge[i].coinsuranceAmount
                    : "0.00"}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "8%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                    float: "right",
                  }}
                >
                  {/* 90.50 */}
                  {this.state.paymentCheckModel.paymentVisit[index]
                    .paymentCharge[i].paidAmount
                    ? this.state.paymentCheckModel.paymentVisit[index]
                        .paymentCharge[i].paidAmount
                    : "0.00"}
                </span>
              </p>
              <p style={{ margintop: "0", marginbottom: "0" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "12%",
                    overflow: "hidden",
                  }}
                >
                  ADJ TO TOTALS:
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "20%",
                    textalign: "left",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  PREV PD
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "10%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  INTEREST
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "9%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {/* 0.00 */}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "21%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  LATE FILING CHARGE
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "8%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  {/* 0.00 */}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "7%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  NET
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: "8%",
                    textalign: "right",
                    padding: "0 5px",
                    overflow: "hidden",
                    float: "right",
                  }}
                >
                  {/* 90.50 */}
                </span>
              </p>
              <p style={{ margintop: "20px", marginbottom: "0" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "9%",
                    overflow: "hidden",
                  }}
                >
                  REND-PROV
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "10%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  SERV-DATE
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "6%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  POS
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "14%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  PD-PROC/MODS
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "10%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  PD-NOS
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "10%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  BILLED
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "10%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  ALLOWED
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "9%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  DEDUCT
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "9%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  COINS
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "9%",
                    padding: "0 5px",
                    overflow: "hidden",
                    float: "right",
                  }}
                >
                  PROV-PD
                </span>
              </p>
              <p style={{ margintop: "0", marginbottom: "0" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "14%",
                    overflow: "hidden",
                  }}
                >
                  RARC
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "14%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  SUB-NOS
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "14%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  SUB-PROC
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "14%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  GRP/CARC
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "14%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  CARC-AMT
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "14%",
                    padding: "0 5px",
                    overflow: "hidden",
                  }}
                >
                  ADJ-QTY
                </span>
                <span
                  style={{
                    display: "inline-block",
                    textalign: "right",
                    width: "14%",
                    padding: "0 5px",
                    overflow: "hidden",
                    float: "right",
                  }}
                >
                  BS
                </span>
              </p>
            </div>
          </div>
        );
      });
    });

    return (
      <React.Fragment>
        {spiner}
        {/* // <!-- /.container-fluid Starts--> */}
        <div
          class="container-fluid"
          style={{ paddingLeft: "0px", paddingRight: "0px" }}
        >
          {/* <!-- Page Heading --> */}

          {/* <!-- Container Top Starts Here --> */}
          <div>
            {/* <!-- Tab Content Starts --> */}
            <div class="tab-content">
              {/* <!-- Tab Pane Starts Here --> */}
              <div id="home" class="tab-pane">
                {/* Header starts here */}
                <div class="row">
                  <div class="col-md-12 mt-1 order-md-1 provider-form">
                    <div class="header pt-1">
                      <h6>
                        <span class="h4">PLAN FOLLOWUP</span>
                      </h6>
                    </div>
                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>
                    <br></br>

                    {/* ============================================= */}
                    {/* React Tabs Start Here*/}
                    <Tabs headers={headers} style={{ cursor: "default" }}>
                      <Tab>
                        <br></br>
                        <div class="row">
                          <div class="col-md-12 mt-1 order-md-1 provider-form">
                            <div className="row">
                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    {this.state.planFollowupModel.reasonID ? (
                                      <a
                                        href="#"
                                        onClick={(event) =>
                                          this.openPopup(
                                            event,
                                            "reason",
                                            this.state.planFollowupModel
                                              .reasonID
                                          )
                                        }
                                      >
                                        Reason
                                      </a>
                                    ) : (
                                      "Reason"
                                    )}

                                    <span class="text-danger">*</span>
                                  </label>
                                </div>
                                <div class="col-md-8  p-0 m-0 float-left">
                                  <select
                                    name="reasonID"
                                    id="reasonID"
                                    value={
                                      this.state.planFollowupModel.reasonID
                                    }
                                    onChange={this.handleChange}
                                    style={{ width: "100%", padding: "5px" }}
                                    class="provider-form form-control-user"
                                  >
                                    {this.state.resData.map((s) => (
                                      <option key={s.id} value={s.id}>
                                        {s.description}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div class="invalid-feedback"></div>
                              </div>
                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    {this.state.planFollowupModel.actionID ? (
                                      <a
                                        href=""
                                        onClick={(event) =>
                                          this.openPopup(
                                            event,
                                            "action",
                                            this.state.planFollowupModel
                                              .actionID
                                          )
                                        }
                                      >
                                        Action
                                      </a>
                                    ) : (
                                      "Action"
                                    )}
                                    <span class="text-danger">*</span>
                                  </label>
                                </div>
                                <div class="col-md-8  p-0 m-0 float-left">
                                  <select
                                    name="actionID"
                                    id="actionID"
                                    value={
                                      this.state.planFollowupModel.actionID
                                    }
                                    onChange={this.handleChange}
                                    style={{ width: "100%", padding: "5px" }}
                                    class="provider-form form-control-user"
                                  >
                                    {this.state.acData.map((s) => (
                                      <option key={s.id} value={s.id}>
                                        {s.description}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div class="invalid-feedback"></div>
                              </div>
                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    {this.state.planFollowupModel.groupID ? (
                                      <a
                                        href=""
                                        onClick={(event) =>
                                          this.openPopup(
                                            event,
                                            "group",
                                            this.state.planFollowupModel.groupID
                                          )
                                        }
                                      >
                                        Group
                                      </a>
                                    ) : (
                                      "Group"
                                    )}
                                    <span class="text-danger">*</span>
                                  </label>
                                </div>
                                <div class="col-md-8  p-0 m-0 float-left">
                                  <select
                                    name="groupID"
                                    id="groupID"
                                    value={this.state.planFollowupModel.groupID}
                                    onChange={this.handleChange}
                                    style={{ width: "100%", padding: "5px" }}
                                    class="provider-form form-control-user"
                                  >
                                    {this.state.grData.map((s) => (
                                      <option key={s.id} value={s.id}>
                                        {s.description}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div class="invalid-feedback"></div>
                              </div>
                            </div>
                            <div className="row">
                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    Adjusment Code
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8  p-0 m-0 float-left">
                                  <select
                                    name="adjustmentCodeID"
                                    id="adjustmentCodeID"
                                    value={
                                      this.state.planFollowupModel
                                        .adjustmentCodeID
                                    }
                                    onChange={this.handleChange}
                                    style={{ width: "100%", padding: "5px" }}
                                    class="provider-form form-control-user"
                                  >
                                    {this.state.remCodeData.map((s) => (
                                      <option key={s.id} value={s.id}>
                                        {s.description}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div class="invalid-feedback"></div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    Claim Status Code
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="  Claim Status Code"
                                    value={
                                      this.state.planFollowupModel
                                        .claimStatusCode
                                    }
                                    name="claimStatusCode"
                                    id="claimStatusCode"
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.subscriberIdValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    Tickle Date
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="date"
                                    class="provider-form w-100 form-control-user"
                                    type="date"
                                    name="tickleDate"
                                    id="tickleDate"
                                    value={addtickleDate}
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.subscriberIdValField} */}
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    Follow up Date
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Follow up Date"
                                    disabled
                                    value={
                                      this.state.planFollowupModel.addedDate
                                        ? statFM + "/" + statFD + "/" + statFY
                                        : ""
                                    }
                                    name="addedDate"
                                    id="addedDate"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.subscriberIdValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    Follow up Age
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Follow up Age "
                                    value={this.state.planFollowupModel.age}
                                    name="age"
                                    id="age"
                                    disabled
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.subscriberIdValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    {this.state.planFollowupModel.visitID ? (
                                      <a
                                        href=""
                                        onClick={(event) =>
                                          this.openPopup(
                                            event,
                                            "visit",
                                            this.state.planFollowupModel.visitID
                                          )
                                        }
                                      >
                                        Visit#
                                      </a>
                                    ) : (
                                      "Visit"
                                    )}
                                    <span class="text-danger">*</span>
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Visit#"
                                    value={this.state.planFollowupModel.visitID}
                                    name="visitID"
                                    id="visitID"
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.subscriberIdValField} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* //Charge and Notes TAb */}
                        <Tabs
                          headers={tabHeaders}
                          style={{ cursor: "default" }}
                        >
                          <Tab>
                            <br></br>
                            <div class="card mb-4">
                              <div class="card-body">
                                <div class="table-responsive">
                                  <div
                                    style={{ overflowX: "hidden" }}
                                    id="dataTable_wrapper"
                                    class="dataTables_wrapper dt-bootstrap4"
                                  >
                                    <MDBDataTable
                                      responsive={true}
                                      striped
                                      searching={false}
                                      data={ChargeTable}
                                      displayEntries={false}
                                      sortable={true}
                                      scrollX={false}
                                      scrollY={false}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Tab>
                          <Tab>
                            <br></br>
                            <div class="card mb-4">
                              <div class="card-header">
                                {/* <h6 class="m-0 font-weight-bold text-primary search-h">
                                Notes
                              </h6> */}
                                <div class="float-lg-right text-right">
                                  <button
                                    style={{ marginTop: "-6px" }}
                                    class="float-right btn btn-primary mr-2"
                                    onClick={this.addRowNotes}
                                  >
                                    Add Note{" "}
                                  </button>
                                </div>
                              </div>

                              <div class="card-body">
                                <div class="table-responsive">
                                  <div
                                    style={{ overflowX: "hidden" }}
                                    id="dataTable_wrapper"
                                    class="dataTables_wrapper dt-bootstrap4"
                                  >
                                    <MDBDataTable
                                      responsive={true}
                                      striped
                                      searching={false}
                                      data={tableData}
                                      displayEntries={false}
                                      sortable={true}
                                      scrollX={false}
                                      scrollY={false}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Tab>
                        </Tabs>

                        {/* Subscriber info row starts here */}
                        <br></br>
                        <div class="row">
                          <div class="col-md-12 col-sm-12 mt-1 provider-form ">
                            <div class="header pt-0">
                              <h6 class="heading">Subscriber Information</h6>
                              <hr
                                class="p-0 mt-0 mb-1"
                                style={{ backgroundColor: "#037592" }}
                              ></hr>
                              <div class="clearfix"></div>
                            </div>
                            <br></br>
                            <div class="row">
                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    Payer Name
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder=" Payer Name"
                                    disabled
                                    type="text"
                                    value={this.state.submissionData.payerName}
                                    name="payerName"
                                    id="payerName"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.lastNameValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    Payer ID
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Payer ID"
                                    disabled="disabled"
                                    type="text"
                                    value={this.state.submissionData.payerID}
                                    name="payerID"
                                    id="payerID"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.firstNameValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">Receiver</label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Receiver"
                                    disabled="disabled"
                                    type="text"
                                    value={this.state.submissionData.receiver}
                                    name="receiver"
                                    id="receiver"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.accountNumValField} */}
                                </div>
                              </div>
                            </div>

                            <div class="row">
                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    Telephone#
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder=" Telephone#"
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.submissionData.telePhoneNumber
                                    }
                                    name="telePhoneNumber"
                                    id="telePhoneNumber"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.lastNameValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    PR. Telephone#
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="PR. Telephone#"
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.submissionData
                                        .prTelephoneNumber
                                    }
                                    name="prTelephoneNumber"
                                    id="prTelephoneNumber"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.firstNameValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">Submit Date</label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Submit Date"
                                    disabled="disabled"
                                    type="text"
                                    value={this.state.submissionData.submitDate}
                                    name="submitDate"
                                    id="submitDate"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.accountNumValField} */}
                                </div>
                              </div>
                            </div>

                            <div class="row">
                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    DOS
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="DOS"
                                    disabled="disabled"
                                    type="text"
                                    value={this.state.submissionData.dos}
                                    name="dos"
                                    id="dos"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.lastNameValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    Billed Amount
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Billed Amount "
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.submissionData.billedAmount
                                    }
                                    name="billedAmount"
                                    id="billedAmount"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.firstNameValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">Plan Balance</label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Plan Balance"
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.submissionData.planBalance
                                    }
                                    name="planBalance"
                                    id="planBalance"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.accountNumValField} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Subscriber info row Ends here */}

                        {/* Legal Entities starts here */}
                        <br></br>
                        <div class="row">
                          <div class="col-md-12 col-sm-12 mt-1 provider-form ">
                            <div class="header pt-0">
                              <h6 class="heading">Legal Entities</h6>
                              <hr
                                class="p-0 mt-0 mb-1"
                                style={{ backgroundColor: "#037592" }}
                              ></hr>
                              <div class="clearfix"></div>
                            </div>
                            <br></br>
                            <div class="row">
                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    {this.state.planFollowupModel.practiceID ? (
                                      <a
                                        href=""
                                        onClick={(event) =>
                                          this.openPopup(
                                            event,
                                            "practice",
                                            this.state.planFollowupModel
                                              .practiceID
                                          )
                                        }
                                      >
                                        Practice
                                      </a>
                                    ) : (
                                      "Practice"
                                    )}
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Practice"
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.patientInfoData.practiceName
                                    }
                                    name=""
                                    id=""
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.lastNameValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    {this.state.planFollowupModel.locationID ? (
                                      <a
                                        href=""
                                        onClick={(event) =>
                                          this.openPopup(
                                            event,
                                            "location",
                                            this.state.planFollowupModel
                                              .locationID
                                          )
                                        }
                                      >
                                        Location
                                      </a>
                                    ) : (
                                      "Location"
                                    )}
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="  Location"
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.patientInfoData.locationName
                                    }
                                    name=""
                                    id=""
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.firstNameValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    {this.state.planFollowupModel.providerID ? (
                                      <a
                                        href=""
                                        onClick={(event) =>
                                          this.openPopup(
                                            event,
                                            "provider",
                                            this.state.planFollowupModel
                                              .providerID
                                          )
                                        }
                                      >
                                        Provider
                                      </a>
                                    ) : (
                                      "Provider"
                                    )}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="  Provider"
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.patientInfoData.providerName
                                    }
                                    name=""
                                    id=""
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.accountNumValField} */}
                                </div>
                              </div>
                            </div>

                            <div class="row">
                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    {this.state.planFollowupModel
                                      .refProviderID ? (
                                      <a
                                        href=""
                                        onClick={(event) =>
                                          this.openPopup(
                                            event,
                                            "refprovider",
                                            this.state.planFollowupModel
                                              .refProviderID
                                          )
                                        }
                                      >
                                        Ref Provider
                                      </a>
                                    ) : (
                                      " Ref Provider"
                                    )}
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder=" Ref Provider"
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.patientInfoData.refProviderName
                                    }
                                    name=""
                                    id=""
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.lastNameValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    {this.state.planFollowupModel
                                      .supProviderID ? (
                                      <a
                                        href=""
                                        onClick={(event) =>
                                          this.openPopup(
                                            event,
                                            "supProviderID",
                                            this.state.planFollowupModel
                                              .supProviderID
                                          )
                                        }
                                      >
                                        Sup Provider
                                      </a>
                                    ) : (
                                      "  Sup Provider"
                                    )}
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder=" Sup Provider"
                                    disabled="disabled"
                                    type="text"
                                    value={
                                      this.state.patientInfoData.supProviderName
                                    }
                                    name=""
                                    id=""
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.firstNameValField} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Legen Entities Ends here */}

                        {/* Personal Details starts here */}
                        <br></br>
                        <div class="row">
                          <div class="col-md-12 col-sm-12 mt-1 provider-form ">
                            <div class="header pt-0">
                              <h6 class="heading">Patient Detail</h6>
                              <hr
                                class="p-0 mt-0 mb-1"
                                style={{ backgroundColor: "#037592" }}
                              ></hr>
                              <div class="clearfix"></div>
                            </div>
                            <br></br>
                            <div class="row">
                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    Account #
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Account #"
                                    disabled="disabled"
                                    value={
                                      this.state.patientInfoData.accountNumber
                                    }
                                    name="accountNumber"
                                    id="accountNumber"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.lastNameValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    Patient Name
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="  Patient Name"
                                    disabled="disabled"
                                    value={
                                      this.state.patientInfoData.patientName
                                    }
                                    name="patientName"
                                    id="patientName"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.firstNameValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">DOB</label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="  DOB "
                                    disabled="disabled"
                                    value={this.state.patientInfoData.dob}
                                    name="dob"
                                    id="dob"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.accountNumValField} */}
                                </div>
                              </div>
                            </div>

                            <div class="row">
                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    Plan Name
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Plan Name"
                                    disabled="disabled"
                                    value={this.state.patientInfoData.planName}
                                    name="planName"
                                    id="planName"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.lastNameValField} */}
                                </div>
                              </div>

                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    Subscriber Name
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Subscriber Name"
                                    disabled="disabled"
                                    value={
                                      this.state.patientInfoData.subscriberName
                                    }
                                    name="subscriberName"
                                    id="subscriberName"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.firstNameValField} */}
                                </div>
                              </div>
                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    Subscriber ID
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Subscriber ID"
                                    disabled
                                    value={
                                      this.state.patientInfoData.subscriberID
                                    }
                                    name="subscriberID "
                                    id="subscriberID "
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.firstNameValField} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Personal Details Ends Here */}

                        <div class="row">
                          {/* <!--Address Information start here--> */}
                          <div class="col-12 pt-2 text-center">
                            <button
                              class="btn btn-primary mr-2"
                              onClick={this.savePlanFollowupModel}
                            >
                              Save
                            </button>
                            <button
                              class="btn btn-primary mr-2"
                              onClick={
                                this.props.onClose
                                  ? () => this.props.onClose()
                                  : this.cancelBtn
                              }
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </Tab>
                      <Tab></Tab>
                    </Tabs>
                  </div>
                </div>
                {/* Header Ends Here */}
                {/* <!-- Footer --> */}
                <footer class="sticky-footer bg-white">
                  <div class="container my-auto">
                    <div class="copyright text-center my-auto">
                      {" "}
                      <span>
                        Version 1.0 <br />
                        Copyright &copy; 2020 Bellmedex LLC. All rights
                        reserved.
                      </span>{" "}
                    </div>
                  </div>
                </footer>
                {/* <!-- End of Footer --> */}
                {popup}
              </div>
              {/* <!-- Tab Pane Ends Here --> */}
            </div>
            {/* <!-- Tab Content Ends --> */}
          </div>
          {/* <!-- Container Top Ends Here --> */}

          {/* <!-- End of Main Content --> */}
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
    visitID: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { token: "", isLogin: false },
    userInfo: state.loginInfo
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
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(CreateFollowup)
);
