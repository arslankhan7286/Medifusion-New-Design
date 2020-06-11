import React, { Component } from "react";
import Label from "./Label";
import Input from "./Input";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable
} from "mdbreact";
import GridHeading from "./GridHeading";
import axios from "axios";
import Swal from "sweetalert2";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import moment from "moment";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class AgingReport1 extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/RFirstAgingReport/";
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      patientAccountNumber: "",
      patientName: "",
      dateOfServiceFrom: "",
      dateOfServiceTo: "",
      entryDateFrom: "",
      entryDateTo: "",
      submittedDateTo: "",
      submittedDateFrom: "",
      plan: "",
      chargeValue: true,
      visitValue: false,
      allValue: false,
      searchType: "DOS"
    };

    //Validation Model
    this.validationModel = {
      dosFromValField: "",
      dosToFDValField: "",
      dosToGreaterValField: null,
      dosToGreaterValField: null,
      selectDOSFromValField: null,
      EntryDateToGreaterValField: null,
      selectEntryFromValField: null,
      entryDateFromValField: "",
      entryDateToValField: "",
      submittedDateFromValField: "",
      submittedDateToValField: "",
      SubmitDateToGreaterValField: "",
      selectSubmitFromValField: "",
      validation: false
    };

    this.state = {
      searchModel: this.searchModel,
      validationModel: this.validationModel,
      data: [],
      loading: false
    };
    this.handleCheckCharges = this.handleCheckCharges.bind(this);
    this.handleCheckVisit = this.handleCheckVisit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  searchAgingReports = e => {
    console.log("Model for Search: ", this.state.searchModel);
    e.preventDefault();
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

    //DOS From Future Date Validation
    if (this.isNull(this.state.searchModel.dateOfServiceFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.dateOfServiceFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.dosFromValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.dosFromValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.dosFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //DOS To Future Date Validation
    if (this.isNull(this.state.searchModel.dateOfServiceTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.dateOfServiceTo)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.dosToFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.dosToFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.dosToFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //DOS To must be greater than DOS From Validation
    if (
      this.isNull(this.state.searchModel.dateOfServiceFrom) == false &&
      this.isNull(this.state.searchModel.dateOfServiceTo) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.dateOfServiceFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.dateOfServiceTo)
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.dosToGreaterValField = (
          <span className="validationMsg">
            DOS To must be greater than DOS From
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.dosToGreaterValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.dosToGreaterValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
    //if DOs To is selected Then Make sure than DOS Form is also selected Validation
    if (
      this.isNull(this.state.searchModel.dateOfServiceFrom) == true &&
      this.isNull(this.state.searchModel.dateOfServiceTo) == false
    ) {
      console.log("Select DOS From");
      myVal.selectDOSFromValField = (
        <span className="validationMsg">Select DOS From</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectDOSFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Entry Date From Future Date Validation
    if (this.isNull(this.state.searchModel.entryDateFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.entryDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
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

    //Entry Date To Future Date Validation
    if (this.isNull(this.state.searchModel.entryDateTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.entryDateTo)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
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

    //Entry Date To must be greater than Entry Date From Validation
    if (
      this.isNull(this.state.searchModel.entryDateFrom) == false &&
      this.isNull(this.state.searchModel.entryDateTo) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.entryDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.entryDateTo)
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.EntryDateToGreaterValField = (
          <span className="validationMsg">
            Entry Date To must be greater than Entry Date From
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.EntryDateToGreaterValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.EntryDateToGreaterValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
    //if Entry Date To is selected Then Make sure than Entry date Form is also selected Validation
    if (
      this.isNull(this.state.searchModel.entryDateFrom) == true &&
      this.isNull(this.state.searchModel.entryDateTo) == false
    ) {
      console.log("Select DOS From");
      myVal.selectEntryFromValField = (
        <span className="validationMsg">Select Entry Date From</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectEntryFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Submitted Date From Future Date Validation
    if (this.isNull(this.state.searchModel.submittedDateFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.submittedDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.submittedDateFromValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.submittedDateFromValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.submittedDateFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //submittedDate  To must be greater than submittedDate From Validation
    if (
      this.isNull(this.state.searchModel.submittedDateFrom) == false &&
      this.isNull(this.state.searchModel.submittedDateTo) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.submittedDateFrom)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.submittedDateTo)
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.SubmitDateToGreaterValField = (
          <span className="validationMsg">
            Submit Date To must be greater than Submit Date From
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.SubmitDateToGreaterValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.SubmitDateToGreaterValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Submitted Date From Future Date Validation
    if (this.isNull(this.state.searchModel.submittedDateTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.submittedDateTo)
            .format()
            .slice(0, 10)
        ).getTime() >
        new Date(
          moment()
            .format()
            .slice(0, 10)
        ).getTime()
      ) {
        myVal.submittedDateToValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.submittedDateToValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.submittedDateToValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
    //if Submit Date To is selected Then Make sure than Submit date Form is also selected Validation
    if (
      this.isNull(this.state.searchModel.submittedDateFrom) == true &&
      this.isNull(this.state.searchModel.submittedDateTo) == false
    ) {
      console.log("Select DOS From");
      myVal.selectSubmitFromValField = (
        <span className="validationMsg">Select Submit Date From</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectSubmitFromValField = null;
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
      .post(this.url + "FindAgingReportV1", this.state.searchModel, this.config)
      .then(response => {
        console.log("Aging Report Search Response : ", response.data);
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            payerName: row.payerName,
            current: this.isNull(row.current) == true ? " " :"$" + (row.current),
            isBetween30And60: this.isNull(row.isBetween30And60) == true ? " " :"$" + (row.isBetween30And60),
            isBetween61And90: this.isNull(row.isBetween61And90) == true ? " " :"$" + (row.isBetween61And90),
            isBetween91And120: this.isNull(row.isBetween91And120) == true ? " " :"$" + (row.isBetween91And120),
            isGreaterThan120: this.isNull(row.isGreaterThan120) == true ? " " :"$" + (row.isGreaterThan120),
            totalBalance: this.isNull(row.totalBalance) == true ? " " :"$" + (row.totalBalance) 
          });
        });
        this.setState({ data: newList, loading: false });
        console.log(
          "new data",
          this.state.data,
          "loading ",
          this.state.loading
        );
      })
      .catch(error => {
        this.setState({ loading: false });
        Swal.fire("Something Wrong", "Please Try Again", "error");
      });
  };
  handleCheck() {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        allValue: !this.state.searchModel.allValue
      }
    });
  }
  handleCheckCharges() {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        chargeValue: !this.state.searchModel.chargeValue,
        visitValue: !this.state.searchModel.visitValue
      }
    });
  }
  handleCheckVisit() {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        visitValue: !this.state.searchModel.visitValue,
        chargeValue: !this.state.searchModel.chargeValue
      }
    });
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

  //handle Change
  handleChange = event => {
    console.log(event.target.value);
    event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });
  };
  //clear fields button
  clearFields = event => {
    var myVal = { ...this.validationModel };
    myVal.dosFromValField = "";
    myVal.dosToFDValField = "";
    myVal.dosToGreaterValField = "";
    myVal.selectDOSFromValField = "";
    // myVal.dosToGreaterValField="";

    myVal.entryDateFromValField = "";

    myVal.entryDateToValField = "";
    myVal.EntryDateToGreaterValField = "";
    myVal.selectEntryFromValField = "";

    myVal.submittedDateFromValField = "";
    myVal.submittedDateToValField = "";
    myVal.SubmitDateToGreaterValField = "";
    myVal.selectSubmitFromValField = "";
    myVal.validation = false;

    this.setState({
      searchModel: this.searchModel,
      validationModel: myVal
    });
  };

  render() {
    let chargeValue = this.state.searchModel.chargeValue;
    let visitValue = this.state.searchModel.visitValue;
    let allValue = this.state.searchModel.allValue;
    var submittedDateFrom = this.state.searchModel.submittedDateFrom
      ? this.state.searchModel.submittedDateFrom.slice(0, 10)
      : "";
    var submittedDateTo = this.state.searchModel.submittedDateTo
      ? this.state.searchModel.submittedDateTo.slice(0, 10)
      : "";
    var entryDateFrom = this.state.searchModel.entryDateFrom
      ? this.state.searchModel.entryDateFrom.slice(0, 10)
      : "";
    var entryDateTo = this.state.searchModel.entryDateTo
      ? this.state.searchModel.entryDateTo.slice(0, 10)
      : "";
    var dateOfServiceFrom = this.state.searchModel.dateOfServiceFrom
      ? this.state.searchModel.dateOfServiceFrom.slice(0, 10)
      : "";
    var dateOfServiceTo = this.state.searchModel.dateOfServiceTo
      ? this.state.searchModel.dateOfServiceTo.slice(0, 10)
      : "";
    const SearchType = [
      { value: "DOS", display: "DOS" },
      { value: "ED", display: "ENTRY DATE" },
      { value: "SD", display: "SUBMIT DATE" }
    ];

    const data = {
      columns: [
    
        {
          label: "PAYER NAME",
          field: "payerName",
          sort: "asc",
          width: 150
        },
        {
          label: "CURRENT",
          field: "current",
          sort: "asc",
          width: 270
        },
        {
          label: "31-60",
          field: "isBetween30And60",
          sort: "asc",
          width: 200
        },
        {
          label: "61-90",
          field: "isBetween61And90",
          sort: "asc",
          width: 100
        },
        {
          label: "91-120",
          field: "isBetween91And120",
          sort: "asc",
          width: 150
        },
        {
          label: ">120",
          field: "isGreaterThan120",
          sort: "asc",
          width: 100
        },
        {
          label: "TOTAL",
          field: "totalBalance",
          sort: "asc",
          width: 100
        }
      ],
      rows: this.state.data
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

    return (
      <React.Fragment>
      {spiner}
      <div class="container-fluid">
      <div class="header pt-3">
    <h6>
      <span class="h4">AGING REPORT 1</span>
      <div class="float-right p-0 m-0 mb-2 col-md-0">
                {" "}
                <span class="gray-text f13 pl-2" style={{paddingRight:"30px"}}>Age Unit</span>
                <select
                  name="state"
                  id="state"
                  style={{ width: "130px"}}
                  name="searchType"
                  id="searchType"
                  value={this.state.searchModel.searchType}
                  onChange={this.handleChange}
                >
                  {SearchType.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.display}
                    </option>
                  ))}
                </select>
              </div>
    
    </h6>
  </div>

        <div
          class="clearfix"
          style={{ borderBottom: "1px solid #037592" }}
        ></div>

        <div class="row">
          <div class="col-md-12 col-sm-12 pt-3 provider-form">
            <form class="needs-validation form-group" 
             onSubmit={(event) => {this.searchAgingReports(event);
                }}>
              <div class="row">
                <div class="col-md-3 mb-2">
                  <div class="col-md-4 float-left">
                    <label for="patientAccountNumber">Patient Account #</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Patient Account Number"
                      name="patientAccountNumber"
                      id="patientAccountNumber"
                      maxLength="35"
                      value={this.state.searchModel.patientAccountNumber}
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
                    <label for="patientName">Patient Name</label>

                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Patient Name"
                      name="patientName"
                      id="patientName"
                      maxLength="35"
                      value={this.state.searchModel.patientName}
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
                    <label for="dateOfServiceFrom">DOS FROM</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="dateOfServiceFrom"
                      id="dateOfServiceFrom"
                      value={
                        this.state.searchModel.dateOfServiceFrom == null
                          ? ""
                          : this.state.searchModel.dateOfServiceFrom
                      }
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
                    <label for="dateOfServiceTo">DOS TO</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="dateOfServiceTo"
                      id="dateOfServiceTo"
                      value={
                        this.state.searchModel.dateOfServiceTo == null
                          ? ""
                          : this.state.searchModel.dateOfServiceTo
                      }
                      onChange={this.handleChange}
                    />
                  </div>
                  <div class="invalid-feedback">
                    {" "}
                    {/* Valid first name is required.{" "} */}
                  </div>
                </div>
              </div>

              <div class="row">
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
                    {/* Valid first name is required.{" "} */}
                  </div>
            
                </div>
                <div class="col-md-3 mb-4">
                  <div class="col-md-4 float-left">
                    <label for="entryDateTo">Entry Date To</label>
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
                    {/* Valid first name is required.{" "} */}
                  </div>
                </div>
                <div class="col-md-3 mb-2">
                 
           
                <div class="col-md-4 float-left">
                    <label for="submittedDateFrom">Submitted Date From</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="submittedDateFrom"
                      id="submittedDateFrom"
                      value={
                        this.state.searchModel.submittedDateFrom == null
                          ? ""
                          : this.state.searchModel.submittedDateFrom
                      }
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
                    <label for="submittedDateTo">Submitted Date To</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      min="1900-01-01"
                      max="9999-12-31"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      name="submittedDateTo"
                      id="submittedDateTo"
                      value={
                        this.state.searchModel.submittedDateTo == null
                          ? ""
                          : this.state.searchModel.submittedDateTo
                      }
                      onChange={this.handleChange}
                    />
                  </div>
                  <div class="invalid-feedback">
                    {" "}
                    {/* Valid first name is required.{" "} */}
                  </div>
                </div>
              </div>
              <div class="row">
                {/* saqib */}

                <div class="col-md-3 mb-2">
                  <div class="col-md-4 float-left">
                    <label for="plan">Plan</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Plan"
                      name="plan"
                      id="plan"
                      maxLength="35"
                      value={this.state.searchModel.plan}
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
                      <label for="firstName">All Plans</label>
                    </div>
                    <div class="col-md-7 float-left">
                    <div style={{ marginBottom: "10px" }}
                          class="lblChkBox"
                        >
                          <input
                            type="checkbox"
                            id="allValue"
                            name="allValue"
                            checked={allValue}
                            onClick={this.handleCheck}
                          />
                          <label for="reportTaxID">
                            <span></span>
                          </label>
                       </div>
                    </div>
                    <div class="invalid-feedback">
                    </div>
                  </div>
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="firstName">Charges</label>
                    </div>
                    <div class="col-md-7 float-left">
                    <div style={{ marginBottom: "10px" }}
                          class="lblChkBox"
                        >
                          <input
                            type="checkbox"
                            id="chargeValue"
                            name="chargeValue"
                            checked={chargeValue}
                            onClick={this.handleCheckCharges}
                          />
                          <label for="reportTaxID">
                            <span></span>
                          </label>
                       </div>
                    </div>
                    <div class="invalid-feedback">
                    </div>
                  </div>
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="firstName">Visits</label>
                    </div>
                    <div class="col-md-7 float-left">
                    <div style={{ marginBottom: "10px" }}
                          class="lblChkBox"
                        >
                          <input
                            type="checkbox"
                            id="visitValue"
                            name="visitValue"
                            checked={visitValue}
                            onClick={this.handleCheckVisit}
                          />
                          <label for="reportTaxID">
                            <span></span>
                          </label>
                       </div>
                    </div>
                    <div class="invalid-feedback">
                    </div>
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
                  Heading="AGING REPORT 1"
                  // disabled={this.isDisabled(this.props.rights.export)}
                  dataObj={this.state.searchModel}
                  url={this.url}
                  methodName="Export"
                  methodNamePdf="ExportPdf"
                  length={this.state.data.length}
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

export default connect(mapStateToProps, matchDispatchToProps)(AgingReport1);
