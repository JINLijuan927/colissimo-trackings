module.exports = function (app) {
  app.initData = async function(){
    // Sync to the database
    const connectionString = app.get('db');
    if(connectionString.includes('sqlite') /*|| !process.env.NODE_ENV*/){
      await app.sequelize.sync();

      const models = app.sequelize.models;

      await insertData(models.job, [
        {name: 'SimpleJob', status: 'PENDING'}
      ]);

      await insertData(models.tracking, [
        {id:'100001', trackingNumber:'250092801010711518',event:'DPD_CREATED',location:'921770,GENNEVILLIERS PFC',timestamp:'2018-08-09T20:08:00.000Z',description:'created'},
        {id:'100002', trackingNumber:'250077500028888465',event:'DPD_CREATED',location:'921770,GENNEVILLIERS PFC',timestamp:'2018-08-09T20:08:00.000Z',description:'created'},
        {id:'100003', trackingNumber:'6A15643179648',event:'DPD_CREATED',location:'921770,GENNEVILLIERS PFC',timestamp:'2018-08-09T20:08:00.000Z',description:'created'}
      ]);
    }
  };
};

async function insertData(model, data){
  if(process.env.mode === 'purge'){
    await model.destroy();
  }
  if(checkDataExist(model)){
    await model.bulkCreate(data);
  }
  return model.findAll();
}

async function checkDataExist(model) {
  const data = await model.findOne({});
  return !!data;
}
