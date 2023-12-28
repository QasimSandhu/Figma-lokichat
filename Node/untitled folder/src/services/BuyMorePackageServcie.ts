import BuyMore from "../models/BuyMore";

class BuyMoreService {

async store(req) {
    try {
        const { id, title, type, price, limit } = req.body;
        
        // If 'id' is provided, update the existing BuyMore record
        if (id) {
          const updatedBuyMore = await BuyMore.findByIdAndUpdate(
            id,
            { title, type, price, limit },
            { new: true }
          );
         return (updatedBuyMore);
        } else {
          // If 'id' is not provided, create a new BuyMore record
          const newBuyMore = new BuyMore({ title, type, price, limit });
          const savedBuyMore = await newBuyMore.save();
         return (savedBuyMore);
        }
      } catch (error) {
        throw new Error(
            'Error creating/updating BuyMore record'
          );
      }
    };
async index (req){
    try {
      const {type}=req.query
      
        const buyMoreRecords = await BuyMore.find({type:type});
        
       return (buyMoreRecords);
      } catch (error) {
        throw new Error(
            'error'
          );
      }
    
}
async indexById (req){
  try {
    const {id}=req.query
    
      const buyMoreRecords = await BuyMore.find({_id:id});
      
     return (buyMoreRecords);
    } catch (error) {
      throw new Error(
          'error'
        );
    }
  
}

}


export default new BuyMoreService();