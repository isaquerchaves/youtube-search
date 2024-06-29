import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'aws-0-us-east-1.pooler.supabase.com',
    port: 6543,
    username: 'postgres.xvcfjwuurfvsmfshtmse',
    password: 'M9a&iSRKp2?sa5!',
    database: 'postgres',
    ssl: true,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

export default sequelize;
