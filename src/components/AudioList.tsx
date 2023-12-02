interface PropType {
  title: string;
}

const AudioList = (props: PropType) => {
  const { title } = props;

  return (
    <div>
      <p className="text-xl font-bold">{title}</p>
    </div>
  );
};

export default AudioList;
