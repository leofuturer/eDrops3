import { PencilIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { api, DTO, User } from '@edroplets/api';

function ProfileEdit({ user }: { user: DTO<User> }) {
  return (
    <>
      {/* {user?.image ? (
				<img
					src={user.image}
					alt="profile"
					className="w-32 h-32 rounded-full"
				/>
			) : ( */}
      <div className="relative">
        <UserCircleIcon className="w-32 h-32 text-slate-400" />
        <div className="absolute top-4 right-4 h-6 w-6 flex justify-center items-center bg-slate-800 rounded-full">
          <PencilIcon className="w-4 h-4 text-slate-200" />
        </div>
      </div>
      {/* )} */}
      <h1 className="text-lg">{user?.username}</h1>
      <h2 className="text-md opacity-50">{user?.email}</h2>
      {/* <p className="">{user?.description}</p> */}
    </>
  );
}

export default ProfileEdit;
