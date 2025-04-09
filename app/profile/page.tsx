'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // Store the avatar URL
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('User not found or error:', userError);
        return;
      }

      // Fetch the profile data from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, bio, avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      // Set the fetched data in the state
      setUsername(profileData?.username || '');
      setBio(profileData?.bio || '');
      setAvatarUrl(profileData?.avatar_url || null);
    };

    fetchUserProfile();
  }, []); // Only run this once when the component mounts

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('User not found or error:', userError);
      return;
    }

    let photoUrl = avatarUrl; // Keep the existing photo URL if no new photo is selected

    if (profilePhoto) {
      const fileExt = profilePhoto.name.split('.').pop();
      const filePath = `public/${user.id}/profile.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, profilePhoto, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
      } else {
        const { data } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(filePath);
        photoUrl = data.publicUrl;
      }
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username,
        bio,
        avatar_url: photoUrl,
      });

    if (updateError) {
      console.error('Update error:', updateError);
    } else {
      console.log('Profile updated successfully');
      router.push('/first');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Profile</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Profile Photo:
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </label>
        {profilePhoto && <p>Selected: {profilePhoto.name}</p>}
        {avatarUrl && !profilePhoto && <p>Current Profile Photo: <img src={avatarUrl} alt="Current Profile" style={{ width: '100px' }} /></p>}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ display: 'block', marginTop: '0.5rem' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Bio:
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ display: 'block', marginTop: '0.5rem', width: '100%', height: '100px' }}
          />
        </label>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={handleSave}>Save Profile</button>
        <button onClick={() => router.push('/first')}>Cancel</button>
      </div>
    </div>
  );
}
