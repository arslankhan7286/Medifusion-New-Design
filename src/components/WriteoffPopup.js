import React, { Component } from "react";
import { MDBDataTable, MDBBtn, MDBInput } from "mdbreact";
import axios from "axios";
import { isNullOrUndefined } from "util";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

import Swal from "sweetalert2";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { timePickerDefaultProps } from "@material-ui/pickers/constants/prop-types";

class WriteoffPopup extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/Visit/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.listModel = {
      ids: this.props.selectedVisits,
      status: "",
    };

    this.state = {
      listModel: this.listModel,
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  ///////////////////////// Handling Null Value ////////////////////////////////
  val(value) {
    if (isNullOrUndefined(value)) return "";
    else return value;
  }

  handleChange = (event) => {
    this.setState({
      listModel: {
        ...this.state.listModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };
  applyWriteOff() {
    this.setState({ loading: true });
    console.log("Model List :", this.state.listModel);

    axios
      .post(this.url + "ApplyWriteOff", this.state.listModel, this.config)

      .then(async (response) => {
        this.setState({ loading: false });
        console.log("Response", response);
        Swal.fire("WriteOff Applied Successfully", "", "success");
        // $("#myModal").hide();
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
        Swal.fire("Please Select All Fields Properly", "", "error");
        $("#myModal").hide();
      });
  }

  render() {
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
            style={{ margin: "8.8rem auto" }}
            class="modal-dialog"
            role="document"
          >
            <div
              id="modalContent"
              class="modal-content"
              style={{ minHeight: "200px", maxHeight: "700px" }}
            >
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>Apply Write-off</h3>

                      <div class="float-lg-right text-right">
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
                      <div class="col-md-11 mb-2">
                        <div class="col-md-1 float-left">
                          <label>Reason</label>
                        </div>
                        <div class="col-md-11 pl-5 float-left">
                          <textarea
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Reason"
                            value={this.state.listModel.status}
                            name="status"
                            id="status"
                            max="100"
                            onChange={this.handleChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        type="button"
                        onClick={() => this.applyWriteOff()}
                      >
                        Apply Write-off
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

export default connect(mapStateToProps, matchDispatchToProps)(WriteoffPopup);
