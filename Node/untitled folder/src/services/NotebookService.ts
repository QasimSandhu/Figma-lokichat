import Debate from "../models/Debate";
import ChatGpt from "../models/Chat";
import Notebook from "../models/Notebook";
import DocumentSummarization from "../classes/DocumentSummarization";

class NotebookService {

  async store(req) {
    const { body, userId } = req;
    
    let { chatId, debateId, response, messageId } = body;

    if(!chatId && !debateId) {
      throw new Error('Required body params are missing');
    }

    const liveNotebook = new Notebook({
      user: userId,
      chat: chatId ?? null,
      debate: debateId,
      response,
      messageId,
    });

    if (chatId) {
      await ChatGpt.findOneAndUpdate(
        {
          _id: chatId,
          user: userId,
          "messages.messageId": messageId,
        },
        { $set: { "messages.$.addedInNotebook": true } },
        { new: true }
      );
      await liveNotebook.save();
    } else if (debateId) {
      await Debate.findOneAndUpdate(
        {
          _id: debateId,
          user: userId,
          "messages._id": messageId,
        },
        { $set: { "messages.$.addedInNotebook": true } },
        { new: true }
      );
    }

    await liveNotebook.save();
    return liveNotebook;
  }

  async index(req) {
    const { userId, body } = req;
    const { chatId, debateId } = body;
    if(!chatId && !debateId) throw new Error('Required body param is missing');
    
    if(chatId) {
      const liveNotebooks = await Notebook.find({ user: userId, chat: chatId });
      liveNotebooks.sort((a, b) => b.createdAt - a.createdAt);
      return liveNotebooks;
    } else if(debateId) {
      const liveNotebooks = await Notebook.find({ user: userId, debate: debateId });
      liveNotebooks.sort((a, b) => b.createdAt - a.createdAt);
      return liveNotebooks;
    }
  }

  async destroy(req) {
    const { params, userId } = req;
    const { notebookId } = params;

    if (!notebookId)
      throw new Error("notebookId is required to delete the notebook document");

    const deletedNotebook = await Notebook.findByIdAndDelete(notebookId);

    if (!deletedNotebook)
      throw new Error("No Notebook document found with this id.");

      if(deletedNotebook.chat) {
        await ChatGpt.findOneAndUpdate(
          {
            _id: deletedNotebook.chat,
            user: userId,
            "messages.messageId": deletedNotebook.messageId,
          },
          { $set: { "messages.$.addedInNotebook": false } },
          { new: true }
        );
      } else if (deletedNotebook.debate) {
        await Debate.findOneAndUpdate(
          {
            _id: deletedNotebook.debate,
            user: userId,
            "messages._id": deletedNotebook.messageId,
          },
          { $set: { "messages.$.addedInNotebook": false } },
          { new: true }
        );
      }


    return { _id: deletedNotebook._id };
  }

  async destroyByUserId(req) {
    const { userId, body } = req;
    const { chatId, debateId } = body;
  
    let deletedNotebooks;
    if(chatId) {
    deletedNotebooks = await Notebook.deleteMany({ user: userId, chat: chatId });
    await ChatGpt.updateMany(
      {_id: chatId, user: userId},
      {$set: { "messages.$[].addedInNotebook": false }},
      { new: true }
    );
  } else if (debateId) {
      deletedNotebooks = await Notebook.deleteMany({ user: userId, debate: debateId });

    await Debate.updateMany(
      {_id: chatId, user: userId},
      {$set: { "messages.$[].addedInNotebook": false }},
      { new: true }
    );
  }

    return { deletedNotebooks };
  }

  async update(req) {
    const { body } = req;
    const { notebookId, response } = body;

    const liveNotebook = await Notebook.findByIdAndUpdate(
      notebookId,
      { response },
      { new: true }
    );

    return {
      _id: liveNotebook._id,
      message: liveNotebook.message,
      response: liveNotebook.response,
      createdAt: liveNotebook.createdAt,
    };
  }
  async generateTextFromPdf(req) {
   
    
    const { file } = req;
    try {
      const text = await DocumentSummarization.getFileText(file)
   
      

   return text
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default new NotebookService();
