import React, { Component } from "react";
import $ from "jquery";
import axios from "axios";
import Input from "./Input";
import Swal from "sweetalert2";
import { MDBDataTable } from "mdbreact";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

import { isNullOrUndefined } from "util";
import { tsExpressionWithTypeArguments } from "@babel/types";
import { EOVERFLOW } from "constants";
import GridHeading from "./GridHeading";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class NewPatientPayment extends Component {
  constructor(props) {
    super(props);

    this.searchPayment = process.env.REACT_APP_URL + "/PatientPayment/";
    this.patientPaymentChargesUrl =
      process.env.REACT_APP_URL + "/patientPayment/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.validationModel = {
      paymentMethodValField: "",
      paymentDateValField: "",
      paymentAmountValField: "",
      checkNumberValField: "",
      descriptionValField: "",
      statusValField: "",
      allocatedAmountValField: "",
    };

    this.newpatientPaymentModel = {
      id: 0,
      dos: "",
      submitDate: "",
      plan: "",
      cpt: "",
      billedAmount: "",
      writeOff: "",
      allowedAmount: "",
      paidAmount: "",
      copay: "",
      coInsurance: "",
      deductible: "",
      allocatedAmount: "",
      remainingAmount: "",
      paymentMethod: "",
      paymentDate: "",
      paymentAmount: "",
      checkNumber: "",
      description: "",
      status: "O",
      chargeID: "",
      visitID: "",
      patientID: this.props.id,
      patientPaymentCharges: [],
    };

    this.patientPaymentCharges = {
      id: 0,
      patientPaymentID: 0,
      visitID: null,
      chargeID: null,
      allocatedAmount: 0.0,
      status: "O",
    };

    this.state = {
      data1: [],
      newpatientPaymentModel: this.newpatientPaymentModel,
      validationModel: this.validationModel,
      maxHeight: "361",
      editId: this.props.id,
      //remainingAmount: 0,
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.SavePayment = this.SavePayment.bind(this);
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
    await this.setState({
      newpatientPaymentModel: {
        ...this.state.newpatientPaymentModel,
        patientPaymentCharges: [],
      },
      loading: true,
    });

    await this.setModalMaxHeight($(".modal"));
    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function () {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);

    try {
      await axios
        .get(
          this.patientPaymentChargesUrl +
            "FindPatientPaymentCharges/" +
            this.props.id,
          this.config
        )
        .then((response) => {
          console.log("Find Patient Payment Charges", response.data);
          this.setState({
            newpatientPaymentModel: {
              ...this.state.newpatientPaymentModel,
              patientPaymentCharges: response.data,
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });

      /// edit mode grid

      if (this.props.pid > 0) {
        this.setState({ loading: true });

        await axios
          .get(
            this.searchPayment + "FindPatientPayment/" + this.props.pid,
            this.config
          )
          .then((response) => {
            console.log("Patient Data : ", response.data);
            this.setState({
              newpatientPaymentModel: {
                ...this.state.newpatientPaymentModel,
                id: response.data.id,
                dos: "",
                submitDate: "",
                plan: "",
                cpt: "",
                billedAmount: "",
                writeOff: "",
                allowedAmount: "",
                paidAmount: "",
                copay: "",
                coInsurance: "",
                deductible: "",
                allocatedAmount: response.data.allocatedAmount,
                remainingAmount: response.data.remainingAmount,
                paymentMethod: response.data.paymentMethod,
                paymentDate: response.data.paymentDate,
                paymentAmount: response.data.paymentAmount,
                checkNumber: response.data.checkNumber,
                description: response.data.description,
                status: "O",
                patientID: response.data.patientID,
                patientPaymentCharges: [],
              },
            });
          })
          .catch((error) => {
            console.log(error);
          });

        await axios
          .get(
            this.patientPaymentChargesUrl +
              "FindPatientChargesByPaymentID/" +
              this.props.pid,
            this.config
          )
          .then((response) => {
            console.log("Charge Data :", response.data);
            if (response.data.length == null || response.data.length == 0) {
              axios
                .get(
                  this.patientPaymentChargesUrl +
                    "FindPatientPaymentCharges/" +
                    this.props.id,
                  this.config
                )
                .then((response) => {
                  console.log("Find Patient Payment Charges", response.data);
                  this.setState({
                    newpatientPaymentModel: {
                      ...this.state.newpatientPaymentModel,
                      patientPaymentCharges: response.data,
                    },
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              this.setState({
                newpatientPaymentModel: {
                  ...this.state.newpatientPaymentModel,
                  patientPaymentCharges: response.data,
                },
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch {
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
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

  //sum of allocated amount entered by user
  sumofallocatedamount() {
    var sumAlloAmt = 0;
    this.state.newpatientPaymentModel.patientPaymentCharges.map((charge) => {
      sumAlloAmt += Number(parseFloat(charge.allocatedAmount).toFixed(2));
    });
    this.setState({
      remainingAmount:
        this.state.newpatientPaymentModel.paymentAmount - sumAlloAmt,
      allocatedAmount: sumAlloAmt,
    });
  }

  async SavePayment(e) {
    this.setState({ loading: true });

    console.log("save model", this.state.newpatientPaymentModel);
    e.preventDefault();
    // this.sumofallocatedamount();
    var myval = this.validationModel;
    myval.validation = false;

    if (
      this.state.newpatientPaymentModel.allocatedAmount >
      this.state.newpatientPaymentModel.paymentAmount
    ) {
      myval.allocatedAmountValField = (
        <span className="validationMsg">
          Allocated Amount Can't Greater then Payment Amount
        </span>
      );
      myval.validation = true;
    } else {
      myval.allocatedAmountValField = "";
      if (myval.validation === false) myval.validation = false;
    }

    if (this.isNull(this.state.newpatientPaymentModel.paymentMethod)) {
      myval.paymentMethodValField = (
        <span className="validationMsg">Select Payment Method</span>
      );
      myval.validation = true;
    } else {
      myval.paymentMethodValField = "";
      if (myval.validation === false) myval.validation = false;
    }

    if (this.isNull(this.state.newpatientPaymentModel.paymentDate)) {
      myval.paymentDateValField = (
        <span className="validationMsg">Enter Date</span>
      );
      myval.validation = true;
    } else {
      myval.paymentDateValField = "";
      if (myval.validation === false) myval.validation = false;
    }

    if (this.isNull(this.state.newpatientPaymentModel.paymentAmount)) {
      myval.paymentAmountValField = (
        <span className="validationMsg">Enter Amount</span>
      );
      myval.validation = true;
    } else {
      myval.paymentAmountValField = "";
      if (myval.validation === false) myval.validation = false;
    }

    if (this.state.newpatientPaymentModel.paymentMethod == "CHECK") {
      if (this.isNull(this.state.newpatientPaymentModel.checkNumber)) {
        myval.checkNumberValField = (
          <span className="validationMsg">Enter Check Number</span>
        );
        myval.validation = true;
      } else {
        myval.checkNumberValField = "";
        if (myval.validation === false) myval.validation = false;
      }
    } else {
      myval.statusValField = "";
      if (myval.validation === false) myval.validation = false;
    }

    // if(this.isNull(this.state.newpatientPaymentModel.description)){
    //   myval.descriptionValField=(
    //     <span className="validationMsg">Enter Discription</span>
    //   )
    //   myval.validation=true;
    // }else{
    //   myval.descriptionValField = "";
    //   if (myval.validation === false) myval.validation = false;
    // }

    var totalAmnt = 0;
    await this.state.newpatientPaymentModel.patientPaymentCharges.map(
      (charge) => {
        totalAmnt = charge.copay + charge.coInsurance + charge.deductible;

        if (charge.allocatedAmount > totalAmnt) {
          Swal.fire(
            "Something Wrong",
            "Allocated Amount Should be equal to Patient Balance",
            "error"
          );
          myval.validation = true;
        } else {
          myval.descriptionValField = "";
          if (myval.validation === false) myval.validation = false;
        }
      }
    );

    this.setState({
      validationModel: myval,
    });

    if (myval.validation === true) {
      this.setState({ loading: false });
      return;
    }
    console.log("after log model", this.state.newpatientPaymentModel);

    axios
      .post(
        this.searchPayment + "SavePatientPayment",
        this.state.newpatientPaymentModel,
        this.config
      )
      .then((response) => {
        if (response.data.patientPaymentCharges != null) {
          console.log("save data console", response.data);
          this.setState({
            newpatientPaymentModel: response.data,

            editId: response.data.id,
            loading: false,
          });
          console.log(
            "Data after Saved in Model",
            this.state.newpatientPaymentModel
          );

          Swal.fire("Record Saved Successfully", "", "success");

          //alert(test);
          console.log(response.data);
        } else {
          console.log("Can't Save Charges");
          Swal.fire(
            "Something Wrong",
            "Please Check Server Connection",
            "error"
          );
        }
        //  this.componentDidMount();
      })

      .catch((error) => {
        this.setState({ loading: false });
        try {
          let errorsList = [];
          if (error.response !== null && error.response.data !== null) {
            errorsList = error.response.data;
            console.log(errorsList);
          }
        } catch {
          console.log(error);
        }
      });

    e.preventDefault();
  }

  async handleChange(event) {
    console.log(event.target);
    var name = event.target.name;

    event.preventDefault();
    await this.setState({
      newpatientPaymentModel: {
        ...this.state.newpatientPaymentModel,
        [event.target.name]: event.target.value,
      },
    });
    if (name == "paymentAmount") {
      var patientCharge = [
        ...this.state.newpatientPaymentModel.patientPaymentCharges,
      ];
      var sumAlloAmt = 0;
      var totalAmnt = 0;
      await this.state.newpatientPaymentModel.patientPaymentCharges.map(
        (charge) => {
          console.log("Charge : ", charge.allocatedAmount);
          sumAlloAmt =
            Number(sumAlloAmt) +
            (charge.allocatedAmount == null
              ? 0
              : Number(charge.allocatedAmount));
        }
      );
      console.log(sumAlloAmt);
      await this.setState({
        newpatientPaymentModel: {
          ...this.state.newpatientPaymentModel,
          allocatedAmount: sumAlloAmt,
          remainingAmount:
            this.state.newpatientPaymentModel.paymentAmount - sumAlloAmt,
          patientPaymentCharges: patientCharge,
        },
      });
    }
  }

  async handlePatientChargeChange(event, index) {
    console.log("Event  : ", event.target);
    console.log("Index : ", index);
    var patientCharge = [
      ...this.state.newpatientPaymentModel.patientPaymentCharges,
    ];
    var name = event.target.name;
    patientCharge[index][name] = event.target.value;
    var sumAlloAmt = 0;
    var totalAmnt = 0;
    await this.state.newpatientPaymentModel.patientPaymentCharges.map(
      (charge) => {
        sumAlloAmt =
          Number(sumAlloAmt) +
          (charge.allocatedAmount == null ? 0 : Number(charge.allocatedAmount));
        console.log(sumAlloAmt);
      }
    );

    this.setState({
      newpatientPaymentModel: {
        ...this.state.newpatientPaymentModel,
        allocatedAmount: sumAlloAmt,
        remainingAmount:
          this.state.newpatientPaymentModel.paymentAmount - sumAlloAmt,
        patientPaymentCharges: patientCharge,
      },
    });
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  render() {
    var paymentDate = this.state.newpatientPaymentModel.paymentDate.slice(
      0,
      10
    );
    const paymentMethod = [
      { value: "", display: "Select Status" },
      { value: "CASH", display: "Cash" },
      { value: "CHECK", display: "Check" },
    ];
    const status = [
      { value: "", display: "Select Status" },
      { value: "O", display: "Open" },
      { value: "C", display: "Close" },
    ];

    var copay,
      coInsurance,
      deductible = 0;
    let newList = [];
    this.state.newpatientPaymentModel.patientPaymentCharges.map((charge, i) => {
      var dos = charge.dos == null ? "  " : charge.dos;
      var submitDate = charge.submitDate == "" ? " " : charge.submitDate;
      var plan = charge.plan == null ? " " : charge.plan;
      var cpt = charge.cpt == null ? " " : charge.cpt;
      var billedAmount =
        charge.billedAmount == null ? " " : charge.billedAmount;
      var writeOff = charge.writeOff == null ? " " : charge.writeOff;
      var allowedAmount =
        charge.allowedAmount == null ? " " : charge.allowedAmount;
      var paidAmount = charge.paidAmount == null ? " " : charge.paidAmount;
      copay = charge.copay == null ? " " : charge.copay;
      coInsurance = charge.coInsurance == null ? " " : charge.coInsurance;
      deductible = charge.deductible == null ? " " : charge.deductible;
      var visitID = charge.visitID == null ? " " : charge.visitID;
      var chargeID = charge.chargeID == null ? " " : charge.chargeID;

      newList.push({
        dos: <div style={{ minWidth: "100px" }}>{dos}</div>,
        submitDate: <div style={{ minWidth: "100px" }}> {submitDate}</div>,
        plan: <div style={{ width: "100%" }}>{plan}</div>,
        visitID: <div style={{ minWidth: "70px" }}>{charge.visitID}</div>,
        chargeID: <div style={{ minWidth: "100px" }}>{charge.chargeID}</div>,
        cpt: cpt,
        billedAmount: (
          <div style={{ minWidth: "125px" }}>
            {billedAmount > 0 ? "$" + billedAmount : ""}
          </div>
        ),
        writeOff: (
          <div style={{ minWidth: "85px" }}>
            {writeOff > 0 ? "$" + writeOff : ""}
          </div>
        ),
        allowedAmount: (
          <div style={{ minWidth: "140px" }}>
            {allowedAmount > 0 ? "$" + allowedAmount : ""}
          </div>
        ),
        paidAmount: (
          <div style={{ minWidth: "105px" }}>
            {paidAmount > 0 ? "$" + paidAmount : ""}
          </div>
        ),
        copay: (
          <div style={{ minWidth: "60px" }}>{copay > 0 ? "$" + copay : ""}</div>
        ),
        coInsurance: coInsurance > 0 ? "$" + coInsurance : "",
        deductible: deductible > 0 ? "$" + deductible : deductible,
        allocatedAmount:
          charge.status != "C" ? (
            <input
              style={{ minWidth: "150px" }}
              type="number "
              name="allocatedAmount"
              value={charge.allocatedAmount}
              onChange={(event) => this.handlePatientChargeChange(event, i)}
            ></input>
          ) : (
            "$" + charge.allocatedAmount
          ),
      });
    });

    const data1 = {
      columns: [
        {
          label: "DOS",
          field: "dos",
          sort: "asc",
          //width: 150
        },
        {
          label: "SUBMIT DATE",
          field: "submitDate",
          sort: "asc",
          //width: 150
        },
        {
          label: "PLAN",
          field: "plan",
          sort: "asc",
          //width: 150
        },
        {
          label: "VISIT ID",
          field: "visitID",
          sort: "asc",
          //width: 150
        },
        {
          label: "CHARGE ID",
          field: "chargeID",
          sort: "asc",
          //width: 150
        },
        {
          label: "CPT",
          field: "cpt",
          sort: "asc",
          //width: 150
        },
        {
          label: "BILLED AMOUNT",
          field: "billedAmount",
          sort: "asc",
          //width: 150
        },
        {
          label: "WRITE OFF",
          field: "writeOff",
          sort: "asc",
          //width: 150
        },
        {
          label: "ALLOWED AMOUNT",
          field: "allowedAmount",
          sort: "asc",
          //width: 150
        },
        {
          label: "PAID AMOUNT",
          field: "paidAmount",
          sort: "asc",
          //width: 150
        },
        {
          label: "COPAY",
          field: "copay",
          sort: "asc",
          //width: 150
        },
        {
          label: "CO. INS",
          field: "coInsurance",
          sort: "asc",
          //width: 150
        },
        {
          label: "DEDUCTIBLE",
          field: "deductible",
          sort: "asc",
          //width: 150
        },
        {
          label: "ALLOCATION AMOUNT",
          field: "allocatedAmount",
          sort: "asc",
          //width: 150
        },
      ],
      rows: newList,
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
        <div
          class="modal fade show popupBackScreen"
          id="clientModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            // style={{ margin: "8.8rem auto" }}
            class="modal-dialog"
            role="document"
          >
            <div
              id="modalContent"
              class="modal-content"
              style={{ minHeight: "300px", maxHeight: "700px" }}
            >
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>PATIENT PAYMENT</h3>

                      <div class="float-lg-right text-right">
                        <button
                          class=" btn btn-primary mr-2"
                          type="submit"
                          // onClick={this.delete}
                          // disabled={this.isDisabled(this.props.rights.delete)}
                        >
                          Delete
                        </button>

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
                    <div class="col-md-12 mt-1 order-md-1 provider-form">
                      <div className="row">
                        <div class="col-md-4 mb-2 col-sm-4">
                          <div class="col-md-4 float-left">
                            <label for="firstName">Payment Method</label>
                          </div>
                          <div class="col-md-8  p-0 m-0 float-left">
                            <select
                              name="paymentMethod"
                              id="paymentMethod"
                              value={
                                this.state.newpatientPaymentModel.paymentMethod
                              }
                              onChange={this.handleChange}
                              style={{ width: "100%", padding: "5px" }}
                              class="provider-form form-control-user"
                            >
                              {paymentMethod.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.display}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div class="invalid-feedback">
                            {this.state.validationModel.paymentMethodValField}
                          </div>
                        </div>

                        <div class="col-md-4 mb-2 col-sm-4">
                          <div class="col-md-4 float-left">
                            <label for="firstName">Payment Date</label>
                          </div>
                          <div class="col-md-8  p-0 m-0 float-left">
                            <input
                              type="date"
                              class="provider-form w-100 form-control-user"
                              type="date"
                              name="paymentDate"
                              id="paymentDate"
                              // value={this.state.newpatientPaymentModel.paymentDate}
                              value={paymentDate}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div class="invalid-feedback">
                            {" "}
                            {this.state.validationModel.paymentDateValField}
                          </div>
                        </div>

                        <div class="col-md-4 mb-2 col-sm-4">
                          <div class="col-md-4 float-left">
                            <label for="firstName">Payment Amount</label>
                          </div>
                          <div class="col-md-8  p-0 m-0 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              placeholder="Payment Amount"
                              value={
                                this.state.newpatientPaymentModel.paymentAmount
                              }
                              name="paymentAmount"
                              id="paymentAmount"
                              onChange={this.handleChange}
                            />
                          </div>
                          <div class="invalid-feedback">
                            {this.state.validationModel.paymentAmountValField}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div class="col-md-4 mb-2 col-sm-4">
                          <div class="col-md-4 float-left">
                            <label for="firstName">Check #</label>
                          </div>
                          <div class="col-md-8  p-0 m-0 float-left">
                            <input
                              type="date"
                              class="provider-form w-100 form-control-user"
                              placeholder="Check #"
                              value={
                                this.state.newpatientPaymentModel.checkNumber
                              }
                              name="checkNumber"
                              id="checkNumber"
                              onChange={this.handleChange}
                            />
                          </div>
                          <div class="invalid-feedback">
                            {this.state.validationModel.checkNumberValField}
                          </div>
                        </div>

                        <div class="col-md-4 mb-2 col-sm-4">
                          <div class="col-md-4 float-left">
                            <label for="firstName">Description</label>
                          </div>
                          <div class="col-md-8  p-0 m-0 float-left">
                            <input
                              type="text"
                              class="provider-form w-100 form-control-user"
                              placeholder="Description"
                              value={
                                this.state.newpatientPaymentModel.description
                              }
                              name="description"
                              id="description"
                              onChange={this.handleChange}
                            />
                          </div>
                          <div class="invalid-feedback">
                            {" "}
                            {this.state.validationModel.descriptionValField}
                          </div>
                        </div>

                        <div class="col-md-4 mb-2 col-sm-4">
                          <div class="col-md-4 float-left">
                            <label for="firstName">Status</label>
                          </div>
                          <div class="col-md-8  p-0 m-0 float-left">
                            <select
                              disabled
                              name="status"
                              id="status"
                              value={this.state.newpatientPaymentModel.status}
                              onChange={this.handleChange}
                              style={{ width: "100%", padding: "5px" }}
                              class="provider-form form-control-user"
                            >
                              {status.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.display}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div class="invalid-feedback">
                            {this.state.validationModel.statusValField}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div class="col-md-4 mb-2 col-sm-4">
                          <div class="col-md-4 float-left">
                            <label for="firstName">Allocated Amount</label>
                          </div>
                          <div class="col-md-8  p-0 m-0 float-left">
                            <input
                              type="date"
                              class="provider-form w-100 form-control-user"
                              placeholder="Allocated Amount"
                              readOnly
                              type="text"
                              value={
                                this.state.newpatientPaymentModel
                                  .allocatedAmount
                              }
                              name="allocatedAmount"
                              id="paymentAmount"
                              onChange={this.handleChange}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div class="invalid-feedback">
                            {this.state.validationModel.allocatedAmountValField}
                          </div>
                        </div>

                        <div class="col-md-4 mb-2 col-sm-4">
                          <div class="col-md-4 float-left">
                            <label for="firstName">Remaining Amount</label>
                          </div>
                          <div class="col-md-8  p-0 m-0 float-left">
                            <input
                              type="date"
                              class="provider-form w-100 form-control-user"
                              placeholder="Remaining Amount"
                              readOnly
                              type="text"
                              value={
                                this.state.newpatientPaymentModel
                                  .remainingAmount
                              }
                              name="remainingAmount"
                              id="paymentAmount"
                              onChange={this.handleChange}
                            />
                          </div>
                          <div class="invalid-feedback">
                            {" "}
                            {/* {this.state.validationModel.descriptionValField} */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="card mb-4" style={{ width: "100%" }}>
                        <GridHeading Heading="OPEN SERVICE LINE ITEMS"></GridHeading>
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
                                data={data1}
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

                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={this.SavePayment}
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
                        onClick={() => this.props.onClose()}
                      >
                        Cancel
                      </button>
                    </div>

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
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.patientPaymentSearch,
          add: state.loginInfo.rights.patientPaymentCreate,
          update: state.loginInfo.rights.patientPaymentUpdate,
          delete: state.loginInfo.rights.patientPaymentDelete,
          export: state.loginInfo.rights.patientPaymentExport,
          import: state.loginInfo.rights.patientPaymentImport,
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

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(NewPatientPayment);
