import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class AppBuild extends Model {
    static associate(models) {
      AppBuild.BuildKeys = AppBuild.hasMany(models.BuildKey);
    }
  }
  AppBuild.init(
    {
      logo: {
        type: DataTypes.STRING,
      },
      title: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      type: {
        type: DataTypes.STRING,
      },
      gitbranch: {
        type: DataTypes.STRING,
      },
      versionType: {
        type: DataTypes.STRING,
      },
      versionName: {
        type: DataTypes.STRING,
      },
      versionNumber: {
        type: DataTypes.STRING,
      },
      buildName: {
        type: DataTypes.STRING,
      },
      buildNumber: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'AppBuild',
    }
  );
  return AppBuild;
};
