import models from '../../models';

const { AppBuild } = models;

const createAppBuild = async (req, res) => {
  try {
    const appBuild = await AppBuild.create({ ...req.body });
    res.status(200).json(appBuild);
  } catch (error) {
    res.status(500).json(error);
  }
};

export default createAppBuild;
