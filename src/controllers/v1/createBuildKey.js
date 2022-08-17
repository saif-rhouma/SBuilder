import models from '../../models';

const { BuildKey } = models;

const createBuildKey = async (req, res) => {
  try {
    const buildKey = await BuildKey.create({ ...req.body });
    res.status(200).json(buildKey);
  } catch (error) {
    res.status(500).json(error);
  }
};

export default createBuildKey;
