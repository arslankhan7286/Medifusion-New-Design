import React, { Component } from "react";
import Label from "./Label";
import Input from "./Input";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable,
} from "mdbreact";
import moment from "moment";
import Select, { components } from "react-select";
import { withRouter } from "react-router-dom";
import GridHeading from "./GridHeading";
import axios from "axios";
import Swal from "sweetalert2";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import $ from "jquery";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { Multiselect } from "multiselect-react-dropdown";
import GPopup from "./GPopup";

export class PatientAuthReport extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/PatientAuthorization/";
    // this.Detailurl = process.env.REACT_APP_URL + "/RDetailedBillingReport/";
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.searchModel = {
      providerID: "",
      locationID: "",
      entryDateFrom: "",
      entryDateTo: "",
      authorizationDateFrom: "",
      authorizationDateTo: "",
      status: "",
      accountNo: "",
      authorizationNo: "",
      cptCode: "",
      startDate: "",
      expiryDate: "",
      responsibleParty: "",
    };

    //Validation Model
    this.validationModel = {
      dosFromValField: "",
      dosToFDValField: "",
      dosToGreaterValField: null,
      dosToGreaterValField: null,
      selectDOSFromValField: null,

      selectEntryFromValField: null,

      startDateValField: "",
      expiryDateValField: "",
      selectStartFromValField: "",
      expiryDateGreaterValField: "",

      entryDateFromValField: "",
      entryDateToValField: "",
      entryDateToGreaterValField: "",
      selectEntryFromValField: "",

      authDateFromValField: "",
      authDateToValField: "",
      authDateToGreaterValField: "",
      selectAuthdateFromValField: "",

      validation: false,
    };

    this.state = {
      searchModel: this.searchModel,
      validationModel: this.validationModel,
      data: [],
      Simpledata: [],
      loading: false,
      showPPopup: false,
      popupName: "",
      plainArray: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
      simpleReport: false,
      reports: "complete",
      Export: "",
      CptData: [],
      Revenuedata: [],
      AuthData: [],
      providerID: {},
      locationID: {},
      patientID: 0,
    };
    this.handleCheck = this.handleCheck.bind(this);
    this.handleProviderChange = this.handleProviderChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.closePatPopup = this.closePatPopup.bind(this);
    this.openPatPopup = this.openPatPopup.bind(this);
  }

  //search Creteria
  searchPatientAuth = (e) => {
    console.log("Model for search:", this.state.searchModel);
    this.setState({ loading: true });
    e.preventDefault();

    var myVal = this.validationModel;
    myVal.validation = false;

    //Entry Date From Future Date Validation
    if (this.isNull(this.state.searchModel.startDate) == false) {
      if (
        new Date(
          moment(this.state.searchModel.startDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.startDateValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.startDateValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.startDateValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //start  Date To Future Date Validation
    if (this.isNull(this.state.searchModel.expiryDate) == false) {
      if (
        new Date(
          moment(this.state.searchModel.expiryDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.expiryDateValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.expiryDateValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.expiryDateValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //start Date To must be greater than Entry Date From Validation
    if (
      this.isNull(this.state.searchModel.startDate) == false &&
      this.isNull(this.state.searchModel.expiryDate) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.startDate).format().slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.expiryDate).format().slice(0, 10)
        ).getTime()
      ) {
        myVal.expiryDateGreaterValField = (
          <span className="validationMsg">
            Expiry Date To must be greater than start date From
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.expiryDateGreaterValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.expiryDateGreaterValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
    //if Start date To is selected Then Make sure than start date Form is also selected Validation
    if (
      this.isNull(this.state.searchModel.startDate) == true &&
      this.isNull(this.state.searchModel.expiryDate) == false
    ) {
      // console.log("Select DOS From");
      myVal.selectStartFromValField = (
        <span className="validationMsg">Select Start Date From</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectStartFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //entryDateFrom From Future Date Validation
    if (this.isNull(this.state.searchModel.entryDateFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.entryDateFrom).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.entryDateFromValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.entryDateFromValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.entryDateFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //entry date  To must be greater than submittedDate From Validation
    if (
      this.isNull(this.state.searchModel.entryDateFrom) == false &&
      this.isNull(this.state.searchModel.entryDateTo) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.entryDateFrom).format().slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.entryDateTo).format().slice(0, 10)
        ).getTime()
      ) {
        myVal.entryDateToGreaterValField = (
          <span className="validationMsg">
            Entry Date To must be greater than Entry Date From
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.entryDateToGreaterValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.entryDateToGreaterValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Entry Date From Future Date Validation
    if (this.isNull(this.state.searchModel.entryDateTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.entryDateTo).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.entryDateToValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.entryDateToValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.entryDateToValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
    //if entry date To is selected Then Make sure than entry date Form is also selected Validation
    if (
      this.isNull(this.state.searchModel.entryDateFrom) == true &&
      this.isNull(this.state.searchModel.entryDateTo) == false
    ) {
      // console.log("Select DOS From");
      myVal.selectEntryFromValField = (
        <span className="validationMsg">Select Entry Date From</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectEntryFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
    //Auth Date From Future Date Validation
    if (this.isNull(this.state.searchModel.authorizationDateFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.authorizationDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.authDateFromValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.authDateFromValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.authDateFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Auth date To Future Date Validation
    if (this.isNull(this.state.searchModel.authorizationDateTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.authorizationDateTo)
            .format()
            .slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.authDateToValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.authDateToValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.authDateToValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Auth Date To must be greater than Auth Date From Validation
    if (
      this.isNull(this.state.searchModel.authorizationDateFrom) == false &&
      this.isNull(this.state.searchModel.authorizationDateTo) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.authorizationDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.authorizationDateTo)
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.authDateToGreaterValField = (
          <span className="validationMsg">
            DOS To must be greater than DOS From
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.authDateToGreaterValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.authDateToGreaterValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
    //if Auth Date To is selected Then Make sure than Auth Date Form is also selected Validation
    if (
      this.isNull(this.state.searchModel.authorizationDateFrom) == true &&
      this.isNull(this.state.searchModel.authorizationDateTo) == false
    ) {
      console.log("Select DOS From");
      myVal.selectAuthdateFromValField = (
        <span className="validationMsg">Select Authorization Date From</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectAuthdateFromValField = null;
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
      .post(this.url + "FindPatientAuthorizations", this.state.searchModel, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer  " + this.props.loginObject.token,
          Accept: "*/*",
        },
      })

      .then((response) => {
        console.log("FindPatientAuthorizations : ", response.data);
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
          
            entryDate: this.isNull(row.entryDate) == true ? " " : row.entryDate,
            authorizationDate:
              this.isNull(row.authorizationDate) == true
                ? " "
                : row.authorizationDate,
            status: this.isNull(row.status) == true ? " " : row.status,
            accountNo: (
              <MDBBtn
                className="gridBlueBtn"
                onClick={() => this.openPatPopup("patient", row.patientID)}
              >
                {row.accountNo}
              </MDBBtn>
            ),
            patientName:
              this.isNull(row.patientName) == true ? " " : row.patientName,
            plan: this.isNull(row.plan) == true ? " " : row.plan,
            providerName:
              this.isNull(row.providerName) == true ? " " : row.providerName,
            authorizationNo:
              this.isNull(row.authorizationNo) == true
                ? " "
                : row.authorizationNo,
            cptCode: this.isNull(row.cptCode) == true ? " " : row.cptCode,
            startDate: this.isNull(row.startDate) == true ? " " : row.startDate,
            expiryDate:
              this.isNull(row.expiryDate) == true ? " " : row.expiryDate,
            visitsAllowed:
              this.isNull(row.visitsAllowed) == true ? " " : row.visitsAllowed,
            visitsUsed:
              this.isNull(row.visitsUsed) == true ? " " : row.visitsUsed,
          });
        });
        this.setState({
          AuthData: newList,
          loading: false,
        });
        console.log("new data", response.data);
      })

      .catch((error) => {
        this.setState({ loading: false });
        Swal.fire("Something Wrong", "Please Check Server Connection", "error");
        let errorsList = [];
        if (error.response !== null && error.response.data !== null) {
          errorsList = error.response.data;
          console.log(errorsList);
        } else console.log(error);
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

  //handle Change
  handleChange = (event) => {
    console.log(event.target.value);
    //event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };
  handleProviderChange(event) {
    console.log("Event :", event);

    if (event) {
      this.setState({
        providerID: event,
        searchModel: {
          ...this.state.searchModel,
          providerID: event.id,
        },
      });
    } else {
      this.setState({
        providerID: null,
        searchModel: {
          ...this.state.searchModel,
          providerID: null,
        },
      });
    }
  }
  handleChangeGrid = (event) => {
    console.log("handleChangeGrid", event.target.value);
    event.preventDefault();
    this.setState({
      reports: event.target.value,
    });
  };
  //clear fields button
  clearFields = (event) => {
    var myVal = { ...this.validationModel };
    myVal.dosFromValField = "";
    myVal.dosToFDValField = "";
    myVal.dosToGreaterValField = "";
    myVal.selectDOSFromValField = "";
    // myVal.dosToGreaterValField="";

    myVal.startDateValField = "";

    myVal.expiryDateValField = "";
    myVal.expiryDateGreaterValField = "";
    myVal.selectStartFromValField = "";

    myVal.submittedDateFromValField = "";
    myVal.submittedDateToValField = "";
    myVal.SubmitDateToGreaterValField = "";
    myVal.selectSubmitFromValField = "";
    myVal.validation = false;

    this.setState({
      searchModel: this.searchModel,
      validationModel: myVal,
      providerID: this.state.searchModel.providerID,
      locationID: this.state.searchModel.locationID,
    });
  };
  handleLocationChange(event) {
    console.log("Event :", event);

    if (event) {
      this.setState({
        locationID: event,
        searchModel: {
          ...this.state.searchModel,
          locationID: event.id,
        },
      });
    } else {
      this.setState({
        locationID: null,
        searchModel: {
          ...this.state.searchModel,
          locationID: null,
        },
      });
    }
  }
  handleCheck() {
    this.setState({
      ...this.state.searchModel,
      simpleReport: !this.state.simpleReport,
    });
  }
  ExportExcel = () => {
    if (this.state.Export == "Export") {
      return "Export";
    } else if (this.state.Export == "ExportSimple") {
      return "ExportSimple";
    }
  };

  openPatPopup = (name, id) => {
    this.setState({
      showPPopup: true,
      popupName: name,
      patientID: id,
    });
  };

  closePatPopup(name, id) {
    $("#myModal").hide();
    this.setState({ popupName: "", showPPopup: false });
  }

  render() {
    const status = [
      { value: "", display: "Please Select" },
      { value: "AUTH REQUIRED", display: "AUTH REQUIRED" },
      { value: "ACTIVE", display: "ACTIVE" },
      { value: "IN ACTIVE", display: "IN ACTIVE" },
      { value: "IN PROCESS", display: "IN PROCESS" },
      { value: "MD ORDERS REQUESTED", display: "MD ORDERS REQUESTED" },
    ];

    const responsibleParty = [
      { value: "", display: "Please Select" },
      { value: "BELLMEDEX", display: "BELLMEDEX" },
      { value: "CLIENT", display: "CLIENT" },
    ];
    console.log("props", this.props.loginObject.token);
    const reports = [
      { value: "complete", display: "Patient Visit Report" },
      { value: "Simple", display: "Total Count Billed By CPT Report" },
      { value: "Paid", display: "Total Count Paid By CPT Report" },
      { value: "Revenue", display: "Total Revenue Collect By Cpt Report" },
      { value: "Detail", display: "Detail Billing Report" },
      { value: "Authorization", display: "Patient Authorization" },
    ];
    const { plainArray } = this.state;
    var submittedDateFrom = this.state.searchModel.submittedDateFrom
      ? this.state.searchModel.submittedDateFrom.slice(0, 10)
      : "";
    var submittedDateTo = this.state.searchModel.submittedDateTo
      ? this.state.searchModel.submittedDateTo.slice(0, 10)
      : "";
    var startDate = this.state.searchModel.startDate
      ? this.state.searchModel.startDate.slice(0, 10)
      : "";
    var expiryDate = this.state.searchModel.expiryDate
      ? this.state.searchModel.expiryDate.slice(0, 10)
      : "";
    var authorizationDateFrom = this.state.searchModel.authorizationDateFrom
      ? this.state.searchModel.authorizationDateFrom.slice(0, 10)
      : "";
    var authorizationDateTo = this.state.searchModel.authorizationDateTo
      ? this.state.searchModel.authorizationDateTo.slice(0, 10)
      : "";
    var entryDateFrom = this.state.searchModel.entryDateFrom
      ? this.state.searchModel.entryDateFrom.slice(0, 10)
      : "";
    var entryDateTo = this.state.searchModel.entryDateTo
      ? this.state.searchModel.entryDateTo.slice(0, 10)
      : "";

    const AuthData = {
      columns: [
    
        {
          label: "ENTRY DATE",
          field: "entryDate",
          sort: "asc",
          width: 100,
        },
        {
          label: "AUTHORIZATION DATE",
          field: "authorizationDate",
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
          label: "ACCOUNT #",
          field: "accountNo",
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
          label: "PLAN",
          field: "plan",
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
          label: "AUTH #",
          field: "authorizationNo",
          sort: "asc",
          width: 100,
        },
        {
          label: "CPT",
          field: "cpt",
          sort: "asc",
          width: 100,
        },
        {
          label: "START DATE",
          field: "startDate",
          sort: "asc",
          width: 100,
        },
        {
          label: "END DATE",
          field: "endDate",
          sort: "asc",
          width: 100,
        },

        {
          label: "VISIT ALLOWED",
          field: "visitAllowed",
          sort: "asc",
          width: 100,
        },
        {
          label: "VISIT USED",
          field: "visitUsed",
          sort: "asc",
          width: 100,
        },
      ],
      rows: this.state.AuthData,
    };

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

    // let popup = "";

    let popup = "";
    if (this.state.showPPopup) {
      popup = (
        <GPopup
          onClose={() => this.closePatPopup}
          id={this.state.patientID}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else popup = <React.Fragment></React.Fragment>;

    return (
      <React.Fragment>
      {spiner}
    <div class="container-fluid">
    <div class="header pt-3">
  <h6>
    <span class="h4">PATIENT AUTHORIZATION REPORT</span>

  </h6>
</div>

      <div
        class="clearfix"
        style={{ borderBottom: "1px solid #037592" }}
      ></div>

      <div class="row">
        <div class="col-md-12 col-sm-12 pt-3 provider-form">
          <form class="needs-validation form-group" 
           onSubmit={(event) => {this.searchPatientAuth(event);
              }}>
            <div class="row">


            <div class="col-md-3 mb-2">
                  <div class="col-md-4 float-left">
                    <label for="patientAccountNumber">Account #</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Account Number"
                      name="patientAccouaccountNontNumber"
                      id="accountNo"
                      maxLength="35"
                      value={this.state.searchModel.accountNo}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div class="invalid-feedback">
                    {" "}
                    {/* Valid first name is required.{" "} */}
                  </div>
                </div>
              
                <div class="col-md-3 mb-2">
                  <div class="col-md-4 float-left">
                    <label for="patientAccountNumber">Authorization No</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Authorization No"
                      name="authorizationNo"
                      id="authorizationNo"
                      maxLength="35"
                      value={this.state.searchModel.authorizationNo}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div class="invalid-feedback">
                    {" "}
                    {/* Valid first name is required.{" "} */}
                  </div>
                </div>
  
              <div class="col-md-3 mb-2">
              <div class="col-md-4 float-left">
                  <label for="cptCode">CPT Code</label>
                </div>
                <div class="col-md-7 float-left">
                <Input
                  type="text"
                  placeholder="CPT Code"
                  name="cptCode"
                  id="cptCode"
                  max="30"
                  value={this.state.searchModel.cptCode}
                  onChange={() => this.handleChange}
                />
                </div>
                <div class="invalid-feedback">
                  {" "}
                </div>
              </div>
              <div class="col-md-3 mb-2">
              <div class="col-md-4 float-left">
                  <label for="cptCode">Provider</label>
                </div>
                <div class="col-md-7 float-left">
                <Select
                    //   className={
                    //     this.state.validationModel.taxonomyCodeValField
                    //       ? this.errorField
                    //       : ""
                    //   }
                    type="text"
                    value={this.state.providerID}
                    name="providerID"
                    id="providerID"
                    max="10"
                    onChange={event => this.handleProviderChange(event)}
                    options={this.props.userProviders}
                    // onKeyDown={(e)=>this.filterOption(e)}
                    // filterOption={this.filterOption}
                    placeholder=""
                    isClearable={true}
                    isSearchable={true}
                    // menuPosition="static"
                    openMenuOnClick={false}
                    escapeClearsValue={true}
                    styles={{
                      indicatorSeparator: () => {},
                      clearIndicator: defaultStyles => ({
                        ...defaultStyles,
                        color: "#286881"
                      }),
                      container: defaultProps => ({
                        ...defaultProps,
                        position: "absolute",
                        width: "84%"
                      }),
                      // menu: styles => ({ ...styles,
                      //   width: '125px'
                      //  }),
                      indicatorsContainer: defaultStyles => ({
                        ...defaultStyles,
                        padding: "0px",
                        marginBottom: "0",
                        marginTop: "0px",
                        height: "36px",
                        borderBottomRightRadius: "10px",
                        borderTopRightRadius: "10px"
                        // borderRadius:"0 6px 6px 0"
                      }),
                      indicatorContainer: defaultStyles => ({
                        ...defaultStyles,
                        padding: "9px",
                        marginBottom: "0",
                        marginTop: "1px",
                        // borderBottomRightRadius: "5px",
                        // borderTopRightRadius: "5px",
                        borderRadius: "0 4px 4px 0"
                      }),
                      dropdownIndicator: () => ({
                        display: "none"
                      }),
                      // dropdownIndicator: defaultStyles => ({
                      //   ...defaultStyles,
                      //   backgroundColor: "#d8ecf3",
                      //   color: "#286881",
                      //   borderRadius: "3px"
                      // }),
                      input: defaultStyles => ({
                        ...defaultStyles,
                        margin: "0px",
                        padding: "0px"
                        // display:'none'
                      }),
                      singleValue: defaultStyles => ({
                        ...defaultStyles,
                        fontSize: "16px",
                        transition: "opacity 300ms"
                        // display:'none'
                      }),
                      control: defaultStyles => ({
                        ...defaultStyles,
                        minHeight: "33px",
                        height: "33px",
                        height: "33px",
                        paddingLeft: "10px",
                        //borderColor:"transparent",
                        borderColor: "#C6C6C6",
                        boxShadow: "none",
                        borderColor: "#C6C6C6",
                        "&:hover": {
                          borderColor: "#C6C6C6"
                        }
                        // display:'none'
                      })
                    }}
                  />
                </div>
                <div class="invalid-feedback">
                  {" "}
                </div>
              </div>
              <div class="col-md-3 mb-2">
              <div class="col-md-4 float-left">
                  <label for="appoinmentDateFrom">Start Date</label>
                </div>
                <div class="col-md-7 float-left">
                  <input
                    min="1900-01-01"
                    max="9999-12-31"
                    type="date"
                    min="1900-01-01"
                    max="9999-12-31"
                    name="startDate"
                    id="startDate"
                    value={
                      this.state.searchModel.startDate == null
                        ? ""
                        : this.state.searchModel.startDate
                    }
                    onChange={this.handleChange}
                  />
                </div>
                <div class="invalid-feedback">
                  {" "}
                </div>
              </div>
              <div class="col-md-3 mb-2">
              <div class="col-md-4 float-left">
                  <label for="expiryDate">Expiry Date</label>
                </div>
                <div class="col-md-7 float-left">
                  <input
                    min="1900-01-01"
                    max="9999-12-31"
                    type="date"
                    min="1900-01-01"
                    max="9999-12-31"
                    name="expiryDate"
                    id="expiryDate"
                    value={
                      this.state.searchModel.expiryDate == null
                        ? ""
                        : this.state.searchModel.expiryDate
                    }
                    onChange={this.handleChange}
                  />
                </div>
                <div class="invalid-feedback">
                  {" "}
                </div>
              </div>

              <div class="col-md-3 mb-2">
              <div class="col-md-4 float-left">
                  <label for="entryDateFrom">Entry Date From</label>
                </div>
                <div class="col-md-7 float-left">
                  <input
                    min="1900-01-01"
                    max="9999-12-31"
                    type="date"
                    min="1900-01-01"
                    max="9999-12-31"
                    name="entryDateFrom"
                    id="entryDateFrom"
                    value={
                      this.state.searchModel.entryDateFrom == null
                        ? ""
                        : this.state.searchModel.entryDateFrom
                    }
                    onChange={this.handleChange}
                  />
                </div>
                <div class="invalid-feedback">
                  {" "}
                </div>
              </div>
              <div class="col-md-3 mb-2">
              <div class="col-md-4 float-left">
                  <label for="ent">Entry Date To</label>
                </div>
                <div class="col-md-7 float-left">
                  <input
                    min="1900-01-01"
                    max="9999-12-31"
                    type="date"
                    min="1900-01-01"
                    max="9999-12-31"
                    name="entryDateTo"
                    id="entryDateTo"
                    value={
                      this.state.searchModel.entryDateTo == null
                        ? ""
                        : this.state.searchModel.entryDateTo
                    }
                    onChange={this.handleChange}
                  />
                </div>
                <div class="invalid-feedback">
                  {" "}
                </div>
              </div>
              <div class="col-md-3 mb-2">
              <div class="col-md-4 float-left">
                  <label for="authorizationDateFrom">Authorization Date From</label>
                </div>
                <div class="col-md-7 float-left">
                  <input
                    min="1900-01-01"
                    max="9999-12-31"
                    type="date"
                    min="1900-01-01"
                    max="9999-12-31"
                    name="authorizationDateFrom"
                    id="authorizationDateFrom"
                    value={
                      this.state.searchModel.authorizationDateFrom == null
                        ? ""
                        : this.state.searchModel.authorizationDateFrom
                    }
                    onChange={this.handleChange}
                  />
                </div>
                <div class="invalid-feedback">
                  {" "}
                </div>
              </div>
              <div class="col-md-3 mb-2">
              <div class="col-md-4 float-left">
                  <label for="authorizationDateTo">Authorization Date To</label>
                </div>
                <div class="col-md-7 float-left">
                  <input
                    min="1900-01-01"
                    max="9999-12-31"
                    type="date"
                    min="1900-01-01"
                    max="9999-12-31"
                    name="authorizationDateTo"
                    id="authorizationDateTo"
                    value={
                      this.state.searchModel.authorizationDateTo == null
                        ? ""
                        : this.state.searchModel.authorizationDateTo
                    }
                    onChange={this.handleChange}
                  />
                </div>
                <div class="invalid-feedback">
                  {" "}
                </div>
              </div>
              <div class="col-md-3 mb-2">
              <div class="col-md-4 float-left">
                  <label for="authorizationDateTo">Location</label>
                </div>
                <div class="col-md-7 float-left">
                <Select
                    type="text"
                    value={this.state.locationID}
                    name="locationID"
                    id="locationID"
                    max="10"
                    onChange={(event) => this.handleLocationChange(event)}
                    options={this.props.userLocations}
                    // onKeyDown={(e)=>this.filterOption(e)}
                    //   filterOption={this.filterOption}
                    placeholder=""
                    isClearable={true}
                    isSearchable={true}
                    // menuPosition="static"
                    openMenuOnClick={false}
                    escapeClearsValue={true}
                    styles={{
                      indicatorSeparator: () => {},
                      clearIndicator: (defaultStyles) => ({
                        ...defaultStyles,
                        color: "#286881",
                      }),
                      container: (defaultProps) => ({
                        ...defaultProps,
                        position: "absolute",
                        width: "84%",
                      }),

                      indicatorsContainer: (defaultStyles) => ({
                        ...defaultStyles,
                        padding: "0px",
                        marginBottom: "0",
                        marginTop: "0px",
                        height: "36px",
                        borderBottomRightRadius: "10px",
                        borderTopRightRadius: "10px",
                      }),
                      indicatorContainer: (defaultStyles) => ({
                        ...defaultStyles,
                        padding: "9px",
                        marginBottom: "0",
                        marginTop: "1px",

                        borderRadius: "0 4px 4px 0",
                      }),
                      dropdownIndicator: () => ({
                        display: "none",
                      }),

                      input: (defaultStyles) => ({
                        ...defaultStyles,
                        margin: "0px",
                        padding: "0px",
                      }),
                      singleValue: (defaultStyles) => ({
                        ...defaultStyles,
                        fontSize: "16px",
                        transition: "opacity 300ms",
                      }),
                      control: (defaultStyles) => ({
                        ...defaultStyles,
                        minHeight: "33px",
                        height: "33px",
                        height: "33px",
                        paddingLeft: "10px",

                        borderColor: "#C6C6C6",
                        boxShadow: "none",
                        borderColor: "#C6C6C6",
                        "&:hover": {
                          borderColor: "#C6C6C6",
                        },
                      }),
                    }}
                  />
                </div>
                <div class="invalid-feedback">
                  {" "}
                </div>
              </div>
              <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="status">
                        Status
                      </label>
                    </div>
                    <div class="col-md-7 float-left">
                      <select name="state1" class="w-100" 
                       name="status"
                       id="status"
                       value={this.state.searchModel.status}
                       onChange={this.handleChange}>
                         {status.map(s => (
                            <option key={s.value} value={s.value}>
                              {" "}
                              {s.display}{" "}
                            </option>
                          ))}{" "}
                      </select>
                    </div>
                    <div class="invalid-feedback"> </div>
                  </div>
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="responsibleParty">
                      Responsible Party
                      </label>
                    </div>
                    <div class="col-md-7 float-left">
                      <select name="state1" class="w-100" 
                       name="responsibleParty"
                       id="responsibleParty"
                       value={this.state.searchModel.responsibleParty}
                       onChange={this.handleChange}>
                         {responsibleParty.map(s => (
                            <option key={s.value} value={s.value}>
                              {" "}
                              {s.display}{" "}
                            </option>
                          ))}{" "}
                      </select>
                    </div>
                    <div class="invalid-feedback"> </div>
                  </div>




            </div>

         

            <div class="row">
              <div class="col-12 pt-2 text-center">
                <button class="btn btn-primary mr-2" type="submit">
                  Search
                </button>
                <button class="btn btn-primary mr-2" type="button"
                 onClick={(event) => this.clearFields(event)}>
                  Clear
                </button>
              </div>
            </div>
            <div class="clearfix"></div>
          </form>
        </div>
      </div>

      <div className="row">
            <div className="card mb-4" style={{width:"100%"}}>
              <GridHeading
                Heading="PATIENT AUTHORIZATION REPORT"
                // disabled={this.isDisabled(this.props.rights.export)}
                dataObj={this.state.searchModel}
                url={this.url}
                methodName="Export"
                methodNamePdf="ExportPdf"
                length={this.state.AuthData.length}
              ></GridHeading>
              <div className="card-body">
                <div className="table-responsive">
                  <div
                  style={{width:"98%"}}
                    id="dataTable_wrapper"
                    className="dataTables_wrapper dt-bootstrap4"
                  >
                    <MDBDataTable
                      responsive={true}
                      striped
                      bordered
                      searching={false}
                      data={AuthData}
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

    </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  console.log("State from Appointment Status PAge : ", state);
  return {
    patientInfo: state.selectPatient ? state.selectPatient : null,
    cptCodes: state.loginInfo
      ? state.loginInfo.cpt
        ? state.loginInfo.cpt
        : []
      : [],
    icdCodes: state.loginInfo
      ? state.loginInfo.icd
        ? state.loginInfo.icd
        : []
      : [],
    posCodes: state.loginInfo
      ? state.loginInfo.pos
        ? state.loginInfo.pos
        : []
      : [],
    modifiers: state.loginInfo
      ? state.loginInfo.modifier
        ? state.loginInfo.modifier
        : []
      : [],
    userProviders: state.loginInfo
      ? state.loginInfo.userProviders
        ? state.loginInfo.userProviders
        : []
      : [],
    userRefProviders: state.loginInfo
      ? state.loginInfo.userRefProviders
        ? state.loginInfo.userRefProviders
        : []
      : [],
    userLocations: state.loginInfo
      ? state.loginInfo.userLocations
        ? state.loginInfo.userLocations
        : []
      : [],
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo1: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null, clientID: null },
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.chargesSearch,
          add: state.loginInfo.rights.chargesCreate,
          update: state.loginInfo.rights.chargesEdit,
          delete: state.loginInfo.rights.chargesDelete,
          export: state.loginInfo.rights.chargesExport,
          import: state.loginInfo.rights.chargesImport,
          resubmit: state.loginInfo.rights.resubmitCharges,
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
  connect(mapStateToProps, matchDispatchToProps)(PatientAuthReport)
);
