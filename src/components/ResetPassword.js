import React, { Component } from "react";
import { Tabs, Tab } from "react-tab-view";
import $ from "jquery";
import Swal from "sweetalert2";
import axios from "axios";
import { tsExpressionWithTypeArguments } from "@babel/types";
import Label from "./Label";
import Button from "./Input";
import Input from "./Input";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.changePasswordURL = process.env.REACT_APP_URL + "/Account/";

        this.config = {
            headers: {
                Authorization: "Bearer  " + this.props.loginObject.token,
                Accept: "*/*"
            }
        };

        this.searchModel = {
            // id: 0,
            // oldPassword:"",
            // newPassword:"",
            // confirmPassword:""
            confirmPassword: "",
            email: this.props.email,
            password: ""


        };
        this.validationModel = {
            passwordValField: "",
            cnfrmPassValField: ""
        }
        this.state = {
            searchModel: this.searchModel,
            validationModel: this.validationModel,
            data: [],
            maxHeight: "361",
            rowId: "",
            loading: false
        };
        this.isNull = this.isNull.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.changePassword = this.changePassword.bind(this);
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
        $(document).ready(function () { });
    }


    changePassword = e => {

        //     console.log(this.state.searchModel);
        //     // e.preventDefault();
        this.setState({ loading: true });

        var myVal = this.validationModel;
        myVal.validation = false;
        if (this.isNull(this.state.searchModel.password)) {
            myVal.passwordValField = (
                <span className="validationMsg" style={{ marginTop: "-15px", marginLeft: "34%" }}>
                    {" "}
                    Password is Required
                   </span>
            );
            myVal.validation = true;
        } else {
            myVal.passwordValField = "";
            if (myVal.validation === false) myVal.validation = false;
        }

        if (this.isNull(this.state.searchModel.confirmPassword)) {
            myVal.cnfrmPassValField = (
                <span className="validationMsg" style={{ marginLeft: "35%" }}>Confirm Password is Required</span>
            );
            myVal.validation = true;
        } else {
            myVal.cnfrmPassValField = "";
            if (myVal.validation === false) myVal.validation = false;
        }

        if (this.state.searchModel.password !== this.state.searchModel.confirmPassword) {
            //myVal.passwordValField = <span className="validationMsg">Password Did"t Match</span>
            myVal.cnfrmPassValField = (
                <span className="validationMsg" style={{ marginLeft: "35%" }}>Password Don't Match</span>
            );
            myVal.validation = true;
        } else {
            //myVal.passwordValField = '';
            myVal.cnfrmPassValField = "";
            if (myVal.validation === false) myVal.validation = false;
        }

        this.setState({
            validationModel: myVal
        });

        if (myVal.validation === true) {
            this.setState({ loading: false });
            // this.saveRemarkCodeCount = 0;

            return;
        }


        axios
            .post(
                this.changePasswordURL + "ResetPassword",
                this.state.searchModel,
                this.config
            )
            .then(response => {

                Swal.fire("Record Saved Successfully", "", "success");
                this.setState({ loading: false });
            })

            .catch(error => {
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
    };


    isNull(value) {
        if (
            value === "" ||
            value === null ||
            value === undefined ||
            value == "Please Select"
        )
            return true;
        else return false;
    }

    handleChange = event => {
        event.preventDefault();
        this.setState({
            searchModel: {
                ...this.state.searchModel,
                [event.target.name]: event.target.value
            }
        });
    };

    render() {
        let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="spiner">
          <GifLoader
            loading={true}
            imageSrc={Eclips}
            // imageStyle={imageStyle}
            overlayBackground="rgba(0,0,0,0.5)"
          />
        </div>
      );
    }

        return (
            <React.Fragment>
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
                    {spiner}
                        <div className="modal-content" style={{ overflow: "hidden" }}>
                            <button
                                onClick={
                                    this.props.onClose
                                        ? this.props.onClose()
                                        : () => this.props.onClose()
                                }
                                type="button"
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
                                                RESET PASSWORD
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="modal-body"
                                style={{ maxHeight: this.state.maxHeight }}
                            >
                                <div className="mainTable">

                                    <div className="row-form">
                                        <div className="mf-6">
                                            <label>
                                                Password <span className="redlbl"> *</span>
                                            </label>
                                            {/* <div className="textBoxValidate"> */}
                                            <input

                                                type="password"
                                                value={this.state.searchModel.password}
                                                name="password"
                                                id="password"
                                                max="15"
                                                onChange={this.handleChange}
                                            />
                                            <p style={{marginLeft: "35%"}}>
                                                Enter combination of at least 5
                                                letters,numbers and symbols
                                                </p>
                                            {this.state.validationModel.passwordValField}
                                        </div>

                                        <div className="mf-6">
                                            <label>
                                                Confirm Password<span className="redlbl"> *</span>
                                            </label>
                                            {/* <div className="textBoxValidate"> */}
                                            <input

                                                type="password"
                                                value={this.state.searchModel.confirmPassword}
                                                name="confirmPassword"
                                                id="confirmPassword"
                                                max="15"
                                                min=""
                                                onChange={this.handleChange}
                                            />

                                            {this.state.validationModel.cnfrmPassValField}
                                        </div>
                                    </div>

                                    {/* <div className="row-form">
                                        <div className="mf-6">
                                            <label>
                                                Confirm New Password <span className="redlbl"> *</span>
                                            </label>
                                            {/* <div className="textBoxValidate"> */}
                                    {/* <input

                                                type="password"
                                                value={this.state.searchModel.confirmPassword}
                                                name="confirmPassword"
                                                id="confirmPassword"
                                                max="15"
                                                onChange={this.handleChange}
                                            /> */}
                                    {/* </div> */}
                                    {/* </div>

                                        <div className="mf-6">

                                        </div>
                                    </div> */}
                                </div>

                                <div className="modal-footer">
                                    <div className="mainTable">
                                        <div className="row-form row-btn">
                                            <div className="mf-12">
                                                <Input
                                                    type="button"
                                                    value="Save"
                                                    className="btn-blue"
                                                    onClick={this.changePassword}

                                                ></Input>
                                                <button
                                                    id="btnCancel"
                                                    className="btn-grey"
                                                    data-dismiss="modal"
                                                    onClick={
                                                        this.props.onClose
                                                            ? this.props.onClose()
                                                            : () => this.props.onClose()
                                                    }
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* {popup} */}
            </React.Fragment>
        )
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
                search: state.loginInfo.rights.practiceSearch,
                add: state.loginInfo.rights.practiceCreate,
                update: state.loginInfo.rights.practiceEdit,
                delete: state.loginInfo.rights.practiceDelete,
                export: state.loginInfo.rights.practiceExport,
                import: state.loginInfo.rights.practiceImport
            }
            : []
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

export default connect(
    mapStateToProps,
    matchDispatchToProps
)(ResetPassword);

// export default ChangePassword;
