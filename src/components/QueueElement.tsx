import React from "react";

const QueueElement: React.FC<{ url: string; remove: () => void }> = ({
  url,
  remove,
}) => (
  <tr>
    <td className="text">{url}</td>
    <td>
      <button className="list" onClick={remove}>
        remove
      </button>
    </td>
  </tr>
);

export default QueueElement;
