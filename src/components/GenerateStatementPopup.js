import React, { Component } from "react";
import $ from "jquery";

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class GenerateStatementPopup extends Component {
  constructor(props) {
    super(props);

    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.state = {
      advancePaymentOption: "",
      maxHeight: "361",
    };
    this.handleChange = this.handleChange.bind(this);
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
    $(document).ready(function () {});
  }

  handleChange = (event) => {
    console.log(event.target.value, event.target.name);
    this.setState({ advancePaymentOption: event.target.value });
  };

  render() {
    const dropDownValues = [
      {
        value: "PROCESS ADVANCE PAYMENTS FIRST",
        display: "PROCESS ADVANCE PAYMENTS FIRST",
      },
      { value: "IGNORE ADVANCE PAYMENTS", display: "IGNORE ADVANCE PAYMENTS" },
      {
        value: "IGNORE ADVANCE PAYMENT PATIENTS",
        display: "IGNORE ADVANCE PAYMENT PATIENTS",
      },
    ];

    return (
      <React.Fragment>
        <div
          id="generateStatememt"
          className="modal fade bs-example-modal-new show"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myLargeModalLabel"
          aria-hidden="true"
          style={{ display: "block", paddingRight: "17px" }}
        >
          <div className="modal-dialog modal-lg" style={{ width: "60%" }}>
            <div className="modal-content" style={{ overflow: "hidden" }}>
              <button
                onClick={
                  this.props.onClose
                    ? this.props.onClose()
                    : () => this.props.onClose()
                }
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              />
              <div className="mainTable fullWidthTable text-nowrap">
                <div className="modal-header">
                  <div className="mf-12">
                    <div className="row">
                      <div className="mf-6 popupHeading">
                        <h1 className="modal-title">
                          REAMAINING PATIENTS PAYMENT
                        </h1>
                      </div>
                      <div className="mf-6 popupHeadingRight">
                        <div className="lblChkBox"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="modal-body"
                  style={{ maxHeight: this.state.maxHeight }}
                ></div>
                <div className="row-form">
                  <div className="mf-12">
                    <label>
                      Action on Reamaining Patient Payment
                      <span className="redlbl"> *</span>
                    </label>
                    <select
                      name="advancePaymentOption"
                      id="advancePaymentOption"
                      value={this.state.advancePaymentOption}
                      onChange={this.handleChange}
                    >
                      {dropDownValues.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.display}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <div className="mf-6"></div> */}

                  <button
                    id="btnCancel"
                    className="btn-blue"
                    data-dismiss="modal"
                    // onClick={this.props.onClose()}
                    onClick={
                      this.state.advancePaymentOption
                        ? () =>
                            this.props.getType(this.state.advancePaymentOption)
                        : () => this.onClose()
                    }
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {popup} */}
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
          import: state.loginInfo.rights.practiceImport,
        }
      : [],
    //   taxonomyCode: state.loginInfo.taxonomy
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
)(GenerateStatementPopup);
