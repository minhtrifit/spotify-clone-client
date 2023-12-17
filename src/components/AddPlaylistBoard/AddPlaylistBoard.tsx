import { useEffect, useState } from "react";
import {
  DragStartEvent,
  DragOverEvent,
  // DragEndEvent,
  DropAnimation,
  defaultDropAnimation,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DndContext,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import { getAllAudiosColumn } from "../../redux/reducers/media.reducer";

import SearchBar from "../SearchBar";

import { Audio as AudioType } from "../../types/media";
import { AudioColumnType, ColumnType } from "../../types/playlist";

import { columnsData } from "../../utils";

import Column from "./Column";
import Card from "./Card";

const AddPlaylistBoard = () => {
  const dispatchAsync = useAppDispatch();

  const columns: ColumnType[] = columnsData;

  const [audios, setAudios] = useState<AudioColumnType[]>([]);
  const [activeAudio, setActiveAudio] = useState<AudioColumnType | null>(null);

  const [search, setSearch] = useState<string>("");
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false);
  const [searchAudios, setSearchAudios] = useState<AudioType[] | undefined>([]);
  const [sourceAudio, setSourceAudio] = useState<AudioColumnType[]>([]);

  const isLoading = useSelector<RootState, boolean>(
    (state) => state.media.isLoading
  );

  const audiosColumn = useSelector<RootState, AudioColumnType[]>(
    (state) => state.media.audiosColumn
  );

  useEffect(() => {
    dispatchAsync(getAllAudiosColumn(columns[0].id));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkExistAudio = (
    source: AudioColumnType[],
    audio: AudioColumnType
  ) => {
    for (let i = 0; i < source.length; ++i) {
      if (source[i].id === audio.id) {
        return true;
      }
    }

    return false;
  };

  //==================== Search event handling
  useEffect(() => {
    if (searchAudios !== undefined && searchAudios?.length !== 0) {
      const source: AudioColumnType[] = searchAudios?.map((audio) => {
        return { ...audio, columnId: "source" };
      });

      const searchResult = audios.filter((audio) => {
        if (audio.columnId === "source" && checkExistAudio(source, audio))
          return audio;
      });

      const result = audios.filter((audio) => {
        if (audio.columnId === "playlist") return audio;

        if (audio.columnId === "source" && checkExistAudio(searchResult, audio))
          return audio;
      });

      setAudios(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchAudios]);

  useEffect(() => {
    if (search === "") {
      const inPlaylistAudios = audios.filter((audio) => {
        return audio.columnId === "playlist";
      });

      const inSourceAudios = sourceAudio.filter((audio) => {
        if (!checkExistAudio(inPlaylistAudios, audio)) return audio;
      });

      const result = inSourceAudios.concat(inPlaylistAudios);

      setAudios(result);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSearch]);

  //==================== Get audios API
  useEffect(() => {
    if (audiosColumn.length !== 0) {
      setAudios(audiosColumn);
      setSourceAudio(audiosColumn);
    }
  }, [audiosColumn]);

  //==================== DnD event handling
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveAudio(audios.filter((audio) => audio.id === active.id)[0]);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeColumnId = active.data.current?.sortable.containerId;
    const activeColumn = columns.filter((col) => col.id === activeColumnId)[0];

    let overColumnId: any = "";
    if (over?.data?.current?.sortable.containerId !== undefined) {
      overColumnId = over?.data?.current?.sortable.containerId;
    } else overColumnId = over.id;

    const overColumn = columns.filter((col) => col.id === overColumnId)[0];

    const overAudioId = over.id;
    const overAudio = audios.filter((audio) => audio.id === overAudioId)[0];

    if (!activeAudio || !activeColumn) return;

    // Drop audio over audio
    if (activeAudio && overAudio && activeAudio !== overAudio) {
      const activeIndex = audios.findIndex((a) => a.id === activeAudio?.id);
      const overIndex = audios.findIndex((a) => a.id === overAudio?.id);

      setAudios(arrayMove(audios, activeIndex, overIndex));
    }

    // Drop audio over column
    if (
      activeAudio &&
      activeColumn &&
      overColumn &&
      activeColumn.id !== overColumn.id
    ) {
      const newAudios = audios.map((audio) => {
        if (audio.id === activeAudio.id) {
          const clone = { ...audio };
          clone.columnId = overColumn.id;
          return clone;
        }
        return audio;
      });

      setAudios(newAudios);
    }
  };

  const handleDragEnd = () => {
    // { active, over }: DragEndEvent
    setActiveAudio(null);
  };

  const audio = activeAudio ? activeAudio : null;

  const handleRemoveAudioFromPlaylist = (id: number) => {
    const newAudios = audios.map((audio) => {
      if (audio.id === id) {
        const clone = { ...audio };
        clone.columnId = "source";
        return clone;
      }
      return audio;
    });

    setAudios(newAudios);
  };

  return (
    <div className="px-6 mt-20">
      <SearchBar
        search={search}
        setSearch={setSearch}
        setTriggerSearch={setTriggerSearch}
        setSearchAudios={setSearchAudios}
      />

      {isLoading ? (
        <div className="flex justify-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-10 xl:justify-center overflow-x-auto">
            {columns?.map((col) => {
              return (
                <Column
                  key={col.id}
                  column={col}
                  audios={audios.filter((audio) => audio.columnId === col.id)}
                  handleRemoveAudioFromPlaylist={handleRemoveAudioFromPlaylist}
                />
              );
            })}
            <DragOverlay dropAnimation={dropAnimation}>
              {audio ? (
                <Card
                  audio={audio}
                  handleRemoveAudioFromPlaylist={handleRemoveAudioFromPlaylist}
                />
              ) : null}
            </DragOverlay>
          </div>
        </DndContext>
      )}
    </div>
  );
};

export default AddPlaylistBoard;
