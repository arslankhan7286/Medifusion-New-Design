import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  withRouter,
} from "react-router-dom";
import { MDBBtn } from "mdbreact";
import $ from "jquery";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import axios from "axios";
import { MDBDataTable } from "mdbreact";
import Swal from "sweetalert2";
import moment from "moment";

import SearchHeading from "./SearchHeading";
//import NewPayment from './NewPayment'

import Label from "./Label";
import Input from "./Input";
import { isNullOrUndefined } from "util";

// import format from "date-fns/format"

import dob from "../images/dob-icon.png";

import searchIcon from "../images/search-icon.png";
import refreshIcon from "../images/refresh-icon.png";
import newBtnIcon from "../images/new-page-icon.png";
import settingsIcon from "../images/setting-icon.png";
import { read } from "fs";
import GridHeading from "./GridHeading";
import ViewEOB from "./ViewEOB";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { setPaymentGridData } from "../actions/SetPaymentGridData";

class PaymentSearch extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/PaymentCheck/";
    this.RecUrl = process.env.REACT_APP_URL + "/ElectronicSubmission/";
    this.downloadUrl = process.env.REACT_APP_URL + "/EDI/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.searchModel = {
      entryDateTo: null,
      entryDateFrom: null,
      checkDateFrom: null,
      checkDateTo: null,
      checkNumber: "",
      location: "",
      payer: "",
      provider: "",
      receiverID: "",
      status: "A",
      postedFromDate: null,
      postedToDate: null,
      typeID: ""
    };

    //Validation Model
    this.validationModel = {
      entryDateFromValField: null,
      entryDateFromFDValField: null,
      entryDateToValField: null,
      entryDateToFDValField: null,
      selectEntryDateFromValField: null,
      checkDateFromValField: null,
      checkDateFromFDValField: null,
      checkDateToValField: null,
      checkDateToFDValField: null,
      selectCheckDateFromValField: null,
      postedDateFromValField: null,
      postedDateFromFDValField: null,
      postedDateToValField: null,
      postedDateToFDValField: null,
      selectPostedDateFromValField: null,
    };

    this.fileData = {
      content: "",
      name: "",
      size: "",
      type: "",
      clientID: 0,
    };

    this.checkPostModel = {
      ids: [],
    };

    this.state = {
      searchModel: this.searchModel,
      validationModel: this.validationModel,
      data: [],
      pickerOpen: false,
      selectedDate: null,
      showPopup: false,
      id: 0,
      loading: false,
      initialData: this.props.paymentGridData ? this.props.paymentGridData : [],
      selectedAll: false,
      checkPostModel: this.checkPostModel,
      revData: [],
    };

    this.selectedIds = [];

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleNumericCheck = this.handleNumericCheck.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleDosFromChange = this.handleDosFromChange.bind(this);
    this.handleDosToChange = this.handleDosToChange.bind(this);
    this.handleEnterToChange = this.handleEnterToChange.bind(this);
    this.handleEnterFromChange = this.handleEnterFromChange.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.paymentSearch = this.paymentSearch.bind(this);
    this.openPaymentPopup = this.openPaymentPopup.bind(this);
    this.importEra = this.importEra.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.openVisitScreen = this.openVisitScreen.bind(this);
    this.openManualPosting = this.openManualPosting.bind(this);
    this.toggleCheck = this.toggleCheck.bind(this);
    this.isChecked = this.isChecked.bind(this);
    this.selectALL = this.selectALL.bind(this);
  }
  async componentWillMount() {
    axios.get(this.RecUrl + "GetProfiles", this.config).then((response) => {
      this.setState({
        revData: response.data.receivers,
      });
    });

    await this.setState({ loading: true });

    try {
      if (this.props.location.query.status == "NP") {
        await this.setState({
          searchModel: {
            ...this.state.searchModel,
            status: this.props.location.query.status,
          },
        });
        this.paymentSearch();
      } else if (this.props.location.query.status == "A") {
        await this.setState({
          searchModel: {
            ...this.state.searchModel,
            status: this.props.location.query.status,
            entryDateFrom: this.props.location.query.entryDateFrom,
          },
        });
        this.paymentSearch();
      } else if (this.props.location.query.status == "P") {
        await this.setState({
          searchModel: {
            ...this.state.searchModel,
            status: this.props.location.query.status,
            entryDateFrom: this.props.location.query.entryDateFrom,
          },
        });
        this.paymentSearch();
      } else if (this.props.location.query.status == "F") {
        await this.setState({
          searchModel: {
            ...this.state.searchModel,
            status: this.props.location.query.status,
            entryDateFrom: this.props.location.query.entryDateFrom,
          },
        });
        this.paymentSearch();
      }
    } catch {
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  }

  handleChange = (event) => {
    if (
      event.target.name == "entryDateTo" ||
      event.target.name == "entryDateFrom" ||
      event.target.name == "checkDateFrom" ||
      event.target.name == "checkDateTo" ||
      event.target.name == "postedFromDate" ||
      event.target.name == "postedToDate"
    ) {
    } else {
      //Carret Position
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
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };

  openVisitScreen(event,id) {
    event.preventDefault();
    this.props.selectTabAction("ManualPosting", id);
    this.props.history.push("/ManualPosting");
  }

  openManualPosting(event) {
    event.preventDefault();
    // this.props.selectTabAction("ManualPosting");
    // this.props.history.push("/ManualPosting");
  }

  val(value) {
    if (isNullOrUndefined(value)) return " ";
    else return value;
  }

  isChecked = (id) => {
    return this.selectedIds.filter((name) => name === id)[0] ? true : false;
  };

  downloadReports = (e) => {
    if (this.state.searchModel.receiverID.length == 0) {
      Swal.fire({
        type: "info",
        text: "Please Select Receiver",
      });
      return;
    } else {
      this.setState({ loading: true });
      axios
        .get(
          this.downloadUrl +
            "DownlaodFiles/" +
            this.state.searchModel.receiverID,
          this.config
        )
        .then((response) => {
          this.setState({ loading: false });
          Swal.fire("Files Downloaded Successfully", "", "success");
        })
        .catch((error) => {
          this.setState({ loading: false });
          if (error.response) {
            if (error.response.status) {
              Swal.fire(error.response.data, "", "warning");
            }
          }
        });
    }
  };

  //Post Check
  postCheck = (e) => {
    e.preventDefault()
    let postCheckModel = {
      ids: this.selectedIds,
    };
    if (this.selectedIds === null || this.selectedIds.length === 0) {
      Swal.fire({
        type: "info",
        text: "Please Select the Record(s)",
      });
      return;
    } else {
      this.setState({ loading: true });
      axios
        .post(this.url + "PostEra", postCheckModel, this.config)
        .then((response) => {
          this.setState({ loading: false });
          Swal.fire("Check(s) Posted Successfully", "", "success");
        })
        .catch((error) => {
          this.setState({ loading: false });
          Swal.fire(
            "Check(s) Posted Failed - Contact BellMedEx",
            "",
            "warning"
          );
        });
    }
  };

  //Mark As not related
  markAsNotRelated = async (e) => {
    e.preventDefault()
    let postCheckModel = {
      ids: this.selectedIds,
      status: "NR",
    };
    if (this.selectedIds === null || this.selectedIds.length === 0) {
      Swal.fire({
        type: "info",
        text: "Please Select the Record(s)",
      });
      return;
    } else {
      await this.setState({ loading: true });
      await axios
        .post(this.url + "MarkAsNotRelated", postCheckModel, this.config)
        .then((response) => {
          this.setState({ loading: false });
          Swal.fire("Marked Successfully", "", "success");
        })
        .catch((error) => {
          this.setState({ loading: false });
          Swal.fire("Something Wrong", "Please Try Again", "warning");
        });
    }
  };

  async selectALL(e) {
    this.selectedIds = [];
    await this.setState({ selectedAll: !this.state.selectedAll });
  }

  toggleCheck = (e) => {
    let checkedArr = this.selectedIds;
    checkedArr.filter((name) => name === Number(e.target.id))[0]
      ? (checkedArr = checkedArr.filter((name) => name !== Number(e.target.id)))
      : checkedArr.push(Number(e.target.id));

    this.selectedIds = checkedArr;
    this.setState({
      checkPostModel: { ...this.state.checkPostModel, ids: this.selectedIds },
    });
  };

  handleSearch = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    //Future Date Validations
    var myVal = this.validationModel;
    myVal.validation = false;

    //Entry Date From Future Date Validation
    if (this.isNull(this.state.searchModel.entryDateFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.entryDateFrom).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.entryDateFromFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.entryDateFromFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.entryDateFromFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Entry Date To Future Date Validation
    if (this.isNull(this.state.searchModel.entryDateTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.entryDateTo).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.entryDateToFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.entryDateToFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.entryDateToFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //if Entery Date From is not Selected and Entry Date to is selected than show error message
    if (
      this.isNull(this.state.searchModel.entryDateFrom) == true &&
      this.isNull(this.state.searchModel.entryDateTo) == false
    ) {
      myVal.selectEntryDateFromValField = (
        <span className="validationMsg">Select entry date from</span>
      );
      myVal.validation = true;
    } else {
      myVal.selectEntryDateFromValField = null;
    }

    //If Entry Date from is greater than entry Date To  than show error message
    if (
      this.isNull(this.state.searchModel.entryDateFrom) === false &&
      this.isNull(this.state.searchModel.entryDateTo) === false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.entryDateFrom).format().slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.entryDateTo).format().slice(0, 10)
        ).getTime()
      ) {
        myVal.entryDateFromValField = (
          <span className="validationMsg">
            Entry date from must be lessthan or equals to Entry date To
          </span>
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

    //Check Date From Future Date Validation
    if (this.isNull(this.state.searchModel.checkDateFrom) == false) {
      if (
        new Date(
          moment(this.state.searchModel.checkDateFrom).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.checkDateFromFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.checkDateFromFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.checkDateFromFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Check Date From Future Date Validation
    if (this.isNull(this.state.searchModel.checkDateTo) == false) {
      if (
        new Date(
          moment(this.state.searchModel.checkDateTo).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.checkDateToFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.checkDateToFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.checkDateToFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //if Check Date From is not Selected and Check Date to is selected than show error message
    if (
      this.isNull(this.state.searchModel.checkDateFrom) == true &&
      this.isNull(this.state.searchModel.checkDateTo) == false
    ) {
      myVal.selectCheckDateFromValField = (
        <span className="validationMsg">Select check date from</span>
      );
      myVal.validation = true;
    } else {
      myVal.selectCheckDateFromValField = null;
    }

    //If Check Date from is greater than check Date To  than show error message
    if (
      this.isNull(this.state.searchModel.checkDateFrom) === false &&
      this.isNull(this.state.searchModel.checkDateTo) === false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.checkDateFrom).format().slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.checkDateTo).format().slice(0, 10)
        ).getTime()
      ) {
        myVal.checkDateFromValField = (
          <span className="validationMsg">
            Check date from must be lessthan or equals to Check date To
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.checkDateFromValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.checkDateFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Posted Date  From Future Date Validation
    if (this.isNull(this.state.searchModel.postedFromDate) == false) {
      if (
        new Date(
          moment(this.state.searchModel.postedFromDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.postedDateFromFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.postedDateFromFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.postedDateFromFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Posted Date To Future Date Validation
    if (this.isNull(this.state.searchModel.postedToDate) == false) {
      if (
        new Date(
          moment(this.state.searchModel.postedToDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.postedDateToFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.postedDateToFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.postedDateToFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //if Posted Date From is not Selected and Posted Date to is selected than show error message
    if (
      this.isNull(this.state.searchModel.postedFromDate) == true &&
      this.isNull(this.state.searchModel.postedToDate) == false
    ) {
      myVal.selectPostedDateFromValField = (
        <span className="validationMsg">Select posted date from</span>
      );
      myVal.validation = true;
    } else {
      myVal.selectPostedDateFromValField = null;
    }

    //If Check Date from is greater than check Date To  than show error message
    if (
      this.isNull(this.state.searchModel.postedFromDate) === false &&
      this.isNull(this.state.searchModel.postedToDate) === false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.postedFromDate).format().slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.postedToDate).format().slice(0, 10)
        ).getTime()
      ) {
        myVal.postedDateFromValField = (
          <span className="validationMsg">
            Posted date from must be lessthan or equals to Posted date To
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.postedDateFromValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.postedDateFromValField = null;
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
      .post(this.url + "FindPaymentChecks", this.state.searchModel, this.config)
      .then((response) => {
        // this.loadGrid(response.data, false);
        this.props.setPaymentGridData(response.data);
        this.setState({ initialData: response.data, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        Swal.fire("Something Wrong", "Please Seach Again", "error");
      });
  };

  async paymentSearch() {
    this.setState({ loading: true });

    axios
      .post(this.url + "FindPaymentChecks", this.state.searchModel, this.config)
      .then((response) => {
        // this.loadGrid(response.data, false);
        this.setState({ initialData: response.data, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });

    // let newValue = selectedAll;
  }

  async loadGrid(data, selectedAll) {
    await this.setState({ loading: true });

    let newValue = selectedAll;
    let newList = [];
    await data.map((row) => {
      if (newValue === true) this.selectedIds.push(Number(row.id));
      newList.push({
        ischeck: (
          <input
            style={{ width: "20px", height: "20px" }}
            type="checkbox"
            id={row.id}
            name={row.id}
            onChange={this.toggleCheck}
            checked={this.isChecked(row.id)}
          />
        ),
        checkNumber: (
          <a href="" onClick={(event) => this.openVisitScreen(event, row.id)}>
            {" "}
            {row.checkNumber}
          </a>
        ),
        paymentMethod: row.paymentMethod,
        checkDate: row.checkDate,
        checkAmount:
          this.val(row.checkAmount) > 0 ? "$" + this.val(row.checkAmount) : " ",
        appliedamount:
          this.val(row.appliedamount) > 0
            ? "$" + this.val(row.appliedamount)
            : " ",
        postedAmount:
          this.val(row.postedAmount) > 0
            ? "$" + this.val(row.postedAmount)
            : " ",
        numberOfVisits: row.numberOfVisits,
        numberOfPatients: row.numberOfPatients,
        status: row.status,
        payer: row.payer,
        PayeeName: row.payeeName,
        PayeeNPI: row.payeeNPI,
        receiver: row.receiver,
        entryDate: row.entryDate ? row.entryDate.slice(0, 10) : "",
        postedDate: row.postedDate ? row.postedDate.slice(0, 10) : "",
        enteredBy: row.enteredBy,
        viewEOB:
          row.paymentMethod == "ERA" ? (
            <button
              class="float-right btn btn-primary mr-2"
              onClick={() => this.viewEOB(row.id)}
            >
              View EOB
            </button>
          ) : (
            ""
          ),
      });
    });

    await this.setState({
      data: newList,
      loading: false,
      initialData: data,
      checkPostModel: { ...this.state.checkPostModel, ids: this.selectedIds },
    });
  }

  async clearFields() {
    var myVal = this.validationModel;
    myVal.entryDateFromValField = "";
    myVal.entryDateToValField = "";
    myVal.checkDateFromValField = "";
    myVal.checkDateToValField = "";
    myVal.postedDateFromValField = "";
    myVal.postedDateToValField = "";
    myVal.entryDateFromFDValField = "";
    myVal.entryDateToFDValField = "";
    myVal.checkDateFromFDValField = "";
    myVal.checkDateToFDValField = "";
    myVal.postedDateFromFDValField = "";
    myVal.postedDateToFDValField = "";
    myVal.selectEntryDateFromValField = "";
    myVal.selectCheckDateFromValField = "";
    myVal.selectPostedDateFromValField = "";
    this.selectedIds = [];
    await this.setState({
      searchModel: this.searchModel,
      selectedAll: false,
      validationModel: myVal,
    });

    this.paymentSearch();
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

  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
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

  openPaymentPopup(event,id) {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  }

  closePopup = () => {
    $("#myModal1").hide();
    this.setState({ showPopup: false });
  };
 
  viewEOB = (id) => {
    this.setState({ showPopup: true, id: id });
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

  handleDateChange(event) {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value,
      },
    });
  }

  importEra(e) {
    e.preventDefault();
    this.setState({ loading: true });

    try {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      let file = e.target.files[0];

      reader.onloadend = (e) => {
        let obj = this.fileData;
        obj.content = reader.result;
        obj.name = file.name;
        obj.size = file.size;
        obj.type = file.type;
        obj.clientID = 1;

        try {
          axios
            .post(this.url + "ImportEraFile", obj, this.config)
            .then((response) => {
              this.setState({ loading: false });
              Swal.fire("File Imported Successfully", "", "success").then(
                (eres) => {
                  this.handleSearch(e);
                }
              );
            })
            .catch((error) => {
              this.setState({ loading: false });
              if (error.response) {
                if (error.response.status == 400) {
                  Swal.fire("Error", error.response.data, "error").then(
                    (sres) => {
                      this.handleSearch(e);
                    }
                  );
                } else if (error.response.status == 404) {
                  Swal.fire("Error", "404 Not Found", "error").then((sres) => {
                    this.handleSearch(e);
                  });
                } else {
                  Swal.fire("Import ERA Failed", "", "error");
                }
              } else {
                Swal.fire("Import ERA Failed", "", "error");
              }
            });
        } catch {
          Swal.fire("Import ERA Failed", "", "error");
        }
      };
    } catch {}
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  render() {
    //Grid Loop
    let newList = [];
    this.state.initialData.map((row) => {
      if (this.state.selectedAll === true)
        this.selectedIds.push(Number(row.id));
      newList.push({
        ischeck: (
          <input
            style={{ width: "20px", height: "20px" , marginLeft:"8px" }}
            type="checkbox"
            id={row.id}
            name={row.id}
            onChange={this.toggleCheck}
            checked={this.isChecked(row.id)}
          />
        ),
        checkNumber: (
          <a href="" onClick={(event) => this.openVisitScreen(event, row.id)}>
            {" "}
            {row.checkNumber}
          </a>
        ),
        paymentMethod: row.paymentMethod,
        checkDate: row.checkDate,
        checkAmount:
          this.val(row.checkAmount) > 0 ? "$" + this.val(row.checkAmount) : " ",
        appliedamount:
          this.val(row.appliedamount) > 0
            ? "$" + this.val(row.appliedamount)
            : " ",
        postedAmount:
          this.val(row.postedAmount) > 0
            ? "$" + this.val(row.postedAmount)
            : " ",
        numberOfVisits: row.numberOfVisits,
        numberOfPatients: row.numberOfPatients,
        status: row.status,
        payer: row.payer,
        PayeeName: row.payeeName,
        PayeeNPI: row.payeeNPI,
        receiver: row.receiver,
        entryDate: row.entryDate ? row.entryDate.slice(0, 10) : "",
        postedDate: row.postedDate ? row.postedDate.slice(0, 10) : "",
        enteredBy: row.enteredBy,
        viewEOB:
          row.paymentMethod == "ERA" ? (
            <button
              class="float-right btn btn-primary mr-2"
              onClick={() => this.viewEOB(row.id)}
            >
              View EOB
            </button>
          ) : (
            ""
          ),
      });
    });

    const tableData = {
      columns: [
        {
          label: (
            <input
              style={{ width: "20px", height: "20px" }}
              type="checkbox"
              id="selectAll"
              name="selectAll"
              checked={this.state.selectedAll == true ? true : false}
              onChange={this.selectALL}
            />
          ),
          field: "ischeck",
          sort: "",
          width: 50,
        },
        {
          label: "CHECK #",
          field: "checkNumber",
          sort: "asc",
          width: 150,
        },
        {
          label: "TYPE",
          field: "paymentMethod",
          sort: "asc",
          width: 150,
        },

        {
          label: "CHECK DATE",
          field: "checkDate",
          sort: "asc",
          width: 150,
        },

        {
          label: "CHECK AMT.",
          field: "checkAmount",
          sort: "asc",
          width: 150,
        },

        {
          label: "APPLIDED AMT.",
          field: "appliedamount",
          sort: "asc",
          width: 150,
        },
        {
          label: "POSTED AMT.",
          field: "postedAmount",
          sort: "asc",
          width: 150,
        },
        {
          label: "VISIT #",
          field: "numberOfVisits",
          sort: "asc",
          width: 150,
        },
        {
          label: "PATIENTS",
          field: "numberOfPatients",
          sort: "asc",
          width: 150,
        },
        {
          label: "STATUS",
          field: "status",
          sort: "asc",
          width: 150,
        },
        {
          label: "PAYER",
          field: "payer",
          sort: "asc",
          width: 150,
        },

        {
          label: "PAYEE NAME",
          field: "PayeeName",
          sort: "asc",
          width: 150,
        },
        {
          label: "PAYEE NPI",
          field: "PayeeNPI",
          sort: "asc",
          width: 150,
        },

        {
          label: "RECEIVER",
          field: "receiver",
          sort: "asc",
          width: 150,
        },
        {
          label: "ENTER DATE",
          field: "entryDate",
          sort: "asc",
          width: 150,
        },
        {
          label: "POSTED DATE",
          field: "postedDate",
          sort: "asc",
          width: 150,
        },
        {
          label: "ENTER BY",
          field: "enteredBy",
          sort: "asc",
          width: 150,
        },
        {
          label: "",
          field: "viewEOB",
          sort: "asc",
          width: 150,
        },
      ],
      rows: newList,
    };

    const Status = [
      { value: "A", display: "ALL" },
      { value: "C", display: "CLOSE" },
      { value: "NP", display: "NEED POSTING" },
      { value: "P", display: "POSTED" },
      { value: "F", display: "FAILED" },
      { value: "NR", display: "NOT RELATED" },
    ];

    const TypeOption = [
      { value: "", display: "ALL" },
      { value: "ERA", display: "ERA" },
      { value: "M", display: "MANUAL POSTING" },
    ];


    let popup = "";

    if (this.state.showPopup) {
      // popup = <NewPayment onClose={() => this.closePopup} id={this.state.id}></NewPayment>
      popup = (
        <ViewEOB onClose={this.closePopup} id={this.state.id}></ViewEOB>
      );
    } else popup = <React.Fragment></React.Fragment>;

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
              <span class="h4">PAYMENT CHECK SEARCH</span>
              <div class="float-right p-0 m-0 mb-2 col-md-0">
                <button
                  class="btn btn-primary ml-1 mr-2"
                  onClick={(event) => this.openVisitScreen(event,0)}
                  disabled={this.isDisabled(this.props.rights.manualPostingAdd)}
                >
                  Add Manual Posting
                </button>

                <label
                  style={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    paddingBottom: "5px",
                    paddingTop: "7px",
                    marginTop: "-7px",
                  }}
                  for="file-upload"
                  id="file-upload-style"
                  className="btn btn-primary mr-2 labelFileUpload"
                >
                  Import ERA
                  <input
                    id="file-upload"
                    type="file"
                    className="InputUploaderDisNone"
                    onChange={(e) => this.importEra(e)}
                  />
                </label>

                <button
                  class="btn btn-primary ml-1 mr-2"
                  onClick={this.downloadReports}
                >
                  Download Reports
                </button>
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
                      <label for="firstName">Entry Date From</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="date"
                        class="provider-form w-100 form-control-user"
                        type="date"
                        min="1900-01-01"
                        max="9999-12-31"
                        name="entryDateFrom"
                        id="entryDateFrom"
                        onChange={this.handleDateChange}
                        // value={this.state.searchModel.entryDateFrom}
                        value={
                          this.state.searchModel.entryDateFrom == null
                            ? ""
                            : this.state.searchModel.entryDateFrom
                        }
                      />
                    </div>
                    <div class="invalid-feedback">
                      {this.state.validationModel.entryDateFromValField}
                      {this.state.validationModel.selectEntryDateFromValField}
                      {this.state.validationModel.entryDateFromFDValField}
                    </div>
                  </div>
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="firstName">Entry Date To</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="date"
                        class="provider-form w-100 form-control-user"
                        p
                        type="date"
                        min="1900-01-01"
                        max="9999-12-31"
                        name="entryDateTo"
                        id="entryDateTo"
                        onChange={this.handleDateChange}
                        // value={this.state.searchModel.entryDateTo}
                        value={
                          this.state.searchModel.entryDateTo == null
                            ? ""
                            : this.state.searchModel.entryDateTo
                        }
                      />
                    </div>
                    <div class="invalid-feedback">
                      {this.state.validationModel.entryDateToValField}
                      {this.state.validationModel.entryDateToFDValField}
                    </div>
                  </div>
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="firstName">Check Date From</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="date"
                        class="provider-form w-100 form-control-user"
                        type="date"
                        min="1900-01-01"
                        max="9999-12-31"
                        name="checkDateFrom"
                        id="checkDateFrom"
                        onChange={this.handleDateChange}
                        // value={this.state.searchModel.checkDateFrom}
                        value={
                          this.state.searchModel.checkDateFrom == null
                            ? ""
                            : this.state.searchModel.checkDateFrom
                        }
                      />
                    </div>
                    <div class="invalid-feedback">
                      {this.state.validationModel.checkDateFromValField}
                      {this.state.validationModel.selectCheckDateFromValField}
                      {this.state.validationModel.checkDateFromFDValField}
                    </div>
                  </div>
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="firstName">Check Date To</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="date"
                        class="provider-form w-100 form-control-user"
                        type="date"
                        min="1900-01-01"
                        max="9999-12-31"
                        name="checkDateTo"
                        id="checkDateTo"
                        onChange={this.handleDateChange}
                        // value={this.state.searchModel.checkDateTo}
                        value={
                          this.state.searchModel.checkDateTo == null
                            ? ""
                            : this.state.searchModel.checkDateTo
                        }
                      />
                    </div>
                    <div class="invalid-feedback">
                      {this.state.validationModel.checkDateToValField}
                      {this.state.validationModel.checkDateToFDValField}
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="firstName">Check #</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="Check #"
                        name="checkNumber"
                        id="checkNumber"
                        value={this.state.searchModel.checkNumber}
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
                      <label for="firstName">Location</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="Location"
                        name="location"
                        id="location"
                        value={this.state.searchModel.location}
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
                      <label for="firstName">Provider</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="Provider"
                        type="text"
                        name="provider"
                        id="provider"
                        value={this.state.searchModel.provider}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div class="invalid-feedback">
                      {/* {this.state.validationModel.dosFromFDValField} */}
                      {/* {this.state.validationModel.selectDOSFromValField} */}
                    </div>
                  </div>
                  <div class="col-md-3 mb-4">
                    <div class="col-md-4 float-left">
                      <label for="firstName">Payer</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        placeholder="Payer"
                        class="provider-form w-100 form-control-user"
                        type="text"
                        name="payer"
                        id="payer"
                        value={this.state.searchModel.payer}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div class="invalid-feedback">
                      {/* {this.state.validationModel.dosToFDValField}
                      {this.state.validationModel.dosToGreaterValField} */}
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="Status">Receiver</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <select
                        style={{padding:"6px" , fontSize:"12px"}}
                        class="provider-form w-100 form-control-user"
                        name="receiverID"
                        id="receiverID"
                        value={this.state.searchModel.receiverID}
                        onChange={this.handleChange}
                      >
                        {this.state.revData.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.description}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div class="invalid-feedback"> </div>
                  </div>

                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="DOSfrom">Status</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <select
                         style={{padding:"6px" , fontSize:"12px"}}
                         class="provider-form w-100 form-control-user"
                        type="text"
                        name="status"
                        id="status"
                        value={this.state.searchModel.status}
                        onChange={this.handleChange}
                      >
                        {Status.map((stat) => (
                          <option key={stat.value} value={stat.value}>
                            {stat.display}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div class="invalid-feedback"></div>
                  </div>
                  
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="DOSTo">Posted Date From</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="date"
                        class="provider-form w-100 form-control-user"
                        type="date"
                        min="1900-01-01"
                        max="9999-12-31"
                        name="postedFromDate"
                        id="postedFromDate"
                        onChange={this.handleDateChange}
                        // value={this.state.searchModel.postedFromDate}
                        value={
                          this.state.searchModel.postedFromDate == null
                            ? ""
                            : this.state.searchModel.postedFromDate
                        }
                      />
                    </div>
                    <div class="invalid-feedback">
                      {this.state.validationModel.postedDateFromValField}
                      {this.state.validationModel.selectPostedDateFromValField}
                      {this.state.validationModel.postedDateFromFDValField}
                    </div>
                  </div>

                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="DOSTo">Posted Date To</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="date"
                        class="provider-form w-100 form-control-user"
                        type="date"
                        min="1900-01-01"
                        max="9999-12-31"
                        name="postedToDate"
                        id="postedToDate"
                        onChange={this.handleDateChange}
                        // value={this.state.searchModel.postedToDate}
                        value={
                          this.state.searchModel.postedToDate == null
                            ? ""
                            : this.state.searchModel.postedToDate
                        }
                      />
                    </div>
                    <div class="invalid-feedback">
                      {this.state.validationModel.postedDateToValField}
                      {this.state.validationModel.postedDateToFDValField}
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="Status">Type</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <select
                        style={{padding:"6px" , fontSize:"12px"}}
                        class="provider-form w-100 form-control-user"
                        name="typeID"
                            id="typeID"
                            value={this.state.searchModel.typeID}
                            onChange={this.handleChange}
                      >
                        {TypeOption.map((s) => (
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
                  <div class="col-12 pt-2 text-center">
                    <button
                    type="button"
                      class="btn btn-primary mr-2"
                      onClick={(event) => this.markAsNotRelated(event)}
                    >
                      Mark As Not Related
                    </button>
                    <button
                      class="btn btn-primary mr-2"
                      type="button"
                      disabled={this.isDisabled(this.props.rights.postcheck)}
                      onClick={(event) => this.postCheck(event)}
                    >
                      POST CHECK
                    </button>
                    <button
                      class="btn btn-primary mr-2"
                      type="submit"
                      disabled={this.isDisabled(
                        this.props.rights.postCheckSearch
                      )}
                    >
                      Search
                    </button>
                    <button
                      class="btn btn-primary mr-2"

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
                Heading="PAYMENT CHECK SEARCH RESULT"
                dataObj={this.state.searchModel}
                url={this.url}
                methodName="Export"
                methodNamePdf="ExportPdf"
                length={this.state.initialData.length}
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
          </div>
        </div>
        {popup}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    paymentGridData: state.PaymentGridDataReducer
      ? state.PaymentGridDataReducer
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
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? {
          manualPostingAdd: state.loginInfo.rights.manualPostingAdd,
          manualPostingUpdate: state.loginInfo.rights.manualPostingUpdate,
          postcheck: state.loginInfo.rights.postcheck,
          addPaymentVisit: state.loginInfo.rights.addPaymentVisit,
          deletePaymentVisit: state.loginInfo.rights.deletePaymentVisit,
          postCheckSearch: state.loginInfo.rights.postCheckSearch,
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
      setPaymentGridData: setPaymentGridData,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(PaymentSearch)
);
