import templateName from '../models/templateName';
import ObjectManipulator from '../lib/helpers/ObjectDestructurer';

import mongoose from 'mongoose';
export type TObjectId = mongoose.ObjectId;
export const ObjectId = mongoose.Types.ObjectId;

class templateNameService {
    async index(req) {
        const perPage = parseInt(req.query.per_page) || 10;
        const page = parseInt(req.query.page) || 1;

        const total = await templateName.countDocuments({});
        const records = await templateName.find({})
            .skip((page - 1) * perPage)
            .limit(perPage);

        return {
            data: records,
            current_page: page,
            per_page: perPage,
            total: total,
            last_page: Math.ceil(total / perPage)
        }
    }

    async store(req) {
        const data = req.body;
        const record = new templateName(data);
        await record.save();
        return {
            data: record
        };
    }

    async show(req) {
        const { id } = req.params;
        const record = await templateName.findById(id);
        if (!record) {
            return false;
        }
        return {
            data: record
        };
    }

    async update(req) {
        const { id } = req.params;
        const data = req.body;
        const result = await templateName.updateOne({ _id: new ObjectId(id) }, data);
        if (result.modifiedCount === 0) {
            return false;
        }
        return {
            data
        };
    }

    async destroy(req) {
        try {
            const { id } = req.params;
            const result = await templateName.deleteOne({ _id: new ObjectId(id) });
            if (result && result.deletedCount === 1) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}

export default new templateNameService();
