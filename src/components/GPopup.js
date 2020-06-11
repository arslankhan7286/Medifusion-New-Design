import React, { Component, Fragment } from "react";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import taxonomyIcon from "../images/code-search-icon.png";
import axios from "axios";
import Input from "./Input";
import Swal from "sweetalert2";
import NewPatient from "./NewPatient";
import PatientSearch from "./Patient";
import NewVisit from "./NewCharge";
import PatientPlan from "./PatientPlan";
import BatchDocument from "./BatchDocument";
import PlanFollowup from "./CreateFollowup";
import ChargeSearch from "./ChargeSearch";
import ManualPosting from "./ManualPosting";

class GPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editId: this.props.id,
      popupName: this.props.popupName,
      maxHeight: "786",
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

  componentDidMount() {
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
  }

  componentWillReceiveProps() {
    console.log("Component ill receive props : ");
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
  }

  render() {
    let popup = null;
    if (this.props.popupName == "patient") {
      console.log("Patient Popup");
      popup = (
        <NewPatient
          popupPatientId={this.props.id}
          onClose={this.props.onClose}
        ></NewPatient>
      );
    } else if (this.props.popupName == "patientSearch") {
      popup = (
        <PatientSearch
          getPatientID={this.props.getPatientID}
          onClick={() => this.props.onClose()}
        ></PatientSearch>
      );
    } else if (this.props.popupName == "visit") {
      popup = (
        <NewVisit
          popupVisitId={this.props.id}
          onClose={() => this.props.onClose()}
        ></NewVisit>
      );
    } else if (this.props.popupName == "chargeSearch") {
      popup = (
        <ChargeSearch
          popupVisitId={this.props.id}
          getVisitID={this.props.getVisitID}
          onClose={() => this.props.onClose()}
        ></ChargeSearch>
      );
    } else if (this.props.popupName == "batch") {
      popup = (
        <NewVisit
          popupVisitId={this.props.id}
          onClose={() => this.props.onClose()}
        ></NewVisit>
      );
    } else if (this.props.popupName == "patientplan") {
      popup = (
        <PatientPlan
          patientID={this.props.id}
          calledFrom="Other"
          onClose={() => this.props.onClose()}
          planID={this.props.planID}
        ></PatientPlan>
      );
    } else if (this.props.popupName == "batchNo") {
      popup = (
        <BatchDocument
          onClose={() => this.props.onClose()}
          getbatchID={this.props.getbatchID}
          batchPopupID={this.props.batchPopupID}
        ></BatchDocument>
      );
    } else if (this.props.popupName == "followup") {
      popup = (
        <PlanFollowup
          id={this.props.id}
          onClose={() => this.props.onClose()}
        ></PlanFollowup>
      );
    } else if (this.props.popupName == "manualPosting") {
      popup = (
        <ManualPosting
          visitID={this.props.visitID}
          onClose={() => this.props.onClose()}
        ></ManualPosting>
      );
    } else {
      popup = null;
    }

    if(popup !== null){
      document.body.style.overflow = 'hidden';
    }else{
      document.body.style.overflow = 'visible';
    }

    return (
      <React.Fragment>
        <div
          class="modal fade show popupBackScreen"
          id="myModal1"
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
              style={{ minHeight: "200px", maxHeight: "700px" }}
            >
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 ">
                    <div class="header pt-1">
                      <div class="float-lg-right text-right">
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
                  

                  {/* ======================== */}
                  {popup}   
                  </div>
                </div>              
              </div>
                       
            </div>
          </div>
        </div>
     
      </React.Fragment>
    );
  }
}

export default GPopup;
