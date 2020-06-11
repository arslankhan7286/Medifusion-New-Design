import React, { Component } from "react";
import { Tabs, Tab } from "react-tab-view";
import $ from "jquery";
import Swal from "sweetalert2";
import axios from "axios";
import { tsExpressionWithTypeArguments } from "@babel/types";
import { MDBDataTable } from "mdbreact";


class NewPerformEligibilty extends Component {
    constructor(props) {
        super(props);

        this.patientEligibilityURL = process.env.REACT_APP_URL + "/PatientEligibility/";

        this.newPerformEligibilty = {
            id: 0,
            subscriberName: "",
            subscriberDOB: "",
            subscriberAddress: "",
            subscriberID: "",
            subscriberGender: "",
            subscriberRelation: "",
            patientName: "",
            patientGender: "",
            patientDOB: "",
            patientAddress: "",
            providerName: "",
            providerNPI: "",
            payerName: "",
            payerID: "",
        };

        this.newPerformEligibiltyActiveServices = {
            id: 0,
            coverageLevel: "",
            serviceTypes: "",
            planName: "",
            planDescription: "",
            timePeriod: "",
            errorLog:false
        }

        this.state = {
            newPerformEligibilty: this.newPerformEligibilty,
            newPerformEligibiltyActiveServices: this.newPerformEligibiltyActiveServices,
            eligibilityData: [],
            tabData: [],
            maxHeight: "361",
            rowId: "",
        }
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

        this.setState({ maxHeight: maxHeight }); $(document).ready(function () {

        });
    }

    componentDidMount() {
        console.log("ID : ", this.props.id);
        this.setModalMaxHeight($(".modal"));
        var zIndex = 1040 + 10 * $(".modal:visible").length;
        $(this).css("z-Index", zIndex);
        setTimeout(function () {
            $(".modal-backdrop")
                .not(".modal-stack")
                .css("z-Index", zIndex - 1)
                .addClass("modal-stack");


        }, 0);

        /////////////////////////////////////////////    handle tab1 Edit Mode Api Call ////////////////////////////////////////////////////////////////////////////  

        if (this.props.id > 0) {
            axios
                .get(this.patientEligibilityURL + "FindPatientEligibilityDetail/" + this.props.id)
                .then(response => {
                    console.log("Patient Eligibility Edit Mode Data tab 1: ", response.data);
                    if (response.data.sbrData === null) {
                        this.setState({ newPerformEligibilty: "" });
                        this.setState({ newPerformEligibiltyActiveServices: "" });
                    } else {
                        this.setState({ newPerformEligibilty: response.data.sbrData, loading: false });
                        this.setState({ newPerformEligibiltyActiveServices: response.data.eligibilityData });
                    }

                    console.log("new data", response.data)
                })
                .catch(error => {
                    this.setState({ loading: false })

                    console.log(error);
                });
        }
        else {
            ////////////////////////////////////////////////    handle tab1 Perform Eligibility Button Api Call  ////////////////////////////////////
            axios
                .post(this.patientEligibilityURL + "PerformEligibility", this.state.newPerformEligibilty)
                .then(response => {
                    console.log("Patient Eligibility Edit Mode Data tab 1 : ", response.data);
                    if (response.data.sbrData === null) {
                        this.setState({ newPerformEligibilty: "" });
                    } else {
                        this.setState({ newPerformEligibilty: response.data.sbrData, loading: false });
                    }

                    //console.log("new data", response.data)
                })
                .catch(error => {
                    this.setState({ loading: false })

                    console.log(error);
                    if (error.response) {
                        if (error.response.status) {
                            this.setState({errorLog: true})
                            Swal.fire("Plan is not Setup for Eligibility", "", "error")
                        }
                    } else if (error.request) {
                        console.log(error.request);
                    } else {
                        console.log('Error', error.message);
                        Swal.fire("Something Wrong", "Please Select All Fields Properly", "error")
                    }
                    console.log(JSON.stringify(error));
                });

        }

        ////////////////////////////////////////////////////// handle tab 2  Edit Mode API call ////////////////////////////////////////////////////////////

        if (this.props.id > 0) {
            axios
                .get(this.patientEligibilityURL + "FindPatientEligibilityDetail/" + this.props.id)
                .then(response => {
                    console.log("Patient Eligibility Edit Mode Data tab 2 : ", response.data.eligibilityData);

                    this.setState({ eligibilityData: response.data.eligibilityData, tabData: response.data.eligibilityData });
                    console.log("newlist from state", this.state.tabData)
                })
                .catch(error => {
                    this.setState({ loading: false })

                    console.log(error);
                });
        }
        else {
            axios
                .post(this.patientEligibilityURL + "PerformEligibility/" + this.state.eligibilityData)
                .then(response => {
                    console.log("Patient Eligibility Edit Mode Data tab 2 : ", response.data.eligibilityData);

                    this.setState({ eligibilityData: response.data.eligibilityData, tabData: response.data.eligibilityData });
                    console.log("newlist from state", this.state.tabData)
                })
                .catch(error => {
                    this.setState({ loading: false })

                    console.log(error);
                    if (error.response) {
                        if (error.response.status) {
                            Swal.fire("Plan is not Setup for Eligibility", "", "error")
                        }
                    } else if (error.request) {
                        console.log(error.request);
                    } else {
                        console.log('Error', error.message);
                        Swal.fire("Something Wrong", "Please Select All Fields Properly", "error")
                    }
                    console.log(JSON.stringify(error));
                });
        }
    }
    /////////////////////////////////////////// End of componentDidMount ///////////////////////////////////////////////////////

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
    ////////////////////////////////////////////////////////   End of Null /////////////////////////////////////////////////////


