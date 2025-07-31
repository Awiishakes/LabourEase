import mongoose from 'mongoose'


export const dbConnection = () =>{
    mongoose.connect(process.env.DB_URI, {
        dbName: 'LabourEase'
    }).then(()=>{
        console.log('Database is connected')
    }).catch((err)=>{
        console.log("object")
        console.log(`Some error occured while connecting Database: ${err}`)
    })
}