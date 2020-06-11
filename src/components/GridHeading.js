import React from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { saveAs } from "file-saver";

//Redux
import { connect } from "react-redux";

class GridHeading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  exportPdf = () => {
    this.setState({ loading: true });
    var fileName = this.props.Heading;
    fileName = fileName.replace("SEARCH RESULT", "");
    if (this.props.length > 0) {
      axios
        .post(this.props.url + this.props.methodNamePdf, this.props.dataObj, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + this.props.loginObject.token,
            Accept: "*/*"
          },
          responseType: "blob"
        })
        .then(function (res) {
          var blob = new Blob([res.data], {
            type: "application/pdf"
          });

          saveAs(blob, fileName + ".pdf");
          this.setState({ loading: false });
        })
        .catch(error => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false });
      Swal.fire("Perform The Search First", "", "error");
    }
  };

  exportExcel = () => {
    this.setState({ loading: true });
    var fileName = this.props.Heading;
    fileName = fileName.replace("SEARCH RESULT", "");
    if (this.props.length > 0) {
      axios
        .post(this.props.url + this.props.methodName, this.props.dataObj, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer  " + this.props.loginObject.token,
            Accept: "*/*"
          },
          responseType: "blob"
        })
        .then(function (res) {
          var blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });

          saveAs(blob, fileName + ".xlsx");
          this.setState({ loading: false });
        })
        .catch(error => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false });
      Swal.fire("Perform The Search First", "", "error");
    }
  };

  render() {
    //Spinner
    let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="lds-spinner" style={{height:"20px"}}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    }

    return (
      <div className="card-header">
        <h6 className=" m-0 font-weight-bold text-primary search-h">
          {this.props.Heading}
          
        {spiner}
        <input
        style={{width:"110px"}}
          type="button"
          name="name"
          id="0"
          className="export-btn-pdf"
          value="Export PDF"
          disabled={this.props.disabled}
          dataObj={this.props.dataObj}
          url={this.props.url}
          length={this.props.length}
          onClick={this.exportPdf}
        />
        <input
         style={{width:"110px"}}
          type="button"
          name="name"
          id="0"
          className="export-btn"
          value="Export Excel"
          disabled={this.props.disabled}
          dataObj={this.props.dataObj}
          url={this.props.url}
          length={this.props.length}
          onClick={this.exportExcel}
        />
    
       {/* {this.props.exportExcel ? (
         
       ):null}

      {this.props.exportPdf ? (
         
      ):null} */}
       </h6>
      </div>
     
    );
  }
}

function mapStateToProps(state) {
  return {
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    rights: state.loginInfo
      ? {
        search: state.loginInfo.rights.electronicsSubmissionSearch,
        add: state.loginInfo.rights.electronicsSubmissionSubmit
      }
      : []
  };
}

export default connect(mapStateToProps, null)(GridHeading);
