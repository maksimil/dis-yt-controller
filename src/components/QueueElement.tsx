import React from "react";

const QueueElement: React.FC<{ url: string; remove: () => void }> = ({
  url,
  remove,
}) => (
  <tr>
    <td>{url}</td>
    <td>
      <button onClick={remove}>remove</button>
    </td>
  </tr>
);

export default QueueElement;
