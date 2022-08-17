import models from '../../models';

const { AppBuild } = models;

const getAllAppBuild = async (req, res) => {
  try {
    const appBuild = await AppBuild.findAll();
    res.status(200).json(appBuild);
  } catch (error) {
    res.status(500).json(error);
  }
};
export default getAllAppBuild;
