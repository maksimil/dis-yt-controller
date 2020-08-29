import React from "react";

const StatusBar: React.FC<{ channel?: string; volume?: number }> = ({
  channel,
  volume,
}) => {
  return (
    <table className="status">
      <tbody>
        <tr>
          <td className="text">channel:</td>
          <td>{channel || "none"}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default StatusBar;
