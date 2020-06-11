import React, { Component } from "react";
import ReactDOM from "react-dom";

import { MDBDataTable } from "mdbreact";
import GridHeading from "./GridHeading";
import { saveAs } from "file-saver";
import viewHCFAFile from "./viewHCFAFile.js";
import axios from "axios";
import $ from "jquery";


import Viewer, { Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import { defaultLayout } from '@phuocng/react-pdf-viewer';

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";




const renderToolbar = (toolbarSlot: ToolbarSlot): React.ReactElement => {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        width: '100%',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <div style={{ padding: '0 5px' }}>
          {toolbarSlot.searchPopover}
        </div>
        <div style={{ padding: '0 5px' }}>
          {toolbarSlot.previousPageButton}
        </div>
        <div style={{ padding: '0 5px' }}>
          {toolbarSlot.currentPageInput} / {toolbarSlot.numPages}
        </div>
        <div style={{ padding: '0 5px' }}>
          {toolbarSlot.nextPageButton}
        </div>
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          flexShrink: 1,
          justifyContent: 'center',
        }}
      >
        <div style={{ padding: '0 5px' }}>
          {toolbarSlot.zoomOutButton}
        </div>
        <div style={{ padding: '0 5px' }}>
          {toolbarSlot.zoomPopover}
        </div>
        <div style={{ padding: '0 5px' }}>
          {toolbarSlot.zoomInButton}
        </div>
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          marginLeft: 'auto',
        }}
      >
        <div style={{ padding: '0 5px' }}>
          {toolbarSlot.fullScreenButton}
        </div>
        <div style={{ padding: '0 5px' }}>
          {toolbarSlot.openFileButton}
        </div>
        <div style={{ padding: '0 5px', display: 'none' }}>
          {toolbarSlot.downloadButton}
        </div>
        <div style={{ padding: '0 5px' }}>
          {toolbarSlot.printButton}
        </div>

        <div style={{ padding: '0 5px' }}>
          {toolbarSlot.moreActionsPopover}
        </div>
      </div>
    </div>
  );
};

const layout = (
  isSidebarOpened: boolean,
  container: Slot,
  main: Slot,
  toolbar: RenderToolbar,
  sidebar: Slot,
): React.ReactElement => {
  return defaultLayout(
    isSidebarOpened,
    container,
    main,
    toolbar(renderToolbar),
    sidebar,
  );
};

export class HCFA1500 extends Component {
  pdfExportComponent;

  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/PaperSubmission/ViewHcfaFile";
    this.file =
      "https://www.plasticsurgery.org/documents/Health-Policy/Coding-Payment/ICD-10/ICD-10-Medical-Diagnosis-Codes.pdf";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.state = {
      ids: [],
      fileUpload: "",
      numPages: null,
      pageNumber: 1
    };
  }
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  async componentWillMount() {
    var newUrl = ""
    await axios
      .post(this.url, { ids: [this.props.id] }, this.config)
      .then(response => {
        newUrl = (response.data).replace(/\\/g, '/');
        console.log(newUrl);
        this.setState({ fileUpload: newUrl })
      }).catch(error => {
        console.log(error);

      });

  }
  render() {
    var strURL = this.state.fileUpload.toString();
    return (
      <React.Fragment>
            {/* // <!-- /.container-fluid Starts--> */}
            <div
          class="container-fluid"
          style={{ paddingLeft: "0px", paddingRight: "0px" }}
        >
          {/* <!-- Page Heading --> */}

          {/* <!-- Container Top Starts Here --> */}
          <div
            class="container-fluid"
            style={{ paddingLeft: "0px", paddingRight: "0px" }}
          >
            {/* <!-- Tab Content Starts --> */}
            <div class="tab-content">
              {/* <!-- Tab Pane Starts Here --> */}
              <div id="home" class="tab-pane">
              {/* <div className="container">
                <div className="row">
                  <div></div>

                {this.state.fileUpload == ""  ? null : 
                (  <iframe
                  style={{ marginLeft: "60px" }}
                  className="pdf"
                  width="900"
                  height="650"
                  frameBorder="5"
                  src={`https://docs.google.com/gview?url=${this.state.fileUpload}&embedded=true`}
                ></iframe>)}
                </div>
              </div> */}
             {strURL === "" ? null : (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.3.200/build/pdf.worker.min.js">
                  <div style={{ height: '750px' }} >
                    <Viewer fileUrl={strURL}
                      layout={layout}
                      initialPage={2}
                    />

                  </div>
                </Worker>
              )

              }
                </div>
              {/* <!-- Tab Pane Ends Here --> */}
            </div>
            {/* <!-- Tab Content Ends --> */}
          </div>
          {/* <!-- Container Top Ends Here --> */}

          {/* <!-- End of Main Content --> */}

          {/* <!-- Footer --> */}
          <footer class="sticky-footer bg-white">
            <div class="container my-auto">
              <div class="copyright text-center my-auto">
                {" "}
                <span>
                  Version 1.0 <br />
                  Copyright &copy; 2020 Bellmedex LLC. All rights reserved.
                </span>{" "}
              </div>
            </div>
          </footer>
          {/* <!-- End of Footer --> */}
        </div>
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
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null }
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

export default connect(mapStateToProps, matchDispatchToProps)(HCFA1500);

