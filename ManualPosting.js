import React, { Component } from 'react'
import Select from 'react-select';
import axios from 'axios';
import { MDBDataTable, MDBBtn, MDBCollapse } from 'mdbreact';
import GridHeading from './GridHeading';
import Label from "./Label";
import Input from "./Input";
import searchIcon from '../images/search-icon.png'
import refreshIcon from '../images/refresh-icon.png'
import newBtnIcon from '../images/new-page-icon.png'
import settingsIcon from '../images/setting-icon.png'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabAction, selectTabPageAction } from "../actions/selectTabAction";
import Swal from 'sweetalert2';
import { number } from 'prop-types';

import Eclips from '../images/loading_spinner.gif';
import GifLoader from 'react-gif-loader';
import { isNull } from 'util';

export class ManualPosting extends Component {
    constructor(props) {
        super(props)
        this.url = 'http://192.168.110.44/Database/api/PaymentCheck/';


        this.errorField = "errorField";



        this.validationModel = {
            checkNumberValField: "",
            checkDateValField: "",
            checkAmountValField: "",
            practiceValField: "",
            payerValField: "",
            receiverValField: "",
            allowedAmountValField: "",
            validation: false

        }
        this.paymentChargeModel = {
            "id": 0,
            "paymentVisitID": null,
            "chargeID": null,
            "charge": null,
            "cptCode": null,
            "modifier1": null,
            "modifier2": null,
            "modifier3": null,
            "modifier4": null,
            "billedAmount": null,
            "paidAmount": null,
            "revenueCode": null,
            "units": null,
            "dosFrom": null,
            "dosTo": null,
            "chargeNumber": null,
            "patientAmount": null,
            "deductableAmount": null,
            "coinsuranceAmount": null,
            "coPay": null,
            "writeoffAmount": null,
            "allowedAmount": null,

            "adjustmentCodeID1": "",
            "adjustmentCodeObj1": {},
            "adjustmentAmount1": "",
            "groupCode1": "",
            groupCode1ValField1: "",

            "adjustmentCodeID2": "",
            adjustmentCodeObj2: {},
            "adjustmentAmount2": "",
            "groupCode2": "",
            groupCode1ValField2: "",

            "adjustmentCodeID3": "",
            adjustmentCodeObj3: {},
            "adjustmentAmount3": "",
            "groupCode3": "",
            groupCode1ValField3: "",

            "adjustmentCodeID4": null,
            "adjsutmentAmount4": null,
            "groupCode4": null,

            "adjustmentCodeID5": null,
            "adjsutmentAmount5": null,
            "groupCode5": null,
            "remarkCodeID1": null,
            remarkCodeObj1: {},
            "remarkCodeID2": null,
            remarkCodeObj2: {},
            "remarkCodeID3": null,
            remarkCodeObj3: {},
            "remarkCodeID4": 1,
            "remarkCodeID5": 1,

            allowedAmountValField: "",
        }

        this.paymentVisitModel = {
            "id": 0,
            "paymentCheckID": null,
            "visitID": 146,
            "visit": null,
            "patientID": null,
            "patient": null,
            batchDocumentID: null,
            pageNumber: "",
            "claimNumber": null,
            "statusCode": null,
            "billedAmount": null,
            "paidAmount": null,
            "patientAmount": null,
            allowedAmount: "",
            writeOffAmount: "",
            "payerICN": null,
            "patientLastName": null,
            "patientFIrstName": null,
            "insuredLastName": null,
            "insuredFirstName": null,
            "insuredID": null,
            "provLastName": null,
            "provFirstName": null,
            "provNPI": null,
            "forwardedPayerName": null,
            "forwardedPayerID": null,
            "claimStatementFromDate": null,
            "claimStatementToDate": null,
            "payerReceivedDate": null,

            "paymentCharge": []
        }

        this.paymentCheckModel = {
            "id": 0,
            "receiverID": null,
            "receiver": null,
            "practiceID": null,
            "facility": null,
            "checkNumber": null,
            "checkDate": null,
            "checkAmount": null,
            "transactionCode": null,
            "creditDebitFlag": null,
            "paymentMethod": null,
            "payerName": null,
            "status": null,
            "appliedAmount": null,
            "postedAmount": null,
            "payerID": null,
            "payerAddress": null,
            "payerCity": null,
            "payerState": null,
            "payerZipCode": null,
            "reF_2U_ID": null,
            "payerContactPerson": null,
            "payerContactNumber": null,
            "payeeName": null,
            "payeeNPI": null,
            "payeeAddress": null,
            "payeeCity": null,
            "payeeState": null,
            "payeeZipCode": null,
            "payeeTaxID": null,
            "numberOfVisits": 0,
            "numberOfPatients": 0,

            "paymentVisit": []
        }

        this.searchModel = {

            checkNumber: '',
            checkDate: '',
            checkAmount: '',

            appliedAmount: '',
            postedAmount: '',
            status: '',

            practiceID: '',
            payerID: '',

            receiverID: '',
        }

        this.state = {
            paymentCheckModel: this.paymentCheckModel,
            paymentVisitModel: [],
            paymentChargeModel: [],
            searchModel: this.searchModel,
            validationModel: this.validationModel,
            id: 0,
            editId: this.props.paymentCheckId,
            chargesData: [],
            showPopup: false,
            revData: [],
            facData: [],
            adjCodeOptions: [],
            remarkOptions: [],
            collapseID: 0,
            loading: false
        }

        this.addPaymentCheckRow = this.addPaymentCheckRow.bind(this);
        this.handleEnterKey = this.handleEnterKey.bind(this);
        this.handlePaymentChargeChange = this.handlePaymentChargeChange.bind(this);
        this.handlePaymentCheckChange = this.handlePaymentCheckChange.bind(this);
        this.saveManualPosting = this.saveManualPosting.bind(this);
        this.handleRemarkCodeChange = this.handleRemarkCodeChange.bind(this);
        this.handlepaymentCheckAmountChange = this.handlepaymentCheckAmountChange.bind(this);
        this.handlepaymentVisitAmountChange = this.handlepaymentVisitAmountChange.bind(this);
        this.handlepaymentChargeAmountChange = this.handlepaymentChargeAmountChange.bind(this);
        this.deletePaymentCheckRow = this.deletePaymentCheckRow.bind(this);
        this.deleteCheck = this.deleteCheck.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    async componentWillMount() {
        await axios.get(this.url + 'GetProfiles')
            .then(response => {
                this.setState({
                    facData: response.data.practice,
                    revData: response.data.receiver,
                    adjCodeOptions: response.data.adjustmentCodes,
                    remarkOptions: response.data.remarkCodes
                })

            }).catch(error => {
                console.log(error);
            });

        if (this.props.paymentCheckId > 0) {
            await axios.get(this.url + "findpaymentCheck/" + this.props.paymentCheckId)
                .then(response => {
                    console.log("Payment Check Response  : ", response.data);

                    var paymentCheck = { ...response.data };


                    let patRes = 0;
                    paymentCheck.paymentVisit.map((paymentVisit, visitIndex) => {
                        patRes = 0;
                        paymentVisit.paymentCharge.map((paymentCharge, i) => {

                            if (paymentCharge.copay == undefined || paymentCharge.copay == "") {
                                patRes += 0;
                            } else {
                                patRes += Number(parseFloat(paymentCharge.copay).toFixed(2));
                            }

                            if (paymentCharge.deductableAmount == undefined || paymentCharge.deductableAmount == "") {
                                patRes += 0;
                            } else {
                                patRes += Number(parseFloat(paymentCharge.deductableAmount).toFixed(2));
                            }

                            if (paymentCharge.coinsuranceAmount == undefined || paymentCharge.coinsuranceAmount == "") {
                                patRes += 0;
                            } else {
                                patRes += Number(parseFloat(paymentCharge.coinsuranceAmount).toFixed(2));
                            }


                            var adjCodeObj1 = {};
                            adjCodeObj1 = this.state.adjCodeOptions.filter(option => option.id == paymentCharge.adjustmentCodeID1);
                            paymentCharge.adjustmentCodeObj1 = adjCodeObj1[0];

                            var adjCodeObj2 = {};
                            adjCodeObj2 = this.state.adjCodeOptions.filter(option => option.id == paymentCharge.adjustmentCodeID2);
                            paymentCharge.adjustmentCodeObj2 = adjCodeObj2[0];

                            var adjCodeObj3 = {};
                            adjCodeObj3 = this.state.adjCodeOptions.filter(option => option.id == paymentCharge.adjustmentCodeID3);
                            paymentCharge.adjustmentCodeObj3 = adjCodeObj3[0];

                            var remarkCodeObj1 = {};
                            remarkCodeObj1 = this.state.remarkOptions.filter(option => option.id == paymentCharge.remarkCodeID1);
                            paymentCharge.remarkCodeObj1 = remarkCodeObj1[0];

                            var remarkCodeObj2 = {};
                            remarkCodeObj2 = this.state.remarkOptions.filter(option => option.id == paymentCharge.remarkCodeID2);
                            paymentCharge.remarkCodeObj2 = remarkCodeObj2[0];

                            var remarkCodeObj3 = {};
                            remarkCodeObj3 = this.state.remarkOptions.filter(option => option.id == paymentCharge.remarkCodeID3);
                            paymentCharge.remarkCodeObj3 = remarkCodeObj3[0];
                        });
                        paymentVisit.patientAmount = patRes;

                    });


                    console.log("Payment Check  : ", paymentCheck);

                    this.setState({ paymentCheckModel: paymentCheck })

                }).catch(error => {
                    console.log(error);
                    Swal.fire("No Record Found", "", "error")
                });
        }



    }

    //payment check change
    handlePaymentCheckChange(event) {

        event.preventDefault();
        this.setState({

            paymentCheckModel: {
                ...this.state.paymentCheckModel,
                [event.target.name]: event.target.value
            }
        });
    }

    //payment check amount
    handlepaymentCheckAmountChange(e) {

        const amount = e.target.value;
        var regexp = /^\d+(\.(\d{1,2})?)?$/;
        if (regexp.test(amount)) {
            this.setState({
                paymentCheckModel: {
                    ...this.state.paymentCheckModel,
                    [e.target.name]: amount
                }
            })
        }
        else if (amount == "") {
            this.setState({
                paymentCheckModel: {
                    ...this.state.paymentCheckModel,
                    [e.target.name]: ""
                }
            });
        }
    }

    //payment visit change
    handlePaymentVisitChange = event => {
        event.preventDefault();

        const index = event.target.id
        const name = event.target.name;
        var paymentVisit = [...this.state.paymentCheckModel.paymentVisit];
        paymentVisit[index][name] = event.target.value

        this.setState({
            paymentCheckModel: {
                ...this.state.paymentCheckModel,
                paymentVisit: paymentVisit
            }
        });

        // const index = event.target.id
        // const name = event.target.name;
        // var paymentVisit = {...this.state.paymentCheckModel.paymentVisit[index]};
        // paymentVisit[name] = event.target.value

        //  this.setState({
        //     paymentCheckModel: {
        //       ...this.state.paymentCheckModel,
        //       paymentVisit : [
        //         ...this.state.paymentCheckModel.paymentVisit.slice(0 , index),
        //        Object.assign({}, this.state.paymentCheckModel.paymentVisit[index] , paymentVisit),
        //        ...this.state.paymentCheckModel.paymentVisit.slice(index+1)
        //       ]
        //     }
        //   });

    };

    //payment visit amount change
    handlepaymentVisitAmountChange(e) {
        e.preventDefault();
        const index = e.target.id
        const name = e.target.name;
        var paymentVisit = [...this.state.paymentCheckModel.paymentVisit];
        const amount = e.target.value;
        var regexp = /^\d+(\.(\d{1,2})?)?$/;
        if (regexp.test(amount)) {

            paymentVisit[index][name] = amount;
            this.setState({
                paymentCheckModel: {
                    ...this.state.paymentCheckModel,
                    paymentVisit: paymentVisit
                }
            });

        }
        else if (amount == "") {
            paymentVisit[index][name] = "";
            this.setState({
                paymentCheckModel: {
                    ...this.state.paymentCheckModel,
                    paymentVisit: paymentVisit
                }
            });
        }

    }
    //payment charge change
    async handlePaymentChargeChange(event, visitIndex, chargeIndex) {
        event.preventDefault();


        const index = event.target.id
        const name = event.target.name;
        var paymentVisits = [...this.state.paymentCheckModel.paymentVisit];

        paymentVisits[visitIndex].paymentCharge[chargeIndex][name] = event.target.value;

        var patRes = 0;
        var allowedAmount = 0;
        await paymentVisits[visitIndex].paymentCharge.map((paymentCharge, i) => {
            allowedAmount = 0;
            if (paymentCharge.copay == undefined || paymentCharge.copay == "") {
                patRes += 0;
                allowedAmount += 0;
            } else {
                patRes += parseFloat(paymentCharge.copay);
                allowedAmount += parseFloat(paymentCharge.copay);
            }
            if (paymentCharge.deductableAmount == undefined || paymentCharge.deductableAmount == "") {
                patRes += 0;
                allowedAmount += 0;
            } else {

                patRes += parseFloat(paymentCharge.deductableAmount);
                allowedAmount += parseFloat(paymentCharge.deductableAmount)
            }
            if (paymentCharge.coinsuranceAmount == undefined || paymentCharge.coinsuranceAmount == "") {
                patRes += 0;
                allowedAmount += 0;
            } else {

                patRes += parseFloat(paymentCharge.coinsuranceAmount);
                allowedAmount += parseFloat(paymentCharge.coinsuranceAmount);
            }

            paymentVisits[visitIndex].paymentCharge[chargeIndex].allowedAmount = allowedAmount.toFixed(2);
            //patRes += parseInt(paymentCharge.copay , 10) + parseInt(paymentCharge.deductableAmount , 10) + parseInt(paymentCharge.coinsuranceAmount , 10)
        });
        //paymentVisits[visitIndex].patientAmount = patRes;
        paymentVisits[visitIndex].allowedAmount = allowedAmount.toFixed(2);


        this.setState({
            paymentCheckModel: {
                ...this.state.paymentCheckModel,
                paymentVisit: paymentVisits
            }
        });
    }

    //payment charge amount change
    async handlepaymentChargeAmountChange(e, visitIndex, chargeIndex) {
        e.preventDefault();
        const index = e.target.id
        const name = e.target.name;
        var paymentVisits = [...this.state.paymentCheckModel.paymentVisit];

        //regex for decimal input upto 2 decimal points
        const amount = e.target.value;
        var regexp = /^\d+(\.(\d{1,2})?)?$/;
        if (regexp.test(amount)) {
            console.log("State Test : ", paymentVisits[visitIndex].paymentCharge[chargeIndex][name])
            paymentVisits[visitIndex].paymentCharge[chargeIndex][name] = amount;
            console.log("State Test : ", paymentVisits[visitIndex].paymentCharge[chargeIndex][name])

            var patRes = 0;
            var allowedAmount = 0;
            var totalAllowedAmount = 0;
            var paidAmount = 0;
            var writeOffAmount = 0;
            var totalWriteOffAmount = 0;
            paymentVisits[visitIndex].paymentCharge.map((paymentCharge, i) => {
                allowedAmount = 0;
                writeOffAmount = 0;

                //COPAY
                if (paymentCharge.copay == undefined || paymentCharge.copay == "") {
                    patRes += 0;
                    allowedAmount += 0;

                } else {
                    patRes += Number(parseFloat(paymentCharge.copay).toFixed(2));
                    allowedAmount += Number(parseFloat(paymentCharge.copay).toFixed(2));
                }
                //Deductable Amount
                if (paymentCharge.deductableAmount == undefined || paymentCharge.deductableAmount == "") {
                    patRes += 0;
                    allowedAmount += 0;
                } else {

                    patRes += Number(parseFloat(paymentCharge.deductableAmount).toFixed(2));
                    allowedAmount += Number(parseFloat(paymentCharge.deductableAmount).toFixed(2))
                }
                // CO Insurance
                if (paymentCharge.coinsuranceAmount == undefined || paymentCharge.coinsuranceAmount == "") {
                    patRes += 0;
                    allowedAmount += 0;
                } else {

                    patRes += Number(parseFloat(paymentCharge.coinsuranceAmount).toFixed(2));
                    allowedAmount += Number(parseFloat(paymentCharge.coinsuranceAmount).toFixed(2));
                }
                //Paid AMount 
                if (paymentCharge.paidAmount == undefined || paymentCharge.paidAmount == "") {
                    paidAmount += 0;
                    allowedAmount += 0;
                } else {
                    paidAmount += Number(parseFloat(paymentCharge.paidAmount).toFixed(2));
                    allowedAmount += Number(parseFloat(paymentCharge.paidAmount).toFixed(2));
                }

                //writeOff
                if (paymentCharge.adjustmentAmount1 == undefined || paymentCharge.adjustmentAmount1 == "") {
                    writeOffAmount += 0;
                } else {
                    writeOffAmount += Number(parseFloat(paymentCharge.adjustmentAmount1).toFixed(2));
                }
                if (paymentCharge.adjustmentAmount2 == undefined || paymentCharge.adjustmentAmount2 == "") {
                    writeOffAmount += 0;
                } else {
                    writeOffAmount += Number(parseFloat(paymentCharge.adjustmentAmount2).toFixed(2));
                }
                if (paymentCharge.adjustmentAmount3 == undefined || paymentCharge.adjustmentAmount3 == "") {
                    writeOffAmount += 0;
                } else {
                    writeOffAmount += Number(parseFloat(paymentCharge.adjustmentAmount3).toFixed(2));
                }
                //paymentVisits[visitIndex].paymentCharge[chargeIndex].allowedAmount = Number(allowedAmount.toFixed(2));
                paymentCharge.allowedAmount = Number(parseFloat(allowedAmount).toFixed(2));
                paymentCharge.writeoffAmount = Number(parseFloat(writeOffAmount).toFixed(2));
                totalAllowedAmount += Number(parseFloat(allowedAmount).toFixed(2));

                totalWriteOffAmount += Number(parseFloat(writeOffAmount).toFixed(2));

                //patRes += parseInt(paymentCharge.copay , 10) + parseInt(paymentCharge.deductableAmount , 10) + parseInt(paymentCharge.coinsuranceAmount , 10)
            });
            paymentVisits[visitIndex].patientAmount = Number(patRes.toFixed(2));
            paymentVisits[visitIndex].paidAmount = Number(paidAmount.toFixed(2));
            paymentVisits[visitIndex].writeOffAmount = Number(Number(totalWriteOffAmount).toFixed(2));
            paymentVisits[visitIndex].allowedAmount = totalAllowedAmount;


            this.setState({
                paymentCheckModel: {
                    ...this.state.paymentCheckModel,
                    paymentVisit: paymentVisits
                }
            });
        }
        else if (amount == "") {

            console.log("State Test : ", paymentVisits[visitIndex].paymentCharge[chargeIndex][name])
            paymentVisits[visitIndex].paymentCharge[chargeIndex][name] = Number(0);
            console.log("State Test : ", paymentVisits[visitIndex].paymentCharge[chargeIndex][name])

            var patRes = 0;
            var allowedAmount = 0;
            var paidAmount = 0;
            var writeOffAmount = 0;
            var totalWriteOffAmount = 0;
            var totalAllowedAmount = 0;
            await paymentVisits[visitIndex].paymentCharge.map((paymentCharge, i) => {
                allowedAmount = 0;
                writeOffAmount = 0;
                if (paymentCharge.copay == undefined || paymentCharge.copay == "") {
                    patRes += 0;
                    allowedAmount += 0;

                } else {
                    patRes += Number(parseFloat(paymentCharge.copay).toFixed(2));
                    allowedAmount += Number(parseFloat(paymentCharge.copay).toFixed(2));
                }
                if (paymentCharge.deductableAmount == undefined || paymentCharge.deductableAmount == "") {
                    patRes += 0;
                    allowedAmount += 0;
                } else {

                    patRes += Number(parseFloat(paymentCharge.deductableAmount).toFixed(2));
                    allowedAmount += Number(parseFloat(paymentCharge.deductableAmount).toFixed(2))
                }
                if (paymentCharge.coinsuranceAmount == undefined || paymentCharge.coinsuranceAmount == "") {
                    patRes += 0;
                    allowedAmount += 0;
                } else {

                    patRes += Number(parseFloat(paymentCharge.coinsuranceAmount).toFixed(2));
                    allowedAmount += Number(parseFloat(paymentCharge.coinsuranceAmount).toFixed(2));
                }

                if (paymentCharge.paidAmount == undefined || paymentCharge.paidAmount == "") {
                    paidAmount = Number(parseFloat(paymentCharge.paidAmount).toFixed(2)) + Number(0);
                    allowedAmount = Number(parseFloat(paymentCharge.paidAmount).toFixed(2)) + Number(0);
                } else {
                    paidAmount += Number(parseFloat(paymentCharge.paidAmount).toFixed(2));
                    allowedAmount += Number(parseFloat(paymentCharge.paidAmount).toFixed(2));
                }

                //writeOff
                if (paymentCharge.adjustmentAmount1 == undefined || paymentCharge.adjustmentAmount1 == "") {
                    writeOffAmount += 0;
                } else {
                    writeOffAmount += Number(parseFloat(paymentCharge.adjustmentAmount1).toFixed(2));
                }
                if (paymentCharge.adjustmentAmount2 == undefined || paymentCharge.adjustmentAmount2 == "") {
                    writeOffAmount += 0;
                } else {
                    writeOffAmount += Number(parseFloat(paymentCharge.adjustmentAmount2).toFixed(2));
                }
                if (paymentCharge.adjustmentAmount3 == undefined || paymentCharge.adjustmentAmount3 == "") {
                    writeOffAmount += 0;
                } else {
                    writeOffAmount += Number(parseFloat(paymentCharge.adjustmentAmount3).toFixed(2));
                }

                paymentCharge.allowedAmount = Number(parseFloat(allowedAmount).toFixed(2));
                totalAllowedAmount += Number(parseFloat(allowedAmount).toFixed(2));
                paymentCharge.writeoffAmount = Number(parseFloat(writeOffAmount).toFixed(2));
                totalWriteOffAmount += Number(parseFloat(writeOffAmount).toFixed(2));

                //patRes += parseInt(paymentCharge.copay , 10) + parseInt(paymentCharge.deductableAmount , 10) + parseInt(paymentCharge.coinsuranceAmount , 10)
            });
            paymentVisits[visitIndex].patientAmount = Number(Number(patRes).toFixed(2));
            paymentVisits[visitIndex].paidAmount = Number(Number(paidAmount).toFixed(2));
            paymentVisits[visitIndex].writeOffAmount = Number(Number(totalWriteOffAmount).toFixed(2));
            paymentVisits[visitIndex].allowedAmount = totalAllowedAmount;
            paymentVisits[visitIndex].paymentCharge[chargeIndex][name] = "";
            this.setState({
                paymentCheckModel: {
                    ...this.state.paymentCheckModel,
                    paymentVisit: paymentVisits
                }
            });
        }

    }

    //Enter Kay handler to get Visit 
    async handleEnterKey(event, index) {
        if (event.charCode == 13) {
            var paymentVisit = { ...this.state.paymentCheckModel.paymentVisit[index] };
            paymentVisit.paymentCharge = [];
            var billedAmount = 0;

            axios.get("http://192.168.110.44/Database/api/Visit/FindCharge/" + this.state.paymentCheckModel.paymentVisit[index].visitID).
                then(response => {
                    response.data.map(charge => {
                        var paymentChargeModel = { ...this.paymentChargeModel };
                        paymentChargeModel.chargeID = charge.id;
                        paymentChargeModel.dosFrom = charge.dateOfServiceFrom ? charge.dateOfServiceFrom.replace("T00:00:00", "") : "";
                        paymentChargeModel.cptCode = charge.cptid;
                        paymentChargeModel.billedAmount = charge.totalAmount;
                        paymentVisit.paymentCharge.push(paymentChargeModel);

                        //billed amount in payment visit
                        billedAmount += parseFloat(charge.totalAmount);
                        paymentVisit.patientID = response.data[0].patientID

                    });

                    paymentVisit.billedAmount = billedAmount;



                    this.setState({
                        paymentCheckModel: {
                            ...this.state.paymentCheckModel,
                            paymentVisit: [
                                ...this.state.paymentCheckModel.paymentVisit.slice(0, index),
                                Object.assign({}, this.state.paymentCheckModel.paymentVisit[index], paymentVisit),
                                ...this.state.paymentCheckModel.paymentVisit.slice(index + 1)
                            ]
                        }
                    })
                }).catch(error => {
                    console.log("Error : ", error)
                })
        }

    }

    //Adjusment Code Change in payment charge
    handleAdjCodeChange = (adjCodeObj, id, adjObj, visitIndex, chargeIndex) => {




        if (adjCodeObj) {
            var paymentCheck = { ...this.state.paymentCheckModel };
            paymentCheck.paymentVisit[visitIndex].paymentCharge[chargeIndex][id] = adjCodeObj.id;
            paymentCheck.paymentVisit[visitIndex].paymentCharge[chargeIndex][adjObj] = adjCodeObj;

            this.setState(
                {
                    paymentCheckModel: paymentCheck
                }
            );
        } else {
            //   this.setState(
            //     {    
            //      visitModel : {
            //        ...this.state.visitModel  ,
            //         [id] : null,
            //         [icdObj] : {}
            //    }
            //   });

        }

    };

    //Remark Code Change in payment charge
    handleRemarkCodeChange = (remarkCodeObj, id, remarkObj, visitIndex, chargeIndex) => {



        if (remarkCodeObj) {
            var paymentCheck = { ...this.state.paymentCheckModel };
            paymentCheck.paymentVisit[visitIndex].paymentCharge[chargeIndex][id] = remarkCodeObj.id;
            paymentCheck.paymentVisit[visitIndex].paymentCharge[chargeIndex][remarkObj] = remarkCodeObj;
            this.setState(
                {
                    paymentCheckModel: paymentCheck
                }
            );
        } else {
            //   this.setState(
            //     {    
            //      visitModel : {
            //        ...this.state.visitModel  ,
            //         [id] : null,
            //         [icdObj] : {}
            //    }
            //   });

        }

    };

    //check is null
    isNull(value) {
        if (
            value === "" ||
            value === null ||
            value === undefined ||
            value === "Please Select" ||
            value.length == 0
        )
            return true;
        else return false;
    }


    isAllNull(value1, value2, value3) {
        if (this.isNull(value1) && this.isNull(value2) && this.isNull(value3))
            return true;
        else return false;
    }

    isAllHaveValue(value1, value2, value3) {
        if (this.isNull(value1) == false && this.isNull(value2) == false && this.isNull(value3) == false)
            return true;
        else return false;
        // if (array.every(Boolean)) {
        //     return true
        // } else return false;
    }


    //SAVE Payment Check
    async saveManualPosting(e) {
        e.preventDefault();
        console.log("PaymentCheck Model : ", this.state.paymentCheckModel)

        this.setState({ loading: true })

        //PAYMENT VISIT VALIDATIONS                    
        var myVal = this.validationModel;
        myVal.validation = false;

        //paymtn visit practice  validation
        if (this.isNull(this.state.paymentCheckModel.practiceID)) {
            myVal.practiceValField = <span className="validationMsg">Select Practice</span>;
            myVal.validation = true;
        } else {
            myVal.practiceValField = "";
            if (myVal.validation === false) myVal.validation = false;
        }

        //Payment visit payer  validation
        if (this.isNull(this.state.paymentCheckModel.payerID)) {
            myVal.payerValField = <span className="validationMsg">Enter PayerID</span>;
            myVal.validation = true;
        } else {
            myVal.payerValField = "";
            if (myVal.validation === false) myVal.validation = false;
        }

        //Paymetn visit practice  validation
        if (this.isNull(this.state.paymentCheckModel.receiverID)) {
            myVal.receiverValField = <span className="validationMsg">Select Receiver</span>;
            myVal.validation = true;
        } else {
            myVal.receiverValField = "";
            if (myVal.validation === false) myVal.validation = false;
        }
        //Paymetn visit check number  validation
        if (this.isNull(this.state.paymentCheckModel.checkNumber)) {
            myVal.checkNumberValField = <span className="validationMsg">Enter Check Number</span>;
            myVal.validation = true;
        } else {
            myVal.checkNumberValField = "";
            if (myVal.validation === false) myVal.validation = false;
        }
        //Payment visit check date  validation
        if (this.isNull(this.state.paymentCheckModel.checkDate)) {
            myVal.checkDateValField = <span className="validationMsg">Enter Check Date</span>;
            myVal.validation = true;
        } else {
            myVal.checkDateValField = "";
            if (myVal.validation === false) myVal.validation = false;
        }

        //Paymetn check amount  validation
        if (this.isNull(this.state.paymentCheckModel.checkAmount)) {
            myVal.checkAmountValField = <span className="validationMsg">Enter Check Amount</span>;
            myVal.validation = true;
        } else {
            myVal.checkAmountValField = "";
            if (myVal.validation === false) myVal.validation = false;
        }

        //Payment check validations set state
        this.setState({
            validationModel: myVal
        });

        //If validation field is true then return 
        if (myVal.validation === true) {
            this.setState({ loading: false });
            Swal.fire(
                "SOMETHING WRONG",
                "Please Select All Fields Properly",
                "error"
            );
            return;
        }

        //Atlest 1 visit in payment check error message
        if (this.state.paymentCheckModel.paymentVisit.length <= 0) {
            this.setState({ loading: false })
            Swal.fire(
                "SOMETHING WRONG",
                "Please Enter Atleat 1 Visit",
                "error"
            );
            return;
        }

        //Atleast 1 charge in each  visit error message
        for (var i = 0; i < this.state.paymentCheckModel.paymentVisit.length; i++) {

            if (this.state.paymentCheckModel.paymentVisit[i].paymentCharge.length <= 0) {
                this.setState({ loading: false })
                Swal.fire(
                    "SOMETHING WRONG",
                    "Please Enter Atleat 1 Charge in Each Visit",
                    "error"
                );
                return;
            }
        }

        //PAYMENT CHARGE VALIDATIONS

        var billedAmountValidation = false;
        var adjSeqValidation = false;
        var paymentVisits = [...this.state.paymentCheckModel.paymentVisit];
        await paymentVisits.map((paymentVisit, i) => {
            var totalWriteOff = 0;
            paymentVisit.paymentCharge.map((paymentCharge, j) => {
                totalWriteOff = 0;
                if (paymentCharge.adjustmentAmount1 == undefined || paymentCharge.adjustmentAmount1 == "") {
                    totalWriteOff += 0;
                } else {
                    totalWriteOff += Number(parseFloat(paymentCharge.adjustmentAmount1).toFixed(2));
                }
                if (paymentCharge.adjustmentAmount2 == undefined || paymentCharge.adjustmentAmount2 == "") {
                    totalWriteOff += 0;
                } else {
                    totalWriteOff += Number(parseFloat(paymentCharge.adjustmentAmount2).toFixed(2));
                }
                if (paymentCharge.adjustmentAmount3 == undefined || paymentCharge.adjustmentAmount3 == "") {
                    totalWriteOff += 0;
                } else {
                    totalWriteOff += parseFloat(paymentCharge.adjustmentAmount3).toFixed(2);
                }

                //Billed Amount Validation
                var copay = 0;
                var coIns = 0;
                var deduct = 0;
                var paid = 0;

                if (paymentCharge.copay == undefined || paymentCharge.copay == "") {
                    copay += 0;
                } else {
                    copay += Number(parseFloat(paymentCharge.copay).toFixed(2));
                }
                if (paymentCharge.deductableAmount == undefined || paymentCharge.deductableAmount == "") {
                    deduct += 0;
                } else {

                    deduct += Number(parseFloat(paymentCharge.deductableAmount).toFixed(2));
                }
                if (paymentCharge.coinsuranceAmount == undefined || paymentCharge.coinsuranceAmount == "") {
                    coIns += 0;
                } else {

                    coIns += Number(parseFloat(paymentCharge.coinsuranceAmount).toFixed(2));
                }
                if (paymentCharge.paidAmount == undefined || paymentCharge.paidAmount == "") {
                    paid += 0;
                } else {
                    paid += Number(parseFloat(paymentCharge.paidAmount).toFixed(2));
                }

                if ((paid + copay + coIns + deduct + Number(parseFloat(totalWriteOff).toFixed(2))) != Number(parseFloat(paymentCharge.billedAmount).toFixed(2))) {
                    paymentCharge.billedAmountValField = <span className="validationMsg">Amounts Are Not Equal</span>
                    billedAmountValidation = true;
                } else {

                    paymentCharge.billedAmountValField = "";
                    billedAmountValidation = false;

                }

                console.log("groupCode1 : ", paymentCharge.groupCode1)
                console.log("adjustmentCodeID1 : ", paymentCharge.adjustmentCodeID1)
                console.log("adjustmentAmount1 : ", paymentCharge.adjustmentAmount1)

                //Adjustment Column 1  Sequence Check
                // if ((((paymentCharge.adjustmentCodeID1 != "") || (paymentCharge.adjustmentCodeID1 != null) || (paymentCharge.adjustmentCodeID1 != undefined)) &&
                //     ((paymentCharge.groupCode1 == "") || (paymentCharge.groupCode1 == null) || (paymentCharge.groupCode1 == undefined))) ||
                //     (((paymentCharge.adjustmentAmount1 != "") || (paymentCharge.adjustmentAmount1 != null) || (paymentCharge.adjustmentAmount1 != undefined) || (paymentCharge.adjustmentAmount1 > 0)) &&
                //         ((paymentCharge.adjustmentCodeID1 == "") || (paymentCharge.adjustmentCodeID1 == null) || (paymentCharge.adjustmentCodeID1 == undefined)))) {
                //     paymentCharge.groupCode1ValField1 = <span className="validationMsg">Please Enter Fields in Sequence1</span>
                //     adjSeqValidation = true;
                // } else {
                //     paymentCharge.groupCode1ValField1 = "";
                //     adjSeqValidation = false;
                // }


                // //Adjustment Column 2  Sequence Check
                // if ((((paymentCharge.adjustmentCodeID2 != "") || (paymentCharge.adjustmentCodeID2 != null) || (paymentCharge.adjustmentCodeID2 != undefined)) &&
                //     ((paymentCharge.groupCode2 == "") || (paymentCharge.groupCode2 == null) || (paymentCharge.groupCode2 == undefined))) ||
                //     (((paymentCharge.adjustmentAmount2 != "") || (paymentCharge.adjustmentAmount2 != null) || (paymentCharge.adjustmentAmount2 != undefined) || (paymentCharge.adjustmentAmount2 > 0)) &&
                //         ((paymentCharge.adjustmentCodeID2 == "") || (paymentCharge.adjustmentCodeID2 == null) || (paymentCharge.adjustmentCodeID2 == undefined)))) {
                //     paymentCharge.groupCode1ValField2 = <span className="validationMsg">Please Enter Fields in Sequence1</span>
                //     adjSeqValidation = true;
                // } else {
                //     paymentCharge.groupCode1ValField2 = "";
                //     adjSeqValidation = false;
                // }

                // //Adjustment Column 3  Sequence Check
                // if ((((paymentCharge.adjustmentCodeID3 != "") || (paymentCharge.adjustmentCodeID3 != null) || (paymentCharge.adjustmentCodeID3 != undefined)) &&
                //     ((paymentCharge.groupCode3 == "") || (paymentCharge.groupCode3 == null) || (paymentCharge.groupCode3 == undefined))) ||
                //     (((paymentCharge.adjustmentAmount3 != "") || (paymentCharge.adjustmentAmount3 != null) || (paymentCharge.adjustmentAmount3 != undefined) || (paymentCharge.adjustmentAmount3 > 0)) &&
                //         ((paymentCharge.adjustmentCodeID3 == "") || (paymentCharge.adjustmentCodeID3 == null) || (paymentCharge.adjustmentCodeID3 == undefined)))) {
                //     paymentCharge.groupCode1ValField3 = <span className="validationMsg">Please Enter Fields in Sequence1</span>
                //     adjSeqValidation = true;
                // } else {
                //     paymentCharge.groupCode1ValField3 = "";
                //     adjSeqValidation = false;
                // }


                if (this.isAllHaveValue(paymentCharge.adjustmentCodeID1, paymentCharge.groupCode1, paymentCharge.adjustmentAmount1) ||
                    this.isAllNull(paymentCharge.adjustmentCodeID1, paymentCharge.groupCode1, paymentCharge.adjustmentAmount1)) {
                    paymentCharge.groupCode1ValField1 = "";
                    adjSeqValidation = false;
                } else {
                    paymentCharge.groupCode1ValField1 = <span className="validationMsg">Please fill all fields</span>
                    adjSeqValidation = true;
                }

                if (adjSeqValidation == false &&
                    (this.isAllHaveValue([paymentCharge.adjustmentCodeID2, paymentCharge.groupCode2, paymentCharge.adjustmentAmount2]) ||
                        this.isAllNull([paymentCharge.adjustmentCodeID2, paymentCharge.groupCode2, paymentCharge.adjustmentAmount2]))
                ) {
                    paymentCharge.groupCode1ValField2 = "";
                    adjSeqValidation = false;
                } else {
                    paymentCharge.groupCode1ValField2 = <span className="validationMsg">Please fill all fields</span>
                    adjSeqValidation = true;
                }

                if (adjSeqValidation == false &&
                    (this.isAllHaveValue([paymentCharge.adjustmentCodeID3, paymentCharge.groupCode3, paymentCharge.adjustmentAmount3]) ||
                        this.isAllNull(paymentCharge.adjustmentCodeID3, paymentCharge.groupCode3, paymentCharge.adjustmentAmount3))
                ) {
                    paymentCharge.groupCode1ValField3 = "";
                    adjSeqValidation = false;
                } else {
                    paymentCharge.groupCode1ValField3 = <span className="validationMsg">Please fill all fields</span>
                    adjSeqValidation = true;
                }

                if (adjSeqValidation == false &&
                    (this.isNull(paymentCharge.adjustmentCodeID1) && !this.isNull(paymentCharge.adjustmentCodeID2))
                ) {
                    paymentCharge.groupCode1ValField2 = <span className="validationMsg">Please add adjustments in sequence</span>
                    adjSeqValidation = true;
                } else {
                    paymentCharge.groupCode1ValField2 = "";
                    adjSeqValidation = false;
                }

                if (adjSeqValidation == false &&
                    (this.isNull(paymentCharge.adjustmentCodeID1) && !this.isNull(paymentCharge.adjustmentCodeID3))
                ) {
                    paymentCharge.groupCode1ValField3 = <span className="validationMsg">Please add adjustments in sequence</span>
                    adjSeqValidation = true;
                } else {
                    paymentCharge.groupCode1ValField3 = "";
                    adjSeqValidation = false;
                }

                if (adjSeqValidation == false &&
                    (this.isNull(paymentCharge.adjustmentCodeID2) && !this.isNull(paymentCharge.adjustmentCodeID3))
                ) {
                    paymentCharge.groupCode1ValField3 = <span className="validationMsg">Please add adjustments in sequence</span>
                    adjSeqValidation = true;
                } else {
                    paymentCharge.groupCode1ValField3 = "";
                    adjSeqValidation = false;
                }

            });
        });

        await this.setState({
            paymentCheckModel: {
                ...this.state.paymentCheckModel,
                paymentVisit: paymentVisits
            }
        });


        var totalPaidAmount = 0;
        await paymentVisits.map((paymentVisit, i) => {
            paymentVisit.paymentCharge.map((paymentCharge, j) => {
                totalPaidAmount += Number(parseFloat(paymentCharge.paidAmount).toFixed(2));
            });
        });

        if (this.state.paymentCheckModel.checkAmount == totalPaidAmount) {
            console.log("Check Amount ", parseFloat(this.state.paymentCheckModel.checkAmount).toFixed(2));
            console.log("Total Pais Amount ", (totalPaidAmount));
        } else {
            this.setState({ loading: false })
            Swal.fire("Check Amount & Paid Amounts are not Equal ", "", "error");

            return
        }

        if (billedAmountValidation == true) {
            this.setState({ loading: false })
            Swal.fire("Amounts Are Not Equal", "", "error");
            return
        }

        if (adjSeqValidation == true) {
            this.setState({ loading: false })
            //Swal.fire("Please Enter Fields in Sequence", "", "error");
            return
        }



        console.log("Payment Check Model : ", this.state.paymentCheckModel)
        axios.post("http://192.168.110.44/Database/api/PaymentCheck/SavePaymentCheck", this.state.paymentCheckModel)
            .then(response => {
                console.log("Response : ", response);
                this.setState({ paymentCheckModel: response.data, loading: false })
                Swal.fire("Saved Successfully", "", "success")

            }).catch(error => {
                this.setState({ loading: false })
                var val = this.state.validationModel;
                val.validation = false;

                console.log(error.response.data.CheckNumber)
                try {
                    if (error.response.data) {

                        val.checkNumberValField = <span className="validationMsg">CheckNumber Already Exists</span>
                        this.setState({
                            validationModel: val
                        });
                        Swal.fire(
                            "Check Number Already Exists",
                            "",
                            "error"
                        );
                    } else {
                        val.checkNumberValField = <span className="validationMsg">CheckNumber Already Exists</span>
                        this.setState({
                            validationModel: val
                        })
                        Swal.fire(
                            "SOMETHING WRONG",
                            "Internal Server Error",
                            "error"
                        );
                    }
                } catch{
                    Swal.fire(
                        "SOMETHING WRONG",
                        "Internal Server Error",
                        "error"
                    );
                }


                console.log(error.response);
            });
    }

    //delete Payment Check
    deleteCheck = e => {
        e.preventDefault();

        this.setState({ loading: true })
        console.log(this.state.paymentCheckModel.id)

        axios.delete("http://192.168.110.44/Database/api/PaymentCheck/DeletePaymentCheck/" + this.state.paymentCheckModel.id)
            .then(response => {
                this.setState({ loading: false })
                Swal.fire("Saved Successfully", "", "success").then(res => {
                    this.props.selectTabAction("Payments")
                });


            }).catch(error => {
                this.setState({ loading: false })
                Swal.fire(
                    "SOMETHING WRONG",
                    "Internal Server Error",
                    "error"
                );
                console.log(error);
            });
    }


    //Add Paymetn check Row
    addPaymentCheckRow() {
        var length = this.state.paymentCheckModel.paymentVisit.length;
        if (length > 0) {
            if (this.state.paymentCheckModel.paymentVisit[length - 1].paymentCharge.length == 0) {
                Swal.fire("First Enter Record in this Payment Visit", "", "error");
                return
            }
        }

        this.setState({
            paymentCheckModel: {
                ...this.state.paymentCheckModel,
                paymentVisit: this.state.paymentCheckModel.paymentVisit.concat(this.paymentVisitModel)
            }
        });
    }

    //delete payment check roe
    deletePaymentCheckRow(event, index) {

        const paymentCheckId = this.state.paymentCheckModel.paymentVisit[index].id;
        const length = this.state.paymentCheckModel.paymentVisit[index].paymentCharge.length;
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


                if (length > 0) {
                    axios
                        .delete("http://192.168.110.44/Database/api/PaymentVisit/DeletePaymentVisit/" + this.state.paymentCheckModel.id)
                        .then(response => {
                            console.log("Delete Response :", response);
                            Swal.fire("Record Deleted Successfully", "", "success");
                            var paymentVisits = [...this.state.paymentCheckModel.paymentVisit];
                            paymentVisits.splice(index, 1);
                            this.setState({
                                paymentCheckModel: {
                                    ...this.state.paymentCheckModel,
                                    paymentVisit: paymentVisits
                                }
                            });
                        })
                        .catch(error => {
                            Swal.fire("Record Not Deleted!", "Record can not be delete, as it is being referenced in other screens.", "error");
                        });
                } else {

                    Swal.fire("Record Deleted Successfully", "", "success");
                    var paymentVisits = [...this.state.paymentCheckModel.paymentVisit];
                    paymentVisits.splice(index, 1);
                    this.setState({
                        paymentCheckModel: {
                            ...this.state.paymentCheckModel,
                            paymentVisit: paymentVisits
                        }
                    });
                }
            }

        });


    }

    //close Manual Psoting
    closeManualPosting() {
        this.props.selectTabAction("Payments");
    }

    //toggle collapse
    async toggleCollapse(collapseID) {
        console.log("Collapse ID : ", collapseID)
        const collapseIDL = this.state.collapseID != collapseID ? collapseID : 0;
        await this.setState({ collapseID: collapseIDL })
    }


    render() {
        console.log("amount", this.state.paymentCheckModel.checkAmount)
        let mainGridRow = [];

        const groupCodes = [
            { value: "", display: "Select Gender" },
            { value: "CO", display: "Male" },
            { value: "OA", display: "Female" },
            { value: "PI", display: "Unknown" },
            { value: "PR", display: "Unknown" }
        ];

        //Status
        const Status = [
            { value: "", display: "Select Gender" },
            { value: "N", display: "NEW" },
            { value: "C", display: "CLOSE" },
            { value: "NP", display: "NEED POSTING" }
        ];


        var checkDate = this.state.paymentCheckModel.checkDate ? this.state.paymentCheckModel.checkDate.slice(0, 10) : "";


        this.state.paymentCheckModel.paymentVisit.map((paymentVisit, index) => {
            const data1 = paymentVisit.paymentCharge;
            let rowData = [];
            paymentVisit.paymentCharge.map((paymentCharge, i) => {
                rowData.push({
                    id: paymentCharge.id,
                    chargeId: (
                        <div style={{ width: "50px" }}>
                            <input
                                style={{ width: " 50px", marginRight: "5px", padding: "7px 5px" }} type="text" max="12" disabled
                                value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].chargeID} name="id" id={i}
                                onChange={(event) => this.handlePaymentChargeChange(event, index, i)}>
                            </input>
                        </div>
                    ),
                    dos: (
                        <div >
                            <input
                                style={{ width: " 90px", marginRight: "0px", padding: "7px 5px" }} type="text" max="12" disabled
                                value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].dosFrom} name="coPay" id={i}
                                onChange={(event) => this.handlePaymentChargeChange(event, index, i)}>
                            </input>
                        </div>
                    ),
                    cpt: (
                        <div style={{ width: "51px" }}>
                            <input
                                style={{ width: " 51", marginRight: "0px" }} type="text" max="12" disabled
                                value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].cptCode} name="cptCode" id={i}
                                onChange={(event) => this.handlePaymentChargeChange(event, index, i)}>
                            </input>
                        </div>
                    ),
                    billedAmount: (
                        <div style={{ width: "90px" }}>
                            <input
                                style={{ width: " 90px", marginRight: "0px" }} type="text" max="12" disabled
                                value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].billedAmount} name="billedAmount" id={i}
                                onChange={(event) => this.handlePaymentChargeChange(event, index, i)}>
                            </input>
                            {paymentCharge.billedAmountValField}

                        </div>
                    ),
                    allowedAmount: (
                        <div style={{ width: "90px" }}>
                            <input disabled
                                style={{ width: " 80px" }} type="text" max="12"
                                value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].allowedAmount} name="allowedAmount" id={i}
                                onChange={(event) => this.handlePaymentChargeChange(event, index, i)}>
                            </input>
                        </div>
                    ),
                    paidAmount: (
                        <div style={{ width: "90px" }}>
                            {/* <input              
                                 style={{ width: " 80px" }} type="text" max="12" 
                                 value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].paidAmount} name="paidAmount" id={i} 
                                 onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}>                                
                                 </input>    */}
                            <input
                                style={{ width: " 90px", marginRight: "0px" }} type="text"
                                value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].paidAmount} name="paidAmount" id={i}
                                onChange={(event) => this.handlepaymentChargeAmountChange(event, index, i)}>
                            </input>
                        </div>
                    ),
                    coPay: (
                        <input
                            style={{ width: " 90px" }} type="text"
                            value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].copay} name="copay" id={i}
                            onChange={(event) => this.handlepaymentChargeAmountChange(event, index, i)}>
                        </input>
                    ),

                    coinsuranceAmount: (
                        <input
                            style={{ width: " 90px" }} type="text"
                            value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].coinsuranceAmount} name="coinsuranceAmount" id={i}
                            onChange={(event) => this.handlepaymentChargeAmountChange(event, index, i)}>
                        </input>
                    ),
                    deductableAmount: (
                        <div styl={{ width: "90px" }}>
                            <input
                                style={{ width: " 80px" }} type="text"
                                value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].deductableAmount} name="deductableAmount" id={i}
                                onChange={(event) => this.handlepaymentChargeAmountChange(event, index, i)}>
                            </input>
                        </div>
                    ),

                    adjCode1: (
                        <div className="row" style={{ width: " 220px" }}>
                            <div className="textBoxValidate">
                                {/* <input              
                                    style={{ width: " 60px" , marginLeft:"5px"}} type="text" max="12" 
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].groupCode1} name="groupCode1" id={i} 
                                    onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}>                                
                                </input>   */}

                                < select
                                    style={{ minWidth: "70px", width: "50px", padding: "0px 0px 0px 5px", marginLeft: "9px" }}
                                    name="groupCode1"
                                    id={i}
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].groupCode1}
                                    onChange={(event) => this.handlePaymentChargeChange(event, index, i)} >
                                    {
                                        groupCodes.map(s => (
                                            <option key={
                                                s.value
                                            }
                                                value={
                                                    s.value
                                                } > {
                                                    s.value
                                                } </option>
                                        ))
                                    } </select>

                            </div>



                            <div class="textBoxValidate" style={{ width: " 60px", marginLeft: "5px", height: "20px" }}>
                                <Select
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].adjustmentCodeObj1}
                                    onChange={(event) => this.handleAdjCodeChange(event, "adjustmentCodeID1", "adjustmentCodeObj1", index, i)}
                                    //onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}
                                    options={this.state.adjCodeOptions}
                                    placeholder=""
                                    isClearable={true}
                                    isSearchable={true}
                                    menuPosition="fixed"
                                    openMenuOnClick={false}
                                    escapeClearsValue={true}
                                />
                            </div>
                            <div >
                                <input
                                    style={{ width: " 60px", marginLeft: "5px" }} type="text"
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].adjustmentAmount1} name="adjustmentAmount1" id={i}
                                    onChange={(event) => this.handlepaymentChargeAmountChange(event, index, i)}>
                                </input>
                            </div>


                            {/* <div>
                                <input              
                                    style={{ width: " 50px" }} type="text" max="12" 
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].adjustmentCodeID1} name="adjustmentCodeID1" id={i} 
                                    onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}>                                
                                </input>  </div>   */}
                            {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].groupCode1ValField1}
                        </div>

                    ),
                    adjCode2: (
                        <div className="row" style={{ width: " 220px" }} className="row">
                            {/* <input              
                                    style={{ width: " 60px" , marginLeft:"5px"}} type="text" max="12" 
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].groupCode2} name="groupCode2" id={i} 
                                    onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}>                                
                                </input>    */}
                            <div className="textBoxValidate">
                                < select
                                    style={{ minWidth: "70px", width: "70px", padding: "0px 0px 0px 5px", marginLeft: "9px" }}
                                    name="groupCode2"
                                    id={i}
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].groupCode2}
                                    onChange={(event) => this.handlePaymentChargeChange(event, index, i)} >
                                    {
                                        groupCodes.map(s => (
                                            <option key={
                                                s.value
                                            }
                                                value={
                                                    s.value
                                                } > {
                                                    s.value
                                                } </option>
                                        ))
                                    } </select>

                            </div>
                            <div class="textBoxValidate" style={{ width: " 60px", marginLeft: "5px" }} >
                                <Select
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].adjustmentCodeObj2}
                                    onChange={(event) => this.handleAdjCodeChange(event, "adjustmentCodeID2", "adjustmentCodeObj2", index, i)}
                                    //onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}
                                    options={this.state.adjCodeOptions}
                                    placeholder=""
                                    isClearable={true}
                                    isSearchable={true}
                                    disableOpenOnFocus={false}
                                    menuPosition="fixed"
                                    openMenuOnClick={false}
                                    escapeClearsValue={true}
                                />
                            </div>
                            <input
                                style={{ width: " 60px", marginLeft: "5px", height: "30px" }} type="text"
                                value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].adjustmentAmount2} name="adjustmentAmount2" id={i}
                                onChange={(event) => this.handlepaymentChargeAmountChange(event, index, i)}>
                            </input>
                            {/* <input              
                                    style={{ width: " 50px" }} type="text" max="12" 
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].adjustmentCodeID2} name="adjustmentCodeID2" id={i} 
                                    onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}>                                
                                </input>   */}

                            {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].groupCode1ValField2}
                        </div>
                    ),
                    adjCode3: (
                        <div style={{ width: "220px" }} className="row">
                            {/* <input              
                                    style={{ width: " 60px" , marginLeft:"5px"}} type="text" max="12" 
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].groupCode3} name="groupCode3" id={i} 
                                    onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}>                                
                                </input>    */}
                            <div className="textBoxValidate">
                                < select
                                    style={{ minWidth: "70px", width: "70px", padding: "0px 0px 0px 5px", marginLeft: "9px" }}
                                    name="groupCode3"
                                    id={i}
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].groupCode3}
                                    onChange={(event) => this.handlePaymentChargeChange(event, index, i)} >
                                    {
                                        groupCodes.map(s => (
                                            <option key={
                                                s.value
                                            }
                                                value={
                                                    s.value
                                                } > {
                                                    s.value
                                                } </option>
                                        ))
                                    } </select>

                            </div>

                            <div class="textBoxValidate" style={{ width: "60px", marginLeft: "5px" }} >
                                <Select
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].adjustmentCodeObj3}
                                    onChange={(event) => this.handleAdjCodeChange(event, "adjustmentCodeID3", "adjustmentCodeObj3", index, i)}
                                    //onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}
                                    options={this.state.adjCodeOptions}
                                    placeholder=""
                                    isClearable={true}
                                    isSearchable={true}
                                    menuPosition="fixed"
                                    openMenuOnClick={false}
                                    escapeClearsValue={true}
                                />
                            </div>
                            {/* <input              
                                    style={{ width: " 50px" }} type="text" max="12" 
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].adjustmentCodeID3} name="adjustmentCodeID3" id={i} 
                                    onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}>                                
                                </input>  */}
                            <input
                                style={{ width: " 60px", marginLeft: "5px" }} type="text"
                                value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].adjustmentAmount3} name="adjustmentAmount3" id={i}
                                onChange={(event) => this.handlepaymentChargeAmountChange(event, index, i)}>
                            </input>
                            {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].groupCode1ValField3}
                        </div>
                    ),
                    writeoffAmount: (
                        <input
                            readOnly
                            style={{ width: " 90px" }} type="text"
                            value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].writeoffAmount} name="writeoffAmount" id={i}
                            onChange={(event) => this.handlepaymentChargeAmountChange(event, index, i)}>
                        </input>
                    ),
                    remarkCode1: (
                        <div className="row" style={{ width: "170px" }}>
                            {/* <input              
                                    style={{ width: " 48px" ,marginRight:"1px"}} type="text" max="12" 
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].remarkCode1} name="remarkCode1" id={i} 
                                    onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}>                                
                                </input>    */}

                            {/* <input              
                                    style={{ width: " 48px" ,marginRight:"1px"}} type="text" max="12" 
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].remarkCode2} name="remarkCode2" id={i} 
                                    onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}>                                
                                </input> */}
                            {/* <input              
                                    style={{ width: " 48px" ,marginRight:"1px"}} type="text" max="12" 
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].remarkCode3} name="remarkCode3" id={i} 
                                    onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}>                                
                                </input>           */}

                            <div class="textBoxValidate" style={{ width: "50px", marginLeft: "5px" }} >
                                <Select
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].remarkCodeObj1}
                                    onChange={(event) => this.handleRemarkCodeChange(event, "remarkCodeID1", "remarkCodeObj1", index, i)}
                                    //onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}
                                    options={this.state.remarkOptions}
                                    placeholder=""
                                    isClearable={true}
                                    isSearchable={true}
                                    menuPosition="fixed"
                                    openMenuOnClick={false}
                                    escapeClearsValue={true}
                                />
                            </div>
                            <div class="textBoxValidate" style={{ width: "50px", marginLeft: "5px" }} >
                                <Select
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].remarkCodeObj2}
                                    onChange={(event) => this.handleRemarkCodeChange(event, "remarkCodeID2", "remarkCodeObj2", index, i)}
                                    //onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}
                                    options={this.state.remarkOptions}
                                    placeholder=""
                                    isClearable={true}
                                    isSearchable={true}
                                    menuPosition="fixed"
                                    openMenuOnClick={false}
                                    escapeClearsValue={true}
                                />
                            </div>
                            <div class="textBoxValidate" style={{ width: "50px", marginLeft: "5px" }} >
                                <Select
                                    value={this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].remarkCodeObj3}
                                    onChange={(event) => this.handleRemarkCodeChange(event, "remarkCodeID3", "remarkCodeObj3", index, i)}
                                    //onChange={(event) => this.handlePaymentChargeChange(event , index ,  i)}
                                    options={this.state.remarkOptions}
                                    placeholder=""
                                    isClearable={true}
                                    isSearchable={true}
                                    menuPosition="fixed"
                                    openMenuOnClick={false}
                                    escapeClearsValue={true}
                                />
                            </div>



                        </div>
                    )
                });
            });
            const data = {
                columns: [
                    {
                        label: 'ID',
                        field: 'id',
                        sort: 'asc',
                        //width : 100
                    },
                    {
                        label: 'CHARGE#',
                        field: 'checkNumber',
                        sort: 'asc',
                        //width : 120
                    },
                    {
                        label: 'DOS',
                        field: 'checkDate',
                        sort: 'asc',
                        //width : 75
                    },
                    {
                        label: 'CPT',
                        field: 'checkAmount',
                        sort: 'asc',
                        //width : 120
                    },
                    {
                        label: 'BILLED',
                        field: 'appliedAmount',
                        sort: 'asc',
                        //width : 120
                    },
                    {
                        label: 'ALLOWED',
                        field: 'payeeName',
                        sort: 'asc',
                        //width : 120
                    },
                    {
                        label: 'PAID',
                        field: 'postedAmount',
                        sort: 'asc',
                        //width : 120
                    },
                    {
                        label: 'COPAY',
                        field: 'payeeAddress',
                        sort: 'asc',
                        // width : 120
                    },

                    {
                        label: 'CO-INS',
                        field: 'payeeAddress',
                        sort: 'asc',
                        //width : 120
                    },
                    {
                        label: 'DEDUC',
                        field: 'payeeAddress',
                        sort: 'asc',
                        // width : 120
                    },
                    {
                        label: 'ADJ1-GROUP/CODE/AMT',
                        field: 'payeeAddress',
                        sort: 'asc',
                        // width : 200
                    },
                    {
                        label: 'ADJ2-GROUP/CODE/AMT',
                        field: 'payeeAddress',
                        sort: 'asc',
                        // width : 200
                    },
                    {
                        label: 'ADJ3-GROUP/CODE/AMT',
                        field: 'payeeAddress',
                        sort: 'asc',
                        //width : 200
                    },
                    {
                        label: 'WRITE-OFF',
                        field: 'payeeAddress',
                        sort: 'asc',
                        //width : 200
                    },
                    {
                        label: 'REMARK CODES',
                        field: 'payeeAddress',
                        sort: 'asc',
                        // width : 0
                    }
                ],
                rows: rowData
            }

            mainGridRow.push(
                <div style={{ marginTop: "10px" }}>

                    <MDBBtn
                        color="primary"

                        onClick={(event) => this.toggleCollapse(index + 1)}
                        style={{ marginBottom: "1rem" }}
                    >

                        {this.state.editId > 0 ? ("VISIT # " + paymentVisit.visitID + " - " + "Billed Amt : $" + paymentVisit.billedAmount +
                            " - " + "Allowed Amt : $" + paymentVisit.allowedAmount + " - " + "Paid Amt : $" + paymentVisit.paidAmount +
                            "Patient Res : $" + paymentVisit.patientAmount) : "COLLAPSE"}
                    </MDBBtn>

                    <MDBCollapse id={index + 1} isOpen={this.state.collapseID}>

                        <div  >
                            <div className="mainTable fullWidthTable wSpace">

                                <div className="mainHeading row">
                                    <div className="col-md-12 headingRight" style={{ marginBottom: "5px" }}>
                                        <button data-toggle="modal" data-target=".bs-example-modal-new"
                                            className="btn-blue-icon" onClick={(event) => this.deletePaymentCheckRow(event, index)}>Delete Payment Visit</button>
                                    </div>
                                </div>

                                <div className="row-form">
                                    <div className="mf-4">
                                        <Label name='Visit #'></Label>
                                        <input type='text' name='visitID' id={index} value={paymentVisit.visitID} onChange={this.handlePaymentVisitChange} onKeyPress={(event) => this.handleEnterKey(event, index)} />

                                    </div>
                                    <div className="mf-4">
                                        {/* <Label name='Check Date'></Label>
                                        <Input type='text' name='checkDate' id='checkDate'
                                            value={this.state.searchModel.checkDate} onChange={() => this.handlePaymentVisitChange} /> */}

                                        <label>Patient</label>
                                        <div class="textBoxValidate">
                                            <Input disabled="disabled" type='text' name='patientID' id={index} value={paymentVisit.patientID} onChange={() => this.handlePaymentVisitChange} />
                                        </div>

                                    </div>
                                    <div className="mf-4">
                                        <Label name='ICN #'></Label>
                                        <Input type='text' name='payerICN' id={index} value={paymentVisit.payerICN} onChange={() => this.handlePaymentVisitChange} />
                                    </div>

                                </div>

                                <div className="row-form">
                                    <div className="mf-4">
                                        <Label name='Billed Amount'></Label>
                                        <Input type='text' name='billedAmount' id={index} value={paymentVisit.billedAmount} onChange={() => this.handlepaymentVisitAmountChange} />

                                    </div>
                                    <div className="mf-4">
                                        <Label name='Allowed Amt '></Label>
                                        <Input disabled="disabled" type='text' name='allowedAmount' id={index}
                                            value={paymentVisit.allowedAmount} onChange={() => this.handlePaymentVisitChange} />
                                    </div>
                                    <div className="mf-4">
                                        <Label name='WriteOff Amt'></Label>
                                        <Input disabled="disabled" type='text' name='writeOffAmount' id={index}
                                            value={paymentVisit.writeOffAmount} onChange={() => this.handlePaymentVisitChange} />
                                    </div>
                                </div>

                                <div className="row-form">
                                    <div className="mf-4">
                                        <Label name='Paid Amount'></Label>
                                        {/* <Input type='text' name='paidAmount' id={index}
                                                value={paymentVisit.paidAmount} onChange={() => this.handlePaymentVisitChange} /> */}
                                        <div className="textBoxValidate">
                                            <Input


                                                //className={this.state.validationModel.amountValField ? this.errorField : ""}
                                                type="text"
                                                value={paymentVisit.paidAmount}
                                                name="paidAmount"
                                                id={index}
                                                onChange={() => this.handlepaymentVisitAmountChange}
                                            />
                                            {/* {this.state.validationModel.amountValField} */}
                                        </div>
                                    </div>

                                    <div className="mf-4">
                                        <Label name='Patient Res '></Label>
                                        <Input disabled="disabled" type='text' name='patientAmount' id={index}
                                            value={paymentVisit.patientAmount} onChange={() => this.handlePaymentVisitChange} />
                                    </div>
                                    <div className="mf-4">
                                        <Label name='Batch Document Number'></Label>
                                        {/* <Input type='text' name='paidAmount' id={index}
                                                value={paymentVisit.paidAmount} onChange={() => this.handlePaymentVisitChange} /> */}
                                        <div className="textBoxValidate">
                                            <Input
                                                //className={this.state.validationModel.amountValField ? this.errorField : ""}
                                                type="text"
                                                value={paymentVisit.batchDocumentID}
                                                name="batchDocumentID"
                                                id={index}
                                                onChange={() => this.handlepaymentVisitAmountChange}
                                            />
                                            {/* {this.state.validationModel.amountValField} */}
                                        </div>
                                    </div>
                                </div>

                                <div className="row-form">
                                    <div className="mf-4">
                                        <Label name='Page Number'></Label>
                                        {/* <Input type='text' name='paidAmount' id={index}
                                                value={paymentVisit.paidAmount} onChange={() => this.handlePaymentVisitChange} /> */}
                                        <div className="textBoxValidate">
                                            <Input
                                                //className={this.state.validationModel.amountValField ? this.errorField : ""}
                                                type="text"
                                                value={paymentVisit.pageNumber}
                                                name="pageNumber"
                                                id={index}
                                                onChange={() => this.handlepaymentVisitAmountChange}
                                            />
                                            {/* {this.state.validationModel.amountValField} */}
                                        </div>
                                    </div>

                                    <div className="mf-4">
                                    </div>
                                    <div className="mf-4"></div>
                                </div>

                            </div>

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

                    </MDBCollapse>
                </div>
            )
        })

        let spiner = ''
        if (this.state.loading == true) {
            spiner = (
                <GifLoader
                    loading={true}
                    imageSrc={Eclips}
                    // imageStyle={imageStyle}
                    overlayBackground="rgba(0,0,0,0.5)"
                />
            )
        }

        return (
            < React.Fragment >
                {spiner}
                <div className="mainHeading row">
                    <div className="col-md-6">
                        <h1>{this.state.editId > 0 ? "CHECK # : " + this.state.paymentCheckModel.checkNumber : "NEW MANUAL PAYMENT POSTING"}</h1>
                    </div>
                    <div className="col-md-6 headingRight">

                        <button data-toggle="modal" data-target=".bs-example-modal-new" className="btn-blue-icon" onClick={this.deleteCheck}>Delete Check</button>
                    </div>
                </div>

                <form onSubmit={event => this.saveManualPosting(event)} >
                    <div className="mainTable fullWidthTable  wSpace">

                        <div className="row-form">
                            <div className="mf-4">
                                <Label name='Check #'></Label>

                                <div className="textBoxValidate">
                                    <Input type='text' name='checkNumber' id='checkNumber' value={this.state.paymentCheckModel.checkNumber} onChange={() => this.handlePaymentCheckChange} />
                                    {this.state.validationModel.checkNumberValField}
                                </div>
                            </div>
                            <div className="mf-4">
                                {/* <Label name='Check Date'></Label>
                                <Input type='text' name='checkDate' id='checkDate'
                                    value={this.state.searchModel.checkDate} onChange={() => this.handlePaymentVisitChange} /> */}

                                <label>Check Date</label>
                                <div class="textBoxValidate">
                                    <input

                                        style={{
                                            width: "215px",
                                            marginLeft: "0px"
                                        }}
                                        className="myInput"
                                        type="date"
                                        name="checkDate"
                                        id="checkDate"
                                        value={checkDate}
                                        onChange={this.handlePaymentCheckChange}
                                    ></input>
                                    {this.state.validationModel.checkDateValField}
                                </div>

                            </div>
                            <div className="mf-4">
                                <Label name='Check Amount'></Label>
                                <div className="textBoxValidate">
                                    <input type='text' name='checkAmount' id='checkAmount'
                                        value={this.state.paymentCheckModel.checkAmount}
                                        onChange={this.handlepaymentCheckAmountChange} />
                                    {this.state.validationModel.checkAmountValField}
                                </div>


                            </div>
                        </div>

                        <div className="row-form">
                            <div className="mf-4">
                                <div> <Label name='Applied Amount'></Label></div>
                                {/* <Input type='text' name='appliedAmount' id='appliedAmount' value={this.state.paymentCheckModel.appliedAmount} 
                                onChange={() => this.handlePaymentCheckChange} /> */}
                                <div className="textBoxValidate">
                                    <Input
                                        //className={this.state.validationModel.amountValField ? this.errorField : ""}
                                        disabled
                                        type="text"
                                        value={this.state.paymentCheckModel.appliedAmount}
                                        name="appliedAmount"
                                        id="appliedAmount"
                                        onChange={() => this.handlepaymentCheckAmountChange}
                                    />
                                    {/* {this.state.validationModel.amountValField} */}
                                </div>

                            </div>
                            <div className="mf-4">
                                <Label name='Posted Amount'></Label>
                                {/* <Input type='text' name='postedAmount' id='postedAmount'
                                    value={this.state.paymentCheckModel.postedAmount} onChange={() => this.handlePaymentCheckChange} /> */}
                                <div className="textBoxValidate">
                                    <Input
                                        //className={this.state.validationModel.amountValField ? this.errorField : ""}
                                        disabled
                                        type="text"
                                        value={this.state.paymentCheckModel.postedAmount}
                                        name="postedAmount"
                                        id="postedAmount"
                                        onChange={() => this.handlepaymentCheckAmountChange}
                                    />
                                    {/* {this.state.validationModel.amountValField} */}
                                </div>
                            </div>
                            <div className="mf-4">
                                <Label name='Status '></Label>
                                <div className="selectBoxValidate">
                                    <select type='text' name='status' id='status'
                                        value={this.state.paymentCheckModel.status} onChange={() => this.handlePaymentCheckChange}>
                                        {
                                            Status.map(stat =>
                                                (<option key={stat.value} value={stat.value}>{stat.display}</option>)
                                            )
                                        }</select>
                                    {/* <Input type='text' name='status' id='status' disabled
                                    value={this.state.paymentCheckModel.status} onChange={() => this.handlePaymentCheckChange} /> */}
                                </div>
                            </div>
                        </div>

                        <div className="row-form">

                            <div className="mf-4">
                                <Label name='Practice '></Label>
                                {/* <Input type='text' name='address' id='address'
                                    value={this.state.searchModel.address} onChange={() => this.handlePaymentVisitChange} /> */}



                                <div className="selectBoxValidate">
                                    <select name="practiceID" id="practiceID"
                                        value={this.state.paymentCheckModel.practiceID} onChange={this.handlePaymentCheckChange}>
                                        {this.state.facData.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.description}
                                            </option>
                                        ))}
                                    </select>
                                    {this.state.validationModel.practiceValField}
                                </div>
                            </div>

                            <div className="mf-4">
                                <Label name='Payer'></Label>
                                <div className="textBoxValidate">
                                    <Input type='text' name='payerID' id='payerID' value={this.state.paymentCheckModel.payerID}
                                        onChange={() => this.handlePaymentCheckChange} />
                                    {this.state.validationModel.payerValField}
                                </div>
                            </div>
                            <div className="mf-4">
                                <label>Receiver </label>

                                <div className="selectBoxValidate">
                                    <select name="receiverID" id="receiverID"
                                        value={this.state.paymentCheckModel.receiverID} onChange={this.handlePaymentCheckChange}>
                                        {this.state.revData.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.description}
                                            </option>
                                        ))}
                                    </select>
                                    {this.state.validationModel.receiverValField}
                                </div>
                            </div>
                        </div>


                    </div>
                </form>


                <div className="mainHeading row">
                    <div className="col-md-6" >
                        <h1>PAYMENT VISITS</h1>
                    </div>
                    <div className="col-md-6 headingRight" style={{ marginBottom: "0px" }}>
                        <button data-toggle="modal" data-target=".bs-example-modal-new" className="btn-blue-icon" onClick={this.addPaymentCheckRow}>Add Payment Visit</button>
                    </div>
                </div>


                {this.state.paymentCheckModel.paymentVisit.length > 0 ? <div className="mf-12 table-grid mt-15">
                    {/* <GridHeading Heading='Visits Payments '></GridHeading> */}

                    {mainGridRow}

                </div> : ""}

                <div className="row-form row-btn" style={{ marginTop: "50px" }}>
                    <div className="mf-12">
                        <input type='submit' name='name' id='name' className='btn-blue' value='Save' onClick={this.saveManualPosting} />
                        <Input type='button' name='name' id='name' className='btn-grey' value='Cancel' onClick={() => this.closeManualPosting()} />
                    </div>
                </div>

            </React.Fragment >
        )
    }
}


function mapStateToProps(state) {
    return {
        selectedTabPage: state.selectedTabPage,
        paymentCheckId: state.selectedTab.id
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators(
        { selectTabPageAction: selectTabPageAction, selectTabAction: selectTabAction },
        dispatch
    );
}

export default connect(
    mapStateToProps,
    matchDispatchToProps
)(ManualPosting);

