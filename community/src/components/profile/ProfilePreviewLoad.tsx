import { UserCircleIcon } from '@heroicons/react/24/solid';

function ProfilePreviewLoad() {
  return (
    <div className="flex flex-col mt-20 px-10 animate-pulse">
      <div className="bg-white shadow-2xl rounded-2xl items-center flex flex-col p-4">
        <UserCircleIcon className="w-32 h-32 opacity-50" />
        <div className="flex flex-col space-y-2 items-center w-full">
          <div className="h-2 bg-slate-200 rounded w-full" />
          <div className="h-2 bg-slate-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
}

export default ProfilePreviewLoad;
