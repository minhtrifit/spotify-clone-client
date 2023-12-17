import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { AudioColumnType } from "../../types/playlist";

import { FaRegTrashAlt } from "react-icons/fa";

interface PropType {
  audio: AudioColumnType;
  handleRemoveAudioFromPlaylist: (id: number) => void;
}

const Card = (props: PropType) => {
  const { audio, handleRemoveAudioFromPlaylist } = props;

  const id: any = audio.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      className="bg-[#2a2a2a] p-4 rounded-md flex items-center justify-between gap-5 hover:cursor-grab"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex gap-3">
        <img className="w-[60px]" src={audio.avatar} alt="avatar" />
        <div className="flex flex-col gap-3">
          <p>{audio.name}</p>
          <p className="text-sm text-zinc-500">
            {audio.artists && audio.artists[0].name}
          </p>
        </div>
      </div>
      <div>
        {audio.columnId === "playlist" && (
          <button
            className="bg-red-500 p-2 rounded-md hover:cursor-pointer"
            onClick={() => {
              if (audio.id) handleRemoveAudioFromPlaylist(audio.id);
            }}
          >
            <FaRegTrashAlt size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
