//Handles note CRUD
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.createNote = async (req, res) => {
  try {
    const { title, content, category_id } = req.body;
    const user_id = req.user.id; // From auth middleware
    const { data, error } = await supabase
      .from('notes')
      .insert([{ user_id, title, content, category_id }])
      .select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { search } = req.query;
    let query = supabase.from('notes').select('*').eq('user_id', user_id);
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category_id } = req.body;
    const user_id = req.user.id;
    const { data, error } = await supabase
      .from('notes')
      .update({ title, content, category_id, updated_at: new Date() })
      .eq('id', id)
      .eq('user_id', user_id)
      .select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id);
    if (error) throw error;
    res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};