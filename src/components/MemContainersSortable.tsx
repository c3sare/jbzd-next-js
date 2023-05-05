import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BiMove } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";
import style from "@/styles/addpost.module.css";

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (draggableStyle: any) => ({
  userSelect: "none",
  ...draggableStyle,
});

const DragHandle = ({ dragHandleProps }: any) => (
  <button
    type="button"
    className={style.moveButton}
    {...{ ...dragHandleProps }}
  >
    <BiMove />
  </button>
);

function SortableItem({
  types,
  item,
  memContainers,
  i,
  setValue,
  removeMemContainer,
  dragHandleProps,
}: any) {
  return (
    <div className={style.memElement} key={item.id}>
      {React.createElement(types[item.type], {
        data: memContainers[i].data,
        setData: (data: string | File | null, index: number) => {
          setValue(`memContainers.${index}.data`, data);
        },
        index: i,
      })}
      <button
        onClick={(e) => {
          e.preventDefault();
          removeMemContainer(i);
        }}
      >
        <FaTrashAlt /> Usuń element
      </button>
      <DragHandle dragHandleProps={dragHandleProps} />
    </div>
  );
}

const MemContainersSortable = ({
  memContainers,
  fieldsMemContainers,
  types,
  setValue,
  removeMemContainer,
}: any) => {
  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      memContainers,
      result.source.index,
      result.destination.index
    );

    setValue("memContainers", items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(droppableProvided) => (
          <div ref={droppableProvided.innerRef}>
            {fieldsMemContainers.map((item: any, i: number) => (
              <Draggable key={item.id} draggableId={item.id} index={i}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    style={getItemStyle(draggableProvided.draggableProps.style)}
                  >
                    <SortableItem
                      types={types}
                      item={item}
                      memContainers={memContainers}
                      i={i}
                      setValue={setValue}
                      removeMemContainer={removeMemContainer}
                      dragHandleProps={draggableProvided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MemContainersSortable;
