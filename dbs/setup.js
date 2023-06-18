import { Sequelize } from "sequelize";
import config from './config/index.js'
let sequelize = null

const getInstance = ()=>{
  try {
    const { ENVIRONMENT } = process.env
  
    if (sequelize){
      console.log("returning instance already found...")
      return sequelize
    }
    console.log('initializing a new connection instance')
    sequelize = new Sequelize(config[ENVIRONMENT]);
    return sequelize
  } catch (error) {
    console.log("error connecting there..")
    throw error
  }
}

export {
  getInstance,
}