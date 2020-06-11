import React, { Component } from 'react'
import $ from "jquery";
import axios from "axios";
import Input from "./Input";
import Swal from "sweetalert2";
import Dropdown from "react-dropdown";
import settingsIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";

import Eclips from '../images/loading_spinner.gif';
import GifLoader from 'react-gif-loader';


//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class NewDocumentType extends Component {
  constructor(props) {
    super(props);

    // http://96.69.218.154:8020/api/DocumentType/SaveDocumentTypes

    this.url = process.env.REACT_APP_URL + "/DocumentType/";

    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.docuTypeModel = {
      name: "",
      description: "",
      
    };

    this.validationModel = {
      docuTypeValField: "", //remarkcodeValField
      descriptionValField: ""
    };

    this.state = {
      editId: this.props.id,
      docuTypeModel: this.docuTypeModel,
      validationModel : this.validationModel,
      maxHeight: "361",
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

  openhistorypopup = id => {

    this.setState({ showPopup: true, id: id });
  };
  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };


  handleChange = event => {
    event.preventDefault();
    this.setState({
      docuTypeModel: {
        ...this.state.docuTypeModel,
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

  SaveDocumentType= e => {
    // console.log("Before Update", this.saveRemarkCodeCount)
    // if (this.saveRemarkCodeCount == 1) {
    //   return
    // }
    // this.saveRemarkCodeCount = 1;
    console.log(this.state.docuTypeModel);
    e.preventDefault();
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;
    console.log(this.state.docuTypeModel.name.length);

    if (this.isNull(this.state.docuTypeModel.name) === false) {
      if (this.state.docuTypeModel.name.length > 2) {
        if (this.state.docuTypeModel.name.length > 20) {
          myVal.docuTypeValField = (
            <span className="validationMsg">
              Document Type should be of 20 digits
            </span>
          );
          myVal.validation = true;
        } else {
          myVal.docuTypeValField = "";
          if (myVal.validation === false) myVal.validation = false;
        }
      } else if (this.state.docuTypeModel.name.length < 2) {
        if (this.state.docuTypeModel.name.length < 2) {
          myVal.docuTypeValField = (
            <span className="validationMsg">
              Document Type should be of 20 digits
            </span>
          );
          myVal.validation = true;
        } else {
          myVal.docuTypeValField = "";
          if (myVal.validation === false) myVal.validation = false;
        }
      } else {
        myVal.docuTypeValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else if (this.isNull(this.state.docuTypeModel.name) === true) {
      myVal.docuTypeValField = (
        <span className="validationMsg">Enter Document Type </span>
      );
      myVal.validation = true;
    } else {
      myVal.docuTypeValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.docuTypeModel.description) === true) {
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
      // this.saveRemarkCodeCount = 0;

      return;
    }

    axios
      .post(
        this.url + "SaveDocumentTypes",
        this.state.docuTypeModel,
        this.config
      )
      .then(response => {
        // this.saveRemarkCodeCount = 0;

        this.setState({
          docuTypeModel: response.data,
          editId: response.data.id,
          loading: false
        });
        Swal.fire("Record Saved Successfully", "", "success");
        alert(test);
        console.log(response.data);
      })

      .catch(error => {
        // this.saveRemarkCodeCount = 0;

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
            this.url + "DeleteDocumentType/" + this.state.editId,
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

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
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
        className="TodayselectContainer"
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
          onClose={() => this.closehistoryPopup}
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
                     ? this.state.docuTypeModel.name.toUpperCase() 
                     : "NEW DOCUMENT TYPE "}
                    </h3>

                    <div class="float-lg-right text-right">


                     <button
                        class=" btn btn-primary mr-2"
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
                  <div class="col-md-6 mb-2">
                      <div class="col-md-2 float-left">
                        <label for="name">
                        Document Type<span class="text-danger">*</span>
                        </label>
                      </div>
                      <div class="col-md-10 float-left" style={{paddingLeft:"26px"}}>
                        
                        <input
                          type="text"
                          class="provider-form w-100 form-control-user"
                          placeholder="Document Type"
                          value={this.state.docuTypeModel.name}
                          name="name"
                          id="name"
                          maxLength="30"
                          onChange={this.handleChange}
                        />
                      </div>
                      <div class="invalid-feedback-Descr-Doc">
                      {this.state.validationModel.docuTypeValField}
                      </div>
                    </div>

                    <div class="col-md-6 mb-2">
          
                    </div>


                  <div class="col-md-12 mt-3 mb-12">
                    <div class="col-md-1 float-left">
                      <label for="firstName">Description<span class="text-danger">*</span>
                      </label>
                    </div>
                    <div class="col-md-11 pl-4 m-0 float-left">
           
                    <textarea
                      value={this.state.docuTypeModel.description}
                      class="provider-form w-100 form-control-user"
                      name="description"
                      id="description"
                      cols="20"
                      rows="2"
                      onChange={this.handleChange}
                    ></textarea>
                    </div>
                    <div class="invalid-feedback-Description">
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
                      onClick={this.SaveDocumentType}
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

export default connect(mapStateToProps, matchDispatchToProps) (NewDocumentType);
