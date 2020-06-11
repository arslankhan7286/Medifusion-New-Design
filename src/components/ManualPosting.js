import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { MDBDataTable, MDBBtn, MDBCollapse } from "mdbreact";
import GridHeading from "./GridHeading";
import NewAdjustmentCode from "./NewAdjustmentCode";
import Label from "./Label";
import Input from "./Input";
import searchIcon from "../images/search-icon.png";
import refreshIcon from "../images/refresh-icon.png";
import newBtnIcon from "../images/new-page-icon.png";
import moment from "moment";
import Dropdown from "react-dropdown";
import settingsIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";
import Swal from "sweetalert2";
import { number } from "prop-types";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import NewPractice from "./NewPractice";
import GPopup from "./GPopup";
import plusSrc from "../images/plus-ico.png";
import BatchDocumentPopup from "./BatchDocumentPopup";
import PagePDF from "./PagePDF";
import backIcon from "../images/icons/back-icon.png";
import frontIcon from "../images/icons/front-icon.png";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

export class ManualPosting extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/PaymentCheck/";
    this.visitUrl = process.env.REACT_APP_URL + "/visit/";
    this.paymentVisitUrl = process.env.REACT_APP_URL + "/PaymentVisit/";
    this.batchURL = process.env.REACT_APP_URL + "/BatchDocument/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.visitID = 0;
    this.visitIndex = 0;
    this.saveManualPostingCount = 0;
    this.errorField = "errorField";
    this.checkAmountEntered = false;
    this.currentIndex = 0;

    this.validationModel = {
      checkNumberValField: "",
      checkDateValField: "",
      checkDateFDValField: "",
      checkAmountValField: "",
      practiceValField: "",
      payerNameValField: "",
      receiverValField: "",
      allowedAmountValField: "",
      responsepagesValField: "",
      batchDocumentIDValField: "",
      pageNumberValField: "",
      validation: false,
    };

    this.paymentChargeModel = {
      id: 0,
      paymentVisitID: null,
      chargeID: null,
      charge: null,
      cptCode: null,
      chargeControlNumber: "",
      modifier1: null,
      modifier2: null,
      modifier3: null,
      modifier4: null,
      billedAmount: null,
      paidAmount: null,
      revenueCode: null,
      units: null,
      dosFrom: null,
      dosTo: null,
      chargeNumber: null,
      patientAmount: null,
      patientName: null,
      deductableAmount: null,
      otherPatResp: null,
      coinsuranceAmount: null,
      coPay: null,
      writeoffAmount: null,
      allowedAmount: null,
      appliedToSec: true,
      allowedAmountEntered: false,

      adjustmentCodeID1: "",
      adjustmentCodeObj1: {},
      type1: "",
      adjustmentAmount1: "",
      groupCode1: "",
      groupCode1ValField1: "",

      adjustmentCodeID2: "",
      adjustmentCodeObj2: {},
      type2: "",
      adjustmentAmount2: "",
      groupCode2: "",
      groupCode1ValField2: "",

      adjustmentCodeID3: "",
      adjustmentCodeObj3: {},
      type3: "",
      adjustmentAmount3: "",
      groupCode3: "",
      groupCode1ValField3: "",

      adjustmentCodeID4: null,
      adjsutmentAmount4: null,
      groupCode4: null,

      adjustmentCodeID5: null,
      adjsutmentAmount5: null,
      groupCode5: null,
      remarkCodeID1: null,
      remarkCodeObj1: {},
      remarkCodeID2: null,
      remarkCodeObj2: {},
      remarkCodeID3: null,
      remarkCodeObj3: {},
      remarkCodeID4: 1,
      remarkCodeID5: 1,

      allowedAmountValField: "",
      comments: "",
    };

    this.paymentVisitModel = {
      id: 0,
      paymentCheckID: null,

      processedAs: 1,
      visitID: null,
      visit: null,
      patientID: null,
      patient: null,
      batchDocumentID: null,
      pageNumber: "",
      insuredLastName: "",
      insuredFirstName: "",
      insuredID: "",
      patientLastName: "",
      patientFirstName: "",
      claimNumber: null,
      statusCode: null,
      billedAmount: null,
      paidAmount: null,
      patientAmount: null,
      allowedAmount: "",
      writeOffAmount: "",
      payerICN: null,
      patientLastName: null,
      patientFIrstName: null,
      insuredLastName: null,
      insuredFirstName: null,
      insuredID: null,
      provLastName: null,
      provFirstName: null,
      provNPI: null,
      forwardedPayerName: null,
      forwardedPayerID: null,
      claimStatementFromDate: null,
      claimStatementToDate: null,
      payerReceivedDate: null,
      ClaimNumber: null,

      paymentCharge: [],

      visitValField: "",
    };

    this.paymentCheckModel = {
      id: 0,
      receiverID: null,
      receiver: null,
      practiceID: null,
      facility: null,
      checkNumber: null,
      checkDate: null,
      checkAmount: null,
      transactionCode: null,
      creditDebitFlag: null,
      paymentMethod: null,
      payerName: null,
      status: "NP",
      appliedAmount: null,
      unAppliedAmount: null,
      postedAmount: null,
      payerID: null,
      payerAddress: null,
      payerCity: null,
      payerState: null,
      payerZipCode: null,
      reF_2U_ID: null,
      payerContactPerson: null,
      payerContactNumber: null,
      payeeName: null,
      payeeNPI: null,
      payeeAddress: null,
      payeeCity: null,
      payeeState: null,
      payeeZipCode: null,
      payeeTaxID: null,
      numberOfVisits: 0,
      numberOfPatients: 0,
      pageNumber: "",
      batchDocumentID: null,
      paymentVisit: [],
    };

    this.searchModel = {
      checkNumber: "",
      checkDate: "",
      checkAmount: "",

      appliedAmount: "",
      postedAmount: "",
      status: "",

      practiceID: "",
      payerID: "",

      receiverID: "",
    };

    this.checkPostModel = {
      ids: [],
    };

    this.state = {
      paymentCheckModel: this.paymentCheckModel,
      paymentVisitModel: [],
      paymentChargeModel: [],
      searchModel: this.searchModel,
      validationModel: {...this.validationModel},
      id: 0,
      editId: this.props.id,
      visitID: 0,
      // editId: this.props.id > 0 ? this.props.id this.props.paymentCheckId,
      chargesData: [],
      showPopup: false,
      revData: this.props.receivers,
      facData: [],
      adjCodeOptions: this.props.adjustmentCodes,
      remarkOptions: this.props.remarkCodes,
      collapseID: 0,
      loading: false,
      popupName: "",
      id: 0,
      loading: false,
      batchDocumentID: null,
      pageNumber: "",
      fileURL: "",
    };

    this.addPaymentCheckRow = this.addPaymentCheckRow.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.handlePaymentChargeChange = this.handlePaymentChargeChange.bind(this);
    this.handlePaymentCheckChange = this.handlePaymentCheckChange.bind(this);
    this.saveManualPosting = this.saveManualPosting.bind(this);
    this.handleRemarkCodeChange = this.handleRemarkCodeChange.bind(this);
    this.handlepaymentCheckAmountChange = this.handlepaymentCheckAmountChange.bind(
      this
    );
    this.handlepaymentVisitAmountChange = this.handlepaymentVisitAmountChange.bind(
      this
    );
    this.handlepaymentChargeAmountChange = this.handlepaymentChargeAmountChange.bind(
      this
    );
    this.calculatePateintResInCharge = this.calculatePateintResInCharge.bind(
      this
    );
    this.deletePaymentCheckRow = this.deletePaymentCheckRow.bind(this);
    this.deleteCheck = this.deleteCheck.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.calculateWriteOffAmount = this.calculateWriteOffAmount.bind(this);
    this.calculateTotalWriteOffAmount = this.calculateTotalWriteOffAmount.bind(
      this
    );
    this.calculatePaidAmount = this.calculatePaidAmount.bind(this);
    this.calculateTotalPaidAmount = this.calculateTotalPaidAmount.bind(this);
    this.calculateAllowedAmount = this.calculateAllowedAmount.bind(this);
    this.calculateTotalAllowedAmount = this.calculateTotalAllowedAmount.bind(
      this
    );
    this.calculatePateintRes = this.calculatePateintRes.bind(this);
    this.handleAdjCodeChange = this.handleAdjCodeChange.bind(this);
    this.toggleCheck = this.toggleCheck.bind(this);
    this.nextVisit = this.nextVisit.bind(this);
    this.previousVisit = this.previousVisit.bind(this);
    this.handleNumericCheck = this.handleNumericCheck.bind(this);
    this.handleBatchChange = this.handleBatchChange.bind(this);
  }

  async componentWillMount() {
    this.setState({ loading: true });

    try {
      //   await axios
      //     .get(this.url + "GetProfiles", this.config)
      //     .then((response) => {
      //       this.setState({
      //         // facData: response.data.practice,
      //         revData: response.data.receiver,
      //         adjCodeOptions: response.data.adjustmentCodes,
      //         remarkOptions: response.data.remarkCodes,
      //         loading: false,
      //       });
      //     })
      //     .catch((error) => {
      //       this.setState({ loading: false });
      //     });

      console.log("Edit ID : ", this.state.editId);
      let paymentCheckID = this.state.editId
        ? this.state.editId
        : this.state.paymentCheckModel.id;
      if (
        this.props.id > 0 ||
        this.state.editId > 0 ||
        this.state.paymentCheckModel.id > 0
      ) {
        // if (this.state.paymentCheckModel.id > 0) {
        //   await this.setState({ loading: false });
        // } else {
        //   await this.setState({ loading: true });
        // }

        let obj = [];
        obj.push(this.state.editId);
        this.checkPostModel.ids = obj;

        await axios
          .get(this.url + "findpaymentCheck/" + paymentCheckID, this.config)
          .then(async (response) => {
            var paymentCheck = { ...response.data };

            let patRes = 0;
            await paymentCheck.paymentVisit.map(
              async (paymentVisit, visitIndex) => {
                patRes = 0;
                paymentVisit.billedAmount = 0;
                await paymentVisit.paymentCharge.map(
                  async (paymentCharge, i) => {
                    paymentVisit.billedAmount =
                      Number(parseFloat(paymentVisit.billedAmount).toFixed(2)) +
                      Number(parseFloat(paymentCharge.billedAmount).toFixed(2));

                    if (!paymentCharge.copay) {
                      patRes += 0;
                    } else {
                      patRes += Number(
                        parseFloat(paymentCharge.copay).toFixed(2)
                      );
                    }

                    if (!paymentCharge.deductableAmount) {
                      patRes += 0;
                    } else {
                      patRes += Number(
                        parseFloat(paymentCharge.deductableAmount).toFixed(2)
                      );
                    }

                    if (!paymentCharge.coinsuranceAmount) {
                      patRes += 0;
                    } else {
                      patRes += Number(
                        parseFloat(paymentCharge.coinsuranceAmount).toFixed(2)
                      );
                    }

                    //Other Patient Resposibility Amount
                    if (!paymentCharge.otherPatResp) {
                      patRes += 0;
                    } else {
                      patRes += Number(
                        parseFloat(paymentCharge.otherPatResp).toFixed(2)
                      );
                    }

                    var adjCodeObj1 = null;
                    adjCodeObj1 = await this.props.adjustmentCodes.filter(
                      (option) => option.id == paymentCharge.adjustmentCodeID1
                    );
                    paymentCharge.adjustmentCodeObj1 =
                      adjCodeObj1.length > 0 ? adjCodeObj1[0] : null;
                    // paymentCharge.adjustmentAmount1 = adjCodeObj1[0].description2;
                    paymentCharge.type1 =
                      adjCodeObj1.length > 0 ? adjCodeObj1[0].category : null;

                    var adjCodeObj2 = {};
                    adjCodeObj2 = await this.props.adjustmentCodes.filter(
                      (option) => option.id == paymentCharge.adjustmentCodeID2
                    );
                    paymentCharge.adjustmentCodeObj2 =
                      adjCodeObj2.length > 0 ? adjCodeObj2[0] : null;
                    // paymentCharge.adjustmentAmount2 = adjCodeObj2[0].description2;
                    paymentCharge.type2 =
                      adjCodeObj2.length > 0 ? adjCodeObj2[0].category : null;

                    var adjCodeObj3 = {};
                    adjCodeObj3 = await this.props.adjustmentCodes.filter(
                      (option) => option.id == paymentCharge.adjustmentCodeID3
                    );
                    paymentCharge.adjustmentCodeObj3 =
                      adjCodeObj3.length > 0 ? adjCodeObj3[0] : null;
                    // paymentCharge.adjustmentAmount3 = adjCodeObj3[0].description2;
                    paymentCharge.type3 =
                      adjCodeObj3.length > 0 ? adjCodeObj3[0].category : null;

                    var remarkCodeObj1 = {};
                    remarkCodeObj1 = await this.props.remarkCodes.filter(
                      (option) => option.id == paymentCharge.remarkCodeID1
                    );
                    paymentCharge.remarkCodeObj1 =
                      remarkCodeObj1.length > 0 ? remarkCodeObj1[0] : null;

                    var remarkCodeObj2 = {};
                    remarkCodeObj2 = await this.props.remarkCodes.filter(
                      (option) => option.id == paymentCharge.remarkCodeID2
                    );
                    paymentCharge.remarkCodeObj2 =
                      remarkCodeObj2.length > 0 ? remarkCodeObj2[0] : null;

                    var remarkCodeObj3 = {};
                    remarkCodeObj3 = await this.props.remarkCodes.filter(
                      (option) => option.id == paymentCharge.remarkCodeID3
                    );
                    paymentCharge.remarkCodeObj3 =
                      remarkCodeObj3.length > 0 ? remarkCodeObj3[0] : null;

                    paymentCharge.isChargeIDNull =
                      paymentCharge.chargeID == null ? true : false;
                  }
                );
                paymentVisit.patientAmount = patRes;
                paymentVisit.isVisitIDnull =
                  paymentVisit.visitID === null ? true : false;
              }
            );

            this.setState({ paymentCheckModel: paymentCheck, loading: false });
          })
          .catch((error) => {
            this.setState({ loading: false });
            Swal.fire("No Record Found", "", "error");
          });
      } else {
        if (this.props.visitID > 0) {
          var paymentVisitModel = { ...this.paymentVisitModel };
          paymentVisitModel.visitID = this.props.visitID;
          await this.setState({
            collapseID: 1,
            visitID: this.props.visitID,
            paymentCheckModel: {
              ...this.state.paymentCheckModel,
              paymentVisit: this.state.paymentCheckModel.paymentVisit.concat(
                paymentVisitModel
              ),
            },
          });
          await this.findSubmittedVisits(0);
        } else {
          var paymentVisitModel = { ...this.paymentVisitModel };
          paymentVisitModel.visitID = this.props.visitID;
          await this.setState({
            visitID: 0,
            collapseID: 1,
            paymentCheckModel: {
              ...this.state.paymentCheckModel,
              paymentVisit: this.state.paymentCheckModel.paymentVisit.concat(
                paymentVisitModel
              ),
            },
          });
        }
      }
    } catch {
      this.setState({ loading: false });
    }

    if (this.state.paymentCheckModel.batchDocumentID) {
      var myVal = {...this.validationModel};
      axios
        .get(
          this.batchURL +
            "FindBatchDocumentPath/" +
            this.state.paymentCheckModel.batchDocumentID,
          this.config
        )
        .then((response) => {
          myVal.batchDocumentIDValField = "";
          myVal.responsepagesValField = (
            <span style={{ color: "green" }}>
              Number of Pages: {response.data.numberOfPages}
            </span>
          );
          this.setState({
            pageNumber: response.data.numberOfPages,
            fileURL: response.data.documentFilePath,
            validationModel: myVal,
          });
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 404) {
                console.log("Not Found");
                var myVal = {...this.validationModel};

                myVal.batchDocumentIDValField = (
                  <span
                    className=""
                    style={{ marginLeft: "-50%" }}
                  >
                    Invalid Batch #{" "}
                    {this.state.paymentCheckModel.batchDocumentID}
                  </span>
                );
                myVal.responsepagesValField = "";
                return;
              }
            }
          }
        });
    }

    this.setState({ loading: false });
  }

  async getVisitID(event, patID) {
    event.preventDefault();
    $("#myModal").hide();
    var paymentVisit = [...this.state.paymentCheckModel.paymentVisit];
    paymentVisit[this.visitIndex].visitID = patID;
    this.setState({
      popupName: "",
      id: 0,
      paymentCheckModel: {
        ...this.state.paymentCheckModel,
        paymentVisit: paymentVisit,
      },
    });
    this.findSubmittedVisits(this.visitIndex);
  }

  //Open Popup
  openPopup = (event, name, id) => {
    event.preventDefault();
    this.setState({ popupName: name, id: id });
  };

  //Close Popup
  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });

    // if (this.state.popupName == "cpt") {
    //   axios
    //     .get(this.url + "GetProfiles", this.config)
    //     .then((response) => {
    //       this.setState({
    //         adjCodeOptions: response.data.adjustmentCodes,
    //         popupName: "",
    //       });
    //     })
    //     .catch((error) => {});
    // } else {
    //   this.setState({ popupName: "" });
    // }
  };

  //Open Adj Code Popup
  openAdjPopup = (event) => {
    event.preventDefault();
    try {
      if (event.id) {
        this.openPopup("cpt", event.id);
      }
    } catch {}
  };
  //payment check change
  handlePaymentCheckChange(event) {
    if (event.target.name == "checkDate") {
    } else {
      //Carret Position
      const caret = event.target.selectionStart;
      const element = event.target;
      window.requestAnimationFrame(() => {
        element.selectionStart = caret;
        element.selectionEnd = caret;
      });
    }
    event.preventDefault();
    this.setState({
      paymentCheckModel: {
        ...this.state.paymentCheckModel,
        [event.target.name]:
          event.target.value == "Please Select"
            ? null
            : event.target.value.toUpperCase(),
      },
    });
  }

  //payment check amount
  async handlepaymentCheckAmountChange(e) {
    const amount = e.target.value;
    var name = e.target.name;
    var regexp = /^\d+(\.(\d{1,2})?)?$/;

    if (amount.length < 15) {
      if (regexp.test(amount)) {
        if (name == "checkAmount") {
          this.checkAmountEntered = true;
        }
        await this.setState({
          paymentCheckModel: {
            ...this.state.paymentCheckModel,
            [name]: amount,
          },
        });
      } else if (amount == "") {
        // if (name == "checkAmount") {
        //   this.checkAmountEntered = false;
        // }
        await this.setState({
          paymentCheckModel: {
            ...this.state.paymentCheckModel,
            [name]: "",
          },
        });
      } else {
        e.preventDefault();
        if (e.charCode >= 48 && e.charCode <= 57) {
          return true;
        } else {
          return false;
        }
      }
    }

    this.calculateTotalPaidAmount();
  }

  //payment visit change
  handlePaymentVisitChange = (event) => {
    event.preventDefault();
    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    const index = event.target.id;
    const name = event.target.name;
    var paymentVisit = [...this.state.paymentCheckModel.paymentVisit];
    paymentVisit[index][name] = event.target.value.toUpperCase();

    this.setState({
      paymentCheckModel: {
        ...this.state.paymentCheckModel,
        paymentVisit: paymentVisit,
      },
    });
  };

  //payment visit amount change
  handlepaymentVisitAmountChange(e) {
    e.preventDefault();
    const index = e.target.id;
    const name = e.target.name;
    var paymentVisit = [...this.state.paymentCheckModel.paymentVisit];
    const amount = e.target.value;
    var regexp = /^\d+(\.(\d{1,2})?)?$/;
    if (regexp.test(amount)) {
      paymentVisit[index][name] = amount;
      this.setState({
        paymentCheckModel: {
          ...this.state.paymentCheckModel,
          paymentVisit: paymentVisit,
        },
      });
    } else if (amount == "") {
      paymentVisit[index][name] = "";
      this.setState({
        paymentCheckModel: {
          ...this.state.paymentCheckModel,
          paymentVisit: paymentVisit,
        },
      });
    }
  }
  //payment charge change
  async handlePaymentChargeChange(event, visitIndex, chargeIndex) {
    event.preventDefault();
    const index = event.target.id;
    const name = event.target.name;
    var paymentVisits = [...this.state.paymentCheckModel.paymentVisit];
    paymentVisits[visitIndex].paymentCharge[chargeIndex][
      name
    ] = event.target.value.toUpperCase();

    var patRes = 0;
    var allowedAmount = 0;
    var totalWriteOffAmount = 0;
    var paidAmount = 0;
    var totalPaidAmount = 0;
    var totalAllowedAmount = 0;

    //Patient Responibility in Payment Charge
    paymentVisits = await this.calculatePateintResInCharge(
      paymentVisits,
      visitIndex
    );

    //Patient Responsibility
    patRes = await this.calculatePateintRes(paymentVisits, visitIndex);

    //WriteOff Amount
    paymentVisits = await this.calculateWriteOffAmount(
      paymentVisits,
      visitIndex
    );
    // Paid Amount
    paidAmount = await this.calculatePaidAmount(paymentVisits, visitIndex);

    //Total WriteOff Amount
    totalWriteOffAmount = await this.calculateTotalWriteOffAmount(
      paymentVisits,
      visitIndex
    );

    //Allowed Amount
    paymentVisits = await this.calculateAllowedAmount(
      paymentVisits,
      visitIndex
    );

    //Total Allowed Amount
    totalAllowedAmount = await this.calculateTotalAllowedAmount(
      paymentVisits,
      visitIndex
    );

    paymentVisits[visitIndex].patientAmount =
      parseFloat(Number(patRes)).toFixed(2) <= 0
        ? ""
        : parseFloat(Number(patRes)).toFixed(2);
    paymentVisits[visitIndex].paidAmount =
      parseFloat(Number(paidAmount)).toFixed(2) <= 0
        ? ""
        : parseFloat(Number(paidAmount)).toFixed(2);
    paymentVisits[visitIndex].writeOffAmount =
      parseFloat(Number(totalWriteOffAmount)).toFixed(2) <= 0
        ? ""
        : parseFloat(Number(totalWriteOffAmount)).toFixed(2);
    paymentVisits[visitIndex].allowedAmount =
      parseFloat(totalAllowedAmount).toFixed(2) <= 0
        ? ""
        : parseFloat(totalAllowedAmount).toFixed(2);

    await this.setState({
      paymentCheckModel: {
        ...this.state.paymentCheckModel,
        paymentVisit: paymentVisits,
        // appliedAmount:totalPaidAmount
      },
    });

    //Total Paid Amount
    await this.calculateTotalPaidAmount(paymentVisits, visitIndex);
  }

  //payment charge amount change
  async handlepaymentChargeAmountChange(e, visitIndex, chargeIndex, type) {
    e.preventDefault();
    const name = e.target.name;
    var paymentVisits = [...this.state.paymentCheckModel.paymentVisit];

    var regexp = /^\d*(\.\d{0,2})?$/;
    if (paymentVisits[visitIndex].processedAs === "22") {
      //Regex for signed integers
      regexp = /^-?\d*(\.\d{0,2})?$/;
    } else {
      //regex for decimal input upto 2 decimal points
      regexp = /^\d*(\.\d{0,2})?$/;
    }

    const amount = e.target.value;
    if (regexp.test(amount)) {
      //If Allowed Amount is greater than Billed Amount than show error message and return
      if (name == "allowedAmount") {
        if (
          Number(amount) >
          Number(
            paymentVisits[visitIndex].paymentCharge[chargeIndex].billedAmount
          )
        ) {
          Swal.fire(
            "Error",
            "Allowed Amount Can't be greater than Billed Amount",
            "error"
          );
          return;
        }
      }
      paymentVisits[visitIndex].paymentCharge[chargeIndex][name] = amount;
      var amt = paymentVisits[visitIndex].paymentCharge[chargeIndex][name] + "";
      //If Amount length is greater than 15 than return
      if (amt.length > 15) {
        return;
      }
      var patRes = 0;
      var allowedAmount = 0;
      var totalAllowedAmount = 0;
      var paidAmount = 0;
      var totalPaidAmount = 0;
      var writeOffAmount = 0;
      var totalWriteOffAmount = 0;
      var adjCodeObj = {};
      if (name == "writeoffAmount") {
        totalWriteOffAmount = await this.calculateTotalWriteOffAmount(
          paymentVisits,
          visitIndex
        );
        if (paymentVisits[visitIndex].processedAs === "22") {
          paymentVisits[visitIndex].writeOffAmount = totalWriteOffAmount
            ? totalWriteOffAmount
            : "";
        } else {
          paymentVisits[visitIndex].writeOffAmount =
            totalWriteOffAmount < 0
              ? ""
              : (totalWriteOffAmount + "").split(".")[1] < 0
              ? (totalWriteOffAmount + "").split(".")[0]
              : totalWriteOffAmount;
        }
      } else if (name == "allowedAmount") {
        if (!(amount > 0) && paymentVisits[visitIndex].processedAs !== "22") {
          paymentVisits[visitIndex].paymentCharge[
            chargeIndex
          ].adjustmentAmount1 = "";
          paymentVisits[visitIndex].paymentCharge[chargeIndex].groupCode1 = "";
          paymentVisits[visitIndex].paymentCharge[chargeIndex].type1 = "";
          paymentVisits[visitIndex].paymentCharge[
            chargeIndex
          ].adjustmentCodeID1 = null;
          paymentVisits[visitIndex].paymentCharge[
            chargeIndex
          ].adjustmentCodeObj1 = null;
          paymentVisits[visitIndex].paymentCharge[
            chargeIndex
          ].allowedAmountEntered = false;
        } else if (
          Number(
            paymentVisits[visitIndex].paymentCharge[chargeIndex].billedAmount
          ) -
            Number(amount) >
          0
        ) {
          paymentVisits[visitIndex].paymentCharge[
            chargeIndex
          ].allowedAmountEntered =
            paymentVisits[visitIndex].paymentCharge[chargeIndex]
              .allowedAmount == 0
              ? false
              : true;

          console.log("Processed As New : ", amount);
          //Adjustment Amount 1
          paymentVisits[visitIndex].paymentCharge[
            chargeIndex
          ].adjustmentAmount1 =
            paymentVisits[visitIndex].processedAs === "22"
              ? (Number(
                  parseFloat(
                    paymentVisits[visitIndex].paymentCharge[chargeIndex]
                      .billedAmount
                  ).toFixed(2)
                ) > 0
                  ? Number(
                      parseFloat(
                        paymentVisits[visitIndex].paymentCharge[chargeIndex]
                          .billedAmount
                      ).toFixed(2)
                    ) * -1
                  : 0) - (amount ? Number(parseFloat(amount).toFixed(2)) : 0)
              : Number(
                  parseFloat(
                    paymentVisits[visitIndex].paymentCharge[chargeIndex]
                      .billedAmount
                  ).toFixed(2)
                ) - Number(parseFloat(amount).toFixed(2));

          //Adjustment Group 1
          paymentVisits[visitIndex].paymentCharge[chargeIndex].groupCode1 =
            "CO";

          //Adjustment Type 1
          paymentVisits[visitIndex].paymentCharge[chargeIndex].type1 = "W";
          var adjCode = await this.props.adjustmentCodes.filter(
            (adjCode) => adjCode.value == "45"
          );

          //Adjustment Code ID 1
          paymentVisits[visitIndex].paymentCharge[
            chargeIndex
          ].adjustmentCodeID1 = adjCode.length > 0 ? adjCode[0].id : null;

          //Adjustment Code Object 1
          paymentVisits[visitIndex].paymentCharge[
            chargeIndex
          ].adjustmentCodeObj1 = adjCode.length > 0 ? adjCode[0] : null;
        } else {
          paymentVisits[visitIndex].paymentCharge[
            chargeIndex
          ].allowedAmountEntered = true;
          paymentVisits[visitIndex].paymentCharge[
            chargeIndex
          ].adjustmentAmount1 = "";
          paymentVisits[visitIndex].paymentCharge[chargeIndex].groupCode1 = "";
          paymentVisits[visitIndex].paymentCharge[chargeIndex].type1 = "";
          paymentVisits[visitIndex].paymentCharge[
            chargeIndex
          ].adjustmentCodeID1 = null;
          paymentVisits[visitIndex].paymentCharge[
            chargeIndex
          ].adjustmentCodeObj1 = null;
        }

        //Calculate WriteOff Amount
        paymentVisits = await this.calculateWriteOffAmount(
          paymentVisits,
          visitIndex
        );
        //Calculate Total WriteOff Amount
        totalWriteOffAmount = await this.calculateTotalWriteOffAmount(
          paymentVisits,
          visitIndex
        );

        //Calculate Total Allowed Amount
        totalAllowedAmount = await this.calculateTotalAllowedAmount(
          paymentVisits,
          visitIndex
        );

        //writeoff amount
        if (paymentVisits[visitIndex].processedAs === "22") {
          paymentVisits[visitIndex].writeOffAmount = parseFloat(
            Number(totalWriteOffAmount)
          ).toFixed(2);
        } else {
          paymentVisits[visitIndex].writeOffAmount =
            parseFloat(Number(totalWriteOffAmount)).toFixed(2) < 0
              ? ""
              : parseFloat(Number(totalWriteOffAmount)).toFixed(2);
        }

        if (paymentVisits[visitIndex].processedAs === "22") {
          paymentVisits[visitIndex].allowedAmount = parseFloat(
            totalAllowedAmount
          ).toFixed(2);
        } else {
          paymentVisits[visitIndex].writeOffAmount =
            parseFloat(totalAllowedAmount).toFixed(2) < 0
              ? ""
              : parseFloat(totalAllowedAmount).toFixed(2);
        }
      } else {
        //Patient Responibility in Payment Charge
        paymentVisits = await this.calculatePateintResInCharge(
          paymentVisits,
          visitIndex
        );

        //Patient Responsibility
        patRes = await this.calculatePateintRes(paymentVisits, visitIndex);

        //WriteOff Amount
        paymentVisits = await this.calculateWriteOffAmount(
          paymentVisits,
          visitIndex
        );

        // Paid Amount
        paidAmount = await this.calculatePaidAmount(paymentVisits, visitIndex);

        //Total WriteOff Amount
        totalWriteOffAmount = await this.calculateTotalWriteOffAmount(
          paymentVisits,
          visitIndex
        );

        if (
          paymentVisits[visitIndex].paymentCharge[chargeIndex]
            .allowedAmountEntered == false
        ) {
          // Allowed Amount
          paymentVisits = await this.calculateAllowedAmount(
            paymentVisits,
            visitIndex
          );
        }

        //Total Allowed Amount
        totalAllowedAmount = await this.calculateTotalAllowedAmount(
          paymentVisits,
          visitIndex
        );

        if (paymentVisits[visitIndex].processedAs === "22") {
          paymentVisits[visitIndex].patientAmount = parseFloat(patRes).toFixed(
            2
          );
        } else {
          paymentVisits[visitIndex].patientAmount =
            parseFloat(patRes).toFixed(2) < 0
              ? ""
              : parseFloat(patRes).toFixed(2);
        }

        if (paymentVisits[visitIndex].processedAs === "22") {
          paymentVisits[visitIndex].paidAmount = parseFloat(paidAmount).toFixed(
            2
          );
        } else {
          paymentVisits[visitIndex].paidAmount =
            parseFloat(paidAmount).toFixed(2) < 0
              ? ""
              : parseFloat(paidAmount).toFixed(2);
        }

        if (paymentVisits[visitIndex].processedAs === "22") {
          paymentVisits[visitIndex].writeOffAmount = parseFloat(
            totalWriteOffAmount
          ).toFixed(2);
        } else {
          paymentVisits[visitIndex].writeOffAmount =
            parseFloat(totalWriteOffAmount).toFixed(2) < 0
              ? ""
              : parseFloat(totalWriteOffAmount).toFixed(2);
        }

        if (paymentVisits[visitIndex].processedAs === "22") {
          paymentVisits[visitIndex].allowedAmount = parseFloat(
            totalAllowedAmount
          ).toFixed(2);
        } else {
          paymentVisits[visitIndex].allowedAmount =
            parseFloat(totalAllowedAmount).toFixed(2) < 0
              ? ""
              : parseFloat(totalAllowedAmount).toFixed(2);
        }
      }

      this.setState({
        paymentCheckModel: {
          ...this.state.paymentCheckModel,
          paymentVisit: paymentVisits,
        },
      });
    } else if (amount == "") {
      paymentVisits[visitIndex].paymentCharge[chargeIndex][name] = "";
      if (name == "allowedAmount") {
        console.log("Allowed Amount : ", amount);
        // paymentVisits[visitIndex].paymentCharge[chargeIndex].adjustmentAmount1 =
        //   paymentVisits[visitIndex].paymentCharge[chargeIndex].billedAmount - 0;
        // paymentVisits[visitIndex].paymentCharge[chargeIndex].groupCode1 = "CO";
        // var adjCode = await this.state.adjCodeOptions.filter(
        //   adjCode => adjCode.id == 442
        // );
        // paymentVisits[visitIndex].paymentCharge[chargeIndex].adjustmentCodeID1 =
        //   adjCode.length > 0 ? adjCode[0].id : null;
        // paymentVisits[visitIndex].paymentCharge[
        //   chargeIndex
        // ].adjustmentCodeObj1 = adjCode.length > 0 ? adjCode[0] : null;

        paymentVisits[visitIndex].paymentCharge[
          chargeIndex
        ].adjustmentAmount1 = 0;
        paymentVisits[visitIndex].paymentCharge[chargeIndex].groupCode1 = "";
        paymentVisits[visitIndex].paymentCharge[
          chargeIndex
        ].adjustmentCodeID1 = null;
        paymentVisits[visitIndex].paymentCharge[
          chargeIndex
        ].adjustmentCodeObj1 = null;
        paymentVisits[visitIndex].paymentCharge[
          chargeIndex
        ].allowedAmountEntered = false;

        //WriteOff Amount
        paymentVisits = await this.calculateWriteOffAmount(
          paymentVisits,
          visitIndex
        );

        //Total WriteOff Amount
        totalWriteOffAmount = await this.calculateTotalWriteOffAmount(
          paymentVisits,
          visitIndex
        );

        //Total Allowed Amount
        totalAllowedAmount = await this.calculateTotalAllowedAmount(
          paymentVisits,
          visitIndex
        );

        paymentVisits[visitIndex].writeOffAmount =
          parseFloat(Number(totalWriteOffAmount)).toFixed(2) < 0
            ? ""
            : parseFloat(Number(totalWriteOffAmount)).toFixed(2);
        paymentVisits[visitIndex].allowedAmount =
          parseFloat(totalAllowedAmount).toFixed(2) < 0
            ? ""
            : parseFloat(totalAllowedAmount).toFixed(2);
        // paymentVisits[visitIndex].paymentCharge[chargeIndex][name] = "";
      } else if (name == "writeoffAmount") {
        totalWriteOffAmount = await this.calculateTotalWriteOffAmount(
          paymentVisits,
          visitIndex
        );
        paymentVisits[visitIndex].writeOffAmount =
          parseFloat(Number(totalWriteOffAmount)).toFixed(2) < 0
            ? ""
            : (totalWriteOffAmount + "").split(".")[1] < 0
            ? (totalWriteOffAmount + "").split(".")[0]
            : totalWriteOffAmount;
      } else if (
        name == "adjustmentAmount1" ||
        name == "adjustmentAmount2" ||
        name == "adjustmentAmount3"
      ) {
        //WriteOff Amount
        var writeOffAmount = 0;
        paymentVisits = await this.calculateWriteOffAmount(
          paymentVisits,
          visitIndex
        );

        //Total WriteOff Amount
        var totalWriteOffAmount = 0;
        totalWriteOffAmount = await this.calculateTotalWriteOffAmount(
          paymentVisits,
          visitIndex
        );

        paymentVisits[visitIndex].writeOffAmount =
          Number(totalWriteOffAmount) < 0
            ? ""
            : parseFloat(Number(totalWriteOffAmount)).toFixed(2);
      } else {
        //Patient Responsibility
        patRes = await this.calculatePateintRes(paymentVisits, visitIndex);

        //Patient Responibility in Payment Charge
        paymentVisits = await this.calculatePateintResInCharge(
          paymentVisits,
          visitIndex
        );

        // Paid Amount
        paidAmount = await this.calculatePaidAmount(paymentVisits, visitIndex);

        //WriteOff Amount
        paymentVisits = await this.calculateWriteOffAmount(
          paymentVisits,
          visitIndex
        );

        //Total WriteOff Amount
        totalWriteOffAmount = await this.calculateTotalWriteOffAmount(
          paymentVisits,
          visitIndex
        );

        if (
          paymentVisits[visitIndex].paymentCharge[chargeIndex]
            .allowedAmountEntered == false
        ) {
          // Allowed Amount
          paymentVisits = await this.calculateAllowedAmount(
            paymentVisits,
            visitIndex
          );
        }

        //Total Allowed Amount
        totalAllowedAmount = await this.calculateTotalAllowedAmount(
          paymentVisits,
          visitIndex
        );

        paymentVisits[visitIndex].patientAmount =
          parseFloat(Number(patRes)).toFixed(2) < 0
            ? ""
            : parseFloat(Number(patRes)).toFixed(2);
        paymentVisits[visitIndex].paidAmount =
          parseFloat(Number(paidAmount)).toFixed(2) < 0
            ? ""
            : parseFloat(Number(paidAmount)).toFixed(2);
        paymentVisits[visitIndex].writeOffAmount =
          parseFloat(Number(totalWriteOffAmount)).toFixed(2) < 0
            ? ""
            : parseFloat(Number(totalWriteOffAmount)).toFixed(2);
        paymentVisits[visitIndex].allowedAmount =
          parseFloat(totalAllowedAmount).toFixed(2) < 0
            ? ""
            : parseFloat(totalAllowedAmount).toFixed(2);
        paymentVisits[visitIndex].paymentCharge[chargeIndex][name] = "";
      }

      await this.setState({
        paymentCheckModel: {
          ...this.state.paymentCheckModel,
          paymentVisit: paymentVisits,
          // appliedAmount:totalPaidAmount
        },
      });
    }

    //Total Paid Amount
    await this.calculateTotalPaidAmount();
  }

  //Calcualte WriteOff Amount
  async calculateWriteOffAmount(paymentVisits, visitIndex) {
    var paymentVisits = [...paymentVisits];
    var writeOffAmount = 0;
    await paymentVisits[visitIndex].paymentCharge.map((paymentCharge, i) => {
      writeOffAmount = 0;
      //writeOff
      if (
        paymentCharge.adjustmentAmount1 == undefined ||
        paymentCharge.adjustmentAmount1 == ""
      ) {
        writeOffAmount = Number(parseFloat(writeOffAmount).toFixed(2)) + 0;
      } else if (paymentCharge.type1 == "W") {
        writeOffAmount =
          Number(parseFloat(writeOffAmount).toFixed(2)) +
          Number(parseFloat(paymentCharge.adjustmentAmount1).toFixed(2));
      }
      if (
        paymentCharge.adjustmentAmount2 == undefined ||
        paymentCharge.adjustmentAmount2 == ""
      ) {
        writeOffAmount = Number(parseFloat(writeOffAmount).toFixed(2)) + 0;
      } else if (paymentCharge.type2 == "W") {
        writeOffAmount =
          Number(parseFloat(writeOffAmount).toFixed(2)) +
          Number(parseFloat(paymentCharge.adjustmentAmount2).toFixed(2));
      }
      if (
        paymentCharge.adjustmentAmount3 == undefined ||
        paymentCharge.adjustmentAmount3 == ""
      ) {
        writeOffAmount = Number(parseFloat(writeOffAmount).toFixed(2)) + 0;
      } else if (paymentCharge.type3 == "W") {
        writeOffAmount =
          Number(parseFloat(writeOffAmount).toFixed(2)) +
          Number(parseFloat(paymentCharge.adjustmentAmount3).toFixed(2));
      }

      if (paymentVisits[visitIndex].processedAs === "22") {
        paymentCharge.writeoffAmount = Number(
          parseFloat(writeOffAmount).toFixed(2)
        );
      } else {
        paymentCharge.writeoffAmount =
          Number(parseFloat(writeOffAmount).toFixed(2)) <= 0
            ? ""
            : Number(parseFloat(writeOffAmount).toFixed(2));
      }
    });
    return paymentVisits;
  }

  //Calculate Total WriteOff Amount
  async calculateTotalWriteOffAmount(paymentVisits, visitIndex) {
    var totalWriteOffAmount = 0;
    await paymentVisits[visitIndex].paymentCharge.map((paymentCharge, i) => {
      if (
        paymentCharge.writeoffAmount == undefined ||
        paymentCharge.writeoffAmount == "" ||
        paymentCharge.writeoffAmount == null ||
        paymentCharge.writeoffAmount == NaN
      ) {
        totalWriteOffAmount = Number(parseFloat(totalWriteOffAmount)) + 0;
      } else {
        totalWriteOffAmount =
          Number(parseFloat(totalWriteOffAmount).toFixed(2)) +
          Number(parseFloat(paymentCharge.writeoffAmount).toFixed(2));
      }
    });

    return totalWriteOffAmount;
  }

  //Calcualte Paid Amount
  async calculatePaidAmount(paymentVisits, visitIndex) {
    var paidAmount = 0;
    await paymentVisits[visitIndex].paymentCharge.map((paymentCharge, i) => {
      //  Paid AMount
      if (
        paymentCharge.paidAmount == undefined ||
        paymentCharge.paidAmount == ""
      ) {
        paidAmount = Number(parseFloat(paidAmount).toFixed(2)) + 0;
      } else {
        paidAmount =
          Number(parseFloat(paidAmount).toFixed(2)) +
          Number(parseFloat(paymentCharge.paidAmount).toFixed(2));
      }
    });

    return paidAmount;
  }

  //Calculate Total Paid Amount
  async calculateTotalPaidAmount() {
    var totalPaidAmount = 0;
    let totalPaidAmountForCheckAmount = 0;
    await this.state.paymentCheckModel.paymentVisit.map((paymentVisit, i) => {
      //  Paid AMount
      // if (
      //   paymentVisit.paidAmount == undefined ||
      //   paymentVisit.paidAmount == ""
      // ) {
      //   totalPaidAmount = Number(parseFloat(totalPaidAmount).toFixed(2)) + 0;
      // } else {
      //   totalPaidAmount =
      //     Number(parseFloat(totalPaidAmount).toFixed(2)) + Number(parseFloat(paymentVisit.paidAmount).toFixed(2));
      // }

      if (!(paymentVisit.processedAs === "22")) {
        if (this.isNull(paymentVisit.paidAmount)) {
          totalPaidAmountForCheckAmount = Number(
            parseFloat(totalPaidAmountForCheckAmount).toFixed(2)
          );
        } else {
          totalPaidAmountForCheckAmount =
            Number(parseFloat(totalPaidAmountForCheckAmount).toFixed(2)) +
            Number(parseFloat(paymentVisit.paidAmount).toFixed(2));
        }
      }
    });

    var checkAmount =
      this.checkAmountEntered == false
        ? parseFloat(totalPaidAmountForCheckAmount).toFixed(2)
        : this.state.paymentCheckModel.checkAmount;
    let unAppliedAmount =
      (checkAmount > 0 ? Number(parseFloat(checkAmount).toFixed(2)) : 0) -
      (totalPaidAmountForCheckAmount > 0
        ? Number(parseFloat(totalPaidAmountForCheckAmount).toFixed(2))
        : 0);

    this.checkAmountEntered =
      checkAmount === 0 ? false : this.checkAmountEntered;
    await this.setState({
      paymentCheckModel: {
        ...this.state.paymentCheckModel,
        appliedAmount: parseFloat(totalPaidAmountForCheckAmount).toFixed(2),
        checkAmount: checkAmount,
        unAppliedAmount: parseFloat(unAppliedAmount).toFixed(2),
      },
    });
  }

  //Calaulate Allowed Amount
  async calculateAllowedAmount(paymentVisits, visitIndex) {
    var paymentVisits = [...paymentVisits];
    var allowedAmount = 0;
    await paymentVisits[visitIndex].paymentCharge.map((paymentCharge, i) => {
      allowedAmount = 0;
      if (paymentCharge.copay == undefined || paymentCharge.copay == "") {
        // patRes = Number(patRes) + Number(0);
        allowedAmount =
          Number(parseFloat(allowedAmount).toFixed(2)) + Number(0);
      } else {
        // patRes = Number(patRes) + parseFloat(Number(paymentCharge.copay)).toFixed(2);
        allowedAmount =
          Number(parseFloat(allowedAmount).toFixed(2)) +
          Number(parseFloat(paymentCharge.copay).toFixed(2));
      }
      if (
        paymentCharge.deductableAmount == undefined ||
        paymentCharge.deductableAmount == ""
      ) {
        // patRes = Number(patRes) + Number(0);
        allowedAmount =
          Number(parseFloat(allowedAmount).toFixed(2)) + Number(0);
      } else {
        // patRes = Number(patRes) + Number(paymentCharge.deductableAmount);
        allowedAmount =
          Number(parseFloat(allowedAmount).toFixed(2)) +
          Number(parseFloat(paymentCharge.deductableAmount).toFixed(2));
      }
      if (
        paymentCharge.coinsuranceAmount == undefined ||
        paymentCharge.coinsuranceAmount == ""
      ) {
        // patRes = Number(patRes) +  Number(0);
        allowedAmount =
          Number(parseFloat(allowedAmount).toFixed(2)) + Number(0);
      } else {
        // patRes = Number(patRes) + Number(paymentCharge.coinsuranceAmount);
        allowedAmount =
          Number(parseFloat(allowedAmount).toFixed(2)) +
          Number(parseFloat(paymentCharge.coinsuranceAmount).toFixed(2));
      }
      if (
        paymentCharge.otherPatResp == undefined ||
        paymentCharge.otherPatResp == ""
      ) {
        // patRes = Number(patRes) +  Number(0);
        allowedAmount =
          Number(parseFloat(allowedAmount).toFixed(2)) + Number(0);
      } else {
        // patRes = Number(patRes) + Number(paymentCharge.coinsuranceAmount);
        allowedAmount =
          Number(parseFloat(allowedAmount).toFixed(2)) +
          Number(parseFloat(paymentCharge.otherPatResp).toFixed(2));
      }
      if (
        paymentCharge.paidAmount == undefined ||
        paymentCharge.paidAmount == ""
      ) {
        allowedAmount =
          Number(parseFloat(allowedAmount).toFixed(2)) + Number(0);
      } else {
        allowedAmount =
          Number(parseFloat(allowedAmount).toFixed(2)) +
          Number(parseFloat(paymentCharge.paidAmount).toFixed(2));
      }

      if (paymentVisits[visitIndex].processedAs === "22") {
        paymentCharge.allowedAmount = Number(
          parseFloat(allowedAmount).toFixed(2)
        );
      } else {
        paymentCharge.allowedAmount =
          Number(parseFloat(allowedAmount).toFixed(2)) <= 0
            ? ""
            : Number(parseFloat(allowedAmount).toFixed(2));
      }
    });

    return paymentVisits;
  }

  //Calaulate Total Allowed Amount
  async calculateTotalAllowedAmount(paymentVisits, visitIndex) {
    var allowedAmount = 0;
    await paymentVisits[visitIndex].paymentCharge.map((paymentCharge, i) => {
      if (
        paymentCharge.allowedAmount == undefined ||
        paymentCharge.allowedAmount == "" ||
        paymentCharge.allowedAmount == null
      ) {
        // patRes = Number(patRes) + Number(0);
        allowedAmount =
          Number(parseFloat(allowedAmount).toFixed(2)) + Number(0);
      } else {
        // patRes = Number(patRes) + parseFloat(Number(paymentCharge.copay)).toFixed(2);
        allowedAmount =
          Number(parseFloat(allowedAmount).toFixed(2)) +
          Number(parseFloat(paymentCharge.allowedAmount).toFixed(2));
      }
    });
    return allowedAmount;
  }

  //Calculate Patient Resposibility
  async calculatePateintRes(paymentVisits, visitIndex) {
    var paymentVisits = [...paymentVisits];
    var patRes = 0;

    await paymentVisits[visitIndex].paymentCharge.map((paymentCharge, i) => {
      //COPAY
      if (paymentCharge.copay == undefined || paymentCharge.copay == "") {
        patRes = Number(parseFloat(patRes).toFixed(2)) + 0;
      } else {
        patRes =
          Number(parseFloat(patRes).toFixed(2)) +
          Number(parseFloat(paymentCharge.copay).toFixed(2));
      }
      // CO Insurance
      if (
        paymentCharge.coinsuranceAmount == undefined ||
        paymentCharge.coinsuranceAmount == ""
      ) {
        patRes = Number(parseFloat(patRes).toFixed(2)) + 0;
      } else {
        patRes =
          Number(parseFloat(patRes).toFixed(2)) +
          Number(parseFloat(paymentCharge.coinsuranceAmount).toFixed(2));
      }
      //Deductable Amount
      if (
        paymentCharge.deductableAmount == undefined ||
        paymentCharge.deductableAmount == ""
      ) {
        patRes = Number(parseFloat(patRes).toFixed(2)) + 0;
      } else {
        patRes =
          Number(parseFloat(patRes).toFixed(2)) +
          Number(parseFloat(paymentCharge.deductableAmount).toFixed(2));
      }
      //Other Patient Resposibility Amount
      if (
        paymentCharge.otherPatResp == undefined ||
        paymentCharge.otherPatResp == ""
      ) {
        patRes = Number(parseFloat(patRes).toFixed(2)) + 0;
      } else {
        patRes =
          Number(parseFloat(patRes).toFixed(2)) +
          Number(parseFloat(paymentCharge.otherPatResp).toFixed(2));
      }
    });

    return patRes;
  }

  //Calculate Patient Resposibility in Charge
  async calculatePateintResInCharge(paymentVisits, visitIndex) {
    var paymentVisits = [...paymentVisits];
    var patRes = 0;

    await paymentVisits[visitIndex].paymentCharge.map((paymentCharge, i) => {
      patRes = 0;
      //COPAY
      if (paymentCharge.copay == undefined || paymentCharge.copay == "") {
        patRes = Number(parseFloat(patRes).toFixed(2)) + 0;
      } else {
        patRes =
          Number(parseFloat(patRes).toFixed(2)) +
          Number(parseFloat(paymentCharge.copay).toFixed(2));
      }
      //Deductable Amount
      if (
        paymentCharge.deductableAmount == undefined ||
        paymentCharge.deductableAmount == ""
      ) {
        patRes = Number(parseFloat(patRes).toFixed(2)) + 0;
      } else {
        patRes =
          Number(parseFloat(patRes).toFixed(2)) +
          Number(parseFloat(paymentCharge.deductableAmount).toFixed(3));
      }
      // CO Insurance
      if (
        paymentCharge.coinsuranceAmount == undefined ||
        paymentCharge.coinsuranceAmount == ""
      ) {
        patRes = Number(parseFloat(patRes).toFixed(2)) + 0;
      } else {
        patRes =
          Number(parseFloat(patRes).toFixed(2)) +
          Number(parseFloat(paymentCharge.coinsuranceAmount).toFixed(2));
      }

      if (paymentVisits[visitIndex].processedAs === "22") {
        paymentCharge.patientAmount = Number(parseFloat(patRes).toFixed(2));
      } else {
        paymentCharge.patientAmount =
          Number(parseFloat(patRes).toFixed(2)) <= 0
            ? ""
            : Number(parseFloat(patRes).toFixed(2));
      }
    });

    return paymentVisits;
  }

  //find Submitted Visits
  findSubmittedVisits = async (index) => {
    try {
      this.setState({ loading: true });
      var paymentVisit = {
        ...this.state.paymentCheckModel.paymentVisit[index],
      };
      if (paymentVisit.isVisitIDnull === true) {
        paymentVisit.paymentCharge = paymentVisit.paymentCharge;
      } else {
        paymentVisit.paymentCharge = [];
      }

      var billedAmount = 0;

      await axios
        .post(
          this.visitUrl + "FindSubmittedCharge/",
          {
            visitID: this.state.paymentCheckModel.paymentVisit[index].visitID,
            processedAs: this.state.paymentCheckModel.paymentVisit[index]
              .processedAs,
          },
          this.config
        )
        .then(async (response) => {
          let matched = false;
          let billedAmount = 0;
          await response.data.map(async (charge) => {
            console.log("Billd Amount :", billedAmount, charge.billedAmount);
            billedAmount =
              Number(parseFloat(billedAmount).toFixed(2)) +
              Number(parseFloat(charge.billedAmount).toFixed(2));
            var paymentChargeModel = { ...this.paymentChargeModel };
            if (paymentVisit.isVisitIDnull === true) {
              await paymentVisit.paymentCharge.map((oldCharge, i) => {
                try {
                  if (
                    charge.cptCode === oldCharge.cptCode &&
                    charge.billedAmount === oldCharge.billedAmount &&
                    moment(charge.dosFrom).format().slice(0, 10) ===
                      moment(oldCharge.dosFrom).format().slice(0, 10)
                  ) {
                    matched = true;
                    oldCharge.chargeID = charge.chargeID;
                    paymentVisit.patientID = response.data[0].patientID;
                    paymentVisit.patientName = response.data[0].patientName;
                  }
                } catch {}
              });
            } else {
              paymentChargeModel.chargeID = charge.chargeID;
              paymentChargeModel.dosFrom = charge.dosFrom
                ? moment(charge.dosFrom).format()
                : "";
              paymentChargeModel.cptCode = charge.cptCode;
              paymentChargeModel.billedAmount = Number(
                charge.billedAmount
              ).toFixed(2);
              paymentVisit.paymentCharge.push(paymentChargeModel);

              //billed amount in payment visit
              // billedAmount += parseFloat(charge.billedAmount);
              paymentVisit.patientID = response.data[0].patientID;
              paymentVisit.patientName = response.data[0].patientName;
            }
          });

          if (paymentVisit.isVisitIDnull === true && matched === false) {
            Swal.fire("'CPT, DOS doesn't match", "", "error");
          }
          if (paymentVisit.isVisitIDnull === false) {
            paymentVisit.paidAmount = "";
            paymentVisit.allowedAmount = "";
            paymentVisit.patientAmount = "";
            paymentVisit.writeOffAmount = "";
            paymentVisit.claimNumber = "";
          }
          paymentVisit.billedAmount = parseFloat(billedAmount).toFixed(2);

          this.setState({
            loading: false,
            paymentCheckModel: {
              ...this.state.paymentCheckModel,
              paymentVisit: [
                ...this.state.paymentCheckModel.paymentVisit.slice(0, index),
                Object.assign(
                  {},
                  this.state.paymentCheckModel.paymentVisit[index],
                  paymentVisit
                ),
                ...this.state.paymentCheckModel.paymentVisit.slice(index + 1),
              ],
            },
          });
        })
        .catch((error) => {
          paymentVisit.patientID = null;
          paymentVisit.patientName = "";
          this.setState({
            loading: false,
            paymentCheckModel: {
              ...this.state.paymentCheckModel,
              paymentVisit: [
                ...this.state.paymentCheckModel.paymentVisit.slice(0, index),
                Object.assign(
                  {},
                  this.state.paymentCheckModel.paymentVisit[index],
                  paymentVisit
                ),
                ...this.state.paymentCheckModel.paymentVisit.slice(index + 1),
              ],
            },
          });
          if (error.response) {
            if (error.response.data) {
              Swal.fire("ERROR!", error.response.data, "error");
            }
          }
        });
    } catch {
      this.setState({ loading: true });
    }
  };

  //Enter Kay handler to get Visit
  async handleEnterKey(event, index) {
    if (event.charCode == 13) {
      this.findSubmittedVisits(index);
    }
  }

  //Adjusment Code Change in payment charge
  async handleAdjCodeChange(
    adjCodeObj,
    id,
    adjObj,
    visitIndex,
    chargeIndex,
    type
  ) {
    var paymentVisits = [...this.state.paymentCheckModel.paymentVisit];
    if (adjCodeObj == null) {
      paymentVisits[visitIndex].paymentCharge[chargeIndex][id] = null;
      paymentVisits[visitIndex].paymentCharge[chargeIndex][adjObj] = {};
      paymentVisits[visitIndex].paymentCharge[chargeIndex][type] = "";
    } else {
      paymentVisits[visitIndex].paymentCharge[chargeIndex][id] = adjCodeObj.id;
      paymentVisits[visitIndex].paymentCharge[chargeIndex][adjObj] = adjCodeObj;
      paymentVisits[visitIndex].paymentCharge[chargeIndex][type] =
        adjCodeObj.category;
    }
    var patRes = 0;
    var allowedAmount = 0;
    var totalWriteOffAmount = 0;
    var paidAmount = 0;
    var totalPaidAmount = 0;
    var totalAllowedAmount = 0;

    //Patient Responsibility
    patRes = await this.calculatePateintRes(paymentVisits, visitIndex);

    //Patient Responibility in Payment Charge
    paymentVisits = await this.calculatePateintResInCharge(
      paymentVisits,
      visitIndex
    );

    //WriteOff Amount
    paymentVisits = await this.calculateWriteOffAmount(
      paymentVisits,
      visitIndex
    );

    //Total Paid Amount
    paidAmount = await this.calculatePaidAmount(paymentVisits, visitIndex);

    //Total WriteOff Amount
    totalWriteOffAmount = await this.calculateTotalWriteOffAmount(
      paymentVisits,
      visitIndex
    );

    //Allowed Amount
    paymentVisits = await this.calculateAllowedAmount(
      paymentVisits,
      visitIndex
    );

    //Total Allowed Amount
    totalAllowedAmount = await this.calculateTotalAllowedAmount(
      paymentVisits,
      visitIndex
    );

    paymentVisits[visitIndex].patientAmount =
      parseFloat(Number(patRes)).toFixed(2) <= 0
        ? ""
        : parseFloat(Number(patRes)).toFixed(2);
    paymentVisits[visitIndex].paidAmount =
      parseFloat(Number(paidAmount)).toFixed(2) <= 0
        ? ""
        : parseFloat(Number(paidAmount)).toFixed(2);
    paymentVisits[visitIndex].writeOffAmount =
      parseFloat(Number(totalWriteOffAmount)).toFixed(2) <= 0
        ? ""
        : parseFloat(Number(totalWriteOffAmount)).toFixed(2);
    paymentVisits[visitIndex].allowedAmount =
      parseFloat(totalAllowedAmount).toFixed(2) <= 0
        ? ""
        : parseFloat(totalAllowedAmount).toFixed(2);

    await this.setState({
      paymentCheckModel: {
        ...this.state.paymentCheckModel,
        paymentVisit: paymentVisits,
        // appliedAmount : totalPaidAmount
      },
    });

    //Total Paid Amount
    await this.calculateTotalPaidAmount(paymentVisits, visitIndex);
  }

  handleBatchChange(event) {
    const eventValue = event.target.value;
    const eventName = event.target.name;
    var valueOfPage;

    if (event.target.name == "pageNumber") {
      valueOfPage = this.state.paymentCheckModel.batchDocumentID
        ? this.state.paymentCheckModel.batchDocumentID
        : "";

      var myVal = {...this.validationModel};
      axios
        .get(
          this.batchURL + "FindBatchDocumentPath/" + valueOfPage,
          this.config
        )
        .then((response) => {
          myVal.batchDocumentIDValField = "";
          myVal.responsepagesValField = (
            <span style={{ color: "green" }}>
              Number of Pages: {response.data.numberOfPages}
            </span>
          );
          this.setState({
            pageNumber: response.data.numberOfPages,
            fileURL: response.data.documentFilePath,
            validationModel: myVal,
          });
          return;
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 404) {
                console.log("Not Found");
                var myVal = {...this.validationModel};

                myVal.batchDocumentIDValField = (
                  <span>
                    Invalid Batch #{" "}
                    {this.state.paymentCheckModel.batchDocumentID}
                  </span>
                );
                myVal.responsepagesValField = "";
                this.setState({ validationModel: myVal });
                return;
              } else if (error.response.status == 400) {
                console.log("Not Found");
                var myVal = {...this.validationModel};

                myVal.batchDocumentIDValField = (
                  <span>
                    Invalid Batch #{" "}
                    {this.state.paymentCheckModel.batchDocumentID}
                  </span>
                );
                myVal.responsepagesValField = "";
                this.setState({ validationModel: myVal });
                return;
              }
            }
          }
        });
    }

    if (this.isNull(eventValue)) {
      var myVal = {...this.validationModel};
      myVal.responsepagesValField = "";
      myVal.batchDocumentIDValField = "";
      myVal.pageNumberValField = "";

      this.setState({ validationModel: myVal });
    }

    this.setState({
      paymentCheckModel: {
        ...this.state.paymentCheckModel,
        [eventName]: eventValue.trim(),
      },
      batchDocumentID: eventName == "batchDocumentID" ? eventValue : null,
    });

    if (this.isNull(this.state.paymentCheckModel.batchDocumentID)) {
      var myVal = {...this.validationModel};
      myVal.responsepagesValField = "";
    }
  }

  handleBatchCheck = (event) => {
    var eventValue = event.target.value;
    if (event.target.name == "pageNumber") {
      eventValue = this.state.paymentCheckModel.batchDocumentID;
    } else {
      eventValue = eventValue;
    }
    var myVal = {...this.validationModel};
    axios
      .get(this.batchURL + "FindBatchDocumentPath/" + eventValue, this.config)
      .then((response) => {
        myVal.batchDocumentIDValField = "";
        myVal.responsepagesValField = (
          <span style={{ color: "green" }}>
            Number of Pages: {response.data.numberOfPages}
          </span>
        );
        this.setState({
          pageNumber: response.data.numberOfPages,
          fileURL: response.data.documentFilePath,
          validationModel: myVal,
        });
        return;
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status) {
            if (error.response.status == 404) {
              console.log("Not Found");
              var myVal = {...this.validationModel};

              myVal.batchDocumentIDValField = (
                <span>
                  Invalid Batch # {this.state.paymentCheckModel.batchDocumentID}
                </span>
              );
              myVal.responsepagesValField = "";
              this.setState({ validationModel: myVal });
              return;
            } else if (error.response.status == 400) {
              console.log("Not Found");
              var myVal = {...this.validationModel};

              myVal.batchDocumentIDValField = (
                <span>
                  Invalid Batch # {this.state.paymentCheckModel.batchDocumentID}
                </span>
              );
              myVal.responsepagesValField = "";
              this.setState({ validationModel: myVal });
              return;
            }
          }
        }
      });
  };

  //Remark Code Change in payment charge
  handleRemarkCodeChange = (
    remarkCodeObj,
    id,
    remarkObj,
    visitIndex,
    chargeIndex
  ) => {
    if (remarkCodeObj) {
      var paymentCheck = { ...this.state.paymentCheckModel };
      paymentCheck.paymentVisit[visitIndex].paymentCharge[chargeIndex][id] =
        remarkCodeObj.id;
      paymentCheck.paymentVisit[visitIndex].paymentCharge[chargeIndex][
        remarkObj
      ] = remarkCodeObj;
      this.setState({
        paymentCheckModel: paymentCheck,
      });
    } else if (remarkCodeObj == null) {
      var paymentCheck = { ...this.state.paymentCheckModel };
      paymentCheck.paymentVisit[visitIndex].paymentCharge[chargeIndex][
        id
      ] = null;
      paymentCheck.paymentVisit[visitIndex].paymentCharge[chargeIndex][
        remarkObj
      ] = {};
      this.setState({
        paymentCheckModel: paymentCheck,
      });
    }
  };

  //check is null
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

  //SAVE Payment Check
  async saveManualPosting(e) {
    if (this.saveManualPostingCount == 1) {
      return;
    }
    this.saveManualPostingCount = 1;
    e.preventDefault();
    // this.setState({ loading: true });

    await this.setState({ loading: true });
    //PAYMENT VISIT VALIDATIONS
    var myVal = {...this.validationModel};
    myVal.validation = false;

    //Batch number Validatoin
    if (this.isNull(this.state.paymentCheckModel.batchDocumentID) == false) {
      if (this.isNull(this.state.paymentCheckModel.pageNumber)) {
        myVal.pageNumberValField = (
          <span className="" style={{ textAlign: "initial" }}>
            Enter Valid Page #
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.pageNumberValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    }
    //Batch number Validatoin
    if (this.isNull(this.state.paymentCheckModel.batchDocumentID) == false) {
      axios
        .get(
          this.batchURL +
            "FindBatchDocumentPath/" +
            this.state.paymentCheckModel.batchDocumentID,
          this.config
        )
        .then((response) => {
          myVal.batchDocumentIDValField = "";
          myVal.responsepagesValField = (
            <span style={{ color: "green" }}>
              Number of Pages: {response.data.numberOfPages}
            </span>
          );
          this.setState({
            pageNumber: response.data.numberOfPages,
            fileURL: response.data.documentFilePath,
            validationModel: myVal,
          });
          return;
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 404) {
                console.log("Not Found");
                var myVal = {...this.validationModel};

                myVal.batchDocumentIDValField = (
                  <span
                    className=""
                    style={{ marginLeft: "-50%" }}
                  >
                    Invalid Batch #{" "}
                    {this.state.paymentCheckModel.batchDocumentID}
                  </span>
                );
                myVal.responsepagesValField = "";
                this.setState({ validationModel: myVal });
                return;
              } else if (error.response.status == 404) {
                console.log("Not Found");
                var myVal = {...this.validationModel};

                myVal.batchDocumentIDValField = (
                  <span
                    className=""
                    style={{ marginLeft: "-50%" }}
                  >
                    Invalid Batch #{" "}
                    {this.state.paymentCheckModel.batchDocumentID}
                  </span>
                );
                myVal.responsepagesValField = "";
                this.setState({ validationModel: myVal });
                return;
              }
            }
          }
        });
    }

    //paymtn visit practice  validation
    if (this.isNull(this.state.paymentCheckModel.practiceID)) {
      myVal.practiceValField = (
        <span className="">Select Practice</span>
      );
      myVal.validation = true;
    } else {
      myVal.practiceValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //Payment visit payer  validation
    if (this.isNull(this.state.paymentCheckModel.payerName)) {
      myVal.payerNameValField = (
        <span className="">Enter Payer Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.payerNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //Paymetn visit receiver  validation
    // if (this.isNull(this.state.paymentCheckModel.receiverID)) {
    //     console.log("Receiver Validation")
    //     myVal.receiverValField = <span className="">Select Receiver</span>;
    //     myVal.validation = true;
    // } else {
    //     myVal.receiverValField = "";
    //     if (myVal.validation === false) myVal.validation = false;
    // }

    //Paymetn visit check number  validation
    if (this.isNull(this.state.paymentCheckModel.checkNumber)) {
      myVal.checkNumberValField = (
        <span className="">Enter Check Number</span>
      );
      myVal.validation = true;
    } else {
      myVal.checkNumberValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }
    //Payment visit check date   validation
    if (this.isNull(this.state.paymentCheckModel.checkDate)) {
      myVal.checkDateValField = (
        <span className="">Enter Check Date</span>
      );
      myVal.validation = true;
    } else {
      myVal.checkDateValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //Payment visit  check date  validation
    if (this.isNull(this.state.paymentCheckModel.checkDate) == false) {
      await this.state.paymentCheckModel.paymentVisit.map(
        async (paymentVisit) => {
          await paymentVisit.paymentCharge.map(async (charge) => {
            if (
              new Date(moment(charge.dosFrom).format().slice(0, 10)).getTime() >
              new Date(
                moment(this.state.paymentCheckModel.checkDate)
                  .format()
                  .slice(0, 10)
              ).getTime()
            ) {
              myVal.checkDateFDValField = (
                <span className="">
                  Check date must be greater than DOS
                </span>
              );
              myVal.validation = true;
            } else {
              myVal.checkDateFDValField = null;
              if (myVal.validation == false) myVal.validation = false;
            }
          });
        }
      );
    }

    //Paymetn check amount  validation
    if (this.isNull(this.state.paymentCheckModel.checkAmount)) {
      myVal.checkAmountValField = (
        <span className="">Enter Check Amount</span>
      );
      myVal.validation = true;
    } else {
      myVal.checkAmountValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.paymentCheckModel.pageNumber) == false) {
      var listOfNum, matchComme, matchDash, singleNum;
      var pageNumber = this.state.paymentCheckModel.pageNumber;
      matchComme = pageNumber.indexOf(",");
      matchDash = pageNumber.indexOf("-");
      if (matchComme > 0) {
        listOfNum = pageNumber.split(",");
      } else if (matchDash > 0) {
        listOfNum = pageNumber.split("-");
        console.log(listOfNum);
      } else {
        singleNum = pageNumber;
      }

      if (singleNum) {
        for (var i = 0; i < singleNum.length; i++) {
          if (singleNum > this.state.pageNumber) {
            myVal.pageNumberValField = (
              <span className="" style={{ textAlign: "initial" }}>
                Invalid Page # {singleNum}
              </span>
            );
            myVal.validation = true;
            // break;
          } else {
            myVal.pageNumberValField = "";
            if (myVal.validation === false) myVal.validation = false;
          }
        }
      }

      if (listOfNum) {
        for (var i = 0; i < listOfNum.length; i++) {
          if (listOfNum[i] > this.state.pageNumber) {
            myVal.pageNumberValField = (
              <span className="" style={{ textAlign: "initial" }}>
                Invalid Page # {listOfNum[i]}
              </span>
            );
            myVal.validation = true;
            // break;
          } else {
            myVal.pageNumberValField = "";
            if (myVal.validation === false) myVal.validation = false;
          }
        }
      }
    }
    //Payment check validations set state
    this.setState({
      validationModel: myVal,
    });

    //If validation field is true then return
    if (myVal.validation === true) {
      this.setState({ loading: false });
      Swal.fire(
        "SOMETHING WRONG",
        "Please Select All Fields Properly",
        "error"
      );
      this.saveManualPostingCount = 0;
      return;
    }

    //Atlest 1 visit in payment check error message
    if (this.state.paymentCheckModel.paymentVisit.length <= 0) {
      this.setState({ loading: false });
      Swal.fire("SOMETHING WRONG", "Please Enter Atleat 1 Visit", "error");
      this.saveManualPostingCount = 0;
      return;
    }

    //Atleast 1 charge in each  visit error message
    var paymentVisits = [...this.state.paymentCheckModel.paymentVisit];
    var chargeCountValidation = false;
    var visitValdation = false;
    await paymentVisits.map(async (paymentVisit, index) => {
      if (paymentVisit.paymentCharge.length <= 0) {
        chargeCountValidation = true;
      }

      if (this.isNull(paymentVisit.visitID)) {
        visitValdation = true;
        paymentVisit.visitValField = <span>Enter Visit Number</span>;
      } else {
        paymentVisit.visitValField = "";
      }
    });

    if (chargeCountValidation == true) {
      this.setState({ loading: false });
      Swal.fire(
        "SOMETHING WRONG",
        "Please Enter Atleat 1 Charge in Each Visit",
        "error"
      );
      this.saveManualPostingCount = 0;
      return;
    }

    if (visitValdation == true) {
      this.setState({
        loading: false,
        paymentCheckModel: {
          ...this.state.paymentCheckModel,
          paymentVisits: paymentVisits,
        },
      });
      Swal.fire("SOMETHING WRONG", "Enter Visit Number", "error");
      this.saveManualPostingCount = 0;
      return;
    }

    //PAYMENT CHARGE VALIDATIONS
    var billedAmountValidationCount = 0;
    var adjSeqValidation = false;
    await paymentVisits.map((paymentVisit, i) => {
      var totalWriteOff = 0;
      paymentVisit.paymentCharge.map((paymentCharge, j) => {
        if (
          Number(paymentCharge.allowedAmount) <= 0 &&
          Number(paymentCharge.paidAmount) <= 0 &&
          Number(paymentCharge.writeoffAmount) <= 0
        ) {
        } else {
          totalWriteOff = 0;
          if (
            paymentCharge.adjustmentAmount1 == undefined ||
            paymentCharge.adjustmentAmount1 == ""
          ) {
            totalWriteOff += 0;
          } else {
            totalWriteOff += Number(
              parseFloat(paymentCharge.adjustmentAmount1).toFixed(2)
            );
          }
          if (
            paymentCharge.adjustmentAmount2 == undefined ||
            paymentCharge.adjustmentAmount2 == ""
          ) {
            totalWriteOff += 0;
          } else {
            totalWriteOff += Number(
              parseFloat(paymentCharge.adjustmentAmount2).toFixed(2)
            );
          }
          if (
            paymentCharge.adjustmentAmount3 == undefined ||
            paymentCharge.adjustmentAmount3 == ""
          ) {
            totalWriteOff += 0;
          } else {
            totalWriteOff += parseFloat(
              paymentCharge.adjustmentAmount3
            ).toFixed(2);
          }

          //Billed Amount Validation
          var copay = 0;
          var coIns = 0;
          var deduct = 0;
          var otherPatRes = 0;
          var paid = 0;
          var adjAmount = 0;

          if (paymentCharge.copay == undefined || paymentCharge.copay == "") {
            copay += 0;
          } else {
            copay += Number(parseFloat(paymentCharge.copay).toFixed(2));
          }
          if (
            paymentCharge.deductableAmount == undefined ||
            paymentCharge.deductableAmount == ""
          ) {
            deduct += 0;
          } else {
            deduct += Number(
              parseFloat(paymentCharge.deductableAmount).toFixed(2)
            );
          }
          if (
            paymentCharge.coinsuranceAmount == undefined ||
            paymentCharge.coinsuranceAmount == ""
          ) {
            coIns += 0;
          } else {
            coIns += Number(
              parseFloat(paymentCharge.coinsuranceAmount).toFixed(2)
            );
          }
          if (
            paymentCharge.otherPatResp == undefined ||
            paymentCharge.otherPatResp == ""
          ) {
            otherPatRes += 0;
          } else {
            otherPatRes += Number(
              parseFloat(paymentCharge.otherPatResp).toFixed(2)
            );
          }
          if (
            paymentCharge.paidAmount == undefined ||
            paymentCharge.paidAmount == ""
          ) {
            paid += 0;
          } else {
            paid += Number(parseFloat(paymentCharge.paidAmount).toFixed(2));
          }
          if (this.isNull(paymentCharge.type1) == false) {
            adjAmount =
              Number(parseFloat(adjAmount).toFixed(2)) +
              Number(parseFloat(paymentCharge.adjustmentAmount1).toFixed(2));
          } else {
            adjAmount = Number(parseFloat(adjAmount).toFixed(2)) + 0;
          }
          if (this.isNull(paymentCharge.type2) == false) {
            adjAmount =
              Number(parseFloat(adjAmount).toFixed(2)) +
              Number(parseFloat(paymentCharge.adjustmentAmount2).toFixed(2));
          } else {
            adjAmount = Number(parseFloat(adjAmount).toFixed(2)) + 0;
          }
          if (this.isNull(paymentCharge.type3) == false) {
            adjAmount =
              Number(parseFloat(adjAmount).toFixed(2)) +
              Number(parseFloat(paymentCharge.adjustmentAmount3).toFixed(2));
          } else {
            adjAmount = Number(parseFloat(adjAmount).toFixed(2)) + 0;
          }

          var totalAmt =
            paid + copay + coIns + deduct + otherPatRes + adjAmount;
          console.log(
            "paid , copay , coIns , deduct , otherPatRes , adjAmount  : ",
            paid,
            copay,
            coIns,
            deduct,
            otherPatRes,
            adjAmount
          );
          if (
            totalAmt.toFixed(2) !=
            Number(parseFloat(paymentCharge.billedAmount).toFixed(2))
          ) {
            paymentCharge.billedAmountValField = (
              <span className="">
                Billed AMT is not properly adjusted
              </span>
            );
            billedAmountValidationCount += 1;
          } else {
            paymentCharge.billedAmountValField = "";
          }
        }
      });
    });

    await this.setState({
      paymentCheckModel: {
        ...this.state.paymentCheckModel,
        paymentVisit: paymentVisits,
      },
    });

    var totalPaidAmount = 0;
    await paymentVisits.map((paymentVisit, i) => {
      totalPaidAmount =
        Number(parseFloat(totalPaidAmount).toFixed(2)) +
        Number(parseFloat(paymentVisit.paidAmount).toFixed(2));
    });

    console.log(
      "Totla Paid Amount , Check Amount : ",
      totalPaidAmount,
      this.state.paymentCheckModel.checkAmount
    );

    //Removed Rule(Paid Amount = Check Amount)
    if (
      parseFloat(this.state.paymentCheckModel.checkAmount).toFixed(2) >=
      parseFloat(totalPaidAmount).toFixed(2)
    ) {
    } else {
      this.setState({ loading: false });
      Swal.fire(
        "Check Amounts Must be Greater then Or EqualsTo Paid Amount ",
        "",
        "error"
      );
      this.saveManualPostingCount = 0;
      return;
    }

    if (billedAmountValidationCount > 0) {
      this.setState({ loading: false });
      Swal.fire("Billed AMT is not properly adjusted", "", "error");
      this.saveManualPostingCount = 0;
      return;
    }

    if (adjSeqValidation == true) {
      this.setState({ loading: false });
      Swal.fire("Please Enter Fields in Sequence", "", "error");
      this.saveManualPostingCount = 0;
      return;
    }

    axios
      .post(
        this.url + "SavePaymentCheck",
        this.state.paymentCheckModel,
        this.config
      )
      .then(async (response) => {
        this.saveManualPostingCount = 0;
        // this.setState({
        //   paymentCheckModel: response.data,
        //   loading: false,
        //   editId: response.data.id,
        // });

        let obj = [];
        obj.push(response.data.id);
        this.checkPostModel.ids = obj;

        var paymentCheck = { ...response.data };

        let patRes = 0;
        await paymentCheck.paymentVisit.map(
          async (paymentVisit, visitIndex) => {
            patRes = 0;
            paymentVisit.billedAmount = 0;
            await paymentVisit.paymentCharge.map(async (paymentCharge, i) => {
              paymentVisit.billedAmount =
                Number(parseFloat(paymentVisit.billedAmount).toFixed(2)) +
                Number(parseFloat(paymentCharge.billedAmount).toFixed(2));

              if (!paymentCharge.copay) {
                patRes += 0;
              } else {
                patRes += Number(parseFloat(paymentCharge.copay).toFixed(2));
              }

              if (!paymentCharge.deductableAmount) {
                patRes += 0;
              } else {
                patRes += Number(
                  parseFloat(paymentCharge.deductableAmount).toFixed(2)
                );
              }

              if (!paymentCharge.coinsuranceAmount) {
                patRes += 0;
              } else {
                patRes += Number(
                  parseFloat(paymentCharge.coinsuranceAmount).toFixed(2)
                );
              }

              //Other Patient Resposibility Amount
              if (!paymentCharge.otherPatResp) {
                patRes += 0;
              } else {
                patRes += Number(
                  parseFloat(paymentCharge.otherPatResp).toFixed(2)
                );
              }

              var adjCodeObj1 = null;
              adjCodeObj1 = await this.props.adjustmentCodes.filter(
                (option) => option.id == paymentCharge.adjustmentCodeID1
              );
              paymentCharge.adjustmentCodeObj1 =
                adjCodeObj1.length > 0 ? adjCodeObj1[0] : null;
              // paymentCharge.adjustmentAmount1 = adjCodeObj1[0].description2;
              paymentCharge.type1 =
                adjCodeObj1.length > 0 ? adjCodeObj1[0].category : null;

              var adjCodeObj2 = {};
              adjCodeObj2 = await this.props.adjustmentCodes.filter(
                (option) => option.id == paymentCharge.adjustmentCodeID2
              );
              paymentCharge.adjustmentCodeObj2 =
                adjCodeObj2.length > 0 ? adjCodeObj2[0] : null;
              // paymentCharge.adjustmentAmount2 = adjCodeObj2[0].description2;
              paymentCharge.type2 =
                adjCodeObj2.length > 0 ? adjCodeObj2[0].category : null;

              var adjCodeObj3 = {};
              adjCodeObj3 = await this.props.adjustmentCodes.filter(
                (option) => option.id == paymentCharge.adjustmentCodeID3
              );
              paymentCharge.adjustmentCodeObj3 =
                adjCodeObj3.length > 0 ? adjCodeObj3[0] : null;
              // paymentCharge.adjustmentAmount3 = adjCodeObj3[0].description2;
              paymentCharge.type3 =
                adjCodeObj3.length > 0 ? adjCodeObj3[0].category : null;

              var remarkCodeObj1 = {};
              remarkCodeObj1 = await this.props.remarkCodes.filter(
                (option) => option.id == paymentCharge.remarkCodeID1
              );
              paymentCharge.remarkCodeObj1 =
                remarkCodeObj1.length > 0 ? remarkCodeObj1[0] : null;

              var remarkCodeObj2 = {};
              remarkCodeObj2 = await this.props.remarkCodes.filter(
                (option) => option.id == paymentCharge.remarkCodeID2
              );
              paymentCharge.remarkCodeObj2 =
                remarkCodeObj2.length > 0 ? remarkCodeObj2[0] : null;

              var remarkCodeObj3 = {};
              remarkCodeObj3 = await this.props.remarkCodes.filter(
                (option) => option.id == paymentCharge.remarkCodeID3
              );
              paymentCharge.remarkCodeObj3 =
                remarkCodeObj3.length > 0 ? remarkCodeObj3[0] : null;

              paymentCharge.isChargeIDNull =
                paymentCharge.chargeID == null ? true : false;
            });
            paymentVisit.patientAmount = patRes;
            paymentVisit.isVisitIDnull =
              paymentVisit.visitID === null ? true : false;
          }
        );

        console.log(response.data.id);
        this.setState({
          editId: response.data.id,
          paymentCheckModel: paymentCheck,
          loading: false,
        });

        Swal.fire("Saved Successfully", "", "success").then((sres) => {
          // this.componentWillMount();
        });
      })
      .catch((error) => {
        this.saveManualPostingCount = 0;
        this.setState({ loading: false });
        var val = this.state.validationModel;
        val.validation = false;

        try {
          if (error.response) {
            if (error.response.data) {
              if (
                error.response.data ==
                "Already Exists Please Enter unique CheckNumber"
              ) {
                val.checkNumberValField = (
                  <span className="">
                    CheckNumber Already Exists
                  </span>
                );
                this.setState({
                  validationModel: val,
                });
                Swal.fire(
                  "CheckNumber Already Exists",
                  "Please Enter Unique Check Number",
                  "error"
                );
              }
            }
          } else {
            Swal.fire("SOMETHING WRONG", "Internal Server Error", "error");
          }
        } catch {
          Swal.fire("SOMETHING WRONG", "Internal Server Error", "error");
        }
      });
  }

  postCheck = async (e) => {
    this.setState({ loading: true });
    var visitNotSavedCount = 0;
    await this.state.paymentCheckModel.paymentVisit.map((paymentVisit) => {
      if (paymentVisit.id <= 0) {
        visitNotSavedCount += 1;
      }
    });

    if (visitNotSavedCount > 0) {
      Swal.fire("Save the payments First!", "", "warning");
      this.setState({ loading: false });
      return;
    }

    await axios
      .post(this.url + "PostEra", this.checkPostModel, this.config)
      .then(async (response) => {
        await this.setState({ editId: response.data.id });
        await this.componentWillMount();
        Swal.fire("Check(s) Posted Successfully", "", "success");
      })
      .catch((error) => {
        this.setState({ loading: false });
        Swal.fire("Check(s) Posted Failed - Contact BellMedEx", "", "warning");
      });
  };

  //delete Payment Check
  deleteCheck = (e) => {
    e.preventDefault();
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
          .delete(
            this.url + "DeletePaymentCheck/" + this.state.paymentCheckModel.id,
            this.config
          )
          .then((response) => {
            this.setState({ loading: false });
            Swal.fire("Record Deleted Successfully", "", "success").then(
              (swalResponse) => {
                this.props.selectTabAction("Payments");
                this.props.history.push("/Payments");
              }
            );
          })
          .catch((error) => {
            this.setState({ loading: false });
            Swal.fire(
              "Record Not Deleted!",
              "Record can not be delete, as it is being referenced in other screens.",
              "error"
            );
          });
      }
    });
  };

  //Add Paymetn check Row
  addPaymentCheckRow() {
    var length = this.state.paymentCheckModel.paymentVisit.length;
    if (length > 0) {
      if (
        this.state.paymentCheckModel.paymentVisit[length - 1].paymentCharge
          .length == 0
      ) {
        Swal.fire("First Enter Record in this Payment Visit", "", "error");
        return;
      }
    }

    var visitModel = { ...this.paymentVisitModel };
    visitModel.visitID = null;

    this.setState({
      paymentCheckModel: {
        ...this.state.paymentCheckModel,
        paymentVisit: this.state.paymentCheckModel.paymentVisit.concat(
          visitModel
        ),
      },
    });
  }

  //delete payment check roe
  deletePaymentCheckRow(event, index) {
    const paymentCheckId = this.state.paymentCheckModel.paymentVisit[index].id;
    const length = this.state.paymentCheckModel.paymentVisit[index]
      .paymentCharge.length;
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
        if (paymentCheckId > 0) {
          axios
            .delete(
              this.paymentVisitUrl + "DeletePaymentVisit/" + paymentCheckId,
              this.config
            )
            .then((response) => {
              Swal.fire("Record Deleted Successfully", "", "success");
              var paymentVisits = [
                ...this.state.paymentCheckModel.paymentVisit,
              ];
              paymentVisits.splice(index, 1);
              this.setState({
                paymentCheckModel: {
                  ...this.state.paymentCheckModel,
                  paymentVisit: paymentVisits,
                },
              });
            })
            .catch((error) => {
              Swal.fire(
                "Record Not Deleted!",
                "Record can not be delete, as it is being referenced in other screens.",
                "error"
              );
            });
        } else {
          Swal.fire("Record Deleted Successfully", "", "success");
          var paymentVisits = [...this.state.paymentCheckModel.paymentVisit];
          paymentVisits.splice(index, 1);
          this.setState({
            paymentCheckModel: {
              ...this.state.paymentCheckModel,
              paymentVisit: paymentVisits,
            },
          });
        }
      }
    });
  }

  //close Manual Psoting
  closeManualPosting() {
    this.props.selectTabAction("Payments");
    this.props.history.push("/Payments");
  }

  //toggle collapse
  async toggleCollapse(collapseID) {
    const collapseIDL = this.state.collapseID != collapseID ? collapseID : 0;
    await this.setState({ collapseID: collapseIDL });
  }

  //Toogle Change
  async toggleCheck(event, visitIndex, chargeIndex) {
    var paymentVisits = [...this.state.paymentCheckModel.paymentVisit];
    paymentVisits[visitIndex].paymentCharge[
      chargeIndex
    ].appliedToSec = !paymentVisits[visitIndex].paymentCharge[chargeIndex]
      .appliedToSec;
    await this.setState({
      paymentCheckModel: {
        ...this.state.paymentCheckModel,
        paymentVisit: paymentVisits,
      },
    });
  }

  //Isdabled
  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  openhistorypopup = (name, id) => {
    this.setState({ popupName: name, id: id });
  };

  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ popupName: "" });
  };

  handleVisitIndexChange = (event, index) => {
    this.visitIndex = index;
    this.openPopup(event, "chargeSearch", -1);
  };

  //Previous Visit
  async previousVisit() {
    if (this.currentIndex - 1 < 0) {
      Swal.fire("No More Checks", "", "warning");
      return;
    }

    this.visitID = 0;
    this.visitIndex = 0;
    this.saveManualPostingCount = 0;
    this.errorField = "errorField";
    this.checkAmountEntered = false;

    this.currentIndex = this.currentIndex - 1;
    var paymentCheck = this.props.paymentGridData[this.currentIndex];
    await this.setState({
      chargesData: [],
      showPopup: false,
      revData: this.props.receivers,
      facData: [],
      adjCodeOptions: this.props.adjustmentCodes,
      remarkOptions: this.props.remarkCodes,
      collapseID: 0,
      loading: false,
      popupName: "",
      id: 0,
      loading: false,
      batchDocumentID: null,
      pageNumber: "",
      editId: paymentCheck.id,
      paymentCheckModel: { ...this.paymentCheckModel },
    });
    this.componentWillMount();
  }

  //NextVisit
  async nextVisit() {
    if (this.currentIndex + 1 >= this.props.paymentGridData.length) {
      Swal.fire("No More Checks", "", "warning");
      return;
    }

    this.visitID = 0;
    this.visitIndex = 0;
    this.saveManualPostingCount = 0;
    this.errorField = "errorField";
    this.checkAmountEntered = false;

    this.currentIndex = this.currentIndex + 1;
    var paymentCheck = { ...this.props.paymentGridData[this.currentIndex] };
    console.log("Payment Check ID : ", paymentCheck.id);
    this.props.selectTabAction("ManualPosting", paymentCheck.id);
    await this.setState({
      chargesData: [],
      showPopup: false,
      revData: this.props.receivers,
      facData: [],
      adjCodeOptions: this.props.adjustmentCodes,
      remarkOptions: this.props.remarkCodes,
      collapseID: 0,
      loading: false,
      popupName: "",
      id: 0,
      loading: false,
      batchDocumentID: null,
      pageNumber: "",
      editId: paymentCheck.id,
      paymentCheckModel: { ...this.paymentCheckModel },
    });
    this.componentWillMount();
  }

  //Handle Numeric check
  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  async getbatchID(batID) {
    $("#myModal").hide();
    await this.setState({
      popupName: "",
      id: 0,
      paymentCheckModel: {
        ...this.state.paymentCheckModel,
        batchDocumentID: batID[0],
      },
    });

    var myVal = {...this.validationModel};
    axios
      .get(
        this.batchURL +
          "FindBatchDocumentPath/" +
          this.state.paymentCheckModel.batchDocumentID,
        this.config
      )
      .then((response) => {
        myVal.batchDocumentIDValField = "";
        myVal.responsepagesValField = (
          <span className="" style={{ color: "green" }}>
            Number of Pages: {response.data.numberOfPages}
          </span>
        );
        this.setState({
          pageNumber: response.data.numberOfPages,
          fileURL: response.data.documentFilePath,
          validationModel: myVal,
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status) {
            if (error.response.status == 404) {
              console.log("Not Found");
              var myVal = {...this.validationModel};

              myVal.batchDocumentIDValField = (
                <span>
                  Invalid Batch # {this.state.paymentCheckModel.batchDocumentID}
                </span>
              );
              myVal.responsepagesValField = "";
              this.setState({ validationModel: myVal });
              return;
            } else if (error.response.status == 404) {
              console.log("Not Found");
              var myVal = {...this.validationModel};

              myVal.batchDocumentIDValField = (
                <span>
                  Invalid Batch # {this.state.paymentCheckModel.batchDocumentID}
                </span>
              );
              myVal.responsepagesValField = "";
              this.setState({ validationModel: myVal });
              return;
            }
          }
        }
      });
  }

  openPage = (event, name, id) => {
    event.preventDefault();
    var pageNumber = this.state.paymentCheckModel.pageNumber;
    var listOfNum, matchComme, matchDash, singleNum, loadPage;
    matchComme = pageNumber.indexOf(",");
    matchDash = pageNumber.indexOf("-");
    if (matchComme > 0) {
      listOfNum = pageNumber.split(",", 1);
    } else if (matchDash > 0) {
      listOfNum = pageNumber.split("-", 1);
    } else {
      singleNum = pageNumber;
    }
    console.log("Entered Page Refine : ", listOfNum);
    if (listOfNum) {
      loadPage = listOfNum;
    } else {
      loadPage = singleNum;
    }
    console.log("Entered Page Refine : ", loadPage);
    this.setState({
      popupName: name,
      pageNumber: loadPage,
    });
  };
  closePage = (name) => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  render() {
    try {
      if (this.props.userInfo.userPractices.length > 0) {
        if (this.state.facData.length == 0) {
          this.setState({
            paymentCheckModel: {
              ...this.state.paymentCheckModel,
              practiceID: this.props.userInfo.practiceID,
            },

            facData: this.props.userInfo.userPractices,
          });
        }

        if (this.isNull(this.state.paymentCheckModel.practiceID) == true) {
          this.setState({
            paymentCheckModel: {
              ...this.state.paymentCheckModel,
              practiceID: this.props.userInfo.practiceID,
            },
          });
        }
      }
    } catch {}

    try {
      this.props.paymentGridData.filter((paymentCheck, index) => {
        if (paymentCheck.id == this.state.editId) {
          this.currentIndex = index;
        }
      });
    } catch {}

    let mainGridRow = [];

    //Group Codes options
    const groupCodes = [
      { value: "", display: "" },
      { value: "CO", display: "" },
      { value: "OA", display: "" },
      { value: "PI", display: "" },
      { value: "PR", display: "" },
    ];

    //Status
    const Status = [
      // { value: "", display: "Select Status" },
      { value: "NR", display: "NOT RELATED" },
      { value: "C", display: "CLOSE" },
      { value: "NP", display: "NEED POSTING" },
      { value: "P", display: "POSTED" },
      { value: "F", display: "FAILED" },
    ];

    //Processed As Dropdown
    const processedAs = [
      { value: "1", description: "PRIMARY" },
      { value: "2", description: "SECONDARY" },
      { value: "3", description: "TERTIARY" },
      { value: "4", description: "DENIED" },
      { value: "19", description: "PRIMARY-FORWARDED TO PAYER(s)" },
      { value: "20", description: "SECONDARY-FORWARDED TO PAYER(s)" },
      { value: "21", description: "TERTIARY-FORWARDED TO PAYER(s)" },
      { value: "22", description: "REVERSAL OF PREVIOUS PAYMENT" },
      { value: "25", description: "PREDETERMINATION" },
    ];

    //Check Date
    var checkDate = this.state.paymentCheckModel.checkDate
      ? this.state.paymentCheckModel.checkDate.slice(0, 10)
      : "";

    //Payment Visit Grid
    this.state.paymentCheckModel.paymentVisit.map((paymentVisit, index) => {
      var backgroundColor =
        paymentVisit.id > 0 && paymentVisit.isVisitIDnull === false
          ? "#ebebe4"
          : "#ffffff";
      let rowData = [];

      //Payment Charge Grid
      paymentVisit.paymentCharge.map((paymentCharge, i) => {
        var dos = paymentCharge.dosFrom ? paymentCharge.dosFrom : "";
        dos = dos
          ? dos.slice(5, 7) + "/" + dos.slice(8, 10) + "/" + dos.slice(0, 4)
          : "";

        //Patient Responsibility
        var patientResposibility = 0;
        if (paymentVisit.processedAs === "22") {
          patientResposibility = Number(
            this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i]
              .allowedAmount -
              this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i]
                .paidAmount
          ).toFixed(2);
        } else {
          patientResposibility =
            this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i]
              .allowedAmount >= 0
              ? Number(
                  this.state.paymentCheckModel.paymentVisit[index]
                    .paymentCharge[i].allowedAmount -
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].paidAmount
                ).toFixed(2)
              : "";
        }

        //Allowed Amount
        var allowedAmount = 0;
        if (paymentVisit.processedAs === "22") {
          allowedAmount = this.state.paymentCheckModel.paymentVisit[index]
            .paymentCharge[i].allowedAmount;
        } else {
          allowedAmount =
            this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i]
              .allowedAmount < 0
              ? ""
              : this.state.paymentCheckModel.paymentVisit[index].paymentCharge[
                  i
                ].allowedAmount;
        }

        //Paid Amount
        var paidAmount = 0;
        if (paymentVisit.processedAs === "22") {
          paidAmount = this.state.paymentCheckModel.paymentVisit[index]
            .paymentCharge[i].paidAmount;
        } else {
          paidAmount =
            this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i]
              .paidAmount < 0
              ? ""
              : this.state.paymentCheckModel.paymentVisit[index].paymentCharge[
                  i
                ].paidAmount;
        }

        //Copay
        var copay = 0;
        if (paymentVisit.processedAs === "22") {
          copay = this.state.paymentCheckModel.paymentVisit[index]
            .paymentCharge[i].copay;
        } else {
          copay =
            this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i]
              .copay < 0
              ? ""
              : this.state.paymentCheckModel.paymentVisit[index].paymentCharge[
                  i
                ].copay;
        }

        //Co Insurance Amount
        var coInsuranceAmount = 0;
        if (paymentVisit.processedAs === "22") {
          coInsuranceAmount = this.state.paymentCheckModel.paymentVisit[index]
            .paymentCharge[i].coinsuranceAmount;
        } else {
          coInsuranceAmount =
            this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i]
              .coinsuranceAmount < 0
              ? ""
              : this.state.paymentCheckModel.paymentVisit[index].paymentCharge[
                  i
                ].coinsuranceAmount;
        }

        //Deductable
        var deductable = 0;
        if (paymentVisit.processedAs === "22") {
          deductable = this.state.paymentCheckModel.paymentVisit[index]
            .paymentCharge[i].deductableAmount;
        } else {
          deductable =
            this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i]
              .deductableAmount < 0
              ? ""
              : this.state.paymentCheckModel.paymentVisit[index].paymentCharge[
                  i
                ].deductableAmount;
        }

        //Other Patient Responsibility
        var otherPatientResponsibility = 0;
        if (paymentVisit.processedAs === "22") {
          otherPatientResponsibility = this.state.paymentCheckModel
            .paymentVisit[index].paymentCharge[i].otherPatResp;
        } else {
          otherPatientResponsibility =
            this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i]
              .otherPatResp < 0
              ? ""
              : this.state.paymentCheckModel.paymentVisit[index].paymentCharge[
                  i
                ].otherPatResp;
        }

        //Writeoff
        var writeoff = 0;
        if (paymentVisit.processedAs === "22") {
          writeoff = paymentCharge.writeoffAmount;
        } else {
          writeoff =
            paymentCharge.writeoffAmount < 0
              ? ""
              : paymentCharge.writeoffAmount;
        }

        //Adjustment Amount1
        let adjustmentAmount1 = 0;
        if (paymentVisit.processedAs === "22") {
          adjustmentAmount1 = paymentCharge.adjustmentAmount1;
        } else {
          adjustmentAmount1 =
            paymentCharge.adjustmentAmount1 < 0
              ? ""
              : paymentCharge.adjustmentAmount1;
        }

        //Adjustment Amount2
        let adjustmentAmount2 = 0;
        if (paymentVisit.processedAs === "22") {
          adjustmentAmount2 = paymentCharge.adjustmentAmount2;
        } else {
          adjustmentAmount2 =
            paymentCharge.adjustmentAmount2 < 0
              ? ""
              : paymentCharge.adjustmentAmount2;
        }

        //Adjustment Amount3
        let adjustmentAmount3 = 0;
        if (paymentVisit.processedAs === "22") {
          adjustmentAmount3 = paymentCharge.adjustmentAmount3;
        } else {
          adjustmentAmount3 =
            paymentCharge.adjustmentAmount3 < 0
              ? ""
              : paymentCharge.adjustmentAmount3;
        }

        rowData.push({
          chargeId: (
            <div style={{ width: "50px" }}>
              <input
                style={{
                  width: " 50px",
                  marginRight: "5px",
                  padding: "7px 5px",
                }}
                type="text"
                max="12"
                disabled={
                  this.state.paymentCheckModel.paymentVisit[index]
                    .paymentCharge[i].isChargeIDNull === true
                    ? false
                    : true
                }
                value={
                  this.state.paymentCheckModel.paymentVisit[index]
                    .paymentCharge[i].chargeID
                }
                name="id"
                id={i}
                onChange={(event) =>
                  this.handlePaymentChargeChange(event, index, i)
                }
              ></input>
            </div>
          ),
          dos: (
            <div>
              <input
                style={{
                  width: " 90px",
                  marginRight: "0px",
                  padding: "7px 5px",
                }}
                type="text"
                max="12"
                disabled
                // value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].dosFrom} name="coPay" id={i}
                value={dos}
                name="coPay"
                id={i}
                onChange={(event) =>
                  this.handlePaymentChargeChange(event, index, i)
                }
              ></input>
            </div>
          ),
          cpt: (
            <div style={{ width: "70px" }}>
              <input
                style={{ width: " 70", marginRight: "0px" }}
                type="text"
                max="12"
                disabled
                value={
                  this.state.paymentCheckModel.paymentVisit[index]
                    .paymentCharge[i].cptCode
                }
                name="cptCode"
                id={i}
                onChange={(event) =>
                  this.handlePaymentChargeChange(event, index, i)
                }
              ></input>
            </div>
          ),
          chargeControlNumber: (
            <div style={{ width: "140px" }}>
              <input
                style={{ width: " 140", marginRight: "0px" }}
                type="text"
                max="12"
                disabled
                value={
                  this.state.paymentCheckModel.paymentVisit[index]
                    .paymentCharge[i].chargeControlNumber
                }
                name="chargeControlNumber"
                id={i}
                onChange={(event) =>
                  this.handlePaymentChargeChange(event, index, i)
                }
              ></input>
            </div>
          ),
          billedAmount: (
            <div style={{ width: "90px" }}>
              <input
                style={{ width: " 90px", marginRight: "0px" }}
                type="text"
                max="12"
                disabled
                value={
                  this.state.paymentCheckModel.paymentVisit[index]
                    .paymentCharge[i].billedAmount
                }
                name="billedAmount"
                id={i}
                onChange={(event) =>
                  this.handlePaymentChargeChange(event, index, i)
                }
              ></input>
              <div class="invalid-feedback" style={{paddingLeft:"0px" , whiteSpace:"break-spaces"}}> {paymentCharge.billedAmountValField}</div>
              
            </div>
          ),
          allowedAmount: (
            <div style={{ width: "90px" }}>
              <input
                style={{ width: " 80px" }}
                type="text"
                max="12"
                value={allowedAmount == null ? "" : allowedAmount}
                name="allowedAmount"
                id={i}
                onChange={(event) =>
                  this.handlepaymentChargeAmountChange(event, index, i)
                }
              ></input>
            </div>
          ),
          paidAmount: (
            <div style={{ width: "90px" }}>
              <input
                style={{ width: " 90px", marginRight: "0px" }}
                type="text"
                value={paidAmount == null ? "" : paidAmount}
                name="paidAmount"
                id={i}
                onChange={(event) =>
                  this.handlepaymentChargeAmountChange(event, index, i)
                }
              ></input>
            </div>
          ),
          patientRes: (
            <div style={{ width: "90px" }}>
              <input
                disabled
                style={{ width: " 90px", marginRight: "0px" }}
                type="text"
                value={patientResposibility}
                name="paidAmount"
                id={i}
              ></input>
            </div>
          ),
          coPay: (
            <input
              style={{ width: " 90px" }}
              type="text"
              value={copay == null ? "" : copay}
              name="copay"
              id={i}
              onChange={(event) =>
                this.handlepaymentChargeAmountChange(event, index, i)
              }
            ></input>
          ),
          coinsuranceAmount: (
            <input
              style={{ width: " 90px" }}
              type="text"
              value={coInsuranceAmount == null ? "" : coInsuranceAmount}
              name="coinsuranceAmount"
              id={i}
              onChange={(event) =>
                this.handlepaymentChargeAmountChange(event, index, i)
              }
            ></input>
          ),
          deductableAmount: (
            <input
              style={{ width: " 90px" }}
              type="text"
              value={deductable == null ? "" : deductable}
              name="deductableAmount"
              id={i}
              onChange={(event) =>
                this.handlepaymentChargeAmountChange(event, index, i)
              }
            ></input>
          ),
          otherPatRes: (
            <input
              style={{ width: " 90px" }}
              type="text"
              value={
                (otherPatientResponsibility = null
                  ? ""
                  : otherPatientResponsibility)
              }
              name="otherPatResp"
              id={i}
              onChange={(event) =>
                this.handlepaymentChargeAmountChange(event, index, i)
              }
            ></input>
          ),
          appliedToSec: (
            <div class="lblChkBox">
              <input
                type="checkbox"
                id="isValid"
                name="isValid"
                style={{ width: "20px", height: "20px", marginLeft: "25px" }}
                checked={paymentCharge.appliedToSec}
                onClick={(event) => {
                  this.toggleCheck(event, index, i);
                }}
              />
            </div>
          ),
          adjCode1: (
            <div className="row" style={{ width: " 280px" }}>
              {/* Adjustment Group */}
              <div style={{ marginLeft: "12px" }}>
                <select
                  style={{ width: "100% ", padding: "5px", height: "30px" }}
                  class="provider-form form-control-user"
                  name="groupCode1"
                  id={i}
                  value={
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].groupCode1
                  }
                  onChange={(event) =>
                    this.handlePaymentChargeChange(event, index, i)
                  }
                >
                  {groupCodes.map((s) => (
                    <option key={s.value} value={s.value}>
                      {" "}
                      {s.value}{" "}
                    </option>
                  ))}{" "}
                </select>
              </div>
              {/* Adjustment Code */}
              <div
                class=""
                style={{ width: " 90px", marginLeft: "5px", height: "20px" }}
                onDoubleClick={() =>
                  this.openAdjPopup(
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].adjustmentCodeObj1
                  )
                }
              >
                <Select
                  value={
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].adjustmentCodeObj1
                  }
                  onChange={(event) =>
                    this.handleAdjCodeChange(
                      event,
                      "adjustmentCodeID1",
                      "adjustmentCodeObj1",
                      index,
                      i,
                      "type1"
                    )
                  }
                  options={this.props.adjustmentCodes}
                  placeholder=""
                  isClearable={true}
                  isSearchable={true}
                  menuPosition="fixed"
                  openMenuOnClick={false}
                  escapeClearsValue={true}
                  styles={{
                    indicatorSeparator: () => {},
                    clearIndicator: (defaultStyles) => ({
                      ...defaultStyles,
                      color: "#286881",
                    }),
                    indicatorsContainer: (defaultStyles) => ({
                      ...defaultStyles,
                      padding: "0px",
                      marginBottom: "2px",
                    }),
                    dropdownIndicator: () => ({
                      display: "none",
                    }),
                    singleValue: (defaultStyles) => ({
                      ...defaultStyles,
                      paddingBottom: "9px",
                      color: paymentCharge.adjustmentCodeObj1
                        ? paymentCharge.adjustmentCodeObj1.category == "D"
                          ? "red"
                          : "black"
                        : "black",
                    }),
                    control: (defaultStyles) => ({
                      ...defaultStyles,
                      minHeight: "28px",
                      paddingLeft: "5px",
                      borderRadius: "8px",
                      height: "30px",
                      borderColor: "#C6C6C6",
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
              {/* Adjustment Amount */}
              <div>
                <input
                  style={{ width: " 90px", marginLeft: "5px" }}
                  type="text"
                  value={adjustmentAmount1 == null ? "" : adjustmentAmount1}
                  name="adjustmentAmount1"
                  id={i}
                  onChange={(event) =>
                    this.handlepaymentChargeAmountChange(
                      event,
                      index,
                      i,
                      "type1"
                    )
                  }
                ></input>
              </div>
              {
                this.state.paymentCheckModel.paymentVisit[index].paymentCharge[
                  i
                ].groupCode1ValField1
              }
            </div>
          ),
          adjCode2: (
            <div className="row" style={{ width: " 280px" }} className="row">
              {/* Adjustment Group */}
              <div style={{ marginLeft: "12px" }}>
                <select
                  style={{ width: "100% ", padding: "5px", height: "30px" }}
                  class="provider-form form-control-user"
                  name="groupCode2"
                  id={i}
                  value={
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].groupCode2
                  }
                  onChange={(event) =>
                    this.handlePaymentChargeChange(event, index, i)
                  }
                >
                  {groupCodes.map((s) => (
                    <option key={s.value} value={s.value}>
                      {" "}
                      {s.value}{" "}
                    </option>
                  ))}{" "}
                </select>
              </div>
              {/* Adjustment Code */}
              <div
                class=""
                style={{ width: " 90px", marginLeft: "5px" }}
                onDoubleClick={() =>
                  this.openAdjPopup(
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].adjustmentCodeObj2
                  )
                }
              >
                <Select
                  value={
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].adjustmentCodeObj2
                  }
                  onChange={(event) =>
                    this.handleAdjCodeChange(
                      event,
                      "adjustmentCodeID2",
                      "adjustmentCodeObj2",
                      index,
                      i,
                      "type2"
                    )
                  }
                  //onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}
                  options={this.props.adjustmentCodes}
                  placeholder=""
                  isClearable={true}
                  isSearchable={true}
                  disableOpenOnFocus={false}
                  menuPosition="fixed"
                  openMenuOnClick={false}
                  escapeClearsValue={true}
                  styles={{
                    indicatorSeparator: () => {},
                    clearIndicator: (defaultStyles) => ({
                      ...defaultStyles,
                      color: "#286881",
                    }),
                    indicatorsContainer: (defaultStyles) => ({
                      ...defaultStyles,
                      padding: "0px",
                      marginBottom: "2px",
                    }),
                    dropdownIndicator: () => ({
                      display: "none",
                    }),
                    singleValue: (defaultStyles) => ({
                      ...defaultStyles,
                      paddingBottom: "9px",
                      color: paymentCharge.adjustmentCodeObj1
                        ? paymentCharge.adjustmentCodeObj1.category == "D"
                          ? "red"
                          : "black"
                        : "black",
                    }),
                    control: (defaultStyles) => ({
                      ...defaultStyles,
                      minHeight: "28px",
                      paddingLeft: "5px",
                      borderRadius: "8px",
                      height: "30px",
                      borderColor: "#C6C6C6",
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
              {/* Adjustment Amount */}
              <input
                style={{ width: " 90px", marginLeft: "5px", height: "30px" }}
                type="text"
                value={adjustmentAmount2 == null ? "" : adjustmentAmount2}
                name="adjustmentAmount2"
                id={i}
                onChange={(event) =>
                  this.handlepaymentChargeAmountChange(event, index, i, "type2")
                }
              ></input>
              {
                this.state.paymentCheckModel.paymentVisit[index].paymentCharge[
                  i
                ].groupCode1ValField2
              }
            </div>
          ),
          adjCode3: (
            <div style={{ width: "280px" }} className="row">
              {/* Adjustment Group */}
              <div style={{ marginLeft: "12px" }}>
                <select
                  style={{ width: "100% ", padding: "5px", height: "30px" }}
                  class="provider-form form-control-user"
                  name="groupCode3"
                  id={i}
                  value={
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].groupCode3
                  }
                  onChange={(event) =>
                    this.handlePaymentChargeChange(event, index, i)
                  }
                >
                  {groupCodes.map((s) => (
                    <option key={s.value} value={s.value}>
                      {" "}
                      {s.value}{" "}
                    </option>
                  ))}{" "}
                </select>
              </div>
              {/* Adjustment Code */}
              <div
                class=""
                style={{ width: "90px", marginLeft: "5px" }}
                onDoubleClick={() =>
                  this.openAdjPopup(
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].adjustmentCodeObj3
                  )
                }
              >
                <Select
                  value={
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].adjustmentCodeObj3
                  }
                  onChange={(event) =>
                    this.handleAdjCodeChange(
                      event,
                      "adjustmentCodeID3",
                      "adjustmentCodeObj3",
                      index,
                      i,
                      "type3"
                    )
                  }
                  //onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}
                  options={this.props.adjustmentCodes}
                  placeholder=""
                  isClearable={true}
                  isSearchable={true}
                  menuPosition="fixed"
                  openMenuOnClick={false}
                  escapeClearsValue={true}
                  styles={{
                    indicatorSeparator: () => {},
                    clearIndicator: (defaultStyles) => ({
                      ...defaultStyles,
                      color: "#286881",
                    }),
                    indicatorsContainer: (defaultStyles) => ({
                      ...defaultStyles,
                      padding: "0px",
                      marginBottom: "2px",
                    }),
                    dropdownIndicator: () => ({
                      display: "none",
                    }),
                    singleValue: (defaultStyles) => ({
                      ...defaultStyles,
                      paddingBottom: "9px",
                      color: paymentCharge.adjustmentCodeObj1
                        ? paymentCharge.adjustmentCodeObj1.category == "D"
                          ? "red"
                          : "black"
                        : "black",
                    }),
                    control: (defaultStyles) => ({
                      ...defaultStyles,
                      minHeight: "28px",
                      paddingLeft: "5px",
                      borderRadius: "8px",
                      height: "30px",
                      borderColor: "#C6C6C6",
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
              {/* Adjustment Amount */}
              <input
                style={{ width: " 90px", marginLeft: "5px" }}
                type="text"
                value={adjustmentAmount3 == null ? "" : adjustmentAmount3}
                name="adjustmentAmount3"
                id={i}
                onChange={(event) =>
                  this.handlepaymentChargeAmountChange(event, index, i, "type3")
                }
              ></input>
              {
                this.state.paymentCheckModel.paymentVisit[index].paymentCharge[
                  i
                ].groupCode1ValField3
              }
            </div>
          ),
          writeoffAmount: (
            <input
              style={{ width: " 90px" }}
              type="text"
              value={writeoff}
              name="writeoffAmount"
              id={i}
              onChange={(event) =>
                this.handlepaymentChargeAmountChange(event, index, i)
              }
            ></input>
          ),
          remarkCodes: (
            <div className="row" style={{ width: "345px" }}>
              <div
                class="textBoxalidate"
                style={{ width: "100px", marginLeft: "15px" }}
              >
                <Select
                  value={
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].remarkCodeObj1
                  }
                  onChange={(event) =>
                    this.handleRemarkCodeChange(
                      event,
                      "remarkCodeID1",
                      "remarkCodeObj1",
                      index,
                      i
                    )
                  }
                  //onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}
                  options={this.props.remarkCodes}
                  placeholder=""
                  isClearable={true}
                  isSearchable={true}
                  menuPosition="fixed"
                  openMenuOnClick={false}
                  escapeClearsValue={true}
                  styles={{
                    indicatorSeparator: () => {},
                    clearIndicator: (defaultStyles) => ({
                      ...defaultStyles,
                      color: "#286881",
                    }),
                    indicatorsContainer: (defaultStyles) => ({
                      ...defaultStyles,
                      padding: "0px",
                      marginBottom: "2px",
                    }),
                    dropdownIndicator: () => ({
                      display: "none",
                    }),
                    singleValue: (defaultStyles) => ({
                      ...defaultStyles,
                      paddingBottom: "9px",
                    }),
                    control: (defaultStyles) => ({
                      ...defaultStyles,
                      minHeight: "28px",
                      paddingLeft: "5px",
                      borderRadius: "8px",
                      height: "30px",
                      borderColor: "#C6C6C6",
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
              <div class="" style={{ width: "100px", marginLeft: "5px" }}>
                <Select
                  value={
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].remarkCodeObj2
                  }
                  onChange={(event) =>
                    this.handleRemarkCodeChange(
                      event,
                      "remarkCodeID2",
                      "remarkCodeObj2",
                      index,
                      i
                    )
                  }
                  //onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}
                  options={this.props.remarkCodes}
                  placeholder=""
                  isClearable={true}
                  isSearchable={true}
                  menuPosition="fixed"
                  openMenuOnClick={false}
                  escapeClearsValue={true}
                  styles={{
                    indicatorSeparator: () => {},
                    clearIndicator: (defaultStyles) => ({
                      ...defaultStyles,
                      color: "#286881",
                    }),
                    indicatorsContainer: (defaultStyles) => ({
                      ...defaultStyles,
                      padding: "0px",
                      marginBottom: "2px",
                    }),
                    dropdownIndicator: () => ({
                      display: "none",
                    }),
                    singleValue: (defaultStyles) => ({
                      ...defaultStyles,
                      paddingBottom: "9px",
                    }),
                    control: (defaultStyles) => ({
                      ...defaultStyles,
                      minHeight: "28px",
                      paddingLeft: "5px",
                      borderRadius: "8px",
                      height: "30px",
                      borderColor: "#C6C6C6",
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
              <div class="" style={{ width: "100px", marginLeft: "5px" }}>
                <Select
                  value={
                    this.state.paymentCheckModel.paymentVisit[index]
                      .paymentCharge[i].remarkCodeObj3
                  }
                  onChange={(event) =>
                    this.handleRemarkCodeChange(
                      event,
                      "remarkCodeID3",
                      "remarkCodeObj3",
                      index,
                      i
                    )
                  }
                  //onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}
                  options={this.props.remarkCodes}
                  placeholder=""
                  isClearable={true}
                  isSearchable={true}
                  menuPosition="fixed"
                  openMenuOnClick={false}
                  escapeClearsValue={true}
                  styles={{
                    indicatorSeparator: () => {},
                    clearIndicator: (defaultStyles) => ({
                      ...defaultStyles,
                      color: "#286881",
                    }),
                    indicatorsContainer: (defaultStyles) => ({
                      ...defaultStyles,
                      padding: "0px",
                      marginBottom: "2px",
                    }),
                    dropdownIndicator: () => ({
                      display: "none",
                    }),
                    singleValue: (defaultStyles) => ({
                      ...defaultStyles,
                      paddingBottom: "9px",
                    }),
                    control: (defaultStyles) => ({
                      ...defaultStyles,
                      minHeight: "28px",
                      paddingLeft: "5px",
                      borderRadius: "8px",
                      height: "30px",
                      borderColor: "#C6C6C6",
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
            </div>
          ),
          comments: (
            <input
              style={{ width: "300px" }}
              type="text"
              value={
                this.state.paymentCheckModel.paymentVisit[index].paymentCharge[
                  i
                ].comments
              }
              name="comments"
              id="comments"
              maxLength="200"
              onChange={(event) =>
                this.handlePaymentChargeChange(event, index, i)
              }
            />
          ),
        });
      });

      //Payment Charge Grid Headings
      const data = {
        columns: [
          {
            label: "CHARGE#",
            field: "chargeId",
            sort: "asc",
            //width : 120
          },
          {
            label: "DOS",
            field: "dos",
            sort: "asc",
            //width : 75
          },
          {
            label: "CPT",
            field: "cpt",
            sort: "asc",
            //width : 120
          },
          {
            label: "CHARGE CONTROL #",
            field: "chargeControlNumber",
            sort: "asc",
            //width : 120
          },
          {
            label: "BILLED",
            field: "billedAmount",
            sort: "asc",
            //width : 120
          },
          {
            label: "ALLOWED",
            field: "allowedAmount",
            sort: "asc",
            //width : 120
          },
          {
            label: "PAID",
            field: "paidAmount",
            sort: "asc",
            //width : 120
          },
          {
            label: "PR",
            field: "patientRes",
            sort: "asc",
            //width : 120
          },
          {
            label: "COPAY",
            field: "coPay",
            sort: "asc",
            // width : 120
          },

          {
            label: "CO-INS",
            field: "coinsuranceAmount",
            sort: "asc",
            //width : 120
          },
          {
            label: "DEDUC",
            field: "deductableAmount",
            sort: "asc",
            // width : 120
          },
          {
            label: "OTHER PR",
            field: "otherPatRes",
            sort: "asc",
            // width : 120
          },
          {
            label: "AppliedToSec",
            field: "appliedToSec",
            sort: "asc",
          },
          {
            label: "ADJ1-GROUP/CODE/AMT",
            field: "adjCode1",
            sort: "asc",
            // width : 200
          },
          {
            label: "ADJ2-GROUP/CODE/AMT",
            field: "adjCode2",
            sort: "asc",
            // width : 200
          },
          {
            label: "ADJ3-GROUP/CODE/AMT",
            field: "adjCode3",
            sort: "asc",
            //width : 200
          },
          {
            label: "WRITE-OFF",
            field: "writeoffAmount",
            sort: "asc",
            //width : 200
          },
          {
            label: "REMARK CODES",
            field: "remarkCodes",
            sort: "asc",
            // width : 0
          },
          {
            label: "COMMENTS",
            field: "comments",
            sort: "asc",
            // width : 0
          },
        ],
        rows: rowData,
      };

      //Visit Patient Amount
      let visitPatientAmount = 0;
      if (paymentVisit.processedAs === "22") {
        visitPatientAmount = paymentVisit.patientAmount;
      } else {
        visitPatientAmount =
          paymentVisit.patientAmount > 0
            ? Number(paymentVisit.patientAmount).toFixed(2)
            : "";
      }
      //Payment Visit Grid
      mainGridRow.push(
        <div style={{ marginTop: "10px" }}>
          <div class="row">
            <div class="col-md-12 order-md-1 provider-form ">
              <div class="float-lg-right text-right">
                <button
                  class=" btn btn-primary mr-2"
                  type="submit"
                  value="Add"
                  onClick={(event) => this.deletePaymentCheckRow(event, index)}
                  disabled={this.isDisabled(
                    this.props.rights.deletePaymentVisit
                  )}
                >
                  Delete Payment Visit
                </button>
              </div>
              <div class="header pt-1">
                <h6 class="heading" style={{ marginBottom: "-10px" }}>
                  <MDBBtn
                    color="primary"
                    onClick={(event) => this.toggleCollapse(index + 1)}
                    style={{ marginBottom: "1rem" }}
                  >
                    {this.props.id > 0
                      ? "VISIT # " +
                        paymentVisit.visitID +
                        " - " +
                        "Billed Amt : $" +
                        paymentVisit.billedAmount +
                        " - " +
                        " - " +
                        "Allowed Amt : $" +
                        paymentVisit.allowedAmount +
                        " - " +
                        "Paid Amt : $" +
                        paymentVisit.paidAmount +
                        " - " +
                        "Patient Res : $" +
                        (paymentVisit.patientAmount
                          ? parseFloat(paymentVisit.patientAmount).toFixed(2)
                          : "0.00")
                      : "VISIT #"}
                  </MDBBtn>
                </h6>

                <hr
                  class="p-0 mt-0 mb-1"
                  style={{ backgroundColor: "#037592" }}
                ></hr>
                <div class="clearfix"></div>
              </div>
              <br></br>
            </div>
          </div>

          <MDBCollapse id={index + 1} isOpen={this.state.collapseID}>
            <div class="card-body collapse show" id="Opener">
              <div class="row">
                <div class="col-lg-4 mb-3">
                  <div class="col-md-4 float-left">
                    <label for="firstName">
                      Processed As<span class="text-danger">*</span>
                    </label>
                  </div>
                  <div class="col-md-7 float-left">
                    <select
                      style={{ width: "100%" }}
                      name="processedAs"
                      id={index}
                      value={paymentVisit.processedAs}
                      onChange={this.handlePaymentVisitChange}
                    >
                      {processedAs.map((process) => {
                        return (
                          <option key={process.value} value={process.value}>
                            {process.description}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div class="invalid-feedback"></div>
                </div>
                <div class="col-md-4 mb-4">
                  <div class="col-md-4 float-left">
                    <label for="firstName">
                      <a
                        href=""
                        onClick={
                          paymentVisit.visitID > 0
                            ? (event) =>
                                this.openPopup(
                                  event,
                                  "visit",
                                  paymentVisit.visitID
                                )
                            : (event) => this.openPopup(event, "", -1)
                        }
                      >
                        Visit#
                      </a>
                    </label>
                  </div>
                  <div class="col-md-8 float-left">
                    <input
                      type="text"
                      style={{ width: "85%" }}
                      class="provider-form form-control-user"
                      disabled={
                        paymentVisit.id > 0 &&
                        paymentVisit.isVisitIDnull == false
                          ? true
                          : false
                      }
                      name="visitID"
                      id={index}
                      value={paymentVisit.visitID}
                      onChange={this.handlePaymentVisitChange}
                      onKeyPress={(event) => this.handleEnterKey(event, index)}
                    />
                    {paymentVisit.id > 0 &&
                    paymentVisit.isVisitIDnull == false ? null : (
                      <a href="#">
                        <img
                          style={{ width: "26px", marginTop: "-3px" }}
                          class="float-right pt-1"
                          src={plusSrc}
                          onClick={(event) =>
                            this.handleVisitIndexChange(event, index)
                          }
                          alt=""
                        />
                      </a>
                    )}
                  </div>
                  <div class="invalid-feedback">
                    {paymentVisit.visitValField}
                  </div>
                </div>
                <div class="col-md-4 mb-4">
                  <div class="col-md-4 float-left">
                    <label for="firstName">
                      {paymentVisit.patientID ? (
                        <a
                          href=""
                          onClick={(event) =>
                            this.openPopup(
                              event,
                              "patient",
                              paymentVisit.patientID
                            )
                          }
                        >
                          Patient
                        </a>
                      ) : (
                        "Patient"
                      )}
                    </label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Patient"
                      disabled
                      name="patientName"
                      id={index}
                      value={paymentVisit.patientName}
                      onChange={this.handlePaymentVisitChange}
                    />
                  </div>
                  <div class="invalid-feedback"></div>
                </div>
              </div>
              <div class="clearfix"></div>
              <div class="row mb-3">
                <div class="col-lg-4">
                  <div class="col-md-4 float-left">
                    <label for="firstName">ICN#</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="ICN#"
                      maxLength="20"
                      type="text"
                      name="payerICN"
                      id={index}
                      value={paymentVisit.payerICN}
                      onChange={(event) => this.handlePaymentVisitChange(event)}
                    />
                  </div>
                  <div class="invalid-feedback"></div>
                </div>
                <div class="col-md-4 mb-4">
                  <div class="col-md-4 float-left">
                    <label for="firstName">Insured(ERA)</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder=" Insured (ERA)"
                      disabled
                      maxLength="15"
                      value={
                        (paymentVisit.insuredLastName
                          ? paymentVisit.insuredLastName + ","
                          : "") +
                        (paymentVisit.insuredFirstName
                          ? paymentVisit.insuredFirstName + ","
                          : ",") +
                        (paymentVisit.insuredID ? paymentVisit.insuredID : "")
                      }
                      name="batchDocumentID"
                      id={index}
                      onChange={this.handlepaymentVisitAmountChange}
                    />
                  </div>
                  <div class="invalid-feedback"></div>
                </div>
                <div class="col-md-4 mb-4">
                  <div class="col-md-4 float-left">
                    <label for="firstName">Patient(ERA)</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Patient(ERA)"
                      disabled
                      max="15"
                      type="text"
                      value={
                        (paymentVisit.patientLastName
                          ? paymentVisit.patientLastName + ","
                          : "") +
                        (paymentVisit.patientFirstName
                          ? paymentVisit.patientFirstName + ""
                          : "")
                      }
                    />
                  </div>
                  <div class="invalid-feedback"></div>
                </div>
              </div>
              <div class="clearfix"></div>
              <div class="row mb-3">
                <div class="col-lg-4">
                  <div class="col-md-4 float-left">
                    <label for="firstName">Billed Amount</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      Allowed
                      Amount
                      disabled
                      placeholder="Billed Amount"
                      name="billedAmount"
                      id={index}
                      value={paymentVisit.billedAmount}
                      onChange={this.handlepaymentVisitAmountChange}
                    />
                  </div>
                  <div class="invalid-feedback"></div>
                </div>
                <div class="col-md-4">
                  <div class="col-md-4 float-left">
                    <label for="firstName">Paid Amount</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      Allowed
                      Amount
                      disabled
                      placeholder="Paid Amount"
                      value={paymentVisit.paidAmount}
                      name="paidAmount"
                      id={index}
                      onChange={this.handlepaymentVisitAmountChange}
                    />
                  </div>
                  <div class="invalid-feedback"></div>
                </div>
                <div class="col-md-4">
                  <div class="col-md-4 float-left">
                    <label for="firstName">Allowed Amount</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      Allowed
                      Amount
                      disabled
                      placeholder="Allowed Amount"
                      name="allowedAmount"
                      id={index}
                      value={paymentVisit.allowedAmount}
                      onChange={this.handlePaymentVisitChange}
                    />
                  </div>
                  <div class="invalid-feedback"></div>
                </div>
              </div>
              <div class="clearfix"></div>
              <div class="row mb-3">
                <div class="col-lg-4">
                  <div class="col-md-4 float-left">
                    <label for="firstName">Patient Res</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      disabled
                      placeholder="Patient Res"
                      name="patientAmount"
                      id={index}
                      value={visitPatientAmount}
                      onChange={this.handlePaymentVisitChange}
                    />
                  </div>
                  <div class="invalid-feedback"></div>
                </div>
                <div class="col-md-4">
                  <div class="col-md-4 float-left">
                    <label for="firstName">WriteOff Amount</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      disabled
                      placeholder="WriteOff Amount"
                      name="writeOffAmount"
                      id={index}
                      value={paymentVisit.writeOffAmount}
                      onChange={() => this.handlePaymentVisitChange}
                    />
                  </div>
                  <div class="invalid-feedback"></div>
                </div>
                <div class="col-md-4">
                  <div class="col-md-4 float-left">
                    <label for="firstName">Claim Control#</label>
                  </div>
                  <div class="col-md-7 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      disabled
                      placeholder="Claim Control#"
                      name="claimNumber"
                      id={index}
                      value={paymentVisit.claimNumber}
                      onChange={() => this.handlePaymentVisitChange}
                    />
                  </div>
                  <div class="invalid-feedback"></div>
                </div>
              </div>
              <div class="clearfix"></div>
              <div class="row mb-0">
                <div class="col-lg-12 col-md-12 col-sm-12">
                  <div class="col-md-1 pl-3 pr-0 float-left">
                    <label for="firstName">comments</label>
                  </div>
                  <div class="col-md-10 m-0 p-0 ml-5 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      id="firstName"
                      placeholder="comments"
                      name="comments"
                      id={index}
                      value={paymentVisit.comments}
                      onChange={this.handlePaymentVisitChange}
                    />
                  </div>
                  <div class="invalid-feedback"></div>
                </div>
                <div class="clearfix"></div>
              </div>
              <div className="tableGridContainer">
                <MDBDataTable
                  responsive={true}
                  striped
                  bordered
                  searching={false}
                  data={data}
                  displayEntries={false}
                  sortable={false}
                  scrollX={false}
                  paging={false}
                />
              </div>
            </div>
          </MDBCollapse>
        </div>
      );
    });

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

    //History Dropdown Options
    const options = [
      { value: "History", label: "History", className: "dropdown" },
    ];

    //History Dropdown button
    var Imag = (
      <div>
        <img src={settingsIcon} style={{ width: "32px" }} />
      </div>
    );
    var dropdown;
    dropdown = (
      <Dropdown
        className=""
        options={options}
        onChange={() => this.openhistorypopup("NewHistoryPractice", 0)}
        //  value={options}
        // placeholder={"Select an option"}
        placeholder={Imag}
      />
    );

    let popup = "";
    if (this.state.popupName === "practice") {
      popup = (
        <NewPractice
          onClose={this.closePopup}
          practiceID={this.state.id}
        ></NewPractice>
      );
    } else if (this.state.popupName === "visit") {
      popup = (
        <GPopup
          onClose={this.closePopup}
          popupName="visit"
          id={this.state.id}
        ></GPopup>
      );
    } else if (this.state.popupName === "chargeSearch") {
      popup = (
        <GPopup
          onClose={this.closePopup}
          getVisitID={(event, name) => this.getVisitID(event, name)}
          popupName="chargeSearch"
          id={this.state.id}
        ></GPopup>
      );
    } else if (this.state.popupName === "pagePDF") {
      popup = (
        <PagePDF
          onClose={this.closePage}
          pageNumber={this.state.pageNumber}
          fileURL={this.state.fileURL}
          id={this.state.id}
        ></PagePDF>
      );
    } else if (this.state.popupName == "batch") {
      popup = (
        <BatchDocumentPopup
          onClose={this.closePopup}
          // getbatchID={(name) => this.getbatchID(name)}
          // popupName="batchNo"
          id={this.state.paymentCheckModel.batchDocumentID}
        ></BatchDocumentPopup>
      );
    } else if (this.state.popupName == "batchNo") {
      popup = (
        <GPopup
          onClose={this.closePopup}
          getbatchID={(name) => this.getbatchID(name)}
          popupName="batchNo"
          batchPopupID={this.state.paymentCheckModel.batchDocumentID}
        ></GPopup>
      );
    } else if (this.state.popupName === "patient") {
      popup = (
        <GPopup
          onClose={this.closePopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.popupName === "cpt") {
      popup = (
        <NewAdjustmentCode
          onClose={this.closePopup}
          id={this.state.id}
        ></NewAdjustmentCode>
      );
    } else if (this.state.popupName === "NewHistoryPractice") {
      popup = (
        <NewHistoryPractice
          onClose={this.closehistoryPopup}
          historyID={this.state.editId}
          apiURL={this.url}
          // disabled={this.isDisabled(this.props.rights.update)}
          // disabled={this.isDisabled(this.props.rights.add)}
        ></NewHistoryPractice>
      );
    } else {
      popup = "";
    }
    console.log("ss", this.state.editId, this.state.paymentCheckModel.id);
    //Check Post Button
    let postBtn = "";
    if (
      (this.state.editId > 0 || this.state.paymentCheckModel.id > 0) &&
      this.state.paymentCheckModel.status != "P"
    ) {
      console.log("IF", this.state.editId, this.state.paymentCheckModel.id);
      postBtn = (
        <button class="btn btn-primary mr-2" onClick={() => this.postCheck()}>
          POST CHECK
        </button>
      );
    } else {
      console.log("Else", this.state.editId, this.state.paymentCheckModel.id);
      postBtn = null;
    }

    return (
      <React.Fragment>
        {spiner}

        {/* <!-- Content Wrapper --> */}
        <div id="content-wrapper" class="d-flex flex-column">
          {/* <!-- Main Content --> */}
          <div id="content">
            {/* <!-- Begin Page Content --> */}

            {/* <!-- /.container-fluid --> */}
            <div class="container-fluid">
              {/* <!-- Main form starts here --> */}

              {/* PaymentHeader Starts Here */}
              <div class="row">
                <div class="col-md-12 col-sm-12 order-md-1 provider-form">
                  <div class="header pt-1">
                    <h6>
                      <span class="h4">
                        {this.props.id > 0
                          ? "CHECK # " +
                            this.state.paymentCheckModel.checkNumber
                          : "NEW MANUAL PAYMENT POSTING"}
                      </span>
                      <div class="float-right col-md-0 p-0">
                        {this.state.editId > 0 ? dropdown : ""}
                      </div>
                      <div class="float-right col-md-0 p-0">
                        <button
                          style={{ marginTop: "-5px" }}
                          class="btn btn-primary mr-2"
                          onClick={this.deleteCheck}
                          disabled={this.isDisabled(
                            this.props.rights.deleteCheck
                          )}
                        >
                          Delete
                        </button>
                      </div>
                      <div class="float-right col-md-0 p-0">
                        {!(this.props.popupVisitId > 0) &&
                        this.state.editId > 0 ? (
                          <React.Fragment>
                            <img
                              src={backIcon}
                              style={{
                                width: "30px",
                                height: "30px",
                                marginLeft: "-650%",
                              }}
                              alt="backicon"
                              onClick={this.previousVisit}
                            />
                            <img
                              src={frontIcon}
                              style={{ width: "30px", height: "30px" }}
                              alt="backicon"
                              onClick={this.nextVisit}
                            />
                          </React.Fragment>
                        ) : null}
                      </div>
                    </h6>
                  </div>
                  <div
                    class="clearfix"
                    style={{ borderBottom: "1px solid #037592" }}
                  ></div>
                  <br></br>
                  <div class="row">
                    <div class="col-md-12 m-0 p-0 float-right">
                      <div class="row">
                        <div class="col-md-4 mb-4 col-sm-4">
                          <div class="col-md-4 pr-1 float-left">
                            <label for="Account">
                              Check#<span class="text-danger">*</span>
                            </label>
                          </div>
                          <div class="col-md-8 pl-1 p-0 m-0 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              placeholder="Check#"
                              name="checkNumber"
                              id="checkNumber"
                              value={this.state.paymentCheckModel.checkNumber}
                              onChange={this.handlePaymentCheckChange}
                            />
                          </div>
                          <div class="invalid-feedback">
                            {this.state.validationModel.checkNumberValField}
                          </div>
                        </div>
                        <div class="col-md-4 mb-4 col-sm-4">
                          <div class="col-md-4 pr-1 float-left">
                            <label for="mm/dd/yyyy">
                              Check Date<span class="text-danger">*</span>
                            </label>
                          </div>
                          <div class="col-md-8 pl-0 p-0 m-0 float-left">
                            <input
                              type="date"
                              class="provider-form w-100 form-control-user"
                              type="date"
                              min="1900-01-01"
                              max="9999-12-31"
                              name="checkDate"
                              id="checkDate"
                              value={checkDate}
                              onChange={this.handlePaymentCheckChange}
                            />
                          </div>
                          <div class="invalid-feedback">
                            {this.state.validationModel.checkDateValField}
                            {this.state.validationModel.checkDateFDValField}
                          </div>
                        </div>
                        <div class="col-md-4 mb-4 col-sm-4">
                          <div class="col-md-4 float-left">
                            <label for="firstName">
                              Check Amount<span class="text-danger">*</span>
                            </label>
                          </div>
                          <div class="col-md-8 pl-0 p-0 m-0 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              placeholder="Check Amount"
                              name="checkAmount"
                              id="checkAmount"
                              value={this.state.paymentCheckModel.checkAmount}
                              onChange={this.handlepaymentCheckAmountChange}
                            />
                          </div>
                          <div class="invalid-feedback">
                            {this.state.validationModel.checkAmountValField}
                          </div>
                        </div>
                      </div>
                      <div class="row mt-3">
                        <div class="col-md-4 mb-4 col-sm-4">
                          <div class="col-md-4 float-left">
                            <label for="AppliedAmount">Applied Amount</label>
                          </div>
                          <div class="col-md-8 p-0 pl-1 m-0 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              disabled
                              placeholder="Applied Amount"
                              value={
                                this.state.paymentCheckModel.appliedAmount == 0
                                  ? ""
                                  : this.state.paymentCheckModel.appliedAmount
                              }
                              name="appliedAmount"
                              id="appliedAmount"
                              onChange={() =>
                                this.handlepaymentCheckAmountChange
                              }
                            />
                          </div>
                          <div class="invalid-feedback"></div>
                        </div>
                        <div class="col-md-4 mb-4 col-sm-4">
                          <div class="col-md-4 float-left">
                            <label for="UnAppliedAmount">
                              UnApplied Amount
                            </label>
                          </div>
                          <div class="col-md-8 p-0 m-0 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              disabled
                              placeholder="UnAppliedAmount"
                              value={
                                this.state.paymentCheckModel.unAppliedAmount ==
                                0
                                  ? ""
                                  : this.state.paymentCheckModel.unAppliedAmount
                              }
                              name="unAppliedAmount"
                              id="unAppliedAmount"
                            />
                          </div>
                          <div class="invalid-feedback"></div>
                        </div>
                        <div class="col-md-4 mb-4 col-sm-4">
                          <div class="col-md-4 float-left">
                            <label for="PostedAmount">Posted Amount</label>
                          </div>
                          <div class="col-md-8 p-0 m-0 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              disabled
                              placeholder="Posted Amount"
                              value={
                                this.state.paymentCheckModel.postedAmount
                                  ? this.state.paymentCheckModel.postedAmount
                                  : ""
                              }
                              name="postedAmount"
                              id="postedAmount"
                            />
                          </div>
                          <div class="invalid-feedback"></div>
                        </div>
                      </div>
                      <div class="row mt-3">
                        <div class="col-md-4 mb-4 col-sm-4">
                          <div class="col-md-4 float-left">
                            <label for="firstName">
                              {this.state.paymentCheckModel.practiceID ? (
                                <a
                                  href=""
                                  onClick={
                                    this.state.paymentCheckModel.practiceID
                                      ? (event) =>
                                          this.openPopup(
                                            event,
                                            "practice",
                                            this.state.paymentCheckModel
                                              .practiceID
                                          )
                                      : undefined
                                  }
                                >
                                  Practice
                                </a>
                              ) : (
                                "Practice"
                              )}
                              <span class="text-danger">*</span>
                            </label>
                          </div>
                          <div class="col-md-8 pl-1 p-0 m-0 float-left">
                            <select
                              class="p-1 ml-0 w-100 m-0"
                              name="practiceID"
                              id="practiceID"
                              disabled
                              value={this.state.paymentCheckModel.practiceID}
                              onChange={this.handlePaymentCheckChange}
                            >
                              {this.state.facData.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.description}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div class="invalid-feedback">
                            {this.state.validationModel.practiceValField}
                          </div>
                        </div>
                        <div class="col-md-4 mb-4 col-sm-4">
                          <div class="col-md-4 pr-1 float-left">
                            <label for="firstName">
                              Payer<span class="text-danger">*</span>
                            </label>
                          </div>
                          <div class="col-md-8 pl-0 p-0 m-0 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              placeholder="Payer"
                              name="payerName"
                              id="payerName"
                              value={this.state.paymentCheckModel.payerName}
                              max="30"
                              onChange={this.handlePaymentCheckChange}
                            />
                          </div>
                          <div class="invalid-feedback">
                            {this.state.validationModel.payerNameValField}
                          </div>
                        </div>
                        <div class="col-md-4 mb-4 col-sm-4">
                          <div class="col-md-4 pr-1 float-left">
                            <label for="firstName">Receiver</label>
                          </div>
                          <div class="col-md-8 col-sm-8 p-0 m-0 float-left">
                            <select
                              class="p-1 ml-0 w-100 m-0"
                              name="receiverID"
                              id="receiverID"
                              value={
                                this.state.paymentCheckModel.receiverID === null
                                  ? "Please Select"
                                  : this.state.paymentCheckModel.receiverID
                              }
                              onChange={this.handlePaymentCheckChange}
                            >
                              {this.props.receivers.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.description}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div class="invalid-feedback"></div>
                        </div>
                      </div>
                      <div class="row mt-3">
                        <div class="col-md-4 mb-4 col-sm-4">
                          <div class="col-md-4 pr-1 float-left">
                            <label for="firstName">Status</label>
                          </div>
                          <div class="col-md-8 col-sm-8 p-0 m-0 float-left">
                            <select
                              class="p-1 ml-1 w-100 m-0"
                              disabled
                              type="text"
                              name="status"
                              id="status"
                              value={this.state.paymentCheckModel.status}
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
                        <div class="col-md-4 mb-4 col-sm-4">
                          <div class="col-md-4 pr-1 float-left">
                            <label for="firstName">Comments</label>
                          </div>
                          <div class="col-md-8 pl-0 p-0 m-0 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              name="comments"
                              id="comments"
                              value={this.state.paymentCheckModel.comments}
                              onChange={this.handlePaymentCheckChange}
                            />
                          </div>
                          <div class="invalid-feedback"></div>
                        </div>
                        <div class="col-md-4 mb-4">
                          <div class="col-md-4 p-0 m-0 float-left">
                            <label for="DOB/Gender">
                              <span>
                                {this.state.paymentCheckModel
                                  .batchDocumentID ? (
                                  <a
                                    href=""
                                    onClick={(event) =>
                                      this.openPopup(
                                        event,
                                        "batch",
                                        this.state.paymentCheckModel
                                          .batchDocumentID
                                      )
                                    }
                                  >
                                    Batch#
                                  </a>
                                ) : (
                                  "Batch#"
                                )}
                              </span>
                              <span>
                                {this.state.paymentCheckModel.pageNumber ? (
                                  <a
                                    href=""
                                    onClick={(event) =>
                                      this.openPopup(
                                        event,
                                        "pagePDF",
                                        this.state.paymentCheckModel.pageNumber
                                      )
                                    }
                                  >
                                    /Page#
                                  </a>
                                ) : (
                                  "/Page#"
                                )}
                              </span>
                            </label>
                          </div>
                          <div class="col-md-8 float-left">
                            <input
                              type="text"
                              style={{ width: "42%" }}
                              class="provider-form form-control-user"
                              type="text"
                              maxLength="20"
                              value={
                                this.state.paymentCheckModel.batchDocumentID
                                  ? this.state.paymentCheckModel.batchDocumentID
                                  : ""
                              }
                              name="batchDocumentID"
                              id="batchDocumentID"
                              onBlur={this.handleBatchCheck}
                              onChange={this.handleBatchChange}
                            />
                            <a>
                              {" "}
                              <img
                                style={{ width: "25px", marginTop: "-2px" }}
                                class="float-right pt-1"
                                src={plusSrc}
                                alt=""
                                onClick={(event) =>
                                  this.openPopup(
                                    event,
                                    "batchNo",
                                    this.state.paymentCheckModel.batchDocumentID
                                  )
                                }
                              />
                            </a>
                            <input
                              type="text"
                              style={{ width: "42%" }}
                              class="provider-form form-control-user"
                              maxLength="20"
                              type="text"
                              value={this.state.paymentCheckModel.pageNumber ? this.state.paymentCheckModel.pageNumber :""}
                              name="pageNumber"
                              id="pageNumber"
                              // onBlur={this.handleBatchCheck}
                              onChange={this.handleBatchChange}
                            />
                          </div>
                          <div class="invalid-feedback">
                            {this.state.validationModel.batchDocumentIDValField}
                            {this.state.validationModel.responsepagesValField}
                            {this.state.validationModel.pageNumberValField}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* PaymentHeader Ends Here */}

              {/* Add PaymentVisit Heading Starts Here */}
              <br></br>
              <div class="row">
                <div class="col-md-12 order-md-1 provider-form ">
                  <div class="float-lg-right text-right">
                    <button
                      style={{ marginTop: "-15px" }}
                      class=" btn btn-primary mr-2"
                      onClick={this.addPaymentCheckRow}
                      disabled={this.isDisabled(
                        this.props.rights.addPaymentVisit
                      )}
                    >
                      Add Payment Visit
                    </button>
                  </div>
                  <div class="header pt-1">
                    <h6 class="heading"> PAYMENT VISITS</h6>

                    <hr
                      class="p-0 mt-0 mb-1"
                      style={{ backgroundColor: "#037592" }}
                    ></hr>
                    <div class="clearfix"></div>
                  </div>
                  <br></br>

                  {/* Comtent */}
                  {this.state.paymentCheckModel.paymentVisit.length > 0 ? (
                    <div className="container-fluid">
                      <div className="card mb-4">{mainGridRow}</div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/* Add PaymentVisit Heading Ends Here */}

              {/* Save ans Cancel Butons */}
              <div class="col-12 text-center mt-3">
                {postBtn}
                <button
                  class="btn btn-primary mr-2"
                  onClick={this.saveManualPosting}
                  disabled={this.isDisabled(
                    this.state.editId > 0
                      ? this.props.rights.manualPostingUpdate
                      : this.props.rights.manualPostingAdd
                  )}
                >
                  Save
                </button>

                <button
                  class="btn btn-primary mr-2"
                  onClick={
                    this.state.visitID > 0
                      ? () => this.props.onClose()
                      : () => this.closeManualPosting()
                  }
                >
                  Cancel
                </button>
              </div>

              {popup}
            </div>
            {/* <!-- End of container fluid --> */}
          </div>
          {/* <!-- End of content --> */}
        </div>
        {/* <!-- End of Content Wrapper --> */}
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
      : { userInfo: { userPractices: [], name: "", practiceID: null } },
    receivers: state.receivers ? state.receivers : [],
    adjustmentCodes: state.adjustmentCodes ? state.adjustmentCodes : [],
    remarkCodes: state.remarkCodes ? state.remarkCodes : [],

    rights: state.loginInfo
      ? {
          manualPostingAdd: state.loginInfo.rights.manualPostingAdd,
          manualPostingUpdate: state.loginInfo.rights.manualPostingUpdate,
          postcheck: state.loginInfo.rights.postcheck,
          addPaymentVisit: state.loginInfo.rights.addPaymentVisit,
          deletePaymentVisit: state.loginInfo.rights.deletePaymentVisit,
          postCheckSearch: state.loginInfo.rights.postCheckSearch,
          deleteCheck: state.loginInfo.rights.deleteCheck,
          deletePaymentVisit: state.loginInfo.rights.deletePaymentVisit,
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
  connect(mapStateToProps, matchDispatchToProps)(ManualPosting)
);
