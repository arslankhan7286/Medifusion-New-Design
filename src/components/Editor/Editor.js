import React, { Component } from "react";
import axios from "axios";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactHtmlParser from "react-html-parser";
import Swal from "sweetalert2";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loginAction } from "../../actions/LoginAction";

class Editor extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/PatientNotes/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };
    this.state = {
      value: this.props.patientData,
      showEditor: false,
      addText: true,
      status: this.props.status,
    };
  }
  handleChange = (e, editor) => {
    const data = editor.getData();
    console.log("STATE Data; ", this.state.value);
    this.setState({
      value: data,
    });
  };

  postHandler = (e) => {
    console.log("Sending Data", this.state.value);
    var saveModel = this.props.patientData;
    console.log("SAVE MODEL before........", saveModel);
    if (saveModel == null || saveModel == "" || saveModel.id <= 0) {
      // new
      saveModel = {
        ID: 0,
        PatientNotesId: this.props.patientNotesID,
        note: "",
        note_html: "",
        Inactive: "false",
        AddedBy: "",
        AddedDate: "",
        UpdatedBy: "",
        UpdatedDate: "",
      };
    }
    saveModel.note_html = this.state.value;
    console.log("SAVE MODEL........", saveModel);
    axios
      .post(this.url + "SavePatientMedicalNotes", saveModel, this.config)
      .then((response) => {
        if (response.data.id > 0) {
          Swal.fire("Record Saved Successfully", "", "success").then(
            (result) => {
              if (result.value) {
                this.setState({
                  showEditor: false,
                });
              }
            }
          );
        }
        console.log("Return Data", response.data);
      })
      .catch((error) => error);
  };
  editorHandler = () => {
    if (this.state.status) {
      this.setState({ showEditor: false });
    } else {
      this.setState({ showEditor: true });
    }
  };
  cancelHandler = () => {
    this.setState({ showEditor: false });
  };
  render() {
    const html = this.props.patientData.note_html;
    return (
      <div className="editor">
        <h3 className="widget-heading mb-2">
          Medical Notes
          <i
            class="fas fa-edit text-white ml-3"
            onClick={this.editorHandler}
          ></i>
        </h3>
        {this.state.showEditor ? (
          <div className="text-center editor-form">
            <CKEditor
              editor={ClassicEditor}
              onChange={this.handleChange}
              data={html}
            ></CKEditor>
            {/* <input
              type="button"
              className="mt-2 btn-blue"
              onClick={this.postHandler}
              name="note"
              value="Save"
            /> */}
            <input
              type="button"
              className="btn-blue mb-0 mt-4"
              value="Save"
              onClick={this.postHandler}
              style={{ height: "33px", padding: "5px 29px" }}
            />
            <input
              type="button"
              className="btn-grey mb-0 mt-4"
              value="Cancel"
              onClick={this.cancelHandler}
              style={{ height: "33px", padding: "5px 29px" }}
            />
          </div>
        ) : (
          <div
            className="p-5 "
            style={{ margin: "20px 0px" }}
            className="savedNotes"
          >
            {html ? ReactHtmlParser(html) : "No Medical Notes Found !"}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
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

export default connect(mapStateToProps, matchDispatchToProps)(Editor);
