import React, { Component } from "react";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import GPopup from "./GPopup";

import NewPatientSheet from "../components/NewPatientSheet";
import { MDBDataTable, MDBBtn } from "mdbreact";
import GridHeading from "./GridHeading";
import Swal from "sweetalert2";

import SearchHeading from "./SearchHeading";
import Label from "./Label";
import Input from "./Input";
import axios from "axios";
import $ from "jquery";

import NewLocation from "./NewLocation";
import NewProvider from "./NewProvider";

//Redux Actions
import { bindActionCreators } from "redux";

import { connect } from "react-redux";

import { selectTabPageAction } from "../actions/selectTabAction";

import { loginAction } from "../actions/LoginAction";

import { selectTabAction } from "../actions/selectTabAction";

import Hotkeys from "react-hot-keys";

class PatientSheet extends Component {
  constructor(props) {
    super(props);

    this.AddPatientSheet = process.env.REACT_APP_URL + "/DataMigration/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.searchModel = {
      firstName: "",
      lastName: "",
      externalPatientID: "",
      accountNumber: "",
      status: "",
      fileName: "",
      entryDateFrom: "",
      entryDateTo: "",
    };

    this.state = {
      searchModel: this.searchModel,
      popupName: "",
      showPopup: false,
      data: [],
      loading: false,
      table: [],
      Columns: [
        {
          label: "ENTRY DATE",
          field: "entryDate",
          sort: "asc",
          width: 100,
        },
        {
          label: "FILE NAME",
          field: "fileName",
          sort: "asc",
          width: 100,
        },
        {
          label: "EXTERNAL PATIENT ID",
          field: "externalPatientID",
          sort: "asc",
          width: 150,
        },
        {
          label: "ACCOUNT #",
          field: "accountNumber",
          sort: "asc",
          width: 100,
        },
        {
          label: "STATUS",
          field: "status",
          sort: "asc",
          width: 100,
        },
        {
          label: "LAST NAME",
          field: "lastName",
          sort: "asc",
          width: 150,
        },
        {
          label: "FIRST NAME",
          field: "firstName",
          sort: "asc",
          width: 270,
        },
        {
          label: "DOB",
          field: "dob",
          sort: "asc",
          width: 200,
        },
        {
          label: "PRIMARY SUBSCRIBER ID",
          field: "primaryPatientPlanID",
          sort: "asc",
          width: 100,
        },
        {
          label: "PRIMARY PAYER",
          field: "primaryPayer",
          sort: "asc",
          width: 100,
        },
        {
          label: "SECONDDARY SUBSCRIBER ID",
          field: "secondaryPatientPlanID",
          sort: "asc",
          width: 100,
        },
        {
          label: "SECONDDARY PAYER",
          field: "secondaryPayer",
          sort: "asc",
          width: 100,
        },
        {
          label: "PROVIDER",
          field: "providerName",
          sort: "asc",
          width: 100,
        },
        {
          label: "LOCATION",
          field: "locationName",
          sort: "asc",
          width: 150,
        },
      ],
    };

    this.openPopUp = this.openPopUp.bind(this);
    this.openNewPatientSheetPopUp = this.openNewPatientSheetPopUp.bind(this);
    this.closeNewPatientSheetPopUp = this.closeNewPatientSheetPopUp.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.searchPatientSheet = this.searchPatientSheet.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.isNull = this.isNull.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    console.log("test:onKeyDown", keyName, e, handle);

    if (keyName == "alt+n") {
      // alert("search key")
      this.openNewPatientSheetPopUp(0);
      console.log(e.which);
    } else if (keyName == "alt+s") {
      this.searchPatientSheet(e);
      console.log(e.which);
    } else if (keyName == "alt+c") {
      // alert("clear skey")
      this.clearFields(e);
      console.log(e.which);
    }

