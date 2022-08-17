const viewHome = async (req, res) => {
  res.render('./index', { page: 'test' });
};

export default viewHome;
