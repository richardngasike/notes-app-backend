//Handles category CRUD
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const user_id = req.user.id;
    const { data, error } = await supabase
      .from('categories')
      .insert([{ user_id, name }])
      .select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user_id);
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const user_id = req.user.id;
    const { data, error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .eq('user_id', user_id)
      .select();
    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id);
    if (error) throw error;
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};