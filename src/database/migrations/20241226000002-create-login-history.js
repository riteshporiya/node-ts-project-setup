'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('login_history', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Add index on user_id for faster lookups
        await queryInterface.addIndex('login_history', ['user_id'], {
            name: 'idx_login_history_user_id',
        });

        // Add index on created_at for reporting
        await queryInterface.addIndex('login_history', ['created_at'], {
            name: 'idx_login_history_created_at',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('login_history');
    },
};
