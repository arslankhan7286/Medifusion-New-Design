import React, { Component, Fragment } from "react";
import $ from "jquery";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import taxonomyIcon from "../images/code-search-icon.png";

import axios from "axios";
import Input from "./Input";

import { MDBDataTable, MDBBtn } from "mdbreact";

import { Tabs, Tab } from "react-tab-view";

import Swal from "sweetalert2";
import Dropdown from "react-dropdown";
import settingIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";
import NewInsurancePlanAddress from "./NewInsurancePlanAddress";
import Select, { components } from "react-select";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import NewEDISubmit from "./NewEDISubmit";
import NewEDIEligibility from "./NewEDIEligibility";

import NewEDIStatus from "./NewEDIStatus";

import plusSrc from "../images/plus-icon.png";

export class NewInsurancePlan extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/InsurancePlan/";
    this.newurl = process.env.REACT_APP_URL + "/InsurancePlanAddress/";
    this.ediURL = process.env.REACT_APP_URL + "/Edi837Payer/";
    this.commonUrl = process.env.REACT_APP_URL + "/Common/";
    this.InsurancOptionurl =
      process.env.REACT_APP_URL + "/InsuranceBillingOption/";
    this.errorField = "errorField";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };
    this.InsurnacePlanCount = 0;

    this.insurancePlanModel = {
      id: 0,
      planName: "",
      description: "",
      insuranceID: "",
      planTypeID: "",
      isCapitated: false,
      submissionType: "",
      outstandingDays: "30",
      payerID: "",
      edi837PayerID: null,
      edi270PayerID: null,
      edi276PayerID: null,
      formType: "",
      isActive: true,
      isDeleted: false,
      notes: null,

      address1: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      faxNumber: "",
      insuranceBillingoption: []
    };

    this.validationModel = {
      planNameValField: null,
      descriptionValField: null,
      insuranceIDValField: "",
      planTypeIDValField: "",
      isCapitatedValField: false,
      submissionTypeValField: null,
      payerIDValField: null,
      edi837PayerIDValField: 0,
      edi270PayerIDValField: 0,
      edi276PayerIDValField: 0,
      formTypeValField: null,
      isActiveValField: true
    };

    this.insuranceBillingoption = {
      // id:"",
      providerID: "",
      provider: "",
      locationID: "",
      location: "",
      insurancePlanID: "",
      reportTaxID: false,
      payToAddress: "None"
    };
    this.searchModel = {
      payerID: "",
      payerName: ""
    };

    this.state = {
      searchModel: this.searchModel,
      editId: this.props.id,
      insurancePlanModel: this.insurancePlanModel,
      validationModel: this.validationModel,
      maxHeight: "361",
      checkedTab: 1,
      insuranceData: [],
      planData: [],
      payer837: [],
      payer276: [],
      payer270: [],
      payer1: "",
      payer2: "",
      payer3: "",
      payer4: "",
      payer5: "",
      payer6: "",
      loading: false,
      showInsuranceAdressPopup: false,
      edi837PayerID: {},
      edi270PayerID: {},
      edi276PayerID: {},
      userLocations: []
    };

    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.saveInsurancePlan = this.saveInsurancePlan.bind(this);
    //  this.handleSameAsAddress = this.handleSameAsAddress.bind(this);
    this.delete = this.delete.bind(this);
    this.openInsuranceAdressPlanPopup = this.openInsuranceAdressPlanPopup.bind(
      this
    );

    this.closeInsuranceAdressPlanPopup = this.closeInsuranceAdressPlanPopup.bind(
      this
    );
    this.openEligibilityPopup = this.openEligibilityPopup.bind(this);
    this.closeEligibilityPopup = this.closeEligibilityPopup.bind(this);
    this.openStatusPopup = this.openStatusPopup.bind(this);
    this.closeStatusPopup = this.closeStatusPopup.bind(this);
    this.addPlanRow = this.addPlanRow.bind(this);
  }

  openEligibilityPopup = id => {
    this.setState({ showEPopup: true, id: id });
  };

  closeEligibilityPopup() {
    $("#myEModal").hide();
    this.setState({ showEPopup: false });
    try {
      axios
        .get(this.url + "GetProfiles", this.config)
        .then(response => {
          this.setState({
            insuranceData: response.data.insurance,
            planData: response.data.planType,
            payer837: response.data.x12_837_Payer,
            payer276: response.data.x12_276_Payer,
            payer270: response.data.x12_270_Payer
          });
        })
        .catch(error => {
          console.log(error);
        });
    } catch { }
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

  closeSubmitPopup = () => {
    $("#myEDIModal").hide();
    this.setState({ showsubmitPopup: false });

    try {
      axios
        .get(this.url + "GetProfiles", this.config)
        .then(response => {
          this.setState({
            insuranceData: response.data.insurance,
            planData: response.data.planType,
            payer837: response.data.x12_837_Payer,
            payer276: response.data.x12_276_Payer,
            payer270: response.data.x12_270_Payer
          });
        })
        .catch(error => {
          console.log(error);
        });
    } catch { }
  };
  openSubmitPopup = id => {
    this.setState({ showsubmitPopup: true, id: id });
  };

  closeStatusPopup() {
    $("#mySModal").hide();
    this.setState({ showSPopup: false });
    try {
      axios
        .get(this.url + "GetProfiles", this.config)
        .then(response => {
          this.setState({
            insuranceData: response.data.insurance,
            planData: response.data.planType,
            payer837: response.data.x12_837_Payer,
            payer276: response.data.x12_276_Payer,
            payer270: response.data.x12_270_Payer
          });
        })
        .catch(error => {
          console.log(error);
        });
    } catch { }
  }
  openStatusPopup = id => {
    this.setState({ showSPopup: true, id: id });
  };

  async componentDidMount() {
    this.setState({ loading: true });

    this.setModalMaxHeight($(".modal"));
    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function () {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);

    await axios
      .get(this.url + "GetProfiles", this.config)
      .then(response => {
        console.log("Get Profiles Responnse :", response.data);
        this.setState({
          insuranceData: response.data.insurance,
          planData: response.data.planType,
          payer837: response.data.x12_837_Payer,
          payer276: response.data.x12_276_Payer,
          payer270: response.data.x12_270_Payer
        });
      })
      .catch(error => {
        console.log(error);
      });

    try {
      await axios
        .get(this.commonUrl + "GetLocations", this.config)
        .then(response => {
          console.log("Locations : ", response.data);
          this.setState({ userLocations: response.data });
        })
        .catch(error => {
          console.log(JSON.stringify(error));
        });
    } catch {
      console.log("Location API");
    }

    if (this.state.editId > 0) {
      await axios
        .get(this.url + "FindInsurancePlan/" + this.state.editId, this.config)
        .then(response => {
          console.log("ss", response.data);
          var insurancePlanModel = response.data;
          if (insurancePlanModel.insuranceBillingoption == null) {
            insurancePlanModel.insuranceBillingoption = [];
            console.log("provider Model", insurancePlanModel);
          }

          this.setState({ insurancePlanModel: insurancePlanModel });

          var submissionPayer = this.state.payer837.filter(
            submissionPayer => submissionPayer.id == response.data.edi837PayerID
          );
          var eligibilityPayer = this.state.payer276.filter(
            eligibilityPayer =>
              eligibilityPayer.id == response.data.edi276PayerID
          );
          var statusPayer = this.state.payer270.filter(
            statusPayer => statusPayer.id == response.data.edi270PayerID
          );
          this.setState({
            insurancePlanModel: response.data,
            payer1:
              (submissionPayer.length > 0 && submissionPayer[0].id != null) ==
                true
                ? submissionPayer[0].value
                : "",
            payer2:
              submissionPayer.length > 0 && submissionPayer[0].id != null
                ? submissionPayer[0].description
                : "",
            payer3:
              eligibilityPayer.length > 0 && eligibilityPayer[0].id != null
                ? eligibilityPayer[0].value
                : "",
            payer4:
              eligibilityPayer.length > 0 && eligibilityPayer[0].id != null
                ? eligibilityPayer[0].description
                : "",
            payer5:
              statusPayer.length > 0 && statusPayer[0].id != null
                ? statusPayer[0].value
                : "",
            payer6:
              statusPayer.length > 0 && statusPayer[0].id != null
                ? statusPayer[0].description
                : ""
          });
        })
        .catch(error => {
          this.setState({ loading: false });

          console.log(error);
        });

      console.log("edit id", this.state.editId);
      await axios
        // .get(this.newurl + "GetInsurancePlanAddressesByInsuranceID/" + this.state.editId, this.config)
        .get(
          this.newurl +
          "GetInsurancePlanAddressesByInsurancePlanID/" +
          this.state.editId,
          this.config
        )
        .then(response => {

          let newList = [];
          response.data.map((row, i) => {
            if (row.id > 0) {
              newList.push({
                address1: (
                  <a
                    href=""
                    onClick={(event) => this.openInsuranceAdressPlanPopup(event, row.id)}
                  >
                    {row.address1}
                  </a>
                ),
                city: row.city,
                state: row.state,
                zipCode: row.zipCode,
                phoneNumber: row.phoneNumber,
                faxNumber: row.faxNumber
              });
            }
          });

          this.setState({ insuranceRecord: newList, loading: false });
          console.log("the data from the api ", this.state.insuranceRecord);
        })
        .catch(error => {
          console.log(error);
        });

      this.setState({
        edi837PayerID: this.state.payer837.filter(
          option => option.id == this.state.insurancePlanModel.edi837PayerID
        )
      });

      this.setState({
        edi270PayerID: this.state.payer270.filter(
          option => option.id == this.state.insurancePlanModel.edi270PayerID
        )
      });

      this.setState({
        edi276PayerID: this.state.payer276.filter(
          option => option.id == this.state.insurancePlanModel.edi276PayerID
        )
      });
    }

    this.setState({ loading: false });
  }

  openInsuranceAdressPlanPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showInsuranceAdressPopup: true, id: id });
  };

  closeInsuranceAdressPlanPopup = () => {
    $("#myModal1").hide();
    this.setState({ showInsuranceAdressPopup: false });
  };

  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  handleChange = event => {
    console.log("Event", event.target.value, event.target.name);
    event.preventDefault();
    var index = event.target.value;

    // if (event.target.name === "edi837PayerID") {
    //   this.state.payer837.map((roww, i) => {
    //     if (roww.id == event.target.value) {
    //       // QA ERROR SLOVE
    //       index = i;
    //       this.setState({
    //         payer1: this.state.payer837[index].description2.toUpperCase(),
    //         payer2: this.state.payer837[index].description3.toUpperCase()
    //       });
    //     }
    //     return;
    //   });
    // } else if (event.target.name === "edi270PayerID") {
    //   this.state.payer270.map((roww, i) => {
    //     if (roww.id == event.target.value) {
    //       // QA ERROR SLOVE

    //       index = i;
    //       this.setState({
    //         payer3: this.state.payer270[index].description2.toUpperCase(),
    //         payer4: this.state.payer270[index].description3.toUpperCase()
    //       });
    //     }
    //     return;
    //   });
    // } else if (event.target.name === "edi276PayerID") {
    //   this.state.payer276.map((roww, i) => {
    //     if (roww.id == event.target.value) {
    //       // QA ERROR SLOVE

    //       index = i;
    //       this.setState({
    //         payer5: this.state.payer276[index].description2.toUpperCase(),
    //         payer6: this.state.payer276[index].description3.toUpperCase()
    //       });
    //     }
    //     return;
    //   });
    // }
    // console.log("Index", event.target.name);

    this.setState({
      insurancePlanModel: {
        ...this.state.insurancePlanModel,
        [event.target.name]:
          event.target.value === "Please Select"
            ? null
            : event.target.value.toUpperCase()
      }
    });

    console.log(this.state);
  };

  foucsOut = event => {
    console.log(event);
    event.preventDefault();

    this.setState({
      insurancePlanModel: {
        ...this.state.insurancePlanModel,
        [event.target.name]: event.target.value
      }
    });
  };

  handleCheck() {
    this.setState({
      insurancePlanModel: {
        ...this.state.insurancePlanModel,
        isActive: !this.state.insurancePlanModel.isActive
      }
    });
  }

  handleCheckBox() {
    this.setState({
      insurancePlanModel: {
        ...this.state.insurancePlanModel,
        isCapitated: !this.state.insurancePlanModel.isCapitated
      }
    });
  }

  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  delete = e => {
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        this.setState({ loading: true });
        axios
          .delete(
            this.url + "DeleteInsurancePlan/" + this.state.editId,
            this.config
          )
          .then(response => {
            this.setState({ loading: false });

            console.log("Delete Response :", response);
            Swal.fire("Record Deleted Successfully", "", "success");
          })
          .catch(error => {
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
          });

        $("#btnCancel").click();
      }
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

  saveInsurancePlan = e => {
    if (this.InsurnacePlanCount == 1) {
      return;
    }
    this.InsurnacePlanCount = 1;
    console.log(this.state.insurancePlanModel);

    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.state.insurancePlanModel.planName === "") {
      myVal.planNameValField = (
        <span className="validationMsg">Enter Plan Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.planNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.state.insurancePlanModel.description === "") {
      myVal.descriptionValField = (
        <span className="validationMsg">Enter Description</span>
      );
      myVal.validation = true;
    } else {
      myVal.descriptionValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.insurancePlanModel.insuranceID)) {
      myVal.insuranceIDValField = (
        <span className="validationMsg">Select Insurance</span>
      );
      myVal.validation = true;
    } else {
      myVal.insuranceIDValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.insurancePlanModel.planTypeID)) {
      myVal.planTypeIDValField = (
        <span className="validationMsg">Select Plan Type</span>
      );
      myVal.validation = true;
    } else {
      myVal.planTypeIDValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.state.insurancePlanModel.submissionType === "P") {
      console.log("paperp");
      if (this.isNull(this.state.insurancePlanModel.formType)) {
        myVal.formTypeValField = (
          <span className="validationMsg">Select HCFA Template</span>
        );
        myVal.validation = true;
      } else {
        myVal.formTypeValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    }

    this.setState({
      validationModel: myVal
    });

    if (myVal.validation === true) {
      myVal = {};
      this.setState({ loading: false });
      this.InsurnacePlanCount = 0;

      return;
    }

    axios
      .post(
        this.url + "SaveInsurancePlan",
        this.state.insurancePlanModel,
        this.config
      )
      .then(response => {
        this.InsurnacePlanCount = 0;

        this.setState({
          insurancePlanModel: response.data,
          editId: response.data.id,
          loading: false
        });
        Swal.fire("Record Saved Successfully", "", "success");
      })
      .catch(error => {
        this.InsurnacePlanCount = 0;

        this.setState({ loading: false });

        let errorsList = [];
        if (error.response !== null && error.response.data !== null) {
          errorsList = error.response.data;
          console.log(errorsList);
        } else {
          console.log(error);
          alert("Something went wrong. Plese check console.");
        }
      });

    e.preventDefault();
  };

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  openhistorypopup = id => {
    this.setState({ showPopup: true, id: id });
  };
  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };

  handleEdi837Change(event, ediname) {
    console.log("Event :", event);
    console.log("Edi name", ediname);

    if (event) {
      this.setState({
        edi837PayerID: event,
        insurancePlanModel: {
          ...this.state.insurancePlanModel,
          edi837PayerID: event.id
        }
      });
    } else {
      this.setState({
        edi837PayerID: null,
        insurancePlanModel: {
          ...this.state.insurancePlanModel,
          edi837PayerID: null
        }
      });
    }
    if (event) {
      if (ediname === "edi837PayerID") {
        this.state.payer837.map((roww, i) => {
          if (roww.id == event.id) {
            // QA ERROR SLOVE
            // index = i;
            this.setState({
              payer1: this.state.payer837[i].value.toUpperCase(),
              payer2: this.state.payer837[i].description.toUpperCase()
            });
          }
          return;
        });
      }
    } else {
      if (ediname === "edi837PayerID") {
        // this.state.payer837.map((roww, i) => {
        // if (roww.id == event.id) {
        // QA ERROR SLOVE
        // index = i;
        this.setState({
          payer1: "",
          payer2: ""
          // });
          // }
          // return;
        });
      }
    }
  }

  filterOption = (option, inputValue) => {
    //      console.log("Option : " ,e.target.value);

    //   //  console.log("Input Value : " , inputValue)
    // var value = inputValue + "";
    // //      if (value.length > 2) {

    //   // await this.setState({search:value})
    // //  }
    //   // console.log("Model Before API Call :", this.state.search)

    //   if(value.length> 2){

    //     axios
    //     .post(this.ediURL + "FindEdi837Payers", {payerID : e.target.value, payerName:e.target.value}, this.config)
    //     .then(response => {
    //       console.log("EID RESPONSE :", response.data)
    //       // this.setState({ payer837: response.data, loading: false });
    //       return response.data;
    //     })
    //     .catch(error => {
    //       this.setState({ loading: false });

    //       console.log(error);
    //     });
    //   }

    try {
      var value = inputValue + "";
      if (value.length > 1) {
        const words = inputValue.split(" ");
        return words.reduce(
          (acc, cur) =>
            acc && option.label.toLowerCase().includes(cur.toLowerCase()),
          true
        );
      }
    } catch {
      console.log("Error");
    }
  };

  handleEdi270Change(event, ediname) {
    console.log("Event :", event);
    console.log("Edi name", ediname);

    if (event) {
      this.setState({
        edi270PayerID: event,
        insurancePlanModel: {
          ...this.state.insurancePlanModel,
          edi270PayerID: event.id
        }
      });
    } else {
      this.setState({
        edi270PayerID: null,
        insurancePlanModel: {
          ...this.state.insurancePlanModel,
          edi270PayerID: null
        }
      });
    }
    if (event) {
      if (ediname === "edi270PayerID") {
        this.state.payer270.map((roww, i) => {
          if (roww.id == event.id) {
            // QA ERROR SLOVE
            // index = i;
            this.setState({
              payer3: this.state.payer270[i].value.toUpperCase(),
              payer4: this.state.payer270[i].description.toUpperCase()
            });
          }
          return;
        });
      }
    } else {
      if (ediname === "edi270PayerID") {
        // this.state.payer270.map((roww, i) => {
        // if (roww.id == event.id) {
        // QA ERROR SLOVE
        // index = i;
        this.setState({
          payer3: "",
          payer4: ""
          // });
          // }
          // return;
        });
      }
    }
  }

  handleEdi276Change(event, ediname) {
    console.log("Event :", event);
    console.log("Edi name", ediname);

    if (event) {
      this.setState({
        edi276PayerID: event,
        insurancePlanModel: {
          ...this.state.insurancePlanModel,
          edi276PayerID: event.id
        }
      });
    } else {
      this.setState({
        edi276PayerID: null,
        insurancePlanModel: {
          ...this.state.insurancePlanModel,
          edi276PayerID: null
        }
      });
    }
    if (event) {
      if (ediname === "edi276PayerID") {
        this.state.payer276.map((roww, i) => {
          if (roww.id == event.id) {
            // QA ERROR SLOVE
            // index = i;
            this.setState({
              payer5: this.state.payer276[i].value.toUpperCase(),
              payer6: this.state.payer276[i].description.toUpperCase()
            });
          }
          return;
        });
      }
    } else {
      if (ediname === "edi276PayerID") {
        // this.state.payer270.map((roww, i) => {
        // if (roww.id == event.id) {
        // QA ERROR SLOVE
        // index = i;
        this.setState({
          payer5: "",
          payer6: ""
          // });
          // }
          // return;
        });
      }
    }
  }

  handleplanModelChange = event => {
    console.log("Event :", event.target.value, event.target.name);
    event.preventDefault();

    let NewInsurancePlan = this.state.insurancePlanModel.insuranceBillingoption;

    const index = event.target.id;
    const name = event.target.name;
    NewInsurancePlan[index][name] = event.target.value;

    this.setState({
      insurancePlanModel: {
        ...this.state.insurancePlanModel,
        insuranceBillingoption: NewInsurancePlan
      }
    });
  };
  async addPlanRow(event) {
    event.preventDefault()
    const insuranceBillingoption = { ...this.insuranceBillingoption };
    console.log("model : ", this.state.insurancePlanModel);
    insuranceBillingoption.insurancePlanID = this.state.insurancePlanModel.id;
    await this.setState({
      insurancePlanModel: {
        ...this.state.insurancePlanModel,
        insuranceBillingoption: this.state.insurancePlanModel.insuranceBillingoption.concat(
          insuranceBillingoption
        )
      }
    });
  }

  reportTaxIDcheck(event, id) {
    // console.log("test")
    console.log(this.state.insurancePlanModel.insuranceBillingoption);
    let NewInsurancePlanModel = this.state.insurancePlanModel
      .insuranceBillingoption;

    NewInsurancePlanModel[id].reportTaxID = !NewInsurancePlanModel[id]
      .reportTaxID;

    this.setState({
      insurancePlanModel: {
        ...this.state.insurancePlanModel,
        insuranceBillingoption: NewInsurancePlanModel
      }
    });
  }

  async deleteRow(event, index, RowId) {
    console.log("ID  ", RowId);
    const RowID = RowId;
    const id = event.target.id;
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        if (RowID > 0) {
          axios
            .delete(
              this.InsurancOptionurl + "DeleteInsuranceBillingOption/" + RowID,
              this.config
            )
            .then(response => {
              console.log("Delete Response :", response);
              Swal.fire("Record Deleted Successfully", "", "success");
              let insuranceBillingoption = [
                ...this.state.insurancePlanModel.insuranceBillingoption
              ];
              insuranceBillingoption.splice(id, 1);
              this.setState({
                insurancePlanModel: {
                  ...this.state.insurancePlanModel,
                  insuranceBillingoption: insuranceBillingoption
                }
              });
            })
            .catch(error => {
              if (error.response) {
                if (error.response.status) {
                  if (error.response.status == 400) {
                    Swal.fire("Error", error.response.data, "error");
                  } else {
                    Swal.fire(
                      "Record Not Deleted!",
                      "Record can not be delete, as it is being referenced in other screens.",
                      "error"
                    );
                  }
                }
              } else {
                Swal.fire(
                  "Record Not Deleted!",
                  "Record can not be delete, as it is being referenced in other screens.",
                  "error"
                );
              }
            });
        } else {
          Swal.fire("Record Deleted Successfully", "", "success");
          let insuranceBillingoption = [
            ...this.state.insurancePlanModel.insuranceBillingoption
          ];
          insuranceBillingoption.splice(id, 1);
          this.setState({
            insurancePlanModel: {
              ...this.state.insurancePlanModel,
              insuranceBillingoption: insuranceBillingoption
            }
          });
        }
      }
    });
  }

  handleTabCheck = (tabID) => {
    const checkedTab = this.state.checkedTab != tabID ? tabID : this.state.checkedTab;
    this.setState({ checkedTab: checkedTab });
  }

  render() {

    const headers = ["Addresses", "Insurance Billing Option"];
    // console.log("log of data>>", this.state.insuranceRecord);

    const insuranceRecord = {
      columns: [

        {
          label: "ADDRESS",
          field: "address1",
          sort: "asc",
          width: 150
        },
        {
          label: "CITY",
          field: "city",
          sort: "asc",
          width: 270
        },
        {
          label: "STATE",
          field: "state",
          sort: "asc",
          width: 200
        },
        {
          label: "ZIP",
          field: "zipCode",
          sort: "asc",
          width: 100
        },
        {
          label: "PHONE#",
          field: "phoneNumber",
          sort: "asc",
          width: 150
        },
        {
          label: "FAX#",
          field: "faxNumber",
          sort: "asc",
          width: 100
        }
      ],
      rows: this.state.insuranceRecord
    };

    const submissionType = [
      { value: "", display: "Select Title" },
      { value: "P", display: "Paper" },
      { value: "E", display: "Electronic" }
    ];

    const formType = [
      { value: "", display: "Select Title" },
      { value: "HCFA 1500", display: "HCFA 1500" },
      { value: "PLAIN 1500", display: "Plain 1500" }
    ];

    const payToAddressdrop = [
      { value: "None", display: "None" },
      { value: "Provider", display: "Provider" },
      { value: "Practice", display: "Practice" }
    ];

    const options = [
      { value: "History", label: "History", className: "dropdown" }
    ];

    var Imag;
    Imag = (
      <div>
        <img src={settingIcon} />
      </div>
    );
    var dropdown;
    dropdown = (
      <Dropdown
        className=""
        options={options}
        onChange={this.openhistorypopup}
        //  value={options}
        // placeholder={"Select an option"}
        placeholder={Imag}
      />
    );

    let newList = [];
    var patientPlanData = {};
    var insuranceBillingoption = this.state.insurancePlanModel
      .insuranceBillingoption
      ? this.state.insurancePlanModel.insuranceBillingoption
      : [];
    // this.state.insurancePlanModel.insuranceBillingoption.map((row, index) => {
    insuranceBillingoption.map((row, index) => {
      newList.push({

        location: (
          <div style={{ marginBottom: "10px" }}>
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
                width: "90%",
                paddingLeft: "2px",
                paddingBottom: "6px",
                paddingTop: "6px",
                color: "rgb(67, 75, 93"
              }}
              name="locationID"
              id={index}
              value={
                this.state.insurancePlanModel.insuranceBillingoption[index]
                  .locationID
              }
              onChange={this.handleplanModelChange}
            >
              {this.state.userLocations.map(s => (
                <option key={s.id} value={s.id}>
                  {s.description}
                </option>
              ))}
            </select>
            {
              this.state.insurancePlanModel.insuranceBillingoption[index]
                .locationVal
            }
          </div>
        ),
        provider: (
          <div style={{ marginBottom: "10px" }}>
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
                width: "90%",
                paddingLeft: "2px",
                paddingBottom: "6px",
                paddingTop: "6px",
                color: "rgb(67, 75, 93"
              }}
              name="providerID"
              id={index}
              value={
                this.state.insurancePlanModel.insuranceBillingoption[index]
                  .providerID
              }
              onChange={this.handleplanModelChange}
            >
              {this.props.userProviders.map(s => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        ),
        reportTaxId: (
          <div style={{ marginBottom: "10px" }}
            class="lblChkBox ml-5"
            onClick={event => this.reportTaxIDcheck(event, index)}
          >
            <input
              type="checkbox"
              id={index}
              name="reportTaxID"
              checked={
                this.state.insurancePlanModel.insuranceBillingoption[index]
                  .reportTaxID
              }
            />
            <label for="reportTaxID">
              <span></span>
            </label>
          </div>
        ),
        payToAddress: (
          <div style={{ marginBottom: "10px" }}>
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
                width: "75%",
                paddingLeft: "2px",
                paddingBottom: "6px",
                paddingTop: "6px",
                color: "rgb(67, 75, 93"
              }}
              name="payToAddress"
              id={index}
              value={
                this.state.insurancePlanModel.insuranceBillingoption[index]
                  .payToAddress
              }
              onChange={this.handleplanModelChange}
            >
              {payToAddressdrop.map(s => (
                <option key={s.value} value={s.value}>
                  {s.display}
                </option>
              ))}
            </select>
            {
              this.state.insurancePlanModel.insuranceBillingoption[index]
                .payaddVal
            }
          </div>
        ),
        remove: (
          <div style={{ width: "50px", textAlign: "center", marginBottom: "10px" }}>
            <button
              class="close"
              type="button"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span
                aria-hidden="true"
                onClick={(event, index) => this.deleteRow(event, index, row.id)}
              >
                ×
                          </span>
            </button>

          </div>
        )
      });
    });

    patientPlanData = {
      columns: [

        {
          label: "LOCATION",
          field: "location",
          sort: "asc",
          width: 150
        },
        {
          label: "PROVIDER",
          field: "provider",
          sort: "asc",
          width: 150
        },
        {
          label: "REPORT TAX ID",
          field: "reportTaxId",
          sort: "asc",
          width: 150
        },
        {
          label: "PAY TO ADDRESS",
          field: "payToAddress",
          sort: "asc",
          width: 150
        },
        {
          label: "",
          field: "remove",
          sort: "asc",
          width: 150
        }
      ],
      rows: newList
    };


    const isActive = this.state.insurancePlanModel.isActive;
    const isCapitated = this.state.insurancePlanModel.isCapitated;

    let spiner = "";
    let popup = "";

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

    if (this.state.showPopup) {
      popup = (
        <NewHistoryPractice
          onClose={this.closehistoryPopup}
          historyID={this.state.editId}
          apiURL={this.url}
        // disabled={this.isDisabled(this.props.rights.update)}
        // disabled={this.isDisabled(this.props.rights.add)}
        ></NewHistoryPractice>
      );
    } else if (this.state.showInsuranceAdressPopup) {
      popup = (
        <NewInsurancePlanAddress
          onClose={this.closeInsuranceAdressPlanPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.insurancePlanAddressEdit)}
        ></NewInsurancePlanAddress>
      );
    } else if (this.state.showsubmitPopup) {
      popup = (
        <NewEDISubmit
          onClose={this.closeSubmitPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewEDISubmit>
      );
    } else if (this.state.showEPopup) {
      popup = (
        <NewEDIEligibility
          onClose={this.closeEligibilityPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewEDIEligibility>
      );
    } else if (this.state.showSPopup) {
      popup = (
        <NewEDIStatus
          onClose={this.closeStatusPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewEDIStatus>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
    }

    return (
      <React.Fragment>
        <div
          class="modal fade show popupBackScreen"
          id="insurancePlanModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            class="modal-dialog"
            role="document"
          >
            <div class="modal-content">

              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>
                        {this.state.editId > 0
                          ? this.state.insurancePlanModel.planName.toUpperCase() +
                          " - " +
                          this.state.insurancePlanModel.id
                          : "NEW INSURANCE PLAN "}
                      </h3>

                      <div class="float-lg-right text-right">
                        <input class="checkbox" type="checkbox" onClick={this.handleCheck} />
                        Mark Inactive
                         <button
                          class=" btn btn-primary mr-2"
                          type="submit"
                          onClick={this.delete}
                          disabled={this.isDisabled(this.props.rights.delete)}
                        >
                          Delete
                        </button>
                        {/* {this.state.editId > 0 ?
                          (<img src={settingIcon} alt="" style={{ width: "17px" }} />) : null} */}
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
                          <label for="name">
                            Plan Name<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Plan Name"
                            value={this.state.insurancePlanModel.planName}
                            name="planName"
                            id="planName"
                            maxLength="100"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.planNameValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Description
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Description"
                            value={this.state.insurancePlanModel.description}
                            name="description"
                            id="description"
                            maxLength="100"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.descriptionValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Insurance
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
                              color: "rgb(67, 75, 93"
                            }}
                            name="insuranceID"
                            id="insuranceID"
                            value={this.state.insurancePlanModel.insuranceID}
                            onChange={this.handleChange}
                          >
                            {this.state.insuranceData.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.insuranceIDValField}
                        </div>
                      </div>

                    </div>


                    <div class="row">

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Plan Type
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
                              color: "rgb(67, 75, 93"
                            }}
                            name="planTypeID"
                            id="planTypeID"
                            value={this.state.insurancePlanModel.planTypeID}
                            onChange={this.handleChange}
                          >
                            {this.state.planData.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.planTypeIDValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Submission Type
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
                              color: "rgb(67, 75, 93"
                            }}
                            name="submissionType"
                            id="submissionType"
                            value={this.state.insurancePlanModel.submissionType}
                            onChange={this.handleChange}
                          >
                            {submissionType.map(s => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.insuranceIDValField} */}
                        </div>
                      </div>
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Outstanding Days
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Outstanding Days"
                            value={this.state.insurancePlanModel.outstandingDays}
                            name="outstandingDays"
                            id="outstandingDays"
                            maxLength="2"
                            onChange={this.handleChange}
                            onKeyPress={event => this.handleNumericCheck(event)}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.planNameValField} */}
                        </div>
                      </div>

                    </div>

                    <div className="row">
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Is capitated
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <div
                            className="lblChkBox"
                            onClick={this.handleCheckBox}
                          >
                            <input
                              type="checkbox"
                              checked={isCapitated}
                              id="isCapitated"
                              name="isCapitated"
                            />
                            <label htmlFor="markInCapitated">
                              <span></span>
                            </label>
                          </div>
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.planNameValField} */}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2"></div>
                      <div class="col-md-4 mb-2"></div>
                    </div>

                    {/* Electronic Insurances */}
                    <br></br>
                    <div class="row">
                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Address Information</h6>
                          <hr class="p-0 mt-0 mb-1" style={{ backgroundColor: "#037592" }}></hr>
                          <div class="clearfix"></div>
                        </div><br></br>

                        {/* EDI Submit Payer */}
                        <div className="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                EDI Submission Payer
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <div className="row">
                                <Select

                                  type="text"
                                  value={this.state.edi837PayerID}
                                  name="edi837PayerID"
                                  id="edi837PayerID"
                                  max="10"
                                  onChange={event =>
                                    this.handleEdi837Change(event, "edi837PayerID")
                                  }
                                  options={this.state.payer837}
                                  filterOption={this.filterOption}
                                  placeholder=""
                                  isClearable={true}
                                  isSearchable={true}
                                  openMenuOnClick={false}
                                  escapeClearsValue={true}
                                  styles={{
                                    indicatorSeparator: () => { },
                                    clearIndicator: defaultStyles => ({
                                      ...defaultStyles,
                                      color: "#286881"
                                    }),
                                    container: defaultProps => ({
                                      ...defaultProps,
                                      position: "absolute",
                                      width: "80%"
                                    }),
                                    indicatorsContainer: defaultStyles => ({
                                      ...defaultStyles,
                                      padding: "0px",
                                      marginBottom: "0",
                                      marginTop: "0px",
                                      height: "36px",
                                      borderBottomRightRadius: "10px",
                                      borderTopRightRadius: "10px"
                                    }),
                                    indicatorContainer: defaultStyles => ({
                                      ...defaultStyles,
                                      padding: "9px",
                                      marginBottom: "0",
                                      marginTop: "1px",
                                      borderRadius: "0 4px 4px 0"
                                    }),
                                    dropdownIndicator: () => ({
                                      display: "none"
                                    }),
                                    input: defaultStyles => ({
                                      ...defaultStyles,
                                      margin: "0px",
                                      padding: "0px"
                                    }),
                                    singleValue: defaultStyles => ({
                                      ...defaultStyles,
                                      fontSize: "16px",
                                      transition: "opacity 300ms"
                                    }),
                                    control: defaultStyles => ({
                                      ...defaultStyles,
                                      minHeight: "33px",
                                      height: "33px",
                                      height: "33px",
                                      paddingLeft: "10px",
                                      borderColor: "#C6C6C6",
                                      boxShadow: "none",
                                      borderColor: "#C6C6C6",
                                      "&:hover": {
                                        borderColor: "#C6C6C6"
                                      }
                                    })
                                  }}
                                />

                                <img
                                  style={{ marginLeft: "82%", width: "32px" }}
                                  src={plusSrc}
                                  onClick={() => this.openSubmitPopup(0)}
                                  disabled={this.isDisabled(this.props.rights.add)}
                                />
                              </div>
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.planNameValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Payer ID
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Payer ID"
                                value={this.state.payer1}
                                disabled="true"
                                name="payer1"
                                id="payer1"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.planNameValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Receiver
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Receiver"
                                value={this.state.payer2}
                                disabled="true"
                                name="payer2"
                                id="payer2"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.planNameValField} */}
                            </div>
                          </div>
                        </div>

                        {/* Eligibility Payer */}

                        <div className="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                EDI Eligibility Payer
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <div className="row">
                                <Select

                                  type="text"
                                  value={this.state.edi270PayerID}
                                  name="edi270PayerID"
                                  id="edi270PayerID"
                                  max="10"
                                  onChange={event =>
                                    this.handleEdi270Change(event, "edi270PayerID")
                                  }
                                  options={this.state.payer270}
                                  // onKeyDown={(e)=>this.filterOption(e)}
                                  filterOption={this.filterOption}
                                  placeholder=""
                                  isClearable={true}
                                  isSearchable={true}
                                  // menuPosition="static"
                                  openMenuOnClick={false}
                                  escapeClearsValue={true}
                                  styles={{
                                    indicatorSeparator: () => { },
                                    clearIndicator: defaultStyles => ({
                                      ...defaultStyles,
                                      color: "#286881"
                                    }),
                                    container: defaultProps => ({
                                      ...defaultProps,
                                      position: "absolute",
                                      width: "80%"
                                    }),
                                    indicatorsContainer: defaultStyles => ({
                                      ...defaultStyles,
                                      padding: "0px",
                                      marginBottom: "0",
                                      marginTop: "0px",
                                      height: "36px",
                                      borderBottomRightRadius: "10px",
                                      borderTopRightRadius: "10px"
                                    }),
                                    indicatorContainer: defaultStyles => ({
                                      ...defaultStyles,
                                      padding: "9px",
                                      marginBottom: "0",
                                      marginTop: "1px",
                                      borderRadius: "0 4px 4px 0"
                                    }),
                                    dropdownIndicator: () => ({
                                      display: "none"
                                    }),
                                    input: defaultStyles => ({
                                      ...defaultStyles,
                                      margin: "0px",
                                      padding: "0px"
                                    }),
                                    singleValue: defaultStyles => ({
                                      ...defaultStyles,
                                      fontSize: "16px",
                                      transition: "opacity 300ms"
                                    }),
                                    control: defaultStyles => ({
                                      ...defaultStyles,
                                      minHeight: "33px",
                                      height: "33px",
                                      height: "33px",
                                      paddingLeft: "10px",
                                      borderColor: "#C6C6C6",
                                      boxShadow: "none",
                                      borderColor: "#C6C6C6",
                                      "&:hover": {
                                        borderColor: "#C6C6C6"
                                      }
                                    })
                                  }}
                                />

                                <img
                                  style={{ marginLeft: "82%", width: "32px" }}
                                  src={plusSrc}
                                  onClick={() => this.openEligibilityPopup(0)}
                                  disabled={this.isDisabled(this.props.rights.add)}
                                />
                              </div>
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.planNameValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Payer ID
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Payer ID"
                                value={this.state.payer3}
                                disabled="true"
                                name="payer3"
                                id="payer3"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.planNameValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Receiver
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Receiver"
                                value={this.state.payer4}
                                disabled="true"
                                name="payer4"
                                id="payer4"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.planNameValField} */}
                            </div>
                          </div>
                        </div>


                        {/* Status Payer */}

                        <div className="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                EDI Status Payer
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <div className="row">
                                <Select

                                  type="text"
                                  value={this.state.edi276PayerID}
                                  name="edi276PayerID"
                                  id="edi276PayerID"
                                  max="10"
                                  onChange={event =>
                                    this.handleEdi276Change(event, "edi276PayerID")
                                  }
                                  options={this.state.payer276}
                                  // onKeyDown={(e)=>this.filterOption(e)}
                                  filterOption={this.filterOption}
                                  placeholder=""
                                  isClearable={true}
                                  isSearchable={true}
                                  // menuPosition="static"
                                  openMenuOnClick={false}
                                  escapeClearsValue={true}
                                  styles={{
                                    indicatorSeparator: () => { },
                                    clearIndicator: defaultStyles => ({
                                      ...defaultStyles,
                                      color: "#286881"
                                    }),
                                    container: defaultProps => ({
                                      ...defaultProps,
                                      position: "absolute",
                                      width: "80%"
                                    }),
                                    indicatorsContainer: defaultStyles => ({
                                      ...defaultStyles,
                                      padding: "0px",
                                      marginBottom: "0",
                                      marginTop: "0px",
                                      height: "36px",
                                      borderBottomRightRadius: "10px",
                                      borderTopRightRadius: "10px"
                                    }),
                                    indicatorContainer: defaultStyles => ({
                                      ...defaultStyles,
                                      padding: "9px",
                                      marginBottom: "0",
                                      marginTop: "1px",
                                      borderRadius: "0 4px 4px 0"
                                    }),
                                    dropdownIndicator: () => ({
                                      display: "none"
                                    }),
                                    input: defaultStyles => ({
                                      ...defaultStyles,
                                      margin: "0px",
                                      padding: "0px"
                                    }),
                                    singleValue: defaultStyles => ({
                                      ...defaultStyles,
                                      fontSize: "16px",
                                      transition: "opacity 300ms"
                                    }),
                                    control: defaultStyles => ({
                                      ...defaultStyles,
                                      minHeight: "33px",
                                      height: "33px",
                                      height: "33px",
                                      paddingLeft: "10px",
                                      borderColor: "#C6C6C6",
                                      boxShadow: "none",
                                      borderColor: "#C6C6C6",
                                      "&:hover": {
                                        borderColor: "#C6C6C6"
                                      }
                                    })
                                  }}
                                />

                                <img
                                  style={{ marginLeft: "82%", width: "32px" }}
                                  src={plusSrc}
                                  onClick={() => this.openStatusPopup(0)}
                                  disabled={this.isDisabled(this.props.rights.add)}
                                />
                              </div>
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.planNameValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Payer ID
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Payer ID"
                                value={this.state.payer5}
                                disabled="true"
                                name="payer5"
                                id="payer5"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.planNameValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Receiver
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Receiver"
                                value={this.state.payer6}
                                disabled="true"
                                name="payer6"
                                id="payer6"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.planNameValField} */}
                            </div>
                          </div>
                        </div>



                      </div>
                    </div>


                    {/* Electronic Insurances HCFA */}
                    <br></br>
                    <div class="row">
                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Address Information</h6>
                          <hr class="p-0 mt-0 mb-1" style={{ backgroundColor: "#037592" }}></hr>
                          <div class="clearfix"></div>
                        </div><br></br>

                        <div className="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                HCFA Template
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
                                  color: "rgb(67, 75, 93"
                                }}
                                name="formType"
                                id="formType"
                                value={this.state.insurancePlanModel.formType}
                                onChange={this.handleChange}
                              >
                                {formType.map(s => (
                                  <option key={s.value} value={s.value}>
                                    {s.display}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.formTypeValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2"></div>
                          <div class="col-md-4 mb-2"></div>

                        </div>
                      </div>
                    </div>


                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">

                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={this.saveInsurancePlan}
                        disabled={this.isDisabled(
                          this.state.editId > 0
                            ? this.props.rights.update
                            : this.props.rights.add
                        )}
                      >
                        Save
                        </button>

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
                      style={{ borderBottom: "1px solid #d8526b" }}
                    >
                      <li>
                        <input type="radio" name="tabs" id="tab1" checked={this.state.checkedTab == 1 ? true : false} onClick={() => this.handleTabCheck(1)} />
                        <label for="tab1" role="tab" aria-selected="false" aria-controls="panel1" tabindex="1">Addresses
                      </label>

                        <div style={{ marginLeft: "-39px", marginBottom: "20px" }} id="tab-content1" class="tab-content" role="tabpanel"
                          aria-labelledby="specification" aria-hidden="true"><br></br>

                          <div class="card mb-4">

                            <div class="card-body">
                              <div class="table-responsive">
                                <div id="dataTable_wrapper" class="dataTables_wrapper dt-bootstrap4">
                                  <MDBDataTable
                                    responsive={true}
                                    striped
                                    searching={false}
                                    data={insuranceRecord}
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
                        <input type="radio" name="tabs" id="tab2" checked={this.state.checkedTab == 2 ? true : false} onClick={() => this.handleTabCheck(2)} />
                        <label for="tab2" role="tab" aria-selected="false" aria-controls="panel2" tabindex="2">Insurance Billing Options
                      </label>

                        <div
                          style={{ marginLeft: "-121px" }}
                          id="tab-content2"
                          class="tab-content"
                          role="tabpanel"
                          aria-labelledby="specification"
                          aria-hidden="true"
                        >
                          <br></br>

                          <div class="card mb-2">
                            <div class="card-header py-3">

                              <div class="float-lg-right text-right">

                                <a
                                  href=""
                                  style={{ marginTop: "-6px" }}
                                  className="btn-search btn-primary btn-user"
                                  onClick={this.addPlanRow}
                                >
                                  {" "}
                              Add Row
                            </a>
                              </div>
                            </div>

                            <div class="card-body">
                              <div class="table-responsive">
                                <div
                                  id="dataTable_wrapper"
                                  class="dataTables_wrapper dt-bootstrap4"
                                >
                                  <MDBDataTable
                                    responsive={true}
                                    striped
                                    bordered
                                    searching={false}
                                    data={patientPlanData}
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

                <a class="scroll-to-top rounded" href="#page-top">
                  {" "}
                  <i class="fas fa-angle-up"></i>{" "}
                </a>
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
    // id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? {
        search: state.loginInfo.rights.insurancePlanSearch,
        add: state.loginInfo.rights.insurancePlanCreate,
        update: state.loginInfo.rights.insurancePlanEdit,
        delete: state.loginInfo.rights.insurancePlanDelete,
        export: state.loginInfo.rights.insurancePlanExport,
        import: state.loginInfo.rights.insurancePlanImport,
        newIns: state.loginInfo.rights.insuranceEdit
      }
      : [],
    userProviders:
      state.loginInfo.userProviders == null ? [] : state.loginInfo.userProviders
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

export default connect(mapStateToProps, matchDispatchToProps)(NewInsurancePlan);
