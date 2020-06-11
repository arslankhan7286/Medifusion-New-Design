import React, { Component } from "react";
import { Table } from "reactstrap";
import "../../css/style.css";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loginAction } from "../../actions/LoginAction";
import $ from "jquery";
import axios from "axios";
import Swal from "sweetalert2";
import CptModal from "../CptModal";
import close from "../../images/close-icon.png";
import TableStyles from "./Table.module.css";
import Eclips from "../../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

import styles from "../../NewPages/Tables/Table.module.css";
import ClinicalForm from "./ClinicalForm";

class NewClinical extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/ClinicalForms/";
    this.url2 = process.env.REACT_APP_URL + "/Cpt/";

    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.ClinicalModel = {
      AddedBy: "",
      AddedDate: "",
      UpdatedBy: "",
      UpdatedDate: "",
      cpTs: [
        {
          id: 0,
          clinicalFormID: 0,
          providerID: 0,
          description: "",
          amount: 0,
          CPTID: 0,
          cptCode: 0,
          Modifier: 0,
          Price: 100,
          practiceID: 1,
          inactive: false,
          AddedDate: "",
          ModifiedBy: "",
          ModifiedDate: "",
        },
      ],
      description: "",
      formContent: "",
      id: 0,
      url: "",
      inactive: false,
      name: "",
      practiceID: 0,
      providerID: "",
      type: "",
    };

    this.state = {
      removeFile: false,
      showForm: false,
      loading: false,
      ClinicalModel: this.ClinicalModel,
      searchCpt: "",
      deletedCPTs: [],
      list: [],
      searchedList: [],
      FormCPTList: [], // bound to table CPT...
      currentFocus: 0,
      array: [],
      isOpen: false,
      returnData: [],
      read: true,
      disabled: true,
      Mode: "",
      formData: "",
      providers: [],
    };
    this.isNull = this.isNull.bind(this);
    this.addEventListener = this.addEventListener.bind(this);
    this.saveSubmitter = this.saveSubmitter.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });
    //Get User Info from Redux
    try {
      if (this.props.userInfo.userPractices.length > 0) {
        if (this.state.provider.length == 0) {
          this.setState({
            providers: this.props.userInfo.userProviders,
          });
        }
      }
    } catch {}

    axios
      .get(this.url + "AllClinicalForms", this.config)
      .then((response) => {
        console.log("AllClinicalForms", response.data);
        this.setState({
          list: response.data,
          disabled: true,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });

    /*function CLOSES THE LIST when someone clicks in the document:*/
    document.addEventListener("click", function (elmnt, e) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != e) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    });
  }

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      ClinicalModel: {
        ...this.state.ClinicalModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };

  deleteCPTRow = (trow) => {
    Swal.fire({
      title: "Are you sure, you want to delete this CPT?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        let delCpts = this.state.deletedCPTs;
        trow.inactive = true;
        delCpts.push(trow);

        // delete from CPT Table..
        let arrCPT = []; // this.state.FormCPTList;
        this.state.FormCPTList.map((row) => {
          if (row.id == trow.id) {
            console.log("selected CPT :", row);
          } else arrCPT.push(row);
        });
        this.setState({
          deletedCPTs: delCpts,
          FormCPTList: arrCPT,
        });
        // this.saveSubmitter();
      }
    });
  };

  clearFields() {
    this.setState({
      ClinicalModel: {
        AddedBy: "",
        AddedDate: "",
        UpdatedBy: "",
        UpdatedDate: "",
        cpTs: [
          {
            id: 0,
            clinicalFormID: 0,
            providerID: 0,
            description: "",
            amount: 0,
            CPTID: 0,
            cptCode: 0,
            Modifier: 0,
            Price: 100,
            practiceID: 1,
            inactive: false,
            AddedDate: "",
            ModifiedBy: "",
            ModifiedDate: "",
          },
        ],
        description: "",
        formContent: "",
        id: 0,
        url: "",
        inactive: false,
        name: "",
        practiceID: 0,
        providerID: "",
        type: "",
      },
      FormCPTList: [],
    });
    console.log("ClinicalModel", this.state.ClinicalModel);
  }

  isNull(value) {
    if (
      value === null ||
      value === "" ||
      value === undefined ||
      value === -1 ||
      value === "Please Select"
    ) {
      return true;
    } else {
      return false;
    }
  }

  async saveSubmitter() {
    this.setState({ loading: true });
    let dataModel = {};
    if (this.state.Mode == "delete") {
      dataModel = this.state.currentRow;
      dataModel.inactive = true;
    } else {
      dataModel = this.state.ClinicalModel;
    }

    // const { ClinicalModel, list } = this.state;
    var saveModel = {};
    let errorCount = 0;
    if (
      this.isNull(this.state.ClinicalModel.name) ||
      this.isNull(this.state.ClinicalModel.type)
    ) {
      Swal.fire("Please Enter Name And Type", "", "error");
      this.setState({ loading: false });
      errorCount++;
    }

    if (errorCount === 0) {
      // let updateList = [];
      // updateList = this.state.list;

      var cpts = [];
      var providerId = "";
      // getting data from table... and pushing into save
      console.log("ClinicalModel", this.state.ClinicalModel);
      saveModel = this.state.ClinicalModel;
      this.state.FormCPTList.map((row) => {
        cpts.push(row);
      });
      if (this.state.deletedCPTs.length > 0) {
        this.state.deletedCPTs.map((row) => {
          cpts.push(row);
        });
      }
      saveModel.cpTs = cpts;

      if (this.state.removeFile) {
        saveModel.url = "";
      }

      console.log("SaveClinicalForms", saveModel);
      axios
        .post(this.url + "SaveClinicalForms", saveModel, this.config)
        .then((response) => {
          console.log("SaveClinicalForms Response", response.data);
          if (response.data.id > 0 && this.state.Mode == "delete")
            Swal.fire("Form Deleted Successfully", "", "success");
          else if (this.state.Mode == "edit")
            Swal.fire("Form Updated Successfully", "", "success");
          else Swal.fire("Form Saved Successfully", "", "success");
          $("#btnCancel").click();
          this.componentDidMount();
          this.setState({
            ClinicalModel: saveModel,
            loading: false,
          });
          this.CancelClickHandler();
        })
        .catch((error) => {
          this.setState({ loading: false });
          if (
            error ==
            "Can not add same form name for this provider. Please change name."
          ) {
            Swal.fire("FORM NOT SAVED", error, "error");
          } else Swal.fire("Something Went Wrong", "", "error");
          this.CancelClickHandler();
          console.log("Error Here.....", error);
        });
    }
  }

  async addEventListener(e) {
    this.setState({
      searchCpt: e.target.value.toUpperCase(),
    });

    var arr = [];
    var a,
      b,
      i,
      val = e.target.value;
    // creating AutoComplete
    await axios
      .get(
        this.url2 + "FindCPTbyCode?CPTcode=" + e.target.value.toUpperCase(),
        this.config
      )
      .then((response) => {
        response.data.map((row) => {
          arr.push({
            name: row.cptCode + " : " + row.description,
            id: 0,
            cptid: row.cptid,
            description: row.description,
            price: row.amount,
            cptCode: row.cptCode,
            modifier: row.modifier,
            units: row.units,
            NDCUnits: row.ndcUnits,
            ClinicalFormID: 0,
            AddedBy: "",
            AddedDate: "",
            ModifiedBy: "",
            inactive: false,
            ModifiedDate: "01/01/1900",
          });
          this.setState({ array: arr });
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });

    /*close any already open lists of autocompleted values*/
    this.closeAllLists(e);
    if (!val) {
      return false;
    }
    await this.setState({ currentFocus: -1 });
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", /*e.target.id +*/ "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/

    document.getElementById("parent").appendChild(a);
    /*for each item in the array...*/

    arr.map((row) => {
      /*check if the item starts with the same letters as the text field value:*/

      var start = row.name.toUpperCase().indexOf(val.toUpperCase());
      if (start > -1) {
        //if (row.name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        b.onclick = (event) => this.optionSelected(event);

        /*make the matching letters bold:*/
        b.innerHTML = row.name.substr(0, start);
        b.innerHTML +=
          "<strong>" + row.name.substr(start, val.length) + "</strong>";
        b.innerHTML += row.name.substr(start + val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + row.value + "'  >";
        /*execute a function when someone clicks on the item value (DIV element):*/
        // b.setAttribute("title", row.value);
        b.setAttribute("id", row.cptid);
        a.appendChild(b);
      }
    });
  }

  optionSelected(e) {
    var arr = this.state.FormCPTList;
    var id = e.target.id;

    this.state.array.map((row) => {
      if (row.cptid == id) {
        console.log("selected data : ::", row);
        arr.push(row);
      }
    });
    this.setState({
      FormCPTList: arr,
    });
    this.closeAllLists(e);
  }

  /*execute a function presses a key on the keyboard:*/
  async KeyDown(e) {
    var x = document.getElementById(e.target.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/

      await this.setState({ currentFocus: this.state.currentFocus + 1 });

      /*and and make the current item more visible:*/
      this.addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
      await this.setState({ currentFocus: this.state.currentFocus - 1 });
      /*and and make the current item more visible:*/
      this.addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (this.state.currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[this.state.currentFocus].click();
      }
    }
  }

  addActive(x) {
    var crrFocus = this.state.currentFocus;
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    this.removeActive(x);

    if (crrFocus >= x.length) {
      crrFocus = 0;
    }

    if (crrFocus < 0) {
      crrFocus = x.length - 1;
    }

    this.setState({ currentFocus: crrFocus });
    /*add class "autocomplete-active":*/
    x[crrFocus].classList.add("autocomplete-active");
  }

  removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  closeAllLists(elmnt, e) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != e) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  tableClickHandler(row) {
    this.setState({
      ClinicalModel: row,
      currentRow: row,
      FormCPTList: row.cpTs,
      read: true,
      disabled: true,
      removeFile: false,
    });
  }

  handleOpenModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  cptPickListReturn = (list) => {
    var arr = this.state.FormCPTList;
    list.map((row) => {
      arr.push({
        ...row,
        id: 0,
        clinicalFormID: 0,
      });
    });
    this.setState({ FormCPTList: arr });
  };

  AddClickHandler = () => {
    // const doesShow = this.state.showForm
    this.setState({
      read: false,
      disabled: false,
      Mode: "add",
      removeFile: false,
    });
    this.clearFields();
  };

  CancelClickHandler = () => {
    // const doesShow = this.state.showForm
    this.setState({ read: true, disabled: true, removeFile: false, Mode: "" });
    this.clearFields();
  };

  EditClickHandler = () => {
    if (this.state.ClinicalModel.name) {
      this.setState({
        read: false,
        disabled: false,
        Mode: "edit",
      });
    } else Swal.fire("SELECT A FORM FIRTS", "", "error");
  };

  deleteTableRow = (trow) => {
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
        this.setState({
          currentRow: trow,
          Mode: "delete",
        });
        this.saveSubmitter();
      }
    });
  };

  ProcessFileLoad = (e) => {
    // e.preventDefault();
    console.log("ProcessFileLoad");
    try {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      let file = e.target.files[0];

      let content = "";
      let name = "";

      console.log("File : ", file);

      reader.onloadend = (e) => {
        try {
          content = reader.result;
          name = file.name;
        } catch {}

        console.log("Content", content);
        console.log("Name", name);

        var Filetype = name.substr(name.indexOf("."));
        console.log("file type", Filetype);
        if (Filetype == ".html") {
          name = name.substr(0, name.indexOf("."));
          this.setState({
            ClinicalModel: {
              ...this.state.ClinicalModel,
              name: name.toUpperCase(),
              formContent: content,
            },
          });
        } else {
          Swal.fire("Error", "Invalid File", "error");
        }
      };
    } catch {}
  };

  closeForm = () => {
    this.setState({
      showForm: false,
    });
  };

  toggleRemoveForm = () => {
    this.setState({ removeFile: !this.state.removeFile });
  };

  render() {
    console.log("Name", this.state.ClinicalModel.name);
    console.log("MODE", this.state.mode);
    const typeOptions = [
      { value: "", display: "Please Select" },
      { value: "Fever", display: "Fever" },
      { value: "Cough", display: "Cough" },
      { value: "Flu", display: "Flu" },
      { value: "Infection", display: "Infection" },
    ];

    //Spinner
    let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="spiner">
          <GifLoader
            loading={true}
            imageSrc={Eclips}
            // imageStyle={imageStyle}
            overlayBackground="rgba(0,0,0,0.5)"
          />
        </div>
      );
    }

    return (
      <div>
        {spiner}
        <div className="row">
          <div className="col-md-12 col-sm-12 col-lg-12">
            <div className="mainHeading row">
              <div className="col-md-12 text-left">
                <h1>CLINICAL FORMS</h1>
              </div>
            </div>
          </div>
          {this.state.showForm ? (
            <ClinicalForm
              goBack={this.closeForm}
              formData={this.state.formData}
            />
          ) : (
            <div className="row">
              <div className="col-md-12 col-sm-12 col-lg-6">
                <div>
                  <table className={styles.table}>
                    <thead>
                      <tr className={styles.tableHeader}>
                        <th
                          style={{ padding: "10px", paddingLeft: "20px" }}
                          className={styles.tableHeadTname}
                          colSpan="6"
                        >
                          Forms
                        </th>
                      </tr>
                    </thead>
                  </table>
                  <div
                    id="ClinicalFormsOverFlow"
                    style={{ height: "400px", overflowY: "scroll" }}
                  >
                    <table className={styles.table}>
                      <thead>
                        <tr className={styles.tableHeadings}>
                          <td className="font-weight-bold">ID</td>
                          <td className="font-weight-bold">Name</td>
                          <td className="font-weight-bold">Type</td>
                          <td className="font-weight-bold">Provider</td>
                          <td className="font-weight-bold">Delete</td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.list.map((row, index) => (
                          <tr
                            className={styles.tableRow}
                            onClick={() => this.tableClickHandler(row)}
                          >
                            <td className={styles.tableData}>{row.id}</td>
                            {row.url == "" ? (
                              <td className={styles.tableData}>{row.name}</td>
                            ) : (
                              <a
                                /*style={{color: "blue"}}*/ href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({
                                    showForm: true,
                                    formData: row,
                                  });
                                }}
                              >
                                <td className={styles.tableData}>{row.name}</td>
                              </a>
                            )}

                            <td className={styles.tableData}>{row.type}</td>
                            <td className={styles.tableData}>
                              {row.providerName}
                            </td>
                            <td className={styles.tableData}>
                              <img
                                style={{ cursor: "pointer" }}
                                src={close}
                                onClick={() => this.deleteTableRow(row)}
                                alt="Logo"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-md-12 col-sm-12 col-lg-6">
                <div className="row">
                  <div className="col-sm-12 col-lg-12 col-md-12 text-center">
                    <button
                      className={
                        this.state.disabled ? "disabledSave" : "btn-blue mt-0"
                      }
                      onClick={this.saveSubmitter}
                      disabled={this.state.disabled}
                    >
                      Save
                    </button>
                    <button
                      className={
                        this.state.disabled ? "disabledCancel" : "btn-grey mt-0"
                      }
                      onClick={this.CancelClickHandler}
                      disabled={this.state.disabled}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-blue ml-2 mt-0"
                      onClick={this.AddClickHandler}
                    >
                      Add
                    </button>
                    <button
                      className="btn-blue mt-0"
                      onClick={this.EditClickHandler}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-12 col-sm-12 col-lg-12 mt-2">
                    <div style={{ width: "100%" }}>
                      <label
                        className="label mustRequired"
                        style={{ width: "19%" }}
                      >
                        Name :
                      </label>
                      <input
                        style={{
                          width: "28%",
                          height: "35px",
                          borderColor: "#C6C6C6",
                          border: "1px solid gray",
                          padding: "3px",
                        }}
                        type="text"
                        name="name"
                        id="name"
                        className={this.state.read ? "readonly" : ""}
                        autoComplete="off"
                        value={this.state.ClinicalModel.name}
                        onChange={this.handleChange}
                        readOnly={this.state.read}
                      />
                      <div
                        style={{ display: "inline", marginLeft: "10px" }}
                        className="textBoxValidate"
                      >
                        <label
                          for="file-upload"
                          id={
                            this.state.read
                              ? "disabledBrowse"
                              : "file-upload-style"
                          }
                          // className={
                          //   this.state.validationModel.fileUploadVal
                          //     ? this.errorField
                          //     : ""
                          // }
                          // class="custom-file-upload btn-blue"
                        >
                          Browse
                          <input
                            id="file-upload"
                            type="file"
                            onChange={(e) => this.ProcessFileLoad(e)}
                            disabled={this.state.read}
                          />
                        </label>
                        <div class="lblChkBox ml-3">
                          <input
                            id="removeFile"
                            onChange={this.toggleRemoveForm}
                            type="checkbox"
                            checked={this.state.removeFile}
                            disabled={this.state.Mode == "edit" ? false : true}
                          />
                          <label for="removeFile">{" Remove File"}</label>
                        </div>
                        {/* {this.state.validationModel.fileUploadVal} */}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-sm-12 col-lg-6 mt-2">
                    <div style={{ width: "100%" }}>
                      <label
                        className="label mustRequired"
                        style={{ width: "40%" }}
                      >
                        Type :
                      </label>
                      <select
                        onChange={this.handleChange}
                        style={{
                          width: "60%",
                          height: "35px",
                          borderColor: "#C6C6C6",
                          border: "1px solid gray",
                        }}
                        type="text"
                        id="type"
                        name="type"
                        className={this.state.read ? "readonly" : ""}
                        value={this.state.ClinicalModel.type}
                        disabled={this.state.read}
                      >
                        {this.state.ClinicalModel.type == "" ? null : (
                          <option
                            key={this.state.ClinicalModel.type}
                            id={this.state.ClinicalModel.type}
                          >
                            {this.state.ClinicalModel.type}
                          </option>
                        )}

                        {typeOptions.map((row) =>
                          row.display === this.state.ClinicalModel.type ? (
                            ""
                          ) : row.type === "Please Select" ? (
                            ""
                          ) : (
                            <option key={row.value} id={row.value}>
                              {row.display}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                  {/* <div className="col-md-12 col-sm-12 col-lg-6"></div> */}
                  <div className="col-md-12 col-sm-12 col-lg-6 mt-2">
                    <div style={{ width: "100%" }}>
                      <label className="label" style={{ width: "40%" }}>
                        Provider :
                      </label>
                      <select
                        className={this.state.read ? "readonly" : ""}
                        name="providerID"
                        id="providerID"
                        value={this.state.ClinicalModel.providerID}
                        onChange={this.handleChange}
                        style={{
                          width: "60%",
                          height: "35px",
                          borderColor: "#C6C6C6",
                          border: "1px solid gray",
                        }}
                        disabled={this.state.read}
                      >
                        {this.props.userInfo1.userProviders.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.description}
                          </option>
                        ))}
                      </select>
                      {/* <input
                        style={{
                          width: "60%",
                          height: "35px",
                          borderColor: "#C6C6C6",
                          padding: "10px",
                          border: "1px solid gray",
                        }}
                        type="number"
                        id="providerID"
                        name="providerID"
                        className={this.state.read ? "readonly" : ""}
                        value={this.state.ClinicalModel.providerID}
                        onChange={this.handleChange}
                        readOnly={this.state.read}
                      /> */}
                    </div>
                  </div>
                  <div className="col-md-12 col-sm-12 col-lg-6 mb-4 mt-2">
                    <div style={{ width: "100%" }}>
                      <label
                        className="label"
                        style={{
                          width: "40%",
                          height: "50px",
                          verticalAlign: "middle",
                        }}
                        htmlFor="textarea"
                      >
                        Description:
                      </label>
                      <textarea
                        style={{
                          width: "60%",
                          minHeight: "50px",
                          borderColor: "#C6C6C6",
                          border: "1px solid gray",
                        }}
                        id="description"
                        type="text"
                        className={this.state.read ? "readonly" : ""}
                        name="description"
                        rows="2"
                        autoComplete="off"
                        value={this.state.ClinicalModel.description}
                        onChange={this.handleChange}
                        readOnly={this.state.read}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <table className={styles.table}>
                    <thead>
                      <tr className={styles.tableHeader}>
                        <th className={styles.tableHeadTname} colSpan="2">
                          CPT-10 Codes
                        </th>
                        <th colSpan="9" className={styles.tableHead}>
                          <div id="parent" class="autocomplete">
                            <button
                              className="SchedularAppointmentButtons Schedulartablefields bil-button mr-2"
                              name="CPTpopup"
                              onClick={this.handleOpenModal}
                            >
                              CPT Pick List
                            </button>
                            <input
                              value={this.state.searchCpt}
                              type="text"
                              placeholder="Find CPT / HCPCS"
                              className="Schedulartablefields search-icon border-0 pl-2 pr-3"
                              // onChange = {this.searchData}
                              onChange={(e) => this.addEventListener(e)}
                              onKeyDown={(e) => this.KeyDown(e)}
                              style={{ border: "1px solid gray" }}
                            />
                            {this.isNull(this.state.searchCpt) ? (
                              <i class="Schedularsearch"></i>
                            ) : (
                              <i
                                onClick={() => this.setState({ searchCpt: "" })}
                                id="Schedularcross"
                                class="fa fa-times cptSearch"
                              ></i>
                            )}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={styles.tableHeadings}>
                        {/* <th scope="row" colSpan = "2" >#</th> */}
                        <td className="font-weight-bold">Code</td>
                        <td className="font-weight-bold" colSpan="2">
                          Description
                        </td>
                        <td className="font-weight-bold">Amount($)</td>
                        <td className="font-weight-bold">Delete</td>
                      </tr>
                      {this.state.FormCPTList.map((row) => (
                        <tr className={styles.tableRow}>
                          <td className={styles.tableData}>{row.cptCode}</td>
                          <td className={styles.tableData} colSpan="2">
                            {row.description}
                          </td>
                          <td className={styles.tableData}>{row.price}</td>
                          <td
                            className={styles.tableData}
                            style={{ textAlign: "center" }}
                          >
                            <img
                              onClick={() => this.deleteCPTRow(row)}
                              src={close}
                              alt="Logo"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* <div className="col-lg-2 col-sm-2 col-md-2"></div> */}
          {this.state.isOpen ? (
            <CptModal open={true} pickList={this.cptPickListReturn} />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userInfo1: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    loginObject: state.loginToken
      ? state.loginToken
      : { token: "", isLogin: false },
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loginAction: loginAction,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(NewClinical);
