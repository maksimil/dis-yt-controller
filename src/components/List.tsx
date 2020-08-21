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
        {queue.reverse().map((e) => (
          <QueueElement
            key={e.id}
            title={e.info.title}
            remove={() => remove(e.id)}
          />
        ))}
      </tbody>
    </table>
  );
};

export default List;
