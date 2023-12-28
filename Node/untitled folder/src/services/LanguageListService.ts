import LanguageList from "../models/Languages";

class LanguageListService {
  constructor() {
    // this.store = this.store.bind(this);
    this.index = this.index.bind(this);
  }
  // async store() {
  //   const result = await insertVoicesListData();
  //   return result;
  // }

  async index() {
    let voiceLists: any = await LanguageList.find({});
    return voiceLists;
  }
}

export default new LanguageListService();
