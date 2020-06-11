import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  MDBBtn,
  MDBDataTable,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import $ from "jquery";

import axios from "axios";
import Swal from "sweetalert2";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import SearchHeading from "./SearchHeading";
import NewCharge from "./NewCharge";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import Label from "./Label";
import Input from "./Input";
import GPopup from "./GPopup";
import WriteoffPopup from "./WriteoffPopup";
import { saveAs } from "file-saver";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { setVisitGridData } from "../actions/SetVisitGridDataAction";

import NewPractice from "./NewPractice";
import NewLocation from "./NewLocation";
import NewProvider from "./NewProvider";
import NewInsurancePlan from "./NewInsurancePlan";
import { isNullOrUndefined } from "util";
import GridHeading from "./GridHeading";

import Hotkeys from "react-hot-keys";

class ChargeSearch extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Visit/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.startTime = 0;
    this.endTime = 0;

    //Search Model
    this.searchModel = {
      accountNUm: "",
      lastName: "",
      firstName: "",
      subscriberID: "",
      entryDateFrom: null,
      visitID: "",
      chargeID: "",

      payerID: "",

      chargeID: "",
      batchID: null,

      insuranceType: "",
      submissionType: "",

      dosFrom: null,
      dosTo: null,

      entryDateFrom: null,
      entryDateTo: null,

      submittedFromDate: null,
      submittedToDate: null,

      isSubmitted: true,
      plan: "",

      Practice: "",
      location: "",
      provider: "",
      isPaid: "",
      isChecked: false,
      CPTCode: "",
      status: "",

      ageType: "D",
    };

    //Validation Model
    this.validationModel = {
      dosFromFDValField: null,
      dosToFDValField: null,
      selectDOSFromValField: null,
      dosToGreaterValField: null,
      enterDateFromValField: null,
      enterDateToValField: null,
      selectEntryDateFromValField: null,
      entryDateToGreaterValField: null,
      submitDateFromValField: null,
      submitDateToValField: null,
      submitDateFromFDValField: null,
      submitDateToFDValField: null,
      enterSubmitDateFromValField: null,
      submitDateToGreaterValField: null,
      validation: false,
    };

    this.state = {
      selectedAll: false,
      searchModel: this.searchModel,
      validationModel: this.validationModel,
      data: [],
      gridData: this.props.visitGridData ? this.props.visitGridData : [],
      pickerOpen: false,
      selectedDate: null,
      showPopup: false,
      showWpopup: false,
      popupName: "",
      id: 0,

      output: "keydown",
    };
    this.selectedVisits = [];

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleNumericCheck = this.handleNumericCheck.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleDosFromChange = this.handleDosFromChange.bind(this);
    this.handleDosToChange = this.handleDosToChange.bind(this);
    this.handleEnterToChange = this.handleEnterToChange.bind(this);
    this.handleEnterFromChange = this.handleEnterFromChange.bind(this);
    this.closeChargePopup = this.closeChargePopup.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.handleTable = this.handleTable.bind(this);
    this.openChargePopup = this.openChargePopup.bind(this);
    this.openVisitScreen = this.openVisitScreen.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.searchPatientCharge = this.searchPatientCharge.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.closeWriteOffPopup = this.closeWriteOffPopup.bind(this);
    this.openWriteOffPopup = this.openWriteOffPopup.bind(this);
  }

  async UNSAFE_componentWillMount() {
    window.scrollTo(0, 0);
    try {
      if (this.props.location.query.status == "R") {
        var searchModel = { ...this.searchModel };
        searchModel.status = this.props.location.query.status;
        await this.setState({
          searchModel: searchModel,
        });

        this.searchPatientCharge();
      } else if
      (this.props.location.query.status == "DN") {
        var searchModel = { ...this.searchModel };
        searchModel.status = this.props.location.query.status;
        await this.setState({
          searchModel: searchModel,
        });

        this.searchPatientCharge();
      } else if (this.props.location.query.isSubmitted == "Y") {
        var searchModel = { ...this.searchModel };
        searchModel.status = null;
        searchModel.isChecked = true;
        searchModel.entryDateFrom = this.props.location.query.entryDateFrom;
        await this.setState({
          searchModel: searchModel,
        });

        this.searchPatientCharge();
      } else {
      }
    } catch {}
    try {
      if (this.props.patientInfo.accNum > 0) {
        var searchModel = { ...this.searchModel };
        searchModel.accountNUm = this.props.patientInfo.accNum;
        await this.setState({
          searchModel: searchModel,
        });
        this.searchPatientCharge();
      }
    } catch {}
  }

  isChecked = async (id) => {
    var checked = (await this.selectedVisits.filter((name) => name == id)[0])
      ? true
      : false;
    return checked;
  };

  toggleCheck = async (e) => {
    let checkedArr = this.state.selectedAll ? [] : this.selectedVisits;

    var id = e.target.id;

    var cbRow = await checkedArr.filter((name) => name === Number(id));
    console.log("CB Row ; ", cbRow);
    cbRow.length > 0
      ? (checkedArr = await checkedArr.filter((name) => name !== Number(id)))
      : checkedArr.push(Number(id));

    this.selectedVisits = checkedArr;
    let newList = [...this.state.gridData];
    await this.state.gridData.map((row, i) => {
      if (cbRow.length > 0) {
        newList[i].isChecked =
          cbRow[0] == row.visitID ? false : newList[i].isChecked;
      } else {
        newList[i].isChecked = row.visitID == id ? true : newList[i].isChecked;
      }
    });

    this.setState({
      gridData: newList,
      selectedAll: false,
    });
  };

  onKeyUp(keyName, e, handle) {
    this.setState({
      output: `onKeyUp ${keyName}`,
    });
  }

  onKeyDown(keyName, e, handle) {
    if (keyName == "alt+s") {
      // alert("search key")
      this.searchPatientCharge();
    } else if (keyName == "alt+c") {
      // alert("clear skey")
      this.clearFields();
    } else if (keyName == "alt+n") {
      // alert("new key")
      this.openVisitScreen(0);
    }
    this.setState({
      output: `onKeyDown ${keyName}`,
    });
  }

  openPopup = (event, name, id) => {
    event.preventDefault();
    this.setState({ popupName: name, id: id });
  };

  closePopup = () => {
    // $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  handleChange = (event) => {
    if (
      event.target.name === "dosFrom" ||
      event.target.name === "dosTo" ||
      event.target.name === "entryDateFrom" ||
      event.target.name === "entryDateTo" ||
      event.target.name === "submittedFromDate" ||
      event.target.name === "submittedToDate"
    ) {
    } else {
      const caret = event.target.selectionStart;
      const element = event.target;
      window.requestAnimationFrame(() => {
        element.selectionStart = caret;
        element.selectionEnd = caret;
      });
    }

    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]:
          event.target.value == "null"
            ? null
            : event.target.value.toUpperCase(),
      },
    });
  };

  val(value) {
    if (isNullOrUndefined(value)) return " ";
    else return value;
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

  async searchPatientCharge() {
    var myVal = this.validationModel;
    myVal.validation = false;

    //if DOs To is selected Then Make sure than DOS Form is also selected Validation
    if (
      this.isNull(this.state.searchModel.dosFrom) == true &&
      this.isNull(this.state.searchModel.dosTo) == false
    ) {
      myVal.selectDOSFromValField = (
        <span className="validationMsg">Select DOS From</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectDOSFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //DOS To must be greater than DOS From Validation
    if (
      this.isNull(this.state.searchModel.dosFrom) == false &&
      this.isNull(this.state.searchModel.dosTo) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.dosFrom).format().slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.dosTo).format().slice(0, 10)
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

    //DOS From Future Date Validation
    if (this.isNull(this.state.searchModel.dosFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.dosFrom).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.dosFromFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.dosFromFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.dosFromFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //DOS To Future Date Validation
    if (this.isNull(this.state.searchModel.dosTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.dosTo).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
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

    //if Entry Date To is selected Then Make sure than Entry Date Form is also selected Validation
    if (
      this.isNull(this.state.searchModel.entryDateFrom) == true &&
      this.isNull(this.state.searchModel.entryDateTo) == false
    ) {
      myVal.selectEntryDateFromValField = (
        <span className="validationMsg">Select Entry Date From</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectEntryDateFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //DOS To must be greater than DOS From Validation
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

    //Enter Date From Future Date Validation
    if (this.isNull(this.state.searchModel.entryDateFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.entryDateFrom).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.enterDateFromValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.enterDateFromValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.enterDateFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Enter Date To Future Date Validation
    if (this.isNull(this.state.searchModel.entryDateTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.entryDateTo).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.enterDateToValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.enterDateToValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.enterDateToValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //if Submit Date To is selected Then Make sure than Submit Date Form is also selected Validation
    if (
      this.isNull(this.state.searchModel.submittedFromDate) == true &&
      this.isNull(this.state.searchModel.submittedToDate) == false
    ) {
      myVal.submitDateFromValField = (
        <span className="validationMsg">Select Submit Date From</span>
      );
      myVal.validation = true;
    } else {
      myVal.submitDateFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Submit To must be greater than Submit From Validation
    if (
      this.isNull(this.state.searchModel.submittedFromDate) == false &&
      this.isNull(this.state.searchModel.submittedToDateDateTo) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.submittedFromDate).format().slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.submittedToDate).format().slice(0, 10)
        ).getTime()
      ) {
        myVal.submitDateToGreaterValField = (
          <span className="validationMsg">
            Submit Date To must be greater than Submit Date From
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.submitDateToGreaterValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.submitDateToGreaterValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Submit Enter Date From Future Date Validation
    if (this.isNull(this.state.searchModel.submittedFromDate) == false) {
      if (
        new Date(
          moment(this.state.searchModel.submittedFromDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.submitDateFromFDValField = (
          <span className="validationMsg">
            Future Submit date can't be selected
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.submitDateFromFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.submitDateFromFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Submit Enter Date To Future Date Validation
    if (this.isNull(this.state.searchModel.submittedToDate) == false) {
      if (
        new Date(
          moment(this.state.searchModel.submittedToDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.submitDateToFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.submitDateToFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.submitDateToFDValField = null;
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

    await this.setState({ loading: true });
    await axios
      .post(this.url + "FindVisits", this.state.searchModel, this.config)

      .then(async (response) => {
        var newList = response.data;
        await response.data.map((row, index) => {
          newList.isChecked = false;
        });
        this.setState({
          gridData: newList,
          data: [],
          loading: false,
        });
        this.props.setVisitGridData(response.data);
      })
      .catch((error) => {
        this.setState({ loading: false });

        if (error.response) {
          if (error.response.status == 404) {
            this.setState({ data: [] });
            Swal.fire("No Record Found", "", "error");
          } else {
            Swal.fire("Something Wrong", "Please Try Again", "error");
            this.setState({ data: [] });
          }
        } else {
          this.setState({ data: [] });
          Swal.fire("Something Wrong", "Please Try Again", "error");
        }
      });
  }

  //Charge Search
  handleSearch = (event) => {
    event.preventDefault();
    this.searchPatientCharge();
    // if (event.charCode == 13) {
    //   event.preventDefault();

    //   this.searchPatientCharge();
    // }
  };

  async clearFields() {
    await this.setState({ searchModel: this.searchModel, selectedAll: false });

    this.searchPatientCharge();
  }

  handleNumericCheck(event) {
    if (event.charCode == 13) {
      event.preventDefault();
      this.searchPatientCharge();
    } else if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  handleCheck() {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        active: !this.state.searchModel.active,

        isChecked: !this.state.searchModel.isChecked,
      },
    });
  }

  handleDosFromChange = (date) => {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        dosFrom: date,
      },
    });
  };

  handleDosToChange = (date) => {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        dosTo: date,
      },
    });
  };

  handleEnterToChange = (date) => {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        entryDateTo: date,
      },
    });
  };

  handleEnterFromChange = (date) => {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        entryDateFrom: date,
      },
    });
  };

  openChargePopup(id) {
    this.selectedVisits = [];
    this.setState({ showPopup: true, id: id });
  }

  closeChargePopup = () => {
    $("#myModal").hide();
    this.setState({ showPopup: false });
    this.selectedVisits = [];
    this.searchPatientCharge();
  };

  openVisitScreen(event, id) {
    event.preventDefault();
     this.selectedVisits = [];
    this.setState({ selectedAll: false });
    this.searchPatientCharge();
    this.props.selectTabAction("NewCharge", id);
    this.props.setVisitGridData(this.state.gridData);
    this.props.history.push("/NewCharge");
  }

  controlYearLength(event) {
    var date = new Date(event.target.value);
    var date1 = date.getFullYear().toString();
    if (date1.length >= 4) {
      event.preventDefault();
      return;
    }
    return true;
  }

  handleDateChange(event) {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        dosFrom: event.target.value,
      },
    });
  }

  handleTable() {}

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }
  exportExcel = () => {
    this.setState({ loading: true });
    if (this.state.gridData.length > 0) {
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

          saveAs(blob, "Charges.xlsx");
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

  AtomizedStatement = () => {
    if (this.selectedVisits.length == 0) {
      Swal.fire("", "Select Visits", "warning");
      return;
    }

    this.setState({ loading: true });
    if (this.state.gridData.length > 0) {
      let visitIDList = this.selectedVisits;

      let ptIDList = [];
      for (var j = 0; j < visitIDList.length; j++) {
        for (var i = 0; i < this.state.gridData.length; i++) {
          if (visitIDList[j] == this.state.gridData[i].visitID) {
            ptIDList.filter((id) => id == this.state.gridData[i].patientID)
              .length == 0
              ? ptIDList.push(this.state.gridData[i].patientID)
              : console.log("asd");
          }
        }
      }
      this.selectedpatient = ptIDList;
      var patientID = this.selectedpatient.toString();
      axios
        .post(
          this.url + "GenerateItemizedStatement",
          { ids: this.selectedVisits },
          {
            params: {
              patientID: patientID,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer  " + this.props.loginObject.token,
              Accept: "*/*",
            },
            responseType: "blob",
          }
        )
        .then(function (res) {
          console.log("response", res);
          var blob = new Blob([res.data], {
            type: "application/zip",
          });
          console.log("blog::", blob);

          saveAs(blob, "Report.zip");
          this.setState({ loading: false });
        })
        .catch((error) => {
          this.setState({ loading: false });
        });
    } else {
      Swal.fire({
        type: "error",
        text: "Please Select Records",
      });
      this.setState({ loading: false });
    }
  };

  selectALL = async (e) => {
    // let newValue = !this.state.selectedAll;
    console.log("Selected Visits : ", this.selectedVisits);
    this.selectedVisits = [];

    let newList = [...this.state.gridData];
    await this.state.gridData.map((row, i) => {
      newList[i].isChecked = false;
    });

    this.setState({
      gridData: newList,
      selectedAll: false,
      selectedAll: !this.state.selectedAll,
    });

    // let newList = this.state.gridData;
    // this.selectedVisits = [];
    // await this.state.gridData.map((row, i) => {
    //   if (newValue === true) {
    //     this.selectedVisits.push(row.visitID);
    //     newList[i].isChecked = true;
    //   } else {
    //     newList[i].isChecked = false;
    //   }
    // });

    // await this.setState({ gridData: newList });
  };

  exportPdf = () => {
    this.setState({ loading: true });
    console.log("Hello");
    if (this.state.gridData.length > 0) {
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

          saveAs(blob, "Charges.pdf");
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

  openWriteOffPopup(event) {
    event.preventDefault();
    console.log("Visits :", this.selectedVisits.length);
    if (this.selectedVisits.length == 0) {
      Swal.fire("Select Visit to Apply Write-off", "", "error");
      return;
    } else {
      this.setState({ showWpopup: true });
    }
  }
  closeWriteOffPopup() {
    $("#myModal").hide();
    this.setState({ showWpopup: false });
    this.selectedVisits = [];
    this.searchPatientCharge();
  }

  render() {
    var addEnterFromDate = this.state.searchModel.entryDateFrom
      ? this.state.searchModel.entryDateFrom.slice(0, 10)
      : "";

    const status = [
      { value: "null", display: "ALL" },
      { value: "N", display: "NEW" },
      { value: "H", display: "PENDING" },
      { value: "S", display: "SUBMITTED" },
      { value: "RS", display: "RESUBMITTED" },
      { value: "K", display: "999 ACCEPTED" },
      { value: "D", display: "999 DENIED" },
      { value: "E", display: "999 HAS ERROR" },
      { value: "A1AY", display: "RECEIVED BY CLEARING HOUSE" },
      { value: "A0PR", display: "FORWARDED TO PAYER" },
      { value: "A1PR", display: "RECEIVED BY PAYER" },
      { value: "A2PR", display: "ACCEPTED BY PAYER" },
      { value: "R", display: "REJECTED" },
      { value: "DN", display: "DENIED" },
      { value: "P", display: "PAID" },
      { value: "PATBAL>0", display: "PATIENT BAL > 0" },
    ];

    var addEnterFromDate = this.state.searchModel.entryDateFrom
      ? this.state.searchModel.entryDateFrom.slice(0, 10)
      : "";
    var addEnterToDate = this.state.searchModel.entryDateTo
      ? this.state.searchModel.entryDateTo.slice(0, 10)
      : "";

    var addSubmitFromDate = this.state.searchModel.submittedFromDate
      ? this.state.searchModel.submittedFromDate.slice(0, 10)
      : "";
    var addSubmitToDate = this.state.searchModel.submittedToDate
      ? this.state.searchModel.submittedToDate.slice(0, 10)
      : "";

    var addDosFromDate = this.state.searchModel.dosFrom
      ? this.state.searchModel.dosFrom.slice(0, 10)
      : "";
    var addDosToDate = this.state.searchModel.dosTo
      ? this.state.searchModel.dosTo.slice(0, 10)
      : "";

    const submitted = [
      { value: "", display: "All" },
      { value: "N", display: "No" },
      { value: "Y", display: "Yes" },
    ];

    const subType = [
      { value: "", display: "All" },
      { value: "E", display: "Electronic" },
      { value: "P", display: "Paper" },
    ];

    const insType = [
      { value: "", display: "All" },
      { value: "P", display: "Primary" },
      { value: "S", display: "Secondray" },
      { value: "T", display: "Tertiary" },
    ];

    const paid = [
      { value: "", display: "All" },
      { value: "N", display: "No" },
      { value: "Y", display: "Yes" },
      { value: "P", display: "Partial" },
    ];

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

    let advaceSearch = (
      <React.Fragment>
        <div class="row">
          <div class="col-md-3 mb-2">
            <div class="col-md-4 float-left">
              <label for="DOSfrom">Enter Date from</label>
            </div>
            <div class="col-md-7 float-left">
              <input
                type="date"
                class="provider-form w-100 form-control-user"
                min="1900-01-01"
                max="9999-12-31"
                name="entryDateFrom"
                id="entryDateFrom"
                value={addEnterFromDate}
                onChange={this.handleChange}
              />
            </div>
            <div class="invalid-feedback">
              {this.state.validationModel.enterDateFromValField}
              {this.state.validationModel.selectEntryDateFromValField}
            </div>
          </div>
          <div class="col-md-3 mb-2">
            <div class="col-md-4 float-left">
              <label for="DOSTo">Enter Date To</label>
            </div>
            <div class="col-md-7 float-left">
              <input
                type="date"
                class="provider-form w-100 form-control-user"
                min="1900-01-01"
                max="9999-12-31"
                name="entryDateTo"
                id="entryDateTo"
                value={addEnterToDate}
                onChange={this.handleChange}
              />
            </div>
            <div class="invalid-feedback">
              {this.state.validationModel.enterDateToValField}
              {this.state.validationModel.entryDateToGreaterValField}
            </div>
          </div>
          <div class="col-md-3 mb-2">
            <div class="col-md-4 float-left">
              <label for="firstName">Batch #</label>
            </div>
            <div class="col-md-7 float-left">
              <input
                type="text"
                class="provider-form w-100 form-control-user"
                placeholder="Batch #"
                name="batchID"
                id="batchID"
                value={this.state.searchModel.batchID}
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
              <label for="Status">Insurance Type</label>
            </div>
            <div class="col-md-7 float-left">
              <select
                name="state1"
                style={{padding:"6px" , fontSize:"12px"}}
                class="provider-form w-100 form-control-user"
                name="insuranceType"
                id="insuranceType"
                value={this.state.searchModel.insuranceType}
                onChange={this.handleChange}
              >
                {insType.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.display}
                  </option>
                ))}
              </select>
            </div>
            <div class="invalid-feedback"> </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3 mb-2">
            <div class="col-md-4 float-left">
              <label for="firstName">Payer ID</label>
            </div>
            <div class="col-md-7 float-left">
              <input
                type="text"
                class="provider-form w-100 form-control-user"
                placeholder="Payer ID"
                name="payerID"
                id="payerID"
                value={this.state.searchModel.payerID}
                onChange={this.handleChange}
                onKeyPress={(event) => this.handleNumericCheck(event)}
              />
            </div>
            <div class="invalid-feedback">
              {" "}
              {/* Valid first name is required.{" "} */}
            </div>
          </div>
          <div class="col-md-3 mb-2">
            <div class="col-md-4 float-left">
              <label for="firstName">Location</label>
            </div>
            <div class="col-md-7 float-left">
              <input
                type="text"
                class="provider-form w-100 form-control-user"
                placeholder="Location"
                name="Location"
                id="Location"
                value={this.state.searchModel.Location}
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
              <label for="firstName">Provider</label>
            </div>
            <div class="col-md-7 float-left">
              <input
                type="text"
                class="provider-form w-100 form-control-user"
                placeholder="Provider"
                name="provider"
                id="provider"
                value={this.state.searchModel.provider}
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
              <label for="Status">Sub Type</label>
            </div>
            <div class="col-md-7 float-left">
              <select
                name="state1"
                style={{padding:"6px" , fontSize:"12px"}}
                class="provider-form w-100 form-control-user"
                name="submissionType"
                id="submissionType"
                value={this.state.searchModel.submissionType}
                onChange={this.handleChange}
                onKeyPress={this.handleSearch}
              >
                {subType.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.display}
                  </option>
                ))}
              </select>
            </div>
            <div class="invalid-feedback"> </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3 mb-2">
            <div class="col-md-4 float-left">
              <label for="firstName">Plan</label>
            </div>
            <div class="col-md-7 float-left">
              <input
                type="text"
                class="provider-form w-100 form-control-user"
                placeholder="Plan"
                name="plan"
                id="plan"
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
              <label for="Status">Submitted</label>
            </div>
            <div class="col-md-7 float-left">
              <select
                name="state1"
                style={{padding:"6px" , fontSize:"12px"}}
                class="provider-form w-100 form-control-user"
                id="isSubmitted"
                value={this.state.searchModel.isSubmitted}
                onChange={this.handleChange}
              >
                {submitted.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.display}
                  </option>
                ))}
              </select>
            </div>
            <div class="invalid-feedback"> </div>
          </div>

          <div class="col-md-3 mb-2">
            <div class="col-md-4 float-left">
              <label for="Status">Paid</label>
            </div>
            <div class="col-md-7 float-left">
              <select
                name="state1"
                style={{padding:"6px" , fontSize:"12px"}}
                        class="provider-form w-100 form-control-user"
                name="isPaid"
                id="isPaid"
                value={this.state.searchModel.isPaid}
                onChange={this.handleChange}
              >
                {paid.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.display}
                  </option>
                ))}
              </select>
            </div>
            <div class="invalid-feedback"> </div>
          </div>

          <div class="col-md-3 mb-2">
            <div class="col-md-4 float-left">
              <label for="firstName">CPT Code</label>
            </div>
            <div class="col-md-7 float-left">
              <input
                type="text"
                class="provider-form w-100 form-control-user"
                placeholder="CPT Code"
                name="CPTCode"
                id="CPTCode"
                value={this.state.searchModel.CPTCode}
                onChange={this.handleChange}
              />
            </div>
            <div class="invalid-feedback">
              {" "}
              {/* Valid first name is required.{" "} */}
            </div>
          </div>
        </div>
      </React.Fragment>
    );

    let popup = "";

    if (this.state.showPopup) {
      document.body.style.overflow = "hidden";
      popup = (
        <NewCharge
          onClose={this.closeChargePopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        >
          >
        </NewCharge>
      );
    } else if (this.state.popupName === "practice") {
      document.body.style.overflow = "hidden";
      popup = (
        <NewPractice
          onClose={this.closePopup}
          practiceID={this.state.id}
        ></NewPractice>
      );
    } else if (this.state.popupName === "location") {
      document.body.style.overflow = "hidden";
      popup = (
        <NewLocation onClose={this.closePopup} id={this.state.id}></NewLocation>
      );
    } else if (this.state.popupName === "provider") {
      document.body.style.overflow = "hidden";
      popup = (
        <NewProvider onClose={this.closePopup} id={this.state.id}></NewProvider>
      );
    } else if (this.state.popupName === "insuranceplan") {
      document.body.style.overflow = "hidden";
      popup = (
        <NewInsurancePlan
          onClose={this.closePopup}
          id={this.state.id}
        ></NewInsurancePlan>
      );
    } else if (this.state.popupName === "patientplan") {
      document.body.style.overflow = "hidden";
      popup = (
        <GPopup
          onClose={this.closePopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
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
    }else if (this.state.showWpopup) {
      popup = (
        <WriteoffPopup
          onClose={this.closeWriteOffPopup}
          selectedVisits={this.selectedVisits}
        ></WriteoffPopup>
      );
    }  else {
      popup = <React.Fragment></React.Fragment>;
      document.body.style.overflow = "visible";
    }

    let gridDataList = [];
    let gridData = [];
    try {
      if (this.props.visitGridData.length > 0) {
        gridData = this.props.visitGridData;
      }
      if (this.state.gridData.length > 0) {
        gridData = this.state.gridData;
      }

      try {
        if (this.props.patientInfo.accNum > 0) {
          if (this.state.gridData.length == 0) {
            gridData = this.state.gridData;
          }
        }
      } catch {}
    } catch {
      gridData = [];
    }
    this.startTime = new Date().getTime();
    // var start = window.performance.now();;
    console.log("Grid Start Time : ", this.startTime);
    gridData.map((row) => {
      if (this.state.selectedAll) {
        this.selectedVisits.push(row.visitID);
      }
      gridDataList.push({
        ischeck: (
          <input
            style={{ width: "20px", height: "20px" , marginLeft:"7px" }}
            type="checkbox"
            id={row.visitID}
            name={row.visitID}
            onChange={this.toggleCheck}
            checked={this.state.selectedAll ? true : row.isChecked}
          />
        ),
        visitID: (
          <div style={{ minWidth: "70px" }}>
            <a
              href=""
              onClick={
                this.props.popupVisitId == -1
                  ? (event) => this.props.getVisitID(event, row.visitID)
                  : (event) => this.openVisitScreen(event, row.visitID)
              }
            >
              {this.val(row.visitID)}
            </a>
          </div>
        ),
        dos: <span>{this.val(row.dos)}</span>,
        accountNum: this.val(row.accountNum),
        patient: (
          <a
            href=""
            onClick={(event) => this.openPopup(event, "patient", row.patientID)}
          >
            {" "}
            {this.val(row.patient)}
          </a>
        ),
        plan: (
          <a
            href=""
            onClick={(event) =>
              this.openPopup(event, "insuranceplan", row.insurancePlanID)
            }
          >
            {row.insurancePlanName}
          </a>
        ),
        subscriberID: (
          <div style={{ minWidth: "110px" }}>
            <a
              href=""
              onClick={(event) =>
                this.openPopup(event, "patientplan", row.patientID)
              }
            >
              {" "}
              {this.val(row.subscriberID)}
            </a>
          </div>
        ),
       
        location: (
          <a
            href=""
            onClick={(event) =>
              this.openPopup(event, "location", row.locationID)
            }
          >
            {" "}
            {this.val(row.location)}
          </a>
        ),
        provider: (
          <a
            href=""
            onClick={(event) =>
              this.openPopup(event, "provider", row.providerID)
            }
          >
            {" "}
            {this.val(row.provider)}
          </a>
        ),
        submittedDate: (
          <div style={{ minWidth: "120px" }}>{this.val(row.submittedDate)}</div>
        ),
        entryDate: (
          <div stle={{ minWidth: "90px" }}>{this.val(row.entryDate)}</div>
        ),
        claimAge: this.val(row.claimAge),
        primaryStatus: (
          <div style={{ minWidth: "130px" }}>{this.val(row.primaryStatus)}</div>
        ),
        billedAmount: (
          <div style={{ minWidth: "90px" }}>
            {this.val(row.billedAmount) > 0
              ? "$" + this.val(row.billedAmount)
              : " "}
          </div>
        ),
        allowedAmount: (
          <div style={{ minWidth: "110px" }}>
            {this.val(row.allowedAmount) > 0
              ? "$" + this.val(row.allowedAmount)
              : " "}
          </div>
        ),
        paidAmount: (
          <div style={{ minWidth: "80px" }}>
            {this.val(row.paidAmount) > 0
              ? "$" + this.val(row.paidAmount)
              : " "}
          </div>
        ),
        adjustmentAmount: (
          <div style={{ minWidth: "80px" }}>
            {this.val(row.adjustmentAmount) > 0
              ? "$" + this.val(row.adjustmentAmount)
              : " "}
          </div>
        ),

        primaryPlanBalance: (
          <div style={{ minWidth: "80px" }}>
            {this.val(row.primaryPlanBalance) > 0
              ? "$" + this.val(row.primaryPlanBalance)
              : " "}
          </div>
        ),
        primaryPatientBalance: (
          <div style={{ minWidth: "90px" }}>
            {this.val(row.primaryPatientBalance) > 0
              ? "$" + this.val(row.primaryPatientBalance)
              : " "}
          </div>
        ),
        secondaryStatus: (
          <div style={{ minWidth: "100px" }}>
            {this.val(row.secondaryStatus)}
          </div>
        ),
        secondaryPlanBalance: (
          <div style={{ minWidth: "110px" }}>
            {this.val(row.secondaryPlanBalance) > 0
              ? "$" + this.val(row.secondaryPlanBalance)
              : " "}
          </div>
        ),
        secondaryPatientBalance: (
          <div style={{ minWidth: "110px" }}>
            {this.val(row.secondaryPatientBalance) > 0
              ? "$" + this.val(row.secondaryPatientBalance)
              : " "}
          </div>
        ),
        rejection: this.val(row.rejection),
      });
    });

    const tableData = {
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
          label: "VISIT #",
          field: "visitID",
          sort: "asc",
          // width: 150
        },
        {
          label: "DOS",
          field: "dos",
          sort: "asc",
          // width: 150
        },
        {
          label: "ACCOUNT#",
          field: "accountNum",
          sort: "asc",
          // width: 300
        },
        {
          label: "PATIENT",
          field: "patient",
          sort: "asc",
          // width: 250
        },
        {
          label: "PLAN",
          field: "plan",
          sort: "asc",
          // width: 250
        },
        {
          label: "SUBSCRIBER ID",
          field: "subscriberID",
          sort: "asc",
          // width: 200
        },

        
        {
          label: "LOCATION",
          field: "location",
          sort: "asc",
          // width: 200
        },
        {
          label: "PROVIDER",
          field: "provider",
          sort: "asc",
          // width: 200
        },
        {
          label: "SUBMITTED DATE",
          field: "submittedDate",
          sort: "asc",
          // width: 200
        },
        {
          label: "ENTRY DATE",
          field: "entryDate",
          sort: "asc",
          // width: 200
        },
        {
          label: "AGE",
          field: "claimAge",
          sort: "asc",
          // width: 200
        },
        {
          label: "PRIMARY STATUS",
          field: "primaryStatus",
          sort: "asc",
          // width: 200
        },
        {
          label: "BILLED AMT",
          field: "billedAmount",
          sort: "asc",
          //width: 200
        },
        {
          label: "ALLOWED AMT  .",
          field: "allowedAmount",
          sort: "asc",
          // width: 200
        },
        {
          label: "PAID AMT",
          field: "paidAmount",
          sort: "asc",
          //width: 200
        },
        {
          label: "ADJ AMT",
          field: "adjustmentAmount",
          sort: "asc",
          //width: 200
        },
        {
          label: "PLAN BAL",
          field: "primaryPlanBalance",
          sort: "asc",
          //width: 200
        },
        {
          label: "PAT BAL",
          field: "primaryPatientBalance",
          sort: "asc",
          //width: 200
        },
        {
          label: "SEC. STATUS",
          field: "secondaryStatus",
          sort: "asc",
          //width: 200
        },
        {
          label: "SEC PLAN BAL",
          field: "secondaryPlanBalance",
          sort: "asc",
          //width: 200
        },
        {
          label: "SEC PAT BAL",
          field: "secondaryPatientBalance",
          sort: "asc",
          // width: 200
        },
        {
          label: "REJECTION",
          field: "rejection",
          sort: "asc",
          // width: 200
        },
      ],

      rows: gridDataList,
    };

    this.endTime = new Date().getTime();
    console.log("Grid End Time : ", this.endTime);
    console.log("Grid  Time : ", this.startTime - this.endTime);
    const ageType = [
      { value: "D", display: "DOS" },
      { value: "E", display: "ENTRY DATE" },
      { value: "S", display: "SUBMIT DATE" },
    ];

    return (
      <React.Fragment>
        {spiner}
        <div class="container-fluid">
          <div class="header pt-3">
            <h6>
              <span class="h4">VISIT SEARCH</span>
              <div class="float-right p-0 m-0 mb-2 col-md-0">
                {" "}
                <span class="gray-text f13 pl-2 mr-2">Age Unit</span>
                <select
                  name="state"
                  id="state"
                  style={{ width: "80px" }}
                  name="ageType"
                  id="ageType"
                  value={this.state.searchModel.ageType}
                  onChange={this.handleChange}
                >
                  {ageType.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.display}
                    </option>
                  ))}
                </select>
                <span class="gray-text f13 pl-2">
                  <input
                    class="checkbox"
                    type="checkbox"
                    data-toggle="collapse"
                    data-target="#AppointmentSummary"
                    aria-expanded="false"
                    aria-controls="AppointmentSummary"
                    checked={this.state.searchModel.isChecked}
                    onChange={this.handleCheck}
                  />
                  Advanced Search
                </span>
                <Hotkeys
                  keyName="alt+n"
                  onKeyDown={this.onKeyDown.bind(this)}
                  onKeyUp={this.onKeyUp.bind(this)}
                >
                  <button
                    class="btn btn-primary ml-1 mr-2"
                    // id="myModal"
                    onClick={(event) => this.openVisitScreen(event, 0)}
                  >
                    Add New +
                  </button>
                </Hotkeys>
              </div>
            </h6>
          </div>
          <div
            class="clearfix"
            style={{ borderBottom: "1px solid #037592" }}
          ></div>

          <div class="row">
            <div class="col-md-12 col-sm-12 pt-3 provider-form">
              <form
                class="needs-validation form-group"
                onSubmit={(event) => {
                  this.handleSearch(event);
                }}
              >
                <div class="row">
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="firstName">Account #</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="Account #"
                        n
                        name="accountNUm"
                        id="accountNUm"
                        value={this.state.searchModel.accountNUm}
                        onChange={this.handleChange}
                        onKeyPress={this.handleNumericCheck}
                      />
                    </div>
                    <div class="invalid-feedback">
                      {" "}
                      {/* Valid first name is required.{" "} */}
                    </div>
                  </div>
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="firstName">Last Name</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="Last Name"
                        name="lastName"
                        id="lastName"
                        max="20"
                        value={this.state.searchModel.lastName}
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
                      <label for="firstName">First Name</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="First Name"
                        name="firstName"
                        id="firstName"
                        max="20"
                        value={this.state.searchModel.firstName}
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
                      <label for="firstName">Subscriber ID</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="Subscriber ID"
                        name="subscriberID"
                        id="subscriberID"
                        value={this.state.searchModel.subscriberID}
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
                      <label for="firstName">Visit #</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="Visit #"
                        name="visitID"
                        id="visitID"
                        value={this.state.searchModel.visitID}
                        onChange={this.handleChange}
                        onKeyPress={(event) => this.handleNumericCheck(event)}
                      />
                    </div>
                    <div class="invalid-feedback">
                      {" "}
                      {/* Valid first name is required.{" "} */}
                    </div>
                  </div>
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="firstName">Charge #</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="Charge #"
                        name="chargeID"
                        id="chargeID"
                        value={this.state.searchModel.chargeID}
                        onChange={this.handleChange}
                        onKeyPress={(event) => this.handleNumericCheck(event)}
                      />
                    </div>
                    <div class="invalid-feedback">
                      {" "}
                      {/* Valid first name is required.{" "} */}
                    </div>
                  </div>
                  <div class="col-md-3 mb-4">
                    <div class="col-md-4 float-left">
                      <label for="firstName">DOS From</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="date"
                        class="provider-form w-100 form-control-user"
                        type="date"
                        min="1900-01-01"
                        max="9999-12-31"
                        name="dosFrom"
                        id="dosFrom"
                        value={addDosFromDate}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div class="invalid-feedback">
                      {this.state.validationModel.dosFromFDValField}
                      {this.state.validationModel.selectDOSFromValField}
                    </div>
                  </div>
                  <div class="col-md-3 mb-4">
                    <div class="col-md-4 float-left">
                      <label for="firstName">DOS To</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="date"
                        class="provider-form w-100 form-control-user"
                        min="1900-01-01"
                        max="9999-12-31"
                        name="dosTo"
                        id="dosTo"
                        value={addDosToDate}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div class="invalid-feedback">
                      {this.state.validationModel.dosToFDValField}
                      {this.state.validationModel.dosToGreaterValField}
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="Status">Status</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <select
                        style={{padding:"6px" , fontSize:"12px"}}
                        class="provider-form w-100 form-control-user"
                        name="status"
                        id="status"
                        value={this.state.searchModel.status}
                        onChange={this.handleChange}
                      >
                        {status.map((s) => (
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
                      <label for="DOSfrom">Submit Date From</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="date"
                        class="provider-form w-100 form-control-user"
                        min="1900-01-01"
                        max="9999-12-31"
                        name="submittedFromDate"
                        id="submittedFromDate"
                        value={addSubmitFromDate}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div class="invalid-feedback">
                      {this.state.validationModel.submitDateFromValField}
                      {this.state.validationModel.submitDateFromFDValField}
                      {this.state.validationModel.enterSubmitDateFromValField}
                    </div>
                  </div>
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="DOSTo">Submit Date To</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="date"
                        class="provider-form w-100 form-control-user"
                        min="1900-01-01"
                        max="9999-12-31"
                        name="submittedToDate"
                        id="submittedToDate"
                        value={addSubmitToDate}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div class="invalid-feedback">
                      {this.state.validationModel.submitDateToValField}
                      {this.state.validationModel.submitDateToFDValField}
                      {
                        this.state.validationModel.submitDateToGreaterValField
                      }{" "}
                    </div>
                  </div>
                </div>

                {this.state.searchModel.isChecked ? advaceSearch : null}

                <div class="row">
                  <div class="col-12 pt-2 text-center">
                    <Hotkeys
                      keyName="alt+s"
                      onKeyDown={this.onKeyDown.bind(this)}
                      onKeyUp={this.onKeyUp.bind(this)}
                    >
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        disabled={this.isDisabled(this.props.rights.search)}
                      >
                        Search
                      </button>
                    </Hotkeys>
                    <Hotkeys
                      keyName="alt+c"
                      onKeyDown={this.onKeyDown.bind(this)}
                      onKeyUp={this.onKeyUp.bind(this)}
                    >
                      <button
                        class="btn btn-primary mr-2"
                        type="button"
                        onClick={(event) => this.clearFields(event)}
                      >
                        Clear
                      </button>
                    </Hotkeys>
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
                  VISIT SEARCH RESULT
                  {spiner}

                  <input
                    type="button"
                    name="name"
                    id="0"
                    className="export-btn-pdf"
                    value="Export PDF"
                    disabled={this.props.disabled}
                    dataObj={this.props.dataObj}
                    url={this.props.url}
                    length={this.props.length}
                    onClick={this.exportPdf}
                  />
                  <input
                    type="button"
                    name="name"
                    id="0"
                    className="export-btn"
                    value="Export Excel"
                    disabled={this.props.disabled}
                    dataObj={this.props.dataObj}
                    url={this.props.url}
                    length={this.props.length}
                    onClick={this.exportExcel}
                  />
                 
                  <button
                    style={{ marginTop: "-4px", marginBottom: "-4px" }}
                    class="float-right btn btn-primary mr-2"
                    type="button"
                    onClick={(event) => this.AtomizedStatement(event)}
                  >
                    Itemized Bill
                  </button>
                  <button
                    style={{ marginTop: "-4px", marginBottom: "-4px" }}
                    class="float-right btn btn-primary mr-2"
                    type="button"
                    value=" Write-off"
                    onClick={(event) => this.openWriteOffPopup(event)}
                  >
                   Write-off
                  </button>
                </h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <div
                    style={{ overflowX: "hidden" }}
                    id="dataTable_wrapper"
                    className="dataTables_wrapper dt-bootstrap4"
                  >
                    <MDBDataTable
                      responsive
                      striped
                      bordered
                      searching={false}
                      data={tableData}
                      displayEntries={false}
                      sortable={true}
                      scrollX={false}
                      scrollY={false}
                      entries={10}
                      autoWidth
                      maxHeight="300px"
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
    patientInfo: state.selectPatient ? state.selectPatient : null,
    visitGridData: state.VisitGridDataReducer ? state.VisitGridDataReducer : [],
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
          search: state.loginInfo.rights.chargesSearch,
          add: state.loginInfo.rights.chargesCreate,
          update: state.loginInfo.rights.chargesEdit,
          delete: state.loginInfo.rights.chargesDelete,
          export: state.loginInfo.rights.chargesExport,
          import: state.loginInfo.rights.chargesImport,
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
      setVisitGridData: setVisitGridData,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(ChargeSearch)
);
