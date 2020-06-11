import React, { Component } from "react";

import Swal from "sweetalert2";
import axios from "axios";
import Input from "./Input";

import Label from "./Label";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import $ from "jquery";
import Dropdown from "react-dropdown";
import settingsIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

export class NewGroup extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Group/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };


    this.saveGroupCount = 0;
    this.groupModel = {
      name: "",
      description: "",
      userID: ""
    };

    this.validationModel = {
      valname: null,
      valdescription: null,
      valuserID: null
    };

    this.state = {
      editId: this.props.id,
      groupModel: this.groupModel,
      validationModel: this.validationModel,

      usersData: [],
      isActive: true,
      maxHeight: "361",
      loading: false,
      showPopup: false
    };
    this.saveGroup = this.saveGroup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
  }

  async componentWillMount() {
    await this.setState({ loading: true });
    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function () {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);

    try {
      await axios
        .get(this.url + "GetProfiles", this.config)
        .then(response => {

          this.setState({
            usersData: response.data.users
          });

        })
        .catch(error => {
        });

      this.setModalMaxHeight($(".modal"));

      // alert(this.state.editId)
      if (this.state.editId > 0) {
        await axios
          .get(this.url + "FindGroup/" + this.state.editId, this.config)

          .then(response => {
            this.setState({ groupModel: response.data });
          })
          .catch(error => {
            let errorsList = [];
            if (error.response !== null && error.response.data !== null) {
              errorsList = error.response.data;
            } 
          });
      }
    } catch {
      await this.setState({ loading: false });
    }

    await this.setState({ loading: false });
  }

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

  handleChange = event => {
 //Carret Position
 const caret = event.target.selectionStart
 const element = event.target
 window.requestAnimationFrame(() => {
   element.selectionStart = caret
   element.selectionEnd = caret
 })
    if (event.target.name === "userID") {
      this.setState({
        groupModel: {
          ...this.state.groupModel,
          [event.target.name]: event.target.value
        }
      });
    } else {
      this.setState({
        groupModel: {
          ...this.state.groupModel,
          [event.target.name]: event.target.value.toUpperCase()
        }
      });
    }
  };

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

  isNull(value) {
    if (value === "" || value === null || value === undefined) return true;
    else return false;
  }

  saveGroup = e => {
    if (this.saveGroupCount == 1) {
      return
    }
    this.saveGroupCount = 1;

    this.setState({ loading: true });
    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.groupModel.name)) {
      myVal.valname = <span className="validationMsg">Enter Name</span>;
      myVal.validation = true;
    } else {
      myVal.valname = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.groupModel.description)) {
      myVal.valdescription = (
        <span className="validationMsg">Enter Description</span>
      );
      myVal.validation = true;
    } else {
      myVal.valdescription = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.groupModel.userID)) {
      myVal.valuserID = <span className="validationMsg">Enter userID </span>;
      myVal.validation = true;
    } else {
      myVal.valuserID = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    this.setState({
      validationModel: myVal
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      this.saveGroupCount = 0;
      return;
    }

    e.preventDefault();
    axios
      .post(this.url + "SaveGroup", this.state.groupModel, this.config)
      .then(response => {
        this.saveGroupCount = 0;

        this.setState({ data: response.data, loading: false });

        Swal.fire("Record Saved Successfully", "", "success");
      })
      .catch(error => {
        this.saveGroupCount = 0;

        this.setState({ loading: false });
        let errorList = [];
        if (error.response !== null && error !== null) {
          errorList = error.response;
        }
      });

    e.preventDefault();
  };

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
    const isActive = this.state.groupModel.isActive;
    //Spinner
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
          src={settingsIcon}
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
          style={{ minHeight:"200px" , maxHeight:"700" }}
          >

            <div
              class="modal-header"
              style={{ marginLeft: "0px" }}>
              <div class="row ml-0 mr-0 w-100">
                <div class="col-md-12 order-md-1 provider-form ">
                  {spiner}
                  <div class="header pt-1">
                    <h3>
                      {
                     this.state.editId > 0
                     ? this.state.groupModel.name.toUpperCase() 
                     : "NEW GROUP SEARCH"}
                    </h3>
                    <div class="float-lg-right text-right">

                      <input class="checkbox "
                       type="checkbox"
                        checked={isActive}
                         onClick={this.handleCheck} />
                      Mark Inactive

                     <button
                        class=" btn btn-primary mr-2 ml-2"
                        type="submit"
                        onClick={this.delete}
                        // disabled={this.isDisabled(this.props.rights.delete)}
                      >
                        Delete
                      </button>
                      {/* {this.state.editId > 0 ?
                        (<img src={settingIcon} alt="" style={{ width: "17px" }} />) : null} */}
                      {this.state.editId > 0 ? dropdown : ""}

                      <button
                        class="close "
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
                        <label for="name">
                          Name<span class="text-danger">*</span>
                        </label>
                      </div>
                      <div class="col-md-8 float-left">
                        <input
                          type="text"
                          class="provider-form w-100 form-control-user"
                          placeholder="Payer Name"
                          value={this.state.groupModel.name}
                          name="name"
                          id="name"
                          maxLength="30"
                          onChange={this.handleChange}
                        />
                      </div>
                      <div class="invalid-feedback">
                        {this.state.validationModel.valname}
                      </div>
                    </div>
       



                    <div class="col-md-4 mb-2">
                      <div class="col-md-4 float-left">
                        <label for="name">
                          Description<span class="text-danger">*</span>
                        </label>
                      </div>
                      <div class="col-md-8 float-left">
                        <input
                          type="text"
                          class="provider-form w-100 form-control-user"
                          placeholder="Description"
                          value={this.state.groupModel.description}
                          name="description"
                          id="description"
                          maxLength="30"
                          onChange={this.handleChange}
                        />
                      </div>
                      <div class="invalid-feedback">
                        {this.state.validationModel.valdescription}
                      </div>
                    </div>

                    <div class="col-md-4 mb-2">
                    <div class="col-md-4 float-left">
                    <label for="firstName">User ID <span
                              class="text-danger">*</span></label>
                      </div>
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
                                name="userID"
                                id="userID"
                                value={this.state.groupModel.userID}
                                onChange={this.handleChange}>
                                {this.state.usersData.map(s => (
                              <option key={s.id} value={s.description3}>
                                {s.description2} 
                              </option>
                            ))}
                              </select>
                            
                          </div>
                              <div class="invalid-feedback">
                                {this.state.validationModel.valuserID}
                             </div>

                    </div>

                  </div>

                  <br></br>
                  {/* Save ans Cancel Butons */}
                  <div class="col-12 text-center">
                    <button
                      class="btn btn-primary mr-2"
                      type="submit"
                      onClick={this.saveGroup}
                      // disabled={this.isDisabled(
                      //   this.state.editId > 0
                      //     ? this.props.rights.update
                      //     : this.props.rights.add
                      // )}
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
        search: state.loginInfo.rights.groupSearch,
        add: state.loginInfo.rights.groupCreate,
        update: state.loginInfo.rights.groupUpdate,
        delete: state.loginInfo.rights.groupDelete,
        export: state.loginInfo.rights.groupExport,
        import: state.loginInfo.rights.groupImport
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

export default connect(mapStateToProps, matchDispatchToProps)(NewGroup);
