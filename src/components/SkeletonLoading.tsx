const SkeletonLoading = () => {
  return (
    <div className="my-10 w-[100%]">
      <h3 className="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></h3>

      <ul className="mt-5 space-y-3">
        <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700"></li>
        <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700"></li>
        <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700"></li>
        <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700"></li>
      </ul>
    </div>
  );
};

export default SkeletonLoading;
