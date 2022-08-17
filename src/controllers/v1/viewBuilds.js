import models from '../../models';

const { AppBuild } = models;

const viewBuilds = async (req, res) => {
  try {
    const limit = 8;
    let page = 1;
    if (req.query.page) {
      page = req.query.page;
    }

    const offset = 0 + (page - 1) * limit;

    const appBuilds = await AppBuild.findAll(
      {
        offset: offset,
        limit: limit,
        order: [['createdAt', 'DESC']],
      },
      { raw: true }
    );

    const prCount = await AppBuild.count();

    res.render('./buildHistory', {
      page: 'build',
      appBuilds,
      offsetPage: page,
      lastPage: parseInt(Math.ceil(prCount / limit)),
    });
  } catch (error) {
    res.send(error);
  }
};

export default viewBuilds;
