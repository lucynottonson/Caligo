'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/navbar'; 

export default function ProfilePage() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData) {
        console.error('User not found or error:', userError);
        setLoading(false);
        return;
      }

      const user = userData.user;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, bio, avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setLoading(false);
        return;
      }

      setUsername(profileData?.username || '');
      setBio(profileData?.bio || '');
      setAvatarUrl(profileData?.avatar_url || null);
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      const reader = new FileReader();
      reader.onloadend = async () => {
        setAvatarUrl(reader.result as string);

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData) {
          console.error('User not found or error:', userError);
          return;
        }

        const user = userData.user;
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `public/${user.id}/profile.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          return;
        }

        const { data } = supabase.storage.from('profile-photos').getPublicUrl(filePath);

        if (!data) {
          console.error('Error fetching public URL: File not found');
          return;
        }

        setAvatarUrl(data.publicUrl);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSave = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData) {
      console.error('User not found or error:', userError);
      return;
    }

    const user = userData.user;

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username,
        bio,
        avatar_url: avatarUrl,
      });

    if (updateError) {
      console.error('Update error:', updateError);
    } else {
      console.log('Profile updated successfully');
      router.push('/first');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      <Navbar />
      <div className="flex justify-center items-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex flex-col items-center">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Profile"
                width={200}
                height={200}
                className="rounded-full mb-4"
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-gray-300 mb-4 flex justify-center items-center">
                <span className="text-2xl text-white">No Image</span>
              </div>
            )}
            <label htmlFor="photo" className="text-blue-600 cursor-pointer hover:underline">
              Change Profile Photo
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="block mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              rows={4}
            />
          </div>

          <div className="flex justify-between gap-4">
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Save Profile
            </button>
            <button
              onClick={() => router.push('/first')}
              className="w-full bg-gray-300 text-black p-3 rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
