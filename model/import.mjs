import Sequelize from 'sequelize'
import sequelize from '../database/connect.mjs';

const imports = sequelize.define('imports', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: "pending",
        validate: {
            isIn: {
                args: [["pending", "in progress", "completed", "failed"]]  //0-false,1-true,2-in progress
            },
        },
    },
    error_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    error_messages: {
        type: Sequelize.TEXT,
        defaultValue: null
    }
}, {
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    freezeTableName: true,
})

export default imports;
