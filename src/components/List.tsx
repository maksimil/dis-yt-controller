import React from "react";
import Input from "./Input";
import QueueElement from "./QueueElement";

const List: React.FC<{
  queue: qentry[];
  add: (url: string) => void;
  remove: (id: string) => void;
}> = ({ queue, add, remove }) => {
  return (
    <table>
      <thead>
        <Input add={add} />
      </thead>
      <tbody>
        {queue.reverse().map(({ id, info, url }) => (
          <QueueElement
            key={id}
            info={info}
            url={url}
            remove={() => remove(id)}
          />
        ))}
      </tbody>
    </table>
  );
};

export default List;
