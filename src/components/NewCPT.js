import React, { Component, Fragment } from "react";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

import taxonomyIcon from "../images/code-search-icon.png";
import axios from "axios";
import Input from "./Input";
import Swal from "sweetalert2";
import settingIcon from "../images/setting-icon.png";
import Dropdown from "react-dropdown";
import NewHistoryPractice from "./NewHistoryPractice";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { CPTAction } from "../actions/CPTAction";
import { setCPTAction } from "../actions/SetCPTAction";

import Hotkeys from "react-hot-keys";

class NewCPT extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/cpt/";
    this.commonUrl = process.env.REACT_APP_URL + "/Common/";
    this.errorField = "errorField";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.saveCPTCount = 0;

    this.cptModel = {
      description: "",
      cptCode: "",
      amount: null,
      modifier1ID: null,
      modifier2ID: null,
      modifier3ID: null,
      modifier4ID: null,
      typeOfServiceID: null,
      cliaNumber: "",
      ndcNumber: "",
      ndcDescription: "",
      ndcUnits: "",
      ndcUnitOfMeasurement: "",
      isValid: true,
      anesthesiaBaseUnits: "",
      category: "",
      defaultUnits: 1,
      shortDescription:"",
      medicareAmount:""
    };

    this.validationModel = {
      descriptionValField: "",
      cptCodeValField: "",
      amountValField: null,
      modifier1IDValField: null,
      modifier2IDValField: null,
      modifier3IDValField: null,
      modifier4IDValField: null,
      typeOfServiceIDValField: null,
      cliaNumberValField: "",
      ndcNumberValField: "",
      ndcDescriptionValField: "",
      ndcUnitsValField: "",
      ndcUnitOfMeasurementValField: "",
      isValidValField: true,
      validation: false,
    };

    this.state = {
      editId: this.props.id,
      cptModel: this.cptModel,
      validationModel: this.validationModel,
      maxHeight: "361px",
      tosData: [],
      modifiersData: [],
      loading: false,
      category: "",
      showPopup: false,
    };

    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.saveNewCPT = this.saveNewCPT.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.delete = this.delete.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    console.log("test:onKeyDown", keyName, e, handle);

    if (keyName == "alt+s") {
      // alert("save key")
      this.saveNewCPT();
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

  componentWillMount() {
    axios
      .get(this.url + "GetProfiles", this.config)
      .then((response) => {
        console.log("Profiles Data : ", response.data);
        this.setState({
          tosData: response.data.typeOfServiceCodes,
          modifiersData: response.data.modifiers,
        });
      })
      .catch((error) => {
        console.log(error);
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
    var height = document.getElementById("cptModal").clientHeight;
    var intFrameHeight = window.innerHeight;
    this.setState({ loading: true, widowHeight: `${intFrameHeight - 50}px` });



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
        .get(this.url + "findcpt/" + this.state.editId, this.config)
        .then((response) => {
          console.log("Mount Data : ", response.data);
          this.setState({ cptModel: response.data });
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
          try {
            let errorsList = [];
            errorsList = error.response.data;
            console.log(errorsList);
          } catch (error) {
            console.log(error);
          }
        });
    }
    this.setState({ loading: false });
  }

  handleChange = (event) => {
    var myValue;
    var myName = event.target.name ? event.target.name : "";
    event.preventDefault();
    if (event.target.name == "category") {
      this.setState({
        cptModel: {
          ...this.state.cptModel,
          [event.target.name]:
            event.target.value == "Please Select" ? null : event.target.value,
        },
      });
    } else if (myName == "cliaNumber") {
      myValue = event.target.value ? event.target.value : "";
      event.target.value = myValue.trim();
      this.setState({
        cptModel: {
          ...this.state.cptModel,
          [event.target.name]: event.target.value.toUpperCase(),
        },
      });
    } else {
      this.setState({
        cptModel: {
          ...this.state.cptModel,
          [event.target.name]: event.target.value.toUpperCase(),
        },
      });
    }
  };

  handleAmountChange = (e) => {
    e.preventDefault();
    console.log("Event.Target : ", e.target.value);
    const amount = e.target.value;
    var regexp = /^\d+(\.(\d{1,2})?)?$/;
    if (regexp.test(amount)) {
      this.setState({
        cptModel: {
          ...this.state.cptModel,
          [e.target.name]: amount,
        },
      });
    } else if (amount == "") {
      this.setState({
        cptModel: {
          ...this.state.cptModel,
          [e.target.name]: "",
        },
      });
    } else if (!(e.charCode >= 48 || e.charCode <= 57)) {
      this.setState({
        cptModel: {
          ...this.state.cptModel,
          [e.target.name]: "",
        },
      });
    }
  };

  handleCheck() {
    this.setState({
      cptModel: {
        ...this.state.cptModel,
        isValid: !this.state.cptModel.isValid,
      },
    });
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

  saveNewCPT = (e) => {
    console.log("Before Update", this.saveCPTCount);
    if (this.saveCPTCount == 1) {
      return;
    }
    this.saveCPTCount = 1;
    console.log("Data : ", this.state.cptModel);
    // e.preventDefault();
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.cptModel.cptCode)) {
      console.log("cptCode");
      myVal.cptCodeValField = <span className="validationMsg">Enter CPT</span>;
      myVal.validation = true;
    } else if (this.state.cptModel.cptCode.length != 5) {
      myVal.cptCodeValField = (
        <span className="validationMsg">CPT length should be 5</span>
      );
      myVal.validation = true;
    } else {
      myVal.cptCodeValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.cptModel.description)) {
      myVal.descriptionValField = (
        <span className="validationMsg">Enter Description</span>
      );
      myVal.validation = true;
    } else {
      myVal.descriptionValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.cptModel.amount)) {
      myVal.amountValField = (
        <span className="validationMsg">Enter Amount</span>
      );
      myVal.validation = true;
    } else {
      myVal.amountValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    // if (this.isNull(this.state.cptModel.modifier1ID) == false) {
    //   if (this.isNull(this.state.cptModel.modifier2ID) == false && this.state.cptModel.modifier1ID === this.state.cptModel.modifier2ID) {
    //     myVal.modifier2IDValField = <span className="validationMsg">Modifiers should be unique</span>
    //     myVal.validation = true
    //   } else {
    //     myVal.modifier2IDValField = ''
    //     if (myVal.validation === false) myVal.validation = false
    //   }
    // }

    this.setState({
      validationModel: myVal,
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      this.saveCPTCount = 0;
      return;
    }

    axios
      .post(this.url + "SaveCpt", this.state.cptModel, this.config)
      .then((response) => {
        this.saveCPTCount = 0;
        //Get CPT API
        axios
          .get(this.commonUrl + "getCPT", this.config)
          .then((cptRes) => {
            console.log("CPT Response : ", cptRes.data);
            // this.props.CPTAction(cptRes.data);
            this.props.setCPTAction(this.props, cptRes.data, "SETCPT");
          })
          .catch((cptError) => {
            this.saveCPTCount = 0;
            console.log("CPT Error : ", cptError);
          });
        this.setState({
          cptModel: response.data,
          editId: response.data.id,
          loading: false,
        });

        Swal.fire("Record Saved Successfully", "", "success");
      })
      .catch((error) => {
        this.saveCPTCount = 0;
        this.setState({ loading: false });

        Swal.fire(
          "Something Wrong",
          "Please Enter All Fields Correctly",
          "error"
        );
        let errorsList = [];
        if (error.response !== null && error.response !== null) {
          errorsList = error.response;
          console.log(errorsList);
        } else console.log(error);
        return;
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
          .delete(this.url + "DeleteCPT/" + this.state.editId, this.config)
          .then((response) => {
            this.setState({ loading: false });

            console.log("Delete Response :", response);
            Swal.fire("Record Deleted Successfully", "", "success");
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

  render() {
    const category = [
      { value: "", display: "Select Type" },
      { value: "Digestive", display: "Digestive" },
      { value: "Medicine-CVS", display: "Medicine-CVS" },
      {
        value: "Pathology-Lab",
        display: "Pathology-Lab",
      },
      {
        value: "Radiology",
        display: "Radiology",
      },
      {
        value: "Nervous-ENT",
        display: "Nervous-ENT",
      },
      {
        value: "Anesthesia",
        display: "Anesthesia",
      },
      { value: "CVS", display: "CVS" },
      { value: "Lymphatic", display: "Lymphatic" },
      { value: "musculoskeletal", display: "musculoskeletal" },
      { value: "Urinary", display: "Urinary" },
      { value: "E&M", display: "E&M" },
      { value: "Integumentary", display: "Integumentary" },
    ];
    const isValid = this.state.cptModel.isValid;
    const unitOfMeasurement = [
      { value: "", display: "Select State" },
      { value: "UN", display: "Units" },
      { value: "MJ", display: "Minutes" },
    ];
    const ndcUnitOfMeasurement = [
      { value: "", display: "Select State" },
      { value: "F2", display: "International Unit " },
      { value: "GR", display: "Gram" },
      { value: "ML", display: "Milliliter" },
      { value: "UN", display: "Unit" },
    ];

    const titles = [
      { value: "", display: "Select Title" },
      { value: "mr", display: "Mr" },
      { value: "mrs", display: "Mrs" },
    ];

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
          id="cptModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            // style={{ margin: "8.8rem auto" }}
            class="modal-dialog"
            role="document"
          >
            <div
              id="modalContent"
              class="modal-content"
              style={{ minHeight: "500px", maxHeight: this.state.widowHeight }}
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
                          ? this.state.cptModel.cptCode
                          : "NEW CPT"}
                      </h3>

                      <div class="float-lg-right text-right">

                        <input class="checkbox" type="checkbox" checked={!isValid} onClick={this.handleCheck} />
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
                          <label for="name">
                            CPT Code<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="CPT Code"
                            value={this.state.cptModel.cptCode}
                            name="cptCode"
                            id="cptCode"
                            maxLength="5"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {  this.state.validationModel.cptCodeValField}
                        </div>
                      </div>
                      <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                POS
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
                                name="posid"
                                id="posid"
                                value={this.state.cptModel.posid}
                                onChange={this.handleChange}
                              >
                               {this.props.posCodes.map((s) => (
                              <option key={s.id} value={s.id}>
                               {" "}
                               {s.description}{" "}
                              </option>
                        ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cptCodeValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2"></div>
                          <div class="col-md-11 mb-2" style={{paddingTop:"1px"}}>
                        <div class="col-md-1 float-left">
                          <label>Short Description</label>
                        </div>
                        <div class="col-md-11 pl-5 float-left">
                          <textarea
                            type="text"
                            class="provider-form w-100 form-control-user"
                            // placeholder="Description"
                            value={this.state.cptModel.shortDescription}
                            name="shortDescription"
                            id="shortDescription"
                            onChange={this.handleChange}
                            style={{height:"40px"}}
                          ></textarea>
                        </div>

                      </div>
                          <div class="col-md-11 mb-2">
                        <div class="col-md-1 float-left">
                          <label>Description</label>
                        </div>
                        <div class="col-md-11 pl-5 float-left">
                          <textarea
                            type="text"
                            class="provider-form w-100 form-control-user"
                            // placeholder="Description"
                            value={this.state.cptModel.description}
                            name="description"
                            id="description"
                            onChange={this.handleChange}
                          ></textarea>
                        </div>

                      </div>
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Amount<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Amount"
                            value={this.state.cptModel.amount}
                            name="amount"
                            id="amount"
                            max="15"
                            onChange={this.handleAmountChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.amountValField}
                        </div>
                      </div>
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                           Medicare Amount
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Medicare Amount"
                            value={this.state.cptModel.medicareAmount}
                            name="medicareAmount"
                            id="medicareAmount"
                            max="15"
                            onChange={this.handleAmountChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.amountValField} */}
                        </div>
                      </div>
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Type of Sevice
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
                            name="typeOfServiceID"
                            id="typeOfServiceID"
                            value={this.state.cptModel.typeOfServiceID}
                            onChange={this.handleChange}
                          >
                            {this.state.tosData.map(s => (
                              <option key={s.ID} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.cptCodeValField} */}
                        </div>
                      </div>
                    </div>


                    <div class="row">
              

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Category
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
                            name="category"
                            id="category"
                            value={this.state.cptModel.category}
                            onChange={this.handleChange}
                          >
                            {category.map(s => (
                              <option key={s.id} value={s.display}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.cptCodeValField} */}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                      </div>
                    </div>

                    {/* Anesthesia Settings */}
                    <div class="row">

                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Anesthesia Settings</h6>
                          <hr class="p-0 mt-0 mb-1" style={{ backgroundColor: "#037592" }}></hr>
                          <div class="clearfix"></div>
                        </div><br></br>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Base Units
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Base Units"
                                value={this.state.cptModel.anesthesiaBaseUnits}
                                name="anesthesiaBaseUnits"
                                id="anesthesiaBaseUnits"
                                maxLength="3"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cptCodeValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                          </div>
                          <div class="col-md-4 mb-2">
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Default Settings */}

                    <div class="row">

                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Default Settings</h6>
                          <hr class="p-0 mt-0 mb-1" style={{ backgroundColor: "#037592" }}></hr>
                          <div class="clearfix"></div>
                        </div><br></br>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Default Units
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Default Units"
                                value={this.state.cptModel.defaultUnits == null ? "" : this.state.cptModel.defaultUnits}
                                name="defaultUnits"
                                id="defaultUnits"
                                maxLength="4"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cptCodeValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                UOM
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
                                name="unitOfMeasurement"
                                id="unitOfMeasurement"
                                value={this.state.cptModel.unitOfMeasurement}
                                onChange={this.handleChange}
                              >
                                {unitOfMeasurement.map(s => (
                                  <option key={s.value} value={s.value}>
                                    {s.display}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cptCodeValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Modifier 1
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
                                name="modifier1ID"
                                id="modifier1ID"
                                value={this.state.cptModel.modifier1ID}
                                onChange={this.handleChange}
                              >
                                {this.state.modifiersData.map(s => (
                                  <option key={s.ID} value={s.id}>
                                    {s.description}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.modifier1IDValField}
                            </div>
                          </div>
                        </div>

                        <div class="row">

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Modifier 2
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
                                name="modifier2ID"
                                id="modifier2ID"
                                value={this.state.cptModel.modifier2ID}
                                onChange={this.handleChange}
                              >
                                {this.state.modifiersData.map(s => (
                                  <option key={s.ID} value={s.id}>
                                    {s.description}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.modifier2IDValField}
                            </div>
                          </div>


                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Modifier 3
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
                                name="modifier3ID"
                                id="modifier3ID"
                                value={this.state.cptModel.modifier3ID}
                                onChange={this.handleChange}
                              >
                                {this.state.modifiersData.map(s => (
                                  <option key={s.ID} value={s.id}>
                                    {s.description}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.modifier1IDValField}
                            </div>
                          </div>


                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Modifier 4
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
                                name="modifier4ID"
                                id="modifier4ID"
                                value={this.state.cptModel.modifier4ID}
                                onChange={this.handleChange}
                              >
                                {this.state.modifiersData.map(s => (
                                  <option key={s.ID} value={s.id}>
                                    {s.description}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.modifier4IDValField}
                            </div>
                          </div>

                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                CLIA Number
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="CLIA Number"
                                value={this.state.cptModel.cliaNumber}
                                name="cliaNumber"
                                id="cliaNumber"
                                max="10"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cptCodeValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2"></div>
                          <div class="col-md-4 mb-2"></div>

                        </div>
                      </div>
                    </div>

                    {/* NDC Information */}
                    <div class="row">

                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">NDC Information</h6>
                          <hr class="p-0 mt-0 mb-1" style={{ backgroundColor: "#037592" }}></hr>
                          <div class="clearfix"></div>
                        </div><br></br>
                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                NDC Number
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="NDC Number"
                                name="ndcNumber"
                                id="ndcNumber"
                                maxLength="11"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cptCodeValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                NDC Description
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="NDC Description"
                                value={this.state.cptModel.ndcDescription}
                                name="ndcDescription"
                                id="ndcDescription"
                                maxLength="100"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cptCodeValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                NDC Units
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="NDC Units"
                                maxLength="4"
                                value={this.state.cptModel.ndcUnits}
                                name="ndcUnits"
                                id="ndcUnits"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cptCodeValField} */}
                            </div>
                          </div>
               

                        </div>
                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                NDC Unit of Measurement
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
                                name="ndcUnitOfMeasurement"
                                id="ndcUnitOfMeasurement"
                                value={this.state.cptModel.ndcUnitOfMeasurement}
                                onChange={this.handleChange}
                              >
                                {ndcUnitOfMeasurement.map(s => (
                                  <option key={s.value} value={s.value}>
                                    {s.display}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div class="col-md-4 mb-2"></div>
                          <div class="col-md-4 mb-2"></div>
                        </div>
                      </div>
                    </div>





                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={this.saveNewCPT}
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
    userInfo1: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    posCodes: state.loginInfo
      ? state.loginInfo.pos
        ? state.loginInfo.pos
        : []
      : [],
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.cptSearch,
          add: state.loginInfo.rights.cptCreate,
          update: state.loginInfo.rights.cptEdit,
          delete: state.loginInfo.rights.cptDelete,
          export: state.loginInfo.rights.cptExport,
          import: state.loginInfo.rights.cptImport,
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
      CPTAction: CPTAction,
      setCPTAction: setCPTAction,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(NewCPT);
