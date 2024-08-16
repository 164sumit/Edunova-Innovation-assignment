"use client";

import { Person } from '@/app/types';
import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const personSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  status: z.enum(['Active', 'Inactive']),
  role: z.string().min(1, 'Role is required'),
  email: z.string().email('Invalid email address'),
  teams: z.array(z.string()).min(1, 'At least one team is required'),
  username: z.string().min(1, 'Username is required'),
  phone: z.string().min(8, 'Phone is required'),
  avatar: z.string().min(1, 'Avatar is required'),
});

type PersonFormData = z.infer<typeof personSchema>;

interface PersonFormProps {
  initialData?: Person;
  onSubmit: (data: PersonFormData) => void;
  onCancel: () => void;
}

export default function EditProfile({ initialData, onSubmit, onCancel }: PersonFormProps) {
  const [profileImage, setProfileImage] = useState<string>(initialData?.avatar || 'https://placehold.co/100x100');
  const [availableTeams] = useState<string[]>(['Design', 'Product', 'Marketing', 'Finance', 'Sales', 'HR']);

  const { register, handleSubmit, control, setValue,getValues, formState: { errors } } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: initialData,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setProfileImage(event.target.result as string);
          setValue('avatar', event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleTeamRemove = (team: string) => {
    const updatedTeams = getValues('teams').filter(t => t !== team);
    setValue('teams', updatedTeams);
  };

  const onSubmitHandler: SubmitHandler<PersonFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <div className="absolute top-1 right-[10%] max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
      
      <div className="flex justify-center mb-6">
        <img 
          className="w-24 h-24 rounded-full object-cover" 
          src={profileImage} 
          alt="Profile" 
        />
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          id="change-photo" 
          onChange={handleImageChange} 
        />
        <label htmlFor="change-photo" className="px-4 py-2 bg-gray-200 rounded-md text-gray-600 cursor-pointer">
          Change Photo
        </label>
        <button 
          className="px-4 py-2 bg-gray-200 rounded-md text-gray-600"
          onClick={() => {
            setProfileImage('https://placehold.co/100x100');
            setValue('avatar', 'https://placehold.co/100x100');
          }}
        >
          Remove Photo
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
              {...register('name')}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
              {...register('email')}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              {...register('role')}
            >
              <option value="">Select a role</option>
              <option value="Product Designer">Product Designer</option>
              {/* Add more roles as needed */}
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              {...register('status')}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              {/* Add more statuses as needed */}
            </select>
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teams
          </label>
          <Controller
            name="teams"
            control={control}
            render={({ field }) => (
              <>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                  onChange={(e) => {
                    const team = e.target.value;
                    if (!field.value.includes(team)) {
                      field.onChange([...field.value, team]);
                    }
                  }}
                >
                  <option value="">Select a team</option>
                  {availableTeams.map((team) => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2">
                  {field.value.map((team: string) => (
                    <span 
                      key={team} 
                      className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm font-medium flex items-center"
                    >
                      {team}
                      <button 
                        className="ml-2 text-purple-700 hover:text-purple-900"
                        onClick={() => handleTeamRemove(team)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </>
            )}
          />
          {errors.teams && <p className="text-red-500 text-sm">{errors.teams.message}</p>}
        </div>

        <div className="flex justify-end gap-4">
          <button 
            type="button" 
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-600"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
