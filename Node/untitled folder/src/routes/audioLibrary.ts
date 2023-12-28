import express from 'express';
import AudioLibraryController from '../controllers/AudioLibraryController';

const router = express.Router();

router.get('/index', AudioLibraryController.index);
router.get('/indexPreviousMonth', AudioLibraryController.indexPreviousMonth);
router.get('/sharedAudioLibrary', AudioLibraryController.sharedAudioLibrary);
router.get('/sharedAudioLibraryPrevMonth', AudioLibraryController.sharedAudioLibraryPrevMonth);
router.put('/update', AudioLibraryController.update);
router.put('/addSharedAudio', AudioLibraryController.addSharedAudio);
router.delete('/removeSharedAudio/:Id', AudioLibraryController.removeSharedAudio);

router.delete('/destroy/:Id', AudioLibraryController.destroy);
router.get('/getAllUsers',AudioLibraryController.getAllUsers);
router.get('/getUser', AudioLibraryController.getUser);

export default router;
