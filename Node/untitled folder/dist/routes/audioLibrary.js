"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AudioLibraryController_1 = __importDefault(require("../controllers/AudioLibraryController"));
const router = express_1.default.Router();
router.get('/index', AudioLibraryController_1.default.index);
router.get('/indexPreviousMonth', AudioLibraryController_1.default.indexPreviousMonth);
router.get('/sharedAudioLibrary', AudioLibraryController_1.default.sharedAudioLibrary);
router.get('/sharedAudioLibraryPrevMonth', AudioLibraryController_1.default.sharedAudioLibraryPrevMonth);
router.put('/update', AudioLibraryController_1.default.update);
router.put('/addSharedAudio', AudioLibraryController_1.default.addSharedAudio);
router.delete('/removeSharedAudio/:Id', AudioLibraryController_1.default.removeSharedAudio);
router.delete('/destroy/:Id', AudioLibraryController_1.default.destroy);
router.get('/getAllUsers', AudioLibraryController_1.default.getAllUsers);
router.get('/getUser', AudioLibraryController_1.default.getUser);
exports.default = router;
//# sourceMappingURL=audioLibrary.js.map