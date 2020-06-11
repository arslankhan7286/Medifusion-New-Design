import React, { Component } from "react";

import { MDBDataTable, MDBBtn } from "mdbreact";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import Label from "./Label";
import Input from "./Input";
import SearchHeading from "./SearchHeading";
import { withRouter } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
import GPopup from "./GPopup";
import NewAdjustmentCode from './NewAdjustmentCode'
import NewPlanFollowupModal from "./NewPlanFollowupModal";

import $ from "jquery";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import NewInsurancePlan from "./NewInsurancePlan";

import NewGroup from "./NewGroup";
import NewReason from "./NewReason";
import NewAction from "./NewAction";
import NewRemarkCode from "./NewRemarkCode";

import NewPractice from "./NewPractice";
import { isNullOrUndefined } from "util";

import GridHeading from "./GridHeading";

export class PlanFollowup extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/PlanFollowup/";
    this.profileUrl = process.env.REACT_APP_URL + "/PatientFollowup/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.searchModel = {
      reasonID: "",
      groupID: "",
      actionID: "",
      practice: "",
      adjustmentCodeID: "",
      planName: "",
      visitID: "",
      accountNum: "",
      planID: "",
      dos: "",
      submitDate: "",
      tickleDate: "",
      entryDateFrom: "",
      fromDate: "",
      toDate: "",
    };

    //Validation Model
    this.validationModel = {
      dobValField: "",
      submitDateValField: "",
      tickleDatevalField: "",
      fromDateValField: "",
      fromDateFDValField: "",
      selectFromDateValField: "",
      toDateValField: "",
      toDateFDValField: "",
    };

    this.state = {
      searchModel: this.searchModel,
      validationModel: this.validationModel,
      data: [],
      id: 0,
      resData: [],
      groupData: [],
      actionData: [],
      isActive: true,

      showPopup: false,
      visitPopup: false,

      popupName: "",
      patientPopup: false,

      reasonPopup: false,
      actionPopup: false,
      groupPopup: false,
      adjusmentPopup: false,

      showPracticePopup: false,
    };
    this.selectedVisits = [];
    this.searchPlanFollowup = this.searchPlanFollowup.bind(this);
    this.openPlanFollowupPopup = this.openPlanFollowupPopup.bind(this);
    this.openReasonPopup = this.openReasonPopup.bind(this);
    this.closeReasonPopUp = this.closeReasonPopUp.bind(this);

    this.openGroupPopup = this.openGroupPopup.bind(this);
    this.closeGroupPopUp = this.closeGroupPopUp.bind(this);

    this.openActionPopup = this.openActionPopup.bind(this);
    this.closeActionPopUp = this.closeActionPopUp.bind(this);

    this.closePLanFollowupPopup = this.closePLanFollowupPopup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.openPracticePopup = this.openPracticePopup.bind(this);
    this.closePracticePopup = this.closePracticePopup.bind(this);

    this.openPatientPopup = this.openPatientPopup.bind(this);
    this.closePatientPopup = this.closePatientPopup.bind(this);
    this.openVisitPopup = this.openVisitPopup.bind(this);
    this.closeVisitPopUp = this.closeVisitPopUp.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  openPracticePopup = (event,id) => {
    event.preventDefault();
    this.setState({ showPracticePopup: true, id: id });
  };

  closePracticePopup = () => {
    $("#myModal").hide();
    this.setState({ showPracticePopup: false });
  };

  isChecked = (id) => {
    //return this.state.submitModel.visits.filter(name => name === id)[0] ? true : false
    return this.selectedVisits.filter((name) => name === id)[0] ? true : false;
  };
  val(value) {
    if (isNullOrUndefined(value)) return " ";
    else return value;
  }
  openPatientPopup(event,name, id) {
    event.preventDefault();
    this.setState({ popupName: name, patientPopup: true, id: id });
  }

  closePatientPopup() {
    this.setState({ popupName: "", patientPopup: false });
  }

  openVisitPopup(event,name, id) {
    event.preventDefault();
    this.setState({ popupName: name, visitPopup: true, id: id });
  }

  //Close Visit Popup
  closeVisitPopUp() {
    this.setState({ popupName: "", visitPopup: false });
  }

  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };
  openPopup = (event,name, id) => {
    event.preventDefault();
    this.setState({ popupName: name, id: id });
  };

  async componentWillMount() {
    try {
      if (this.props.location.query.status) {
        this.planFollowUpSearch();
      }

      if (this.props.location.query.submitDate) {
        console.log("Date", this.props.location.query.submitDate);
        await this.setState({
          searchModel: {
            ...this.setState.searchModel,
            submitDate: this.props.location.query.submitDate,
          },
          //  console.log("dateofsystem", this.props.location.query.entryDateFrom )
        });
        this.planFollowUpSearch();
      }
    } catch {}

    axios
      .get(this.profileUrl + "GetProfiles", this.config)
      .then((response) => {
        this.setState({
          resData: response.data.reason,
          groupData: response.data.group,
          actionData: response.data.action,
        });

        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleChange = (event) => {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]:
          event.target.value === "Please Select"
            ? null
            : event.target.value.toUpperCase(),
      },
    });
  };

  controlYearLength(event) {
    var date = new Date(event.target.value);
    var date1 = date.getFullYear().toString();
    if (date1.length >= 4) {
      event.preventDefault();
      return;
    }
    return true;
  }

  closePLanFollowupPopup() {
    $("#myModal").hide();
    this.setState({ showPopup: false });
  }
  openPlanFollowupPopup = (event,id) => {
    event.preventDefault();
    this.props.selectTabAction("NewCharge", 0);
    this.setState({ showPopup: true, id: id });
  };

  openReasonPopup = (event,id) => {
    event.preventDefault();
    // alert(id);
    this.setState({ reasonPopup: true, id: id });
  };

  closeReasonPopUp = () => {
    $("#reasonModal").hide();

    this.setState({ reasonPopup: false });
  };

  openGroupPopup = (event,id) => {
    event.preventDefault();
    // alert(id);
    this.setState({ groupPopup: true, id: id });
  };

  closeGroupPopUp = () => {
    $("groupModal").hide();
    this.setState({ groupPopup: false });
  };

  openActionPopup = (event,id) => {
    event.preventDefault();
    // alert(id);

    this.setState({ actionPopup: true, id: id });
  };
  closeActionPopUp = () => {
    $("actionModal").hide();
    this.setState({ actionPopup: false });
  };

  openadjustmentPopup = (event,id) => {
    event.preventDefault();
    //  alert(id);

    this.setState({ adjusmentPopup: true, id: id });
  };
  closeAdjustmentPopUp = () => {
    $("actionModal").hide();
    this.setState({ adjusmentPopup: false });
  };

  async clearFields() {
    var myVal = { ...this.validationModel };
    myVal.dobValField = "";
    myVal.submitDateValField = "";
    myVal.tickleDatevalField = "";
    myVal.fromDateValField = "";
    myVal.fromDateFDValField = "";
    myVal.selectFromDateValField = "";
    myVal.toDateValField = "";
    myVal.toDateFDValField = "";

    this.setState({
      searchModel: this.searchModel,
      validationModel: myVal,
    });

    this.searchPlanFollowup();
  }

  isNull = (value) => {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select" ||
      value === "Please Coverage" ||
      value === "Please Relationship"
    )
      return true;
    else return false;
  };

  planFollowUpSearch = () => {
    this.setState({ loading: true });
    // e.preventDefault();
    console.log(this.state);
    axios
      .post(this.url + "FindPlanFollowup", this.state.searchModel, this.config)
      .then((response) => {
        console.log("Response : ", response);

        let newList = [];
        response.data.map((row, i) => {
          console.log(row);
          newList.push({
            planFollowUpID: (
              <a
                href=""
                onClick={() => this.openPlanFollowupPopup(row.planFollowUpID)}
              >
                {row.planFollowUpID}
              </a>
            ),
            entryDate: row.entryDate,
            visitID: (
              <a
              href=""
                onClick={(event) => this.openVisitPopup(event,"visit", row.visitID)}
              >
                {" "}
                {this.val(row.visitID)}
              </a>
            ),
            dos: row.dos,
            accountNum: (
              <a
              href=""
                onClick={(event) => this.openPatientPopup(event,"patient", row.patientID)}
              >
                {" "}
                {this.val(row.accountNum)}
              </a>
            ),
            patient: row.patient,
            practice: (
              <a
              href=""
                onClick={(event) => this.openPracticePopup(event,row.practiceID)}
              >
                {" "}
                {this.val(row.practice)}
              </a>
            ),

            adjustmentCode: (
              <a
              href=""
                onClick={(event) => this.openadjustmentPopup(event,row.adjustmentCodeID)}
              >
                {" "}
                {this.val(row.adjustmentCode)}
              </a>
            ),

            reason: (
              <a
              href=""
                onClick={(event) => this.openReasonPopup(event,row.reasonID)}
              >
                {" "}
                {this.val(row.reason)}
              </a>
            ),
            group: (
              <a
              href=""
                onClick={(event) => this.openGroupPopup(event,row.groupID)}
              >
                {" "}
                {this.val(row.group)}
              </a>
            ),
            action: (
              <a
               href=""
                onClick={(event) => this.openActionPopup(event,row.actionID)}
              >
                {" "}
                {this.val(row.action)}
              </a>
            ),

            planName: (
              <a
               href=""
                onClick={(event) =>
                  this.openPopup(event,"insuranceplan", row.insurancePlanID)
                }
              >
                {" "}
                {this.val(row.planName)}
              </a>
            ),
            billedAmount: row.billedAmount,
            planBal: row.planBalance,
            tickleDate: row.tickleDate,
            followUpAge: row.followupAge,
            isSubmitted: row.isSubmitted,
            submittedDate: row.submitDate,
          });
        });

        this.setState({ data: newList, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });

    // e.preventDefault();
  };

  handleSearch = (event) => {
    event.preventDefault();

    var myVal = this.validationModel;
    myVal.validation = false;

    //DOB Future Date Validation
    if (this.isNull(this.state.searchModel.dos) == false) {
      if (
        new Date(
          moment(this.state.searchModel.dos).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.dobValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.dobValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.dobValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Submit   Date Future Date Validation
    if (this.isNull(this.state.searchModel.submitDate) == false) {
      if (
        new Date(
          moment(this.state.searchModel.submitDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.submitDateValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.submitDateValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.submitDateValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Tickle   Date Future Date Validation
    if (this.isNull(this.state.searchModel.tickleDate) == false) {
      if (
        new Date(
          moment(this.state.searchModel.tickleDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.tickleDatevalField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.tickleDatevalField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.tickleDatevalField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //From   Date Future Date Validation
    if (this.isNull(this.state.searchModel.fromDate) == false) {
      if (
        new Date(
          moment(this.state.searchModel.fromDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.fromDateFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.fromDateFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.fromDateFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //To   Date Future Date Validation
    if (this.isNull(this.state.searchModel.toDate) == false) {
      if (
        new Date(
          moment(this.state.searchModel.toDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.toDateFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.toDateFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.toDateFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //if Date To is selected Then Make sure than Date Form is also selected
    if (
      this.isNull(this.state.searchModel.fromDate) == true &&
      this.isNull(this.state.searchModel.toDate) == false
    ) {
      myVal.selectFromDateValField = (
        <span className="validationMsg">Select From Date</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectFromDateValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Date To must be greater than Date From Validation
    if (
      this.isNull(this.state.searchModel.fromDate) == false &&
      this.isNull(this.state.searchModel.toDate) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.fromDate).format().slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.toDate).format().slice(0, 10)
        ).getTime()
      ) {
        myVal.fromDateValField = (
          <span className="validationMsg">
            Date From must be less than or equals to Date From
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.fromDateValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.fromDateValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    if (myVal.validation == true) {
      this.setState({ validationModel: myVal });
      Swal.fire(
        "Something Wrong",
        "Please Select All Fields Properly",
        "error"
      );
      return;
    }

    if (event) {
      console.log("Char Code : ", event.charCode);
      this.searchPlanFollowup();
    } else {
      return true;
      console.log("Else Char Code : ", event.charCode);
    }
    event.preventDefault();
  };

  searchPlanFollowup() {
    this.setState({ loading: true });
    // e.preventDefault();
    console.log(this.state);
    axios
      .post(this.url + "FindPlanFollowup", this.state.searchModel, this.config)
      .then((response) => {
        console.log("Response : ", response);

        let newList = [];
        response.data.map((row, i) => {
          console.log(row);
          newList.push({
            // payerID: <MDBBtn color="purple" size="sm" onClick={() => this.openSubmitPopup(row.id)}>{row.payerId}</MDBBtn>,

            planFollowUpID: (
              <a
                href=""
                onClick={(event) => this.openPlanFollowupPopup(event,row.planFollowUpID)}
              >
                {row.planFollowUpID}
              </a>
            ),
            entryDate: row.entryDate,
            visitID: (
              <a
              href=""
                onClick={(event) => this.openVisitPopup(event,"visit", row.visitID)}
              >
                {" "}
                {this.val(row.visitID)}
              </a>
            ),
            dos: row.dos,
            accountNum: (
              <a
              href=""
                onClick={(event) => this.openPatientPopup(event,"patient", row.patientID)}
              >
                {" "}
                {this.val(row.accountNum)}
              </a>
            ),
            patient: row.patient,
            practice: (
              <a
              href=""
                onClick={(event) => this.openPracticePopup(event,row.practiceID)}
              >
                {" "}
                {this.val(row.practice)}
              </a>
            ),

            adjustmentCode: (
              <a
              href=""
                onClick={(event) => this.openadjustmentPopup(event,row.adjustmentCodeID)}
              >
                {" "}
                {this.val(row.adjustmentCode)}
              </a>
            ),

            reason: (
              <a
              href=""
                onClick={(event) => this.openReasonPopup(event,row.reasonID)}
              >
                {" "}
                {this.val(row.reason)}
              </a>
            ),
            group: (
              <a
              href=""
                onClick={(event) => this.openGroupPopup(event,row.groupID)}
              >
                {" "}
                {this.val(row.group)}
              </a>
            ),
            action: (
              <a
               href=""
                onClick={(event) => this.openActionPopup(event,row.actionID)}
              >
                {" "}
                {this.val(row.action)}
              </a>
            ),

            planName: (
              <a
               href=""
                onClick={(event) =>
                  this.openPopup(event,"insuranceplan", row.insurancePlanID)
                }
              >
                {" "}
                {this.val(row.planName)}
              </a>
            ),
            billedAmount: row.billedAmount,
            planBal: row.planBalance,
            tickleDate: row.tickleDate,
            followUpAge: row.followupAge,
            isSubmitted: row.isSubmitted,
            submittedDate: row.submitDate,
          });
        });

        this.setState({ data: newList, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });

    // e.preventDefault();
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  render() {
    const data = {
      columns: [
       
        {
          label: "FOLLOW UP #",
          field: "planFollowUpID",
          sort: "asc",
          width: 150,
        },
        {
          label: "ENTRY DATE",
          field: "entryDate",
          sort: "asc",
          width: 150,
        },
        {
          label: "VISIT #",
          field: "visitID",
          sort: "asc",
          width: 150,
        },
        {
          label: "DOS",
          field: "dos",
          sort: "asc",
          width: 150,
        },
        {
          label: "ACCOUNT #",
          field: "accountNum",
          sort: "asc",
          width: 150,
        },
        {
          label: "PATIENT",
          field: "patient",
          sort: "asc",
          width: 150,
        },
        {
          label: "PRACTICE",
          field: "practice",
          sort: "asc",
          width: 150,
        },
        {
          label: "ADJ.CODE",
          field: "adjustmentCode",
          sort: "asc",
          width: 150,
        },
        {
          label: "REASON",
          field: "reason",
          sort: "asc",
          width: 150,
        },
        {
          label: "GROUP",
          field: "group",
          sort: "asc",
          width: 150,
        },

        {
          label: "ACTION",
          field: "action",
          sort: "asc",
          width: 150,
        },
        {
          label: "PLAN",
          field: "planName",
          sort: "asc",
          width: 150,
        },
        {
          label: "BILLED AMT",
          field: "billedAmount",
          sort: "asc",
          width: 150,
        },
        {
          label: "PLAN BAL",
          field: "planBal",
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
          label: "AGE",
          field: "followUpAge",
          sort: "asc",
          width: 150,
        },
        {
          label: "SUBMITTED",
          field: "isSubmitted",
          sort: "asc",
          width: 150,
        },
        {
          label: "SUBMITTED DATE",
          field: "submittedDate",
          sort: "asc",
          width: 150,
        },
      ],
      rows: this.state.data,
    };

    let popup = "";

    if (this.state.showPopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <GPopup
          onClose={this.closePLanFollowupPopup}
          id={this.state.id}
          popupName="followup"
        ></GPopup>
      );

      // popup = (
      //   <NewPlanFollowupModal
      //     onClose={() => this.closePLanFollowupPopup}
      //     id={this.state.id}
      //   ></NewPlanFollowupModal>
      // );
    } else if (this.state.showPracticePopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <NewPractice
          onClose={this.closePracticePopup}
          practiceID={this.state.id}
        ></NewPractice>
      );
    } else if (this.state.patientPopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <GPopup
          onClose={this.closePatientPopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.visitPopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <GPopup
          onClose={this.closeVisitPopUp}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.popupName === "insuranceplan") {
      document.body.style.overflow = 'hidden';
      popup = (
        <NewInsurancePlan
          onClose={this.closePopup}
          id={this.state.id}
        ></NewInsurancePlan>
      );
    } else if (this.state.groupPopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <NewGroup
          onClose={this.closeGroupPopUp}
          id={this.state.id}
        ></NewGroup>
      );
    } else if (this.state.reasonPopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <NewReason
          onClose={this.closeReasonPopUp}
          id={this.state.id}
        ></NewReason>
      );
    } else if (this.state.actionPopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <NewAction
          onClose={this.closeActionPopUp}
          id={this.state.id}
        ></NewAction>
      );
    } else if (this.state.adjusmentPopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <NewAdjustmentCode
          onClose={this.closeAdjustmentPopUp}
          id={this.state.id}
        ></NewAdjustmentCode>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
      document.body.style.overflow = 'visible';
    }

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

    console.log("Search Model : ", this.state.searchModel);
    return (
      <React.Fragment>
        {spiner}
        <div class="container-fluid">
          <div class="header pt-3">
            <h6>
              <span class="h4">PLAN FOLLOW UP SEARCH</span>
            </h6>
          </div>

          <div
            class="clearfix"
            style={{ borderBottom: "1px solid #037592" }}
          ></div>

          <div class="row">
            <div class="col-md-12 col-sm-12 pt-3 provider-form">
              <form onSubmit={(event) => this.handleSearch(event)}>
                <div class="row">
                  <div class="col-md-12 m-0 p-0 float-right">
                    <div class="row">
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 pr-1 float-left">
                          <label for="Account">Reason</label>
                        </div>
                        <div class="col-md-8 pl-1 p-0 m-0 float-left">
                          <select
                            style={{padding:"6px" , fontSize:"12px"}}
                            class="provider-form w-100 form-control-user"
                            name="reasonID"
                          id="reasonID"
                          value={this.state.searchModel.reasonID}
                          onChange={this.handleChange}
                          >
                             {this.state.resData.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.description}
                            </option>
                          ))}
                          </select>
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 pr-1 float-left">
                          <label for="mm/dd/yyyy">Action</label>
                        </div>
                        <div class="col-md-8 pl-0 p-0 m-0 float-left">
                          <select
                            style={{padding:"6px" , fontSize:"12px"}}
                            class="provider-form w-100 form-control-user"
                            name="actionID"
                            id="actionID"
                            value={this.state.searchModel.actionID}
                            onChange={this.handleChange}
                          >
                             {this.state.actionData.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.description}
                            </option>
                          ))}
                          </select>
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Group</label>
                        </div>
                        <div class="col-md-8 pl-0 p-0 m-0 float-left">
                          <select
                            style={{padding:"6px" , fontSize:"12px"}}
                            class="provider-form w-100 form-control-user"
                            name="groupID"
                          id="groupID"
                          value={this.state.searchModel.groupID}
                          onChange={this.handleChange}
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
                    <div class="row mt-3">
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="AppliedAmount">Plan</label>
                        </div>
                        <div class="col-md-8 p-0 pl-1 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Plan"
                            name="planName"
                          id="planName"
                          value={this.state.searchModel.planName}
                          onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="UnAppliedAmount">Visit#</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Visit#"
                            name="visitID"
                          id="visitID"
                          value={this.state.searchModel.visitID}
                          onChange={ this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="UnAppliedAmount">Account#</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Account#"
                            name="accountNum"
                            id="accountNum"
                            value={this.state.searchModel.accountNum}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                    </div>
                    <div class="row mt-3">
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                          DOS
                          </label>
                        </div>
                        <div class="col-md-8 pl-1 p-0 m-0 float-left">
                          <input
                            type="date"
                            class="provider-form w-100 form-control-user"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="dos"
                            id="dos"
                            value={
                              this.state.searchModel.dos == null
                                ? ""
                                : this.state.searchModel.dos
                            }
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                        {this.state.validationModel.dobValField}
                        </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 pr-1 float-left">
                          <label for="firstName">Submit Date</label>
                        </div>
                        <div class="col-md-8 pl-0 p-0 m-0 float-left">
                          <input
                            type="date"
                            class="provider-form w-100 form-control-user"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="submitDate"
                            id="submitDate"
                            value={
                              this.state.searchModel.submitDate == null
                                ? ""
                                : this.state.searchModel.submitDate
                            }
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                        {this.state.validationModel.submitDateValField}
                        </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 pr-1 float-left">
                          <label for="firstName">Tickle Date</label>
                        </div>
                        <div class="col-md-8 col-sm-8 p-0 m-0 float-left">
                          <input
                            type="date"
                            class="provider-form w-100 form-control-user"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="tickleDate"
                            id="tickleDate"
                            value={
                              this.state.searchModel.tickleDate == null
                                ? ""
                                : this.state.searchModel.tickleDate
                            }
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                        {this.state.validationModel.tickleDatevalField}
                        </div>
                      </div>
                    </div>
                    <div class="row mt-3">
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                          From Date
                          </label>
                        </div>
                        <div class="col-md-8 pl-1 p-0 m-0 float-left">
                          <input
                            type="date"
                            class="provider-form w-100 form-control-user"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="fromDate"
                            id="fromDate"
                            value={
                              this.state.searchModel.fromDate == null
                                ? ""
                                : this.state.searchModel.fromDate
                            }
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                        {this.state.validationModel.fromDateValField}
                          {this.state.validationModel.fromDateFDValField}
                          {this.state.validationModel.selectFromDateValField}
                        </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 pr-1 float-left">
                          <label for="firstName">To Date</label>
                        </div>
                        <div class="col-md-8 pl-0 p-0 m-0 float-left">
                          <input
                            type="date"
                            class="provider-form w-100 form-control-user"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="toDate"
                            id="toDate"
                            value={
                              this.state.searchModel.toDate == null
                                ? ""
                                : this.state.searchModel.toDate
                            }
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                        {this.state.validationModel.toDateValField}
                          {this.state.validationModel.toDateFDValField}
                        </div>
                      </div>
                    
                    </div>
                  </div>

                  <div class="col-lg-12 mt-4 text-center">
                    <button
                      class="btn btn-primary mr-2 mb-3"
                      type="submit"
                      disabled={this.isDisabled(this.props.rights.search)}
                    >
                      Search
                    </button>
                    <button
                      class="btn btn-primary mr-2 mb-3"
                      onClick={(event) => this.clearFields(event)}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div class="clearfix"></div>
              </form>
            </div>
          </div>

          <div className="row">
            <div className="card mb-4" style={{ width: "100%" }}>
            <GridHeading
                  Heading="PLAN FOLLOW UP SEARCH RESULT"
                  disabled={this.isDisabled(this.props.rights.export)}
                  dataObj={this.state.searchModel}
                  url={this.url}
                  methodName="Export"
                  methodNamePdf="ExportPdf"
                  length={this.state.data.length}
                ></GridHeading>
              <div className="card-body">
                <div className="table-responsive">
                  <div
                    style={{ overflowX: "hidden" }}
                    id="dataTable_wrapper"
                    className="dataTables_wrapper dt-bootstrap4"
                  >
                    <MDBDataTable
                     responsive={true}
                     striped
                     bordered
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
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
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
          import: state.loginInfo.rights.planFollowupExport,
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

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(PlanFollowup)
);
