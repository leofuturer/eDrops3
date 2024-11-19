import { ArrowPathIcon } from '@heroicons/react/24/outline';

function Loading() {
  return (
    <div className="flex justify-center animate-spin items-center mx-auto">
      <ArrowPathIcon />
    </div>
  );
}

export default Loading;
