import React, { Component } from "react";
import $ from "jquery";
import axios from "axios";
import Input from "./Input";
import Swal from "sweetalert2";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import Dropdown from "react-dropdown";
import settingIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { POSAction } from "../actions/POSAction";

import Hotkeys from "react-hot-keys";

class NewPOS extends Component {
  constructor(props) {
    super(props);
    this.errorField = "errorField";
    this.url = process.env.REACT_APP_URL + "/pos/";
    this.commonUrl = process.env.REACT_APP_URL + "/Common/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };
    this.savePOSCount = 0;

    this.validationModel = {
      posValField: "",
      descriptionValField: "",
    };
    this.posModal = {
      posCode: "",
      name: "",
      description: "",
      isActive: true,
    };

    this.state = {
      posModal: this.posModal,
      validationModel: this.validationModel,
      editId: this.props.id,
      maxHeight: "361",
      loading: false,
      showPopup: false,
    };
  }

  onKeyDown(keyName, e, handle) {
    console.log("test:onKeyDown", keyName, e, handle);

    if (keyName == "alt+s") {
      // alert("save key")
      this.savePOS();
      console.log(e.which);
    }

    this.setState({
      output: `onKeyDown ${keyName}`,
    });
  }

  onKeyUp(keyName, e, handle) {
    console.log("test:onKeyUp", e, handle);
    if (e) {
      console.log("event has been called", e);
    }
    this.setState({
      output: `onKeyUp ${keyName}`,
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
    $("ul li")
      .mouseenter(function () {
        var pos = $(this).position();
        $(this)
          .find("div")
          .css("top", pos.top + 50 + "px")
          .fadeIn();
      })
      .mouseleave(function () {
        $(this).find("div").fadeOut();
      });

    this.setState({ loading: true });
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

    if (this.state.editId > 0) {
      await axios
        .get(this.url + "findpos/" + this.state.editId, this.config)
        .then((response) => {
          console.log("Response : ", response.data);
          this.setState({ posModal: response.data });
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
    }
    this.setState({ loading: false });
  }

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      posModal: {
        ...this.state.posModal,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
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

  handleCheck = () => {
    this.setState({
      posModal: {
        ...this.state.posModal,
        isActive: !this.state.posModal.isActive,
      },
    });
  };

  savePOS = (e) => {
    console.log("Before Update", this.savePOSCount);
    if (this.savePOSCount == 1) {
      return;
    }
    this.savePOSCount = 1;
    console.log(this.state.posModal);
    // e.preventDefault();
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.posModal.posCode) === true) {
      myVal.posValField = (
        <span className="validationMsg">POS is required</span>
      );
      myVal.validation = true;
    } else {
      myVal.posValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.posModal.description) === true) {
      myVal.descriptionValField = (
        <span className="validationMsg">Description is required</span>
      );
      myVal.validation = true;
    } else {
      myVal.descriptionValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    this.setState({
      validationModel: myVal,
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      this.savePOSCount = 0;

      return;
    }

    axios
      .post(this.url + "savepos", this.state.posModal, this.config)
      .then((response) => {
        this.savePOSCount = 0;

        this.setState({
          posModal: response.data,
          editId: response.data.id,
          loading: false,
        });
        Swal.fire("Record Saved Successfully", "", "success");
        //Get CPT API
        axios
          .get(this.commonUrl + "getPOS", this.config)
          .then((posRes) => {
            console.log("CPT Response : ", posRes.data);
            this.props.POSAction(this.props, posRes.data, "SETPOS");
          })
          .catch((cptError) => {
            this.savePOSCount = 0;

            console.log("CPT Error : ", cptError);
          });
      })
      .catch((error) => {
        this.savePOSCount = 0;

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

  delete = (e) => {
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
          .delete(this.url + "deletepos/" + this.state.editId, this.config)
          .then((response) => {
            //Get CPT API
            axios
              .get(this.commonUrl + "getPOS", this.config)
              .then((posRes) => {
                console.log("CPT Response : ", posRes.data);
                this.props.POSAction(this.props, posRes.data, "SETPOS");
              })
              .catch((cptError) => {
                console.log("CPT Error : ", cptError);
              });
            this.setState({ loading: false });
            console.log("Delete Response :", response);
            Swal.fire("Record Deleted Successfully", "", "success");
          })
          .catch((error) => {
            this.setState({ loading: false });

            console.log(error);
            if (this.state.editId > 0) {
              Swal.fire(
                "Record Not Deleted!",
                "Record can not be delete, as it is being reference in other screens.",
                "error"
              );
            } else {
              Swal.fire(
                "Record Not Deleted!",
                "Don't have record to delete",
                "error"
              );
            }
          });
        $("#btnCancel").click();
      }
    });
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

  openhistorypopup = (id) => {
    // event.preventDefault()
    this.setState({ showPopup: true, id: id });
  };
  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };

  render() {
    const isActive = this.state.posModal.isActive;
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

    const options = [
      { value: "History", label: "History", className: "dropdown" },
    ];

    var Imag;
    Imag = (
      <div>
        <img src={settingIcon} />
      </div>
    );

    var dropdown;
    dropdown = (
      <Dropdown
        className=""
        options={options}
        onChange={() => this.openhistorypopup(0)}
        //  value={options}
        // placeholder={"Select an option"}
        placeholder={Imag}
      />
    );

    let popup = "";
    if (this.state.showPopup) {
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
      popup = <React.Fragment></React.Fragment>;
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
              style={{ minHeight: "200px", maxHeight: "700" }}
            >
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>
                        {this.state.editId > 0
                          ? this.state.posModal.posCode +
                            " - " +
                            this.state.posModal.name.toUpperCase()
                          : "NEW POS"}
                      </h3>

                      <div class="float-lg-right text-right">

                  <input class="checkbox" type="checkbox" checked={!isActive} onClick={this.handleCheck} />
                  Mark Invalid

                  <button
                    class=" btn btn-primary mr-2"
                    type="submit"
                    onClick={this.delete}
                    disabled={this.isDisabled(this.props.rights.delete)}
                  >
                    Delete
                  </button>
                  {/* {this.state.editId > 0 ?
                    (<img src={settingIcon} alt="" style={{ width: "17px" }} />) : null} */}
                  {this.state.editId > 0 ? dropdown : ""}

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
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="lastName">
                            POS<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder=" POS"
                            value={this.state.posModal.posCode}
                            name="posCode"
                            id="posCode"
                            maxLength="2"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.posValField}
                        </div>
                      </div>
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="lastName">
                            POS Name<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="POS Name"
                            value={this.state.posModal.name}
                            name="name"
                            id="name"
                            maxLength="20"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.posValField}
                        </div>
                      </div>
                      <div class="col-md-4 mb-2"></div>
                    </div>

                    <div class="row">
                      <div class="col-md-12 mb-2">
                        <div class="col-md-1 float-left">
                          <label for="lastName">
                            Description<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-11 float-left ">
                          <input
                            type="text"
                            style={{ marginLeft: "25px" }}
                            class="provider-form w-95 form-control-user"
                            placeholder=" Description"
                            value={this.state.posModal.description}
                            name="description"
                            id="description"
                            maxLength="100"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback-Description">
                          {this.state.validationModel.descriptionValField}
                        </div>
                      </div>
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
                          onClick={this.savePOS}
                          disabled={this.isDisabled(
                            this.state.editId > 0
                              ? this.props.rights.update
                              : this.props.rights.add
                          )}
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

                {/* <a class="scroll-to-top rounded" href="#page-top">
                  {" "}
                  <i class="fas fa-angle-up"></i>{" "}
                </a> */}
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
  console.log("state from New POS Page", state);
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
    userInfo1: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.posSearch,
          add: state.loginInfo.rights.posCreate,
          update: state.loginInfo.rights.posEdit,
          delete: state.loginInfo.rights.posDelete,
          export: state.loginInfo.rights.posExport,
          import: state.loginInfo.rights.posImport,
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
      POSAction: POSAction,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(NewPOS);
