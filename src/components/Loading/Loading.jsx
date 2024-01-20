import React from "react";
import "./Loading.scss"
const Loading = () => {
  return (
    <>
    <div className="loading-container">
      <div className="tree">
        {[0, 1, 2, 3].map((x) => (
          <div className="branch" key={x} style={{ '--x': x }}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} style={{ '--i': i }}></span>
            ))}
          </div>
        ))}
        <div className="stem">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ '--i': i }}></span>
          ))}
        </div>
        <span className="shadow"></span>
      </div>
    </div>
    <p className="loading-txt">LOADING</p>
    </>
  )
}

export default Loading