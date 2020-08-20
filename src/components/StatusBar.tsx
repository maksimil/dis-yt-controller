import React from "react";

const StatusBar: React.FC<{ channel?: string }> = ({ channel }) => {
  return (
    <table className="status">
      <tbody>
        <tr>
          <td>channel:</td>
          <td>{channel || "none"}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default StatusBar;
