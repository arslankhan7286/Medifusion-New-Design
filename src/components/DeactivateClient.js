import React, { Component } from "react";
import Input from "./Input";
import Label from "./Label";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import Swal from "sweetalert2";
import axios from "axios";
import Dropdown from "react-dropdown";
import settingsIcon from "../images/setting-icon.png";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import Hotkeys from "react-hot-keys";

export class DeactivateClient extends Component {
    constructor(props) {
        super(props);

        this.url = process.env.REACT_APP_URL + "/jobs/";
        this.errorField = "errorField";
        //Authorization Token
        this.config = {
            headers: {
                Authorization: "Bearer  " + this.props.loginObject.token,
                Accept: "*/*"
            }
        };

        this.validationModel = {
            deactivationReasonVal: null,
            deactivationDateVal: null,
            deactivateionAdditionalInfoVal: null
        };

        this.state = {
            editId: this.props.id,
            clientModel: this.props.clientModel,
            validationModel: this.validationModel,
            loading: false,
            showPopup: false
        };

        this.saveDeactivateClient = this.saveDeactivateClient.bind(this);
        this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onKeyDown(keyName, e, handle) {
        console.log("test:onKeyDown", keyName, e, handle);

        if (keyName == "alt+s") {
            // alert("save key")
            this.saveDeactivateClient();
            console.log(e.which);
        }

        this.setState({
            output: `onKeyDown ${keyName}`
        });
    }

    onKeyUp(keyName, e, handle) {
        console.log("test:onKeyUp", e, handle);
        if (e) {
            console.log("event has been called", e);
        }
        this.setState({
            output: `onKeyUp ${keyName}`
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
        await this.setModalMaxHeight($(".modal"));
        var zIndex = 1040 + 10 * $(".modal:visible").length;
        $(this).css("z-Index", zIndex);
        setTimeout(function () {
            $(".modal-backdrop")
                .not(".modal-stack")
                .css("z-Index", zIndex - 1)
                .addClass("modal-stack");
        }, 0);
    }

    handleChange = event => {
        this.setState({
            clientModel: {
                ...this.state.clientModel,
                [event.target.name]: event.target.value.toUpperCase()
            }
        });

        //Carret Position
        // const caret = event.target.selectionStart;
        // const element = event.target;
        // window.requestAnimationFrame(() => {
        //     element.selectionStart = caret;
        //     element.selectionEnd = caret;
        // });
    };

    saveDeactivateClient = e => {
        var clientModel = this.state.clientModel;
        clientModel.isDeactivated = true;

        this.setState({ loading: true });

        var myVal = this.validationModel;
        myVal.validation = false;

        if (this.isNull(this.state.clientModel.deactivationReason)) {
            myVal.deactivationReasonVal = (
                <span className="validationMsg">Enter Reason</span>
            );
            myVal.validation = true;
        } else {
            myVal.deactivationReasonVal = "";
            if (myVal.validation === false) myVal.validation = false;
        }

        // if (this.isNull(this.state.taxModel.deactivateionAdditionalInfo)) {
        //   myVal.deactivateionAdditionalInfoVal = (
        //     <span className="validationMsg">Enter Description</span>
        //   );
        //   myVal.validation = true;
        // } else {
        //   myVal.deactivateionAdditionalInfoVal = "";
        //   if (myVal.validation === false) myVal.validation = false;
        // }
        this.setState({
            validationModel: myVal
        });

        if (myVal.validation === true) {
            this.setState({ loading: false });
            //   this.saveTaxCodeCount = 0;

            return;
        }
        console.log("Model for deactivation", clientModel);
        axios
            .post(this.url + "DeactivateClient", clientModel, this.config)
            .then(response => {
                console.log(response);
                this.setState({
                    clientModel: response.data,
                    editId: response.data.id,
                    loading: false
                });

                Swal.fire("Record Saved Successfully", "", "success");
            })
            .catch(error => {
                this.setState({ loading: false });

                let errorList = [];
                if (error.response !== null && error !== null) {
                    errorList = error.response;
                    console.log(errorList);
                } else console.log(error);
            });

        // e.preventDefault();
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

    isDisabled(value) {
        if (value == null || value == false) return "disabled";
    }

    render() {
        // const isActive = this.state.taxModel.isActive;
        let spiner = "";
        if (this.state.loading == true) {
            spiner = (
                <div class="lds-spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            );
        }

        return (
            <React.Fragment>
                <div
                    class="modal fade show"
                    id="clientModal"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div
                        class="modal-dialog"
                        style={{ margin: "8.8rem auto" }}
                        role="document"
                    >
                        <div class="modal-content h-auto">
                            <div class="modal-header" style={{ marginLeft: "0px" }}>
                                <div class="row ml-0 mr-0 w-100">
                                    <div class="col-md-12 order-md-1 provider-form ">
                                        <div class="header pt-1">
                                            <h3>DEACTIVATE CLIENT</h3>

                                            <div class="float-lg-right text-right">
                                                <button
                                                    class="btn btn-primary mr-2"
                                                    type="submit"
                                                    disabled={this.isDisabled(this.props.rights.delete)}
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

                                        {/* MainContent */}
                                        <div class="row">
                                            <div class="col-md-11 mb-2">
                                                <div class="col-md-1 float-left">
                                                    <label>Deactivation Reason</label>
                                                </div>
                                                <div class="col-md-11 pl-5 float-left">
                                                    <textarea
                                                        type="text"
                                                        class="provider-form w-100 form-control-user"
                                                        placeholder="Notes"
                                                        required=""
                                                        value={this.state.clientModel.deactivationReason}
                                                        name="deactivationReason"
                                                        id="deactivationReason"
                                                        onChange={this.handleChange}
                                                    ></textarea>
                                                </div>
                                                <div class="invalid-feedback">
                                                    {this.state.validationModel.deactivationReasonVal}
                                                </div>
                                            </div>
                                        </div>



                                        <div class="row">
                                            <div class="col-md-4 mb-2">
                                                <div class="col-md-4 float-left">
                                                    <label for="name">Deactivation Date</label>
                                                </div>
                                                <div class="col-md-8 float-left">
                                                    <input
                                                        type="date"
                                                        min="1900-01-01"
                                                        max="9999-12-31"
                                                        name="deactivationDate"
                                                        id="deactivationDate"
                                                        value={this.state.clientModel.deactivationDate}
                                                        onChange={this.handleChange}
                                                    ></input>
                                                </div>
                                            </div>

                                            <div class="col-md-4 mb-2">
                                                <div class="col-md-4 float-left">
                                                    <label for="organizationName">Additional Info</label>
                                                </div>
                                                <div class="col-md-8 float-left">
                                                    <input
                                                        type="text"
                                                        class="provider-form w-100 form-control-user"
                                                        placeholder="Organization Name"
                                                        value={
                                                            this.state.clientModel.deactivateionAdditionalInfo
                                                        }
                                                        maxLength="10"
                                                        name="deactivateionAdditionalInfo"
                                                        id="deactivateionAdditionalInfo"
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div class="col-md-4 mb-2"></div>
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
                                                    onClick={this.saveDeactivateClient}
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
                search: state.loginInfo.rights.ediStatusSearch,
                add: state.loginInfo.rights.ediStatusCreate,
                update: state.loginInfo.rights.ediStatusEdit,
                delete: state.loginInfo.rights.ediStatusDelete,
                export: state.loginInfo.rights.ediStatusExport,
                import: state.loginInfo.rights.ediStatusImport
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

export default connect(mapStateToProps, matchDispatchToProps)(DeactivateClient);
