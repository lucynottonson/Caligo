'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfilePage() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); 
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true); 

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('User not found or error:', userError);
        setLoading(false);
        return;
      }

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

        // Get the current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData) {
          console.error('User not found or error:', userError);
          return;
        }

        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `public/${userData.id}/profile.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-photos') // Upload to the 'profile-photos' bucket
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          return;
        }

        const { data, error: publicUrlError } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(filePath);

        if (publicUrlError) {
          console.error('Error fetching public URL:', publicUrlError);
          return;
        }

        setAvatarUrl(data.publicUrl);
      };
      reader.readAsDataURL(selectedFile);
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

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username,
        bio,
        avatar_url: avatarUrl, // Store the avatar_url here
      });

    if (updateError) {
      console.error('Update error:', updateError);
    } else {
      console.log('Profile updated successfully');
      router.push('/first');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Profile"
            width={200}
            height={200}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '1rem',
            }}
          />
        ) : (
          <div
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              backgroundColor: '#ccc',
              marginBottom: '1rem',
            }}
          />
        )}
        <label>
          Profile Photo:
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </label>
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
        <button onClick={handleSave}>SAVE</button>
        <button onClick={() => router.push('/first')}>NO SAVE</button>
      </div>
    </div>
  );
}
