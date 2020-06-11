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
import { MDBBtn, MDBCollapse } from "mdbreact";
import Label from "./Label";
import Select, { components } from "react-select";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class NewInsurancePortal extends Component {
  constructor(props) {
    super(props);
    this.errorField = "errorField";
    this.url = process.env.REACT_APP_URL + "/Portal/";
    this.planURL = process.env.REACT_APP_URL + "/PatientPlan/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.saveRemarkCodeCount = 0;

    // alert(this.props.id);

    this.validationModel = {
      nameValField: "",
      // typeValField: ""
    };

    //online Portal Model
    this.onlinePortalsModel = {
      id: 0,
      insurancePlanID: "",
      name: "",
      url: "",
      type: "",
      onlinePortalCredentials: [],
    };

    //online portal credentials Model
    this.onlinePortalCredentials = {
      id: 0,
      onlinePortalsID: "",
      username: "",
      password: "",
      passwordExpiryDate: null,
      sercurityQ1: "",
      securityA1: "",
      securityQ2: "",
      securityA2: "",
      securityQ3: "",
      securityA3: "",
      notes: "",
    };

    this.state = {
      onlinePortalsModel: this.onlinePortalsModel,
      onlinePortalCredentials: this.onlinePortalCredentials,
      validationModel: this.validationModel,
      editId: this.props.id,
      maxHeight: "361",
      loading: false,
      showPopup: false,
      collapseMenu: 0,
      insurancePlanID: {},
      insurancePlans: [],
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
    this.setModalMaxHeight($(".modal"));

    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function () {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);

    try {
      //get insurance plans from get profiles
      await axios
        .get(this.planURL + "getprofiles", this.config)
        .then((response) => {
          this.setState({ insurancePlans: response.data.insurancePlans });
        })
        .then((error) => { });
    } catch { }

    // this.setState({
    //   insurancePlanID: this.state.insurancePlans.filter(
    //     option => option.id == this.state.onlinePortalsModel.insurancePlanID
    //   )
    // });

    if (this.state.editId > 0) {
      try {
        await axios
          .get(this.url + "FindOnlinePortal/" + this.state.editId, this.config)
          .then(async (response) => {
            var insurancePlan = await this.state.insurancePlans.filter(
              (option) => option.id == response.data.insurancePlanID
            );
            this.setState({
              onlinePortalsModel: response.data,
              insurancePlanID: insurancePlan,
            });
          })
          .catch((error) => {
            console.log(error);
          });

        var onlinePortalCredentials = { ...this.onlinePortalCredentials };
        await this.setState({
          collapseID: 1,
          // onlinePortalsModel: {
          //   ...this.state.onlinePortalsModel,
          //   onlinePortalCredentials: this.state.onlinePortalsModel.onlinePortalCredentials.concat(
          //     onlinePortalCredentials
          //   )
          // }
        });
      } catch { }
    } else {
      var onlinePortalCredentials = { ...this.onlinePortalCredentials };
      await this.setState({
        collapseID: 1,
        onlinePortalsModel: {
          ...this.state.onlinePortalsModel,
          onlinePortalCredentials: this.state.onlinePortalsModel.onlinePortalCredentials.concat(
            onlinePortalCredentials
          ),
        },
      });
    }

    await this.setState({ loading: false });
  }

  handleChange = (event) => {
    console.log(event.target.name, event.target.value);
    event.preventDefault();
    this.setState({
      onlinePortalsModel: {
        ...this.state.onlinePortalsModel,
        [event.target.name]:
          event.target.name == "type"
            ? event.target.value
            : event.target.value.toUpperCase(),
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

  savePortalData = (e) => {
    console.log(this.state.onlinePortalsModel);

    e.preventDefault();
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.onlinePortalsModel.name) === true) {
      myVal.nameValField = <span className="validationMsg">Enter Name</span>;
      myVal.validation = true;
    } else {
      myVal.nameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    // if (this.isNull(this.state.onlinePortalsModel.type) === true) {
    //   myVal.typeValField = (
    //     <span
    //       className="validationMsg"
    //       style={{ marginLeft: "34%", paddingTop: "2%" }}
    //     >
    //       Select Type
    //     </span>
    //   );
    //   myVal.validation = true;
    // } else {
    //   myVal.typeValField = "";
    //   if (myVal.validation === false) myVal.validation = false;
    // }

    this.setState({
      validationModel: myVal,
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      return;
    }

    axios
      .post(
        this.url + "SaveOnlinePortals",
        this.state.onlinePortalsModel,
        this.config
      )
      .then((response) => {
        this.setState({
          onlinePortalsModel: response.data,
          editId: response.data.id,
          loading: false,
        });
        Swal.fire("Record Saved Successfully", "", "success");
      })

      .catch((error) => {
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
          .delete(this.url + "DeletePortal/" + this.state.editId, this.config)
          .then((response) => {
            this.setState({ loading: false });

            console.log("Delete Response :", response);
            Swal.fire("Record Deleted Successfully", "", "success");
            $("#btnCancel").click();
          })
          .catch((error) => {
            this.setState({ loading: false });

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
    this.setState({ showPopup: true, id: id });
  };

  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };

  //Add Row
  addPortalRow = () => {
    // const onlinePortalCredentials = { ...this.onlinePortalCredentials };
    var length = this.state.onlinePortalsModel
      ? this.state.onlinePortalsModel.onlinePortalCredentials.length
      : 0;
    console.log(length);
    if (length == 0) {
      this.setState({
        onlinePortalsModel: {
          ...this.state.onlinePortalsModel,
          onlinePortalCredentials: this.state.onlinePortalsModel.onlinePortalCredentials.concat(
            this.onlinePortalCredentials
          ),
        },
      });
    } else {
      length = length - 1;
      var onlinePortalCredentials = this.state.onlinePortalsModel
        .onlinePortalCredentials;
      onlinePortalCredentials[length].validation = false;

      //usernameValField
      if (this.isNull(onlinePortalCredentials[length].username)) {
        onlinePortalCredentials[length].usernameValField = (
          <span className="validationMsg" style={{ marginLeft: "35%" }}>
            Enter User Name
          </span>
        );
        onlinePortalCredentials[length].validation = true;
      } else {
        if (onlinePortalCredentials[length].validation == false)
          onlinePortalCredentials[length].validation = false;
      }

      //usernameValField
      if (this.isNull(onlinePortalCredentials[length].password)) {
        onlinePortalCredentials[length].passwordValField = (
          <span className="validationMsg" style={{ marginLeft: "1%" }}>
            Enter Password
          </span>
        );
        onlinePortalCredentials[length].validation = true;
      } else {
        if (onlinePortalCredentials[length].validation == false)
          onlinePortalCredentials[length].validation = false;
      }
      if (onlinePortalCredentials[length].validation == true) {
        this.setState({
          onlinePortalsModel: {
            ...this.state.onlinePortalsModel,
            onlinePortalCredentials: onlinePortalCredentials,
          },
        });
        Swal.fire(
          "First  Fill All Required Fields of Previous User",
          "",
          "error"
        );
        return;
      } else {
        this.setState({
          onlinePortalsModel: {
            ...this.state.onlinePortalsModel,
            onlinePortalCredentials: this.state.onlinePortalsModel.onlinePortalCredentials.concat(
              this.onlinePortalCredentials
            ),
          },
        });
      }
    }
  };

  showHide(collapseID) {
    const collapseIDL = this.state.collapseID != collapseID ? collapseID : 0;
    this.setState({ collapseID: collapseIDL });
  }

  //handle online portal credentials change
  handleonlinePortalCredentials = (event) => {
    console.log("Value", event.target.value);
    console.log("Name", event.target.name);
    console.log("ID", event.target.id);
    event.preventDefault();
    const index = event.target.id;
    const name = event.target.name;
    var onlinePortalCredentials = [
      ...this.state.onlinePortalsModel.onlinePortalCredentials,
    ];
    onlinePortalCredentials[index][name] = event.target.value.toUpperCase();

    this.setState({
      onlinePortalsModel: {
        ...this.state.onlinePortalsModel,
        onlinePortalCredentials: onlinePortalCredentials,
      },
    });
  };

  handleInsurancePlanChange(event) {
    console.log("Event :", event);

    if (event) {
      this.setState({
        insurancePlanID: event,
        onlinePortalsModel: {
          ...this.state.onlinePortalsModel,
          insurancePlanID: event.id,
        },
      });
    } else {
      this.setState({
        insurancePlanID: null,
        onlinePortalsModel: {
          ...this.state.onlinePortalsModel,
          insurancePlanID: null,
        },
      });
    }
  }

  filterOption = (option, inputValue) => {
    try {
      var value = inputValue + "";
      if (value.length > 1) {
        const words = inputValue.split(" ");
        return words.reduce(
          (acc, cur) =>
            acc && option.label.toLowerCase().includes(cur.toLowerCase()),
          true
        );
      }
    } catch { }
  };

  //delete payment check roe
  deleteUser(event, index) {
    console.log(this.state.onlinePortalsModel.onlinePortalCredentials[index]);
    const portalUserId = this.state.onlinePortalsModel.onlinePortalCredentials[
      index
    ].id;
    // const length = this.state.onlinePortalsModel.onlinePortalCredentials[index]
    //   .paymentCharge.length;
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
        if (portalUserId > 0) {
          axios
            .delete(
              this.url + "DeletePortalCredential/" + portalUserId,
              this.config
            )
            .then((response) => {
              Swal.fire("Record Deleted Successfully", "", "success");
              var onlinePortalCredentials = [
                ...this.state.onlinePortalsModel.onlinePortalCredentials,
              ];
              onlinePortalCredentials.splice(index, 1);
              this.setState({
                onlinePortalsModel: {
                  ...this.state.onlinePortalsModel,
                  onlinePortalCredentials: onlinePortalCredentials,
                },
              });
            })
            .catch((error) => {
              Swal.fire(
                "Record Not Deleted!",
                "Record can not be delete, as it is being referenced in other screens.",
                "error"
              );
            });
        } else {
          Swal.fire("Record Deleted Successfully", "", "success");
          var onlinePortalCredentials = [
            ...this.state.onlinePortalsModel.onlinePortalCredentials,
          ];
          onlinePortalCredentials.splice(index, 1);
          this.setState({
            onlinePortalsModel: {
              ...this.state.onlinePortalsModel,
              onlinePortalCredentials: onlinePortalCredentials,
            },
          });
        }
      }
    });
  }

  render() {
    const Type = [
      { value: "", display: "Select Type" },
      { value: "Insurance", display: "Insurance" },
      { value: "Other", display: "Other" },
    ];
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

    let mainGrid = [];

    this.state.onlinePortalsModel.onlinePortalCredentials.map(
      (onlinePortalCredentials, index) => {
        var expDate = this.state.onlinePortalsModel.onlinePortalCredentials[
          index
        ].passwordExpiryDate
          ? this.state.onlinePortalsModel.onlinePortalCredentials[
            index
          ].passwordExpiryDate.slice(0, 10)
          : null;

        mainGrid.push(
          <div style={{ marginTop: "10px" }}>

            <div class="row">
              <div class="col-md-12 order-md-1 provider-form ">
                <div class="float-lg-right text-right">
                  <button
                    class=" btn btn-primary mr-2"
                    type="submit"
                    value="Add"
                    onClick={(event) => this.deleteUser(event, index)}
                  >
                    Delete User
                    </button>
                </div>
                <div class="header pt-1">
                  <h6 class="heading" style={{ marginBottom: "-10px" }}>
                    <MDBBtn
                      color="primary"
                      onClick={(event) => this.showHide(index + 1)}
                      style={{ marginBottom: "1rem" }}
                    >
                      {this.props.id > 0
                        ? "Username " +
                        " :  " +
                        onlinePortalCredentials.username +
                        " , " +
                        "Password " +
                        " :  " +
                        onlinePortalCredentials.password
                        : "Username " + ": " + " , " + "Password " + " :"}
                    </MDBBtn>
                  </h6>

                  <hr class="p-0 mt-0 mb-1" style={{ backgroundColor: "#037592" }}></hr>
                  <div class="clearfix"></div>
                </div><br></br>
              </div>
            </div>




            <MDBCollapse id={index + 1} isOpen={this.state.collapseID}>
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
                      placeholder="Name"
                      name="username"
                      id={index}
                      maxLength="20"
                      value={onlinePortalCredentials.username}
                      onChange={(event) =>
                        this.handleonlinePortalCredentials(event)
                      }
                    />
                  </div>
                  <div class="invalid-feedback">

                  </div>
                </div>

                <div class="col-md-4 mb-2">
                  <div class="col-md-4 float-left">
                    <label for="name">
                      Password
                    </label>
                  </div>
                  <div class="col-md-8 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Password"
                      value={onlinePortalCredentials.password}
                      name="password"
                      maxLength="15"
                      id={index}
                      onChange={this.handleonlinePortalCredentials}
                    />
                  </div>
                  <div class="invalid-feedback">

                  </div>
                </div>

                <div class="col-md-4 mb-2">
                  <div class="col-md-4 float-left">
                    <label for="name">
                      Pass Exp Date
                    </label>
                  </div>
                  <div class="col-md-8 float-left">
                  <input
                        min="1900-01-01"
                        max="9999-12-31"
                        type="date"
                        min="1900-01-01"
                        max="9999-12-31"
                        name="dob"
                        id="dob"
                        value={expDate}
                        onChange={this.handleonlinePortalCredentials}
                      />

                  </div>
                  <div class="invalid-feedback">

                  </div>
                </div>

              </div>



              <div class="row">

                <div class="col-md-4 mb-2">
                  <div class="col-md-4 float-left">
                    <label for="name">
                      Security Qus 1
                    </label>
                  </div>
                  <div class="col-md-8 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Security Qus 1"
                      name="sercurityQ1"
                      id={index}
                      value={onlinePortalCredentials.sercurityQ1}
                      onChange={this.handleonlinePortalCredentials}

                    />
                  </div>
                  <div class="invalid-feedback">

                  </div>
                </div>
                <div class="col-md-8 mb-2">
                  <div class="col-md-2 float-left">
                    <label for="name">
                      Security Ans 1
                    </label>
                  </div>
                  <div class="col-md-10 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Security Ans 1"
                      name="securityA1"
                      id={index}
                      value={onlinePortalCredentials.securityA1}
                      onChange={this.handleonlinePortalCredentials}
                    />
                  </div>
                  <div class="invalid-feedback">

                  </div>
                </div>
              </div>

              <div class="row">

                <div class="col-md-4 mb-2">
                  <div class="col-md-4 float-left">
                    <label for="name">
                      Security Qus 2
                    </label>
                  </div>
                  <div class="col-md-8 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Security Qus 2"
                      name="securityQ2"
                      id={index}
                      value={onlinePortalCredentials.securityQ2}
                      onChange={this.handleonlinePortalCredentials}
                    />
                  </div>
                  <div class="invalid-feedback">

                  </div>
                </div>
                <div class="col-md-8 mb-2">
                  <div class="col-md-2 float-left">
                    <label for="name">
                      Security Ans 2
                    </label>
                  </div>
                  <div class="col-md-10 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Security Ans 2"
                      name="securityA2"
                      id={index}
                      value={onlinePortalCredentials.securityA2}
                      onChange={this.handleonlinePortalCredentials}
                    />
                  </div>
                  <div class="invalid-feedback">

                  </div>
                </div>
              </div>


              <div class="row">

                <div class="col-md-4 mb-2">
                  <div class="col-md-4 float-left">
                    <label for="name">
                      Security Qus 3
                    </label>
                  </div>
                  <div class="col-md-8 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Security Qus 3"
                      name="securityQ3"
                      id={index}
                      value={onlinePortalCredentials.securityQ3}
                      onChange={this.handleonlinePortalCredentials}
                    />
                  </div>
                  <div class="invalid-feedback">

                  </div>
                </div>
                <div class="col-md-8 mb-2">
                  <div class="col-md-2 float-left">
                    <label for="name">
                      Security Ans 3
                    </label>
                  </div>
                  <div class="col-md-10 float-left">
                    <input
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Security Ans 3"
                      name="securityA3"
                      id={index}
                      value={onlinePortalCredentials.securityA3}
                      onChange={this.handleonlinePortalCredentials}
                    />
                  </div>
                  <div class="invalid-feedback">

                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-11 mb-2">
                  <div class="col-md-1 float-left">
                    <label>Notes</label>
                  </div>
                  <div class="col-md-11 pl-5 float-left">
                    <textarea
                      type="text"
                      class="provider-form w-100 form-control-user"
                      placeholder="Notes"
                      required=""
                      name="notes"
                      id={index}
                      value={onlinePortalCredentials.notes}
                      onChange={this.handleonlinePortalCredentials}
                    ></textarea>
                  </div>

                </div>
              </div>



            </MDBCollapse>
          </div>
        );
      }
    );

    return (
      <React.Fragment>
        <div
          class="modal fade show popupBackScreen"
          id="insurancePortalModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div
              id="modalContent"
              class="modal-content"
              style={{ minHeight: "300px", maxHeight: "700px" }}
            >
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>NEW INSURANCE PORTAL</h3>

                      <div class="float-lg-right text-right">
                        <button
                          class=" btn btn-primary mr-2"
                          type="submit"
                          onClick={this.delete}
                          disabled={this.isDisabled(this.props.rights.delete)}
                        >
                          Delete
                        </button>
                        {/* {this.state.editId > 0 ? (
                          <img
                            src={settingIcon}
                            alt=""
                            style={{ width: "17px" }}
                          />
                        ) : null} */}
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
                          <label for="name">
                            Name<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Name"
                            value={this.state.onlinePortalsModel.name}
                            name="name"
                            id="name"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.nameValField}
                        </div>
                      </div>
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Insurance Plan
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <Select
                            className={
                              this.state.validationModel.taxonomyCodeValField
                                ? this.errorField
                                : ""
                            }
                            type="text"
                            value={this.state.insurancePlanID}
                            name="insurancePlanID"
                            id="insurancePlanID"
                            max="10"
                            onChange={(event) =>
                              this.handleInsurancePlanChange(event)
                            }
                            options={this.state.insurancePlans}
                            filterOption={this.filterOption}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                            openMenuOnClick={false}
                            escapeClearsValue={true}
                            styles={{
                              indicatorSeparator: () => { },
                              clearIndicator: (defaultStyles) => ({
                                ...defaultStyles,
                                color: "#286881",
                              }),
                              container: (defaultProps) => ({
                                ...defaultProps,
                                position: "absolute",
                                width: "100%",
                              }),
                              // menu: styles => ({ ...styles,
                              //   width: '125px'
                              //  }),
                              indicatorsContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "0px",
                                marginBottom: "0",
                                marginTop: "0px",
                                height: "36px",
                                borderBottomRightRadius: "10px",
                                borderTopRightRadius: "10px",
                                // borderRadius:"0 6px 6px 0"
                              }),
                              indicatorContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                padding: "9px",
                                marginBottom: "0",
                                marginTop: "1px",
                                // borderBottomRightRadius: "5px",
                                // borderTopRightRadius: "5px",
                                borderRadius: "0 4px 4px 0",
                              }),
                              dropdownIndicator: () => ({
                                display: "none",
                              }),
                              // dropdownIndicator: defaultStyles => ({
                              //   ...defaultStyles,
                              //   backgroundColor: "#d8ecf3",
                              //   color: "#286881",
                              //   borderRadius: "3px"
                              // }),
                              input: (defaultStyles) => ({
                                ...defaultStyles,
                                margin: "0px",
                                padding: "0px",
                                // display:'none'
                              }),
                              singleValue: (defaultStyles) => ({
                                ...defaultStyles,
                                fontSize: "16px",
                                transition: "opacity 300ms",
                                // display:'none'
                              }),
                              control: (defaultStyles) => ({
                                ...defaultStyles,
                                minHeight: "33px",
                                height: "33px",
                                height: "33px",
                                paddingLeft: "10px",
                                //borderColor:"transparent",
                                borderColor: "#C6C6C6",
                                boxShadow: "none",
                                borderColor: "#C6C6C6",
                                "&:hover": {
                                  borderColor: "#C6C6C6",
                                },
                                // display:'none'
                              }),
                            }}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.organizationNameValField} */}
                        </div>
                      </div>
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            URL
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="URL"
                            value={this.state.onlinePortalsModel.url}
                            name="url"
                            id="url"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.nameValField} */}
                        </div>
                      </div>

                    </div>

                    <div class="row">
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Portal Type
                          </label>
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
                            name="type"
                            id="type"
                            value={this.state.onlinePortalsModel.type}
                            onChange={this.handleChange}
                          >
                            {Type.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">

                        </div>
                      </div>
                      <div class="col-md-4 mb-2"></div>
                      <div class="col-md-4 mb-2"></div>
                    </div>


                    {/* /Users */}
                    <div class="row">

                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="float-lg-right text-right">
                          <button
                            style={{ marginTop: "-15px" }}
                            class=" btn btn-primary mr-2"
                            type="submit"
                            value="Add"
                            onClick={this.addPortalRow}
                          >
                            Add
                            </button>
                        </div>
                        <div class="header pt-1">
                          <h6 class="heading">Users</h6>


                          <hr class="p-0 mt-0 mb-1" style={{ backgroundColor: "#037592" }}></hr>
                          <div class="clearfix"></div>
                        </div><br></br>

                        {/* Comtent */}
                        <div className="container-fluid">
                          <div className="card mb-4">
                            {mainGrid}
                          </div>
                        </div>


                      </div>
                    </div>


                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={this.savePortalData}
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
        import: state.loginInfo.rights.remarkCodesImport,
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
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(NewInsurancePortal);
