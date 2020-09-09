import React, {Component} from 'react';
// import { EditorState, convertToRaw } from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


export default class RichTextEditor extends Component {
  state = {
    // editorState: EditorState.createEmpty(),
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
  uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/manage/img/upload');
      const data = new FormData();
      data.append('image', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        const url = response.data.data.url;
        resolve(url)
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error)
      })
    })
  };

  render() {
    const {editorState} = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{border: "1px solid black", minHeight: 200, paddingLeft: 10}}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{img: {uploadCallback: this.uploadImageCallBack, alt: {present: true, mandatory: true}}}}
        />
      </div>
    );
  }
}