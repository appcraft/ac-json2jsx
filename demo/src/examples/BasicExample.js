import React from "react";
import Editor from "../Editor";

const BasicExample = ({ components }) => {
  return (
    <div style={{ maxWidth: 1200, margin: "24px auto", position: "relative" }}>
      <h2>Basic example</h2>
      <div>Simple Hello world</div>
      <Editor
        defaultCode={`<div>Hello world</div>`}
        components={components}
        renderProps={{}}
      />
    </div>
  );
};
export default BasicExample;
