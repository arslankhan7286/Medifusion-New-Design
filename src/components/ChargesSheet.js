import React, { Component } from "react";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import GPopup from "./GPopup";

import NewChargesSheet from "./NewChargesSheet";
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
class ChargesSheet extends Component {
  constructor(props) {
    super(props);

    this.AddChargesSheet = process.env.REACT_APP_URL + "/DataMigration/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.searchModel = {
      externalPatientID: "",
      accountNumber: "",
      paymentProcessed: "",
      fileName: "",
      dosTo: "",
      dosFrom: "",
      entryDateFrom: "",
      entryDateTo: "",
      status: "",
      errorMessage: "",
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
          label: "FILE NAME",
          field: "fileName",
          sort: "asc",
          width: 100,
        },
        {
          label: "ENTRY DATE",
          field: "entryDate",
          sort: "asc",
          width: 100,
        },
        {
          label: "PATIENT NAME",
          field: "patientName",
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
          label: "PROVIDER",
          field: "provider",
          sort: "asc",
          width: 100,
        },
        {
          label: "INSURANCE NAME",
          field: "insuranceName",
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
          width: 270,
        },
        {
          label: "CPT",
          field: "cpt",
          sort: "asc",
          width: 200,
        },
        {
          label: "ICD",
          field: "icd",
          sort: "asc",
          width: 200,
        },
        {
          label: "MODIFIERS",
          field: "modifiers",
          sort: "asc",
          width: 100,
        },
        {
          label: "POS",
          field: "pos",
          sort: "asc",
          width: 100,
        },
        {
          label: "CHARGES",
          field: "charges",
          sort: "asc",
          width: 100,
        },
        {
          label: "INS. PAY",
          field: "insurancePayment",
          sort: "asc",
          width: 100,
        },
        {
          label: "PAT. PAID",
          field: "patientPayment",
          sort: "asc",
          width: 100,
        },
        {
          label: "ADJ",
          field: "adjustments",
          sort: "asc",
          width: 100,
        },
        {
          label: "PAYMENT PROCESSED",
          field: "paymentProcessed",
          sort: "asc",
          width: 100,
        },
        {
          label: "ERROR MESSAGE",
          field: "errorMessage",
          sort: "asc",
          width: 150,
        },
      ],
    };

    this.openPopUp = this.openPopUp.bind(this);
    this.openNewChargesSheetPopUp = this.openNewChargesSheetPopUp.bind(this);
    this.closeNewChargesSheetPopUp = this.closeNewChargesSheetPopUp.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.searchChargesSheet = this.searchChargesSheet.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  openNewChargesSheetPopUp(event, id) {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
    console.log(id);
  }

  closeNewChargesSheetPopUp = () => {
    $("#myModal").hide();
    this.setState({ showPopup: false });
  };

  openPopUp = (name, id) => {
    this.setState({ popupName: name, id: id });
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

  async searchChargesSheet(event) {
    event.preventDefault();
    this.setState({ loading: true });
    console.log("Search model", this.state.searchModel);
    await axios
      .post(
        this.AddChargesSheet + "FindExternalCharges",
        this.state.searchModel,
        this.config
      )
      .then((response) => {
        console.log("Response", response);
        let newList = [];
        let AccountNum = "";
        let Provider = "";
        let visitID = "";

        response.data.map((row, i) => {
          console.log("charges data received ROW", row);

          ///////////////------------ACCOUNT NUMBER EXCEPTION

          if (!this.isNull(row.accountNum)) {
            AccountNum = (
              <MDBBtn
                className="gridBlueBtn"
                onClick={() => this.openPopUp("patient", row.patientID)}
              >
                {row.accountNum}
              </MDBBtn>
            );
          } else {
            AccountNum = null;
          }

          ///////////////------------PROVIDER EXCEPTION

          if (!this.isNull(row.patientID)) {
            Provider = (
              <MDBBtn
                className="gridBlueBtn"
                onClick={() => this.openPopUp("providerName", row.providerID)}
              >
                {row.provider}
              </MDBBtn>
            );
          } else if (!this.isNull(row.provider)) {
            Provider = row.provider;
          } else {
            Provider = null;
          }

          ///// Visit ID popup
          if (!this.isNull(row.visitID)) {
            visitID = (
              <MDBBtn
                className="gridBlueBtn"
                onClick={() => this.openPopUp("visit", row.visitID)}
              >
                {row.visitID}
              </MDBBtn>
            );
          } else {
            visitID = null;
          }

          newList.push({
            fileName: row.fileName,
            entryDate: row.entryDate,
            patientName: row.externalPatientName,
            externalPatientID: row.externalPatientID,
            accountNumber: AccountNum,
            provider: Provider,
            insuranceName: row.insuranceName,
            visitID: visitID,
            dos: row.dos,
            cpt: row.cpt,
            icd: row.icd,
            modifiers: row.modifiers,
            pos: row.pos,
            charges: "$" + row.charges,
            insurancePayment: "$" + row.insurancePayment,
            patientPayment: "$" + row.patientPayment,
            adjustments: row.adjustments,
            paymentProcessed: row.paymentProcessed,
            errorMessage: row.errorMessage,
          });
        });

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
  processPayments(event, id) {
    event.preventDefault();
    this.setState({ loading: true });
    axios
      .post(this.AddChargesSheet + "AddPaymentChecks", {}, this.config)
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

  reProcessHandler = (event) => {
    event.preventDefault()
    this.setState({ loading: true });
    axios
      .post(this.AddChargesSheet + "ProcessCharges", {}, this.config)
      .then((response) => {
        this.setState({
          loading: false,
        });
        Swal.fire(
          "Re-Processed Successfully",
          "",
          "success"
        ).then((sres) => {});
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
  };
  render() {
    ///////////////------------POP UP SELECTION

    const StatusOptions = [
      { value: null, display: "Please Select" },
      { value: "A", display: "All" },
      { value: "E", display: "Error Message" },
    ];

    const paymentProcessed = [
      { value: "", display: "All" },
      { value: "P", display: "Yes" },
      { value: "NP", display: "No" },
      { value: "F", display: "Payment Not Received" },
    ];

    let popup = "";
    if (this.state.showPopup) {
      document.body.style.overflow = "hidden";
      popup = (
        <NewChargesSheet
          onClose={this.closeNewChargesSheetPopUp}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewChargesSheet>
      );
    } else if (this.state.popupName === "providerName") {
      document.body.style.overflow = "hidden";
      popup = (
        <NewProvider onClose={this.closePopup} id={this.state.id}></NewProvider>
      );
    } else if (this.state.popupName === "patient") {
      document.body.style.overflow = "hidden";
      popup = (
        <GPopup
          onClose={this.closePopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.popupName === "visit") {
      document.body.style.overflow = "hidden";
      popup = (
        <GPopup
          onClose={this.closePopup}
          id={this.state.id}
          popupName={this.state.popupName}
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
                  CHARGES SHEET SEARCH
                  <button
                    href=""
                    style={{ marginTop: "-7px" }}
                    className="float-right btn-search btn-primary btn-user"
                    onClick={(event) => this.openNewChargesSheetPopUp(event, 0)}
                  >
                    Add New
                  </button>
                  <button
                    href=""
                    style={{
                      marginTop: "-7px",
                      marginRight: "10px",
                      width: "12%",
                    }}
                    className="float-right btn-search btn-primary btn-user"
                    onClick={(event) => this.reProcessHandler(event, 0)}
                  >
                    Re-Process
                  </button>
                  <button
                    href=""
                    style={{
                      marginTop: "-7px",
                      marginRight: "10px",
                      width: "12%",
                    }}
                    className="float-right btn-search btn-primary btn-user"
                    onClick={(event) => this.processPayments(event, 0)}
                  >
                    Process Payment
                  </button>
                </h6>
                <div className="search-form">
<form onSubmit={this.searchChargesSheet}>
                  <div className="row">
                    <div className="col-lg-6">
                      <br></br>
                      <div className="row">
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
                        <div className="col-lg-12">
                       
                          <label>Processed Payment:</label>
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
                            name="paymentProcessed"
                            id="paymentProcessed"
                            value={this.state.searchModel.paymentProcessed}
                            onChange={this.handleChange}
                          >
                            {paymentProcessed.map((s) => (
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
                          <label>File Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fileName"
                            id="fileName"
                            maxLength="50"
                            // max="9"
                            value={this.state.searchModel.fileName}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>DOS From:</label>
                          <input
                            type="date"
                            className="form-control"
                            type="date"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="dosFrom"
                            id="dosFrom"
                            value={this.state.searchModel.dosFrom}
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
                          <label>DOS To:</label>
                          <input
                            type="date"
                            className="form-control"
                            type="date"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="dosTo"
                            id="dosTo"
                            value={this.state.searchModel.dosTo}
                            onChange={this.handleChange}
                          />
                        </div>
                     
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

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row">
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
                        <div className="col-lg-12"></div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Error Message:</label>
                          <input
                            type="text"
                            className="form-control"
                            type="text"
                  name="errorMessage"
                  id="errorMessage"
                  // max="20"
                  value={this.state.searchModel.errorMessage}
                  onChange={this.handleChange}
                          />
                        </div>
                        <div className="col-lg-12">
                         
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
                    >
                      Search
                    </button>

                    <button
                    type="button"
                      onClick={this.clearFields}
                      className="btn-search btn-primary btn-user mr-2"
                    >
                      Clear
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
              Heading="CHARGE SHEET SEARCH RESULT"
              disabled={this.isDisabled(this.props.rights.export)}
              dataObj={this.state.searchModel}
              url={this.AddChargesSheet}
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

export default connect(mapStateToProps, matchDispatchToProps)(ChargesSheet);
