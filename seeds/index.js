const seedPosts = require('./post-seeds');

const sequelize =  require('../config/connection');

const seedALL = async () => {
    await sequelize.sync({ force: true });
    console.log('\n----- DATA SYNCED -----\n');
    await seedPosts();
    console.log('\n----- POSTS SEEDED -----\n');

    process.exit(0);
};

seedALL();