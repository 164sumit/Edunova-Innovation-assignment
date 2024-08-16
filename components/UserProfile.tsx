import { Person } from "@/app/types";
import { ArrowDownRightIcon } from "@heroicons/react/24/solid";
import { ArrowUpRightIcon } from "lucide-react";
import React from "react";
interface PersonDetailsProps {
  person: Person;
  onClose: () => void;
}
const UserProfile: React.FC<PersonDetailsProps> = ({ person, onClose }) => {
  return (
    <div className="bg-white rounded-md shadow-md  w-[50vw] h-[90%] absolute top-2 right-2 z-10">
      <button
        className="absolute top-2 right-2 text-3xl text-white hover:text-gray-700"
        onClick={onClose}
      >
        &times;
      </button>
      <div className="flex items-center w-full  p-4 bg-[#2A5B7E]">
        <img
          src="/Screenshot 2024-08-16 143556.png"
          alt="Profile"
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h2 className="text-xl font-semibold text-white">{person.name}</h2>
          <div className="grid grid-cols-3  justify-start   text-white text-sm">
            <div className="flex flex-col">
              <span className="">{person.username}</span>
              <span className="">User ID</span>
            </div>
            <div className="flex items-center justify-center">
  <div className="h-full w-px bg-gray-300"></div>
</div>
            <div className="ml-2  flex flex-col">
              <span>{person.role}</span>
              <span>Role</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6 p-4">
        <h3 className="text-lg  p-2 mb-2 bg-[#EFF5FA] rounded-md text-[#334155] font-bold">
          Personal Information
        </h3>
        <div className="pl-6 pr-6 grid grid-cols-2 gap-2 divide-y">
          <span className="font-medium text-gray-700">Date of Birth</span>
          <div>
            <span className="text-gray-600">29-04-2005</span>
          </div>
          <span className="font-medium text-gray-700">Gender</span>
          <div>
            <span className="text-gray-600">Female</span>
          </div>
          <span className="font-medium text-gray-700">Nationality</span>
          <div>
            <span className="text-gray-600">Canadian</span>
          </div>
          <span className="font-medium text-gray-700">Contact no.</span>
          <div>
            <span className="text-gray-600">1234567890</span>
          </div>
          <span className="font-medium text-gray-700">E-mail Address</span>
          <div>
            <span className="text-gray-600">Oliviadesign@gmail.com</span>
          </div>
          <span className="font-medium text-gray-700">Work email Address</span>
          <div>
            <span className="text-gray-600">Oliviadesign@gmail.com</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="ext-lg  p-2 mb-2 bg-[#EFF5FA] rounded-md text-[#334155] font-bold">
          Research & Publication
        </h3>
        <div className="border border-gray-300 rounded-md p-4">
          <h4 className="text-base font-semibold mb-2">
            AI and User Experience: The Future of Design
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            Published in the Journal of Modern Design • 2022
          </p>
          <p className="text-sm text-gray-600 mb-4">
            AI, IoT based real time condition monitoring of Electrical Machines
            using Python language Abstract: Maintaining induction motors in good
            working order before they fail benefits small{" "}
            <a href="#" className="text-blue-500">
              See More...
            </a>
          </p>
          <div className="flex gap-2 items-center text-red-500 px-4 py-2 rounded-md">
            <ArrowUpRightIcon />
            <button className="  text-red-500  rounded-md">
              SEE PUBLICATION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
