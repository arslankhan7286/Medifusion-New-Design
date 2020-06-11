import React, { Component } from "react";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import SearchHeading from "./SearchHeading";
import Label from "./Label";
import Button from "./Input";
import Input from "./Input";
import SearchInput2 from "./SearchInput2";

import axios from "axios";
import {
    MDBDataTable,
    MDBBtn,
    MDBTableHead,
    MDBTableBody,
    MDBTable,
} from "mdbreact";

import GridHeading from "./GridHeading";
import NewInsurancePlan from "./NewInsurancePlan";

import searchIcon from "../images/search-icon.png";
import refreshIcon from "../images/refresh-icon.png";
import newBtnIcon from "../images/new-page-icon.png";
import settingsIcon from "../images/setting-icon.png";
import NewInsurance from "./NewInsurance";

// import ReactDataGrid from 'react-data-grid';

import $ from "jquery";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class InsurancePlan extends Component {
    constructor(props) {
        super(props);

        this.url = process.env.REACT_APP_URL + "/InsurancePlan/";
        //Authorization Token
        this.config = {
            headers: {
                Authorization: "Bearer  " + this.props.loginObject.token,
                Accept: "*/*",
            },
        };

        this.searchModel = {
            planName: "",
            description: "",
            insurance: "",
            planType: "",
            payerName: "",
            payerID: "",
        };

        this.state = {
            searchModel: this.searchModel,
            id: 0,
            data: [],
            showPopup: false,
            showInsurancePopup: false,
            loading: false,
        };

        this.searchInsurancePlans = this.searchInsurancePlans.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.openInsurancePlanPopup = this.openInsurancePlanPopup.bind(this);
        this.closeInsurancePlanPopup = this.closeInsurancePlanPopup.bind(this);
        this.openInsurancePopup = this.openInsurancePopup.bind(this);
        this.closeInsurancePopup = this.closeInsurancePopup.bind(this);
    }

    searchInsurancePlans = (e) => {
        this.setState({ loading: true });
        console.log(this.state.searchModel);
        axios
            .post(this.url + "FindInsurancePlan", this.state.searchModel, this.config)
            .then((response) => {
                console.log(response);

                let newList = [];
                response.data.map((row, i) => {
                    newList.push({
                        planName: (
                            <a
                                href=""
                                onClick={(event) => this.openInsurancePlanPopup(event, row.id)}
                            >
                                {row.planName}
                            </a>
                        ),
                        description: row.description,
                        insurance: (
                            <a
                                href=""
                                onClick={(event) => this.openInsurancePopup(event, row.insuranceID)}
                            >
                                {row.insurance}
                            </a>
                        ),
                        payerName: row.payerName,
                        payerID: row.payerID,
                        planType: row.planType,
                    });
                });

                this.setState({ data: newList, loading: false });
            })
            .catch((error) => {
                this.setState({ loading: false });

                console.log(error);
            });

        e.preventDefault();
    };

    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            searchModel: { [event.target.name]: event.target.value.toUpperCase() },
        });
    };

    clearFields = (event) => {
        event.preventDefault();
        this.setState({
            searchModel: this.searchModel,
        });
    };

    openInsurancePlanPopup = (event, id) => {
        event.preventDefault()
        this.setState({ showPopup: true, id: id });
    };

    closeInsurancePlanPopup = () => {
        $("#myModal").hide();
        this.setState({ showPopup: false });
    };

    openInsurancePopup = (event, id) => {
        event.preventDefault();
        this.setState({ showInsurancePopup: true, id: id });
    };

    closeInsurancePopup = () => {
        $("#myModal").hide();
        this.setState({ showInsurancePopup: false });
    };

    handleNumericCheck(event) {
        if (event.charCode >= 48 && event.charCode <= 57) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    isDisabled(value) {
        if (value == null || value == false) return "disabled";
    }

    render() {
        const data = {
            columns: [
                {
                    label: "PLAN",
                    field: "planName",
                    sort: "asc",
                    width: 150,
                },
                {
                    label: "DESCRIPTION",
                    field: "description",
                    sort: "asc",
                    width: 270,
                },
                {
                    label: "INSURANCE",
                    field: "insurance",
                    sort: "asc",
                    width: 200,
                },
                {
                    label: "PAYER NAME",
                    field: "payerName",
                    sort: "asc",
                    width: 100,
                },
                {
                    label: "PAYER ID",
                    field: "payerID",
                    sort: "asc",
                    width: 150,
                },
                {
                    label: "PLAN TYPE",
                    field: "planType",
                    sort: "asc",
                    width: 100,
                },
            ],
            rows: this.state.data,
        };

        let popup = "";

        if (this.state.showPopup) {
            document.body.style.overflow = 'hidden';
            popup = (
                <NewInsurancePlan
                    onClose={this.closeInsurancePlanPopup}
                    id={this.state.id}
                    disabled={this.isDisabled(this.props.rights.update)}
                    disabled={this.isDisabled(this.props.rights.add)}
                ></NewInsurancePlan>
            );
        } else if (this.state.showInsurancePopup) {
            document.body.style.overflow = 'hidden';
            popup = (
                <NewInsurance
                    onClose={this.closeInsurancePopup}
                    id={this.state.id}
                    disabled={this.isDisabled(this.props.rights.newIns)}
                ></NewInsurance>
            );
        } else {
            popup = <React.Fragment></React.Fragment>;
            document.body.style.overflow = 'visible';
        }

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
                <div className="container-fluid">
                    <div className="card mb-4 bg-info">
                        <div className="card-body">
                            <div className="table-responsive">
                                {spiner}
                                <h6 className="m-0 font-weight-bold text-primary th1 ">
                                    INSURANCE PLAN SEARCH
                  <a
                                        href=""
                                        style={{ marginTop: "-6px" }}
                                        className="float-right btn-search btn-primary btn-user"
                                        onClick={(event) => this.openInsurancePlanPopup(event, 0)}
                                    >
                                        Add New
                  </a>
                                </h6>
                                <div className="search-form">
                                <form onSubmit ={this.searchInsurancePlans}>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <br></br>
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <label>Plan Name:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        maxLength="200"
                                                        name="planName"
                                                        id="planName"
                                                        value={this.state.searchModel.planName}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                                <div className="col-lg-12">
                                                    

                                                    <label>Insurance:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="insurance"
                                                        id="insurance"
                                                        maxLength="20"
                                                        value={this.state.searchModel.insurance}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>



                                           
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="row">
                                            <div className="col-lg-12">
                                            <br></br>
                                                    <label>Description:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="description"
                                                        id="description"
                                                        maxLength="200"
                                                        value={this.state.searchModel.description}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>



                                           
                                                <div className="col-lg-12">
                                                    <label>Plan Type:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="planType"
                                                        id="planType"
                                                        maxLength="20"
                                                        value={this.state.searchModel.planType}
                                                        onChange={this.handleChange}

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <label>Payer Name:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="payerName"
                                                        id="payerName"
                                                        maxLength="20"
                                                        value={this.state.searchModel.payerName}
                                                        onChange={this.handleChange}

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <label>Payer ID:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="payerID"
                                                        id="payerID"
                                                        maxLength="20"
                                                        value={this.state.searchModel.payerID}
                                                        onChange={this.handleChange}

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="clearfix"></div>
                                    <br></br>
                                    <div className="col-lg-12 text-center">
                                    <button
                                        class=" btn btn-primary mr-2 mb-2"
                                        type="submit"
                                    >
                                        Search
                                        </button>
                                        <button
                                        class=" btn btn-primary mr-2 mb-2"
                                        type="submit"
                                        onClick={this.clearFields}
                                    >
                                        Clear
                                        </button>
                               
                     
                                    </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <br></br>
                {/* Grid Data */}
                <div className="container-fluid">
                    <div className="card mb-4">
                        <GridHeading
                            Heading="INSURANCE PLAN SEARCH RESULT"
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
                                    id="dataTable_wrapper"
                                    className="dataTables_wrapper dt-bootstrap4"
                                >
                                    <MDBDataTable
                                        responsive={true}
                                        striped
                                        bordered
                                        searching={false}
                                        data={data}
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
                search: state.loginInfo.rights.insurancePlanSearch,
                add: state.loginInfo.rights.insurancePlanCreate,
                update: state.loginInfo.rights.insurancePlanEdit,
                delete: state.loginInfo.rights.insurancePlanDelete,
                export: state.loginInfo.rights.insurancePlanExport,
                import: state.loginInfo.rights.insurancePlanImport,
                newIns: state.loginInfo.rights.insuranceEdit,
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

export default connect(mapStateToProps, matchDispatchToProps)(InsurancePlan);
