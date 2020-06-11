import React, { Component } from "react";
import { Tabs, Tab } from 'react-tab-view'
import Select from 'react-select';
import Swal from "sweetalert2";
import { MDBDataTable } from "mdbreact";
import $ from "jquery";
import axios from "axios";
import Input from "./Input";
import Label from "./Label";
import dob_icon from '../images/dob-icon.png'
import samll_doc_icon from '../images/dob-small-icon.png'
import { totalmem } from "os";
import SearchHeading from "./SearchHeading";
import searchIcon from '../images/search-icon.png'
import refreshIcon from '../images/refresh-icon.png'
import newBtnIcon from '../images/new-page-icon.png'
import settingsIcon from '../images/setting-icon.png'
import EditCharge from './EditCharge';

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction, selectTabAction } from "../actions/selectTabAction";

export class NewCharge extends Component {
  constructor(props) {
    super(props);

    this.validationModel = {
      posValField: "",
      descriptionValField: ""
    };
    this.chargeModel = {

      visitID: 0,
      clientID: 1,

      facilityID: "",
      locationID: "",
      posid: "",
      providerID: "",
      patientID: "",
      primaryPatientPlanID: null,
      totalAmount: 0.0,
      isSubmitted: false,


      dateOfServiceFrom: "2019-10-07",
      dateOfServiceTo: "",

      CPTID: null,
      cptObj: {},

      modifier1ID: null,
      modifier2ID: null,
      modifier3ID: null,
      modifier4ID: null,

      modifier1Obj: {},
      modifier2Obj: {},
      modifier3Obj: {},
      modifier4Obj: {},

      pointer1: null,
      pointer2: null,
      pointer3: null,
      pointer4: null,

      units: null,
      unitOfMeasurement: null,
      totalAmount: "",

      startDate: "",
      endDate: "",
      minutes: ""

    };
    this.visitModel = {
      patientID: "",
      patient: "",
      DocumentBatchID: null,
      batchNumber: "",
      pageNumber: "",
      clientID: 1,

      primaryPatientPlanID: null,
      secondaryPatientPlanID: null,
      tertiaryPatientPlanID: null,

      primaryBilledAmount: "",
      primaryPlanAmount: "",
      primaryPlanAllowed: "",
      primaryPlanPaid: "",
      primaryWriteOff: "",

      facilityID: null,
      locationID: null,
      posid: null,
      providerID: null,
      refProviderID: null,
      supervisingProvID: null,

      icD1ID: null,
      icD2ID: null,
      icD3ID: null,
      icD4ID: null,
      icD5ID: null,
      icD6ID: null,
      icD7ID: null,
      icD8ID: null,
      icD9ID: null,
      icD10ID: null,
      icD11ID: null,
      icD12ID: null,

      icd1Obj: {},
      icd2Obj: {},
      icd3Obj: {},
      icd4Obj: {},
      icd5Obj: {},
      icd6Obj: {},
      icd7Obj: {},
      icd8Obj: {},
      icd9Obj: {},
      icd10Obj: {},
      icd11Obj: {},
      icd12Obj: {},

      totalAmount: "",
      // coPay:"",

      authorizationNum: "",
      outsideReferral: false,
      referralNum: "",
      onsetDateOfIllness: "",
      firstDateOfSimiliarIllness: "",
      illnessTreatmentDate: "",
      dateOfPregnancy: "",
      admissionDate: "",
      dischargeDate: "",
      lastXrayDate: "",
      lastXrayType: "",
      unableToWorkFromDate: "",
      unableToWorkToDate: "",

      accidentDate: "",
      accidentType: "",
      // accidentState: "",
      cliaNumber: "",
      outsideLab: false,
      labCharges: "",

      payerClaimControlNum: "",
      claimNotes: "",
      claimFrequencyCode: "",
      serviceAuthExcpCode: "",
      emergency: false,
      epsdt: false,
      familyPlan: false,

      charges: []

      //isActive: true
    };

    this.state = {
      chargeModel: this.chargeModel,
      visitModel: this.visitModel,
      validationModel: this.validationModel,
      patientDropDown: [],
      patientPlanDropdown: [],
      chargeModelArray: [],
      facility: [],
      location: [],
      provider: [],
      refProvider: [],
      supProvider: [],
      pos: [],
      editId: this.props.id,
      maxHeight: "500",
      activeItem: "1",
      diagnosisRow: false,
      cptRows: [],
      dob: "",
      gender: "",
      primaryPlanName: "",
      secondaryPlanName: "",
      tertiaryPlanName: "",
      showPopup: false,
      chargeId: 0,

      modifierOptions: [

      ],

      options: [

      ],

      cptOptions: [

      ]
    };
    this.handleOutsideRefCheck = this.handleOutsideRefCheck.bind(this);
    this.saveCharge = this.saveCharge.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addDiagnosisRow = this.addDiagnosisRow.bind(this);
    this.addCPTRow = this.addCPTRow.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleOutsideLabCheck = this.handleOutsideLabCheck.bind(this);
    this.handleEmergencyCheck = this.handleEmergencyCheck.bind(this);
    this.handleEPSDTCheck = this.handleEPSDTCheck.bind(this);
    this.handleFamilyPlanCheck = this.handleFamilyPlanCheck.bind(this);
    this.handleChargeChange = this.handleChargeChange.bind(this);
    this.handlePatientDropDownChange = this.handlePatientDropDownChange.bind(this);
    this.setPatientetails = this.setPatientetails.bind(this);
    this.deleteCPTRow = this.deleteCPTRow.bind(this);
    this.deleteVisit = this.deleteVisit.bind(this)
  }

  // setModalMaxHeight(element) {
  //   this.$element = $(element);
  //   this.$content = this.$element.find(".modal-content");
  //   var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
  //   var dialogMargin = $(window).width() < 768 ? 20 : 100;
  //   var contentHeight = $(window).height() - (dialogMargin + borderWidth);
  //   var headerHeight = this.$element.find(".modal-header").outerHeight() || 0;
  //   var footerHeight = this.$element.find(".modal-footer").outerHeight() || 0;
  //   var maxHeight = contentHeight - (headerHeight + footerHeight);

  //   this.setState({ maxHeight: maxHeight });
  // }

