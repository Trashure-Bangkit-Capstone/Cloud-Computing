'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('orders', 
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jenis_sampah: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hargaPerKg: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      berat_sampah: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lokasi_pengepul: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lokasi_user: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      catatan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status_pemesanan: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Diproses',
        validate: {
          isIn: [['Diproses', 'Pengecekan', 'Selesai', 'Dibatalkan']],
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
