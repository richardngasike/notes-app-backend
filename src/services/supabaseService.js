//Supabase client and queries
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Initialize Supabase client
exports.supabase = supabase;

// Helper function to upload profile picture
exports.uploadProfilePicture = async (userId, file) => {
  try {
    const { data, error } = await supabase.storage
      .from('profile_pictures')
      .upload(`${userId}/${file.originalname}`, file.buffer);
    if (error) throw error;
    return supabase.storage.from('profile_pictures').getPublicUrl(`${userId}/${file.originalname}`).data.publicUrl;
  } catch (error) {
    throw new Error(`Failed to upload profile picture: ${error.message}`);
  }
};

// Helper function to get user profile
exports.getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, profile_picture_url')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
};