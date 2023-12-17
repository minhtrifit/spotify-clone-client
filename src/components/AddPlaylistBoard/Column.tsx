import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { ColumnType } from "../../types/playlist";

import Card from "./Card";

interface PropType {
  column: ColumnType;
  audios: any[]; // AudioColumnType[]
  handleRemoveAudioFromPlaylist: (id: number) => void;
}

const Column = (props: PropType) => {
  const { column, audios, handleRemoveAudioFromPlaylist } = props;

  const id = column.id;

  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="min-w-[350px] max-w-[350px] p-4 border border-solid border-main-green rounded-md mb-5">
      <p className="text-center font-bold text-xl">{column.name}</p>

      <SortableContext
        id={id}
        items={audios}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="mt-5 flex flex-col gap-5 min-h-[500px] max-h-[500px] overflow-y-auto"
        >
          {audios.map((audio) => {
            return (
              <Card
                key={audio.id}
                audio={audio}
                handleRemoveAudioFromPlaylist={handleRemoveAudioFromPlaylist}
              />
            );
          })}
        </div>
      </SortableContext>
    </div>
  );
};

export default Column;
