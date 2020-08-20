import React from "react";

const ControlPanel: React.FC<{
  pause: () => void;
  skip: () => void;
  pstatus: "play" | "paused" | "notplaying";
}> = ({ pause, pstatus, skip }) => {
  let rbms = "not playing";
  if (pstatus === "paused") {
    rbms = "resume";
  }
  if (pstatus === "play") {
    rbms = "pause";
  }
  return (
    <div className="ccontainer">
      <div className="cpanel">
        <button
          className="cpanel"
          onClick={pstatus !== "notplaying" ? pause : () => {}}
        >
          {rbms}
        </button>
      </div>
      <div className="cpanel">
        <button className="cpanel" onClick={skip}>
          skip
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
