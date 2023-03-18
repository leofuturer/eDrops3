import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react';
import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router-dom';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

function UserMenu({ username, onSignout }: { username: string, onSignout: () => void }) {

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => <>
        <div>
          <Menu.Button className="hidden md:inline-flex justify-center items-center space-x-2 w-full pl-4 pr-2 py-2 text-base font-medium text-black bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <p>{username}</p>{open ? <ChevronUpIcon className="w-5 h-5" aria-hidden="true" /> : <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />}
          </Menu.Button>
          <Menu.Button className="md:hidden flex justify-center items-center">
            <i className="fa fa-user w-5" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-56 mt-2 p-1 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-black">
              <Menu.Item>
                {({ active }) => (
                  <NavLink to="/manage/profile">
                    <div className={`flex space-x-2 items-center py-1 px-2 rounded-md ${active ? 'bg-primary_light text-white' : ''}`}>
                      <i className="fa fa-dashboard w-5" />
                      <p>Your Dashboard</p>
                    </div>
                  </NavLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <NavLink to="/upload">
                    <div className={`flex space-x-2 items-center py-1 px-2 rounded-md ${active ? 'bg-primary_light text-white' : ''}`}>
                      <i className="fa fa-upload w-5" />
                      <p>Upload a file</p>
                    </div>
                  </NavLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <NavLink to="/manage/files">
                    <div className={`flex space-x-2 items-center py-1 px-2 rounded-md ${active ? 'bg-primary_light text-white' : ''}`}>
                      <i className="fa fa-database w-5" />
                      <p>Your Files</p>
                    </div>
                  </NavLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <NavLink to="/home" onClick={onSignout}>
                    <div className={`flex space-x-2 items-center py-1 px-2 rounded-md ${active ? 'bg-primary_light text-white' : ''}`}>
                      <i className="fa fa-sign-out w-5" />
                      <p>Sign out</p>
                    </div>
                  </NavLink>
                )}
              </Menu.Item>
          </Menu.Items>
        </Transition>
      </>}
    </Menu>
  )
}

export default UserMenu