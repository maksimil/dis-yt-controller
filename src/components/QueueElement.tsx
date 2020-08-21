import React from "react";

const QueueElement: React.FC<{ title: string; remove: () => void }> = ({
  title,
  remove,
}) => (
  <tr>
    <td className="text">{title}</td>
    <td>
      <button className="list" onClick={remove}>
        remove
      </button>
    </td>
  </tr>
);

export default QueueElement;
