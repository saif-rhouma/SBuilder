import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class BuildKey extends Model {
    static associate(models) {
      BuildKey.belongsTo(models['AppBuild']);
    }
  }
  BuildKey.init(
    {
      buildKey: {
        type: DataTypes.STRING,
      },
      buildNumber: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'BuildKey',
    }
  );
  return BuildKey;
};
