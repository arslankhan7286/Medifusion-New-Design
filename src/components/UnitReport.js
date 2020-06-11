import React, { Component, Fragment } from "react";
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
import SearchHeading from "./SearchHeading";

import axios from "axios";
import Swal from "sweetalert2";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import moment from "moment";
class UnitReport extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/RAnesthesiaUnit/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      patientAccountNumber: "",
      providerName: "",
      dateOfServiceFrom: "",
      dateOfServiceTo: "",
      entryDateFrom: "",
      entryDateTo: "",
      submittedDateTo: "",
      submittedDateFrom: "",
      IncludePhysicalStatus: false
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
      IncludePhysicalStatus: false,
      data: []
    };
    this.handleCheck = this.handleCheck.bind(this);
  }

  //search Creteria
  searchUnitReports = e => {
    this.setState({ loading: true });
    e.preventDefault();

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
      .post(
        this.url + "FindAnesthesiaUnitReports",
        this.state.searchModel,
        this.config
      )
      .then(response => {
        console.log("Unit Report Search Response Object : ", response);
        let newList = [];
        if (response.data) {
          console.log("Unit Report Search Response : ", response.data);

          response.data.map((row, i) => {
            newList.push({
            
              patientAccountNumber: row.patientAccountNumber,
              patientName:
                this.isNull(row.patientName) == true ? " " : row.patientName,
              providerName:
                this.isNull(row.providerName) == true ? " " : row.providerName,
              claimCreatedDate:
                this.isNull(row.claimCreatedDate) == true
                  ? " "
                  : row.claimCreatedDate,
              insuranceName:
                this.isNull(row.insuranceName) == true
                  ? " "
                  : row.insuranceName,
              dateOfService:
                this.isNull(row.dateOfService) == true
                  ? " "
                  : row.dateOfService,
              pos: this.isNull(row.pos) == true ? " " : row.pos,
              cpt: this.isNull(row.cpt) == true ? " " : row.cpt,
              description:
                this.isNull(row.description) == true ? " " : row.description,
              moD1: this.isNull(row.moD1) == true ? " " : row.moD1,
              moD2: this.isNull(row.moD2) == true ? " " : row.moD2,
              startTime:
                this.isNull(row.startTime) == true ? " " : row.startTime,
              endTime: this.isNull(row.endTime) == true ? " " : row.endTime,
              totalTime:
                this.isNull(row.totalTime) == true ? " " : row.totalTime,
              totalMin: this.isNull(row.totalMin) == true ? " " : row.totalMin,
              timeUnits:
                this.isNull(row.timeUnits) == true ? " " : row.timeUnits,
              baseUnits:
                this.isNull(row.baseUnits) == true ? " " : row.baseUnits,
              //  modifierUnits :this.isNull(row.modifierUnits) == true? " ":row.modifierUnits,
              totalUnits:
                this.isNull(row.totalUnits) == true ? " " : row.totalUnits,
              chargeAmount:
                this.isNull(row.chargeAmount) == true ? " " : row.chargeAmount,
              charges: this.isNull(row.charges) == true ? " " : row.charges
            });
          });
        }

        this.setState({
          data: newList,
          loading: false
        });
        //  else{
        //   this.setState({
        //     data: newList,
        //     loading: false
        //   });
        //  }
        console.log("new data", response.data);
      })
      .catch(error => {
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
  handleCheck() {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        IncludePhysicalStatus: !this.state.searchModel.IncludePhysicalStatus
      }
    });
  }

  render() {
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

    const data = {
      columns: [
 
        {
          label: "PATIENT ACC #",
          field: "patientAccountNumber",
          sort: "asc",
          width: 150
        },
        {
          label: "PATIENT NAME",
          field: "patientName",
          sort: "asc",
          width: 270
        },
        {
          label: "PROVIDER NAME",
          field: "providerName",
          sort: "asc",
          width: 200
        },
        {
          label: "CLAIM CREATED DATE",
          field: "claimCreatedDate",
          sort: "asc",
          width: 100
        },
        {
          label: "ISURANCE NAME",
          field: "insuranceName",
          sort: "asc",
          width: 150
        },
        {
          label: "DATE OF SERVICE",
          field: "dateOfService",
          sort: "asc",
          width: 100
        },
        {
          label: "POS",
          field: "pos",
          sort: "asc",
          width: 100
        },
        {
          label: "CPT",
          field: "cpt",
          sort: "asc",
          width: 100
        },
        {
          label: "DESCRIPTION",
          field: "description",
          sort: "asc",
          width: 100
        },
        {
          label: "MOD 1",
          field: "moD1",
          sort: "asc",
          width: 100
        },
        {
          label: "MOD 2",
          field: "moD2",
          sort: "asc",
          width: 100
        },
        {
          label: "START TIME",
          field: "startTime",
          sort: "asc",
          width: 100
        },
        {
          label: "END TIME",
          field: "endTime",
          sort: "asc",
          width: 100
        },
        {
          label: "TOTAL TIME",
          field: "totalTime",
          sort: "asc",
          width: 100
        },
        {
          label: "TOTAL MIN",
          field: "totalMin",
          sort: "asc",
          width: 100
        },
        {
          label: "TIME UNITS",
          field: "timeUnits",
          sort: "asc",
          width: 100
        },
        {
          label: "BASE UNITS",
          field: "baseUnits",
          sort: "asc",
          width: 100
        },
        {
          label: "TOTAL UNITS",
          field: "totalUnits",
          sort: "asc",
          width: 100
        },
        {
          label: "CHARGE AMOUNT",
          field: "chargeAmount",
          sort: "asc",
          width: 100
        },
        {
          label: "CHARGES",
          field: "charges",
          sort: "asc",
          width: 100
        }
      ],
      rows: this.state.data
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

    return (
      <React.Fragment>
        {spiner}
        <div class="container-fluid">
        <div class="header pt-3">
      <h6>
        <span class="h4">ANESTHESIA UNIT REPORTS</span>
      
      </h6>
    </div>

          <div
            class="clearfix"
            style={{ borderBottom: "1px solid #037592" }}
          ></div>

          <div class="row">
            <div class="col-md-12 col-sm-12 pt-3 provider-form">
              <form class="needs-validation form-group" 
               onSubmit={(event) => {
                    this.searchUnitReports(event);
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
                      <label for="providerName">Provider Name</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="Provider Name"
                        name="providerName"
                        id="providerName"
                        maxLength="35"
                        value={this.state.searchModel.providerName}
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
                    Heading="PATIENT SEARCH RESULT"
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

export default connect(mapStateToProps, matchDispatchToProps)(UnitReport);
