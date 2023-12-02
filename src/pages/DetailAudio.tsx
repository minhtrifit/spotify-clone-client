import { useParams } from "react-router-dom";

const DetailAudio = () => {
  const params = useParams();
  const { id } = params;

  return <div>DetailAudio: {id}</div>;
};

export default DetailAudio;
