import Sequelize from 'sequelize'
import sequelize from '../database/connect.mjs';
import imports from './import.mjs';

const surveyResults = sequelize.define('survey_results', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    year: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
    import_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: imports,
            key: 'id'
        }
    },
    industry_code: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    industry_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    size_group: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    variable: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    value: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    unit: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    freezeTableName: true,
})

imports.hasMany(surveyResults, { foreignKey: 'import_id' });
surveyResults.belongsTo(imports, { foreignKey: 'import_id' });

export default surveyResults;