    this.setState({
      output: `onKeyDown ${keyName}`,
    });
  }

  onKeyUp(keyName, e, handle) {
    console.log("test:onKeyUp", e, handle);
    if (e) {
      console.log("event has been called", e);

      // this.onKeyDown(keyName, e , handle);
    }
    this.setState({
      output: `onKeyUp ${keyName}`,
    });
  }

  isNull = (value) => {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select" ||
      value === -1
    )
      return true;
    else return false;
  };

  componentWillMount() {
    this.setState({
      table: {
        columns: this.state.Columns,
        rows: this.state.data,
      },
    });
  }

  clearFields = (event) => {
    this.setState({
      searchModel: this.searchModel,
    });
  };

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  ///////////////------------OPEN/CLOSE POP UPs

  openNewPatientSheetPopUp(event, id) {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
    console.log(id);
  }

  closeNewPatientSheetPopUp = () => {
    $("#myModal").hide();
    this.setState({ showPopup: false });
  };

  openPopUp = (name, id, planID) => {
    this.setState({ popupName: name, id: id, planID: planID });
  };

  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  ///////////////------------CHANGE HANDLERS

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]:
          event.target.value == "Please Select"
            ? null
            : event.target.value.toUpperCase(),
      },
    });
    console.log(this.state.searchModel);
  };

  ///////////////------------SEARCH PATIENT DATA

  async searchPatientSheet(e) {
    e.preventDefault();
    this.setState({ loading: true });
    console.log("Search model", this.state.searchModel);
    await axios
      .post(
        this.AddPatientSheet + "FindExternalPatients",
        this.state.searchModel,
        this.config
      )
      .then((response) => {
        let newList = [];
        let STATUS = "";
        let PPID = "";
        let SPID = "";
        let AccountNum = "";

        response.data.map((row, i) => {
          ///////////////------------STATUS HANDLING

          if (row.status == "A") {
            STATUS = row.status + "DDED";
          } else if (row.status == "E") {
            STATUS = row.status + "XTERNAL";
          } else if (row.status == "D") {
            STATUS = row.status + "UPLICATE";
          }

          ///////////////------------PRIMARY PATIENT ID EXCEPTION

          if (!this.isNull(row.primaryPatientPlanID)) {
            if (!this.isNull(row.primarySubscriberID)) {
              PPID = (
                <MDBBtn
                  className="gridBlueBtn"
                  onClick={() =>
                    this.openPopUp(
                      "patientplan",
                      row.patientID,
                      row.primaryPatientPlanID
                    )
                  }
                >
                  {row.primarySubscriberID}
                </MDBBtn>
              );
            } else if (this.isNull(row.primarySubscriberID)) {
              PPID = (
                <MDBBtn
                  className="gridBlueBtn"
                  onClick={() =>
                    this.openPopUp(
                      "patientplan",
                      row.patientID,
                      row.primaryPatientPlanID
                    )
                  }
                >
                  ---
                </MDBBtn>
              );
            }
          } else if (!this.isNull(row.primarySubscriberID)) {
            PPID = row.primarySubscriberID;
          } else {
            PPID = null;
          }

          ///////////////------------SECONDARY PATIENT ID EXCEPTION

          if (!this.isNull(row.secondaryPatientPlanID)) {
            if (!this.isNull(row.secondarySubscriberID)) {
              SPID = (
                <MDBBtn
                  className="gridBlueBtn"
                  onClick={() =>
                    this.openPopUp(
                      "patientplan",
                      row.patientID,
                      row.secondaryPatientPlanID
                    )
                  }
                >
                  {row.secondarySubscriberID}
                </MDBBtn>
              );
            } else if (this.isNull(row.secondarySubscriberID)) {
              SPID = (
                <MDBBtn
                  className="gridBlueBtn"
                  onClick={() =>
                    this.openPopUp(
                      "patientplan",
                      row.patientID,
                      row.secondaryPatientPlanID
                    )
                  }
                >
                  ---
                </MDBBtn>
              );
            }
          } else if (!this.isNull(row.secondarySubscriberID)) {
            SPID = row.secondarySubscriberID;
          } else {
            SPID = null;
          }

          ///////////////------------ACCOUNT NUMBER EXCEPTION

          if (!this.isNull(row.accountNumber)) {
            AccountNum = (
              <MDBBtn
                className="gridBlueBtn"
                onClick={() => this.openPopUp("patient", row.patientID, 0)}
              >
                {row.accountNumber}
              </MDBBtn>
            );
          } else {
            AccountNum = null;
          }

          newList.push({
            entryDate: row.entryDate ? row.entryDate.slice(0, 10) : "",
            fileName: row.fileName,
            externalPatientID: row.externalPatientID,
            accountNumber: AccountNum,
            status: STATUS,
            lastName: row.lastName,
            firstName: row.firstName,
            dob: row.dob,
            primaryPatientPlanID: PPID,
            primaryPayer:
              this.isNull(row.primaryPatientPlanID) &&
              row.primaryPayer != null ? (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {row.primaryPayer}
                </span>
              ) : (
                row.primaryPayer
              ),
            secondaryPatientPlanID: SPID,
            secondaryPayer:
              this.isNull(row.secondaryPatientPlanID) &&
              row.secondaryPayer != null ? (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {row.secondaryPayer}
                </span>
              ) : (
                row.secondaryPayer
              ),
            providerName: (
              <MDBBtn
                className="gridBlueBtn"
                onClick={() =>
                  this.openPopUp("providerName", row.providerID, 0)
                }
              >
                {row.providerName}
              </MDBBtn>
            ),
            locationName: (
              <MDBBtn
                className="gridBlueBtn"
                onClick={() =>
                  this.openPopUp("locationName", row.locationID, 0)
                }
              >
                {row.locationName}
              </MDBBtn>
            ),
          });
        });

        console.log("NewList", newList);

        this.setState({
          data: newList,
          loading: false,
          table: {
            columns: this.state.Columns,
            rows: newList,
          },
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });
  }

  processPatients(event, id) {
    event.preventDefault();
    this.setState({ loading: true });
    axios
      .post(
        this.AddPatientSheet + "ProcessRemainingPatientPlan",
        {},
        this.config
      )
      .then((response) => {
        this.setState({
          loading: false,
        });
        Swal.fire("Processed Successfully", "", "success").then((sres) => {});
      })
      .catch((error) => {
        this.setState({ loading: false });

        try {
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 401) {
                Swal.fire("Unauthorized Access", "", "error");
                return;
              } else if (error.response.status == 404) {
                Swal.fire("Not Found", "Failed With Status Code 404", "error");
                return;
              } else if (error.response.status == 400) {
                Swal.fire("Not Found", error.response.data, "error");
                return;
              }
            }
          } else {
            Swal.fire("Something went Wrong", "", "error");
            return;
          }
        } catch {}
      });
  }

  render() {
    ///////////////------------DROP-DOWN OPTIONS

    const StatusOptions = [
      { value: null, display: "Please Select" },
      { value: "A", display: "Added" },
      { value: "E", display: "External" },
      { value: "D", display: "Duplicate" },
      { value: "F", display: "Error Messages" },
    ];

    ///////////////------------POP UP SELECTION

    let popup = "";
    if (this.state.showPopup) {
      document.body.style.overflow = "hidden";
      popup = (
        <NewPatientSheet
          onClose={this.closeNewPatientSheetPopUp}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewPatientSheet>
      );
    } else if (this.state.popupName === "locationName") {
      document.body.style.overflow = "hidden";
      popup = (
        <NewLocation
          onClose={() => this.closePopup}
          id={this.state.id}
        ></NewLocation>
      );
    } else if (this.state.popupName === "providerName") {
      document.body.style.overflow = "hidden";
      popup = (
        <NewProvider
          onClose={() => this.closePopup}
          id={this.state.id}
        ></NewProvider>
      );
    } else if (this.state.popupName === "patient") {
      document.body.style.overflow = "hidden";
      popup = (
        <GPopup
          onClose={() => this.closePopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.popupName === "patientplan") {
      document.body.style.overflow = "hidden";
      popup = (
        <GPopup
          onClose={() => this.closePopup}
          id={this.state.id}
          popupName={this.state.popupName}
          planID={this.state.planID}
        ></GPopup>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
      document.body.style.overflow = "visible";
    }

    ///////////////------------LOADING SPINER

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
        <div className="container-fluid">
          <div className="card mb-4 bg-info">
            <div className="card-body">
              <div className="table-responsive">
                {spiner}
                <h6 className="m-0 font-weight-bold text-primary th1 ">
                  PATIENT SHEET SEARCH
                  <button
                    href=""
                    style={{ marginTop: "-7px", marginRight: "10px" }}
                    className="float-right btn-search btn-primary btn-user"
                    onClick={(event) => this.openNewPatientSheetPopUp(event, 0)}
                  >
                    Add New
                  </button>
                  <button
                    href=""
                    style={{ marginTop: "-7px", marginRight: "10px" }}
                    className="float-right btn-search btn-primary btn-user"
                    onClick={(event) => this.processPatients(event, 0)}
                  >
                    Process
                  </button>
                </h6>
                <div className="search-form">
<form onSubmit={this.searchPatientSheet}>
                  <div className="row">
                    <div className="col-lg-6">
                      <br></br>
                      <div className="row">
                        <div className="col-lg-12">
                          <label>File Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fileName"
                            id="fileName"
                            value={this.state.searchModel.fileName}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div className="col-lg-12">
                          <label>Account #:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="accountNumber"
                            id="accountNumber"
                            value={this.state.searchModel.accountNumber}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <br></br>
                          <label>External Patient ID:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="externalPatientID"
                            id="externalPatientID"
                            value={this.state.searchModel.externalPatientID}
                            onChange={this.handleChange}
                          />
                        </div>

                        <div className="col-lg-12">
                          <label>Status:</label>
                          <select
                            style={{
                              borderRadius: "6px",
                              border: "1px solid rgb(125, 128, 134)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "35px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "98%",
                              paddingLeft: "2px",
                              paddingBottom: "6px",
                              paddingTop: "6px",
                              color: "rgb(67, 75, 93",
                            }}
                            name="status"
                            id="status"
                            value={this.state.searchModel.status}
                            onChange={this.handleChange}
                          >
                            {StatusOptions.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Last Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            id="lastName"
                            value={this.state.searchModel.lastName}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div className="col-lg-12">
                          <label>Entry Date From:</label>
                          <input
                            type="date"
                            className="form-control"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="entryDateFrom"
                            id="entryDateFrom"
                            value={this.state.searchModel.entryDateFrom}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>First Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            id="firstName"
                            value={this.state.searchModel.firstName}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Entry Date To:</label>
                          <input
                            type="date"
                            className="form-control"
                            type="date"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="entryDateTo"
                            id="entryDateTo"
                            value={this.state.searchModel.entryDateTo}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="clearfix"></div>
                  <br></br>
                  <div className="col-lg-12 text-center">
                  <button
                  type="submit"                   
                  className="btn-search btn-primary btn-user mr-2"
                    // onClick={(event) => this.searchPatientSheet(event)}
                  >
                    Search
                  </button>
                  <button
                    type="button"   
                    className="btn-search btn-primary btn-user mr-2"
                    onClick={this.clearFields}
                  >
                    clear
                  </button>

                   
                  </div>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>

        <br></br>
        {/* Grid Data */}
        <div className="container-fluid">
          <div className="card mb-4">
            <GridHeading
              Heading="PATIENT SEARCH RESULT"
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
                  id="dataTable_wrapper"
                  className="dataTables_wrapper dt-bootstrap4"
                >
                  <MDBDataTable
                    responsive={true}
                    striped
                    bordered
                    searching={false}
                    data={this.state.table}
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
          search: state.loginInfo.rights.clientSearch,
          add: state.loginInfo.rights.clientCreate,
          update: state.loginInfo.rights.clientEdit,
          delete: state.loginInfo.rights.clientDelete,
          export: state.loginInfo.rights.clientExport,
          import: state.loginInfo.rights.clientImport,
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

export default connect(mapStateToProps, matchDispatchToProps)(PatientSheet);
