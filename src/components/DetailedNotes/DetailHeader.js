import React, { Component } from "react";
import address from "../../images/adress.png";
import internet from "../../images/internet.png";
import logo from "../../images/h-logo.png";

class DetailHeader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div
          className="header-detail widget-border border-0"
          style={{ overflowY: "hidden" }}
        >
          <div className="row">
            <div className="col-sm-12 align-self-end">
              <div className="uppershape">
                <img src={logo} id="logo" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className="lowershape-right">
                <h6 id="mrno">
                  MR - <b>{this.props.headerInfo.patientNotesId}</b>
                </h6>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="lowershape-left">
                <h5 id="mrno">{this.props.headerInfo.practiceName}</h5>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <br />
              <div id="details">
                <h6 id="detail-text">
                  Patient Name: <b>{this.props.headerInfo.patientName}</b>
                </h6>
              </div>
            </div>
            <div className="col-sm-6">
              <br />
              <div
                id="details"
                style={{ marginLeft: "25%" }}
                className="print-left"
              >
                <h6 id="detail-text">
                  Attending Provider:{" "}
                  <b>{this.props.headerInfo.providerName}</b>
                </h6>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div id="details">
                <h6 id="detail-text">
                  Gender: <b>{this.props.headerInfo.patientGender}</b>
                </h6>
                <div id="details" style={{ marginLeft: "180px" }}>
                  <h6 id="detail-text">
                    Age: <b>{this.props.headerInfo.patientAge}</b>
                  </h6>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div
                id="details"
                style={{ marginLeft: "25%" }}
                className="print-left"
              >
                <h6 id="detail-text">
                  Referring Provider:{" "}
                  <b>{this.props.headerInfo.refProviderName}</b>
                </h6>
              </div>
            </div>
          </div>
          <div className="row"></div>
          <div id="right-details">
            <div className="row" style={{ height: "8px" }}>
              <div className="col-sm-6 "></div>
              <div className="col-sm-6 mt-2 bottom">
                <h5>
                  <img
                    src={internet}
                    style={{
                      marginLeft: "44px",
                      marginRight: "11px",
                      width: "25px",
                      height: "25px",
                    }}
                  />
                  super@bellmedex.com
                </h5>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-sm-6"></div>
              <div className="col-sm-6 mt-2 bottom">
                <h6 className="mt-2">
                  <img
                    src={address}
                    style={{
                      marginLeft: "44px",
                      marginRight: "11px",
                      width: "25px",
                      height: "25px",
                    }}
                  />
                  {this.props.headerInfo.practiceAddress}
                </h6>
              </div>
            </div>
          </div>
          <div className="row" style={{ backgroundColor: "#099a8b" }}>
            <div className="col-sm-7">
              <div className="bottom-style-left"></div>
            </div>
            <div className="col-sm-5">
              <div className="bottom-style-right"></div>
            </div>
          </div>
          <br />
        </div>
      </div>
    );
  }
}
export default DetailHeader;
