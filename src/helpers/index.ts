const formatDuration = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const fetchAudioDuration = (url: string) => {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(url);

      audio.addEventListener("loadedmetadata", () => {
        const audioDuration = audio.duration;
        const formattedDuration = formatDuration(audioDuration);

        resolve(formattedDuration);
      });
    } catch (error) {
      reject(error);
    }
  });
};
