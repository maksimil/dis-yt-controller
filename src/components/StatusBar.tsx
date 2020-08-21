import React from "react";

const StatusBar: React.FC<{ channel?: string; volume?: number }> = ({
  channel,
  volume,
}) => {
  return (
    <table className="status">
      <tbody>
        <tr>
          <td>channel:</td>
          <td>{channel || "none"}</td>
        </tr>
        <tr>
          <td>volume:</td>
          <td>{volume || "not playing"}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default StatusBar;
