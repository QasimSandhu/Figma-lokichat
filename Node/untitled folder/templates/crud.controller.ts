import templateNameService from '../services/templateNameService';

import { templateNameShowRequest } from '../requests/templateName/templateNameShowRequest';
import { templateNameStoreRequest } from '../requests/templateName/templateNameStoreRequest';
import { templateNameUpdateRequest } from '../requests/templateName/templateNameUpdateRequest';
import { templateNameDestroyRequest } from '../requests/templateName/templateNameDestroyRequest';

import templateNameIndexResource from '../resources/templateName/templateNameIndexResource';
import templateNameShowResource from '../resources/templateName/templateNameShowResource';
import templateNameStoreResource from '../resources/templateName/templateNameStoreResource';
import templateNameUpdateResource from '../resources/templateName/templateNameUpdateResource';
import templateNameDestroyResource from '../resources/templateName/templateNameDestroyResource';

import { handleRequestValidation } from '../lib/helpers/requestHelper';


class templateNameController {
    async index(req, res) {
        try {
            const result = await templateNameService.index(req);
            return res.status(200).json(new templateNameIndexResource(result));
        } catch (error) {
            return res.status(500).json(new Error(error));
        }
    }
    async show(req, res) {
        return handleRequestValidation(req, res, templateNameShowRequest, templateNameService.show,templateNameShowResource);
    }

    async store(req, res) {
        return handleRequestValidation(req, res, templateNameStoreRequest, templateNameService.store,templateNameStoreResource);
    }

    async update(req, res) {
        return handleRequestValidation(req, res, templateNameUpdateRequest, templateNameService.update, templateNameUpdateResource);
    }

    async destroy(req, res) {
        return handleRequestValidation(req, res, templateNameDestroyRequest, templateNameService.destroy, templateNameDestroyResource);
    }
}

export default new templateNameController();