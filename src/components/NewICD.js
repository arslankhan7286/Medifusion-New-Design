import React, { Component } from "react";
import $ from "jquery";
import axios from "axios";
import Input from "./Input";
import Swal from "sweetalert2";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { ICDAction } from "../actions/ICDAction";

import Hotkeys from "react-hot-keys";

class NewICD extends Component {
  constructor(props) {
    super(props);

    this.errorField = "errorField";
    this.url = process.env.REACT_APP_URL + "/icd/";
    this.commonUrl = process.env.REACT_APP_URL + "/Common/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.saveICDCount = 0;

    this.validationModel = {
      icdCodeValField: "",
      descriptionValField: "",
    };
    this.icdModel = {
      icdCode: "",
      description: "",
      isValid: true,
    };

    this.state = {
      icdModel: this.icdModel,
      validationModel: this.validationModel,
      editId: this.props.id,
      maxHeight: "361",
      loading: false,
    };
  }

  onKeyDown(keyName, e, handle) {
    console.log("test:onKeyDown", keyName, e, handle);

    if (keyName == "alt+s") {
      // alert("save key")
      this.saveICD();
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
    this.setState({ loading: true });

    await this.setModalMaxHeight($(".modal"));
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
        .get(this.url + "findicd/" + this.state.editId, this.config)
        .then((response) => {
          console.log("Response : ", response.data);
          this.setState({ icdModel: response.data });
        })
        .catch((error) => {
          try {
            let errorsList = [];
            if (error.response !== null && error.response.data !== null) {
              errorsList = error.response.data;
              console.log(errorsList);
            }
          } catch {
            this.setState({ loading: false });
            console.log(error);
          }
        });
    }
    this.setState({ loading: false });
  }

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      icdModel: {
        ...this.state.icdModel,
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
      icdModel: {
        ...this.state.icdModel,
        isActive: !this.state.icdModel.isActive,
      },
    });
  };

  handleIsValid = () => {
    this.setState({
      icdModel: {
        ...this.state.icdModel,
        isValid: !this.state.icdModel.isValid,
      },
    });
  };

  saveICD = (e) => {
    console.log("Before Update", this.saveICDCount);
    if (this.saveICDCount == 1) {
      return;
    }
    this.saveICDCount = 1;
    console.log(this.state.icdModel);
    e.preventDefault();
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;
    var dotfind = this.state.icdModel.icdCode.indexOf(".");

    if (this.isNull(this.state.icdModel.icdCode)) {
      myVal.icdCodeValField = <span className="validationMsg">Enter ICD</span>;
      myVal.validation = true;
    } else {
      if (dotfind == -1) {
        if (this.state.icdModel.icdCode.length > 7) {
          myVal.icdCodeValField = (
            <span className="validationMsg">ICD length should be 7</span>
          );
          myVal.validation = true;
        } else {
          myVal.icdCodeValField = "";
          if (myVal.validation === false) myVal.validation = false;
        }
      } else {
        if (this.state.icdModel.icdCode.length > 8) {
          myVal.icdCodeValField = (
            <span className="validationMsg">
              ICD (with point) length should be 8
            </span>
          );
          myVal.validation = true;
        }
      }
    }

    if (this.isNull(this.state.icdModel.description) === true) {
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
      this.saveICDCount = 0;
      return;
    }

    axios
      .post(this.url + "saveicd", this.state.icdModel, this.config)
      .then((response) => {
        console.log("ICD Response : ", response.data);
        // Get CPT API
        var newICDList = this.props.icdCodes.concat({
          id: response.data.id,
          value: response.data.description,
          label: response.data.icdCode,
          description: response.data.description,
          description1: response.data.id,
          description2: null,
          anesthesiaUnits: null,
          category: null,
        });
        console.log("New ICd List : ", newICDList);

        this.props.ICDAction(this.props, newICDList, "SETICD");

        // axios
        //   .get(this.commonUrl + "getICD", this.config)
        //   .then(icdRes => {
        //     this.saveICDCount = 0;
        //     console.log("CPT Response : ", icdRes.data);
        //     this.props.ICDAction((this.props, icdRes.data, "SETICD"));
        //   })
        //   .catch(cptError => {
        //     this.saveICDCount = 0;
        //     console.log("CPT Error : ", cptError);
        //   });
        this.setState({
          icdModel: response.data,
          editId: response.data.id,
          loading: false,
        });
        Swal.fire("Record Saved Successfully", "", "success");
        // $("#btnCancel").click();
      })
      .catch((error) => {
        this.saveICDCount = 0;
        this.setState({ loading: false });
        console.log(error);
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
          .delete(this.url + "deleteicd/" + this.state.editId, this.config)
          .then((response) => {
            this.setState({ loading: false });

            console.log("Delete Response :", response);
            Swal.fire("Record Deleted Successfully", "", "success");

            //Get CPT API
            axios
              .get(this.commonUrl + "getICD", this.config)
              .then((icdRes) => {
                console.log("CPT Response : ", icdRes.data);
                this.props.ICDAction((this.props, icdRes.data, "SETICD"));
              })
              .catch((cptError) => {
                console.log("CPT Error : ", cptError);
              });
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

  render() {
    const isActive = this.state.icdModel.isActive;
    const isValid = this.state.icdModel.isValid;

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
              style={{ height: "300px", minHeight: "300px", maxHeight: "700px" }}
            >

              <div
                class="modal-header"
                style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>
                        {this.state.editId > 0
                          ? this.state.icdModel.icdCode
                          : "NEW ICD"}
                      </h3>

                      <div class="float-lg-right text-right">

                        <input class="checkbox" type="checkbox"
                         checked={!isActive}
                          onClick={this.handleCheck} />
                        Mark Inactive

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
                        {/* {this.state.editId > 0 ? dropdown : ""} */}

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
                        <div class="col-md-4 float-left"><label for="address1"> ICD Code<span
                          class="text-danger">*</span></label></div>
                        <div class="col-md-8 float-left">
                          <input type="text" class="provider-form w-100 form-control-user"
                            placeholder=" ICD Code" required=""
                            value={this.state.icdModel.icdCode}
                            name="icdCode"
                            id="icdCode"
                            maxLength="7"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.icdCodeValField}
                        </div>

                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left"><label for="address1">Is Valid
                      </label></div>
                        <div class="col-md-8 float-left">
                          <div style={{ marginBottom: "10px" }}
                            class="lblChkBox"
                            onClick={this.handleIsValid}
                          >
                            <input
                              type="checkbox"
                              id="isValid"
                              name="isValid"
                              checked={!isValid}
                            />
                            <label for="reportTaxID">
                              <span></span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4 mb-2">
                      </div>
                    </div>





                    <div class="row">
                      <div class="col-md-11 mb-2">
                        <div class="col-md-1 float-left">
                          <label>Description</label>
                        </div>
                        <div class="col-md-11 pl-5 float-left">
                          <textarea
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Description"
                            value={this.state.icdModel.description}
                            name="description"
                            id="description"
                            onChange={this.handleChange}
                          ></textarea>
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
                          onClick={this.saveICD}
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

                <a class="scroll-to-top rounded" href="#page-top">
                  {" "}
                  <i class="fas fa-angle-up"></i>{" "}
                </a>
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
  console.log("state from Header Page", state);
  return {
    icdCodes: state.loginInfo
      ? state.loginInfo.icd
        ? state.loginInfo.icd
        : []
      : [],
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
        search: state.loginInfo.rights.icdSearch,
        add: state.loginInfo.rights.icdCreate,
        update: state.loginInfo.rights.icdEdit,
        delete: state.loginInfo.rights.icdDelete,
        export: state.loginInfo.rights.icdExport,
        import: state.loginInfo.rights.icdImport,
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
      ICDAction: ICDAction,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(NewICD);
