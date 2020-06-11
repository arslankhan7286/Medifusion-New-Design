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

class NewRemarkCode extends Component {
  constructor(props) {
    super(props);
    this.errorField = "errorField";
    this.url = process.env.REACT_APP_URL + "/RemarkCode/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.saveRemarkCodeCount = 0;

    // alert(this.props.id);

    this.validationModel = {
      remarkCodeValField: "",
      descriptionValField: ""
    };
    this.remarkCodeModel = {
      code: "",
      description: "",
      isValid: true,
      isActive: true
    };

    this.state = {
      remarkCodeModel: this.remarkCodeModel,
      validationModel: this.validationModel,
      editId: this.props.id,
      maxHeight: "361",
      loading: false,
      showPopup: false
    };
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
    await this.setState({ loading: true });
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

    if (this.state.editId > 0) {
      await axios
        .get(this.url + "FindRemarkCode/" + this.state.editId, this.config)
        .then(response => {
          console.log("Response : ", response.data);
          this.setState({ remarkCodeModel: response.data });
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
    }
    this.setState({ loading: false });
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({
      remarkCodeModel: {
        ...this.state.remarkCodeModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
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
      remarkCodeModel: {
        ...this.state.remarkCodeModel,
        isActive: !this.state.remarkCodeModel.isActive
      }
    });
  };

  handleIsValid = () => {
    this.setState({
      remarkCodeModel: {
        ...this.state.remarkCodeModel,
        isValid: !this.state.remarkCodeModel.isValid
      }
    });
  };

  SaveAdjusmentCode = e => {
    console.log("Before Update", this.saveRemarkCodeCount)
    if (this.saveRemarkCodeCount == 1) {
      return
    }
    this.saveRemarkCodeCount = 1;
    console.log(this.state.remarkCodeModel);
    e.preventDefault();
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;
    console.log(this.state.remarkCodeModel.code.length);

    if (this.isNull(this.state.remarkCodeModel.code) === false) {
      if (this.state.remarkCodeModel.code.length > 2) {
        if (this.state.remarkCodeModel.code.length > 5) {
          myVal.adjustmentCodeValField = (
            <span className="validationMsg">
              Remark Code should be of 5 digits
            </span>
          );
          myVal.validation = true;
        } else {
          myVal.adjustmentCodeValField = "";
          if (myVal.validation === false) myVal.validation = false;
        }
      } else if (this.state.remarkCodeModel.code.length < 2) {
        if (this.state.remarkCodeModel.code.length < 2) {
          myVal.adjustmentCodeValField = (
            <span className="validationMsg">
              Remark Code should be of 5 digits
            </span>
          );
          myVal.validation = true;
        } else {
          myVal.adjustmentCodeValField = "";
          if (myVal.validation === false) myVal.validation = false;
        }
      } else {
        myVal.adjustmentCodeValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else if (this.isNull(this.state.remarkCodeModel.code) === true) {
      myVal.adjustmentCodeValField = (
        <span className="validationMsg">Enter Remark Code </span>
      );
      myVal.validation = true;
    } else {
      myVal.adjustmentCodeValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.remarkCodeModel.description) === true) {
      myVal.descriptionValField = (
        <span className="validationMsg">Description is required</span>
      );
      myVal.validation = true;
    } else {
      myVal.descriptionValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    this.setState({
      validationModel: myVal
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      this.saveRemarkCodeCount = 0;

      return;
    }

    axios
      .post(
        this.url + "SaveRemarkCode",
        this.state.remarkCodeModel,
        this.config
      )
      .then(response => {
        this.saveRemarkCodeCount = 0;

        this.setState({
          remarkCodeModel: response.data,
          editId: response.data.id,
          loading: false
        });
        Swal.fire("Record Saved Successfully", "", "success");
        alert(test);
        console.log(response.data);
      })

      .catch(error => {
        this.saveRemarkCodeCount = 0;

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

  delete = e => {
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
        this.setState({ loading: true });

        axios
          .delete(
            this.url + "DeleteRemarkCode/" + this.state.editId,
            this.config
          )
          .then(response => {
            this.setState({ loading: false });

            console.log("Delete Response :", response);
            Swal.fire("Record Deleted Successfully", "", "success");
            $("#btnCancel").click();
          })
          .catch(error => {
            this.setState({ loading: false });

            console.log(error);
            Swal.fire(
              "Record Not Deleted!",
              "Record can not be delete, as it is being reference in other screens.",
              "error"
            );
          });
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

  openhistorypopup = id => {
    this.setState({ showPopup: true, id: id });
  };
  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };

  render() {
    const isActive = this.state.remarkCodeModel.isActive;
    const isValid = this.state.remarkCodeModel.isValid;

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
      { value: "History", label: "History", className: "dropdown" }
    ];

    var Imag;
    Imag = (
      <div>
        <img
          src={settingIcon}
        />
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
                          ? this.state.remarkCodeModel.code
                          : "NEW REMARK CODES"}
                      </h3>

                      <div class="float-lg-right text-right">



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
                        <div class="col-md-4 float-left"><label for="address1"> Remark Code<span
                          class="text-danger">*</span></label></div>
                        <div class="col-md-8 float-left">
                          <input type="text" class="provider-form w-100 form-control-user"
                            placeholder=" Remark Code" required=""
                            value={this.state.remarkCodeModel.code}
                            name="code"
                            id="code"
                            maxLength="5"
                            min="2"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.adjustmentCodeValField}
                        </div>

                      </div>

                      <div class="col-md-4 mb-2">

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
                            value={this.state.remarkCodeModel.description}
                            name="description"
                            id="description"
                            onChange={this.handleChange}
                          ></textarea>
                        </div>
                        <div className="invalid-feedback-Description">
                          {this.state.validationModel.descriptionValField}
                        </div>
                      </div>
                    </div>
                    





                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={this.SaveAdjusmentCode}
                        disabled={this.isDisabled(
                          this.state.editId > 0
                            ? this.props.rights.update
                            : this.props.rights.add
                        )}
                      >
                        Save
                        </button>

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
        search: state.loginInfo.rights.remarkCodesSearch,
        add: state.loginInfo.rights.remarkCodesCreate,
        update: state.loginInfo.rights.remarkCodesEdit,
        delete: state.loginInfo.rights.remarkCodesDelete,
        export: state.loginInfo.rights.remarkCodesExport,
        import: state.loginInfo.rights.remarkCodesImport
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

export default connect(mapStateToProps, matchDispatchToProps)(NewRemarkCode);
