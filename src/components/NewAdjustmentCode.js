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

class NewAdjustmentCode extends Component {
  constructor(props) {
    super(props);
    this.errorField = "errorField";
    this.url = process.env.REACT_APP_URL + "/AdjustmentCode/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.saveAdjustmentCodeCount = 0;

    // alert(this.props.id);
    this.validationModel = {
      adjustmentCodeValField: "",
      descriptionValField: ""
    };
    this.adjustmentModel = {
      code: "",
      description: "",
      groupID: null,
      reasonID: null,
      actionID: null,
      isValid: true
    };

    this.state = {
      adjustmentModel: this.adjustmentModel,
      validationModel: this.validationModel,
      editId: this.props.id,
      practiceID: this.props.userInfo.practiceID,
      maxHeight: "361",
      typeAdjustment: false,
      action: [],
      reason: [],
      group: [],
      loading: false,
      showPopup: false
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
  }

  async componentDidMount() {
    await this.setState({ loading: true });
    await axios
      .get(this.url + "GetProfiles", this.config)
      .then(response => {
        console.log("Get Profiles Response to actions: ", response);
        this.setState({
          action: response.data.action,
          reason: response.data.reason,
          group: response.data.group
        });
        console.log("ACTION: ", this.state.action);
      })

      .catch(error => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.status) {
            //Swal.fire("Unauthorized Access" , "" , "error");
            console.log(error.response.status);
            return;
          }
        } else if (error.request) {
          console.log(error.request);
          return;
        } else {
          console.log("Error", error.message);
          console.log(JSON.stringify(error));
          //Swal.fire("Something went Wrong" , "" , "error");
          return;
        }

        console.log(error);
      });

    await axios
      .get(this.url + "GetProfiles/" + this.state.editId, this.config)
      .then(response => {
        console.log("Response : ", response.data);
        this.setState({ adjustmentModel: response.data });
      })
      .catch(error => {
        this.setState({ loading: false });
      });

    console.log("ID of Practice : ", this.props.userInfo.practiceID);
    await this.setModalMaxHeight($(".modal"));
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
        .get(this.url + "FindAdjustmentCode/" + this.state.editId, this.config)
        .then(response => {
          console.log("Response : ", response.data);
          this.setState({ adjustmentModel: response.data });
        })
        .catch(error => {
          this.setState({ loading: false });
        });

      await axios
        .get(this.url + "FindAdjustmentCode/" + this.state.editId, this.config)

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
    console.log(event);
    this.setState({
      adjustmentModel: {
        ...this.state.adjustmentModel,
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
      adjustmentModel: {
        ...this.state.adjustmentModel,
        isActive: !this.state.adjustmentModel.isActive
      }
    });
  };
  handleIsValid = () => {
    this.setState({
      adjustmentModel: {
        ...this.state.adjustmentModel,
        isValid: !this.state.adjustmentModel.isValid
      }
    });
  };

  SaveAdjusmentCode = e => {
    console.log("Before Update", this.saveAdjustmentCodeCount)
    if (this.saveAdjustmentCodeCount == 1) {
      return
    }
    this.saveAdjustmentCodeCount = 1;
    // console.log(this.state.remarkCodeModel);
    console.log(this.state.adjustmentModel);
    e.preventDefault();

    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.adjustmentModel.code) === true) {
      myVal.adjustmentCodeValField = (
        <span className="validationMsg">Adjusment Code Is Required</span>
      );
      myVal.validation = true;
    } else {
      myVal.adjustmentCodeValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.adjustmentModel.description) === true) {
      myVal.descriptionValField = (
        <span className="validationMsg">Description Is Required</span>
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
      this.saveAdjustmentCodeCount = 0;
      return;
    }

    axios
      .post(
        this.url + "SaveAdjustmentCode",
        this.state.adjustmentModel,
        this.config
      )
      .then(response => {
        this.saveAdjustmentCodeCount = 0;

        this.setState({
          adjustmentModel: response.data,
          editId: response.data.id
        });
        Swal.fire("Record Saved Successfully", "", "success");
        console.log(response.data);
      })

      .catch(error => {
        this.saveAdjustmentCodeCount = 0;

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
        axios
          .delete(
            this.url + "DeleteAdjustmentCode/" + this.state.editId,
            this.config
          )
          .then(response => {
            console.log("Delete Response :", response);
            Swal.fire("Record Deleted Successfully", "", "success");
          })
          .catch(error => {
            console.log(error);
            Swal.fire(
              "Record Not Deleted!",
              "Record can not be delete, as it is being reference in other screens.",
              "error"
            );
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

  openhistorypopup = id => {
    this.setState({ showPopup: true, id: id });
  };
  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };

  render() {
    const type = [
      { value: "", display: "Select Type" },
      { value: "W", display: "Write Off" },
      { value: "D", display: "Denial" }
    ];
    const isActive = this.state.adjustmentModel.isActive;
    const isValid = this.state.adjustmentModel.isValid;

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
              style={{ minHeight: "300px", maxHeight: "700px" }}
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
                          ? this.state.adjustmentModel.code
                          : "NEW ADJUSTMENT CODES"}
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
                        <div class="col-md-4 float-left"><label for="code"> Adjustment Code<span
                          class="text-danger">*</span></label></div>
                        <div class="col-md-8 float-left">
                          <input type="text" class="provider-form w-100 form-control-user"
                            placeholder=" Adjustment Code" required=""
                            value={this.state.adjustmentModel.code}
                            name="code"
                            id="code"
                            maxLength="3"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.adjustmentCodeValField}
                        </div>

                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left"><label for="address1">Type<span
                          class="text-danger">*</span></label></div>
                        <div class="col-md-8 float-left">
                          <select
                            style={{
                              borderRadius: "6px",
                              border: "1px solid rgb(125, 128, 134)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "30px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "100%",
                              paddingLeft: "2px",
                              paddingBottom: "6px",
                              paddingTop: "6px",
                              color: "rgb(67, 75, 93"
                            }}
                            name="type"
                            id="type"
                            value={this.state.adjustmentModel.type}
                            onChange={this.handleChange}
                          >
                            {type.map(w => (
                              <option key={w.id} value={w.value}>
                                {w.display}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.adjustmentCodeValField}
                        </div>
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
                            value={this.state.adjustmentModel.description}
                            name="description"
                            id="description"
                            onChange={this.handleChange}
                          ></textarea>
                        </div>
                        <div class="invalid-feedback-Desc">
                          {this.state.validationModel.descriptionValField}
                        </div>

                      </div>
                    </div>


                    <div class="row">
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left"><label for="address1">Action
                        ></label></div>
                        <div class="col-md-8 float-left">
                          <select
                            style={{
                              borderRadius: "6px",
                              border: "1px solid rgb(125, 128, 134)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "30px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "100%",
                              paddingLeft: "2px",
                              paddingBottom: "6px",
                              paddingTop: "6px",
                              color: "rgb(67, 75, 93"
                            }}
                            name="actionID"
                            id="actionID"
                            value={this.state.adjustmentModel.actionID}
                            onChange={this.handleChange}
                          >
                            {this.state.action.map(a => (
                              <option key={a.id} value={a.id}>
                                {a.description}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left"><label for="address1">Reason
                     </label></div>
                        <div class="col-md-8 float-left">
                          <select
                            style={{
                              borderRadius: "6px",
                              border: "1px solid rgb(125, 128, 134)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "30px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "100%",
                              paddingLeft: "2px",
                              paddingBottom: "6px",
                              paddingTop: "6px",
                              color: "rgb(67, 75, 93"
                            }}
                            name="reasonID"
                            id="reasonID"
                            value={this.state.adjustmentModel.reasonID}
                            onChange={this.handleChange}
                          >
                            {this.state.reason.map(r => (
                              <option key={r.id} value={r.id}>
                                {r.description}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left"><label for="address1">Group
                    </label></div>
                        <div class="col-md-8 float-left">
                          <select
                            style={{
                              borderRadius: "6px",
                              border: "1px solid rgb(125, 128, 134)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "30px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "100%",
                              paddingLeft: "2px",
                              paddingBottom: "6px",
                              paddingTop: "6px",
                              color: "rgb(67, 75, 93"
                            }}
                            name="groupID"
                            id="groupID"
                            value={this.state.adjustmentModel.groupID}
                            onChange={this.handleChange}
                          >
                            {this.state.group.map(g => (
                              <option key={g.id} value={g.id}>
                                {g.description}
                              </option>
                            ))}
                          </select>
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
      </React.Fragment >
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
        search: state.loginInfo.rights.adjustmentCodesSearch,
        add: state.loginInfo.rights.adjustmentCodesCreate,
        update: state.loginInfo.rights.adjustmentCodesEdit,
        delete: state.loginInfo.rights.adjustmentCodesDelete,
        export: state.loginInfo.rights.adjustmentCodesExport,
        import: state.loginInfo.rights.adjustmentCodesImport
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
)(NewAdjustmentCode);
