// src/models/Favorite.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize';

class Favorite extends Model {
    public _id!: string;
    public id!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Favorite.init(
    {
        _id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'createdat',
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'updatedat',
        },
    },
    {
        sequelize,
        tableName: 'favorite',
    }
);

export default Favorite;
