//Handles signup, login
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.signup = [
  upload.single('profile_picture'),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const file = req.file;

      // Sign up user
      const { data: user, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      // Upload profile picture
      let profilePictureUrl = null;
      if (file) {
        const { data, error: uploadError } = await supabase.storage
          .from('profile_pictures')
          .upload(`${user.user.id}/${file.originalname}`, file.buffer);
        if (uploadError) throw uploadError;
        profilePictureUrl = supabase.storage.from('profile_pictures').getPublicUrl(`${user.user.id}/${file.originalname}`).data.publicUrl;
      }

      // Save user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([{ id: user.user.id, email, profile_picture_url: profilePictureUrl }]);
      if (profileError) throw profileError;

      res.status(200).json({ user: user.user, profilePictureUrl });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
];

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    res.status(200).json({ user: data.user, session: data.session });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('users')
      .select('id, email, profile_picture_url')
      .eq('id', userId)
      .single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};