import React, { Component } from "react";

import $ from "jquery";

import { MDBDataTable, MDBBtn } from "mdbreact";

import Label from "./Label";
import Input from "./Input";

import axios from "axios";

import Swal from "sweetalert2";
import { Tabs, Tab } from "react-tab-view";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import Dropdown from "react-dropdown";
import settingsIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import GPopup from "./GPopup";
import EditCharge from "./EditCharge";

import { isNullOrUndefined } from "util";
import NewInsurancePlan from "./NewInsurancePlan";

export class NewPatientPlanModel extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/PatientFollowup/";
    this.Notesurl = process.env.REACT_APP_URL + "/Notes/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.patientPlanModel = {
      visitID: "",
      reasonID: "",
      actionID: "",
      groupID: "",
      practiceID: "",
      locationID: "",
      providerID: "",
      referingProviderID: "",
      insurancePlanID: "",
      patientID: "",

      followUpDate: "",
      folowupAge: "",
      tickleDate: "",
      statement1SentDate: "",
      statement2SentDate: "",
      status: "",
      addedBy: "",

      updatedBy: "",
      gPatientFollowupCharge: [],
      note: [],
    };

    //Charge Model
    this.chargeModel = {
      iD: "",
      patientFollowUpID: "",
      patientID: "",
      visitID: "",
      chargeID: "",
      plan: "",
      dOS: "",
      cPT: "",
      billedAmount: "",
      paidAmount: "",
      allowedAmount: "",
      copay: "",
      deductible: "",
      coInsurance: "",
      patientPaid: "",
      patientAmount: "",
      AddedBy: "",
      AddedDate: "",
      clientID: this.props.userInfo.clientID,
      validation: false,
    };

    //Notes Model
    this.notesModel = {
      id: 0,
      practiceID: null,
      patientFollowUpID: null,
      notesDate: null,
      note: null,
      addedBy: null,
      addedDate: null,
      updatedBy: null,
      updatedDate: null,
      noteValField: "",
      validation: false,
    };

    this.patientModal = {
      patientID: "",
      patientName: "",
      accountNumber: "",
      dob: "",
      practiceID: "",

      practiceName: "",
      locationID: "",
      locationName: "",
      providerID: "",
      providerName: "",
      refProviderID: "",
      refProviderName: "",
      supProviderID: "",
      supProviderName: "",

      reasonID: "",
      reason: "",
      actionID: "",
      action: "",
      groupID: "",
      group: "",

      planName: "",
      subscriberName: "",
      subscriberID: "",
    };

    this.state = {
      note: this.note,
      patientPlanModel: this.patientPlanModel,
      patientModal: this.patientModal,
      editId: this.props.id,
      data: [],
      id: 0,
      note: [],
      resData: [],
      remCodeData: [],
      groupData: [],
      actionData: [],
      adjData: [],
      locData: [],
      proData: [],
      refproData: [],
      supproData: [],
      practionData: [],

      submissionData: "",

      chargePopup: false,
      visitPopup: false,
      popupName: "",
      isActive: true,
      showPopup: false,
    };
    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addRowNotes = this.addRowNotes.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.deleteRowNotes = this.deleteRowNotes.bind(this);
    this.openVisitPopup = this.openVisitPopup.bind(this);
    this.closeVisitPopUp = this.closeVisitPopUp.bind(this);
    this.openChargePopup = this.openChargePopup.bind(this);
    this.closeChargePopup = this.closeChargePopup.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.val = this.val.bind(this);
  }

  async componentWillMount() {
    await this.setState({ loading: true });

    try {
      await axios
        .get(this.url + "GetProfiles", this.config)
        .then((response) => {
          this.setState({
            resData: response.data.reason,
            groupData: response.data.group,
            actionData: response.data.action,
          });
        })
        .catch((error) => {});

      await axios
        .get(this.url + "FindPatientInfo/" + this.props.id, this.config)

        .then((response) => {
          let newList = [];
          response.data.map((row, i) => {
            newList.push({

              patientID: row.patientID,
              patientName: row.patientName,
              accountNumber: row.accountNumber,
              dob: row.dob,
              practiceID: row.practiceID,

              practiceName: row.practiceName,
              locationID: row.locationID,
              locationName: row.locationName,
              providerID: row.providerID,
              providerName: row.providerName,
              refProviderID: row.refProviderID,
              refProviderName: row.refProviderName,
              supProviderID: row.supProviderID,
              supProviderName: row.supProviderName,

              groupID: row.groupID,
              group: row.group,
              actionID: row.actionID,
              action: row.action,
              reasonID: row.reasonID,
              reason: row.reason,

              planName: row.planName,
              insuredName: row.insuredName,
              insuredID: row.insuredID,
            });
          });

          this.setState({ data: newList });
        })
        .catch((error) => {});

      await this.setModalMaxHeight($(".modal"));

      var zIndex = 1040 + 10 * $(".modal:visible").length;
      $(this).css("z-Index", zIndex);
      setTimeout(function () {
        $(".modal-backdrop")
          .not(".modal-stack")
          .css("z-Index", zIndex - 1)
          .addClass("modal-stack");
      }, 0);

      if (this.state.editId > 0) {
        await axios
          .get(
            this.url + "FindPatientFollowUp/" + this.state.editId,
            this.config
          )
          .then((response) => {
            this.setState({ patientPlanModel: response.data });
          })
          .catch((error) => {});

        await axios
          .get(this.url + "FindPatientInfo/" + this.state.editId, this.config)
          .then((response) => {
            this.setState({ patientModal: response.data });
          })
          .catch((error) => {});
      }
    } catch {
      this.setState({ loading: false });
    }

    this.setState({ loading: false });
  }


  componentDidMount() {
    //Adding custom className for CSS
    Array.from(document.querySelectorAll(".iMnhxj")).forEach((tab) => {
      tab.className += " userTab";
    });
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

  openPopup = (event,name, id) => {
    event.preventDefault();
    this.setState({ popupName: name, id: id });
  };

  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  openVisitPopup(event,name, id) {
    event.preventDefault();
    this.setState({ popupName: name, visitPopup: true, id: id });
  }

  //Close Visit Popup
  closeVisitPopUp() {
    this.setState({ popupName: "", visitPopup: false });
  }

  openChargePopup(event,name, id) {
    event.preventDefault();
    this.setState({ popupName: name, chargePopup: true, id: id });
  }

  //Close Charge Popup
  closeChargePopup() {
    this.setState({ popupName: "", chargePopup: false });
  }

  val(value) {
    if (isNullOrUndefined(value)) return " ";
    else return value;
  }

 

  handleChange = (event) => {
    event.preventDefault();

    this.setState({
      patientPlanModel: {
        ...this.state.patientPlanModel,
        [event.target.name]: event.target.value,
      },
    });
  };

  savePatientFollowupModel = (e) => {
    this.setState({ loading: true });

    // var myVal = this.notesModel;
    // myVal.validation = false;
    //Notes Validation
    //Notes Validation
    var note = [];
    var notesVal;
    var length = 0;
    if (this.isNull(this.state.patientPlanModel.note)) {
      note = [];
    } else {
      note = this.state.patientPlanModel.note;
      length = note.length - 1;
      note.validation = false;
      if (length > 1) {
        if (this.isNull(this.state.patientPlanModel.note[length].note)) {
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
            patientPlanModel: {
              ...this.state.patientPlanModel,
              note: note,
            },
          });
          Swal.fire("", "Please Check Notes", "error");
          return;
        }
      }
    }
    //  for (var i = 0; i < note.length; i++) {
    //    notesVal = { ...this.state.patientPlanModel.note[i] };
    //    notesVal.validation = false;
    //    //Notes validation
    //    if (this.isNull(this.state.patientPlanModel.note[i].note)) {
    //      notesVal.noteValField = (
    //        <span className="validationMsg">Enter Notes</span>
    //      );
    //      notesVal.validation = true;
    //    } else {
    //      notesVal.noteValField = "";
    //      if (notesVal.validation === false) notesVal.validation = false;
    //    }

    //    //Notes validation set state
    //    this.setState({
    //     patientPlanModel: {
    //        ...this.state.patientPlanModel,
    //        note: [
    //          ...this.state.patientPlanModel.note.slice(0, i),
    //          Object.assign({}, this.state.patientPlanModel.note[i], notesVal),
    //          ...this.state.patientPlanModel.note.slice(i + 1)
    //        ]
    //      }
    //    });
    //  }

    //  //Notes
    //  for (var i = 0; i < note.length; i++) {
    //    if (this.state.patientPlanModel.note[i].validation == true) {
    //      this.setState({ loading: false });
    //      Swal.fire("Something Wrong", "Please Check All Note Fields", "error");
    //      return;
    //    }
    //  }

    axios
      .post(
        this.url + "SavePatientFollowUp",
        this.state.patientPlanModel,
        this.config
      )

      .then((response) => {
        this.setState({
          patientPlanModel: response.data,
          editId: response.data.id,
        });

        Swal.fire("Record Saved Successfully", "", "success");
        this.componentWillMount();
      })
      .catch((error) => {});

    e.preventDefault();
  };

  async deleteRowNotes(event, index, NoteRowId) {
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
              Swal.fire("Record Deleted Successfully", "", "success");
              let note = [...this.state.patientPlanModel.note];
              note.splice(id, 1);
              this.setState({
                patientPlanModel: {
                  ...this.state.patientPlanModel,
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
          let note = [...this.state.patientPlanModel.note];
          note.splice(id, 1);
          this.setState({
            patientPlanModel: {
              ...this.state.patientPlanModel,
              note: note,
            },
          });
        }
      }
    });
  }

  // async deleteRowNotes(event, index, chargeId) {
  //   alert("TEst");
  //   const chargeID = chargeId;
  //   const id = event.target.id;
  //   Swal.fire({
  //     title: "Are you sure, you want to delete this record?",
  //     text: "",
  //     type: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!"
  //   }).then(result => {
  //     if (result.value) {
  //       if (chargeID) {
  //         axios
  //           .delete(this.Notesurl + "DeleteNotes/" + chargeId, this.config)
  //           .then(response => {
  //             Swal.fire("Record Deleted Successfully", "", "success");
  //             let note = [...this.state.patientPlanModel.note];
  //           //note.splice(id, 1);
  //           this.setState({
  //             patientPlanModel: {
  //               ...this.state.patientPlanModel,
  //               note: note
  //             }
  //           });
  //           })
  //           .catch(error => {
  //             Swal.fire(
  //               "Record Not Deleted!",
  //               "Record can not be delete, as it is being referenced in other screens.",
  //               "error"
  //             );
  //           });
  //       }

  //     }
  //   });
  // }

  async addRowNotes(event) {
    event.preventDefault();
    const note = { ...this.notesModel };
    var len = this.state.patientPlanModel.note
      ? this.state.patientPlanModel.note.length
      : 0;
    if (len == 0) {
      await this.setState({
        patientPlanModel: {
          ...this.state.patientPlanModel,
          note: this.state.patientPlanModel.note.concat(note),
        },
      });
      return;
    } else {
      len = len - 1;
      if (this.isNull(this.state.patientPlanModel.note[len].note)) {
        Swal.fire("First Enter Previous Notes", "", "error");
        return;
      } else {
        await this.setState({
          patientPlanModel: {
            ...this.state.patientPlanModel,
            note: this.state.patientPlanModel.note.concat(note),
          },
        });
      }
    }
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

    let newNotesList = this.state.patientPlanModel.note;

    const index = event.target.id;
    const name = event.target.name;
    newNotesList[index][name] = value.toUpperCase();

    await this.setState({
      patientPlanModel: {
        ...this.state.patientPlanModel,
        note: newNotesList,
      },
    });
  }

  isNull(value) {
    if (value === "" || value === null || value === undefined) return true;
    else return false;
  }

  openhistorypopup = (event,id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };

  render() {
    // const headers = ["Patient Followup", "Other 1", "Other 2"];
    const headers = ["Patient Followup"];

    // const tabHeaders = ["Notes", "Charges"];
    const tabHeaders = ["Charges", "Notes"];

    var newList = [];
    var tableData = {};
    var addtickleDate = this.state.patientPlanModel.tickleDate
      ? this.state.patientPlanModel.tickleDate.slice(0, 10)
      : "";
    var addFollowUpDate = this.state.patientPlanModel.addedDate
      ? this.state.patientPlanModel.addedDate.slice(0, 10)
      : "";

    var statY = this.state.patientPlanModel.statement1SentDate
      ? this.state.patientPlanModel.statement1SentDate.slice(0, 4)
      : "";
    var statM = this.state.patientPlanModel.statement1SentDate
      ? this.state.patientPlanModel.statement1SentDate.slice(5, 7)
      : "";
    var statD = this.state.patientPlanModel.statement1SentDate
      ? this.state.patientPlanModel.statement1SentDate.slice(8, 10)
      : "";

    var stat1Y = this.state.patientPlanModel.statement2SentDate
      ? this.state.patientPlanModel.statement2SentDate.slice(0, 4)
      : "";
    var stat1M = this.state.patientPlanModel.statement2SentDate
      ? this.state.patientPlanModel.statement2SentDate.slice(5, 7)
      : "";
    var stat1D = this.state.patientPlanModel.statement2SentDate
      ? this.state.patientPlanModel.statement2SentDate.slice(8, 10)
      : "";

    let chargeList = [];
    var data = {};
    this.state.patientPlanModel.gPatientFollowupCharge.map((row, index) => {
      chargeList.push({
        visitID: (
          <a
            href="#"
            onClick={(event) =>
              this.openVisitPopup(event, "visit", row.visitID)
            }
          >
            {" "}
            {this.val(row.visitID)}
          </a>
        ),
        chargeID: (
          <a
            href="#"
            onClick={(event) =>
              this.openChargePopup(event, "charge", row.chargeID)
            }
          >
            {" "}
            {this.val(row.chargeID)}
          </a>
        ),
        plan: (
          <a
            href="#"
            onClick={(event) =>
              this.openPopup(event, "insuranceplan", row.insurancePlanID)
            }
          >
            {row.plan}
          </a>
        ),
        dos: row.dos,
        cpt: row.cpt,
        billedAmount: row.billedAmount,
        allowedAmount: row.allowedAmount,
        paidAmount: row.paidAmount,
        patientPaid: row.patientPaid,
        patientBal: (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {row.patientBal}
          </span>
        ),
        copay: row.copay,
        deductible: row.deductible,
        coInsurance: row.coInsurance,
        tickleDate: row.tickleDate,
        status: row.status,
      });
    });
    data = {
      columns: [
        {
          label: "VISIT",
          field: "visitID",
          sort: "asc",
          width: 150,
        },
        {
          label: "CHARGE #",
          field: "chargeID",
          sort: "asc",
          width: 150,
        },
        {
          label: "PLAN",
          field: "plan",
          sort: "asc",
          width: 150,
        },
        {
          label: "DOS",
          field: "dos",
          sort: "asc",
          width: 300,
        },
        {
          label: "CPT",
          field: "cpt",
          sort: "asc",
          width: 150,
        },
        {
          label: "BILLED",
          field: "billedAmount",
          sort: "asc",
          width: 150,
        },
        {
          label: "ALLOWED",
          field: "allowedAmount",
          sort: "asc",
          width: 150,
        },
        {
          label: "PAID",
          field: "paidAmount",
          sort: "asc",
          width: 150,
        },
        {
          label: "PAT.PAID",
          field: "patientPaid",
          sort: "asc",
          width: 150,
        },
        {
          label: "PATIENT BAL",
          field: "patientBal",
          sort: "asc",
          width: 150,
        },
        {
          label: "COPAY",
          field: "copay",
          sort: "asc",
          width: 150,
        },
        {
          label: "DEDUCTIBLE",
          field: "deductible",
          sort: "asc",
          width: 150,
        },

        {
          label: "CO-INS",
          field: "coInsurance",
          sort: "asc",
          width: 150,
        },
        {
          label: "TICKLE DATE",
          field: "tickleDate",
          sort: "asc",
          width: 150,
        },
        {
          label: "STATUS",
          field: "status",
          sort: "asc",
          width: 150,
        },
      ],
      rows: chargeList,
    };

    //// notes Map  ////////

    this.state.patientPlanModel.note.map((row, index) => {
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
              class="provider-form w-100 form-control-user"
              style={{
                width: "100%",
                height: "100%",
                padding: "10px",
              }}
              rows="1"
              cols="60"
              name="note"
              value={this.state.patientPlanModel.note[index].note}
              id={index}
              onChange={this.handleNoteChange}
            ></textarea>
            {this.state.patientPlanModel.note[index].noteValField}
          </div>
        ),

        addedBy: (
          <div style={{ width: "150px" }}>
            <span>{this.state.patientPlanModel.note[index].addedBy}</span>
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

    const options = [
      { value: "History", label: "History", className: "dropdown" },
    ];

    var Imag;
    Imag = (
      <div>
        <img src={settingsIcon} width="17px" />
      </div>
    );

    var dropdown;
    dropdown = (
      <Dropdown
        className=""
        options={options}
        onChange={(event) => this.openhistorypopup(event,0)}
        //  value={options}
        // placeholder={"Select an option"}
        placeholder={Imag}
      />
    );

    let popup = "";
    if (this.state.showPopup) {
      popup = (
        <NewHistoryPractice
          onClose={this.closehistoryPopup}
          historyID={this.state.editId}
          apiURL={this.url}
          // disabled={this.isDisabled(this.props.rights.update)}
          // disabled={this.isDisabled(this.props.rights.add)}
        ></NewHistoryPractice>
      );
    } else if (this.state.visitPopup) {
      popup = (
        <GPopup
          onClose={this.closeVisitPopUp}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.popupName === "insuranceplan") {
      popup = (
        <NewInsurancePlan
          onClose={this.closePopup}
          id={this.state.id}
        ></NewInsurancePlan>
      );
    } else if (this.state.chargePopup) {
      popup = (
        <EditCharge
          onClose={this.closeChargePopup}
          chargeId={this.state.id}
        ></EditCharge>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
    }

    return (
      <React.Fragment>
        <div
          class="modal fade show popupBackScreen"
          id="clientModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            // style={{ margin: "8.8rem auto" }}
            class="modal-dialog"
            role="document"
          >
            <div
              id="modalContent"
              class="modal-content"
              style={{ minHeight: "300px", maxHeight: "700px" }}
            >
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3 style={{visibility:"hidden"}}></h3>

                      <div class="float-lg-right text-right">
                        {this.state.editId > 0 ? dropdown : ""}
                        <button
                          class="close"
                          type="button"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span
                            aria-hidden="true"
                            onClick={() => this.props.onClose()}
                          >
                            ×
                          </span>
                        </button>
                      </div>
                    </div>
                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>
                    <br></br>
                    {/* Main Content */}

                    <Tabs headers={headers} style={{ cursor: "default" }}>
                      <Tab>
                        <br></br>
                        <div class="row">
                          <div class="col-md-12 mt-1 order-md-1 provider-form">
                            <div className="row">
                              <div class="col-md-4 mb-2 col-sm-4">
                                <div class="col-md-4 float-left">
                                  <label for="firstName">
                                    {this.state.patientPlanModel.reasonID ? (
                                      <a
                                        href=""
                                        onClick={(event) =>
                                          this.openPopup(
                                            event,
                                            "reason",
                                            this.state.patientPlanModel.reasonID
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
                                    value={this.state.patientPlanModel.reasonID}
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
                                    {this.state.patientPlanModel.actionID ? (
                                      <a
                                        href=""
                                        onClick={(event) =>
                                          this.openPopup(
                                            event,
                                            "action",
                                            this.state.patientPlanModel.actionID
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
                                    value={this.state.patientPlanModel.actionID}
                                    onChange={this.handleChange}
                                    style={{ width: "100%", padding: "5px" }}
                                    class="provider-form form-control-user"
                                  >
                                    {this.state.actionData.map((s) => (
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
                                    {this.state.patientPlanModel.groupID ? (
                                      <a
                                        href=""
                                        onClick={(event) =>
                                          this.openPopup(
                                            event,
                                            "group",
                                            this.state.patientPlanModel.groupID
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
                                    value={this.state.patientPlanModel.groupID}
                                    onChange={this.handleChange}
                                    style={{ width: "100%", padding: "5px" }}
                                    class="provider-form form-control-user"
                                  >
                                    {this.state.groupData.map((s) => (
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
                                    Follow up Date
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8  p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="  Follow up Date"
                                    type="date"
                                    name="followUpDate"
                                    id="followUpDate"
                                    value={addFollowUpDate}
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div class="invalid-feedback"></div>
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
                                    placeholder="Follow up Age"
                                    value={this.state.patientPlanModel.age}
                                    name="age"
                                    id="age"
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
                                    Statment 1 Sent Date
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Statment 1 Sent Date"
                                    disabled
                                    value={
                                      this.state.patientPlanModel
                                        .statement1SentDate
                                        ? statM + "/" + statD + "/" + statY
                                        : ""
                                    }
                                    name="statement1SentDate"
                                    id="statement1SentDate"
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
                                    Statment 2 Sent Date
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="  Statment 2 Sent Date"
                                    value={
                                      this.state.patientPlanModel
                                        .statement2SentDate
                                        ? stat1M + "/" + stat1D + "/" + stat1Y
                                        : ""
                                    }
                                    name="statement2SentDate"
                                    id="statement2SentDate"
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
                                    Status
                                    {/* <span class="text-danger">*</span> */}
                                  </label>
                                </div>
                                <div class="col-md-8 p-0 m-0 float-left">
                                  <input
                                    type="text"
                                    class="provider-form w-100 form-control-user"
                                    placeholder="Status"
                                    value={this.state.patientPlanModel.status}
                                    disabled={true}
                                    name="status"
                                    id="status"
                                  />
                                </div>
                                <div class="invalid-feedback">
                                  {/* {this.state.validationModel.subscriberIdValField} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* //Charge and Notes TAb starts here */}
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
                                      data={data}
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
                              <div class="card-header py-3">
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
                        {/* Charges and notes tab starts here */}

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
                                      this.state.patientModal.accountNumber
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
                                    value={this.state.patientModal.patientName}
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
                                    value={this.state.patientModal.dob}
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
                                    value={this.state.patientModal.planName}
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
                                      this.state.patientModal.subscriberName
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
                                    value={this.state.patientModal.subscriberID}
                                    name="subscriberID"
                                    id="subscriberID"
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
                      </Tab>
                    </Tabs>

                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={this.savePatientFollowupModel}
                      >
                        Save
                      </button>

                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={() => this.props.onClose()}
                      >
                        Cancel
                      </button>
                    </div>
                    {/* End of Main Content */}
                  </div>
                </div>

                <a class="scroll-to-top rounded" href="#page-top">
                  {" "}
                  <i class="fas fa-angle-up"></i>{" "}
                </a>
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
          search: state.loginInfo.rights.patientPlanSearch,
          add: state.loginInfo.rights.patientPlanCreate,
          update: state.loginInfo.rights.patientPlanUpdate,
          delete: state.loginInfo.rights.patientPlanDelete,
          export: state.loginInfo.rights.patientPlanExport,
          import: state.loginInfo.rights.patientPlanImport,
        }
      : [],
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

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(NewPatientPlanModel);