  async componentDidMount() {

    await axios
      .get("http://192.168.110.44/Database/api/visit/GetProfiles")
      .then(response => {
        this.setState({
          visitModel: {
            ...this.state.visitModel
          },
          facility: response.data.facility,
          location: response.data.location,
          provider: response.data.provider,
          refProvider: response.data.refProvider,
          supProvider: response.data.refProvider,
          pos: response.data.pos,
          patientDropDown: response.data.patientInfo,
          options: response.data.icd,
          modifierOptions: response.data.modifier,
          cptOptions: response.data.cpt
        });
      })
      .catch(error => {
        console.log(error);
      });



    if (this.state.editId > 0) {
      await axios
        .get("http://192.168.110.44/Database/api/Visit/FindVisit/" + this.state.editId)
        .then(response => {

          var patientInfo = this.state.patientDropDown.filter(patient => patient.patientId == response.data.patientID);
          this.setState({
            dob: patientInfo[0].dob,
            gender: patientInfo[0].gender
          });

          axios.get("http://192.168.110.44/Database/api/patientPlan/GetpatientPlansByPatientID/" + response.data.patientID).then(res => {
            this.setState({
              patientPlanDropdown: res.data
            })

            for (var i = 0; i < this.state.patientPlanDropdown.length; i++) {
              if (this.state.patientPlanDropdown[i].description == 'P') {
                this.setState({
                  primaryPlanName: "Primary - " + this.state.patientPlanDropdown[i].description2
                })

                break;
              }
              else {
                this.setState({
                  primaryPlanName: "",
                  visitModel: {
                    ...this.state.visitModel,
                    primaryPatientPlanID: null
                  }
                });


              }
            }


          });




          this.setState({ visitModel: response.data });
          this.setState({
            visitModel: {
              ...this.state.visitModel,
              icd1Obj: this.state.options.filter(option => option.id == response.data.icD1ID),
              icd2Obj: this.state.options.filter(option => option.id == response.data.icD2ID),
              icd3Obj: this.state.options.filter(option => option.id == response.data.icD3ID),
              icd4Obj: this.state.options.filter(option => option.id == response.data.icD4ID),
              icd5Obj: this.state.options.filter(option => option.id == response.data.icD5ID),
              icd6Obj: this.state.options.filter(option => option.id == response.data.icD6ID),
              icd7Obj: this.state.options.filter(option => option.id == response.data.icD7ID),
              icd8Obj: this.state.options.filter(option => option.id == response.data.icD8ID),
              icd9Obj: this.state.options.filter(option => option.id == response.data.icD9ID),
              icd10Obj: this.state.options.filter(option => option.id == response.data.icD10ID),
              icd11Obj: this.state.options.filter(option => option.id == response.data.icD11ID),
              icd12Obj: this.state.options.filter(option => option.id == response.data.icD12ID)
            }
          })

          this.state.visitModel.charges.map((charge, index) => {
            var cpt = {};
            cpt = this.state.cptOptions.filter(option => option.id == charge.cptid);
            var modifier1 = {};
            modifier1 = this.state.modifierOptions.filter(option => option.id == charge.modifier1ID);
            var modifier2 = {};
            modifier2 = this.state.modifierOptions.filter(option => option.id == charge.modifier2ID);
            var modifier3 = {};
            modifier3 = this.state.modifierOptions.filter(option => option.id == charge.modifier3ID);
            var modifier4 = {};
            modifier4 = this.state.modifierOptions.filter(option => option.id == charge.modifier4ID);

            charge.dateOfServiceFrom = charge.dateOfServiceTo ? charge.dateOfServiceFrom.replace("T00:00:00", "") : "";
            charge.dateOfServiceTo = charge.dateOfServiceTo ? charge.dateOfServiceTo.replace("T00:00:00", "") : "";
            charge.cptObj = cpt[0];
            charge.modifier1Obj = modifier1[0];
            charge.modifier2Obj = modifier2[0];
            charge.modifier3Obj = modifier3[0];
            charge.modifier4Obj = modifier4[0];


            this.setState({
              visitModel: {
                ...this.state.visitModel,
                charges: [
                  ...this.state.visitModel.charges.slice(0, index),
                  Object.assign({}, this.state.visitModel.charges[index], charge),
                  ...this.state.visitModel.charges.slice((index + 1))
                ]
              }
            });
          })
        })
        .catch(error => {
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
    } else {
      await this.setState({
        visitModel: {
          ...this.state.visitModel,
          charges: this.state.visitModel.charges.concat(this.chargeModel)
        }
      })
    }


  }

  async handleOutsideRefCheck() {
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        outsideReferral: !this.state.visitModel.outsideReferral
      }
    });
  }

  async handleOutsideLabCheck() {
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        outsideLab: !this.state.visitModel.outsideLab
      }
    });
  }

  async handleEmergencyCheck() {
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        emergency: !this.state.visitModel.emergency
      }
    });
  }


  async handleEPSDTCheck() {
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        epsdt: !this.state.visitModel.epsdt
      }
    });
  }


  async handleFamilyPlanCheck() {
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        familyPlan: !this.state.visitModel.familyPlan
      }
    });
  }


  async handleChange(event) {
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        [event.target.name]: event.target.value
      }
    });

  };

  async setPatientetails(id) {
    for (var i = 0; i < this.state.patientDropDown.length; i++) {
      if (this.state.patientDropDown[i].patientId == id) {
        await this.setState({
          dob: this.state.patientDropDown[i].dob,
          gender: this.state.patientDropDown[i].gender,

          visitModel: {
            ...this.state.visitModel,
            facilityID: this.state.patientDropDown[i].facilityId,
            locationID: this.state.patientDropDown[i].locationId,
            posid: this.state.patientDropDown[i].posId,
            providerID: this.state.patientDropDown[i].providerId,
            refProviderID: this.state.patientDropDown[i].refProviderId,
            supervisingProvID: this.state.patientDropDown[i].providerId
          },

          // chargeModel :{
          //   ...this.state.chargeModel ,
          //   facilityID : this.state.patientDropDown[i].facilityId,
          //   locationID : this.state.patientDropDown[i].locationId,
          //   posid : this.state.patientDropDown[i].posId,
          //   providerID : this.state.patientDropDown[i].providerId 
          //  }
        })
      }
    }


  }

  async handlePatientDropDownChange(event) {
    const id = event.target.value;
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        [event.target.name]: event.target.value
      }
    });

    await this.setPatientetails(id);




    await axios.get("http://192.168.110.44/Database/api/patientPlan/GetpatientPlansByPatientID/" + id).then(res => {
      this.setState({
        patientPlanDropdown: res.data
      })
    })

    for (var i = 0; i < this.state.patientPlanDropdown.length; i++) {
      if (this.state.patientPlanDropdown[i].description == 'P') {
        await this.setState({
          primaryPlanName: "Primary - " + this.state.patientPlanDropdown[i].description2,
          visitModel: {
            ...this.state.visitModel,
            primaryPatientPlanID: this.state.patientPlanDropdown[i].id
          }
        })
      }
      else {
        await this.setState({
          primaryPlanName: "",
          visitModel: {
            ...this.state.visitModel,
            primaryPatientPlanID: null
          }
        });
        Swal.fire(
          "PatientPlan Does'nt Exists",
          "Visit can't be created",
          "error"
        );
      }
    }


  }


  async handleChargeChange(event) {


    const index = event.target.id
    const name = event.target.name;
    var charge = this.state.visitModel.charges[index];
    charge[name] = event.target.value

    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        charges: [
          ...this.state.visitModel.charges.slice(0, index),
          Object.assign({}, this.state.visitModel.charges[index], charge),
          ...this.state.visitModel.charges.slice((index + 1))
        ]
      }
    });


    var totalAmount = 0;
    this.state.visitModel.charges.map(charge => {
      totalAmount = totalAmount + parseInt(charge.totalAmount, 10);
    });
    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        totalAmount: totalAmount,
        primaryBilledAmount: totalAmount
      }

    });
  }

  openEditChargePopup = (event, index, id) => {
    this.setState({ showPopup: true, chargeId: id });
  };


  async handleDateChange(event) {


    await this.setState({
      chargeModel: {
        ...this.state.chargeModel, [event.target.name]: event.target.value
      }
    })
  }


  async saveCharge() {

    console.log(this.state.visitModel)

    if (this.state.visitModel.primaryPatientPlanID == null) {
      Swal.fire(
        "PatientPlan Does'nt Exists",
        "Visit can't be created",
        "error"
      );
    } else {
      await axios.post("http://192.168.110.44/Database/api/visit/SaveVisit",
        this.state.visitModel).then(response => {
          Swal.fire("Record Saved Successfully", "", "success");
        }).catch(error => {
          console.log(error)
        })
    }


  }

  deleteVisit() {
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
          .delete("http://192.168.110.44/Database/api/Visit/DeleteVisit/" + this.state.editId)
          .then(response => {
            console.log("Delete Response :", response);
            Swal.fire("Record Deleted Successfully", "", "success").then(res => {
              this.props.selectTabAction("Charges");
            });

          })
          .catch(error => {
            Swal.fire("Record Not Deleted!", "Record can not be delete,  it maybe referenced in other screens.", "error");
          });
      }
    })
  }


  addDiagnosisRow() {
    this.setState({
      diagnosisRow: !this.state.diagnosisRow
    })

  }

  async addCPTRow() {


    const length = this.state.visitModel.charges.length;
    var charge;
    if (length == 0) {
      charge = this.chargeModel;
    } else {
      charge = this.state.visitModel.charges[length - 1];
    }

    charge.facilityID = this.state.visitModel.facilityID;
    charge.providerID = this.state.visitModel.providerID;
    charge.locationID = this.state.visitModel.locationID;
    charge.posid = this.state.visitModel.posid;
    charge.patientID = this.state.visitModel.patientID;
    //charge.visitID = this.state.visitModel.visitID;
    charge.primaryPatientPlanID = this.state.visitModel.primaryPatientPlanID;


    await this.setState({
      visitModel: {
        ...this.state.visitModel,
        charges: this.state.visitModel.charges.concat(this.chargeModel)
      }

    });

  }

  async deleteCPTRow(event, index, chargeId) {
    const chargeID = chargeId;
    console.log("Charge Id : ", chargeId)
    const id = event.target.id
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

        if (chargeID) {
          axios
            .delete("http://192.168.110.44/Database/api/Charge/DeleteCharge/" + chargeId)
            .then(response => {
              console.log("Delete Response :", response);
              Swal.fire("Record Deleted Successfully", "", "success");
            })
            .catch(error => {
              Swal.fire("Record Not Deleted!", "Record can not be delete, as it is being referenced in other screens.", "error");
            });
        }

        let charges = [...this.state.visitModel.charges];
        charges.splice(id, 1)

        this.setState({
          visitModel: {
            ...this.state.visitModel,
            charges: charges
          }
        })

      }
    });


    //   let charges = [...this.state.visitModel.charges];
    //   charges.splice( event.target.id , 1)

    //   this.setState({
    //    visitModel : {
    //      ...this.state.visitModel,
    //      charges : charges
    //    }
    //  })


  }


  handleICD1Change = (icd1SelectedOption, id, icdObj) => {

    if (icd1SelectedOption) {
      this.setState(
        {
          visitModel: {
            ...this.state.visitModel,
            [id]: icd1SelectedOption.id,
            [icdObj]: icd1SelectedOption
          }
        }
      );
    } else {
      this.setState(
        {
          visitModel: {
            ...this.state.visitModel,
            [id]: null,
            [icdObj]: {}
          }
        });

    }

  };

  handleCPTCodeChange = (cptModel, index) => {

    var charge = this.state.visitModel.charges[index];
    charge.CPTID = cptModel.id;
    charge.cptObj = cptModel;

    this.setState({
      visitModel: {
        ...this.state.visitModel,
        charges: [
          ...this.state.visitModel.charges.slice(0, index),
          Object.assign({}, this.state.visitModel.charges[index], charge),
          ...this.state.visitModel.charges.slice((index + 1))
        ]
      }
    });
  };


  handleModifier1Change = (modifier1, index) => {
    var charge = this.state.visitModel.charges[index];
    charge.modifier1ID = modifier1.id;
    charge.modifier1Obj = modifier1;

    this.setState({
      visitModel: {
        ...this.state.visitModel,
        charges: [
          ...this.state.visitModel.charges.slice(0, index),
          Object.assign({}, this.state.visitModel.charges[index], charge),
          ...this.state.visitModel.charges.slice((index + 1))
        ]
      }
    });
  };

  handleModifier2Change = (modifier2, index) => {
    var charge = this.state.visitModel.charges[index];
    charge.modifier2ID = modifier2.id;
    charge.modifier2Obj = modifier2;

    this.setState({
      modifier2ID: modifier2,
      visitModel: {
        ...this.state.visitModel,
        charges: [
          ...this.state.visitModel.charges.slice(0, index),
          Object.assign({}, this.state.visitModel.charges[index], charge),
          ...this.state.visitModel.charges.slice((index + 1))
        ]
      }
    });
  };

  handleModifier3Change = (modifier3, index) => {
    var charge = this.state.visitModel.charges[index];
    charge.modifier3ID = modifier3.id;
    charge.modifier3Obj = modifier3;

    this.setState({
      modifier3ID: modifier3,
      visitModel: {
        ...this.state.visitModel,
        charges: [
          ...this.state.visitModel.charges.slice(0, index),
          Object.assign({}, this.state.visitModel.charges[index], charge),
          ...this.state.visitModel.charges.slice((index + 1))
        ]
      }
    });
  };

  handleModifier4Change = (modifier4, index) => {
    var charge = this.state.visitModel.charges[index];
    charge.modifier4ID = modifier4.id;
    charge.modifier4Obj = modifier4;

    this.setState({
      modifier4ID: modifier4,
      visitModel: {
        ...this.state.visitModel,
        charges: [
          ...this.state.visitModel.charges.slice(0, index),
          Object.assign({}, this.state.visitModel.charges[index], charge),
          ...this.state.visitModel.charges.slice((index + 1))
        ]
      }
    });
  };

  closeEditChargePopup = () => {
    $("#myModal1").hide();
    this.setState({ showPopup: false });
  };

  closeNewCharge() {
    this.props.selectTabAction("Charges");
  }
  render() {

    let popup = "";

    if (this.state.showPopup) {
      popup = (
        <EditCharge
          onClose={() => this.closeEditChargePopup}
          chargeId={this.state.chargeId}
          icd1Id={this.state.visitModel.icD1ID}
          icd2Id={this.state.visitModel.icD2ID}
          icd3Id={this.state.visitModel.icD3ID}
          icd4Id={this.state.visitModel.icD4ID}
        ></EditCharge>
      );
    } else popup = <React.Fragment></React.Fragment>;


    const isActive = this.state.visitModel.isActive;

    const headers = ['Claim Dates & Authorizations', 'Accident & Labs', 'Other']

    const gender = [
      { value: "", display: "Select Gender" },
      { value: "male", display: "Male" },
      { value: "female", display: "Female" },
      { value: "unknown", display: "Unknown" }
    ];
    const status = [
      { value: "", display: "Select Status" },
      { value: "N", display: "New Charge" }
    ];

    const unitOfMeasurement = [
      { value: "", display: "Select State" },
      { value: "UN", display: "Units" },
      { value: "MJ", display: "Minutes" }
    ];

    let newList = [];
    this.state.visitModel.charges.map((row, index) => {
      newList.push({
        id: row.id,
        ChargeId: (
          <button style={{ width: "35px" }} name="deleteCPTBtn" id={index} onClick={(event) => this.openEditChargePopup(event, index, row.id)}>{row.id}</button>
        ),
        dosFrom: (
          <div class="textBoxValidate">
            {/* <input style={{ width: "120px", marginRight:"5px",padding:" 7px 5px"}} type="text" value="" name="" id=""></input>
                    <img class="smallCalendarIcon" src="images/dob-small-icon.png" /> */}
            <input
              style={{
                background: "url(" + samll_doc_icon + ") no-repeat right",
                width: "145px"
              }}
              className="smallCalendarIcon"
              type="date"
              name="dateOfServiceFrom"
              id={index}
              value={this.state.visitModel.charges[index].dateOfServiceFrom}
              onChange={this.handleChargeChange}
            >
            </input>
          </div>
        ),
        dosTo: (
          <div class="textBoxValidate">
            {/*  <input style={{ width: "120px", marginRight:"5px",padding: "7px 5px"}} type="text" value="" name="" id=""></input>
                      <img class="smallCalendarIcon" src="images/dob-small-icon.png"/> */}
            <input
              style={{
                background: "url(" + samll_doc_icon + ") no-repeat right",
                width: "145px"
              }}
              className="smallCalendarIcon"
              type="date"
              name="dateOfServiceTo"
              id={index}
              value={this.state.visitModel.charges[index].dateOfServiceTo}
              onChange={this.handleChargeChange}
            >
            </input>
          </div>
        ),
        cptCode: (
          <div style={{ width: "125px" }}>
            <Select
              value={this.state.visitModel.charges[index].cptObj}
              onChange={(event) => this.handleCPTCodeChange(event, index)}
              options={this.state.cptOptions}
              placeholder=""
              Clearable={true}
            />
          </div>
        ),
        modifiers: (
          <div className="container" style={{ width: '233px' }}>

            <div className="row">

              <div style={{ width: "50px", height: "20px" }}>
                <Select
                  value={this.state.visitModel.charges[index].modifier1Obj}
                  onChange={(event) => this.handleModifier1Change(event, index)}
                  options={this.state.modifierOptions}
                  placeholder=""
                  Clearable={true}
                />
              </div>

              <div style={{ width: "50px" }}>
                <Select
                  value={this.state.visitModel.charges[index].modifier2Obj}
                  onChange={(event) => this.handleModifier2Change(event, index)}
                  options={this.state.modifierOptions}
                  placeholder=""
                  Clearable={true}
                />
              </div>

              <div style={{ width: "50px" }}>
                <Select
                  value={this.state.visitModel.charges[index].modifier3Obj}
                  onChange={(event) => this.handleModifier3Change(event, index)}
                  options={this.state.modifierOptions}
                  placeholder=""
                  Clearable={true}
                />
              </div>

              <div style={{ width: "50px" }}>
                <Select
                  value={this.state.visitModel.charges[index].modifier4Obj}
                  onChange={(event) => this.handleModifier4Change(event, index)}
                  options={this.state.modifierOptions}
                  placeholder=""
                  Clearable={true}
                />
              </div>


            </div>
          </div>
        ),
        pointers: (
          <div style={{ width: "182px" }}>
            <input style={{ width: " 35px", marginRight: "5px", padding: "7px 5px" }} type="text" value={this.state.visitModel.charges[index].pointer1} name="pointer1" id={index} onChange={this.handleChargeChange}></input>
            <input style={{ width: " 35px", marginRight: "5px", padding: "7px 5px" }} type="text" value={this.state.visitModel.charges[index].pointer2} name="pointer2" id={index} onChange={this.handleChargeChange}></input>
            <input style={{ width: " 35px", marginRight: "5px", padding: "7px 5px" }} type="text" value={this.state.visitModel.charges[index].pointer3} name="pointer3" id={index} onChange={this.handleChargeChange}></input>
            <input style={{ width: " 35px", marginRight: "5px", padding: "7px 5px" }} type="text" value={this.state.visitModel.charges[index].pointer4} name="pointer4" id={index} onChange={this.handleChargeChange}></input>

          </div>
        ),
        units: (
          <input style={{ width: " 70px", marginRight: "5px", padding: "7px 5px" }} type="text" value={this.state.visitModel.charges[index].units} name="units" id={index} onChange={this.handleChargeChange}></input>

        ),
        pos: (
          <div style={{ width: "130px" }} >
            < select

              name="posid"
              id={index}
              value={
                this.state.visitModel.charges[index].posid
              }
              onChange={
                this.handleChargeChange
              } >
              {
                this.state.pos.map(s => (
                  <option key={
                    s.id
                  }
                    value={
                      s.id
                    } > {
                      s.description2
                    } </option>
                ))
              }
            </select>
          </div>
        ),
        amount: (
          <input
            style={{ width: " 120px", marginRight: "5px", padding: "7px 5px" }}
            type="text" value={this.state.visitModel.charges[index].totalAmount}
            name="totalAmount" id={index}
            onChange={this.handleChargeChange}></input>
        ),
        remove: (
          <button style={{ width: "50px" }} name="deleteCPTBtn" id={index} onClick={(event, index) => this.deleteCPTRow(event, index, row.id)}>X</button>
        )
      });
    });


    const tableData = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
          width: 60
        },
        {
          label: "#",
          field: "ChargeId",
          sort: "asc",
          width: 168
        },
        {
          label: "DOS FROM",
          field: "dosFrom",
          sort: "asc",
          width: 168
        },
        {
          label: "DOS TO",
          field: "dosTo",
          sort: "asc",
          width: 150
        },
        {
          label: "CPT CODE",
          field: "cptCode",
          sort: "asc",
          width: 254
        },
        {
          label: "MODIFIERS",
          field: "modifiers",
          sort: "asc",
          width: 205
        },
        {
          label: "DIAGNOSIS POINTERS",
          field: "pointers",
          sort: "asc",
          width: 100
        },
        {
          label: "UNITS",
          field: "units",
          sort: "asc",
          width: 153
        },
        {
          label: "POS",
          field: "pos",
          sort: "asc",
          width: 140
        },
        {
          label: "AMOUNT",
          field: "ammount",
          sort: "asc",
          width: 50
        },
        {
          label: "REMOVE",
          field: "remove",
          sort: "asc",
          width: 50
        }
      ],
      rows: newList
    };

    var onsetDateOfIllness = this.state.visitModel.onsetDateOfIllness ? this.state.visitModel.onsetDateOfIllness.replace("T00:00:00", "") : "";

    var firstDateOfSimiliarIllness = this.state.visitModel.firstDateOfSimiliarIllness ? this.state.visitModel.firstDateOfSimiliarIllness.replace("T00:00:00", "") : "";

    var illnessTreatmentDate = this.state.visitModel.illnessTreatmentDate ? this.state.visitModel.illnessTreatmentDate.replace("T00:00:00", "") : "";

    var dateOfPregnancy = this.state.visitModel.dateOfPregnancy ? this.state.visitModel.dateOfPregnancy.replace("T00:00:00", "") : "";

    var admissionDate = this.state.visitModel.admissionDate ? this.state.visitModel.admissionDate.replace("T00:00:00", "") : "";

    var dischargeDate = this.state.visitModel.dischargeDate ? this.state.visitModel.dischargeDate.replace("T00:00:00", "") : "";

    var lastXrayDate = this.state.visitModel.lastXrayDate ? this.state.visitModel.lastXrayDate.replace("T00:00:00", "") : "";

    var unableToWorkFromDate = this.state.visitModel.unableToWorkFromDate ? this.state.visitModel.unableToWorkFromDate.replace("T00:00:00", "") : "";

    var unableToWorkToDate = this.state.visitModel.unableToWorkToDate ? this.state.visitModel.unableToWorkToDate.replace("T00:00:00", "") : "";

    var accidentDate = this.state.visitModel.accidentDate ? this.state.visitModel.accidentDate.replace("T00:00:00", "") : "";

    var dob = this.state.dob ? this.state.dob.replace("T00:00:00", "") : "";
    //   console.log("Date : " , this.state.dob)
    //  if(this.state.dob){
    //   var newDate = new Date(this.state.dob);
    //   var day = newDate.getDate();
    //   var month = newDate.getMonth() + 1;
    //   var year = newDate.getFullYear();
    //   var dob = month + "-" + day + "-" + year;
    //  }


    return (
      <React.Fragment>
        <div>

          {/* <SearchHeading
          heading="VISIT"
          handler={() => this.openEditChargePopup()}
        ></SearchHeading> */}

          <div className="mainHeading row">
            <div className="col-md-6">
              <h1>VISIT</h1>
            </div>
            <div className="col-md-6 headingRight">

              <button data-toggle="modal" data-target=".bs-example-modal-new" className="btn-blue-icon"
                onClick={this.openEditChargePopup}>ReSubmit</button>
              <button data-toggle="modal" data-target=".bs-example-modal-new" className="btn-blue-icon"
                onClick={this.deleteVisit} style={{ marginLeft: "20px" }}>Delete</button>
            </div>
          </div>


          <div>
            <div className="mainTable fullWidthTable mt-25">
              <div class="row-form">
                <div class="mf-4">
                  <label>Patient</label>

                  < select
                    name="patientID"
                    id="patientID"
                    value={
                      this.state.visitModel.patientID
                    }
                    onChange={
                      this.handlePatientDropDownChange
                    } >
                    {
                      this.state.patientDropDown.map(s => (
                        <option key={
                          s.patientId
                        }
                          value={
                            s.patientId
                          } > {
                            s.patientName
                          } </option>
                      ))
                    } </select>


                </div>
                <div class="mf-4">
                  <label>DOB </label>
                  <div class="textBoxValidate">
                    <input
                      style={{ fontSize: "25px" }}
                      type="text"
                      disabled="disabled"
                      value={dob}
                      name="primaryPlanName"
                      id="primaryPlanName"
                    ></input>
                    <img class="calendarIcon" src={dob_icon} />
                  </div>
                </div>
                <div class="mf-4">
                  <label>Gender </label>
                  <input
                    type="text"
                    disabled="disabled"
                    value={this.state.gender}
                    name="primaryPlanName"
                    id="primaryPlanName"
                  //onChange={this.handleChange}
                  ></input>
                </div>
              </div>

              <div class="row-form">
                <div class="mf-4">
                  <label>Batch#</label>
                  <input type="text"
                    value={this.state.visitModel.DocumentBatchID}
                    name="DocumentBatchID "
                    id="DocumentBatchID "
                    onChange={this.handleChange}></input>
                </div>
                <div class="mf-4">
                  <label>Page# </label>
                  <input type="text" value={this.state.visitModel.pageNumber}
                    name="pageNumber" id="pageNumber"
                    onChange={this.handleChange}></input>
                </div>
                <div class="mf-4">&nbsp;</div>
              </div>

              <div class="mf-12 headingtwo">
                <p>Insurance Info</p>
              </div>

              <div class="mainTable fullWidthTable">
                <div class="row-form">
                  <div class="mf-12">
                    <fieldset>
                      {/* <legend class="mf-4-legend">
                        <select 
                         name="primaryPatientPlanID"
                          id="primaryPatientPlanID"
                          //onChange={this.handleChange}
                          >
                          {this.state.patientPlanDropdown.map( plan =>(
                          <option key={plan.id} value={plan.id}> 
                          {plan.description}
                          </option>

                          ))}
                        </select>
                      </legend> */}

                      <div class="row-form">
                        <div class="mf-4">
                          <label>Plan</label>
                          <input
                            type="text"
                            disabled="disabled"
                            value={this.state.primaryPlanName}
                            name="primaryPlanName"
                            id="primaryPlanName"
                          //onChange={this.handleChange}
                          ></input>
                        </div>
                        <div class="mf-4">
                          <label>Billed</label>
                          <input
                            type="text"
                            disabled="disabled"
                            value={this.state.visitModel.primaryBilledAmount}
                            name="primaryBilledAmount"
                            id="primaryBilledAmount"
                          //onChange={this.handleChange}
                          ></input>
                        </div>
                        <div class="mf-4">
                          <label>Paid</label>
                          <input
                            type="text"
                            disabled="disabled"
                            value={this.state.visitModel.primaryPlanPaid}
                            name="primaryPlanPaid"
                            id="primaryPlanPaid"
                          //onChange={this.handleChange}
                          ></input>
                        </div>
                      </div>

                      <div class="row-form">
                        <div class="mf-4">
                          <label>Status</label>
                          < select
                            name="status"
                            id="status"
                            value={
                              this.state.visitModel.status
                            }
                            onChange={
                              this.handleChange
                            } >
                            {
                              status.map(s => (
                                <option key={
                                  s.value
                                }
                                  value={
                                    s.value
                                  } > {
                                    s.display
                                  } </option>
                              ))
                            } </select>
                        </div>
                        <div class="mf-4">
                          <label>Allowed</label>
                          <input
                            type="text"
                            disabled="disabled"
                            value={this.state.visitModel.primaryPlanAllowed}
                            name="primaryPlanAllowed"
                            id="primaryPlanAllowed"
                          //onChange={this.handleChange}
                          ></input>
                        </div>
                        <div class="mf-4">
                          <label>Patient Amount</label>
                          <input
                            type="text"
                            disabled="disabled"
                            value={this.state.visitModel.primaryWriteOff}
                            name="primaryWriteOff"
                            id="primaryWriteOff"
                            onChange={this.handleChange}
                          ></input>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div class="mf-4">
                    <label>&nbsp;</label>
                  </div>
                  <div class="mf-4">
                    <label>&nbsp;</label>
                  </div>
                </div>
              </div>


              <div class="headingtwo mt-25">
                <p>Legal Entities</p>
              </div>

              <div class="mainTable fullWidthTable wSpace">
                <div class="row-form">
                  <div class="mf-4">
                    <label>Practice</label>
                    < select
                      name="facilityID"
                      id="facilityID"
                      value={
                        this.state.visitModel.facilityID
                      }
                      onChange={
                        this.handleChange
                      } >
                      {
                        this.state.facility.map(s => (
                          <option key={
                            s.id
                          }
                            value={
                              s.id
                            } > {
                              s.description
                            } </option>
                        ))
                      } </select>
                  </div>
                  <div class="mf-4">
                    <label>Location</label>
                    < select
                      name="locationID"
                      id="locationID"
                      value={
                        this.state.visitModel.locationID
                      }
                      onChange={
                        this.handleChange
                      } >
                      {
                        this.state.location.map(s => (
                          <option key={
                            s.id
                          }
                            value={
                              s.id
                            } > {
                              s.description
                            } </option>
                        ))
                      } </select>
                  </div>
                  <div class="mf-4">
                    <label>POS</label>
                    < select
                      name="posid"
                      id="posid"
                      value={
                        this.state.visitModel.posid
                      }
                      onChange={
                        this.handleChange
                      } >
                      {
                        this.state.pos.map(s => (
                          <option key={
                            s.id
                          }
                            value={
                              s.id
                            } > {
                              s.description
                            } </option>
                        ))
                      } </select>
                  </div>
                </div>
                <div class="row-form">
                  <div class="mf-4">
                    <label>Provider</label>
                    < select
                      name="providerID"
                      id="providerID"
                      value={
                        this.state.visitModel.providerID
                      }
                      onChange={
                        this.handleChange
                      } >
                      {
                        this.state.provider.map(s => (
                          <option key={
                            s.id
                          }
                            value={
                              s.id
                            } > {
                              s.description
                            } </option>
                        ))
                      } </select>
                  </div>
                  <div class="mf-4">
                    <label>Ref. Provider</label>
                    < select
                      name="refProviderID"
                      id="refProviderID"
                      value={
                        this.state.visitModel.refProviderID
                      }
                      onChange={
                        this.handleChange
                      } >
                      {
                        this.state.refProvider.map(s => (
                          <option key={
                            s.id
                          }
                            value={
                              s.id
                            } > {
                              s.description
                            } </option>
                        ))
                      } </select>
                  </div>
                  <div class="mf-4">
                    <label>Supervising Provider</label>
                    < select
                      name="supervisingProvID"
                      id="supervisingProvID"
                      value={
                        this.state.visitModel.supervisingProvID
                      }
                      onChange={
                        this.handleChange
                      } >
                      {
                        this.state.provider.map(s => (
                          <option key={
                            s.id
                          }
                            value={
                              s.id
                            } > {
                              s.description
                            } </option>
                        ))
                      } </select>
                  </div>
                </div>
              </div>


              <div class="headingtwo mt-25">
                <div class="headingTable">
                  <div class="row">
                    <div class="col-md-6">
                      <p class="pt-15">Diagnosis</p>
                    </div>
                    <div class="col-md-6 headingRight" style={{ marginBottom: "10px" }}>
                      <button id="showDiagnosisRow" class="btn-blue-icon mt-0" onClick={this.addDiagnosisRow}>More Diagnosis </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mainTable fullWidthTable">

                <div class="row-form" style={{ overflow: "visible" }}>
                  <div class="mf-4">
                    <label>D1 </label>
                    <div class="textBoxValidate">
                      <Select
                        value={this.state.visitModel.icd1Obj}
                        onChange={(event) => this.handleICD1Change(event, "icD1ID", "icd1Obj")}
                        options={this.state.options}
                        placeholder=""
                        isClearable={true}
                        isSearchable={true}
                      />

                      {/* <input
        style={{ width: "90px" }}
        max="7"
        type="text"
        value={this.state.visitModel.icD1ID}
        name="icD1ID"
        id="icD1ID"
        onChange={this.handleChange}
      ></input> */}
                      {/* <input
        style={{ width: "90px" }}
        maxlength="7"
        type="text"
        value={this.state.visitModel.icD2ID}
        name="icD2ID"
        id="icD2ID"
        onChange={this.handleChange}
      ></input> */}
                    </div>
                  </div>
                  <div class="mf-4">
                    <label>D2</label>
                    <div className="textBoxValidate">
                      <Select
                        value={this.state.visitModel.icd2Obj}
                        onChange={(event) => this.handleICD1Change(event, "icD2ID", "icd2Obj")}
                        options={this.state.options}
                        placeholder=""
                        isClearable={true}
                        isSearchable={true}

                      />

                    </div>
                  </div>
                  <div class="mf-4">
                    <label>D3</label>
                    <div className="textBoxValidate">
                      <Select
                        value={this.state.visitModel.icd3Obj}
                        onChange={(event) => this.handleICD1Change(event, "icD3ID", "icd3Obj")}
                        options={this.state.options}
                        placeholder=""
                        isClearable={true}
                        isSearchable={true}
                      />

                    </div>
                  </div>
                </div>
                <div class="row-form" style={{ overflow: "visible" }}>
                  <div class="mf-4">
                    <label>D4</label>
                    <div class="textBoxValidate">
                      <Select
                        value={this.state.visitModel.icd4Obj}
                        onChange={(event) => this.handleICD1Change(event, "icD4ID", "icd4Obj")}
                        options={this.state.options}
                        placeholder=""
                        isClearable={true}
                        isSearchable={true}
                      />
                      {/* <input
        style={{ width: "90px" }}
        maxlength="7"
        type="text"
        value={this.state.visitModel.icD3ID}
        name="icD3ID"
        id="icD3ID"
        onChange={ this.handleChange}
      ></input>
      <input
        style={{ width: "90px" }}
        maxlength="7"
        type="text"
        value={this.state.visitModel.icD4ID}
        name="icD4ID"
        id="icD4ID"
        onChange={this.handleChange}
      ></input> */}
                    </div>
                  </div>
                  <div class="mf-4">
                    <label>D5</label>
                    <div className="textBoxValidate">
                      <Select
                        value={this.state.visitModel.icd5Obj}
                        onChange={(event) => this.handleICD1Change(event, "icD5ID", "icd5Obj")}
                        options={this.state.options}
                        placeholder=""
                        isClearable={true}
                        isSearchable={true}
                      />

                    </div>
                  </div>
                  <div class="mf-4">
                    <label>D6</label>
                    <div class="textBoxValidate">
                      <Select
                        value={this.state.visitModel.icd6Obj}
                        onChange={(event) => this.handleICD1Change(event, "icD6ID", "icd6Obj")}
                        options={this.state.options}
                        placeholder=""
                        isClearable={true}
                        isSearchable={true}
                      />
                      {/* <input
        style={{ width: "90px" }}
        maxlength="7"
        type="text"
        value={this.state.visitModel.icD5ID}
        name="icD5ID"
        id="icD5ID"
        onChange={this.handleChange}
      ></input>
      <input
        style={{ width: "90px" }}
        maxlength="7"
        type="text"
        value={this.state.visitModel.icD6ID}
        name="icD6ID"
        id="icD6ID"
        onChange={this.handleChange}
      ></input> */}
                    </div>
                  </div>

                </div>

                {this.state.diagnosisRow ?
                  <div>
                    <div class="row-form" style={{ overflow: "visible" }}>
                      <div class="mf-4">
                        <label>D7 </label>
                        <div class="textBoxValidate">
                          <Select
                            value={this.state.visitModel.icd7Obj}
                            onChange={(event) => this.handleICD1Change(event, "icD7ID", "icd7Obj")}
                            options={this.state.options}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                          />


                        </div>
                      </div>
                      <div class="mf-4">
                        <label>D8</label>
                        <div className="textBoxValidate">
                          <Select
                            value={this.state.visitModel.icd8Obj}
                            onChange={(event) => this.handleICD1Change(event, "icD8ID", "icd8Obj")}
                            options={this.state.options}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}

                          />

                        </div>
                      </div>
                      <div class="mf-4">
                        <label>D9</label>
                        <div className="textBoxValidate">
                          <Select
                            value={this.state.visitModel.icd9Obj}
                            onChange={(event) => this.handleICD1Change(event, "icD9ID", "icd9Obj")}
                            options={this.state.options}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                          />

                        </div>
                      </div>
                    </div>
                    <div class="row-form" style={{ overflow: "visible" }}>
                      <div class="mf-4">
                        <label>D10</label>
                        <div class="textBoxValidate">
                          <Select
                            value={this.state.visitModel.icd10Obj}
                            onChange={(event) => this.handleICD1Change(event, "icD10ID", "icd10Obj")}
                            options={this.state.options}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                          />

                        </div>
                      </div>
                      <div class="mf-4">
                        <label>D11</label>
                        <div className="textBoxValidate">
                          <Select
                            value={this.state.visitModel.icd11Obj}
                            onChange={(event) => this.handleICD1Change(event, "icD11ID", "icd11Obj")}
                            options={this.state.options}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                          />

                        </div>
                      </div>
                      <div class="mf-4">
                        <label>D12</label>
                        <div class="textBoxValidate">
                          <Select
                            value={this.state.visitModel.icd12Obj}
                            onChange={(event) => this.handleICD1Change(event, "icD12ID", "icd12Obj")}
                            options={this.state.options}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                          />

                        </div>
                      </div>
                    </div>

                  </div> : ""}

              </div>




              <div class="headingtwo mt-25">
                <p>Service Lines</p>
              </div>

              <div class="mainTable fullWidthTable">
                <div class="mf-12 table-grid mt-15">
                  <div class="row headingTable">
                    <div class="mf-6">
                      <h1>Service Lines</h1>
                    </div>
                    <div class="mf-6 headingRightTable">
                      <button class="btn-blue" onClick={this.addCPTRow}>Add CPT </button>
                    </div>
                  </div>

                  <div>
                    <div className="tableGridContainer serviceLineTable">
                      <MDBDataTable
                        striped
                        bordered
                        searching={false}
                        data={tableData}
                        displayEntries={false}
                        //sortable={true}
                        scrollX={true}
                      />
                    </div>
                  </div>

                </div>
              </div>
              <div class="mainTable fullWidthTable mt-25">
                <div class="row-form">
                  <div class="mf-4">
                    <label>Total Amount</label>
                    <input type="text"
                      value={this.state.visitModel.totalAmount}
                      name="totalAmount" id="totalAmount"
                      onChange={this.handleChange}></input>
                  </div>
                  <div class="mf-4">
                    <label>Copay</label>
                    <input type="text" value={this.state.visitModel.coPay} name="coPay" id="coPay"
                      onChange={this.handleChange}></input>
                  </div>
                  <div class="mf-4">
                    &nbsp;
                    </div>
                </div>
              </div>


              <div class="headingtwo mt-25">
                <p>Extra Information</p>
              </div>


              <div class="mainTable fullWidthTable">
                <div class="row-form">
                  <div class="mf-12">
                    <Tabs headers={headers} style={{ cursor: "default" }}>
                      <Tab >
                        <div style={{ marginTop: "20px" }}>
                          <div class="mainTable fullWidthTable wSpace" style={{ maxWidth: "100%" }}>
                            <div class="row-form">
                              <div class="mf-4">
                                <label>Authorization #</label>
                                <input type="text"
                                  value={this.state.visitModel.authorizationNum} name="authorizationNum" id="authorizationNum"
                                  onChange={this.handleChange}></input>
                              </div>
                              <div class="mf-4">
                                &nbsp;
                                                    </div>
                              <div class="mf-4">
                                &nbsp;
                                                    </div>
                            </div>
                            <div class="row-form">
                              <div class="mf-4">
                                <label for="markInactive">Outside Referral</label>
                                <div class="textBoxValidate" onClick={this.handleOutsideRefCheck}>
                                  <div class="lblChkBox" >
                                    <input type="checkbox" id="outsideReferral" name="outsideReferral"
                                      checked={this.state.visitModel.outsideReferral}

                                    ></input>
                                    <label for="markInactive">
                                      <span></span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div class="mf-4">
                                <label>Referral#</label>
                                <input type="text" value={this.state.visitModel.referralNum} name="referralNum" id="referralNum"
                                  onChange={this.handleChange}></input>
                              </div>
                              <div class="mf-4">
                                <label>Onset Date of Current illness</label>
                                <div class="textBoxValidate">
                                  <input
                                    style={{
                                      width: "215px",
                                      marginLeft: "0px"
                                    }}
                                    className="myInput"
                                    type="date"
                                    name="onsetDateOfIllness"
                                    id="onsetDateOfIllness"
                                    value={onsetDateOfIllness}
                                    onChange={this.handleChange}
                                  ></input>
                                </div>
                              </div>
                            </div>
                            <div class="row-form">
                              <div class="mf-4">
                                <label>First date of similar illness</label>
                                <div class="textBoxValidate"
                                >
                                  <input
                                    style={{
                                      width: "215px",
                                      marginLeft: "0px"
                                    }}
                                    className="myInput"
                                    type="date"
                                    name="firstDateOfSimiliarIllness"
                                    id="firstDateOfSimiliarIllness"
                                    value={firstDateOfSimiliarIllness}
                                    onChange={this.handleChange}
                                  ></input>
                                </div>
                              </div>
                              <div class="mf-4">
                                <label>Initial Treatment date	</label>
                                <div class="textBoxValidate">
                                  <input
                                    style={{
                                      width: "215px",
                                      marginLeft: "0px"
                                    }}
                                    className="myInput"
                                    type="date"
                                    name="illnessTreatmentDate"
                                    id="illnessTreatmentDate"
                                    value={illnessTreatmentDate}
                                    onChange={this.handleChange}
                                  ></input>
                                </div>
                              </div>
                              <div class="mf-4">
                                <label>Date of Pregnancy(LMP)</label>
                                <div class="textBoxValidate">
                                  <input
                                    style={{
                                      width: "215px",
                                      marginLeft: "0px"
                                    }}
                                    className="myInput"
                                    type="date"
                                    name="dateOfPregnancy"
                                    id="dateOfPregnancy"
                                    value={dateOfPregnancy}
                                    onChange={this.handleChange}
                                  ></input>
                                </div>
                              </div>
                            </div>
                            <div class="row-form">
                              <div class="mf-4">
                                <label>Admission Date</label>
                                <div class="textBoxValidate">
                                  <input
                                    style={{
                                      width: "215px",
                                      marginLeft: "0px"
                                    }}
                                    className="myInput"
                                    type="date"
                                    name="admissionDate"
                                    id="admissionDate"
                                    value={admissionDate}
                                    onChange={this.handleChange}
                                  ></input>
                                </div>
                              </div>
                              <div class="mf-4">
                                <label>Discharge Date</label>
                                <div class="textBoxValidate">
                                  <input
                                    style={{
                                      width: "215px",
                                      marginLeft: "0px"
                                    }}
                                    className="myInput"
                                    type="date"
                                    name="dischargeDate"
                                    id="dischargeDate"
                                    value={dischargeDate}
                                    onChange={this.handleChange}
                                  ></input>
                                </div>
                              </div>
                              <div class="mf-4">
                                <label>Last X-ray Date	</label>
                                <div class="textBoxValidate">
                                  <input
                                    style={{
                                      width: "215px",
                                      marginLeft: "0px"
                                    }}
                                    className="myInput"
                                    type="date"
                                    name="lastXrayDate"
                                    id="lastXrayDate"
                                    value={lastXrayDate}
                                    onChange={this.handleChange}
                                  ></input>
                                </div>
                              </div>
                            </div>
                            <div class="row-form">
                              <div class="mf-4">
                                <label>Last X-ray Type</label>
                                <input type="text" value={this.state.visitModel.lastXrayType} name="lastXrayType" id="lastXrayType"
                                  onChange={this.handleChange}></input>
                              </div>
                              <div class="mf-4">
                                <label>Unable to Work From Date</label>
                                <div class="textBoxValidate">
                                  <input
                                    style={{
                                      width: "215px",
                                      marginLeft: "0px"
                                    }}
                                    className="myInput"
                                    type="date"
                                    name="unableToWorkFromDate"
                                    id="unableToWorkFromDate"
                                    value={unableToWorkFromDate}
                                    onChange={this.handleChange}
                                  ></input>
                                </div>
                              </div>
                              <div class="mf-4">
                                <label>Unable to Work TO Date</label>
                                <div class="textBoxValidate">
                                  <input
                                    style={{
                                      width: "215px",
                                      marginLeft: "0px"
                                    }}
                                    className="myInput"
                                    type="date"
                                    name="unableToWorkToDate"
                                    id="unableToWorkToDate"
                                    value={unableToWorkToDate}
                                    onChange={this.handleChange}
                                  ></input>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab>
                      <Tab>
                        <div style={{ marginTop: "20px" }}>

                          <div class="mainTable fullWidthTable wSpace" style={{ maxWidth: "100%" }}>
                            <div class="row-form">
                              <div class="mf-4">
                                <label>Accident Date</label>
                                <div class="textBoxValidate">
                                  {/* <input type="text" value="" name="" id="" onChange={this.handleChange}></input>
                                  <img class="calendarIcon" src={dob_icon}></img> */}
                                  <input
                                    style={{
                                      width: "215px",
                                      marginLeft: "0px"
                                    }}
                                    className="myInput"
                                    type="date"
                                    name="accidentDate"
                                    id="accidentDate"
                                    value={accidentDate}
                                    onChange={this.handleChange}
                                  ></input>
                                </div>
                              </div>
                              <div class="mf-4">
                                <label>Accident Type</label>
                                <select>
                                  <option></option>
                                </select>
                              </div>
                              <div class="mf-4">
                                <label>Accident State</label>
                                <input type="text" value={this.state.visitModel.accidentState} name="accidentState" id="accidentState"
                                  onChange={this.handleChange}></input>
                              </div>
                            </div>
                            <div class="row-form">
                              <div class="mf-4">
                                <label>CLIA #</label>
                                <input type="text" value={this.state.visitModel.cliaNumber} name="cliaNumber" id="cliaNumber"
                                  onChange={this.handleChange}></input>
                              </div>
                              <div class="mf-4">
                                <label for="outsidelab">Outside lab</label>
                                <div class="textBoxValidate" onClick={this.handleOutsideLabCheck}>
                                  <div class="lblChkBox">
                                    <input type="checkbox" id="outsideLab" name="outsideLab" checked={this.state.visitModel.outsideLab} ></input>
                                    <label for="outsidelab">
                                      <span></span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div class="mf-4">
                                <label>Lab Charges</label>
                                <input type="text" value={this.state.visitModel.labCharges} name="labCharges" id="labCharges" onChange={this.handleChange}></input>
                              </div>
                            </div>
                          </div>

                        </div>

                      </Tab>
                      <Tab>
                        <div style={{ marginTop: "20px" }}>

                          <div class="mainTable fullWidthTable wSpace" style={{ maxWidth: "100%" }}>
                            <div class="row-form">
                              <div class="mf-4">
                                <label>Payer Claim Control #</label>
                                <input type="text" value={this.state.payerClaimControlNum}
                                  name="payerClaimControlNum" id="payerClaimControlNum"
                                  onChange={this.handleChange}></input>
                              </div>
                              <div class="mf-4">
                                <label>Claim Frequency</label>
                                <input type="text" value={this.state.claimFrequencyCode}
                                  name="claimFrequencyCode"
                                  id="claimFrequencyCode"
                                  onChange={this.handleChange}></input>
                              </div>
                              <div class="mf-4">
                                <label>Service Auth. Exeption Code</label>
                                <input type="text" value={this.state.serviceAuthExcpCode}
                                  name="serviceAuthExcpCode"
                                  id="serviceAuthExcpCode"
                                  onChange={this.handleChange}></input>
                              </div>
                            </div>
                            <div class="row-form">
                              <div class="mf-4">
                                <label for="emergency">Emergency</label>
                                <div class="textBoxValidate"  >
                                  <div class="lblChkBox">
                                    <input type="checkbox" id="emergency" name="" checked={this.state.visitModel.emergency} onClick={this.handleEmergencyCheck}></input>
                                    <label for="emergency">
                                      <span></span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div class="mf-4">
                                <label for="epsdtchkbox">EPSDT</label>
                                <div class="textBoxValidate" onClick={this.handleEPSDTCheck}>
                                  <div class="lblChkBox">
                                    <input type="checkbox" id="epsdtchkbox" name="" checked={this.state.visitModel.epsdt}></input>
                                    <label for="epsdtchkbox">
                                      <span></span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div class="mf-4">
                                <label for="familyplan">Family Plan</label>
                                <div class="textBoxValidate" onClick={this.handleFamilyPlanCheck}>
                                  <div class="lblChkBox">
                                    <input type="checkbox" id="familyplan" name="" checked={this.state.visitModel.familyPlan}></input>
                                    <label for="familyplan">
                                      <span></span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="row-form">
                              <div class="mf-12 field_full-12">
                                <label>Claim Notes</label>
                                <textarea name="claimNotes" id="claimNotes" value={this.state.visitModel.claimNotes}
                                  onChange={this.handleChange} cols="30" rows="10"></textarea>
                              </div>
                            </div>

                          </div>

                        </div>

                      </Tab>
                    </Tabs>
                    {/* <ul class="tabs">
                            <li class="tab-link current" data-tab="tab-1" name="1" onClick={(event) =>this.selectTab(event)}>Claim Dates & Authorizations</li>
                            <li class="tab-link" data-tab="tab-2" name="2" onClick={(event) =>this.selectTab(event)}>Accident & Labs</li>
                            <li class="tab-link" data-tab="tab-3" name="3" onClick={(event) =>this.selectTab(event)}>Other</li>
                        </ul> */}
                    <div>
                      {/* <div id="tab-1" class="tab-content ">
                                        <div class="mainTable fullWidthTable wSpace" style={{maxWidth: "100%"}}>     
                                            <div class="row-form">
                                                <div class="mf-4">
                                                    <label>Authorization #</label>
                                                    <input type="text" value="" name="" id=""></input>
                                                </div>
                                                <div class="mf-4">
                                                    &nbsp;
                                                </div>
                                                <div class="mf-4">
                                                    &nbsp;
                                                </div>
                                            </div>
                                            <div class="row-form">
                                                <div class="mf-4">
                                                    <label for="markInactive">Outside Referral</label>
                                                    <div class="textBoxValidate">
                                                        <div class="lblChkBox">
                                                            <input type="checkbox" id="markInactive" name=""></input>
                                                            <label for="markInactive">
                                                                <span></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mf-4">
                                                    <label>Referral#</label>
                                                    <input type="text" value="" name="" id=""></input>
                                                </div>
                                                <div class="mf-4">
                                                    <label>Onset Date of Current illness</label>
                                                    <div class="textBoxValidate">
                                                        <input type="text" value="" name="" id=""></input>
                                                        <img class="calendarIcon" src={dob_icon}></img>
                                                    </div>	
                                                </div>
                                            </div>
                                            <div class="row-form">
                                                <div class="mf-4">
                                                    <label>First date of similar illness</label>
                                                    <div class="textBoxValidate">
                                                        <input type="text" value="" name="" id=""></input>
                                                        <img class="calendarIcon" src={dob_icon}></img>
                                                    </div>
                                                </div>
                                                <div class="mf-4">
                                                    <label>Initial Treatment date	</label>
                                                    <div class="textBoxValidate">
                                                        <input type="text" value="" name="" id=""></input>
                                                        <img class="calendarIcon" src={dob_icon}></img>
                                                    </div>
                                                </div>
                                                <div class="mf-4">
                                                    <label>Date of Pregnancy(LMP)</label>
                                                    <div class="textBoxValidate">
                                                        <input type="text" value="" name="" id=""></input>
                                                        <img class="calendarIcon" src={dob_icon}></img>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row-form">
                                                <div class="mf-4">
                                                    <label>Admission Date</label>
                                                    <div class="textBoxValidate">
                                                        <input type="text" value="" name="" id=""></input>
                                                        <img class="calendarIcon" src={dob_icon}></img>
                                                    </div>
                                                </div>
                                                <div class="mf-4">
                                                    <label>Discharge Date</label>
                                                    <div class="textBoxValidate">
                                                        <input type="text" value="" name="" id=""></input>
                                                        <img class="calendarIcon" src={dob_icon}></img>
                                                    </div>
                                                </div>
                                                <div class="mf-4">
                                                    <label>Last X-ray Date	</label>
                                                    <div class="textBoxValidate">
                                                        <input type="text" value="" name="" id=""></input>
                                                        <img class="calendarIcon" src={dob_icon}></img>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row-form">
                                                <div class="mf-4">
                                                    <label>Last X-ray Type</label>
                                                    <input type="text" value="" name="" id=""></input>
                                                </div>
                                                <div class="mf-4">
                                                    <label>Unable to Work From Date</label>
                                                    <div class="textBoxValidate">
                                                        <input type="text" value="" name="" id=""></input>
                                                        <img class="calendarIcon" src={dob_icon}></img>
                                                    </div>
                                                </div>
                                                <div class="mf-4">
                                                    <label>Unable to Work TO Date</label>
                                                    <div class="textBoxValidate">
                                                        <input type="text" value="" name="" id=""></input>
                                                        <img class="calendarIcon" src={dob_icon}></img>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                 </div>
                             
                        <div id="tab-2" class="tab-content">

<div class="mainTable fullWidthTable wSpace" style={{maxWidth:"100%"}}>     
    <div class="row-form">
        <div class="mf-4">
            <label>Accident Date</label>
            <div class="textBoxValidate">
                <input type="text" value="" name="" id=""></input>
                <img class="calendarIcon" src="images/dob-icon.png"></img>
            </div>
        </div>
        <div class="mf-4">
            <label>Accident Type</label>
            <select>
                <option></option>
            </select>
        </div>
        <div class="mf-4">
            <label>Accident State</label>
            <input type="text" value="" name="" id=""></input>
        </div>
    </div>
    <div class="row-form">
        <div class="mf-4">
            <label>CLIA #</label>
            <input type="text" value="" name="" id=""></input>
        </div>
        <div class="mf-4">
            <label for="outsidelab">Outside lab</label>
            <div class="textBoxValidate">
                <div class="lblChkBox">
                    <input type="checkbox" id="outsidelab" name=""></input>
                    <label for="outsidelab">
                        <span></span>
                    </label>
                </div>
            </div>
        </div>
        <div class="mf-4">
            <label>Lab Charges</label>
            <input type="text" value="" name="" id=""></input>
        </div>
    </div>
</div>

</div>
                        
                        <div id="tab-3" class="tab-content">
                            
                            <div class="mainTable fullWidthTable wSpace" style={{maxWidth:"100%"}}>     
                                <div class="row-form">
                                    <div class="mf-4">
                                        <label>Payer Claim Control #</label>
                                        <input type="text" value="" name="" id=""></input>
                                    </div>
                                    <div class="mf-4">
                                        <label>Claim Frequency</label>
                                        <input type="text" value="" name="" id=""></input>
                                    </div>
                                    <div class="mf-4">
                                        <label>Service Auth. Exeption Code</label>
                                        <input type="text" value="" name="" id=""></input>
                                    </div>
                                </div>
                                <div class="row-form">
                                    <div class="mf-4">
                                        <label for="emergency">Emergency</label>
                                        <div class="textBoxValidate">
                                            <div class="lblChkBox">
                                                <input type="checkbox" id="emergency" name=""></input>
                                                <label for="emergency">
                                                    <span></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mf-4">
                                        <label for="epsdtchkbox">EPSDT</label>
                                        <div class="textBoxValidate">
                                            <div class="lblChkBox">
                                                <input type="checkbox" id="epsdtchkbox" name=""></input>
                                                <label for="epsdtchkbox">
                                                    <span></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mf-4">
                                        <label for="familyplan">Family Plan</label>
                                        <div class="textBoxValidate">
                                            <div class="lblChkBox">
                                                <input type="checkbox" id="familyplan" name=""></input>
                                                <label for="familyplan">
                                                    <span></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row-form">
                                    <div class="mf-12 field_full-12">
                                        <label>Claim Notes</label>
                                        <textarea name="" id="" cols="30" rows="10"></textarea>
                                    </div>
                                </div>

                            </div>

                    </div>
                    </div> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <div className="mainTable">
                  <div className="row-form row-btn">
                    <div className="mf-12">
                      <button className="btn-blue" onClick={this.saveCharge}>Save </button>
                      <button id='btnCancel' className="btn-grey" data-dismiss="modal"
                        onClick={this.closeNewCharge.bind(this)}
                      >Cancel </button>
                    </div>
                  </div>
                </div>
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
    selectedTabPage: state.selectedTabPage
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    { selectTabPageAction: selectTabPageAction, selectTabAction: selectTabAction },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(NewCharge);

