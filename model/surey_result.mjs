import Sequelize from 'sequelize'
import sequelize from '../database/connect.mjs';

const surveyResults = sequelize.define('survey_results', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    year: {
        type: Sequelize.TEXT,
        defaultValue: null,
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

export default surveyResults;