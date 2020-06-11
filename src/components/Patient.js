//Package Import
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { MDBBtn } from "mdbreact";
import $ from "jquery";
import axios from "axios";
import { MDBDataTable } from "mdbreact";
import Swal from "sweetalert2";
import dob_icon from "../images/dob-icon.png";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import moment from "moment";

//Local Components Import
import NewPractice from "./NewPractice";
import NewLocation from "./NewLocation";
import NewProvider from "./NewProvider";
import GridHeading from "./GridHeading";
import SearchHeading from "./SearchHeading";
import Label from "./Label";
import Input from "./Input";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { selectPatient } from "../actions/selectPatient";
import { setPatientGridData } from "../actions/SetPatientGridDataAction";

class Patient extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/patient/";
    this.id = 0;
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.cursor = 0;
    this.lastNameRef = React.createRef();
    this.firstNameRef = React.createRef();

    this.searchModel = {
      lastName: "",
      firstName: "",
      accountNum: "",
      medicalRecordNumber: "",
      ssn: "",
      dob: "",
      insuredID: "",
      practice: "",
      location: "",
      provider: "",
      plan: "",

      entryDateFrom: "",
      entryDateTo: "",

      inActive: false,
    };

    this.validationModel = {
      dobValField: null,
      selectEntryDateFromValField: null,
      entryDateToGreaterValField: null,
      validation: false,
    };

    this.state = {
      searchModel: this.searchModel,
      validationModel: this.validationModel,
      data: this.props.patientGridData ? this.props.patientGridData : [],
      patientCBList: [],
      showpracticePopup: false,
      showLocationPopup: false,
      showProviderPopup: false,
      loading: false,
      //----SCHEDULAR DATA
      advSearchData: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleNumericCheck = this.handleNumericCheck.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.newPatientPopup = this.newPatientPopup.bind(this);
    this.toggleCheck = this.toggleCheck.bind(this);
    this.searchPatient = this.searchPatient.bind(this);
    this.clearFields = this.clearFields.bind(this);

    this.handleEnterToChange = this.handleEnterToChange.bind(this);
    this.handleEnterFromChange = this.handleEnterFromChange.bind(this);
  }

  openpracticePopup = (id) => {
    this.setState({ showpracticePopup: true, id: id });
  };

  closepracticePopup = () => {
    $("#myModal").hide();
    this.setState({ showpracticePopup: false });
  };

  openLocationPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showLocationPopup: true, id: id });
  };

  closeLocationPopup = () => {
    $("#myModal").hide();
    this.setState({ showLocationPopup: false });
  };

  openProviderPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showProviderPopup: true, id: id });
  };

  closeProviderPopup = () => {
    $("#myModal").hide();
    this.setState({ showProviderPopup: false });
  };

  isNull(value) {
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
  }

  replace(field, replaceWhat, replaceWith) {
    if (this.isNull(field)) return field;
    else return field.replace(replaceWhat, replaceWith);
  }

  handleChange = (event) => {
    if (
      event.target.name === "entryDateFrom" ||
      event.target.name === "entryDateTo"
    ) {
    } else {
      const caret = event.target.selectionStart;
      const element = event.target;
      window.requestAnimationFrame(() => {
        element.selectionStart = caret;
        element.selectionEnd = caret;
      });
    }

    //Carret Position

    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });

    event.preventDefault();
  };

  async searchPatient() {
    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.searchModel.dob) == false) {
      if (
        new Date(
          moment(this.state.searchModel.dob).format().slice(0, 10)
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
    var accountNUm = this.props.patientInfo
      ? this.props.patientInfo.accNum
      : null;
    await axios
      .post(this.url + "FindPatients", this.state.searchModel, this.config)
      .then((response) => {
        // var patientCBList = [];
        // for (var i = 0; i < response.data.length; i++) {
        //   if (response.data[i].accountNum == accountNUm) {
        //     patientCBList.push(true);
        //   } else {
        //     patientCBList.push(false);
        //   }
        // }
        this.setState({
          data: response.data,
          // patientCBList: patientCBList,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.status) {
            if (error.response.status == 404) {
              Swal.fire("Error", "404 No Record Found", "error");
            } else if (error.response.status == 401) {
              Swal.fire("Error", "401 UnAuthorize Access", "error");
            } else if (error.response.status == 400) {
              Swal.fire("400 Bad Request", error.request.response, "error");
            }
          }
        }
      });
  }

  handleEnterFromChange = (date) => {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        entryDateFrom: date,
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

  handleSearch(event) {
    event.preventDefault();
    if (event) {
      this.searchPatient();
    } else {
      return true;
    }
  }

  async toggleCheck(event, patInfo) {
    var index = Number(event.target.name);
    var patientCBList = this.state.patientCBList;

    await patientCBList.map((cb, i) => {
      if (index == i) {
        patientCBList[i] = !patientCBList[i];
        if (patientCBList[i] == false) {
          this.props.selectPatient({ ID: null, accNum: null });
        } else {
          this.props.selectPatient(patInfo);
        }
      } else {
        patientCBList[i] = false;
      }
    });

    this.setState({ patientCBList: patientCBList });
  }

  openPatient = (patientInfo) => {
    this.props.selectPatient(patientInfo);
    this.props.history.push("/Charges/" + patientInfo.ID);
  };

  async clearFields(event) {
    var searchModel = { ...this.searchModel };
    searchModel.dob = null;
    searchModel.entryDateFrom = null;
    searchModel.entryDateTo = null;

    await this.setState({ searchModel: searchModel });

    this.handleSearch(event);
  }

  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    }else if(event.charCode === 13){
      event.preventDefault()
      this.searchPatient();
    } else {
      event.preventDefault();
      return false;
    }
  }

  handleCheck() {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        inActive: !this.state.searchModel.inActive,
      },
    });
  }

  handleDateChange = (date) => {
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        dob: date.target.value,
      },
    });
  };

  // openPopup(id) {}

  newPatientPopup(event, id, accNumber) {
    event.preventDefault();
    this.props.selectTabAction("NewPatient", id);
    this.props.selectPatient({ ID: id, accNum: accNumber });
    this.props.setPatientGridData(this.state.data);
    this.props.history.push("/NewPatient");
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  //----------------------------SCHEDULAR FUNCTION

  selectRow(data) {
    let count = 0;
    console.log("data", data);
    Array.from(document.querySelectorAll(".dataTable")).forEach((tab) => {
      // console.log("tab", tab.childNodes[1].childNodes);
      tab.childNodes[1].childNodes.forEach((row) => {
        console.log("ROW", row);
        console.log("innerHTML", row.childNodes);
        row.setAttribute("class", "SchedularRowNotSelected");

        for (const td of row.childNodes) {
          if (data.id == td.textContent) {
            if (count == 0) {
              row.setAttribute("class", "SchedularRowSelected");
              count++;
            }
          }
        }
      });
    });

    this.setState({
      advSearchData: data,
    });
  }

  sendRowData() {
    if (this.state.advSearchData.length == 0) {
      Swal.fire("Please Select A Row", "", "error");
    } else {
      this.props.rowSelect(this.state.advSearchData);
      this.props.closeAdvSrch();
    }
  }

  render() {
    var newDate = new Date(this.state.searchModel.dob);
    var day = newDate.getDate();
    var month = newDate.getMonth() + 1;
    var year = newDate.getFullYear();
    newDate = year + "-" + month + "-" + day;
    var entryDate = "";
    let newList = [];
    this.state.data.map((row, i) => {
      entryDate = row.addedDate;
      if (this.props.SchedularAdvSearch) {
        newList.push({
    
          entryDate: entryDate,
          accountNo: row.accountNum,
          lastName: row.lastName,
          firstName: row.firstName,
          medicalRecordNumber: row.medicalRecordNumber,
          ssn: row.ssn,
          dob: row.dob,
          location: row.location,
          provider: row.provider,
          clickEvent: () => this.selectRow(row),
        });
      } else {
        newList.push({
          entryDate: entryDate,
          accountNo: (
            <a
              href=""
              onClick={(event) =>
                this.newPatientPopup(event, row.id, row.accountNum)
              }
            >
              {" "}
              {row.accountNum}
            </a>
          ),
          lastName: row.lastName,
          firstName: row.firstName,
          medicalRecordNumber: row.medicalRecordNumber,
          ssn: row.ssn,
          dob: row.dob,
          location: (
            <a
              href=""
              onClick={(event) => this.openLocationPopup(event, row.locationID)}
            >
              {" "}
              {row.location}
            </a>
          ),
          provider: (
            <a
              href=""
              onClick={(event) => this.openProviderPopup(event, row.providerID)}
            >
              {" "}
              {row.provider}
            </a>
          ),
        });
      }
    });

    const tableData = {
      columns: [
        {
          label: "ENTRY DATE",
          field: "entryDate",
          sort: "asc",
          width: 150,
        },
        {
          label: "ACCOUNT #",
          field: "accountNo",
          sort: "asc",
          width: 150,
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
          width: 150,
        },
        // {
        //   label: "PLAN",
        //   field: "plan",
        //   sort: "asc",
        //   width: 150
        // },
        {
          label: "MEDICAL RECORD #",
          field: "medicalRecordNumber",
          sort: "asc",
          width: 150,
        },
        {
          label: "SSN",
          field: "ssn",
          sort: "asc",
          width: 150,
        },
        {
          label: "DOB",
          field: "dob",
          sort: "asc",
          width: 150,
        },

        {
          label: "LOCATION",
          field: "location",
          sort: "asc",
          width: 150,
        },
        {
          label: "PROVIDER",
          field: "provider",
          sort: "asc",
          width: 150,
        },
      ],
      rows: newList,
    };
    let popup = "";

    if (this.state.showpracticePopup) {
      document.body.style.overflow = "hidden";
      popup = (
        <NewPractice
          onClose={this.closepracticePopup}
          practiceID={this.state.id}
        ></NewPractice>
      );
    } else if (this.state.showLocationPopup) {
      document.body.style.overflow = "hidden";
      popup = (
        <NewLocation
          onClose={this.closeLocationPopup}
          id={this.state.id}
        ></NewLocation>
      );
    } else if (this.state.showProviderPopup) {
      document.body.style.overflow = "hidden";
      popup = (
        <NewProvider
          onClose={this.closeProviderPopup}
          id={this.state.id}
        ></NewProvider>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
      document.body.style.overflow = "visible";
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

    return (
      <React.Fragment>
        {spiner}
        <div class="container-fluid">
          {this.props.SchedularAdvSearch ? (
            <SearchHeading
              heading="ADVANCE PATIENT SEARCH"
              handler={() => this.props.changePatientMode()}
              disabled={this.isDisabled(this.props.rights.add)}
            ></SearchHeading>
          ) : (
            <SearchHeading
              heading="PATIENT SEARCH"
              handler={(event) => this.newPatientPopup(event, 0, 0)}
              disabled={this.isDisabled(this.props.rights.add)}
            ></SearchHeading>
          )}

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
                      <label for="firstName">Last Name</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="last Name"
                        name="lastName"
                        id="lastName"
                        maxLength="35"
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
                        maxLength="35"
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
                      <label for="firstName">Account #</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="Account #"
                        name="accountNum"
                        id="accountNum"
                        maxLength="20"
                        value={this.state.searchModel.accountNum}
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
                      <label for="firstName">MRN</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="MRN"
                        name="medicalRecordNumber"
                        id="medicalRecordNumber"
                        maxLength="20"
                        value={this.state.searchModel.medicalRecordNumber}
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
                      <label for="firstName">SSN</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="text"
                        class="provider-form w-100 form-control-user"
                        placeholder="SSN"
                        name="ssn"
                        id="ssn"
                        maxLength="9"
                        value={this.state.searchModel.ssn}
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
                      <label for="EntryDateFrom">DOB</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        min="1900-01-01"
                        max="9999-12-31"
                        type="date"
                        min="1900-01-01"
                        max="9999-12-31"
                        name="dob"
                        id="dob"
                        value={
                          this.state.searchModel.dob == null
                            ? ""
                            : this.state.searchModel.dob
                        }
                        onChange={this.handleDateChange}
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
                        name="insuredID"
                        id="insuredID"
                        value={this.state.searchModel.insuredID}
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
                </div>

                <div class="row">
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
                  <div class="col-md-3 mb-4">
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
                        value={
                          this.state.searchModel.entryDateFrom == null
                            ? ""
                            : this.state.searchModel.entryDateFrom
                        }
                        onChange={this.handleChange}
                      />
                    </div>
                    <div class="invalid-feedback">
                      {this.state.validationModel.enterDateFromValField}
                      {this.state.validationModel.selectEntryDateFromValField}
                    </div>
                  </div>
                  <div class="col-md-3 mb-4">
                    <div class="col-md-4 float-left">
                      <label for="firstName">Entry Date To</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <input
                        type="date"
                        class="provider-form w-100 form-control-user"
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
                      {this.state.validationModel.enterDateToValField}
                      {this.state.validationModel.entryDateToGreaterValField}
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-3 mb-2">
                    <div class="col-md-4 float-left">
                      <label for="firstName">In Active</label>
                    </div>
                    <div class="col-md-7 float-left">
                      <div style={{ marginBottom: "10px" }} class="lblChkBox">
                        <input
                          type="checkbox"
                          id="isValid"
                          name="isValid"
                          checked={this.state.searchModel.inActive}
                          onClick={this.handleCheck}
                        />
                        <label for="reportTaxID">
                          <span></span>
                        </label>
                      </div>
                    </div>
                    <div class="invalid-feedback"></div>
                  </div>
                </div>

                <div class="row">
                  <div
                    class="col-12 pt-2 text-center"
                    style={{ marginTop: "-20px" }}
                  >
                    <button class="btn btn-primary mr-2" type="submit">
                      Search
                    </button>
                    <button
                      class="btn btn-primary mr-2"
                      type="button"
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
  try {
    return {
      patientInfo: state.selectPatient ? state.selectPatient : null,
      patientGridData: state.PatientGridDataReducer
        ? state.PatientGridDataReducer
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
            search: state.loginInfo.rights.patientSearch,
            add: state.loginInfo.rights.patientCreate,
            update: state.loginInfo.rights.patientEdit,
            delete: state.loginInfo.rights.patientDelete,
            export: state.loginInfo.rights.patientExport,
            import: state.loginInfo.rights.patientImport,
          }
        : [],
    };
  } catch {}
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectTabPageAction: selectTabPageAction,
      loginAction: loginAction,
      selectTabAction: selectTabAction,
      selectPatient: selectPatient,
      setPatientGridData: setPatientGridData,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(Patient)
);