    render() {

        const tabHeaders = [
            "Subscriber Info",
            "Active Services",
            "In Active Services",
            "Copay",
            "Deductible",
            "Co-Insurance",
            "Out Of Pocket",
            "Limitations",
            "PCP",
        ];

        let tabActiveData = []
        let tabInActiveData = []
        let tabCopayData = []
        let tabADeductibleData = []
        let tabCoInsuranceData = []
        let tabLimitationData = []
        let tabOutOfPocketData = []
        let tabPCP = []

        this.state.tabData.map((row, i) => {
            let services = row.serviceTypes.trim().split(';;')

            let tdData = []

            tdData.push(<td>{row.id}</td>)

            let serviceArray = []

            for (var j = 0; j < services.length; j++) {
                let serv = services[j]

                if (this.isNull(serv.trim()) == false) {

                    serviceArray.push(serv)
                    serviceArray.push(<br />)
                }
            }

            tdData.push(<td>{row.coverageLevel}</td>)
            tdData.push(<td>{serviceArray}</td>)
            tdData.push(<td>{row.planName}</td>)
            tdData.push(<td>{row.planDescription}</td>)
            tdData.push(<td>{row.timePeriod}</td>)
            tdData.push(<td>{row.benefitAmount}</td>)
            tdData.push(<td>{row.benefitPercentage}</td>)
            tdData.push(<td>{row.authorization}</td>)
            tdData.push(<td>{row.planNetwork}</td>)

            if (row.coverage.trim() == 'Active') {
                tabActiveData.push(<tr> {tdData}</tr>)

            } else if (row.coverage.trim() == 'InActice') {
                tabInActiveData.push(<tr> {tdData}</tr>)

            } else if (row.coverage.trim() == 'Copay') {
                tabCopayData.push(<tr> {tdData}</tr>)

            } else if (row.coverage.trim() == 'Co-Insurance') {
                tabCoInsuranceData.push(<tr> {tdData}</tr>)

            } else if (row.coverage.trim() == 'Deductible') {
                tabADeductibleData.push(<tr> {tdData}</tr>)

            } else if (row.coverage.trim() == 'Limitations') {
                tabLimitationData.push(<tr> {tdData}</tr>)

            } else if (row.coverage.trim() == '') {
                tabOutOfPocketData.push(<tr> {tdData}</tr>)

            }

            let datesData = []
            if (this.isNull(row.dateId1) == false && this.isNull(row.dateValue1) == false) {
                datesData.push(<td>{row.dateId1} :  {row.dateValue1}</td>)
            } else if (this.isNull(row.dateId2) == false && this.isNull(row.dateValue2)) {
                datesData.push(<td>{row.dateId2} :  {row.dateValue2}</td>)
            } else if (this.isNull(row.dateId3) == false && this.isNull(row.dateValue3)) {
                datesData.push(<td>{row.dateId3} : {row.dateValue3}</td>)
            } else if (this.isNull(row.dateId4) == false && this.isNull(row.dateValue4)) {
                datesData.push(<td>{row.dateId4} : {row.dateValue4}</td>)
            } else if (this.isNull(row.dateId5) == false && this.isNull(row.dateValue5)) {
                datesData.push(<td>{row.dateId5} :  {row.dateValue5}</td>)
            }

            let refData = []
            if (this.isNull(row.referenceId1) == false && this.isNull(row.referenceValue1) == false) {
                refData.push(<td>{row.referenceId1} :  {row.referenceValue1}</td>)
            } else if (this.isNull(row.referenceId2) == false && this.isNull(row.referenceValue2)) {
                refData.push(<td>{row.referenceId2} :  {row.referenceValue2}</td>)
            } else if (this.isNull(row.referenceId3) == false && this.isNull(row.referenceValue3)) {
                refData.push(<td>{row.referenceId3} : {row.referenceValue3}</td>)
            } else if (this.isNull(row.referenceId4) == false && this.isNull(row.referenceValue4)) {
                refData.push(<td>{row.referenceId4} : {row.referenceValue4}</td>)
            } else if (this.isNull(row.referenceId5) == false && this.isNull(row.referenceValue5)) {
                refData.push(<td>{row.referenceId5} :  {row.referenceValue5}</td>)
            }

            let msgData = [];
            if (this.isNull(row.messages) == false) {
                msgData.push(<td>{row.messages}</td>)
            } else if (this.isNull(row.messages) == false) {
                msgData.push(<td>{row.dateId2}</td>)
            } else if (this.isNull(row.messages) == false) {
                msgData.push(<td>{row.messages} </td>)
            } else if (this.isNull(row.messages) == false) {
                msgData.push(<td>{row.messages} </td>)
            } else if (this.isNull(row.messages) == false) {
                msgData.push(<td>{row.messages} </td>)
            }

            if (row.coverage.trim() == 'Active') {

                if (datesData != null && datesData.length > 0)
                    tabActiveData.push(<tr><td></td>{datesData}</tr>)
            } else if (row.coverage.trim() == 'InActice') {

                if (datesData != null && datesData.length > 0)
                    tabInActiveData.push(<tr><td></td>{datesData}</tr>)
            } else if (row.coverage.trim() == 'Copay') {

                if (datesData != null && datesData.length > 0)
                    tabCopayData.push(<tr><td></td>{datesData}</tr>)
            } else if (row.coverage.trim() == 'Co-Insurance') {

                if (datesData != null && datesData.length > 0)
                    tabCoInsuranceData.push(<tr><td></td>{datesData}</tr>)
            } else if (row.coverage.trim() == 'Deductible') {

                if (datesData != null && datesData.length > 0)
                    tabADeductibleData.push(<tr><td></td>{datesData}</tr>)
            } else if (row.coverage.trim() == 'Limitations') {

                if (datesData != null && datesData.length > 0)
                    tabLimitationData.push(<tr><td></td>{datesData}</tr>)
            } else if (row.coverage.trim() == '') {

                if (datesData != null && datesData.length > 0)
                    tabOutOfPocketData.push(<tr><td></td>{datesData}</tr>)
            }
            /////////////////////////////////////////////////////
            if (row.coverage.trim() == 'Active') {

                if (msgData != null && msgData.length > 0)
                    tabActiveData.push(<tr><td></td>{msgData}</tr>)
            } else if (row.coverage.trim() == 'InActice') {

                if (msgData != null && msgData.length > 0)
                    tabInActiveData.push(<tr><td></td>{msgData}</tr>)
            } else if (row.coverage.trim() == 'Copay') {

                if (msgData != null && msgData.length > 0)
                    tabCopayData.push(<tr><td></td>{msgData}</tr>)
            } else if (row.coverage.trim() == 'Co-Insurance') {

                if (msgData != null && msgData.length > 0)
                    tabCoInsuranceData.push(<tr><td></td>{msgData}</tr>)
            } else if (row.coverage.trim() == 'Deductible') {

                if (msgData != null && msgData.length > 0)
                    tabADeductibleData.push(<tr><td></td>{msgData}</tr>)
            } else if (row.coverage.trim() == 'Limitations') {

                if (msgData != null && msgData.length > 0)
                    tabLimitationData.push(<tr><td></td>{msgData}</tr>)
            } else if (row.coverage.trim() == '') {

                if (msgData != null && msgData.length > 0)
                    tabOutOfPocketData.push(<tr><td></td>{msgData}</tr>)
            }

            ////////////////////////////////////////////////////////
            if (row.coverage.trim() == 'Active') {

                if (refData != null && refData.length > 0)
                    tabActiveData.push(<tr><td></td>{refData}</tr>)
            } else if (row.coverage.trim() == 'InActice') {

                if (refData != null && refData.length > 0)
                    tabInActiveData.push(<tr><td></td>{refData}</tr>)
            } else if (row.coverage.trim() == 'Copay') {

                if (refData != null && refData.length > 0)
                    tabCopayData.push(<tr><td></td>{refData}</tr>)
            } else if (row.coverage.trim() == 'Co-Insurance') {

                if (refData != null && refData.length > 0)
                    tabCoInsuranceData.push(<tr><td></td>{refData}</tr>)
            } else if (row.coverage.trim() == 'Deductible') {

                if (refData != null && refData.length > 0)
                    tabADeductibleData.push(<tr><td></td>{refData}</tr>)
            } else if (row.coverage.trim() == 'Limitations') {

                if (refData != null && refData.length > 0)
                    tabLimitationData.push(<tr><td></td>{refData}</tr>)
            } else if (row.coverage.trim() == '') {

                if (refData != null && refData.length > 0)
                    tabOutOfPocketData.push(<tr><td></td>{refData}</tr>)
            }

        })

        return (
            <div
                id="myModal1"
                className="modal fade bs-example-modal-new show"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="myLargeModalLabel"
                aria-hidden="true"
                style={{ display: "block", paddingRight: "17px" }}
            >
                <div className="modal-dialog modal-lg">
                    <button
                        // onClick={this.props.onClose()}
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close">
                        <span aria-hidden="true"></span>
                    </button>
                    <div className="modal-content" style={{ overflow: "hidden" }}>
                        <div className="mainTable fullWidthTable text-nowrap">
                            <div className="row-form">
                                <div className="mf-12">
                                    <Tabs headers={tabHeaders} style={{ cursor: "default" }}  >
                                        {/* Subscriber Info */}
                                        <Tab>
                                            <div className="tab-content current bg-transparent" id="tab-1">

                                                <div className="mainTable fullWidthTable wSpace" style={{ maxwidth: "100%" }}>
                                                    <div className="mainTable fullWidthTable wSpace" style={{ maxWidth: "100%" }}>
                                                        <div className="row-form">
                                                            <div className="mf-12 batchContainer">
                                                                <div className="mf-12 bg-sky">
                                                                    <h2>Subscriber</h2>
                                                                </div>

                                                                <div className="row-form" style={{ margin: "0" }}>
                                                                    <div className="mf-6 bdr-right">
                                                                        <div className="row-form">
                                                                            <div className="mf-6">
                                                                                <h3>Subscriber Name:</h3>
                                                                            </div>
                                                                            <div className="mf-6 pl-20">
                                                                                <p>{this.state.newPerformEligibilty.subscriberName}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row-form">
                                                                            <div className="mf-6">
                                                                                <h3>DOB:</h3>
                                                                            </div>
                                                                            <div className="mf-6 pl-20">
                                                                                <p>{this.state.newPerformEligibilty.subscriberDOB}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row-form">
                                                                            <div className="mf-6">
                                                                                <h3>Address:</h3>
                                                                            </div>
                                                                            <div className="mf-6 pl-20">
                                                                                <p>{this.state.newPerformEligibilty.subscriberAddress}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mf-6">
                                                                        <div className="row-form batch-m-tb">
                                                                            <div className="mf-6">
                                                                                <h3>Subscriber ID:</h3>
                                                                            </div>
                                                                            <div className="mf-6 pl-20">
                                                                                <p>{this.state.newPerformEligibilty.subscriberID}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row-form">
                                                                            <div className="mf-6 ">
                                                                                <h3>Gender:</h3>
                                                                            </div>
                                                                            <div className="mf-6 pl-20">
                                                                                <p>{this.state.newPerformEligibilty.subscriberGender}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row-form">
                                                                            <div className="mf-6 ">
                                                                                <h3>Relation:</h3>
                                                                            </div>
                                                                            <div className="mf-6 pl-20">
                                                                                <p>{this.state.newPerformEligibilty.subscriberRelation}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mf-4">
                                                                &nbsp;
                                    </div>
                                                        </div>

                                                        <div className="row-form">
                                                            <div className="mf-12 batchContainer">
                                                                <div className="mf-12 bg-sky">
                                                                    <h2>Patient</h2>
                                                                </div>

                                                                <div className="row-form" style={{ margin: "0" }}>
                                                                    <div className="mf-6 bdr-right">
                                                                        <div className="row-form">
                                                                            <div className="mf-6">
                                                                                <h3>Patient Name:</h3>
                                                                            </div>
                                                                            <div className="mf-6 pl-20">
                                                                                <p>{this.state.newPerformEligibilty.patientName}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row-form">
                                                                            <div className="mf-6">
                                                                                <h3>Gender:</h3>
                                                                            </div>
                                                                            <div className="mf-6 pl-20">
                                                                                <p>{this.state.newPerformEligibilty.patientGender}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mf-6">
                                                                        <div className="row-form batch-m-tb">
                                                                            <div className="mf-6">
                                                                                <h3>DOB:</h3>
                                                                            </div>
                                                                            <div className="mf-6 pl-20">
                                                                                <p>{this.state.newPerformEligibilty.patientDOB}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row-form">
                                                                            <div className="mf-6 ">
                                                                                <h3>Address:</h3>
                                                                            </div>
                                                                            <div className="mf-6 pl-20">
                                                                                <p>{this.state.newPerformEligibilty.patientAddress}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mf-4">
                                                                &nbsp;
                                    </div>
                                                        </div>

                                                        <div className="row-form">
                                                            <div className="mf-12 batchContainer">
                                                                <div className="mf-12 bg-sky">
                                                                    <h2>Provider</h2>
                                                                </div>

                                                                <div className="row-form" style={{ margin: "0" }}>
                                                                    <div className="mf-6 bdr-right">
                                                                        <div className="row-form">
                                                                            <div className="mf-6">
                                                                                <h3>Provider Name:</h3>
                                                                            </div>
                                                                            <div className="mf-6 pl-20">
                                                                                <p>{this.state.newPerformEligibilty.providerName}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mf-6">
                                                                        <div className="row-form batch-m-tb">
                                                                            <div className="mf-6">
                                                                                <h3>Provider NPI:</h3>
                                                                            </div>
                                                                            <div className="mf-6 pl-20">
                                                                                <p>{this.state.newPerformEligibilty.providerNPI}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mf-4">
                                                                &nbsp;
                                    </div>
                                                        </div>

                                                        <div className="row-form">
                                                            <div className="mf-12 batchContainer">
                                                                <div className="mf-12 bg-sky">
                                                                    <h2>Payer</h2>
                                                                </div>

                                                                <div className="row-form" style={{ margin: "0" }}>
                                                                    <div className="mf-6 bdr-right">
                                                                        <div className="row-form">
                                                                            <div className="mf-6">
                                                                                <h3>Payer Name:</h3>
                                                                            </div>
                                                                            <div className="mf-6 pl-20">
                                                                                <p>{this.state.newPerformEligibilty.payerName}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mf-6">
                                                                        <div className="row-form batch-m-tb">
                                                                            <div className="mf-6">
                                                                                <h3>Payer ID:</h3>
                                                                            </div>
                                                                            <div className="mf-6 pl-20">
                                                                                <p>{this.state.newPerformEligibilty.payerID}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mf-4">
                                                                &nbsp;
                                    </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                        </Tab>
                                        {/* Active Services */}
                                        <Tab >
                                            <div className="tab-content current bg-transparent" id="tab-2" style={{ position: 'relative', height: '500px', overflow: 'auto', display: 'block', }}>
                                                <div className="table-responsive">
                                                    <table className="table activeServiceTable table-striped">
                                                        <thead>
                                                            <tr className="upperCase table-bordered">
                                                                <th></th>
                                                                <th>Coverage Level </th>
                                                                <th>Services </th>
                                                                <th>Plan Name </th>
                                                                <th>Description </th>
                                                                <th>Time period </th>
                                                                <th>Benefit Amount</th>
                                                                <th>Benefit Percentage</th>
                                                                <th>Authorization</th>
                                                                <th>Plan Network</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tabActiveData}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                        </Tab>


                                        {/* In Active Services */}
                                        <Tab >
                                            <div className="tab-content current bg-transparent" id="tab-2" style={{ position: 'relative', height: '500px', overflow: 'auto', display: 'block' }}>
                                                <div className="table-responsive">
                                                    <table className="table activeServiceTable table-striped ">
                                                        <thead>
                                                            <tr className="upperCase table-bordered" >
                                                                <th></th>
                                                                <th>Coverage Level </th>
                                                                <th>Services </th>
                                                                <th>Plan Name </th>
                                                                <th>Description </th>
                                                                <th>Time period </th>
                                                                <th>Benefit Amount</th>
                                                                <th>Benefit Percentage</th>
                                                                <th>Authorization</th>
                                                                <th>Plan Network</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tabInActiveData}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </Tab>
                                        {/* Copay */}
                                        <Tab >
                                            <div className="tab-content current bg-transparent" id="tab-2" style={{ position: 'relative', height: '500px', overflow: 'auto', display: 'block' }}>
                                                <div className="table-responsive">
                                                    <table className="table activeServiceTable table-striped ">
                                                        <thead>
                                                            <tr className="upperCase table-bordered">
                                                                <th></th>
                                                                <th>Coverage Level </th>
                                                                <th>Services </th>
                                                                <th>Plan Name </th>
                                                                <th>Description </th>
                                                                <th>Time period </th>
                                                                <th>Benefit Amount</th>
                                                                <th>Benefit Percentage</th>
                                                                <th>Authorization</th>
                                                                <th>Plan Network</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tabCopayData}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </Tab>
                                        {/* Deductible */}
                                        <Tab >
                                            <div className="tab-content current bg-transparent" id="tab-2" style={{ position: 'relative', height: '500px', overflow: 'auto', display: 'block' }}>
                                                <div className="table-responsive">
                                                    <table className="table activeServiceTable table-striped ">
                                                        <thead>
                                                            <tr className="upperCase table-bordered" >
                                                                <th></th>
                                                                <th>Coverage Level </th>
                                                                <th>Services </th>
                                                                <th>Plan Name </th>
                                                                <th>Description </th>
                                                                <th>Time period </th>
                                                                <th>Benefit Amount</th>
                                                                <th>Benefit Percentage</th>
                                                                <th>Authorization</th>
                                                                <th>Plan Network</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tabADeductibleData}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </Tab>
                                        {/* Co-Insurance */}
                                        <Tab >
                                            <div className="tab-content current bg-transparent" id="tab-2" style={{ position: 'relative', height: '500px', overflow: 'auto', display: 'block' }}>
                                                <div className="table-responsive">
                                                    <table className="table activeServiceTable table-striped ">
                                                        <thead>
                                                            <tr className="upperCase table-bordered">
                                                                <th></th>
                                                                <th>Coverage Level </th>
                                                                <th>Services </th>
                                                                <th>Plan Name </th>
                                                                <th>Description </th>
                                                                <th>Time period </th>
                                                                <th>Benefit Amount</th>
                                                                <th>Benefit Percentage</th>
                                                                <th>Authorization</th>
                                                                <th>Plan Network</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tabCoInsuranceData}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </Tab>
                                        {/* Out Of Pocket */}
                                        <Tab >
                                            <div className="tab-content current bg-transparent" id="tab-2" style={{ position: 'relative', height: '500px', overflow: 'auto', display: 'block' }}>
                                                <div className="table-responsive">
                                                    <table className="table activeServiceTable table-striped ">
                                                        <thead>
                                                            <tr className="upperCase table-bordered">
                                                                <th></th>
                                                                <th>Coverage Level </th>
                                                                <th>Services </th>
                                                                <th>Plan Name </th>
                                                                <th>Description </th>
                                                                <th>Time period </th>
                                                                <th>Benefit Amount</th>
                                                                <th>Benefit Percentage</th>
                                                                <th>Authorization</th>
                                                                <th>Plan Network</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tabOutOfPocketData}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </Tab>
                                        {/* Limitations */}
                                        <Tab >
                                            <div className="tab-content current bg-transparent" id="tab-2" style={{ position: 'relative', height: '500px', overflow: 'auto', display: 'block' }}>
                                                <div className="table-responsive">
                                                    <table className="table activeServiceTable table-striped ">
                                                        <thead>
                                                            <tr className="upperCase table-bordered">
                                                                <th></th>
                                                                <th>Coverage Level </th>
                                                                <th>Services </th>
                                                                <th>Plan Name </th>
                                                                <th>Description </th>
                                                                <th>Time period </th>
                                                                <th>Benefit Amount</th>
                                                                <th>Benefit Percentage</th>
                                                                <th>Authorization</th>
                                                                <th>Plan Network</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tabLimitationData}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </Tab>
                                        {/* PCP */}
                                        <Tab >
                                            <div className="tab-content current bg-transparent" id="tab-2" style={{ position: 'relative', height: '500px', overflow: 'auto', display: 'block' }}>
                                                <div className="table-responsive">
                                                    <table className="table activeServiceTable table-striped ">
                                                        <thead>
                                                            <tr className="upperCase table-bordered">
                                                                <th></th>
                                                                <th>Coverage Level </th>
                                                                <th>Services </th>
                                                                <th>Plan Name </th>
                                                                <th>Description </th>
                                                                <th>Time period </th>
                                                                <th>Benefit Amount</th>
                                                                <th>Benefit Percentage</th>
                                                                <th>Authorization</th>
                                                                <th>Plan Network</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {/* {tabPCP} */}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                                <button
                                    id="btnCancel"
                                    className="btn-blue"
                                    data-dismiss="modal"
                                    onClick={this.props.onClose()}
                                >
                                    OK
                        </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default NewPerformEligibilty;