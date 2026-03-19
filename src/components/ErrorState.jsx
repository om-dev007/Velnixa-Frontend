const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="h-screen flex items-center justify-center bg-[#FAF8F5]">
      
      <div className="text-center space-y-4">

        <p className="text-lg font-semibold text-red-500">
          {message}
        </p>

        <button
          onClick={onRetry}
          className="px-5 py-2 cursor-pointer bg-[#2F6B4F] text-white rounded-lg hover:bg-[#24563F] transition"
        >
          Retry
        </button>

      </div>

    </div>
  );
};

export default ErrorState;