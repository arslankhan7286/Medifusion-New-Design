import React, { Component } from "react";

import { MDBDataTable, MDBBtn } from "mdbreact";
import { withRouter } from "react-router-dom";

import Label from "./Label";
import Input from "./Input";
import { isNullOrUndefined } from "util";

import SearchHeading from "./SearchHeading";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import axios from "axios";
import moment from "moment";
import { saveAs } from "file-saver";

import $ from "jquery";

import GridHeading from "./GridHeading";
import NewPatientPlanModel from "./NewPatientPlanModel";
import GPopup from "./GPopup";
import PatientStatement from "./PatientStatement";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import Swal from "sweetalert2";

export class PatientFollowUp extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/PatientFollowup/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.searchModel = {
      reasonID: "",
      actionID: "",
      groupID: "",

      practice: "",
      planName: "",
      visitID: "",
      patientAccount: "",
      planID: "",
      fromDate: "",
      toDate: "",
      tickleDate: "",
      status: "All",
    };

    this.statementModel = {
      patientFollowUpID: [],
    };

    //Validation Model
    this.validationModel = {
      fromDateValField: "",
      fromDateFDValField: "",
      selectFromDateValField: "",
      toDateValField: "",
      toDateFDValField: "",
      validation: false,
    };

    this.state = {
      searchModel: this.searchModel,
      statementModel: this.statementModel,
      validationModel: this.validationModel,
      data: [],
      id: 0,
      resData: [],
      actionData: [],
      groupData: [],
      showPopup: false,
      isChecked: false,
      initialData: [],
    };

    this.selectedfollowup = [];
    this.searchPatientFollowup = this.searchPatientFollowup.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.openPatientFollowupPopup = this.openPatientFollowupPopup.bind(this);
    this.closePatientFollowupPopup = this.closePatientFollowupPopup.bind(this);
    this.openPatientPopup = this.openPatientPopup.bind(this);
    this.closePatientPopup = this.closePatientPopup.bind(this);
    this.patientFollowupSearch = this.patientFollowupSearch.bind(this);
    // this.openstatementPopup = this.openstatementPopup.bind(this);
    this.closestatementPopup = this.closestatementPopup.bind(this);
    this.selectALL = this.selectALL.bind(this);
  }

  UNSAFE_componentWillMount() {
    try {
      if (this.props.location.query.status) this.patientFollowupSearch();
    } catch {}

    axios
      .get(this.url + "GetProfiles", this.config)
      .then((response) => {
        this.setState({
          resData: response.data.reason,
          groupData: response.data.group,
          actionData: response.data.action,
        });
      })
      .catch((error) => {});
  }

  openPatientFollowupPopup = (event, name, id) => {
    event.preventDefault();
    this.setState({ popupName: name, id: id });
  };

  closePatientFollowupPopup() {
    $("#patientPlanModal").hide();
    this.setState({ popupName: "", id: 0 });
  }

  clearFields = (event) => {
    var myVal = { ...this.validationModel };
    myVal.fromDateValField = "";
    myVal.fromDateFDValField = "";
    myVal.selectFromDateValField = "";
    myVal.toDateValField = "";
    myVal.toDateFDValField = "";
    this.setState({
      searchModel: this.searchModel,
      validationModel: myVal,
      selectedAll: false,
    });
    this.selectedfollowup = [];

    this.patientFollowupSearch();
  };

  handleChange = (event) => {
    var Evalue = event.target.value;

    if (event.target.name == "status") {
      // if (Evalue == "New") {
      //   Evalue = null;
      // } else {
      Evalue = Evalue;
      // }
    } else {
      Evalue = Evalue.toUpperCase();
    }
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: Evalue,
      },
    });
  };

  openPatientPopup(event, name, id) {
    event.preventDefault();
    this.setState({ popupName: name, patientPopup: true, id: id });
  }

  closePatientPopup() {
    this.setState({ popupName: "", patientPopup: false });
  }

  async patientFollowupSearch() {
    this.selectedfollowup = [];
    await this.setState({ loading: true });

    await axios
      .post(
        this.url + "FindPatientFollowUp",
        this.state.searchModel,
        this.config
      )
      .then((response) => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            ischeck: (
              <input
                style={{ width: "20px", height: "20px" , marginLeft:"7px" }}
                type="checkbox"
                id={row.patientFollowUpID}
                name={row.patientFollowUpID}
                onChange={this.toggleCheck}
                checked={this.isChecked(row.patientFollowUpID)}
              />
            ),
            patientFollowUpID: (
              <a
                href=""
                onClick={(event) =>
                  this.openPatientFollowupPopup(event, "patientPlan", row.id)
                }
              >
                {row.patientFollowUpID}
              </a>
            ),
            followUpDate: row.followUpDate,
            //patientAccount: row.patientAccount,
            patientAccount: (
              <a
                href=""
                onClick={(event) =>
                  this.openPatientFollowupPopup(event, "patient", row.patientID)
                }
              >
                {" "}
                {row.patientAccount}
              </a>
            ),
            patientName: row.patientName,

            tickleDate: row.tickleDate,
            patientAmount: row.patientAmount,
            status: row.status,
            action: row.action,
            reason: row.reason,
            group: row.group,
          });
        });
        this.setState({
          data: newList,
          initialData: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
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

  exportPdf = () => {
    this.setState({ loading: true });
    console.log("Hello");
    if (this.state.initialData.length > 0) {
      console.log("Hello");
      axios
        .post(this.url + "ExportPdf", this.state.searchModel, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + this.props.loginObject.token,
            Accept: "*/*",
          },
          responseType: "blob",
        })
        .then(function (res) {
          var blob = new Blob([res.data], {
            type: "application/pdf",
          });

          saveAs(blob, "ExportedData.pdf");
          this.setState({ loading: false });
        })
        .catch((error) => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false });
      Swal.fire("Perform The Search First", "", "error");
    }
  };

  exportExcel = () => {
    this.setState({ loading: true });
    if (this.state.initialData.length > 0) {
      axios
        .post(this.url + "Export", this.state.searchModel, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + this.props.loginObject.token,
            Accept: "*/*",
          },
          responseType: "blob",
        })
        .then(function (res) {
          var blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(blob, "ExportedData.xlsx");
          this.setState({ loading: false });
        })
        .catch((error) => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false });
      Swal.fire("Perform The Search First", "", "error");
    }
  };

  searchPatientFollowup = (e) => {
    e.preventDefault();
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

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
      this.setState({ validationModel: myVal, loading: false });
      Swal.fire(
        "Something Wrong",
        "Please Select All Fields Properly",
        "error"
      );
      return;
    }

    axios
      .post(
        this.url + "FindPatientFollowUp",
        this.state.searchModel,
        this.config
      )
      .then((response) => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            ischeck: (
              <input
              style={{ width: "20px", height: "20px" , marginLeft:"7px" }}
                type="checkbox"
                id={row.patientFollowUpID}
                name={row.patientFollowUpID}
                onChange={this.toggleCheck}
                checked={this.isChecked(row.patientFollowUpID)}
              />
            ),
            patientFollowUpID: (
              <a
                href=""
                onClick={(event) =>
                  this.openPatientFollowupPopup(event, "patientPlan", row.id)
                }
              >
                {row.patientFollowUpID}
              </a>
            ),
            followUpDate: row.followUpDate,
            //patientAccount: row.patientAccount,
            patientAccount: (
              <a
                href=""
                onClick={(event) =>
                  this.openPatientFollowupPopup(event, "patient", row.patientID)
                }
              >
                {" "}
                {row.patientAccount}
              </a>
            ),
            patientName: row.patientName,

            tickleDate: row.tickleDate,
            patientAmount: row.patientAmount,
            status: row.status,
            action: row.action,
            reason: row.reason,
            group: row.group,
          });
        });
        this.setState({
          data: newList,
          loading: false,
          initialData: response.data,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  // openstatementPopup = id => {
  //   this.setState({ showPopup: true, id: id });
  // };

  closestatementPopup = () => {
    $("#PatientStatement").hide();
    this.setState({ showPopup: false, selectedAll: false });
    this.selectedfollowup = [];
    // this.state.selectedAll = false;
    this.patientFollowupSearch();
  };

  val(value) {
    if (isNullOrUndefined(value)) return " ";
    else return value;
  }

  checkedPatient = (e) => {
    if (this.selectedfollowup.length == 0) {
      Swal.fire({
        type: "error",
        text: "Please Select Records",
      });
      return;
    } else {
      this.setState({
        showPopup: true,
        loading: false,
      });
    }
  };

  isChecked = (id) => {
    var checked = this.selectedfollowup.filter((name) => name == id)[0]
      ? true
      : false;
    return checked;
  };

  toggleCheck = (e) => {
    let checkedArr = this.selectedfollowup;
    let newList = [];

    checkedArr.filter((name) => name === Number(e.target.id))[0]
      ? (checkedArr = checkedArr.filter((name) => name !== Number(e.target.id)))
      : checkedArr.push(Number(e.target.id));

    this.selectedfollowup = checkedArr;
    this.state.initialData.map((row, i) => {
      newList.push({
        ischeck: (
          <input
          style={{ width: "20px", height: "20px" , marginLeft:"7px" }}
            type="checkbox"
            id={row.patientFollowUpID}
            name={row.patientFollowUpID}
            onChange={this.toggleCheck}
            checked={this.isChecked(row.patientFollowUpID)}
          />
        ),
        patientFollowUpID: (
          <a
            href=""
            onClick={(event) =>
              this.openPatientFollowupPopup(event, "patientPlan", row.id)
            }
          >
            {row.patientFollowUpID}
          </a>
        ),
        followUpDate: row.followUpDate,
        //patientAccount: row.patientAccount,
        patientAccount: (
          <a
            href=""
            onClick={(event) =>
              this.openPatientFollowupPopup(event, "patient", row.patientID)
            }
          >
            {" "}
            {row.patientAccount}
          </a>
        ),
        patientName: row.patientName,

        tickleDate: row.tickleDate,
        patientAmount: row.patientAmount,
        status: row.status,
        action: row.action,
        reason: row.reason,
        group: row.group,
      });
    });

    this.setState({
      data: newList,
      statementModel: {
        ...this.state.statementModel,
        patientFollowUpID: this.selectedfollowup,
      },
    });
  };

  selectALL = (e) => {
    let newValue = !this.state.selectedAll;
    this.setState({ ...this.state, selectedAll: newValue });

    let newList = [];
    this.selectedfollowup = [];
    this.state.initialData.map((row, i) => {
      if (newValue === true)
        this.selectedfollowup.push(Number(row.patientFollowUpID));
      newList.push({
        ischeck: (
          <input
          style={{ width: "20px", height: "20px" , marginLeft:"7px" }}
            type="checkbox"
            id={row.patientFollowUpID}
            name={row.patientFollowUpID}
            onChange={this.toggleCheck}
            checked={this.isChecked(row.patientFollowUpID)}
          />
        ),
        patientFollowUpID: (
          <a
            href=""
            onClick={(event) =>
              this.openPatientFollowupPopup(event, "patientPlan", row.id)
            }
          >
            {row.patientFollowUpID}
          </a>
        ),
        followUpDate: row.followUpDate,
        //patientAccount: row.patientAccount,
        patientAccount: (
          <a
            href=""
            onClick={(event) =>
              this.openPatientFollowupPopup(event, "patient", row.patientID)
            }
          >
            {" "}
            {row.patientAccount}
          </a>
        ),
        patientName: row.patientName,

        tickleDate: row.tickleDate,
        patientAmount: row.patientAmount,
        status: row.status,
        action: row.action,
        reason: row.reason,
        group: row.group,
      });
    });

    this.setState({
      data: newList,
      statementModel: {
        ...this.state.statementModel,
        patientFollowUpID: this.selectedfollowup,
      },
    });
  };

  render() {
    const data = {
      columns: [
        {
          label: (
            // <div class="lblChkBox">
            <input
              style={{ width: "20px", height: "20px" }}
              type="checkbox"
              id="selectAll"
              name="selectAll"
              checked={this.state.selectedAll == true ? true : false}
              onChange={this.selectALL}
            />
            // <label for="selectAll">
            //   <span></span>
            // </label>
            // </div>
          ),
          field: "ischeck",
          sort: "",
          width: 50,
        },
        {
          label: "FOLLOW UP #",
          field: "patientFollowUpID",
          sort: "asc",
          width: 250,
        },
        {
          label: "FOLLOW UP DATE",
          field: "followUpDate",
          sort: "asc",
          width: 250,
        },
        {
          label: "ACCOUNT #",
          field: "patientAccount",
          sort: "asc",
          width: 250,
        },
        {
          label: "PATIENT NAME",
          field: "patientName",
          sort: "asc",
          width: 250,
        },
        {
          label: "TICKLE DATE",
          field: "tickleDate",
          sort: "asc",
          width: 250,
        },
        {
          label: "PATIENT AMOUNT",
          field: "patientAmount",
          sort: "asc",
          width: 250,
        },
        {
          label: "STATUS",
          field: "status",
          sort: "asc",
          width: 250,
        },
        {
          label: "ACTION",
          field: "action",
          sort: "asc",
          width: 250,
        },
        {
          label: "REASON",
          field: "reason",
          sort: "asc",
          width: 250,
        },
        {
          label: "GROUP",
          field: "group",
          sort: "asc",
          width: 250,
        },
      ],
      rows: this.state.data,
    };

    const status = [
      { value: "All", display: "All" },
      { value: "New", display: "New" },
      { value: "1st Statement Sent", display: "1st Statement Sent" },
      { value: "2nd Statement Sent", display: "2nd Statement Sent" },
      { value: "3rd Statement Sent", display: "3rd Statement Sent" },
      { value: "Collection Agency", display: "Collection Agency" },
    ];

    var fromDate = this.state.searchModel.fromDate
      ? this.state.searchModel.fromDate.slice(0, 10)
      : "";
    var toDate = this.state.searchModel.toDate
      ? this.state.searchModel.toDate.slice(0, 10)
      : "";

    var tickleDate = this.state.searchModel.tickleDate
      ? this.state.searchModel.tickleDate.slice(0, 10)
      : "";

    let popup = "";

    if (this.state.showPopup) {
      popup = (
        <PatientStatement
          onClose={this.closestatementPopup}
          id={this.state.id}
          selectedfollowup={[...this.selectedfollowup]}
          status={this.state.searchModel.status}
        ></PatientStatement>
      );
    } else if (this.state.popupName == "patientPlan") {
      popup = (
        <NewPatientPlanModel
          onClose={this.closePatientFollowupPopup}
          id={this.state.id}
        ></NewPatientPlanModel>
      );
    } else if (this.state.popupName == "patient") {
      popup = (
        <GPopup
          onClose={this.closePatientPopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
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

    return (
      <React.Fragment>
        {spiner}
        <div class="container-fluid">
          <div class="header pt-3">
            <h6>
              <span class="h4">PATIENT FOLLOW UP SEARCH</span>
            </h6>
          </div>

          <div
            class="clearfix"
            style={{ borderBottom: "1px solid #037592" }}
          ></div>

          <div class="row">
            <div class="col-md-12 col-sm-12 pt-3 provider-form">
              <form onSubmit={(event) => this.searchPatientFollowup(event)}>
                <div class="row">
                  <div class="col-md-12 m-0 p-0 float-right">
                    <div class="row">
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 pr-1 float-left">
                          <label for="Account">Reason</label>
                        </div>
                        <div class="col-md-8 pl-1 p-0 m-0 float-left">
                          <select
                            name="reasonID"
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
                            name="actionID"
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
                            name="groupID"
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
                          <label for="UnAppliedAmount">Account#</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            name="patientAccount"
                            id="patientAccount"
                            value={this.state.searchModel.patientAccount}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback"> </div>
                      </div>
                      <div class="col-md-4 mb-4 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="PostedAmount">Status</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <select
                            name="status"
                            style={{padding:"6px" , fontSize:"12px"}}
 class="provider-form w-100 form-control-user"
                            name="status"
                            id="status"
                            value={this.state.searchModel.status}
                            onChange={this.handleChange}
                          >
                            {status.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback"> </div>
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
                            value={fromDate}
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
                            value={toDate}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.toDateValField}
                          {this.state.validationModel.toDateFDValField}
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
                            value={tickleDate}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback"></div>
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
              <div className="card-header">
                <h6 className="m-0 font-weight-bold text-primary search-h">
                  PATIENT FOLLOW UP SEARCH RESULT
                

               

                <input
                  type="button"
                  name="name"
                  id="0"
                  className="export-btn-pdf"
                  value="Export PDF"
                  length={this.state.initialData.length}
                  onClick={this.exportPdf}
                />

<input
                  type="button"
                  name="name"
                  id="0"
                  className="export-btn"
                  value="Export Excel"
                  length={this.state.initialData.length}
                  onClick={this.exportExcel}
                />


                <button
                  class="float-right btn btn-primary mr-2"
                  type="button"
                  onClick={() => this.checkedPatient()}
                >
                  Statement
                </button>
              
                </h6></div>
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
          search: state.loginInfo.rights.patientFollowupSearch,
          add: state.loginInfo.rights.patientFollowupCreate,
          update: state.loginInfo.rights.patientFollowupUpdate,
          delete: state.loginInfo.rights.patientFollowupDelete,
          export: state.loginInfo.rights.patientFollowupExport,
          import: state.loginInfo.rights.patientFollowupImport,
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
  connect(mapStateToProps, matchDispatchToProps)(PatientFollowUp)
);
