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
import moment from "moment";
import Select, { components } from "react-select";
import { withRouter } from "react-router-dom";
import GridHeading from "./GridHeading";
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
import { Multiselect } from "multiselect-react-dropdown";

export class PatientVisitReport extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/RPatientVisit/";
    this.Detailurl = process.env.REACT_APP_URL + "/RDetailedBillingReport/";
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      patientName: "",
      providerName: "",
      dateOfServiceFrom: "",
      dateOfServiceTo: "",
      entryDateFrom: "",
      entryDateTo: "",
      submittedDateTo: "",
      submittedDateFrom: "",
      providerID: ""
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
      Simpledata: [],
      loading: false,
      plainArray: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
      simpleReport: false,
      reports: "complete",
      Export: "",
      CptData: [],
      Revenuedata: [],
      DetailReport: [],
      providerID: {}
    };
    this.handleCheck = this.handleCheck.bind(this);
    this.handleProviderChange = this.handleProviderChange.bind(this);
  }

  //search Creteria
  searchPatientVisits = e => {
    console.log("Model for search:", this.state.searchModel);
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

    console.log("Report Type : ", this.state.reports);
    if (this.state.reports == "complete") {
      axios
        .post(
          this.url + "FindPatientVisitReports",
          this.state.searchModel,
          this.config
        )
        .then(response => {
          console.log("Patient Visit Report Search Response : ", response.data);
          let newList = [];
          response.data.map((row, i) => {
            newList.push({
             claimID: this.isNull(row.claimID) == true ? " " : row.claimID,
              submissionDate:
                this.isNull(row.submissionDate) == true
                  ? " "
                  : row.submissionDate,
              patientLastName:
                this.isNull(row.patientLastName) == true
                  ? " "
                  : row.patientLastName,
              patientFirstName:
                this.isNull(row.patientFirstName) == true
                  ? " "
                  : row.patientFirstName,

              middleInitial:
                this.isNull(row.middleInitial) == true
                  ? " "
                  : row.middleInitial,
              dateOfBirth:
                this.isNull(row.dateOfBirth) == true ? " " : row.dateOfBirth,
              patientGender:
                this.isNull(row.patientGender) == true
                  ? " "
                  : row.patientGender,
              ssn: this.isNull(row.ssn) == true ? " " : row.ssn,
              primaryInsurance:
                this.isNull(row.primaryInsurance) == true
                  ? " "
                  : row.primaryInsurance,
              primaryPolicyNumber:
                this.isNull(row.primaryPolicyNumber) == true
                  ? " "
                  : row.primaryPolicyNumber,
              secondaryInsurance:
                this.isNull(row.secondaryInsurance) == true
                  ? " "
                  : row.secondaryInsurance,
              secondaryPolicyNumber:
                this.isNull(row.secondaryPolicyNumber) == true
                  ? " "
                  : row.secondaryPolicyNumber,
              otherInsurance:
                this.isNull(row.otherInsurance) == true
                  ? " "
                  : row.otherInsurance,
              otherPolicyNumber:
                this.isNull(row.otherPolicyNumber) == true
                  ? " "
                  : row.otherPolicyNumber,
              dateOfService:
                this.isNull(row.dateOfService) == true
                  ? " "
                  : row.dateOfService,
              providerName:
                this.isNull(row.providerName) == true ? " " : row.providerName,
              individualNPI:
                this.isNull(row.individualNPI) == true
                  ? " "
                  : row.individualNPI,
              referringPhysicianName:
                this.isNull(row.referringPhysicianName) == true
                  ? " "
                  : row.referringPhysicianName,
              facilityName:
                this.isNull(row.facilityName) == true ? " " : row.facilityName,
              cpt: this.isNull(row.cpt) == true ? " " : row.cpt,
              pos: this.isNull(row.pos) == true ? " " : row.pos,
              cptDescription:
                this.isNull(row.shortCptDescription) == true
                  ? row.shortCptDescription
                  : row.cptDescription,
              mod1: this.isNull(row.moD1) == true ? " " : row.moD1,
              mod2: this.isNull(row.moD2) == true ? " " : row.moD2,
              dx1: this.isNull(row.dx1) == true ? " " : row.dx1,
              dx2: this.isNull(row.dx2) == true ? " " : row.dx2,
              dx3: this.isNull(row.dx3) == true ? " " : row.dx3,
              dx4: this.isNull(row.dx4) == true ? " " : row.dx4,
              charges: this.isNull(row.charges) == true ? " " : row.charges,
              allowedAmount:
                this.isNull(row.allowedAmount) == true
                  ? " "
                  : row.allowedAmount,
              paidAmount:
                this.isNull(row.paidAmount) == true ? " " : row.paidAmount,
              adjustmentAmount:
                this.isNull(row.adjustmentAmount) == true
                  ? " "
                  : row.adjustmentAmount,
              balance: this.isNull(row.balance) == true ? " " : row.balance
            });
          });
          this.setState({
            data: newList,
            loading: false
          });
          console.log("new data", response.data);
        })

        .catch(error => {
          this.setState({ loading: false });
          Swal.fire(
            "Something Wrong",
            "Please Check Server Connection",
            "error"
          );
          let errorsList = [];
          if (error.response !== null && error.response.data !== null) {
            errorsList = error.response.data;
            console.log(errorsList);
          } else console.log(error);
        });
    } else if (this.state.reports == "Simple") {
      axios
        .post(
          this.url + "FindSimplePatientVisitReports",
          this.state.searchModel,
          this.config
        )
        .then(response => {
          let simpleList = [];
          response.data.map((row, i) => {
            simpleList.push({
         
              patientName:
                this.isNull(row.patientName) == true ? " " : row.patientName,
              insuranceName:
                this.isNull(row.insuranceName) == true
                  ? " "
                  : row.insuranceName,
              dateOfService:
                this.isNull(row.dateOfService) == true
                  ? " "
                  : row.dateOfService,
              cpt: this.isNull(row.cpt) == true ? " " : row.cpt,
              pos: this.isNull(row.pos) == true ? " " : row.pos,
              charges: this.isNull(row.charges) == true ? " " : row.charges,
              submissionDate:
                this.isNull(row.submissionDate) == true
                  ? " "
                  : row.submissionDate
            });
          });
          this.setState({
            Simpledata: simpleList,
            loading: false
          });
          console.log("new data", response.data);
        });
    } else if (this.state.reports == "Paid") {
      axios
        .post(
          this.url + "FindPatientVisitTotalCountPaid",
          this.state.searchModel,
          this.config
        )
        .then(response => {
          console.log("CPTList Visit Report Simple Search  : ", response.data);
          let CPTList = [];
          response.data.map((row, i) => {
            CPTList.push({
       
              patientName:
                this.isNull(row.patientName) == true ? " " : row.patientName,
              insuranceName:
                this.isNull(row.payerName) == true ? " " : row.payerName,
              dateOfService:
                this.isNull(row.dateOfService) == true
                  ? " "
                  : row.dateOfService,
              cpt: this.isNull(row.cpt) == true ? " " : row.cpt,
              pos: this.isNull(row.pos) == true ? " " : row.pos,
              submissionDate:
                this.isNull(row.submissionDate) == true
                  ? " "
                  : row.submissionDate,
              submissionDate:
                this.isNull(row.submissionDate) == true
                  ? " "
                  : row.submissionDate,
              paymentDate:
                this.isNull(row.paymentDate) == true ? " " : row.paymentDate,
              secondaryPaymentDate:
                this.isNull(row.secondaryPaymentDate) == true
                  ? " "
                  : row.secondaryPaymentDate
            });
          });
          this.setState({
            CptData: CPTList,
            loading: false
          });
        });
    } else if (this.state.reports == "Revenue") {
      axios
        .post(
          this.url + "FindPatientVisitTotalCountBilledRev",
          this.state.searchModel,
          this.config
        )
        .then(response => {
          console.log("FindPatientVisitTotalCountBilledRev:", response.data);
          let RevenueList = [];
          response.data.map((row, i) => {
            RevenueList.push({
          
              patientName:
                this.isNull(row.patientName) == true ? " " : row.patientName,
              payerName:
                this.isNull(row.payerName) == true ? " " : row.payerName,
              dateOfService:
                this.isNull(row.dateOfService) == true
                  ? " "
                  : row.dateOfService,
              cpt: this.isNull(row.cpt) == true ? " " : row.cpt,
              pos: this.isNull(row.pos) == true ? " " : row.pos,
              charges: this.isNull(row.charges) == true ? " " : row.charges,
              payment: this.isNull(row.payment) == true ? " " : row.payment,
              collectedRevenue:
                this.isNull(row.collectedRevenue) == true
                  ? " "
                  : row.collectedRevenue,
              balance: this.isNull(row.balance) == true ? " " : row.balance,
              averageRevenue:
                this.isNull(row.averageRevenue) == true
                  ? " "
                  : row.averageRevenue,
              submissionDate:
                this.isNull(row.submissionDate) == true
                  ? " "
                  : row.submissionDate,
              paymentDate:
                this.isNull(row.paymentDate) == true ? " " : row.paymentDate,
              secondaryPaymentDate:
                this.isNull(row.secondaryPaymentDate) == true
                  ? " "
                  : row.secondaryPaymentDate
            });
          });
          this.setState({
            Revenuedata: RevenueList,
            loading: false
          });
          console.log("new data", response.data);
        });
    } else if (this.state.reports == "Detail") {
      axios
        .post(
          this.Detailurl + "FindDetailedBillingReport",
          this.state.searchModel,
          this.config
        )
        .then(response => {
          console.log("FindDetailedBillingReport:", response.data);
          let DetailList = [];
          response.data.map((row, i) => {
            DetailList.push({
         
              prescribingMD:
                this.isNull(row.prescribingMD) == true
                  ? " "
                  : row.prescribingMD,
              charges: this.isNull(row.charges) == true ? " " : row.charges,
              balance: this.isNull(row.balance) == true ? " " : row.balance,
              averageRevenue:
                this.isNull(row.averageRevenue) == true
                  ? " "
                  : row.averageRevenue
            });
          });
          this.setState({
            DetailReport: DetailList,
            loading: false
          });
          console.log("new data", response.data);
        });
    }
  };
  handleChangeGrid = (event) => {
    console.log("handleChangeGrid", event.target.value);
    event.preventDefault();
    this.setState({
      reports: event.target.value,
      data: [],
      Simpledata: [],
      CptData: [],
      Revenuedata: [],
      DetailReport: [],
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
    //event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });
  };
  handleProviderChange(event) {
    console.log("Event :", event);

    if (event) {
      this.setState({
        providerID: event,
        searchModel: {
          ...this.state.searchModel,
          providerID: event.id
        }
      });
    } else {
      this.setState({
        providerID: null,
        searchModel: {
          ...this.state.searchModel,
          providerID: null
        }
      });
    }
  }
  handleChangeGrid = event => {
    console.log("handleChangeGrid", event.target.value);
    event.preventDefault();
    this.setState({
      reports: event.target.value
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
      validationModel: myVal,
      providerID: this.state.searchModel.providerID
    });
  };
  handleCheck() {
    this.setState({
      ...this.state.searchModel,
      simpleReport: !this.state.simpleReport
    });
  }
  ExportExcel = () => {
    if (this.state.Export == "Export") {
      return "Export";
    } else if (this.state.Export == "ExportSimple") {
      return "ExportSimple";
    }
  };

  render() {
    const reports = [
      { value: "complete", display: "Patient Visit Report" },
      { value: "Simple", display: "Total Count Billed By CPT Report" },
      { value: "Paid", display: "Total Count Paid By CPT Report" },
      { value: "Revenue", display: "Total Revenue Collect By Cpt Report" },
      { value: "Detail", display: "Detail Billing Report" }
    ];
    const { plainArray } = this.state;
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
          label: "VISIT #",
          field: "claimID",
          sort: "asc",
          width: 270
        },
        {
          label: "SUBMISSION DATE",
          field: "submissionDate",
          sort: "asc",
          width: 200
        },
        {
          label: "PT LAST NAME",
          field: "patientLastName",
          sort: "asc",
          width: 150
        },
        {
          label: "PT FIRST NAME",
          field: "patientFirstName",
          sort: "asc",
          width: 100
        },

        {
          label: "MIDDLE INITIAL",
          field: "middleInitial",
          sort: "asc",
          width: 100
        },
        {
          label: "DOB",
          field: "dateOfBirth",
          sort: "asc",
          width: 100
        },
        {
          label: "PATIENT GENDER",
          field: "patientGender",
          sort: "asc",
          width: 100
        },
        {
          label: "SSN",
          field: "ssn",
          sort: "asc",
          width: 100
        },
        {
          label: "PRI INSURANCE",
          field: "primaryInsurance",
          sort: "asc",
          width: 100
        },
        {
          label: "PRI SUBSCRIBER ID",
          field: "primaryPolicyNumber",
          sort: "asc",
          width: 100
        },
        {
          label: "SEC INSURANCE",
          field: "secondaryInsurance",
          sort: "asc",
          width: 100
        },
        {
          label: "SEC SUBSCRIBER ID",
          field: "secondaryPolicyNumber",
          sort: "asc",
          width: 100
        },
        {
          label: "OTHER INSURANCE",
          field: "otherInsurance",
          sort: "asc",
          width: 100
        },
        {
          label: "OTHER SUBSCRIBER ID",
          field: "otherPolicyNumber",
          sort: "asc",
          width: 100
        },
        {
          label: "DOS",
          field: "dateOfService",
          sort: "asc",
          width: 100
        },
        {
          label: "PROVIDER NAME",
          field: "providerName",
          sort: "asc",
          width: 100
        },
        {
          label: "INDIVIDUAL NPI",
          field: "individualNPI",
          sort: "asc",
          width: 100
        },
        {
          label: "REF PROVIDER",
          field: "referringPhysicianName",
          sort: "asc",
          width: 100
        },
        {
          label: "LOCATION",
          field: "facilityName",
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
          label: "POS",
          field: "pos",
          sort: "asc",
          width: 100
        },
        {
          label: "CPT DESCRIPTION",
          field: "cptDescription",
          sort: "asc",
          width: 100
        },

        {
          label: "MOD 1",
          field: "mod1",
          sort: "asc",
          width: 100
        },

        {
          label: "MOD 2",
          field: "mod2",
          sort: "asc",
          width: 100
        },
        {
          label: "DX 1",
          field: "dx1",
          sort: "asc",
          width: 100
        },
        {
          label: "DX 2",
          field: "dx2",
          sort: "asc",
          width: 100
        },
        {
          label: "DX 3",
          field: "dx3",
          sort: "asc",
          width: 100
        },
        {
          label: "DX 4",
          field: "dx4",
          sort: "asc",
          width: 100
        },
        {
          label: "CHARGES",
          field: "charges",
          sort: "asc",
          width: 100
        },
        {
          label: "ALLOWED AMOUNT",
          field: "allowedAmount",
          sort: "asc",
          width: 100
        },
        {
          label: "PAID AMOUNT",
          field: "paidAmount",
          sort: "asc",
          width: 100
        },
        {
          label: "ADJUSTMENT AMOUNT",
          field: "adjustmentAmount",
          sort: "asc",
          width: 100
        },
        {
          label: "BALANCE",
          field: "balance",
          sort: "asc",
          width: 100
        }
      ],
      rows: this.state.data
    };

    const Simpledata = {
      columns: [

        {
          label: "PATIENT NAME",
          field: "patientName",
          sort: "asc",
          width: 100
        },
        {
          label: "INSURANCE NAME",
          field: "insuranceName",
          sort: "asc",
          width: 100
        },

        {
          label: "DOS",
          field: "dos",
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
          label: "POS",
          field: "pos",
          sort: "asc",
          width: 100
        },
        {
          label: "CHARGES",
          field: "charges",
          sort: "asc",
          width: 100
        },
        {
          label: "SUBMISSION DATE",
          field: "submissionDate",
          sort: "asc",
          width: 100
        }
      ],
      rows: this.state.Simpledata
    };
    const DetailReport = {
      columns: [
  
        {
          label: "PRESCRIBING MD NAME",
          field: "prescribingMD",
          sort: "asc",
          width: 100
        },
        {
          label: "SUM OF CHARGES",
          field: "charges",
          sort: "asc",
          width: 100
        },

        {
          label: "SUM OF COLLECTED REVENUE",
          field: "balance",
          sort: "asc",
          width: 100
        },
        {
          label: "AVEREGE REVENUE",
          field: "averageRevenue",
          sort: "asc",
          width: 100
        }
      ],
      rows: this.state.DetailReport
    };

    const CptData = {
      columns: [
 

        {
          label: "PATIENT NAME",
          field: "patientName",
          sort: "asc",
          width: 100
        },
        {
          label: "INSURANCE NAME",
          field: "insuranceName",
          sort: "asc",
          width: 100
        },

        {
          label: "DOS",
          field: "dos",
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
          label: "POS",
          field: "pos",
          sort: "asc",
          width: 100
        },
        {
          label: "SUBMISSION DATE",
          field: "submissionDate",
          sort: "asc",
          width: 100
        },
        {
          label: "PAYMENT DATE",
          field: "paymentDate",
          sort: "asc",
          width: 100
        },
        {
          label: "SECONDARY PAYMENT DATE",
          field: "secondaryPaymentDate",
          sort: "asc",
          width: 100
        }
      ],
      rows: this.state.CptData
    };
    const Revenuedata = {
      columns: [
  
        {
          label: "PATIENT NAME",
          field: "patientName",
          sort: "asc",
          width: 100
        },
        {
          label: "INSURANCE NAME",
          field: "payerName",
          sort: "asc",
          width: 100
        },

        {
          label: "DOS",
          field: "dos",
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
          label: "POS",
          field: "pos",
          sort: "asc",
          width: 100
        },
        {
          label: "CHARGES",
          field: "charges",
          sort: "asc",
          width: 100
        },
        {
          label: "PAYMENT",
          field: "payment",
          sort: "asc",
          width: 100
        },
        {
          label: "COLLECTED REVENUE",
          field: "collectedRevenue",
          sort: "asc",
          width: 100
        },
        {
          label: "BALANCE",
          field: "balance",
          sort: "asc",
          width: 100
        },
        {
          label: "AVEREGE REVENUE",
          field: "averegeRvaniue",
          sort: "asc",
          width: 100
        },
        {
          label: "SUBMISSION DATE",
          field: "submissionDate",
          sort: "asc",
          width: 100
        },
        {
          label: "PAYMENT DATE",
          field: "paymentDate",
          sort: "asc",
          width: 100
        },
        {
          label: "SECONDARY PAYMENT DATE",
          field: "secondaryPaymentDate",
          sort: "asc",
          width: 100
        }
      ],
      rows: this.state.Revenuedata
    };

    //Spinner
    let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="spiner">
          <GifLoader
            loading={true}
            imageSrc={Eclips}
            // imageStyle={imageStyle}
            overlayBackground="rgba(0,0,0,0.5)"
          />
        </div>
      );
    }

    const PaymentCriteria = [
      { value: "All", display: "All"},
      { value: "Paid", display: "Paid"},
      { value: "PartialPaid", display: "Partial Paid"},
      { value: "UnPaid", display: "Un Paid" },
      { value: "PatientBal", display: "Patient Bal"}
    ];


    return (
      <React.Fragment>
      {spiner}
    <div class="container-fluid">
    <div class="header pt-3">
  <h6>
    <span class="h4">PATIENT VISIT REPORT</span>
    <div class="float-right p-0 m-0 mb-2 col-md-0">
                {" "}
                <span class="gray-text f13 pl-2" style={{paddingRight:"30px"}}>SIMPLIFIED REPORT TYPE</span>
                <select
                  name="reports"
                  id="reports"
                  style={{ width: "250px"}}
               
                  value={this.state.reports}
                  onChange={this.handleChangeGrid}
                >
                  {reports.map((s) => (
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
           onSubmit={(event) => {this.searchPatientAuth(event);
              }}>
            <div class="row">


            <div class="col-md-3 mb-2">
                  <div class="col-md-4 float-left">
                    <label for="patientAccountNumber">Patient Name</label>
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
                  <label for="dateOfServiceFrom">DOS From</label>
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
                </div>
              </div>
              <div class="col-md-3 mb-2">
              <div class="col-md-4 float-left">
                  <label for="expiryDate">DOS To</label>
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
                        : this.state.searchModel.entrt
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
                  <label for="authorizationDateFrom">Submitted Date From</label>
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
                      this.state.searchModel.submittedDateFrom == null
                        ? ""
                        : this.state.searchModel.submittedDateFrom
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
                  <label for="cptCode">Prescribing MD\Attending</label>
                </div>
                <div class="col-md-7 float-left">
                <Input
                  type="text"
                  placeholder="Prescribing MD\Attending"
                  name="prescribingMD"
                  id="prescribingMD"
                  max="30"
                  value={this.state.searchModel.prescribingMD}
                  onChange={() => this.handleChange}
                />
                </div>
                <div class="invalid-feedback">
                  {" "}
                </div>
              </div>

              <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="status">
                      Payment Criteria
                      </label>
                    </div>
                    <div class="col-md-7 float-left">
                      <select name="state1" class="w-100" 
                       name="paymentCriteria"
                       id="paymentCriteria"
                       value={this.state.searchModel.paymentCriteria}
                       onChange={this.handleChange}>
                         {PaymentCriteria.map(s => (
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
      {this.state.reports == "complete" ? (
            <div className="card mb-4" style={{width:"100%"}}>
              <GridHeading
                Heading="PATIENT VISIT REPORT"
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

          ) : null}
            {this.state.reports == "Simple" ? (
            <div className="card mb-4" style={{width:"100%"}}>
              <GridHeading
                Heading="TOTAL COUNT BILLED BY CPT"
                // disabled={this.isDisabled(this.props.rights.export)}
                dataObj={this.state.searchModel}
                url={this.url}
                methodName="ExportSimple"
                methodNamePdf="ExportSimplePdf"
                length={this.state.Simpledata.length}
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
                      data={Simpledata}
                      displayEntries={false}
                      sortable={true}
                      scrollX={false}
                      scrollY={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            
          ) : null}
          {this.state.reports == "Paid" ? (
            <div className="card mb-4" style={{width:"100%"}}>
              <GridHeading
                Heading="TOTAL COUNT PAID BY CPT"
                // disabled={this.isDisabled(this.props.rights.export)}
                dataObj={this.state.searchModel}
                url={this.url}
                methodName="ExportTotalCountPaid"
                methodNamePdf="ExportSimpleTotalCountPaid"
                length={this.state.CptData.length}
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
                      data={CptData}
                      displayEntries={false}
                      sortable={true}
                      scrollX={false}
                      scrollY={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            
          ) : null}
 {this.state.reports == "Revenue" ? (
            <div className="card mb-4" style={{width:"100%"}}>
              <GridHeading
                Heading="TOTAL REVENUE COLLECTED BY CPT"
                // disabled={this.isDisabled(this.props.rights.export)}
                dataObj={this.state.searchModel}
                url={this.url}
                methodName="ExportTotalCountBilledRev"
                methodNamePdf="ExportTotalCountBilledRevPdf"
                length={this.state.Revenuedata.length}
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
                      data={Revenuedata}
                      displayEntries={false}
                      sortable={true}
                      scrollX={false}
                      scrollY={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            
          ) : null}
          {this.state.reports == "Detail" ? (
            <div className="card mb-4" style={{width:"100%"}}>
              <GridHeading
                Heading="DETAIL BILLING"
                // disabled={this.isDisabled(this.props.rights.export)}
                dataObj={this.state.searchModel}
                url={this.url}
                methodName="Export"
                methodNamePdf="ExportPdf"
                length={this.state.DetailReport.length}
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
                      data={DetailReport}
                      displayEntries={false}
                      sortable={true}
                      scrollX={false}
                      scrollY={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            
          ) : null}

          </div>
       </div>

    </React.Fragment>
    );
  }
}

function mapStateToProps(state) {

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
          resubmit: state.loginInfo.rights.resubmitCharges
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

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(PatientVisitReport)
);
