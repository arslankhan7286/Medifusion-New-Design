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
    MDBTable
} from "mdbreact";
import GridHeading from "./GridHeading";
import { Tabs, Tab } from "react-tab-view";
import NewLocation from './NewLocation';
import NewProvider from './NewProvider'

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { log } from "util";

export class NewPractice extends Component {
    constructor(props) {
        super(props);

        this.url = process.env.REACT_APP_URL + "/PaymentCheck/";


        //Authorization Token
        this.config = {
            headers: {
                Authorization: "Bearer  " + this.props.loginObject.token,
                Accept: "*/*"
            }
        };

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
            patientName:null,
            "deductableAmount": null,
            "coinsuranceAmount": null,
            "coPay": null,
            "writeoffAmount": null,
            "allowedAmount": null,
            appliedToSec:true,

            "adjustmentCodeID1": "",
            "adjustmentCodeObj1": {},
            type1:"",
            "adjustmentAmount1": "",
            "groupCode1": "",
            groupCode1ValField1: "",

            "adjustmentCodeID2": "",
            adjustmentCodeObj2: {},
            type2:"",
            "adjustmentAmount2": "",
            "groupCode2": "",
            groupCode1ValField2: "",

            "adjustmentCodeID3": "",
            adjustmentCodeObj3: {},
            type3:"",
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
            "visitID": null,
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

        this.state = {
            paymentCheckModel: this.paymentCheckModel,
            paymentVisitModel: [],
            paymentChargeModel: [],
            eobModel: this.eobModel,
            maxHeight: "361",
            loading: false,
            popupName: "",
            id: 0
        };

        this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
        this.savePractice = this.savePractice.bind(this);
        this.delete = this.delete.bind(this);
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

    componentDidMount() {


        this.setModalMaxHeight($(".modal"));
        // if ($('.modal.in').length != 0) {
        //     this.setModalMaxHeight($('.modal.in'));
        // }
        var zIndex = 1040 + 10 * $(".modal:visible").length;
        $(this).css("z-Index", zIndex);
        setTimeout(function () {
            $(".modal-backdrop")
                .not(".modal-stack")
                .css("z-Index", zIndex - 1)
                .addClass("modal-stack");
        }, 0);

        console.log("Row Id", this.props.id)

        axios.get(this.url + 'findpaymentCheck/'+ this.props.id, this.config)
        .then(response => {
            console.log("View EOB Response : ", response)
            // let newList = []
            // response.data.map((row, i) => {
            //     console.log(row)
            //     newList.push({
            //         id: row.id,
            //         practice: <MDBBtn className='gridBlueBtn' onClick={() => this.openPracticePopup(row.id)}>{row.name}</MDBBtn>,
            //         organizationName: row.organizationName,
            //         npi: row.npi,
            //         taxid: row.taxID,
            //         address: row.address,
            //         officePhoneNum: row.officePhoneNum
            //     });
            // });

           // this.setState({ data: newList, loading: false });
           this.setState({paymentCheckModel: response.data});
        }).catch(error => {
            this.setState({ loading: false })
            if (error.response) {
                if (error.response.status) {
                    Swal.fire("Unauthorized Access", "", "error")
                }
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(JSON.stringify(error));
        });
    }



    isNull(value) {
        if (value === "" || value === null || value === undefined) return true;
        else return false;
    }



    savePractice = e => {
        alert("Save Click")
    }


    delete = e => {
        alert("Delete Click")
    };


    // openPopup = (name, id) => {
    //     this.setState({ popupName: name, id: id });
    // }
    isDisabled(value) {
        if (value == null || value == false) return 'disabled'
    }

    render() {



        let rowData = [];

        this.state.paymentCheckModel.paymentVisit.map((paymentVisit, index) => {    
            const data1 = paymentVisit.paymentCharge;
            
            console.log("insuredLastName",paymentVisit.insuredLastName)
                        
            paymentVisit.paymentCharge.map((paymentCharge, i) => { 
 
                console.log("Visit Index : " , paymentCharge.chargeControlNumber)
                rowData.push(
                   (

                    <div style={{ width: "100%" }}>
                        <div style={{ width: "100%", float: "left", border: "1px solid #000", margintop: "10px" }}></div>
                    <div style={{ width: "100%", float: "left", margintop: "10px" }}>
                        <p style={{ margintop: "0", marginbottom: "0" }}>
                            <span style={{ display: "inline-block", width: "25%", overflow: "hidden" }}>NAME: 
                                {this.state.paymentCheckModel.paymentVisit[index].insuredLastName}
                                {this.state.paymentCheckModel.paymentVisit[index].insuredFirstName}
                            </span>
                            <span style={{ display: "inline-block", width: "17%", padding: "0 5px", overflow: "hidden" }}>MID: 
                                {this.state.paymentCheckModel.paymentVisit[index].insuredID}
                            </span>
                            <span style={{ display: "inline-block", width: "15%", padding: "0 5px", overflow: "hidden" }}>ACNT: 
                                {this.state.paymentCheckModel.paymentVisit[index].claimNumber}
                            </span>
                            <span style={{ display: "inline-block", width: "18%", padding: "0 5px", overflow: "hidden" }}>ICN: 
                            {this.state.paymentCheckModel.paymentVisit[index].payerICN}
                            </span>
                            <span style={{ display: "inline-block", width: "7%", padding: "0 5px", overflow: "hidden" }}>ASG: Y</span>
                            <span style={{ display: "inline-block", width: "16%", padding: "0 5px", overflow: "hidden", float: "right" }}>MOA: </span>
                        </p>
                        <p style={{ margintop: "0", marginbottom: "0" }}>
                            <span style={{ display: "inline-block", width: "17%", overflow: "hidden" }}>
                                {this.state.paymentCheckModel.payeeNPI}
                            </span>
                            <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>
                                {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].dosFrom}
                            </span>
                            <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>
                                {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].dosTo}
                            </span>
                            <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>
                                {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].cptCode}
                                {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].modifier1}
                                {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].modifier2}
                                {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].modifier3}
                                {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].modifier4}
                            </span>
                            <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>
                                {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].billedAmount}
                            </span>
                            <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>
                                {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].allowedAmount}
                            </span>
                            <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>
                                {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].deductableAmount}
                            </span>
                            <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>
                                {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].coinsuranceAmount}
                            </span>
                            <span style={{ display: "inline-block", textalign: "right", width: "10%", float: "right", padding: "0 5px", overflow: "hidden" }}>
                                {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].paidAmount}
                            </span>
                        </p>
                    </div>
                    <div style={{ width: "100%", float: "left", margintop: "10px" }}>
                        <p style={{ margintop: "0", marginbottom: "0" }}>
                            <span style={{ display: "inline-block", width: "10%", overflow: "hidden" }}>CNTL #:</span>
                            <span style={{ display: "inline-block", width: "89%", padding: "0 5px", overflow: "hidden" }}>
                                {this.state.paymentCheckModel.paymentVisit[index].paymentCharge[i].chargeControlNumber}
                            </span>
                            
                        </p>
                        <p style={{ margintop: "0", marginbottom: "0" }}>
                            <span style={{ display: "inline-block", width: "8%", overflow: "hidden" }}>PT</span>
                            <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>RESP</span>
                            <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>15.00</span>
                            <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>CARC</span>
                            <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>44.50</span>
                            <span style={{ display: "inline-block", width: "16%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>CLAIM TOTALS</span>
                            <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>150.00</span>
                            <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>105.50</span>
                            <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>0.00</span>
                            <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>15.00</span>
                            <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden", float: "right" }}>90.50</span>
                        </p>
                        <p style={{ margintop: "0", marginbottom: "0" }}>
                            <span style={{ display: "inline-block", width: "12%", overflow: "hidden" }}>ADJ TO TOTALS:</span>
                            <span style={{ display: "inline-block", width: "20%", textalign: "left", padding: "0 5px", overflow: "hidden" }}>PREV PD</span>
                            <span style={{ display: "inline-block", width: "10%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>INTEREST</span>
                            <span style={{ display: "inline-block", width: "9%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>0.00</span>
                            <span style={{ display: "inline-block", width: "21%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>LATE FILING CHARGE</span>
                            <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>0.00</span>
                            <span style={{ display: "inline-block", width: "7%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>NET</span>
                            <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden", float: "right" }}>90.50</span>
                        </p>
                        <p style={{ margintop: "20px", marginbottom: "0" }}>
                            <span style={{ display: "inline-block", width: "9%", overflow: "hidden" }}>REND-PROV</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>SERV-DATE</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "6%", padding: "0 5px", overflow: "hidden" }}>POS</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "14%", padding: "0 5px", overflow: "hidden" }}>PD-PROC/MODS</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>PD-NOS</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>BILLED</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>ALLOWED</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "9%", padding: "0 5px", overflow: "hidden" }}>DEDUCT</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "9%", padding: "0 5px", overflow: "hidden" }}>COINS</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "9%", padding: "0 5px", overflow: "hidden", float: "right" }}>PROV-PD</span>
                        </p>
                        <p style={{ margintop: "0", marginbottom: "0" }}>
                            <span style={{ display: "inline-block", width: "14%", overflow: "hidden" }}>RARC</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "14%", padding: "0 5px", overflow: "hidden" }}>SUB-NOS</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "14%", padding: "0 5px", overflow: "hidden" }}>SUB-PROC</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "14%", padding: "0 5px", overflow: "hidden" }}>GRP/CARC</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "14%", padding: "0 5px", overflow: "hidden" }}>CARC-AMT</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "14%", padding: "0 5px", overflow: "hidden" }}>ADJ-QTY</span>
                            <span style={{ display: "inline-block", textalign: "right", width: "14%", padding: "0 5px", overflow: "hidden", float: "right" }}>BS</span>
                        </p>
                    </div>

                </div>
                    
               ),
                )

                    
            });
        });







        return (
            <React.Fragment>
                <div
                    id="myModal1"
                    className="modal fade bs-example-modal-new show"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="myLargeModalLabel"
                    style={{ display: "block", paddingRight: "17px" }}
                >
                    <div className="modal-dialog modal-lg">


                        <div className="modal-content" style={{ overflow: "hidden" }}>
                            <button
                                onClick={this.props.onClose()}
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true"></span>
                            </button>
                            <div className="modal-header">
                                <div className="mf-12">
                                    <div className="row">
                                        <div className="mf-6 popupHeading">
                                            <h1 className="modal-title">
                                                VIEW EOB
                                            </h1>
                                        </div>
                                        <div className="mf-6 popupHeadingRight">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="modal-body"
                                style={{ maxHeight: this.state.maxHeight }}
                            >
                                <div className="pgSize" style={{ margin: "0 auto", texttransform: "uppercase" }}>
                                    <div style={{ width: "100%", margintop: "30px" }}>
                                        <div style={{ width: "50%", float: "left" }}>
                                            {this.state.paymentCheckModel.payerName}
                                        </div>
                                        <div style={{ width: "50%", float: "left", textalign: "right" }}>
                                            Medicare
                                        </div>
                                        <div style={{ width: "50%", float: "left" }}>
                                            <p style={{ margintop: "0", marginbottom: "0" }}>
                                                {this.state.paymentCheckModel.payerAddress}
                                            </p>
                                        </div>
                                        <div style={{ width: "50%", float: "left", textalign: "right" }}>
                                            <p style={{ margintop: "0", marginbottom: "0" }}>Remittance</p>
                                        </div>
                                        <div style={{ width: "50%", float: "left" }}>
                                            <p style={{ margintop: "0", marginbottom: "0" }}>
                                                {this.state.paymentCheckModel.payerCity}
                                                {this.state.paymentCheckModel.payerState}
                                                {this.state.paymentCheckModel.payerZipCode}
                                                </p>
                                        </div>
                                        <div style={{ width: "50%", float: "left", textalign: "right" }}>
                                            <p style={{ margintop: "0", marginbottom: "0" }}>Advice</p>
                                        </div>
                                        <div style={{ width: "50%", float: "left", margintop: "10px" }}>
                                            <p style={{ margintop: "0", marginbottom: "0" }}>
                                                {this.state.paymentCheckModel.payeeName}
                                            </p>
                                        </div>
                                        <div style={{ width: "50%", float: "left", margintop: "10px" }}>
                                            <p style={{ margintop: "0", marginbottom: "0", paddingleft: "100px" }}>
                                                <span style={{ display: "block", float: "left", textalign: "right", marginleft: "8px" }}>NPI #:</span>
                                                <span style={{ display: "inline-block", textalign: "left", marginleft: "10px" }}>
                                                    {this.state.paymentCheckModel.payeeNPI}
                                                </span>
                                            </p>
                                        </div>
                                        <div style={{ width: "50%", float: "left" }}>
                                            <p style={{ margintop: "0", marginbottom: "0" }}>
                                                {this.state.paymentCheckModel.payerAddress}
                                            </p>
                                        </div>
                                        <div style={{ width: "50%", float: "left" }}>
                                            <p style={{ margintop: "0", marginbottom: "0", paddingleft: "100px" }}>
                                                <span style={{ display: "block", float: "left", textalign: "right", marginleft: "8px" }}>Date:</span>
                                                <span style={{ display: "inline-block", textalign: "left", marginleft: "10px" }}>11/18/2019</span>
                                            </p>
                                        </div>
                                        <div style={{ width: "50%", float: "left" }}>
                                            <p style={{ margintop: "0", marginbottom: "0" }}>
                                                {this.state.paymentCheckModel.payerCity}
                                                {this.state.paymentCheckModel.payerState}
                                                {this.state.paymentCheckModel.payerZipCode}
                                            </p>
                                        </div>
                                        <div style={{ width: "50%", float: "left" }}>
                                            <p style={{ margintop: "0", marginbottom: "0", paddingleft: "100px" }}>
                                                <span style={{ display: "block", float: "left", textalign: "right", marginleft: "8px" }}>Page #:</span>
                                                <span style={{ display: "inline-block", textalign: "left", marginleft: "10px" }}>1</span>
                                            </p>
                                        </div>
                                        <div style={{ width: "100%", float: "left", margintop: "10px" }}>
                                            <p style={{ margintop: "0", marginbottom: "0" }}>
                                                <span style={{ display: "inline-block", width: "10%" }}>CHECK/EFT #:</span>
                                                <span style={{ display: "inline-block", width: "89%" }}>
                                                    {this.state.paymentCheckModel.checkNumber}
                                                </span>
                                            </p>
                                        </div>
                                        <div style={{ width: "100%", float: "left", margintop: "10px" }}>
                                            <p style={{ margintop: "0", marginbottom: "0" }}>
                                                <span style={{ display: "inline-block", width: "9%", overflow: "hidden" }}>REND-PROV</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "10%", overflow: "hidden", padding: "0 5px" }}>SERV-DATE</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "6%", overflow: "hidden", padding: "0 5px" }}>POS</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "14%", overflow: "hidden", padding: "0 5px" }}>PD-PROC/MODS</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "10%", overflow: "hidden", padding: "0 5px" }}>PD-NOS</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "10%", overflow: "hidden", padding: "0 5px" }}>BILLED</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "10%", overflow: "hidden", padding: "0 5px" }}>ALLOWED</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "9%", overflow: "hidden", padding: "0 5px" }}>DEDUCT</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "9%", overflow: "hidden", padding: "0 5px" }}>COINS</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "9%", overflow: "hidden", padding: "0 5px", float: "right" }}>PROV-PD</span>
                                            </p>
                                            <p style={{ margintop: "0", marginbottom: "0" }}>
                                                <span style={{ display: "inline-block", width: "13%", overflow: "hidden" }}>RARC</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "14%", overflow: "hidden", padding: "0 5px" }}>SUB-NOS</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "14%", overflow: "hidden", padding: "0 5px" }}>SUB-PROC</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "14%", overflow: "hidden", padding: "0 5px" }}>GRP/CARC</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "14%", overflow: "hidden", padding: "0 5px" }}>CARC-AMT</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "14%", overflow: "hidden", padding: "0 5px" }}>ADJ-QTY</span>
                                                <span style={{ display: "inline-block", textalign: "right", width: "14%", overflow: "hidden", padding: "0 5px", float: "right" }}>BS</span>
                                            </p>
                                        </div>
                                        {/* <div style={{ width: "100%", float: "left", border: "1px solid #000", margintop: "10px" }}></div> */}
                                        {/* <div style={{ width: "100%" }}> */}
                                            {/* <div style={{ width: "100%", float: "left", margintop: "10px" }}>
                                                <p style={{ margintop: "0", marginbottom: "0" }}>
                                                    <span style={{ display: "inline-block", width: "25%", overflow: "hidden" }}>NAME: 
                                                    {this.state.paymentVisitModel.insuredLastName}</span>
                                                    <span style={{ display: "inline-block", width: "17%", padding: "0 5px", overflow: "hidden" }}>MID: CZQAN1601049</span>
                                                    <span style={{ display: "inline-block", width: "15%", padding: "0 5px", overflow: "hidden" }}>ACNT: 2073405890</span>
                                                    <span style={{ display: "inline-block", width: "18%", padding: "0 5px", overflow: "hidden" }}>ICN: 0201931850G943</span>
                                                    <span style={{ display: "inline-block", width: "7%", padding: "0 5px", overflow: "hidden" }}>ASG: Y</span>
                                                    <span style={{ display: "inline-block", width: "16%", padding: "0 5px", overflow: "hidden", float: "right" }}>MOA: </span>
                                                </p>
                                                <p style={{ margintop: "0", marginbottom: "0" }}>
                                                    <span style={{ display: "inline-block", width: "17%", overflow: "hidden" }}>1861508194</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>0814</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>081419</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>99214</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>150.00</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>105.50</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>0.00</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>15.00</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "10%", float: "right", padding: "0 5px", overflow: "hidden" }}>90.50</span>
                                                </p>
                                            </div> */}
                                            {rowData}
                                            {/* <div style={{ width: "100%", float: "left", margintop: "10px" }}>
                                                <p style={{ margintop: "0", marginbottom: "0" }}>
                                                    <span style={{ display: "inline-block", width: "10%", overflow: "hidden" }}>CNTL #:</span>
                                                    <span style={{ display: "inline-block", width: "89%", padding: "0 5px", overflow: "hidden" }}>{CTRL}</span>
                                                    
                                                </p>
                                                <p style={{ margintop: "0", marginbottom: "0" }}>
                                                    <span style={{ display: "inline-block", width: "8%", overflow: "hidden" }}>PT</span>
                                                    <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>RESP</span>
                                                    <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>15.00</span>
                                                    <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>CARC</span>
                                                    <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>44.50</span>
                                                    <span style={{ display: "inline-block", width: "16%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>CLAIM TOTALS</span>
                                                    <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>150.00</span>
                                                    <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>105.50</span>
                                                    <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>0.00</span>
                                                    <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>15.00</span>
                                                    <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden", float: "right" }}>90.50</span>
                                                </p>
                                                <p style={{ margintop: "0", marginbottom: "0" }}>
                                                    <span style={{ display: "inline-block", width: "12%", overflow: "hidden" }}>ADJ TO TOTALS:</span>
                                                    <span style={{ display: "inline-block", width: "20%", textalign: "left", padding: "0 5px", overflow: "hidden" }}>PREV PD</span>
                                                    <span style={{ display: "inline-block", width: "10%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>INTEREST</span>
                                                    <span style={{ display: "inline-block", width: "9%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>0.00</span>
                                                    <span style={{ display: "inline-block", width: "21%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>LATE FILING CHARGE</span>
                                                    <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>0.00</span>
                                                    <span style={{ display: "inline-block", width: "7%", textalign: "right", padding: "0 5px", overflow: "hidden" }}>NET</span>
                                                    <span style={{ display: "inline-block", width: "8%", textalign: "right", padding: "0 5px", overflow: "hidden", float: "right" }}>90.50</span>
                                                </p>
                                                <p style={{ margintop: "20px", marginbottom: "0" }}>
                                                    <span style={{ display: "inline-block", width: "9%", overflow: "hidden" }}>REND-PROV</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>SERV-DATE</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "6%", padding: "0 5px", overflow: "hidden" }}>POS</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "14%", padding: "0 5px", overflow: "hidden" }}>PD-PROC/MODS</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>PD-NOS</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>BILLED</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "10%", padding: "0 5px", overflow: "hidden" }}>ALLOWED</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "9%", padding: "0 5px", overflow: "hidden" }}>DEDUCT</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "9%", padding: "0 5px", overflow: "hidden" }}>COINS</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "9%", padding: "0 5px", overflow: "hidden", float: "right" }}>PROV-PD</span>
                                                </p>
                                                <p style={{ margintop: "0", marginbottom: "0" }}>
                                                    <span style={{ display: "inline-block", width: "14%", overflow: "hidden" }}>RARC</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "14%", padding: "0 5px", overflow: "hidden" }}>SUB-NOS</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "14%", padding: "0 5px", overflow: "hidden" }}>SUB-PROC</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "14%", padding: "0 5px", overflow: "hidden" }}>GRP/CARC</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "14%", padding: "0 5px", overflow: "hidden" }}>CARC-AMT</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "14%", padding: "0 5px", overflow: "hidden" }}>ADJ-QTY</span>
                                                    <span style={{ display: "inline-block", textalign: "right", width: "14%", padding: "0 5px", overflow: "hidden", float: "right" }}>BS</span>
                                                </p>
                                            </div> */}

                                        {/* </div> */}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                <div className="mainTable">
                                    <div className="row-form row-btn">
                                        <div className="mf-12">
                                            <button
                                                id="btnCancel"
                                                className="btn-blue"
                                                data-dismiss="modal"
                                                onClick={this.props.onClose()}                                >
                                                OK
                                        </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            
                        </div>



                        <div>
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
        // id: state.selectedTab !== null ? state.selectedTab.id : 0,
        setupLeftMenu: state.leftNavigationMenus,
        loginObject: state.loginToken
            ? state.loginToken
            : { toekn: "", isLogin: false },
        userInfo: state.loginInfo
            ? state.loginInfo
            : { userPractices: [], name: "", practiceID: null },
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

export default connect(mapStateToProps, matchDispatchToProps)(NewPractice);
