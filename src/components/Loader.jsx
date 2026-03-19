const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="h-screen flex items-center justify-center bg-[#FAF8F5]">
      
      <div className="flex flex-col items-center gap-5">

        <div className="w-16 h-16 border-4 border-gray-300 border-t-[#2F6B4F] border-r-[#2F6B4F] rounded-full animate-spin"></div>

        <p className="text-gray-700 font-medium tracking-wide">
          {text}
        </p>

      </div>

    </div>
  );
};

export default Loader;