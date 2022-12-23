import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
function Project() {
  const [activeTab, setActiveTab] = useState('uploads');
  return (
    <div className="flex flex-row justify-center">
      <div className="w-2/3 flex flex-col space-y-4 py-10">
        <div className="flex flex-row border-b space-x-2 text-lg">
          <p
            className={`${activeTab === 'uploads' ? 'border border-b-white -m-[1px]' : 'text-primary_light hover:bg-gray-200'} rounded-t p-2 cursor-pointer`}
            onClick={() => setActiveTab('uploads')}>
            My Uploads
          </p>
          <p
            className={`${activeTab === 'designer' ? 'border border-b-white -m-[1px]' : 'text-primary_light hover:bg-gray-200'} rounded-t p-2 cursor-pointer`}
            onClick={() => setActiveTab('designer')}>
            My Public Designer
          </p>
          <p
            className={`${activeTab === 'favorites' ? 'border border-b-white -m-[1px]' : 'text-primary_light hover:bg-gray-200'} rounded-t p-2 cursor-pointer`}
            onClick={() => setActiveTab('favorites')}>
            Favorites
          </p>
          <p
            className={`${activeTab === 'ordered' ? 'border border-b-white -m-[1px]' : 'text-primary_light hover:bg-gray-200'} rounded-t p-2 cursor-pointer`}
            onClick={() => setActiveTab('ordered')}>
            Ordered
          </p>
        </div>
        <Tab id="uploads" active={activeTab === 'uploads'} className="grid grid-cols-3 gap-4">
          <NavLink to="" className="flex flex-col items-center">
            <img className="w-full aspect-square scale-95 hover:scale-100 transition-transform" src="/img/IMG_2943.jpg" alt="" />
            <h4 className="text-lg text-primary_light">EWOD Control System</h4>
          </NavLink>
          <NavLink to="" className="flex flex-col items-center">
            <img className="w-full aspect-square scale-95 hover:scale-100 transition-transform" src="/img/IMG_2941.jpg" alt="" />
            <h4 className="text-lg text-primary_light">EWOD Chip v1</h4>
          </NavLink>
          <NavLink to="" className="flex flex-col items-center">
            <img className="w-full aspect-square scale-95 hover:scale-100 transition-transform" src="/img/IMG_2936.jpg" alt="" />
            <h4 className="text-lg text-primary_light">EWOD Chip v2</h4>
          </NavLink>
        </Tab>
        <Tab id="designer" active={activeTab === 'designer'} className="grid grid-cols-3 gap-4">
          <NavLink to="" className="flex flex-col items-center">
            <img className="w-full aspect-square scale-95 hover:scale-100 transition-transform" src="/img/IMG_2941.jpg" alt="" />
            <h4 className="text-lg text-primary_light">EWOD Control System</h4>
          </NavLink>
          <NavLink to="" className="flex flex-col items-center">
            <img className="w-full aspect-square scale-95 hover:scale-100 transition-transform" src="/img/IMG_2943.jpg" alt="" />
            <h4 className="text-lg text-primary_light">EWOD Chip v1</h4>
          </NavLink>
          <NavLink to="" className="flex flex-col items-center">
            <img className="w-full aspect-square scale-95 hover:scale-100 transition-transform" src="/img/IMG_2936.jpg" alt="" />
            <h4 className="text-lg text-primary_light">EWOD Chip v2</h4>
          </NavLink>
        </Tab>
        <Tab id="favorites" active={activeTab === 'favorites'} className="grid grid-cols-3 gap-4">
          <NavLink to="" className="flex flex-col items-center">
            <img className="w-full aspect-square scale-95 hover:scale-100 transition-transform" src="/img/IMG_2941.jpg" alt="" />
            <h4 className="text-lg text-primary_light">EWOD Control System</h4>
          </NavLink>
          <NavLink to="" className="flex flex-col items-center">
            <img className="w-full aspect-square scale-95 hover:scale-100 transition-transform" src="/img/IMG_2943.jpg" alt="" />
            <h4 className="text-lg text-primary_light">EWOD Chip v1</h4>
          </NavLink>
          <NavLink to="" className="flex flex-col items-center">
            <img className="w-full aspect-square scale-95 hover:scale-100 transition-transform" src="/img/IMG_2936.jpg" alt="" />
            <h4 className="text-lg text-primary_light">EWOD Chip v2</h4>
          </NavLink>
        </Tab>
        <Tab id="ordered" active={activeTab === 'ordered'} className="grid grid-cols-3 gap-4">
          <NavLink to="" className="flex flex-col items-center">
            <img className="w-full aspect-square scale-95 hover:scale-100 transition-transform" src="/img/IMG_2943.jpg" alt="" />
            <h4 className="text-lg text-primary_light">EWOD Control System</h4>
          </NavLink>
          <NavLink to="" className="flex flex-col items-center">
            <img className="w-full aspect-square scale-95 hover:scale-100 transition-transform" src="/img/IMG_2941.jpg" alt="" />
            <h4 className="text-lg text-primary_light">EWOD Chip v1</h4>
          </NavLink>
          <NavLink to="" className="flex flex-col items-center">
            <img className="w-full aspect-square scale-95 hover:scale-100 transition-transform" src="/img/IMG_2936.jpg" alt="" />
            <h4 className="text-lg text-primary_light">EWOD Chip v2</h4>
          </NavLink>
        </Tab>
      </div>
    </div>
  );
}
export default Project;
function Tab({ active, children, id, className }: { active: boolean, children: React.ReactNode, id?: string, className?: string }) {
  return (
    <div id={id} className={`${!active && 'hidden'} ${className}`}>
      {children}
    </div>
  )
}