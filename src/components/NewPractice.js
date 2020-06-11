import React, { Component, Fragment } from "react";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import taxonomyIcon from "../images/code-search-icon.png";
import axios from "axios";
import Input from "./Input";
import leftNavMenusReducer from "../reducers/leftNavMenusReducer";
import Swal from "sweetalert2";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable,
} from "mdbreact";
import GridHeading from "./GridHeading";
import { Tabs, Tab } from "react-tab-view";
import NewLocation from "./NewLocation";
import NewProvider from "./NewProvider";
import RefProvider from "./NewRefferingProvider";
import Select, { components } from "react-select";
import settingsIcon from "../images/setting-icon.png";
import Dropdown from "react-dropdown";
import NewHistoryPractice from "./NewHistoryPractice";
import plusSrc from "../images/plus-icon.png";
import settingIcon from "../images/setting-icon.png";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import NumberFormat from "react-number-format";
import TaxonomyCode from "./TaxonomyCode";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { taxonomyCodeAction } from "../actions/TaxonomyAction";

import Hotkeys from "react-hot-keys";

export class NewPractice extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Practice/";
    this.accountUrl = process.env.REACT_APP_URL + "/account/";
    this.commonUrl = process.env.REACT_APP_URL + "/Common/";
    this.clientURL = process.env.REACT_APP_URL + "/client/";

    this.errorField = "errorField";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };
    this.savePracticeCount = 0;

    this.practiceModel = {
      id: 0,
      name: "",
      organizationName: "",
      taxID: "",
      npi: "",
      practice: "",
      taxonomyCode: null,
      cliaNumber: "",
      clientID: null,
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: null,
      officePhoneNum: "",
      phoneNumExt: "",
      email: "",
      website: "",
      faxNumber: "",
      payToAddress1: "",
      payToAddress2: "",
      payToCity: "",
      payToState: "",
      payToZipCode: "",
      defaultLocationID: 0,
      workingHours: "",
      notes: "",
      isActive: true,
      isDeleted: false,
      sameAsAddress: false,
      ssn: "",
      providerName: "",
      type: "",
      provLastName: "",
      provFirstName: "",
      mainAuthIdentityCustom: null,
      statementExportType: "PLD",
      statementMessage: "",
      statementAgingDays: 30,
      statementMaxCount: 3,
      cellNumber: "",
      contactPersonName: "",
      invoicePercentage: "",
      minimumMonthlyAmount: "",
      numberOfFullTimeEmployees: null,
      fTEPerDayRate: "",
      fTEPerWeekRate: "",
      fTEPerMonthRate: "",
      includePatientCollection: false,
      clientCategory: "",
      refferedBy: "",
      pmSoftwareName: "",
      ehrSoftwareName: "",
      statementPhoneNumber: "",
      statementFaxNumber: "",
      appointmentPhoneNumber: "",
    };

    this.validationModel = {
      nameValField: "",
      organizationNameValField: "",
      npiValField: "",
      taxIDValField: "",
      taxonomyCodeValField: "",
      cliaNumberValField: "",
      address1ValField: "",
      address2ValField: "",
      cityValField: "",
      stateValField: "",
      zipCodeValField: "",
      officePhoneNumValField: "",
      emailValField: "",
      websiteValField: "",
      faxNumberValField: "",
      payToAddress1ValField: "",
      payToAddress2ValField: "",
      payToCityValField: "",
      payToStateValField: "",
      payToZipCodeValField: "",
      notesValField: "",
      clientValField: "",
      validation: false,
      ssnValField: "",
      typeValField: "",
      provLastNameValField: "",
      provFirstNameValField: "",
      // vendorValField: ""
    };

    this.state = {
      editId: this.props.practiceID,
      practiceModel: this.practiceModel,
      validationModel: this.validationModel,
      maxHeight: "361",
      loading: false,
      client: [],
      typePractice: false,
      typeValue: "",
      type: "",
      popupName: "",
      id: 0,
      isChecked: false,
      loading: false,
      taxonomyCode: {},
      sameAsClient: false,
      showTaxonomyPopup: false,
      includePatientCollection: false,
      checkedTab: 1,
      widowHeight: "700px",
    };

    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.savePractice = this.savePractice.bind(this);
    this.handleSameAsAddress = this.handleSameAsAddress.bind(this);
    this.delete = this.delete.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleZip = this.handleZip.bind(this);
    this.handletaxonomyCodeChange = this.handletaxonomyCodeChange.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.handleSameAsClient = this.handleSameAsClient.bind(this);
    this.includePatientCollection = this.includePatientCollection.bind(this);
  }

  onKeyDown(e, keyName, handle) {
    if (keyName == "alt+s") {
      // alert("save key")
      this.savePractice(e);
    }

    this.setState({
      output: `onKeyDown ${keyName}`,
    });
  }

  onKeyUp(e, keyName, handle) {
    if (e) {
    }
    this.setState({
      output: `onKeyUp ${keyName}`,
    });
  }

  setModalMaxHeight(element) {
    this.$element = $(element);
    this.$content = this.$element.find(".modal-content");
    var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
    var dialogMargin = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight = this.$element.find(".modal-header").outerHeight() || 0;
    var footerHeight = this.$element.find(".modal-footer").outerHeight() || 0;
    var maxHeight = contentHeight - (headerHeight + footerHeight);

    this.setState({ maxHeight: maxHeight });
  }




  async componentDidMount() {
    // await this.setModalMaxHeight($(".modal"));
    // var zIndex = 1040 + 10 * $(".modal:visible").length;
    // $(this).css("z-Index", zIndex);
    // setTimeout(function () {
    //   $(".modal-backdrop")
    //     .not(".modal-stack")
    //     .css("z-Index", zIndex - 1)
    //     .addClass("modal-stack");
    // }, 0);

    var height = document.getElementById("practiceModal").clientHeight;
    var intFrameHeight = window.innerHeight;
    this.setState({ loading: true, widowHeight: `${intFrameHeight - 50}px` });

    try {
      // if ($('.modal.in').length != 0) {
      //     this.setModalMaxHeight($('.modal.in'));
      // }

      // await axios
      //   .get(this.accountUrl + "getProfiles", this.config)
      //   .then((response) => {
      //     this.setState({ client: response.data.clients });
      //   })
      //   .catch((error) => {
      //     if (error.response) {
      //       if (error.response.status) {
      //         //Swal.fire("Unauthorized Access" , "" , "error");
      //         return;
      //       }
      //     } else if (error.request) {
      //       return;
      //     } else {
      //       //Swal.fire("Something went Wrong" , "" , "error");
      //       return;
      //     }
      //   });

      //TaxonomyCode
      if (
        this.props.userInfo1.taxonomy == null ||
        this.props.userInfo1.taxonomy.length == 0
      ) {
        await axios
          .get(this.commonUrl + "GetTaxonomy", this.config)
          .then((response) => {
            this.props.taxonomyCodeAction(
              this.props,
              response.data,
              "TAXONOMYCODES"
            );
          })
          .catch((error) => {});
      }

      if (this.state.editId > 0) {
        axios
          .get(this.url + "GetProfiles/" + this.state.editId, this.config)
          .then((response) => {
            let arrayToPush = [];
            const pushToProvider = [];
            const pushToReferral = [];
            response.data.location.map((row, i) => {
              arrayToPush.push({
                name: (
                  <a
                    href=""
                    onClick={(event) =>
                      this.openPopup(event, "Location", row.id)
                    }
                  >
                    {row.name}
                  </a>
                ),
                organizationName: row.organizationName,
                practice: row.practice,
                npi: row.npi,
                posCode: row.posCode,
                address: row.address,
                officePhoneNum: row.officePhoneNum,
              });
            });
            response.data.provider.map((row, i) => {
              //Its working upto here
              pushToProvider.push({
                name: (
                  <a
                    href=""
                    onClick={(event) =>
                      this.openPopup(event, "Provider", row.id)
                    }
                  >
                    {row.name}
                  </a>
                ),
                lastName: row.lastName,
                firstName: row.firstName,
                npi: row.npi,
                ssn: row.ssn,
                texonomycode: row.taxonomyCode,
                address: row.address,
                phone: row.officePhoneNum,
              });
            });

            // let pushToReferral = [];
            response.data.refProvider.map((row, i) => {
              pushToReferral.push({
                name: (
                  <a
                    href=""
                    onClick={(event) =>
                      this.openPopup(event, "RefProvider", row.id)
                    }
                  >
                    {row.name}
                  </a>
                ),
                lastName: row.lastName,

                firstName: row.firstName,
                npi: row.npi,
                ssn: row.ssn,
                taxonomyCode: row.taxonomyCode,
                address: row.address,
                officePhoneNum: row.PhoneNumber,
              });
            });

            this.setState({
              RefProviderData: pushToReferral,
              locationData: arrayToPush,
              providerData: pushToProvider,
            });
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status) {
                Swal.fire("Unauthorized Access", "", "error");
              }
            } else if (error.request) {
            } else {
            }
          });

        await axios({
          url: this.url + "FindPractice/" + this.state.editId,
          method: "get",
          headers: {
            Authorization: "Bearer  " + this.props.loginObject.token,
            Accept: "*/*",
          },
        })
          .then((response) => {
            this.setState({ practiceModel: response.data, typePractice: true });
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status) {
                Swal.fire("Unauthorized Access", "", "error");
              }
            } else if (error.request) {
            } else {
              Swal.fire("Something Wrong", "Please Try Again", "error");
            }
          });
      }

      this.setState({
        taxonomyCode: this.props.taxonomyCode.filter(
          (option) => option.value == this.state.practiceModel.taxonomyCode
        ),
      });
    } catch {
      await this.setState({ loading: false });
    }
    await this.setState({ loading: false });
  }

  handleSameAsAddress = (event) => {
    let isChecked = !this.state.isChecked;
    // this.setState ({ isChecked:isChecked }) ;
    this.setState({ isChecked: isChecked });

    if (isChecked) {
      //alert("Click")
      this.setState({
        practiceModel: {
          ...this.state.practiceModel,
          payToAddress1: this.state.practiceModel.address1,
          payToAddress2: this.state.practiceModel.address2,
          payToCity: this.state.practiceModel.city,
          payToState: this.state.practiceModel.state,
          payToZipCode: this.state.practiceModel.zipCode,
        },
      });
    } else {
      // alert("Not Click")

      this.setState({
        practiceModel: {
          ...this.state.practiceModel,
          payToAddress1: "",
          payToAddress2: "",
          payToCity: "",
          payToState: "",
          payToZipCode: "",
        },
      });
    }

    // this.state.practiceModel.payToAddress1=this.state.practiceModel.address1;
    // this.state.practiceModel.payToAddress2=this.state.practiceModel.address2;
    // this.state.practiceModel.payToCity=this.state.practiceModel.city;
    // this.state.practiceModel.payToState=this.state.practiceModel.state;
    // this.state.practiceModel.payToZipCode=this.state.practiceModel.zipCode;

    //event.preventDefault();
    //alert('same address')
    // this.setState({
    //     practiceModel: {
    //         ...this.state.practiceModel,
    //         sameAsAddress: !this.state.practiceModel.sameAsAddress
    //     }
    // });
    // if (this.state.practiceModel.sameAsAddress) {
    //     this.setState({
    //         practiceModel: {
    //             ...this.state.practiceModel,
    //             payToAddress1: this.state.practiceModel.address1,
    //             paytoAddress2: this.state.practiceModel.address2,
    //             payToCity: this.state.practiceModel.city,
    //             paytoState: this.state.practiceModel.state,
    //             paytoZipCode: this.state.practiceModel.zipCode
    //         }
    //     });
    // } else {
    //     this.setState({
    //         practiceModel: {
    //             ...this.state.practiceModel,
    //             paytoAddress: '',
    //             payToCity: '',
    //             paytoState: '',
    //             paytoZipCode: '',
    //         }
    //     });
    // }
  };

  handleZip(event) {
    var zip = event.target.value;

    this.setState({
      practiceModel: {
        ...this.state.practiceModel,
        [event.target.name]: event.target.value,
      },
    });

    if (zip.length == 5 || zip.length == 9) {
      axios
        .get(this.commonUrl + "GetCityStateInfo/" + zip, this.config)
        .then((response) => {
          this.setState({
            practiceModel: {
              ...this.state.practiceModel,
              city: response.data.city.toUpperCase(),
              state: response.data.state_id,
            },
          });
        })
        .catch((error) => {
          this.setState({ loading: false });

          if (error.response.data == "InValid ZipCode") {
            Swal.fire("Something Wrong", "InValid ZipCode", "error");
          } else {
            Swal.fire(
              "Something Wrong",
              "Please Check Server Connection",
              "error"
            );
          }
          let errorsList = [];
          if (error.response !== null && error.response.data !== null) {
            errorsList = error.response.data;
          }
        });
    } else {
      // Swal.fire("Enter Valid Zip Code", "", "error");
    }
  }

  //Yawar Code
  handleChange = (event) => {
    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    // Expression to Match every field except Email
    var regExpr = /[^a-zA-Z0-9 ]/g;
    var myValue = event.target.value;
    var myName = event.target.name;

    if (caret == 0 || caret <= 1) {
      myValue = myValue.trim();
    }

    if (myName == "cliaNumber") {
      myValue = myValue ? myValue : "";
      myValue = myValue.trim();
      myValue = myValue.replace(regExpr, "");
    } else if (myName == "name" || myName == "organizationName") {
      myValue = myValue.replace(regExpr, "");
    } else if (myName == "invoicePercentage") {
      if (myValue < 0) {
        Swal.fire("Something Wrong", "Enter Valid Value", "error");
        return;
      }
      if (myValue > 100) {
        Swal.fire("Something Wrong", "Enter Valid Value", "error");
        return;
      }
      myValue = Number(myValue).toFixed(2);
    } else {
      myValue = myValue ? myValue : "";
      myValue = myValue;
    }
    this.setState({
      practiceModel: {
        ...this.state.practiceModel,
        [myName]: myValue.toUpperCase(),
      },
    });
  };

  handleChangeType = (event) => {
    this.setState({
      typePractice: true,
      type: event.target.value,
      // type: event.target.value
      practiceModel: {
        ...this.state.practiceModel,
        [event.target.name]: event.target.value,
      },
    });
  };

  handleCheck = () => {
    this.setState({
      practiceModel: {
        ...this.state.practiceModel,
        isActive: !this.state.practiceModel.isActive,
      },
    });
  };

  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  isNull(value) {
    if (value === "" || value === null || value === undefined) return true;
    else return false;
  }

  savePractice = async (e) => {
    if (this.savePracticeCount == 1) {
      return;
    }
    this.savePracticeCount = 1;
    // if (this.state.loading == true) {
    //   return;
    // }

    await this.setState({ loading: true });

    if (this.isNull(this.state.practiceModel.officePhoneNum) === false) {
      if (this.state.practiceModel.officePhoneNum.length > 10) {
        var officePhoneNum = this.state.practiceModel.officePhoneNum.slice(
          3,
          17
        );
        this.state.practiceModel.officePhoneNum = officePhoneNum.replace(
          /[-_ )(]/g,
          ""
        );
      }
    }

    if (this.isNull(this.state.practiceModel.statementPhoneNumber) === false) {
      if (this.state.practiceModel.statementPhoneNumber.length > 10) {
        var statementPhoneNumber = this.state.practiceModel.statementPhoneNumber.slice(
          3,
          17
        );
        this.state.practiceModel.statementPhoneNumber = statementPhoneNumber.replace(
          /[-_ )(]/g,
          ""
        );
      }
    }

    if (
      this.isNull(this.state.practiceModel.appointmentPhoneNumber) === false
    ) {
      if (this.state.practiceModel.appointmentPhoneNumber.length > 10) {
        var appointmentPhoneNumber = this.state.practiceModel.appointmentPhoneNumber.slice(
          3,
          17
        );
        this.state.practiceModel.appointmentPhoneNumber = appointmentPhoneNumber.replace(
          /[-_ )(]/g,
          ""
        );
      }
    }

    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.practiceModel.name)) {
      myVal.nameValField = <span>Enter Name</span>;
      myVal.validation = true;
    } else {
      myVal.nameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.practiceModel.organizationName)) {
      myVal.organizationNameValField = <span>Enter Organization Name</span>;
      myVal.validation = true;
    } else {
      myVal.organizationNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.practiceModel.npi)) {
      myVal.npiValField = <span>Enter NPI</span>;
      myVal.validation = true;
    } else if (this.state.practiceModel.npi.length < 10) {
      myVal.npiValField = <span>NPI length should be 10</span>;
      myVal.validation = true;
    } else {
      myVal.npiValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.practiceModel.taxID) &&
      this.state.practiceModel.type == "GP"
    ) {
      myVal.taxIDValField = <span>Enter Tax ID</span>;
      myVal.validation = true;
    } else if (
      this.state.practiceModel.taxID.length < 9 &&
      this.state.practiceModel.type == "GP"
    ) {
      myVal.taxIDValField = <span>Tax ID length should be 9</span>;
      myVal.validation = true;
    } else {
      myVal.taxIDValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.practiceModel.taxonomyCode) === false) {
    }
    // if (
    //         this.state.practiceModel.taxonomyCode.length < 10
    // ) {
    //   myVal.taxonomyCodeValField = (
    //     <span  >Taxonomy Code length should be 9</span>
    //   );
    //   myVal.validation = true;
    // }
    if (this.isNull(this.state.practiceModel.clientID)) {
      myVal.clientValField = <span>Select Client</span>;
      myVal.validation = true;
    } else {
      myVal.clientValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }
    ////////////
    if (this.isNull(this.state.practiceModel.type)) {
      myVal.typeValField = <span>Select Type</span>;
      myVal.validation = true;
    } else {
      myVal.typeValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.state.practiceModel.type == "SP") {
      if (this.isNull(this.state.practiceModel.ssn)) {
        myVal.ssnValField = <span>Enter SSN</span>;
        myVal.validation = true;
      } else if (
        this.isNull(this.state.practiceModel.ssn) === false &&
        this.state.practiceModel.ssn.length < 9
      ) {
        myVal.ssnValField = <span>SSN length should be 9</span>;
        myVal.validation = true;
      } else {
        myVal.ssnValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }

      if (this.isNull(this.state.practiceModel.provFirstName)) {
        myVal.provFirstNameValField = <span>Enter First Name</span>;
        myVal.validation = true;
      } else {
        myVal.provFirstNameValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }

      if (this.isNull(this.state.practiceModel.provLastName)) {
        myVal.provLastNameValField = <span>Enter Last Name</span>;
        myVal.validation = true;
      } else {
        myVal.provLastNameValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.ssnValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.practiceModel.cliaNumber) == false) {
      if (
        this.state.practiceModel.cliaNumber.length > 10 &&
        this.state.practiceModel.cliaNumber.length < 10
      ) {
        myVal.cliaNumberValField = <span>cliaNumber length should be 10</span>;
        myVal.validation = true;
      } else {
        myVal.cliaNumberValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    }

    if (this.isNull(this.state.practiceModel.zipCode) === false) {
      if (
        this.state.practiceModel.zipCode.length > 0 &&
        this.state.practiceModel.zipCode.length < 5
      ) {
        myVal.zipCodeValField = <span>Zip should be of alleast 5 digits</span>;
        myVal.validation = true;
      } else if (
        this.state.practiceModel.zipCode.length > 5 &&
        this.state.practiceModel.zipCode.length < 9
      ) {
        myVal.zipCodeValField = (
          <span>Zip should be of either 5 or 9 digits</span>
        );
        myVal.validation = true;
      } else {
        myVal.zipCodeValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.zipCodeValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    // Patient Statement Vendor Drop down
    if (this.isNull(this.state.practiceModel.statementExportType)) {
      myVal.vendorValField = <span>Select Vendor</span>;
      myVal.validation = true;
    } else {
      myVal.vendorValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.practiceModel.faxNumber) === false) {
      if (this.state.practiceModel.faxNumber.length < 10) {
        myVal.faxNumberValField = <span>Fax # length should be 10</span>;
        myVal.validation = true;
      } else {
        myVal.faxNumberValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    }

    if (this.isNull(this.state.practiceModel.officePhoneNum) === false) {
      if (this.state.practiceModel.officePhoneNum.length < 10) {
        myVal.officePhoneNumValField = <span>Phone # length should be 10</span>;
        myVal.validation = true;
      } else {
        myVal.officePhoneNumValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    }

    myVal.emailValField = "";
    await this.setState({
      validationModel: myVal,
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      this.savePracticeCount = 0;
      Swal.fire("Please Enter Valid Details", "", "error");
      return;
    }

    axios
      .post(this.url + "SavePractice", this.state.practiceModel, this.config)
      .then((response) => {
        this.savePracticeCount = 0;

        var practiceModal = response.data;
        practiceModal.mainAuthIdentityCustom = null;
        this.setState({ loading: false, practiceModel: practiceModal });
        Swal.fire("Record Saved Successfully", "", "success");
      })
      .catch((error) => {
        this.savePracticeCount = 0;

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
                if (error.response.data.Email) {
                  if (error.response.data.Email[0]) {
                    myVal.emailValField = (
                      <span className="validationMsg">
                        Please enter Valid Email ID
                      </span>
                    );
                    myVal.validation = true;
                  } else {
                    myVal.emailValField = "";
                    if (myVal.validation === false) myVal.validation = false;
                  }
                  this.setState({
                    validationModel: myVal,
                  });
                } else {
                  Swal.fire("Error", error.response.data, "error");
                  return;
                }
              } else {
                Swal.fire("Something Wrong", "Please Try Again", "error");
                return;
              }
            }
          } else {
            Swal.fire("Something went Wrong", "", "error");
            return;
          }
        } catch {}
      });

    // e.preventDefault();
  };

  delete = (e) => {
    var config = {
      headers: { Authorization: "Bearer  " + this.props.loginObject.token },
    };

    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.setState({ loading: true });
        axios
          .delete(this.url + "DeletePractice/" + this.state.editId, config)
          .then((response) => {
            this.setState({ loading: false });
            Swal.fire("Record Deleted Successfully", "", "success");
          })
          .catch((error) => {
            this.setState({ loading: false });

            if (this.state.editId > 0) {
              Swal.fire(
                "Record Not Deleted!",
                "Record can not be delete, as it is being reference in other screens.",
                "error"
              );
            } else {
              Swal.fire(
                "Record Not Deleted!",
                "Don't have record to delete",
                "error"
              );
            }
            if (error.response) {
              if (error.response.status) {
                // Swal.fire("Unauthorized Access", "", "error");
              }
            } else if (error.request) {
            } else {
            }
          });

        $("#btnCancel").click();
      }
    });
  };

  openPopup = (event, name, id) => {
    event.preventDefault();
    this.setState({ popupName: name, id: id });
  };

  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  handletaxonomyCodeChange(event) {
    if (event) {
      this.setState({
        taxonomyCode: event,
        // taxonomyCodeobj: event.id,
        practiceModel: {
          ...this.state.practiceModel,
          taxonomyCode: event.value,
        },
      });
    } else {
      this.setState({
        taxonomyCode: null,
        // taxonomyCodeobj: event.id,
        practiceModel: {
          ...this.state.practiceModel,
          taxonomyCode: null,
        },
      });
    }
  }

  openhistorypopup = (id) => {
    this.setState({ showPopup: true, id: id });
  };

  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };

  onPaste(event) {
    var x = event.target.value;
    x = x.trim();

    var regex = /^[0-9]+$/;
    if (x.length > 10) {
      // if (x.length > 9) {
      x = x.trimRight();
      Swal.fire("Error", "Length of NPI Should be 10", "error");
      // }
    } else if (x.length == 0) {
      this.setState({
        practiceModel: {
          ...this.state.practiceModel,
          [event.target.name]: x,
        },
      });
      return;
    }

    if (!x.match(regex)) {
      Swal.fire("Error", "NPI Should be Number", "error");
      return;
    } else {
      this.setState({
        practiceModel: {
          ...this.state.practiceModel,
          [event.target.name]: x,
        },
      });
    }
    return;
  }

  handleSameAsClient(event) {
    let isChecked = !this.state.sameAsClient;
    if (
      this.state.practiceModel.clientID == "" ||
      this.state.practiceModel.clientID == null
    ) {
      Swal.fire("Select Client", "", "error");
    } else {
      this.setState({ sameAsClient: isChecked });
      axios
        .get(
          this.clientURL + "findClient/" + this.state.practiceModel.clientID,
          this.config
        )
        .then((response) => {
          if (isChecked) {
            this.setState({
              practiceModel: {
                ...this.state.practiceModel,
                // id: response.data.id ? response.data.id : "",
                name: response.data.name ? response.data.name : "",
                organizationName: response.data.organizationName
                  ? response.data.organizationName
                  : "",
                taxID: response.data.taxID ? response.data.taxID : "",
                clientID: response.data.id ? response.data.id : "",
                address1: response.data.address ? response.data.address : "",
                address2: response.data.address ? response.data.address : "",
                city: response.data.city ? response.data.city : "",
                state: response.data.state ? response.data.state : "",
                zipCode: response.data.zipCode ? response.data.zipCode : "",
                officePhoneNum: response.data.officePhoneNo
                  ? response.data.officePhoneNo
                  : "",
                phoneNumExt: response.data.id ? response.data.id : "",
                email: response.data.officeEmail
                  ? response.data.officeEmail
                  : "",
                faxNumber: response.data.faxNo ? response.data.faxNo : "",
                ZipCode: this.state.practiceModel.zipCode,
              },
            });
          } else {
            this.setState({
              practiceModel: {
                ...this.state.practiceModel,
                // id: "",
                name: "",
                organizationName: "",
                taxID: "",
                clientID: "",
                address1: "",
                address2: "",
                city: "",
                state: "",
                zipCode: "",
                officePhoneNum: "",
                phoneNumExt: "",
                email: "",
                faxNumber: "",
              },
            });
          }
        })
        .catch((error) => {
          // console.log(error);
        });
    }
  }

  includePatientCollection(event) {
    let isChecked = !this.state.practiceModel.includePatientCollection;
    this.setState({
      practiceModel: {
        ...this.state.practiceModel,
        includePatientCollection: isChecked,
      },
    });
  }

  openTaxonomyPopup = (id) => {
    this.setState({ showTaxonomyPopup: true, id: id });
  };

  closeTaxonomyPopup = (id) => {
    this.setState({ showTaxonomyPopup: false, id: id });
  };

  handleTabCheck = (tabID) => {
    const checkedTab =
      this.state.checkedTab != tabID ? tabID : this.state.checkedTab;
    this.setState({ checkedTab: checkedTab });
  };

  render() {
    const headers = ["Location", "Provider", "Referring Providers"];

    const locationData = {
      columns: [
        {
          label: "NAME",
          field: "name",
          sort: "asc",
          width: 150,
        },
        {
          label: "ORGANIZATION NAME",
          field: "organizationName",
          sort: "asc",
          width: 300,
        },
        {
          label: "PRACTICE",
          field: "practice",
          sort: "asc",
          width: 250,
        },

        {
          label: "NPI",
          field: "npi",
          sort: "asc",
          width: 200,
        },
        {
          label: "POS CODE",
          field: "posCode",
          sort: "asc",
          width: 150,
        },
        {
          label: "ADDRESS",
          field: "address",
          sort: "asc",
          width: 100,
        },
      ],
      rows: this.state.locationData,
    };
    const providerData = {
      columns: [
        {
          label: "NAME",
          field: "name",
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
          label: "FIRST NAME ",
          field: "firstName",
          sort: "asc",
          width: 150,
        },
        {
          label: "NPI",
          field: "npi",
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
          label: "TEXONOMY CODE",
          field: "texonomycode",
          sort: "asc",
          width: 150,
        },
        {
          label: "ADDRESS ,CITY, STATE, ZIP",
          field: "address",
          sort: "asc",
          width: 150,
        },
        {
          label: "OFFICE PHONE#",
          field: "phone",
          sort: "asc",
          width: 150,
        },
      ],
      rows: this.state.providerData,
    };

    const RefProviderData = {
      columns: [
        {
          label: "NAME",
          field: "name",
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
          label: "FIRST NAME ",
          field: "firstName",
          sort: "asc",
          width: 150,
        },
        {
          label: "NPI",
          field: "npi",
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
          label: "TEXONOMY CODE",
          field: "taxonomyCode",
          sort: "asc",
          width: 150,
        },
        {
          label: "ADDRESS ,CITY, STATE, ZIP",
          field: "address",
          sort: "asc",
          width: 150,
        },
        {
          label: "OFFICE PHONE#",
          field: "officePhoneNum",
          sort: "asc",
          width: 150,
        },
      ],
      rows: this.state.RefProviderData,
    };

    const type = [
      { value: "", display: "Select Type" },
      { value: "SP", display: "Solo Practice" },
      { value: "GP", display: "Group Practice" },
    ];

    const usStates = [
      { value: "", display: "Select State" },
      { value: "AL", display: "AL - Alabama" },
      { value: "AK", display: "AK - Alaska" },
      { value: "AZ", display: "AZ - Arizona" },
      { value: "AR", display: "AR - Arkansas" },
      { value: "CA", display: "CA - California" },
      { value: "CO", display: "CO - Colorado" },
      { value: "CT", display: "CT - Connecticut" },
      { value: "DE", display: "DE - Delaware" },
      { value: "FL", display: "FL - Florida" },
      { value: "GA", display: "GA - Georgia" },
      { value: "HI", display: "HI - Hawaii" },
      { value: "ID", display: "ID - Idaho" },
      { value: "IL", display: "IL - Illinois" },
      { value: "IN", display: "IN - Indiana" },
      { value: "IA", display: "IA - Iowa" },
      { value: "KS", display: "KS - Kansas" },
      { value: "KY", display: "KY - Kentucky" },
      { value: "LA", display: "LA - Louisiana" },
      { value: "ME", display: "ME - Maine" },
      { value: "MD", display: "MD - Maryland" },
      { value: "MA", display: "MA - Massachusetts" },
      { value: "MI", display: "MI - Michigan" },
      { value: "MN", display: "MN - Minnesota" },
      { value: "MS", display: "MS - Mississippi" },
      { value: "MO", display: "MO - Missouri" },
      { value: "MT", display: "MT - Montana" },
      { value: "NE", display: "NE - Nebraska" },
      { value: "NV", display: "NV - Nevada" },
      { value: "NH", display: "NH - New Hampshire" },
      { value: "NJ", display: "NJ - New Jersey" },
      { value: "NM", display: "NM - New Mexico" },
      { value: "NY", display: "NY - New York" },
      { value: "NC", display: "NC - North Carolina" },
      { value: "ND", display: "ND - North Dakota" },
      { value: "OH", display: "OH - Ohio" },
      { value: "OK", display: "OK - Oklahoma" },
      { value: "OR", display: "OR - Oregon" },
      { value: "PA", display: "PA - Pennsylvania" },
      { value: "RI", display: "RI - Rhode Island" },
      { value: "SC", display: "SC - South Carolina" },
      { value: "SD", display: "SD - South Dakota" },
      { value: "TN", display: "TN - Tennessee" },
      { value: "TX", display: "TX - Texas" },
      { value: "UT", display: "UT - Utah" },
      { value: "VT", display: "VT - Vermont" },
      { value: "VA", display: "VA - Virginia" },
      { value: "WA", display: "WA - Washington" },
      { value: "WV", display: "WV - West Virginia" },
      { value: "WI", display: "WI - Wisconsin" },
      { value: "WY", display: "WY - Wyoming" },
    ];

    const options = [
      { value: "History", label: "History", className: "dropdown" },
    ];

    const statementExportType = [
      { value: "", display: "Select Type" },
      { value: "PLD", display: "PLD" },
      { value: "Manual Statement", display: "Manual Statement" },
    ];

    const clientCategory = [
      { value: "", display: "Select Type" },
      { value: "A", display: "A" },
      { value: "B", display: "B" },
      { value: "C", display: "C" },
      { value: "D", display: "D" },
    ];

    var Imag;
    Imag = (
      <div>
        <img src={settingsIcon} />
      </div>
    );

    var dropdown;
    dropdown = (
      <Dropdown
        className=""
        options={options}
        onChange={() => this.openhistorypopup(0)}
        //  value={options}
        // placeholder={"Select an option"}
        placeholder={Imag}
      />
    );
    const isActive = this.state.practiceModel.isActive;

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

    //////////////////// handle ssn /////////////////
    let typeValuefield = "";
    typeValuefield = (
      <div class="row">
        <div class="col-md-4 mb-2">
          <div class="col-md-4 float-left">
            <label for="">
              SSN<span class="text-danger">*</span>
            </label>
          </div>
          <div class="col-md-8 float-left">
            <input
              type="text"
              class="provider-form w-100 form-control-user"
              placeholder="SSN"
              value={this.state.practiceModel.ssn}
              name="ssn"
              id="ssn"
              maxLength="9"
              onChange={this.handleChange}
              onKeyPress={(event) => this.handleNumericCheck(event)}
              onInput={this.onPaste}
            />
          </div>
          <div class="invalid-feedback">
            {this.state.validationModel.ssnValField}
          </div>
        </div>

        <div class="col-md-4 mb-2">
          <div class="col-md-4 float-left">
            <label for="">
              Provider First Name<span class="text-danger">*</span>
            </label>
          </div>
          <div class="col-md-8 float-left">
            <input
              type="text"
              class="provider-form w-100 form-control-user"
              placeholder=" Provider First Name"
              value={this.state.practiceModel.provFirstName}
              name="provFirstName"
              id="provFirstName"
              maxLength="20"
              disabled={this.state.editId > 0 ? true : false}
              onChange={this.handleChange}
            />
          </div>
          <div class="invalid-feedback">
            {this.state.validationModel.provFirstNameValField}
          </div>
        </div>

        <div class="col-md-4 mb-2">
          <div class="col-md-4 float-left">
            <label for="">
              Provider Last Name<span class="text-danger">*</span>
            </label>
          </div>
          <div class="col-md-8 float-left">
            <input
              type="text"
              class="provider-form w-100 form-control-user"
              placeholder=" Provider Last Name"
              value={this.state.practiceModel.provLastName}
              name="provLastName"
              id="provLastName"
              maxLength="20"
              disabled={this.state.editId > 0 ? true : false}
              onChange={this.handleChange}
            />
          </div>
          <div class="invalid-feedback">
            {this.state.validationModel.provLastNameValField}
          </div>
        </div>
      </div>
    );

    ////////////////////////// Invoice Information Later on display will be on basis of Role ////////////////////////////

    let invoiceInfo = "";
    invoiceInfo = (
      <div class="row">
        <div class="col-md-12 order-md-1 provider-form ">
          <div class="header pt-1">
            <h6 class="heading">Invoice Details</h6>
            <hr
              class="p-0 mt-0 mb-1"
              style={{ backgroundColor: "#037592" }}
            ></hr>
            <div class="clearfix"></div>
          </div>
          <br></br>

          <div class="row">
            <div class="col-md-4 mb-2">
              <div class="col-md-4 float-left">
                <label for="">
                  Invoice Percentage
                  {/* <span class="text-danger">*</span> */}
                </label>
              </div>
              <div class="col-md-8 float-left">
                <input
                  type="text"
                  class="provider-form w-100 form-control-user"
                  placeholder="Invoice Percentage"
                  value={this.state.practiceModel.invoicePercentage}
                  name="invoicePercentage"
                  id="invoicePercentage"
                  // max="55"
                  onChange={this.handleChange}
                  onKeyPress={(event) => this.handleNumericCheck(event)}
                />
              </div>
              <div class="invalid-feedback">
                {/* {this.state.validationModel.ssnValField} */}
              </div>
            </div>

            <div class="col-md-4 mb-2">
              <div class="col-md-4 float-left">
                <label for="">
                  Minimum Monthly Amt {/* <span class="text-danger">*</span> */}
                </label>
              </div>
              <div class="col-md-8 float-left">
                <input
                  type="text"
                  class="provider-form w-100 form-control-user"
                  placeholder=" Minimum Monthly Amt"
                  value={this.state.practiceModel.minimumMonthlyAmount}
                  name="minimumMonthlyAmount"
                  id="minimumMonthlyAmount"
                  // max="55"
                  onChange={this.handleChange}
                  onKeyPress={(event) => this.handleNumericCheck(event)}
                />
              </div>
              <div class="invalid-feedback">
                {/* {this.state.validationModel.provFirstNameValField} */}
              </div>
            </div>

            <div class="col-md-4 mb-2">
              <div class="col-md-4 float-left">
                <label for="">
                  Full Time Employees # {/* <span class="text-danger">*</span> */}
                </label>
              </div>
              <div class="col-md-8 float-left">
                <input
                  type="text"
                  class="provider-form w-100 form-control-user"
                  placeholder="Full Time Employees #"
                  value={this.state.practiceModel.numberOfFullTimeEmployees}
                  name="numberOfFullTimeEmployees"
                  id="numberOfFullTimeEmployees"
                  // max="55"
                  onChange={this.handleChange}
                  onKeyPress={(event) => this.handleNumericCheck(event)}
                />
              </div>
              <div class="invalid-feedback">
                {/* {this.state.validationModel.provLastNameValField} */}
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4 mb-2">
              <div class="col-md-4 float-left">
                <label for="">
                  FTE Per Day Rate {/* <span class="text-danger">*</span> */}
                </label>
              </div>
              <div class="col-md-8 float-left">
                <input
                  type="text"
                  class="provider-form w-100 form-control-user"
                  placeholder="FTE Per Day Rate"
                  value={this.state.practiceModel.ftePerDayRate}
                  name="ftePerDayRate"
                  id="ftePerDayRate"
                  // max="55"
                  onChange={this.handleChange}
                  onKeyPress={(event) => this.handleNumericCheck(event)}
                />
              </div>
              <div class="invalid-feedback">
                {/* {this.state.validationModel.ssnValField} */}
              </div>
            </div>

            <div class="col-md-4 mb-2">
              <div class="col-md-4 float-left">
                <label for="">
                  FTE Per Week Rate {/* <span class="text-danger">*</span> */}
                </label>
              </div>
              <div class="col-md-8 float-left">
                <input
                  type="text"
                  class="provider-form w-100 form-control-user"
                  placeholder=" FTE Per Week Rate"
                  value={this.state.practiceModel.ftePerWeekRate}
                  name="ftePerWeekRate"
                  id="ftePerWeekRate"
                  // max="55"
                  onChange={this.handleChange}
                  onKeyPress={(event) => this.handleNumericCheck(event)}
                />
              </div>
              <div class="invalid-feedback">
                {/* {this.state.validationModel.provFirstNameValField} */}
              </div>
            </div>

            <div class="col-md-4 mb-2">
              <div class="col-md-4 float-left">
                <label for="">
                  FTE Per Month Rate {/* <span class="text-danger">*</span> */}
                </label>
              </div>
              <div class="col-md-8 float-left">
                <input
                  type="text"
                  class="provider-form w-100 form-control-user"
                  placeholder="FTE Per Month Rate"
                  value={this.state.practiceModel.ftePerMonthRate}
                  name="ftePerMonthRate"
                  id="ftePerMonthRate"
                  // max="55"
                  onChange={this.handleChange}
                  onKeyPress={(event) => this.handleNumericCheck(event)}
                />
              </div>
              <div class="invalid-feedback">
                {/* {this.state.validationModel.provLastNameValField} */}
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4 mb-2">
              <div class="col-md-4 float-left">
                <label for="">Include Patient Collection</label>
              </div>
              <div class="col-md-8 float-left">
                <input
                  style={{ width: "20px", height: "20px" }}
                  class="checkbox"
                  type="checkbox"
                  id="includePatientCollection"
                  name="includePatientCollection"
                  checked={this.state.practiceModel.includePatientCollection}
                  onChange={this.includePatientCollection}
                />
              </div>
              <div class="invalid-feedback">
                {/* {this.state.validationModel.ssnValField} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    let popup = "";
    if (this.state.popupName == "Location") {
      popup = (
        <NewLocation onClose={this.closePopup} id={this.state.id}></NewLocation>
      );
    } else if (this.state.popupName == "Provider") {
      popup = (
        <NewProvider onClose={this.closePopup} id={this.state.id}></NewProvider>
      );
    } else if (this.state.popupName == "RefProvider") {
      popup = (
        <RefProvider onClose={this.closePopup} id={this.state.id}></RefProvider>
      );
    } else if (this.state.showPopup) {
      popup = (
        <NewHistoryPractice
          onClose={this.closehistoryPopup}
          historyID={this.props.practiceID}
          apiURL={this.url}
          // disabled={this.isDisabled(this.props.rights.update)}
          // disabled={this.isDisabled(this.props.rights.add)}
        ></NewHistoryPractice>
      );
    } else if (this.state.showTaxonomyPopup) {
      popup = <TaxonomyCode onClose={this.closeTaxonomyPopup}></TaxonomyCode>;
    } else {
      popup = <React.Fragment></React.Fragment>;
    }

    console.log("WindowHeight : ", this.state.widowHeight);
    return (
      <React.Fragment>
        <div
          class="modal fade show popupBackScreen"
          id="practiceModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            class="modal-dialog"
            // style={{ margin: "8.8rem auto" }}
            role="document"
          >
            <div
              class="modal-content"
              style={{ minHeight: "500px", maxHeight: this.state.widowHeight }}
            >
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 form-group provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>
                        {this.state.editId > 0
                          ? this.state.practiceModel.name.toUpperCase() +
                            " - " +
                            this.state.practiceModel.id
                          : "NEW PRACTICE"}
                      </h3>

                      <div class="float-lg-right text-right">
                        <input
                          class="checkbox mr-2"
                          type="checkbox"
                          checked={this.state.sameAsClient}
                          disabled={this.state.editId > 0 ? true : false}
                          id="sameAsClient"
                          name="sameAsClient"
                          onChange={(event) => this.handleSameAsClient(event)}
                        />
                        Same As Client
                        <input
                          class="checkbox ml-2"
                          type="checkbox"
                          checked={!isActive}
                          onChange={(event) => this.handleCheck(event)}
                          id="isActive"
                          name="isActive"
                        />
                        Mark Inactive
                        <button
                          class="btn btn-primary ml-2"
                          type="submit"
                          onClick={this.delete}
                          disabled={this.isDisabled(this.props.rights.delete)}
                        >
                          Delete
                        </button>
                        {/* {this.state.editId > 0 ? (<img src={settingIcon} alt="" style={{ width: "32px" }} />) : ""} */}
                        {this.state.editId > 0 ? dropdown : ""}
                        <button
                          class="close"
                          type="button"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span
                            aria-hidden="true"
                            onClick={() => this.props.onClose()}
                          >
                            ×
                          </span>
                        </button>
                      </div>
                    </div>
                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>

                    <br></br>
                    {/* Main Content */}
                    <div class="row">
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="">
                            Name<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Name"
                            disabled={this.state.editId > 0 ? true : false}
                            value={this.state.practiceModel.name}
                            name="name"
                            id="name"
                            maxLength="60"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.nameValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="">
                            Organization Name<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Organization Name"
                            disabled={this.state.editId > 0 ? true : false}
                            value={this.state.practiceModel.organizationName}
                            name="organizationName"
                            id="organizationName"
                            maxLength="100"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.organizationNameValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="">
                            NPI<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="NPI"
                            disabled={this.state.editId > 0 ? true : false}
                            value={this.state.practiceModel.npi}
                            name="npi"
                            id="npi"
                            maxLength="10"
                            onChange={this.handleChange}
                            onKeyPress={(event) =>
                              this.handleNumericCheck(event)
                            }
                            onInput={this.onPaste}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.npiValField}
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="">
                            Taxonomy Code
                            {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <Select
                            type="text"
                            value={this.state.taxonomyCode}
                            name="taxonomyCode"
                            id="taxonomyCode"
                            max="10"
                            onChange={(event) =>
                              this.handletaxonomyCodeChange(event)
                            }
                            options={this.props.taxonomyCode}
                            placeholder="Taxonomy Code"
                            isClearable={true}
                            isSearchable={true}
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
                                width: "91%",
                              }),
                              indicatorsContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                marginBottom: "0",
                                marginTop: "0px",
                                height: "36px",
                                borderBottomRightRadius: "10px",
                                borderTopRightRadius: "10px",
                                // borderRadius:"0 6px 6px 0"
                              }),
                              indicatorContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "9px",
                                marginBottom: "0",
                                marginTop: "1px",
                                // borderBottomRightRadius: "5px",
                                // borderTopRightRadius: "5px",
                                borderRadius: "0 4px 4px 0",
                              }),
                              dropdownIndicator: (defaultStyles) => ({
                                display: "none",
                              }),
                              input: (defaultStyles) => ({
                                ...defaultStyles,
                                margin: "0px",
                                padding: "0px",
                                // display:'none'
                              }),
                              singleValue: (defaultStyles) => ({
                                ...defaultStyles,
                                fontSize: "16px",
                                transition: "opacity 300ms",
                                // display:'none'
                              }),
                              control: (defaultStyles) => ({
                                ...defaultStyles,
                                minHeight: "30px",
                                height: "30px",
                                height: "33px",
                                paddingLeft: "10px",
                                //borderColor:"transparent",
                                borderColor: "#7d8086",
                                boxShadow: "none",
                                borderColor: "#C6C6C6",
                                "&:hover": {
                                  borderColor: "#C6C6C6",
                                },
                                // display:'none'
                              }),
                            }}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.taxonomyCodeValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="">
                            CLIA<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="CLIA"
                            value={this.state.practiceModel.cliaNumber}
                            name="cliaNumber"
                            id="cliaNumber"
                            maxLength="10"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.cliaNumberValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="">
                            Tax ID
                            {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Tax ID"
                            value={this.state.practiceModel.taxID}
                            name="taxID"
                            id="taxID"
                            maxLength="9"
                            onChange={this.handleChange}
                            onKeyPress={(event) =>
                              this.handleNumericCheck(event)
                            }
                            onInput={this.onPaste}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.taxIDValField}
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="">
                            Client <span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <select
                            style={{
                              borderRadius: "6px",
                              border: "1px solid rgb(125, 128, 134)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "30px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "100%",
                              paddingLeft: "2px",
                              paddingBottom: "6px",
                              paddingTop: "6px",
                              color: "rgb(67, 75, 93",
                            }}
                            name="clientID"
                            id="clientID"
                            value={this.state.practiceModel.clientID}
                            disabled={this.props.practiceID > 0 ? true : false}
                            onChange={this.handleChange}
                          >
                            {this.props.clients.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.clientValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="">
                            Type <span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <select
                            style={{
                              borderRadius: "6px",
                              border: "1px solid rgb(125, 128, 134)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "30px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "100%",
                              paddingLeft: "2px",
                              paddingBottom: "6px",
                              paddingTop: "6px",
                              color: "rgb(67, 75, 93",
                            }}
                            name="type"
                            id="type"
                            disabled={this.state.editId > 0 ? true : false}
                            value={this.state.practiceModel.type}
                            onChange={this.handleChangeType}
                          >
                            {type.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.typeValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2"></div>
                    </div>

                    {this.state.typePractice === true &&
                    this.state.practiceModel.type == "SP"
                      ? typeValuefield
                      : null}

                    <div class="row">
                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Address Information</h6>
                          <hr
                            class="p-0 mt-0 mb-1"
                            style={{ backgroundColor: "#037592" }}
                          ></hr>
                          <div class="clearfix"></div>
                        </div>
                        <br></br>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="">
                                Address 1
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Address 1"
                                required=""
                                value={this.state.practiceModel.address1}
                                name="address1"
                                id="address1"
                                maxLength="55"
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="">Address 2</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Address 2"
                                required=""
                                value={this.state.practiceModel.address2}
                                name="address2"
                                id="address2"
                                maxLength="55"
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="">
                                Email
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Email"
                                required=""
                                value={this.state.practiceModel.email}
                                name="email"
                                id="email"
                                maxLength="60"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.emailValField}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="">
                                City
                                {/* <span
                              class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="City"
                                required=""
                                value={this.state.practiceModel.city}
                                name="city"
                                id="city"
                                maxLength="20"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.cityValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="">
                                State
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <select
                                style={{
                                  borderRadius: "6px",
                                  border: "1px solid rgb(125, 128, 134)",
                                  boxSizing: "border-box",
                                  display: "block",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  height: "30px",
                                  lineHeight: "auto",
                                  outline: "none",
                                  position: "relative",
                                  width: "100%",
                                  paddingLeft: "2px",
                                  paddingBottom: "6px",
                                  paddingTop: "6px",
                                  color: "rgb(67, 75, 93",
                                }}
                                name="state"
                                id="state"
                                value={this.state.practiceModel.state}
                                onChange={this.handleChange}
                              >
                                {usStates.map((s) => (
                                  <option key={s.value} value={s.value}>
                                    {s.display}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.stateValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="">
                                Zip Code
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Zip Code"
                                required=""
                                value={this.state.practiceModel.zipCode}
                                maxLength="9"
                                name="zipCode"
                                id="zipCode"
                                onChange={this.handleZip}
                                onKeyPress={(event) =>
                                  this.handleNumericCheck(event)
                                }
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.zipCodeValField}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="">Fax</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Fax"
                                required=""
                                value={this.state.practiceModel.faxNumber}
                                maxLength="10"
                                name="faxNumber"
                                id="faxNumber"
                                onChange={this.handleChange}
                                onKeyPress={(event) =>
                                  this.handleNumericCheck(event)
                                }
                                onInput={this.onPaste}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.faxNumberValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="">Office Phone #</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <NumberFormat
                                class="provider-form w-100 form-control-user"
                                format="00 (###) ###-####"
                                mask="_"
                                className={
                                  this.state.validationModel
                                    .officePhoneNumValField
                                    ? this.errorField
                                    : ""
                                }
                                type="text"
                                value={this.state.practiceModel.officePhoneNum}
                                max="10"
                                name="officePhoneNum"
                                id="officePhoneNum"
                                onChange={this.handleChange}
                                placeholder="Office Phone"
                                // onInput={this.onPaste}
                                onKeyPress={(event) =>
                                  this.handleNumericCheck(event)
                                }
                              />
                            </div>
                            <div class="invalid-feedback">
                              {
                                this.state.validationModel
                                  .officePhoneNumValField
                              }
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="">Extension</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Extension"
                                required=""
                                value={this.state.practiceModel.phoneNumExt}
                                maxLength="4"
                                name="phoneNumExt"
                                id="phoneNumExt"
                                onChange={this.handleChange}
                                onKeyPress={(event) =>
                                  this.handleNumericCheck(event)
                                }
                                onInput={this.onPaste}
                              />
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="">Cell #</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <NumberFormat
                              class="provider-form w-100 form-control-user"
                                format="00 (###) ###-####"
                                mask="_"
                                type="text"
                                name="cellNumber"
                                id="cellNumber"
                                max="10"
                                placeholder="Cell #"
                                value={this.state.practiceModel.cellNumber}
                                onChange={this.handleChange}
                                onKeyPress={(event) =>
                                  this.handleNumericCheck(event)
                                }
                              />
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="">Contact Person Name</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Contact Person Name"
                                required=""
                                value={
                                  this.state.practiceModel.contactPersonName
                                }
                                name="contactPersonName"
                                id="contactPersonName"
                                maxLength="60"
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="">Website</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Website"
                                required=""
                                value={this.state.practiceModel.website}
                                name="website"
                                id="website"
                                maxLength="50"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.websiteValField}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div class="clearfix"></div><br></br> */}

                    {/* Pay to address */}

                    <div class="row">
                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Pay to Address</h6>
                          <div class="float-lg-right text-right">
                            <input
                              class="checkbox"
                              type="checkbox"
                              id="sameAsAddress"
                              name="sameAsAddress"
                              checked={this.state.isChecked}
                              onChange={this.handleSameAsAddress}
                            />
                            Same as Address
                            {/* <a href="">Same as Address</a> */}
                          </div>

                          <hr
                            class="p-0 mt-0 mb-1"
                            style={{ backgroundColor: "#037592" }}
                          ></hr>

                          <div class="clearfix"></div>
                          <br></br>

                          <div class="row">
                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="">
                                  Address 1
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Address 1"
                                  required=""
                                  value={this.state.practiceModel.payToAddress1}
                                  name="payToAddress1"
                                  id="payToAddress1"
                                  maxLength="55"
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label >Address 2</label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Address 2"
                                  required=""
                                  value={this.state.practiceModel.payToAddress2}
                                  name="payToAddress2"
                                  id="payToAddress2"
                                  maxLength="55"
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>

                            <div class="col-md-4 mb-2"></div>
                          </div>

                          <div class="row">
                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="">
                                  City
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="City"
                                  required=""
                                  value={this.state.practiceModel.payToCity}
                                  name="payToCity"
                                  id="payToCity"
                                  maxLength="20"
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="">
                                  State
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <select
                                  style={{
                                    borderRadius: "6px",
                                    border: "1px solid rgb(125, 128, 134)",
                                    boxSizing: "border-box",
                                    display: "block",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    height: "30px",
                                    lineHeight: "auto",
                                    outline: "none",
                                    position: "relative",
                                    width: "100%",
                                    paddingLeft: "2px",
                                    paddingBottom: "6px",
                                    paddingTop: "6px",
                                    color: "rgb(67, 75, 93",
                                  }}
                                  name="payToState"
                                  id="payToState"
                                  value={this.state.practiceModel.payToState}
                                  onChange={this.handleChange}
                                >
                                  {usStates.map((s) => (
                                    <option key={s.value} value={s.value}>
                                      {s.display}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="">
                                  Zip Code
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Zip Code"
                                  required=""
                                  value={this.state.practiceModel.payToZipCode}
                                  maxLength="9"
                                  name="payToZipCode"
                                  id="payToZipCode"
                                  onChange={this.handleZip}
                                  onKeyPress={(event) =>
                                    this.handleNumericCheck(event)
                                  }
                                />
                              </div>
                              <div class="invalid-feedback">
                                {
                                  this.state.validationModel
                                    .payToZipCodeValField
                                }
                              </div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-md-11 mb-11">
                              <div class="col-md-1 float-left">
                                <label for="">Notes:</label>
                              </div>
                              <div class="col-md-11 pl-5 float-left">
                                <textarea
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Notes"
                                  required=""
                                  value={this.state.practiceModel.notes}
                                  name="notes"
                                  id="notes"
                                  onChange={this.handleChange}
                                ></textarea>
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Statement Options */}

                    <div class="row">
                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Statement Options</h6>

                          <hr
                            class="p-0 mt-0 mb-1"
                            style={{ backgroundColor: "#037592" }}
                          ></hr>

                          <div class="clearfix"></div>
                          <br></br>

                          <div class="row">
                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="">
                                  Vendor
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <select
                                  style={{
                                    borderRadius: "6px",
                                    border: "1px solid rgb(125, 128, 134)",
                                    boxSizing: "border-box",
                                    display: "block",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    height: "30px",
                                    lineHeight: "auto",
                                    outline: "none",
                                    position: "relative",
                                    width: "100%",
                                    paddingLeft: "2px",
                                    paddingBottom: "6px",
                                    paddingTop: "6px",
                                    color: "rgb(67, 75, 93",
                                  }}
                                  name="statementExportType"
                                  id="statementExportType"
                                  value={
                                    this.state.practiceModel.statementExportType
                                  }
                                  onChange={this.handleChange}
                                >
                                  {statementExportType.map((s) => (
                                    <option key={s.value} value={s.value}>
                                      {s.display}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="">
                                  Aging Days
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Aging Days"
                                  required=""
                                  value={
                                    this.state.practiceModel.statementAgingDays
                                  }
                                  name="statementAgingDays"
                                  id="statementAgingDays"
                                  onChange={this.handleChange}
                                  onKeyPress={(event) =>
                                    this.handleNumericCheck(event)
                                  }
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label >
                                  Maximum Statement
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Maximum Statement"
                                  required=""
                                  value={
                                    this.state.practiceModel.statementMaxCount
                                  }
                                  name="statementMaxCount"
                                  id="statementMaxCount"
                                  // max="55"
                                  onChange={this.handleChange}
                                  onKeyPress={(event) =>
                                    this.handleNumericCheck(event)
                                  }
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="">
                                  Phone #
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <NumberFormat
                                   class="provider-form w-100 form-control-user"
                                  format="00 (###) ###-####"
                                  mask="_"
                                  type="text"
                                  name="statementPhoneNumber"
                                  id="statementPhoneNumber"
                                  max="10"
                                  placeholder="Phone # "
                                  value={
                                    this.state.practiceModel
                                      .statementPhoneNumber
                                  }
                                  onChange={this.handleChange}
                                  onKeyPress={(event) =>
                                    this.handleNumericCheck(event)
                                  }
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="">
                                  Fax #
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Fax #"
                                  required=""
                                  value={
                                    this.state.practiceModel.statementFaxNumber
                                  }
                                  name="statementFaxNumber"
                                  id="statementFaxNumber"
                                  max="10"
                                  onChange={this.handleChange}
                                  onKeyPress={(event) =>
                                    this.handleNumericCheck(event)
                                  }
                                />
                              </div>
                              <div class="invalid-feedback">
                                {/* {this.state.validationModel.payToZipCodeValField} */}
                              </div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="">
                                  Appointment Phone #{" "}
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <NumberFormat
                                  class="provider-form w-100 form-control-user"
                                  format="00 (###) ###-####"
                                  mask="_"
                                  type="text"
                                  name="appointmentPhoneNumber"
                                  id="appointmentPhoneNumber"
                                  max="10"
                                  placeholder="Appointment Phone #"
                                  value={
                                    this.state.practiceModel
                                      .appointmentPhoneNumber
                                  }
                                  onChange={this.handleChange}
                                  onKeyPress={(event) =>
                                    this.handleNumericCheck(event)
                                  }
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-md-11 mb-11">
                              <div class="col-md-1 float-left">
                                <label for="">Message:</label>
                              </div>
                              <div class="col-md-11 pl-5 float-left">
                                <textarea
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Message"
                                  required=""
                                  value={
                                    this.state.practiceModel.statementMessage
                                  }
                                  name="statementMessage"
                                  id="statementMessage"
                                  onChange={this.handleChange}
                                ></textarea>
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Invoice Details */}

                    {invoiceInfo}

                    {/* Others */}
                    <div class="row">
                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Others</h6>

                          <hr
                            class="p-0 mt-0 mb-1"
                            style={{ backgroundColor: "#037592" }}
                          ></hr>

                          <div class="clearfix"></div>
                          <br></br>

                          <div class="row">
                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="">
                                  Client Category{" "}
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <select
                                  style={{
                                    borderRadius: "6px",
                                    border: "1px solid rgb(125, 128, 134)",
                                    boxSizing: "border-box",
                                    display: "block",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    height: "30px",
                                    lineHeight: "auto",
                                    outline: "none",
                                    position: "relative",
                                    width: "100%",
                                    paddingLeft: "2px",
                                    paddingBottom: "6px",
                                    paddingTop: "6px",
                                    color: "rgb(67, 75, 93",
                                  }}
                                  name="clientCategory"
                                  id="clientCategory"
                                  value={
                                    this.state.practiceModel.clientCategory
                                  }
                                  onChange={this.handleChange}
                                >
                                  {clientCategory.map((s) => (
                                    <option key={s.value} value={s.value}>
                                      {s.display}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="">
                                  Referred By
                                  {/* <span class="text-danger">*</span> */}
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="Referred By"
                                  required=""
                                  value={this.state.practiceModel.refferedBy}
                                  name="refferedBy"
                                  id="refferedBy"
                                  max="50"
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>

                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label for="">
                                  PM Software Name
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="PM Software Name"
                                  required=""
                                  value={
                                    this.state.practiceModel.pmSoftwareName
                                  }
                                  name="pmSoftwareName"
                                  id="pmSoftwareName"
                                  max="50"
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-md-4 mb-2">
                              <div class="col-md-4 float-left">
                                <label >
                                  EHR Software Name
                                </label>
                              </div>
                              <div class="col-md-8 float-left">
                                <input
                                  type="text"
                                  class="provider-form w-100 form-control-user"
                                  placeholder="EHR Software Name"
                                  required=""
                                  value={
                                    this.state.practiceModel.ehrSoftwareName
                                  }
                                  name="ehrSoftwareName"
                                  id="ehrSoftwareName"
                                  max="50"
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div class="invalid-feedback"></div>
                            </div>

                            <div class="col-md-4 mb-2"></div>
                            <div class="col-md-4 mb-2"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <Hotkeys
                        keyName="alt+s"
                        onKeyDown={this.onKeyDown.bind(this)}
                        onKeyUp={this.onKeyUp.bind(this)}
                      >
                        <button
                          class="btn btn-primary mr-2"
                          type="submit"
                          onClick={this.savePractice}
                          disabled={this.isDisabled(
                            this.state.editId > 0
                              ? this.props.rights.update
                              : this.props.rights.add
                          )}
                        >
                          Save
                        </button>
                      </Hotkeys>

                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={
                          this.props.onClose
                            ? () => this.props.onClose()
                            : () => this.props.onClose()
                        }
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Grid Tabs */}
                    <br></br>

                    <ul
                      className="tabs"
                      role="tablist"
                      style={{ borderBottom: "1px solid #d8526b" , paddingLeft:"0px" }}
                    >
                      <li>
                        <input
                          type="radio"
                          name="tabs"
                          id="tab1"
                          checked={this.state.checkedTab == 1 ? true : false}
                          onClick={() => this.handleTabCheck(1)}
                        />
                        <label
                          for="tab1"
                          role="tab"
                          aria-selected="false"
                          aria-controls="panel1"
                          tabindex="1"
                        >
                          Location
                        </label>

                        <div
                          style={{  marginBottom: "20px" }}
                          id="tab-content1"
                          class="tab-content"
                          role="tabpanel"
                          aria-labelledby="specification"
                          aria-hidden="true"
                        >
                          <br></br>

                          <div class="card mb-4">
                            <div class="card-body">
                              <div class="table-responsive">
                                <div
                                  id="dataTable_wrapper"
                                  class="dataTables_wrapper dt-bootstrap4"
                                >
                                  <MDBDataTable
                                    responsive={true}
                                    striped
                                    searching={false}
                                    data={locationData}
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
                      </li>

                      <li>
                        <input
                          type="radio"
                          name="tabs"
                          id="tab2"
                          checked={this.state.checkedTab == 2 ? true : false}
                          onClick={() => this.handleTabCheck(2)}
                        />
                        <label
                          for="tab2"
                          role="tab"
                          aria-selected="false"
                          aria-controls="panel2"
                          tabindex="2"
                        >
                          Provider
                        </label>

                        <div
                          style={{ marginLeft: "-63px", marginBottom: "20px" }}
                          id="tab-content2"
                          class="tab-content"
                          role="tabpanel"
                          aria-labelledby="specification"
                          aria-hidden="true"
                        >
                          <br></br>

                          <div class="card mb-4">
                            <div class="card-body">
                              <div class="table-responsive">
                                <div
                                  id="dataTable_wrapper"
                                  class="dataTables_wrapper dt-bootstrap4"
                                >
                                  <MDBDataTable
                                    responsive={true}
                                    striped
                                    searching={false}
                                    data={providerData}
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
                      </li>

                      <li>
                        <input
                          type="radio"
                          name="tabs"
                          id="tab3"
                          checked={this.state.checkedTab == 3 ? true : false}
                          onClick={() => this.handleTabCheck(3)}
                        />
                        <label
                          for="tab3"
                          role="tab"
                          aria-selected="false"
                          aria-controls="panel3"
                          tabindex="3"
                        >
                          Referring Providers
                        </label>

                        <div
                          style={{ marginLeft: "-128px", marginBottom: "20px" }}
                          id="tab-content3"
                          class="tab-content"
                          role="tabpanel"
                          aria-labelledby="specification"
                          aria-hidden="true"
                        >
                          <br></br>

                          <div class="card mb-4">
                            <div class="card-body">
                              <div class="table-responsive">
                                <div
                                  id="dataTable_wrapper"
                                  class="dataTables_wrapper dt-bootstrap4"
                                >
                                  <MDBDataTable
                                    responsive={true}
                                    striped
                                    searching={false}
                                    data={RefProviderData}
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
                      </li>
                    </ul>

                    {/* End of Main Content */}
                  </div>
                </div>

                {/* <a class="scroll-to-top rounded" href="#page-top">
                  {" "}
                  <i class="fas fa-angle-up"></i>{" "}
                </a> */}
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
    // id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo1: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    clients: state.loginInfo
      ? state.loginInfo.clients
        ? state.loginInfo.clients
        : []
      : [],
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.practiceSearch,
          add: state.loginInfo.rights.practiceCreate,
          update: state.loginInfo.rights.practiceEdit,
          delete: state.loginInfo.rights.practiceDelete,
          export: state.loginInfo.rights.practiceExport,
          import: state.loginInfo.rights.practiceImport,
        }
      : [],
    taxonomyCode:
      state.loginInfo.taxonomy == null ? [] : state.loginInfo.taxonomy,
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectTabPageAction: selectTabPageAction,
      loginAction: loginAction,
      selectTabAction: selectTabAction,
      taxonomyCodeAction: taxonomyCodeAction,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(NewPractice);
